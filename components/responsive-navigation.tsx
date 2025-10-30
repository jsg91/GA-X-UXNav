import { usePathname, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, StatusBar, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input, ScrollView, View, XStack, YStack } from 'tamagui';

import { ProfileMenu } from '@/components/profile-menu';
import { RoleSwitcher } from '@/components/role-switcher';
import { SidebarNavigation } from '@/components/sidebar-navigation';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { NotificationBadge } from '@/components/ui/notification-badge';
import { SearchBar } from '@/components/ui/search-bar';
import { ANIMATION_DELAYS } from '@/constants/animation-delays';
import { AI_MODAL_DIMENSIONS, HEADER_HEIGHT, ICON_SIZES, SIDEBAR_BREAKPOINT } from '@/constants/layout';
import { EntityName, getEntityNameForRoute, getPageInfoForEntity, getPageInfoFromNavConfig, NAVIGATION_CONFIG, Role } from '@/constants/NAVIGATION';
import { OPACITY } from '@/constants/opacity';
import { REFOCUS_DELAYS } from '@/constants/refocus-delays';
import { AI_MODAL_SHADOW, BOTTOM_NAV_SHADOW } from '@/constants/shadow-styles';
import { Z_INDEX } from '@/constants/z-index';
import { refocusInput as refocusInputUtil, useAutoFocus } from '@/hooks/use-auto-focus';
import { useNavigationHotkeys } from '@/hooks/use-navigation-hotkeys';
import { useNavigationItems } from '@/hooks/use-navigation-items';
import { useRoleContext } from '@/hooks/use-role-context';
import { useThemeContext } from '@/hooks/use-theme-context';
import { stopPropagation } from '@/utils/event-handlers';
import { getIconColor } from '@/utils/icons';
import { INTERACTIVE_COLORS } from '@/utils/interactive-colors';
import { getItemHref, isTabActive } from '@/utils/navigation';
import { isBrowserEnvironment, isWeb } from '@/utils/platform';
import { navigateTo } from '@/utils/router';
import { createCloseHandler, createToggleHandler } from '@/utils/state-helpers';

interface ResponsiveNavigationProps {
  children: React.ReactNode;
}

export function ResponsiveNavigation({ children }: ResponsiveNavigationProps) {
  const { resolvedTheme } = useThemeContext();
  const { currentRole, setCurrentRole } = useRoleContext();
  const router = useRouter();
  const pathname = usePathname();
  const { width, height } = useWindowDimensions();
  const [notificationCount] = useState(3); // Mock notification count
  const [messageCount] = useState(2); // Mock message count
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  // Initialize dimensionsReady as true for mobile platforms to ensure bottom nav shows immediately
  const [dimensionsReady, setDimensionsReady] = useState(!isWeb);
  const [hasMeasuredDimensions, setHasMeasuredDimensions] = useState(false);
  const [showHelpOverlay, setShowHelpOverlay] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiMessageInput, setAIMessageInput] = useState('');
  const [aiMessages, setAIMessages] = useState<{ id: string; text: string; sender: 'user' | 'ai'; timestamp: Date }[]>([
    {
      id: 'welcome',
      text: "Hello! I'm the GA-X AI Assistant. I can help you with:",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const aiInputRef = useRef<any>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollViewRef.current && aiMessages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, ANIMATION_DELAYS.standard);
    }
  }, [aiMessages]);

  // Auto-focus input when AI modal opens using shared hook
  useAutoFocus(aiInputRef, isAIModalOpen, {
    selector: 'input[placeholder*="Type your message"]',
    clickOnFocus: true,
  });

  // Set viewport meta tag for mobile web
  useEffect(() => {
    if (isBrowserEnvironment()) {
      // Set viewport meta tag
      let viewportMeta = document.querySelector('meta[name="viewport"]');
      if (!viewportMeta) {
        viewportMeta = document.createElement('meta');
        viewportMeta.setAttribute('name', 'viewport');
        document.head.appendChild(viewportMeta);
      }
      viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
  }, []);

  // Track keyboard height for mobile web (iOS Safari) - moved after showSidebar is computed

  // Update document title based on current page
  useEffect(() => {
    if (isBrowserEnvironment()) {
      let pageTitle = 'GA-X';
      
      if (pathname === '/') {
        pageTitle = 'Dashboard | GA-X';
      } else {
        // Extract route name from pathname (e.g., '/logbook' -> 'logbook')
        const routeName = pathname.replace('/(tabs)/', '').replace('/', '') || 'dashboard';
        
        // Try to get page info from NAVIGATION_CONFIG first
        const navConfigInfo = getPageInfoFromNavConfig(routeName);
        if (navConfigInfo) {
          pageTitle = `${navConfigInfo.title} | GA-X`;
        } else {
          // Try to get from entity routes using derived mapping
          const entityName = getEntityNameForRoute(routeName);
          const pageInfo = getPageInfoForEntity(entityName as EntityName, currentRole);
          pageTitle = `${pageInfo.title} | GA-X`;
        }
      }
      
      document.title = pageTitle;
    }
  }, [pathname, currentRole]);

  // Handle initial responsive detection - useWindowDimensions automatically handles dimension changes
  useEffect(() => {
    // On web, assume large screen initially to prevent bottom nav flash
    if (isWeb) {
      setDimensionsReady(true);
    } else {
      // On mobile, wait for actual dimensions
      setDimensionsReady(true);
    }

    // Mark dimensions as measured once we have a width > 0
    // useWindowDimensions hook automatically triggers re-renders on dimension changes
    if (width > 0 && !hasMeasuredDimensions) {
      setHasMeasuredDimensions(true);
    }
  }, [width, hasMeasuredDimensions]);

  // Determine if we should show sidebar (large screens) or bottom nav (small screens)
  // Only show sidebar on desktop web browsers - never on mobile/webview platforms like Expo Go
  // Check for touch capability and viewport size to distinguish mobile from desktop
  const hasTouchCapability = isWeb && typeof window !== 'undefined' && 'ontouchstart' in window;
  const isSmallViewport = height < 600; // Mobile devices typically have smaller height

  const isMobilePlatform = !isWeb || hasTouchCapability || isSmallViewport;

  const showSidebar = !isMobilePlatform && width >= SIDEBAR_BREAKPOINT && hasMeasuredDimensions;

  // Reserve sidebar space only on desktop to prevent layout shift
  const shouldReserveSidebarSpace = showSidebar;

  // Debug logging for development
  if (__DEV__) {
    console.log('ResponsiveNavigation Debug:', {
      platform: isWeb ? 'web' : 'mobile',
      width,
      height,
      dimensionsReady,
      showSidebar,
      hasTouchCapability,
      isSmallViewport,
      isMobilePlatform,
      shouldShowBottomNav: dimensionsReady && !showSidebar,
      SIDEBAR_BREAKPOINT
    });
  }

  const handleNotificationPress = () => {
    navigateTo('/(tabs)/notifications');
  };

  const handleMessagePress = () => {
    navigateTo('/(tabs)/messages');
  };

  const handleTabPress = (href: string) => {
    navigateTo(href);
  };

  const handleRoleChange = (role: Role) => {
    setCurrentRole(role);
    // Navigation will automatically update via useMemo in SidebarNavigation
  };

  const handleSearch = (query: string) => {
    // TODO: Implement global search functionality
    // Could search across aircraft, aerodromes, documents, etc.
  };

  const handleSearchResultSelect = (result: any) => {
    if (result.href) {
      navigateTo(result.href);
    }
  };

  const handleSendMessage = () => {
    if (!aiMessageInput.trim()) return;

    setIsSendingMessage(true);

    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      text: aiMessageInput.trim(),
      sender: 'user' as const,
      timestamp: new Date(),
    };

    setAIMessages((prev) => [...prev, userMessage]);
    setAIMessageInput('');

    // Keep keyboard open by aggressively refocusing input after sending
    // Use shared utility function for consistent refocus behavior
    refocusInputUtil(aiInputRef, 'input[placeholder*="Type your message"]', [...REFOCUS_DELAYS]);
    
    // Set sending state to false after delay
    setTimeout(() => {
      setIsSendingMessage(false);
    }, ANIMATION_DELAYS.medium);

    // Simulate AI response (you can replace this with actual API call)
    setTimeout(() => {
      const aiResponse = {
        id: `ai-${Date.now()}`,
        text: "Thank you for your message! I'm currently in development and will be able to assist you with aviation operations soon. How can I help you today?",
        sender: 'ai' as const,
        timestamp: new Date(),
      };
      setAIMessages((prev) => [...prev, aiResponse]);
      // Refocus again after AI response
      refocusInputUtil(aiInputRef, 'input[placeholder*="Type your message"]');
    }, ANIMATION_DELAYS.async);
  };

  // Hotkey handlers
  const handleFocusSearch = () => {
    // Focus the search bar in header if available
    if (isWeb && dimensionsReady && showSidebar) {
      if (typeof document !== 'undefined' && typeof document.querySelector === 'function') {
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          searchInput.select(); // Select all text for easy replacement
        }
      }
    }
  };

  const handleToggleAI = createToggleHandler(setIsAIModalOpen);

  const handleCloseModals = () => {
    setShowHelpOverlay(false);
    setIsAIModalOpen(false);
    setSidebarExpanded(false);
    // Close any other modals/dropdowns
  };

  // Initialize navigation hotkeys (after handlers are defined)
  console.log('ResponsiveNavigation: Initializing hotkeys');
  useNavigationHotkeys({
    onToggleAI: handleToggleAI,
    onFocusSearch: handleFocusSearch,
    onCloseModals: handleCloseModals,
  });
  console.log('ResponsiveNavigation: Hotkeys initialized');

  // Generate navigation items for bottom nav based on current role
  const bottomNavItems = useNavigationItems(currentRole, { forLargeScreen: false });

  // Get current tab index based on pathname and screen size
  const getCurrentTabIndex = () => {
    const currentIndex = bottomNavItems.findIndex(item => {
      return isTabActive(getItemHref(item), pathname);
    });
    return currentIndex >= 0 ? currentIndex : 0;
  };

  // Track keyboard height for mobile web (iOS Safari)
  // Use useWindowDimensions hook for dimension changes - it automatically re-renders
  useEffect(() => {
    if (isWeb && typeof window !== 'undefined' && !showSidebar && isAIModalOpen) {
      // Check if we're in a real browser environment with addEventListener support
      const hasAddEventListener = typeof window.addEventListener === 'function';
      const hasVisualViewport = typeof window.visualViewport !== 'undefined' 
        && window.visualViewport 
        && typeof window.visualViewport.addEventListener === 'function';
      
      if (!hasAddEventListener) {
        // Not a browser environment (e.g., Expo Go), reset keyboard height
        setKeyboardHeight(0);
        return;
      }

      let initialViewportHeight = hasVisualViewport 
        ? (window.visualViewport?.height || window.innerHeight)
        : window.innerHeight;
      
      const updateKeyboardHeight = () => {
        try {
          if (hasVisualViewport && window.visualViewport) {
            // Visual Viewport API - more accurate
            const currentViewportHeight = window.visualViewport.height;
            const screenHeight = window.innerHeight;
            
            // Update initial height if viewport expanded (keyboard closed)
            if (currentViewportHeight > initialViewportHeight) {
              initialViewportHeight = currentViewportHeight;
            }
            
            // Calculate keyboard height as difference between screen and viewport
            const kbHeight = screenHeight - currentViewportHeight;
            
            // Consider keyboard open if difference is significant (>150px to avoid false positives)
            if (kbHeight > 150) {
              setKeyboardHeight(kbHeight);
            } else {
              setKeyboardHeight(0);
              // Reset initial height when keyboard closes
              initialViewportHeight = currentViewportHeight;
            }
          } else {
            // Fallback: detect keyboard by comparing window heights
            const currentHeight = window.innerHeight;
            // Update initial height if it increased (keyboard closed or orientation change)
            if (currentHeight > initialViewportHeight) {
              initialViewportHeight = currentHeight;
            }
            const heightDiff = initialViewportHeight - currentHeight;
            // Only consider it a keyboard if the difference is significant (>150px)
            if (heightDiff > 150) {
              setKeyboardHeight(heightDiff);
            } else {
              setKeyboardHeight(0);
            }
          }
        } catch (error) {
          if (__DEV__) {
            console.warn('Failed to update keyboard height:', error);
          }
        }
      };

      // Initial calculation
      updateKeyboardHeight();

      // Listen to Visual Viewport changes (most accurate) - only if available
      if (hasVisualViewport && window.visualViewport) {
        try {
          window.visualViewport.addEventListener('resize', updateKeyboardHeight);
          window.visualViewport.addEventListener('scroll', updateKeyboardHeight);
        } catch (error) {
          if (__DEV__) {
            console.warn('Failed to add visual viewport listeners:', error);
          }
        }
      }

      // Fallback: listen to window resize - only if addEventListener is available
      if (hasAddEventListener) {
        try {
          window.addEventListener('resize', updateKeyboardHeight);
        } catch (error) {
          if (__DEV__) {
            console.warn('Failed to add resize listener:', error);
          }
        }
      }

      return () => {
        // Cleanup - only remove listeners if they were successfully added
        if (hasVisualViewport && window.visualViewport) {
          try {
            if (typeof window.visualViewport.removeEventListener === 'function') {
              window.visualViewport.removeEventListener('resize', updateKeyboardHeight);
              window.visualViewport.removeEventListener('scroll', updateKeyboardHeight);
            }
          } catch (error) {
            // Silently fail cleanup
          }
        }
        if (hasAddEventListener && typeof window.removeEventListener === 'function') {
          try {
            window.removeEventListener('resize', updateKeyboardHeight);
          } catch (error) {
            // Silently fail cleanup
          }
        }
      };
    } else {
      // Reset keyboard height when modal closes or sidebar is shown
      setKeyboardHeight(0);
    }
  }, [isAIModalOpen, showSidebar, height]); // Include height dependency to react to dimension changes

  // Calculate AI modal positioning based on keyboard state
  const aiModalBottom = useMemo(() => {
    if (showSidebar) return 100;
    if (keyboardHeight > 0) return keyboardHeight + 10;
    // Account for bottom nav bar on mobile (keep consistent position when keyboard closed)
    return !showSidebar && isWeb ? 80 : 140;
  }, [showSidebar, keyboardHeight]);

  const aiModalTop = useMemo(() => {
    if (showSidebar) return undefined;
    // Only set top when keyboard is closed, use bottom positioning when keyboard is open
    return keyboardHeight > 0 ? undefined : HEADER_HEIGHT + 10;
  }, [showSidebar, keyboardHeight]);

  const aiModalMaxHeight = useMemo(() => {
    if (showSidebar) return "80vh";
    if (keyboardHeight > 0 && isBrowserEnvironment()) {
      // Use visual viewport height when keyboard is open
      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      // Calculate max height: viewport height minus header minus bottom position
      // bottom position is keyboardHeight + 10, so we need to account for that
      const availableHeight = viewportHeight - HEADER_HEIGHT - (keyboardHeight + 10) - 10;
      return `${Math.max(AI_MODAL_DIMENSIONS.minAvailableHeight, availableHeight)}px`;
    }
    // Without keyboard, use window height minus header and bottom nav
    const bottomNavHeight = !showSidebar ? 68 : 0;
    return `${Math.max(AI_MODAL_DIMENSIONS.minAvailableHeight, height - HEADER_HEIGHT - bottomNavHeight - 20)}px`;
  }, [showSidebar, keyboardHeight, height]);

  const aiModalMinHeight = useMemo(() => {
    if (showSidebar) return AI_MODAL_DIMENSIONS.minHeight;
    // Reduce minHeight when keyboard is open to prevent modal from being pushed up
    if (keyboardHeight > 0) return AI_MODAL_DIMENSIONS.minHeightKeyboard;
    return AI_MODAL_DIMENSIONS.minHeight;
  }, [showSidebar, keyboardHeight]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        backgroundColor="transparent"
        barStyle={resolvedTheme === 'dark' ? 'light-content' : 'dark-content'}
      />

      {/* CSS for animated glow effect */}
      {isWeb && typeof document !== 'undefined' && (
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes glow {
            0% {
              box-shadow: 0 0 15px rgba(0, 122, 255, 0.5), 0 0 30px rgba(0, 122, 255, 0.3), 0 0 45px rgba(0, 122, 255, 0.2);
            }
            100% {
              box-shadow: 0 0 25px rgba(0, 122, 255, 0.7), 0 0 50px rgba(0, 122, 255, 0.5), 0 0 75px rgba(0, 122, 255, 0.3);
            }
          }
        ` }} />
      )}

      {/* Help Overlay */}
      {showHelpOverlay && (
        <View
          alignItems="center"
          backgroundColor={INTERACTIVE_COLORS.modalOverlay}
          bottom={0}
          justifyContent="center"
          left={0}
          position="absolute"
          right={0}
          top={0}
          zIndex={Z_INDEX.aiModalOverlay}
        >
          <View
            backgroundColor="$background"
            borderRadius="$4"
            margin="$4"
            maxWidth={400}
            padding="$6"
            {...AI_MODAL_SHADOW}
          >
            <ThemedText marginBottom="$4" textAlign="center" type="title">
              Keyboard Shortcuts
            </ThemedText>

            <YStack gap="$3" marginBottom="$4">
              {Object.entries((NAVIGATION_CONFIG as any).hotkeys?.navigation || {}).map(([key, config]: [string, any]) => (
                <XStack key={key} alignItems="center" justifyContent="space-between">
                  <ThemedText color="$color">{config?.description}</ThemedText>
                  <ThemedText style={{ fontFamily: 'monospace' }} backgroundColor="$background" borderRadius="$2" fontSize="$2" paddingHorizontal="$2" paddingVertical="$1">
                    {config?.keys?.toUpperCase()}
                  </ThemedText>
                </XStack>
              ))}

              {Object.entries((NAVIGATION_CONFIG as any).hotkeys?.actions || {}).map(([key, config]: [string, any]) => (
                <XStack key={key} alignItems="center" justifyContent="space-between">
                  <ThemedText color="$color">{config?.description}</ThemedText>
                  <ThemedText style={{ fontFamily: 'monospace' }} backgroundColor="$background" borderRadius="$2" fontSize="$2" paddingHorizontal="$2" paddingVertical="$1">
                    {config?.keys?.toUpperCase()}
                  </ThemedText>
                </XStack>
              ))}
            </YStack>

            <Button onPress={() => setShowHelpOverlay(false)} alignSelf="center">
              <ThemedText>Close</ThemedText>
            </Button>
          </View>
        </View>
      )}

      {/* AI Assistant Modal */}
      {isAIModalOpen && (
        <Modal
          onRequestClose={createCloseHandler(setIsAIModalOpen)}
          animationType="fade"
          transparent={true}
          visible={isAIModalOpen}
        >
          <View
            onPress={createCloseHandler(setIsAIModalOpen)}
            alignItems={isWeb ? "flex-start" : "center"}
            backgroundColor={INTERACTIVE_COLORS.modalOverlay}
            bottom={0}
            flex={1}
            justifyContent={isWeb ? "flex-end" : "center"}
            left={0}
            position="absolute"
            right={0}
            top={0}
            zIndex={Z_INDEX.aiModalOverlay}
          >
            <View
              style={{
                transition: 'bottom 0.3s ease-out, top 0.3s ease-out, max-height 0.3s ease-out',
              }}
              onPress={stopPropagation}
              backgroundColor="$backgroundSecondary"
              borderColor={resolvedTheme === 'dark' ? '#333333' : undefined}
              borderWidth={resolvedTheme === 'dark' ? '$0.5' : 0}
              borderRadius={showSidebar ? "$5" : "$4"}
              bottom={aiModalBottom}
              left={showSidebar ? 100 : 5}
              maxHeight={aiModalMaxHeight}
              maxWidth={showSidebar ? AI_MODAL_DIMENSIONS.maxWidthSidebar : undefined}
              minHeight={aiModalMinHeight}
              minWidth={showSidebar ? AI_MODAL_DIMENSIONS.minWidthSidebar : undefined}
              padding={showSidebar ? "$6" : "$4"}
              position="absolute"
              right={showSidebar ? undefined : 5}
              shadowColor={resolvedTheme === 'dark' ? 'rgba(0, 0, 0, 0.5)' : AI_MODAL_SHADOW.shadowColor}
              shadowOffset={{ width: AI_MODAL_SHADOW.shadowOffset.width, height: showSidebar ? AI_MODAL_SHADOW.shadowOffset.height : 0 }}
              shadowOpacity={resolvedTheme === 'dark' ? 0.3 : AI_MODAL_SHADOW.shadowOpacity}
              shadowRadius={AI_MODAL_SHADOW.shadowRadius}
              top={aiModalTop}
              width={showSidebar ? "auto" : undefined}
            >
              <YStack flex={1} gap="$2">
                {/* Header */}
                <XStack alignItems="center" justifyContent="space-between" paddingBottom="$3">
                  <XStack alignItems="center" gap="$2">
                    <View
                      alignItems="center"
                      backgroundColor="$tint"
                      borderRadius={999}
                      height={32}
                      justifyContent="center"
                      width={32}
                    >
                      <IconSymbol name="brain" color="white" size={18} />
                    </View>
                    <YStack gap="$0.5">
                      <ThemedText color={resolvedTheme === 'dark' ? '#FFFFFF' : '$color'} fontSize="$5" fontWeight="600">GA-X AI Assistant</ThemedText>
                      <ThemedText color={resolvedTheme === 'dark' ? '#CCCCCC' : '$color'} fontSize="$2" opacity={resolvedTheme === 'dark' ? 1 : OPACITY.medium}>Online • Ready to help</ThemedText>
                    </YStack>
                  </XStack>
                  <Button onPress={createCloseHandler(setIsAIModalOpen)} backgroundColor="transparent" size="$2">
                    <IconSymbol name="close" color={resolvedTheme === 'dark' ? '#FFFFFF' : '$color'} size={ICON_SIZES.medium} />
                  </Button>
                </XStack>

                {/* Chat Messages Area */}
                <ScrollView
                  ref={scrollViewRef}
                  contentContainerStyle={{ paddingBottom: 16 }}
                  flex={1}
                  showsVerticalScrollIndicator={true}
                >
                  <YStack gap="$3" paddingBottom="$2">
                    {aiMessages.map((message) => (
                      <XStack
                        key={message.id}
                        alignItems="flex-start"
                        flexDirection={message.sender === 'user' ? 'row-reverse' : 'row'}
                        gap="$2"
                        justifyContent={message.sender === 'user' ? 'flex-end' : 'flex-start'}
                      >
                        {message.sender === 'ai' && (
                          <View
                            alignItems="center"
                            backgroundColor="$tint"
                            borderRadius={999}
                            flexShrink={0}
                            height={32}
                            justifyContent="center"
                            width={32}
                          >
                            <IconSymbol name="brain" color="white" size={ICON_SIZES.medium} />
                          </View>
                        )}
                        <YStack alignItems={message.sender === 'user' ? 'flex-end' : 'flex-start'} flex={1} gap="$1">
                          <View
                            backgroundColor={message.sender === 'user' ? "$tint" : (resolvedTheme === 'dark' ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 122, 255, 0.1)")}
                            borderRadius="$4"
                            maxWidth="85%"
                            paddingHorizontal="$3"
                            paddingVertical="$2"
                          >
                            <ThemedText color={message.sender === 'user' ? "white" : (resolvedTheme === 'dark' ? '#FFFFFF' : '$color')} fontSize="$4" lineHeight="$1">
                              {message.text}
                            </ThemedText>
                          </View>
                          {message.id === 'welcome' && message.sender === 'ai' && (
                            <>
                              <YStack gap="$2" marginLeft="$2" marginRight={0} marginTop="$2">
                                <XStack alignItems="center" gap="$2">
                                  <IconSymbol name="check" color="$tint" size={ICON_SIZES.small} />
                                  <ThemedText color={resolvedTheme === 'dark' ? '#CCCCCC' : '$color'} fontSize="$3" opacity={resolvedTheme === 'dark' ? 1 : OPACITY.subtle}>
                                    Flight planning and route optimization
                                  </ThemedText>
                                </XStack>
                                <XStack alignItems="center" gap="$2">
                                  <IconSymbol name="check" color="$tint" size={ICON_SIZES.small} />
                                  <ThemedText color={resolvedTheme === 'dark' ? '#CCCCCC' : '$color'} fontSize="$3" opacity={resolvedTheme === 'dark' ? 1 : OPACITY.subtle}>
                                    Maintenance scheduling and predictions
                                  </ThemedText>
                                </XStack>
                                <XStack alignItems="center" gap="$2">
                                  <IconSymbol name="check" color="$tint" size={ICON_SIZES.small} />
                                  <ThemedText color={resolvedTheme === 'dark' ? '#CCCCCC' : '$color'} fontSize="$3" opacity={resolvedTheme === 'dark' ? 1 : OPACITY.subtle}>
                                    Document analysis and cross-referencing
                                  </ThemedText>
                                </XStack>
                                <XStack alignItems="center" gap="$2">
                                  <IconSymbol name="check" color="$tint" size={ICON_SIZES.small} />
                                  <ThemedText color={resolvedTheme === 'dark' ? '#CCCCCC' : '$color'} fontSize="$3" opacity={resolvedTheme === 'dark' ? 1 : OPACITY.subtle}>
                                    Regulatory compliance checks
                                  </ThemedText>
                                </XStack>
                              </YStack>
                              <ThemedText color={resolvedTheme === 'dark' ? '#CCCCCC' : '$color'} fontSize="$2" marginTop="$1" opacity={resolvedTheme === 'dark' ? 0.8 : OPACITY.light}>
                                Ask me anything about your aviation operations!
                              </ThemedText>
                            </>
                          )}
                        </YStack>
                        {message.sender === 'user' && (
                          <View
                            alignItems="center"
                            backgroundColor={resolvedTheme === 'dark' ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 122, 255, 0.2)"}
                            borderRadius={999}
                            flexShrink={0}
                            height={32}
                            justifyContent="center"
                            width={32}
                          >
                            <IconSymbol name="account" color="$tint" size={ICON_SIZES.medium} />
                          </View>
                        )}
                      </XStack>
                    ))}
                  </YStack>
                </ScrollView>

                {/* Input Area */}
                <XStack
                  alignItems="center"
                  backgroundColor={resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : INTERACTIVE_COLORS.searchBackground}
                  borderColor={resolvedTheme === 'dark' ? '#333333' : '$borderColor'}
                  borderRadius="$4"
                  borderWidth="$0.5"
                  gap="$2"
                  paddingHorizontal="$3"
                  paddingVertical="$2"
                >
                  <Input
                    ref={aiInputRef}
                    onBlur={(e: any) => {
                      // Prevent blur when sending message (keep keyboard open)
                      if (isWeb && isSendingMessage) {
                        // Small delay to allow state update, then refocus
                        setTimeout(() => {
                          if (aiInputRef.current) {
                            try {
                              if (typeof aiInputRef.current.focus === 'function') {
                                aiInputRef.current.focus();
                              }
                              if (typeof document !== 'undefined') {
                                const nativeInput = document.querySelector('input[placeholder*="Type your message"]') as HTMLInputElement;
                                if (nativeInput) {
                                  nativeInput.focus();
                                }
                              }
                            } catch (error) {
                              // Ignore errors
                            }
                          }
                        }, 10);
                      }
                    }}
                    onChangeText={setAIMessageInput}
                    onSubmitEditing={(e: any) => {
                      if (aiMessageInput.trim()) {
                        // Prevent default form submission behavior
                        if (e?.preventDefault) {
                          e.preventDefault();
                        }
                        if (e?.nativeEvent?.preventDefault) {
                          e.nativeEvent.preventDefault();
                        }
                        handleSendMessage();
                        // Return false to prevent form submission
                        return false;
                      }
                    }}
                    value={aiMessageInput}
                    placeholder="Type your message..."
                    autoCapitalize="sentences"
                    autoCorrect={true}
                    autoFocus={isWeb}
                    backgroundColor="transparent"
                    blurOnSubmit={false}
                    borderWidth={0}
                    color={resolvedTheme === 'dark' ? '#FFFFFF' : '$color'}
                    flex={1}
                    fontSize="$4"
                    paddingHorizontal={0}
                    placeholderTextColor={resolvedTheme === 'dark' ? '#CCCCCC' : '$color'}
                    returnKeyType="send"
                  />
                  <Button
                    onPress={handleSendMessage}
                    disabled={!aiMessageInput.trim()}
                    backgroundColor={aiMessageInput.trim() ? "$tint" : "$borderColor"}
                    borderRadius={999}
                    height={36}
                    opacity={aiMessageInput.trim() ? OPACITY.full : OPACITY.veryLight}
                    padding={0}
                    width={36}
                  >
                    <IconSymbol name="arrow-up" color="white" size={ICON_SIZES.medium} />
                  </Button>
                </XStack>
              </YStack>
            </View>
          </View>
        </Modal>
      )}

      {/* Header - Full width */}
      <View
        backgroundColor="$backgroundSecondary"
        borderBottomColor={resolvedTheme === 'dark' ? '#333333' : '$borderColor'}
        borderBottomWidth="$0.5"
        height={56}
        position="relative"
        shadowColor={resolvedTheme === 'dark' ? 'rgba(0, 0, 0, 0.5)' : '$shadowColor'}
        shadowOffset={{ width: 0, height: 1 }}
        shadowOpacity={resolvedTheme === 'dark' ? 0.3 : 0.1}
        shadowRadius={2}
      >
        <XStack
          alignItems="center"
          height="100%"
          justifyContent="space-between"
          paddingHorizontal="$3"
          paddingLeft={0}
          paddingRight={0}
          paddingVertical={0}
          position="relative"
        >
          {/* Left section - RoleSwitcher, News icon, and Search bar */}
          <XStack
            alignItems="center"
            flex={1}
            gap="$3"
            height="100%"
            justifyContent="flex-start"
            pointerEvents="box-none"
          >
            <RoleSwitcher
              currentRole={currentRole}
              onRoleChange={handleRoleChange}
            />
            
            {/* News icon - on all platforms */}
            {dimensionsReady && (
              <Button
                onPress={() => navigateTo('/(tabs)/news')}
                backgroundColor="transparent"
                height="100%"
                hoverStyle={{
                  backgroundColor: INTERACTIVE_COLORS.hover,
                  transform: 'scale(1.02)',
                }}
                padding="$2"
                pressStyle={{
                  backgroundColor: INTERACTIVE_COLORS.press,
                  transform: 'scale(0.98)',
                }}
                size="$2"
              >
                <IconSymbol
                  name="newspaper"
                  color={pathname.includes('/news') || pathname === '/news' ? "$tint" : (resolvedTheme === 'dark' ? '#FFFFFF' : '$color')}
                  size={24}
                />
              </Button>
            )}

            {/* Search bar - only on big screens */}
            {showSidebar && (
              <SearchBar
                onResultSelect={handleSearchResultSelect}
                onSearch={handleSearch}
                width={210}
              />
            )}
          </XStack>

          {/* GA-X title - DEAD CENTER using absolute positioning */}
          <Button
            style={{
              cursor: isWeb ? 'pointer' : 'default',
              transform: 'translateX(-50%)' // Center horizontally on all platforms
            }}
            onPress={() => {
              // Navigate to home page only if not already there
              if (pathname !== '/') {
                router.push('/');
              }
              // Collapse sidebar if expanded
              if (sidebarExpanded) {
                setSidebarExpanded(false);
              }
            }}
            accessibilityLabel="Navigate to home page"
            accessibilityRole="button"
            backgroundColor="transparent"
            bottom={0}
            height="100%"
            hoverStyle={{
              backgroundColor: INTERACTIVE_COLORS.hover,
              transform: 'translateX(-50%)',
            }}
            left="50%"
            position="absolute"
            pressStyle={{
              backgroundColor: INTERACTIVE_COLORS.press,
              transform: 'translateX(-50%)',
            }}
            top={0}
          >
            <ThemedText
              style={{
                userSelect: 'none',
              }}
              color={resolvedTheme === 'dark' ? '#FFFFFF' : (pathname === '/' ? "$tint" : "$color")}
              textAlign="center"
              type="title"
            >
              GA-X
            </ThemedText>
          </Button>

          {/* Right section - notifications and profile */}
          <XStack 
            alignItems="center"
            flex={1} 
            gap="$2" 
            height="100%" 
            justifyContent="flex-end"
            pointerEvents="box-none"
          >
            {/* Messages Icon */}
            <NotificationBadge
              count={messageCount}
              icon="message-text"
              isActive={pathname.includes('/messages') || pathname === '/messages'}
              onPress={handleMessagePress}
            />

            {/* Notification Bell Icon */}
            <NotificationBadge
              count={notificationCount}
              icon="bell"
              isActive={pathname.includes('/notifications') || pathname === '/notifications'}
              onPress={handleNotificationPress}
            />

            {/* Profile Menu */}
            <ProfileMenu />
          </XStack>
        </XStack>
      </View>


      {/* Main Content Area - Fixed padding reserved immediately on web */}
      <View
        animation="quick"
        flex={1}
        minHeight={0}
        paddingBottom={!showSidebar ? (width < SIDEBAR_BREAKPOINT ? 78 : 68) : 0} // Account for bottom nav height + extra padding on small screens
        paddingLeft={shouldReserveSidebarSpace ? 72 : 0}
        position="relative"
        transition="padding-left 0.3s cubic-bezier(0.4, 0, 0.2, 1), padding-bottom 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      >
        {/* Sidebar Navigation - Overlays content on large screens */}
        {shouldReserveSidebarSpace && (
          <SidebarNavigation
            currentRole={currentRole}
            onExpansionChange={setSidebarExpanded}
            onNavigate={handleTabPress}
          />
        )}

        {/* Main Content */}
        {children}
      </View>

      {/* Floating AI Assistant Button - All screen sizes - Outside content area */}
      <Button
        style={isWeb ? {
          userSelect: 'none',
          animation: 'glow 2s ease-in-out infinite alternate',
          zIndex: 9990,
        } : {
          shadowColor: '#007AFF',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.6,
          shadowRadius: 25,
          elevation: 10,
          zIndex: 9990,
        }}
        onPress={() => {
          setIsAIModalOpen(true);
        // Trigger focus immediately after user interaction (iOS Safari requirement)
        if (isBrowserEnvironment()) {
            setTimeout(() => {
              const nativeInput = document.querySelector('input[placeholder*="Type your message"]') as HTMLInputElement;
              if (nativeInput) {
                nativeInput.focus();
                nativeInput.click(); // iOS Safari sometimes needs click to trigger keyboard
              }
            }, 100);
          }
        }}
        alignItems="center"
        animation="slow"
        backgroundColor={resolvedTheme === 'dark' ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.8)"}
        borderRadius={999}
        bottom={shouldReserveSidebarSpace ? 30 : 76}
        height={56}
        hoverStyle={isWeb ? {
          backgroundColor: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 122, 255, 0.25)',
          scale: 1.05,
          userSelect: 'none',
        } : {
          backgroundColor: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 122, 255, 0.25)',
          scale: 1.05,
        }}
        justifyContent="center"
        left={shouldReserveSidebarSpace ? 30 : 20}
        paddingHorizontal="$3"
        paddingVertical="$3"
        position="absolute"
        pressStyle={{
          backgroundColor: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 122, 255, 0.35)',
          scale: 0.95,
        }}
        width={56}
        zIndex={9990}
      >
        <IconSymbol
          name="brain"
          color={resolvedTheme === 'dark' ? "#FFFFFF" : "#007AFF"}
          size={24}
        />
      </Button>

      {/* Bottom Tab Bar - Only on small screens */}
      {dimensionsReady && !showSidebar && (
        <>
          <View
            alignItems="center"
            backgroundColor="$backgroundSecondary"
            borderTopColor={resolvedTheme === 'dark' ? '#333333' : '$borderColor'}
            borderTopWidth="$0.5"
            bottom={0}
            flexDirection="row"
            justifyContent="space-around"
            left={0}
            paddingBottom={!showSidebar && width < SIDEBAR_BREAKPOINT ? 18 : 6} // Extra 10px on small screens
            paddingHorizontal={0}
            paddingTop="$1.5"
            position="absolute"
            right={0}
            {...BOTTOM_NAV_SHADOW}
          >
            {bottomNavItems.map((item, index) => {
              const href = getItemHref(item);
              const isActive = getCurrentTabIndex() === index;
              return (
                <Button
                  key={item.id}
                  style={{
                    userSelect: 'none',
                  }}
                  onPress={() => handleTabPress(href || '')}
                  alignItems="center"
                  backgroundColor="transparent"
                  flex={1}
                  flexDirection="column"
                  gap="$0.5"
                  justifyContent="center"
                  minHeight={56}
                  paddingVertical="$1.5"
                >
                  <IconSymbol
                    name={(item.icon || (item as any).icon) as any}
                    color={getIconColor(isActive, resolvedTheme)}
                    size={ICON_SIZES.large}
                  />
                </Button>
              );
            })}
          </View>
          
          {/* FAB - Floating Action Button in center */}
          <View
            alignItems="center"
            bottom={65}
            left={0}
            position="absolute"
            right={0}
            zIndex={1002}
          >
            <Button
              style={{
                marginBottom: -20,
              }}
              onPress={() => {
                // Focus search or open search modal
                handleFocusSearch();
              }}
              alignItems="center"
              backgroundColor="$tint"
              borderRadius={999}
              elevation={8}
              height={40}
              hoverStyle={{
                backgroundColor: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 122, 255, 0.9)',
                scale: 1.05,
              }}
              justifyContent="center"
              paddingHorizontal="$2.5"
              paddingVertical="$2.5"
              pressStyle={{
                backgroundColor: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 122, 255, 0.8)',
                scale: 0.95,
              }}
              shadowColor="$shadowColor"
              shadowOffset={{ width: 0, height: 4 }}
              shadowOpacity={0.3}
              shadowRadius={8}
              width={40}
            >
              <IconSymbol
                name="magnify"
                color="white"
                size={ICON_SIZES.medium}
              />
            </Button>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

