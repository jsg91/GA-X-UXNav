import { usePathname, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Platform, StatusBar, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input, ScrollView, View, XStack, YStack } from 'tamagui';

import { ProfileMenu } from '@/components/profile-menu';
import { RoleSwitcher } from '@/components/role-switcher';
import { SidebarNavigation } from '@/components/sidebar-navigation';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { NotificationBadge } from '@/components/ui/notification-badge';
import { SearchBar } from '@/components/ui/search-bar';
import { EntityName, generateNavigationForRole, getPageInfoForEntity, getPageInfoFromNavConfig, NAVIGATION_CONFIG, Role } from '@/constants/NAVIGATION';
import { useNavigationHotkeys } from '@/hooks/use-navigation-hotkeys';
import { useRoleContext } from '@/hooks/use-role-context';
import { useThemeContext } from '@/hooks/use-theme-context';

interface ResponsiveNavigationProps {
  children: React.ReactNode;
}

// Breakpoint for showing sidebar vs bottom nav
const SIDEBAR_BREAKPOINT = 768;
// Header height - matches the header minHeight
const HEADER_HEIGHT = 56;
// Header padding ($3) - matches paddingHorizontal in responsive-navigation header
const HEADER_PADDING = 12; // $3 = 12px

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
  const [dimensionsReady, setDimensionsReady] = useState(Platform.OS !== 'web');
  const [hasMeasuredDimensions, setHasMeasuredDimensions] = useState(false);
  const [showHelpOverlay, setShowHelpOverlay] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiMessageInput, setAIMessageInput] = useState('');
  const [aiMessages, setAIMessages] = useState<Array<{ id: string; text: string; sender: 'user' | 'ai'; timestamp: Date }>>([
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
      }, 100);
    }
  }, [aiMessages]);

  // Auto-focus input when AI modal opens
  useEffect(() => {
    if (isAIModalOpen) {
      // Delay to ensure modal is fully rendered, longer delay for iOS Safari
      setTimeout(() => {
        if (aiInputRef.current) {
          // Try multiple methods to focus on mobile web
          try {
            // For Tamagui Input, try accessing the underlying input element
            const inputElement = aiInputRef.current;
            if (inputElement && typeof inputElement.focus === 'function') {
              inputElement.focus();
            }
            // Also try accessing the native element for web
            if (Platform.OS === 'web' && typeof document !== 'undefined') {
              const nativeInput = document.querySelector('input[placeholder*="Type your message"]') as HTMLInputElement;
              if (nativeInput) {
                nativeInput.focus();
                nativeInput.click(); // iOS Safari sometimes needs click to trigger keyboard
              }
            }
          } catch (error) {
            if (__DEV__) {
              console.warn('Failed to focus AI input:', error);
            }
          }
        }
      }, Platform.OS === 'web' ? 500 : 300);
    }
  }, [isAIModalOpen]);

  // Set viewport meta tag for mobile web
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
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
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
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
          // Try to get from entity routes
          const entityNameMap: Record<string, EntityName> = {
            'logbook': 'logbookentries',
            'aircrafts': 'aircrafts',
            'reservations': 'reservations',
            'aerodromes': 'aerodromes',
            'maintenance': 'maintenance',
            'events': 'events',
            'documents': 'documents',
            'checklists': 'checklists',
            'techlog': 'techlog',
            'organizations': 'organizations',
            'users': 'users',
          };
          
          const entityName = entityNameMap[routeName] || routeName;
          const pageInfo = getPageInfoForEntity(entityName as EntityName, currentRole);
          pageTitle = `${pageInfo.title} | GA-X`;
        }
      }
      
      document.title = pageTitle;
    }
  }, [pathname, currentRole]);

  // Handle initial responsive detection - assume large screen on web initially to prevent bottom nav flash
  useEffect(() => {
    if (Platform.OS === 'web') {
      // On web, assume large screen initially to prevent bottom nav flash
      setDimensionsReady(true);

      // Mark dimensions as measured once we have a width > 0
      if (width > 0 && !hasMeasuredDimensions) {
        setHasMeasuredDimensions(true);
      }

      // Add resize listener for responsive updates on web
      // Only execute in real browser environment (check for both window.addEventListener and document)
      const isWebBrowser = typeof window !== 'undefined' 
        && typeof window.addEventListener === 'function'
        && typeof document !== 'undefined';
      
      if (isWebBrowser) {
        const handleResize = () => {
          // Force re-render to recalculate responsive layout
          setDimensionsReady(true);
          setHasMeasuredDimensions(true);
        };

        try {
          window.addEventListener('resize', handleResize);
          return () => {
            try {
              if (typeof window !== 'undefined' && typeof window.removeEventListener === 'function') {
                window.removeEventListener('resize', handleResize);
              }
            } catch (error) {
              // Silently fail cleanup on mobile/non-browser environments
              if (__DEV__) {
                console.warn('Failed to remove resize listener:', error);
              }
            }
          };
        } catch (error) {
          // Silently fail if addEventListener is not available
          if (__DEV__) {
            console.warn('Failed to add resize listener:', error);
          }
        }
      }
    } else {
      // On mobile, wait for actual dimensions
      setDimensionsReady(true);
      if (width > 0) {
        setHasMeasuredDimensions(true);
      }
    }
  }, [width, hasMeasuredDimensions]);

  // Determine if we should show sidebar (large screens) or bottom nav (small screens)
  // On web, default to showing sidebar to prevent bottom nav flash, but still respect actual screen size
  const showSidebar = Platform.OS === 'web'
    ? (hasMeasuredDimensions ? width >= SIDEBAR_BREAKPOINT : true)  // Assume sidebar on web initially until dimensions are measured
    : (dimensionsReady && width >= SIDEBAR_BREAKPOINT);  // Only show sidebar on mobile if dimensions confirm large screen

  // For web, reserve sidebar space immediately to prevent layout shift
  const shouldReserveSidebarSpace = Platform.OS === 'web'
    ? (hasMeasuredDimensions ? width >= SIDEBAR_BREAKPOINT : true)  // Reserve space immediately on web
    : (dimensionsReady && showSidebar);  // Only reserve on mobile when confirmed

  // Debug logging for development
  if (__DEV__) {
    console.log('ResponsiveNavigation Debug:', {
      platform: Platform.OS,
      width,
      dimensionsReady,
      showSidebar,
      SIDEBAR_BREAKPOINT
    });
  }

  const handleNotificationPress = () => {
    router.push('/(tabs)/notifications' as any);
  };

  const handleMessagePress = () => {
    router.push('/(tabs)/messages' as any);
  };

  const handleTabPress = (href: string) => {
    router.push(href as any);
  };

  const handleRoleChange = (role: Role) => {
    setCurrentRole(role);
    // Navigation will automatically update via useMemo in SidebarNavigation
  };

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // TODO: Implement global search functionality
    // Could search across aircraft, aerodromes, documents, etc.
  };

  const handleSearchResultSelect = (result: any) => {
    console.log('Search result selected:', result);
    if (result.href) {
      router.push(result.href as any);
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
    // Use multiple strategies to ensure it works on all platforms
    const refocusInput = () => {
      if (Platform.OS === 'web' && typeof document !== 'undefined') {
        // For web, find and focus the native input element
        const nativeInput = document.querySelector('input[placeholder*="Type your message"]') as HTMLInputElement;
        if (nativeInput) {
          nativeInput.focus();
          // Also try click to ensure focus on iOS Safari
          nativeInput.click();
        }
      }
      // Also try the ref directly
      if (aiInputRef.current) {
        try {
          if (typeof aiInputRef.current.focus === 'function') {
            aiInputRef.current.focus();
          }
        } catch (error) {
          if (__DEV__) {
            console.warn('Failed to refocus AI input via ref:', error);
          }
        }
      }
    };

    // Refocus immediately and after multiple small delays to catch all scenarios
    requestAnimationFrame(() => {
      refocusInput();
      setTimeout(refocusInput, 10);
      setTimeout(refocusInput, 50);
      setTimeout(() => {
        refocusInput();
        setIsSendingMessage(false);
      }, 150);
    });

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
      refocusInput();
    }, 500);
  };

  // Hotkey handlers
  const handleFocusSearch = () => {
    console.log('ResponsiveNavigation: handleFocusSearch called');
    // Focus the search bar in header if available
    if (Platform.OS === 'web' && dimensionsReady && showSidebar) {
      if (typeof document !== 'undefined' && typeof document.querySelector === 'function') {
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
        if (searchInput) {
          console.log('ResponsiveNavigation: Found search input, focusing');
          searchInput.focus();
          searchInput.select(); // Select all text for easy replacement
        } else {
          console.log('ResponsiveNavigation: Search input not found');
        }
      }
    } else {
      console.log('ResponsiveNavigation: Search focus conditions not met', { dimensionsReady, showSidebar });
    }
  };

  const handleToggleAI = () => {
    console.log('ResponsiveNavigation: handleToggleAI called');
    setIsAIModalOpen((prev: boolean) => !prev);
    console.log('AI Assistant toggled via hotkey');
    // TODO: Implement actual AI modal/panel opening
  };

  const handleCloseModals = () => {
    console.log('ResponsiveNavigation: handleCloseModals called');
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

  // Generate navigation items for bottom nav based on current role (same as sidebar)
  const bottomNavItems = useMemo(() => {
    if (currentRole) {
      return generateNavigationForRole(currentRole);
    }
    // Fallback to old navigation config if no role
    return NAVIGATION_CONFIG.tabBar.items.filter(item => item.visible);
  }, [currentRole]);

  // Get current tab index based on pathname and screen size
  const getCurrentTabIndex = () => {
    const currentIndex = bottomNavItems.findIndex(item => {
      const href = 'href' in item ? item.href : (item as any).href;
      if (!href) return false;
      // Handle root path
      if (href === '/(tabs)/' && pathname === '/') return true;
      // Handle other tab paths
      if (href && pathname.includes(href.replace('/(tabs)/', ''))) return true;
      return href === pathname;
    });
    return currentIndex >= 0 ? currentIndex : 0;
  };

  // Track keyboard height for mobile web (iOS Safari)
  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && !showSidebar && isAIModalOpen) {
      let initialViewportHeight = window.visualViewport?.height || window.innerHeight;
      
      const updateKeyboardHeight = () => {
        try {
          if (window.visualViewport) {
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

      // Listen to Visual Viewport changes (most accurate)
      if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', updateKeyboardHeight);
        window.visualViewport.addEventListener('scroll', updateKeyboardHeight);
      }

      // Fallback: listen to window resize
      window.addEventListener('resize', updateKeyboardHeight);

      return () => {
        if (window.visualViewport) {
          window.visualViewport.removeEventListener('resize', updateKeyboardHeight);
          window.visualViewport.removeEventListener('scroll', updateKeyboardHeight);
        }
        window.removeEventListener('resize', updateKeyboardHeight);
      };
    } else {
      // Reset keyboard height when modal closes or sidebar is shown
      setKeyboardHeight(0);
    }
  }, [isAIModalOpen, showSidebar]);

  // Calculate AI modal positioning based on keyboard state
  const aiModalBottom = useMemo(() => {
    if (showSidebar) return 100;
    if (keyboardHeight > 0) return keyboardHeight + 10;
    // Account for bottom nav bar on mobile (keep consistent position when keyboard closed)
    return !showSidebar && Platform.OS === 'web' ? 80 : 140;
  }, [showSidebar, keyboardHeight]);

  const aiModalTop = useMemo(() => {
    if (showSidebar) return undefined;
    // Only set top when keyboard is closed, use bottom positioning when keyboard is open
    return keyboardHeight > 0 ? undefined : HEADER_HEIGHT + 10;
  }, [showSidebar, keyboardHeight]);

  const aiModalMaxHeight = useMemo(() => {
    if (showSidebar) return "80vh";
    if (keyboardHeight > 0 && Platform.OS === 'web' && typeof window !== 'undefined') {
      // Use visual viewport height when keyboard is open
      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      // Calculate max height: viewport height minus header minus bottom position
      // bottom position is keyboardHeight + 10, so we need to account for that
      const availableHeight = viewportHeight - HEADER_HEIGHT - (keyboardHeight + 10) - 10;
      return `${Math.max(200, availableHeight)}px`;
    }
    // Without keyboard, use window height minus header and bottom nav
    const bottomNavHeight = !showSidebar ? 68 : 0;
    return `${Math.max(200, height - HEADER_HEIGHT - bottomNavHeight - 20)}px`;
  }, [showSidebar, keyboardHeight, height]);

  const aiModalMinHeight = useMemo(() => {
    if (showSidebar) return 400;
    // Reduce minHeight when keyboard is open to prevent modal from being pushed up
    if (keyboardHeight > 0) return 200;
    return 400;
  }, [showSidebar, keyboardHeight]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        backgroundColor="transparent"
        barStyle={resolvedTheme === 'dark' ? 'light-content' : 'dark-content'}
      />

      {/* CSS for animated glow effect */}
      {Platform.OS === 'web' && (
        <style>{`
          @keyframes glow {
            0% {
              box-shadow: 0 0 15px rgba(0, 122, 255, 0.5), 0 0 30px rgba(0, 122, 255, 0.3), 0 0 45px rgba(0, 122, 255, 0.2);
            }
            100% {
              box-shadow: 0 0 25px rgba(0, 122, 255, 0.7), 0 0 50px rgba(0, 122, 255, 0.5), 0 0 75px rgba(0, 122, 255, 0.3);
            }
          }
        `}</style>
      )}

      {/* Help Overlay */}
      {showHelpOverlay && (
        <View
          alignItems="center"
          backgroundColor="rgba(0, 0, 0, 0.5)"
          bottom={0}
          justifyContent="center"
          left={0}
          position="absolute"
          right={0}
          top={0}
          zIndex={9999}
        >
          <View
            backgroundColor="$background"
            borderRadius="$4"
            margin="$4"
            maxWidth={400}
            padding="$6"
            shadowColor="$shadowColor"
            shadowOffset={{ width: 0, height: 10 }}
            shadowOpacity={0.25}
            shadowRadius={10}
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
          onRequestClose={() => setIsAIModalOpen(false)}
          animationType="fade"
          transparent={true}
          visible={isAIModalOpen}
        >
          <View
            onPress={() => setIsAIModalOpen(false)}
            alignItems={Platform.OS === 'web' ? "flex-start" : "center"}
            backgroundColor="rgba(0, 0, 0, 0.5)"
            bottom={0}
            flex={1}
            justifyContent={Platform.OS === 'web' ? "flex-end" : "center"}
            left={0}
            position="absolute"
            right={0}
            top={0}
            zIndex={9998}
          >
            <View
              onPress={(e: any) => e.stopPropagation()}
              backgroundColor="$background"
              borderRadius={showSidebar ? "$5" : "$4"}
              bottom={aiModalBottom}
              left={showSidebar ? 100 : 5}
              maxHeight={aiModalMaxHeight}
              maxWidth={showSidebar ? 400 : undefined}
              minHeight={aiModalMinHeight}
              minWidth={showSidebar ? 300 : undefined}
              padding={showSidebar ? "$6" : "$4"}
              position="absolute"
              right={showSidebar ? undefined : 5}
              shadowColor="$shadowColor"
              shadowOffset={{ width: 0, height: showSidebar ? 10 : 0 }}
              shadowOpacity={0.25}
              shadowRadius={10}
              top={aiModalTop}
              width={showSidebar ? "auto" : undefined}
              style={{
                transition: 'bottom 0.3s ease-out, top 0.3s ease-out, max-height 0.3s ease-out',
              }}
            >
              <YStack flex={1} gap="$2">
                {/* Header */}
                <XStack alignItems="center" justifyContent="space-between" paddingBottom="$3">
                  <XStack alignItems="center" gap="$2">
                    <View
                      backgroundColor="$tint"
                      borderRadius={999}
                      height={32}
                      width={32}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <IconSymbol name="brain" color="white" size={18} />
                    </View>
                    <YStack gap="$0.5">
                      <ThemedText fontSize="$5" fontWeight="600">GA-X AI Assistant</ThemedText>
                      <ThemedText color="$color" fontSize="$2" opacity={0.7}>Online • Ready to help</ThemedText>
                    </YStack>
                  </XStack>
                  <Button size="$2" onPress={() => setIsAIModalOpen(false)} backgroundColor="transparent">
                    <IconSymbol name="close" size={18} />
                  </Button>
                </XStack>

                {/* Chat Messages Area */}
                <ScrollView
                  ref={scrollViewRef}
                  flex={1}
                  showsVerticalScrollIndicator={true}
                  contentContainerStyle={{ paddingBottom: 16 }}
                >
                  <YStack gap="$3" paddingBottom="$2">
                    {aiMessages.map((message) => (
                      <XStack
                        key={message.id}
                        alignItems="flex-start"
                        gap="$2"
                        justifyContent={message.sender === 'user' ? 'flex-end' : 'flex-start'}
                        flexDirection={message.sender === 'user' ? 'row-reverse' : 'row'}
                      >
                        {message.sender === 'ai' && (
                          <View
                            backgroundColor="$tint"
                            borderRadius={999}
                            height={32}
                            width={32}
                            alignItems="center"
                            justifyContent="center"
                            flexShrink={0}
                          >
                            <IconSymbol name="brain" color="white" size={18} />
                          </View>
                        )}
                        <YStack flex={1} gap="$1" alignItems={message.sender === 'user' ? 'flex-end' : 'flex-start'}>
                          <View
                            backgroundColor={message.sender === 'user' ? "$tint" : "rgba(0, 122, 255, 0.1)"}
                            borderRadius="$4"
                            paddingHorizontal="$3"
                            paddingVertical="$2"
                            maxWidth="85%"
                          >
                            <ThemedText color={message.sender === 'user' ? "white" : "$color"} fontSize="$4" lineHeight="$1">
                              {message.text}
                            </ThemedText>
                          </View>
                          {message.id === 'welcome' && message.sender === 'ai' && (
                            <>
                              <YStack gap="$2" marginTop="$2" marginLeft="$2" marginRight={0}>
                                <XStack alignItems="center" gap="$2">
                                  <IconSymbol name="check" color="$tint" size={16} />
                                  <ThemedText color="$color" fontSize="$3" opacity={0.8}>
                                    Flight planning and route optimization
                                  </ThemedText>
                                </XStack>
                                <XStack alignItems="center" gap="$2">
                                  <IconSymbol name="check" color="$tint" size={16} />
                                  <ThemedText color="$color" fontSize="$3" opacity={0.8}>
                                    Maintenance scheduling and predictions
                                  </ThemedText>
                                </XStack>
                                <XStack alignItems="center" gap="$2">
                                  <IconSymbol name="check" color="$tint" size={16} />
                                  <ThemedText color="$color" fontSize="$3" opacity={0.8}>
                                    Document analysis and cross-referencing
                                  </ThemedText>
                                </XStack>
                                <XStack alignItems="center" gap="$2">
                                  <IconSymbol name="check" color="$tint" size={16} />
                                  <ThemedText color="$color" fontSize="$3" opacity={0.8}>
                                    Regulatory compliance checks
                                  </ThemedText>
                                </XStack>
                              </YStack>
                              <ThemedText color="$color" fontSize="$2" opacity={0.6} marginTop="$1">
                                Ask me anything about your aviation operations!
                              </ThemedText>
                            </>
                          )}
                        </YStack>
                        {message.sender === 'user' && (
                          <View
                            backgroundColor="rgba(0, 122, 255, 0.2)"
                            borderRadius={999}
                            height={32}
                            width={32}
                            alignItems="center"
                            justifyContent="center"
                            flexShrink={0}
                          >
                            <IconSymbol name="account" color="$tint" size={18} />
                          </View>
                        )}
                      </XStack>
                    ))}
                  </YStack>
                </ScrollView>

                {/* Input Area */}
                <XStack
                  alignItems="center"
                  backgroundColor="rgba(0, 0, 0, 0.03)"
                  borderColor="$borderColor"
                  borderRadius="$4"
                  borderWidth="$0.5"
                  gap="$2"
                  paddingHorizontal="$3"
                  paddingVertical="$2"
                >
                  <Input
                    ref={aiInputRef}
                    placeholder="Type your message..."
                    flex={1}
                    backgroundColor="transparent"
                    borderWidth={0}
                    fontSize="$4"
                    paddingHorizontal={0}
                    autoCapitalize="sentences"
                    autoCorrect={true}
                    value={aiMessageInput}
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
                    blurOnSubmit={false}
                    returnKeyType="send"
                    autoFocus={Platform.OS === 'web'}
                    onBlur={(e: any) => {
                      // Prevent blur when sending message (keep keyboard open)
                      if (Platform.OS === 'web' && isSendingMessage) {
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
                  />
                  <Button
                    backgroundColor={aiMessageInput.trim() ? "$tint" : "$borderColor"}
                    borderRadius={999}
                    height={36}
                    width={36}
                    padding={0}
                    onPress={handleSendMessage}
                    disabled={!aiMessageInput.trim()}
                    opacity={aiMessageInput.trim() ? 1 : 0.5}
                  >
                    <IconSymbol name="arrow-up" color="white" size={18} />
                  </Button>
                </XStack>
              </YStack>
            </View>
          </View>
        </Modal>
      )}

      {/* Header - Full width */}
      <View
        backgroundColor="$background"
        borderBottomColor="$borderColor"
        borderBottomWidth="$0.5"
        position="relative"
        shadowColor="$shadowColor"
        shadowOffset={{ width: 0, height: 1 }}
        shadowOpacity={0.1}
        shadowRadius={2}
      >
        <XStack
          alignItems="center"
          height="100%"
          justifyContent="space-between"
          minHeight={56}
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
            
            {/* News icon - only on big screens */}
            {(Platform.OS === 'web' || (dimensionsReady && showSidebar)) && (
              <Button
                onPress={() => router.push('/(tabs)/news' as any)}
                backgroundColor="transparent"
                height="100%"
                hoverStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  transform: 'scale(1.02)',
                }}
                padding="$2"
                pressStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  transform: 'scale(0.98)',
                }}
                size="$2"
              >
                <IconSymbol
                  name="newspaper"
                  color={pathname.includes('/news') || pathname === '/news' ? "$tint" : "$color"}
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
            style={Platform.OS === 'web' ? { 
              cursor: 'pointer',
              transform: 'translateX(-50%)'
            } : {}}
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
            hoverStyle={Platform.OS === 'web' ? {
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              transform: 'translateX(-50%)',
            } : {
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
            }}
            left="50%"
            position="absolute"
            pressStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
            }}
            top={0}
          >
            <ThemedText
              style={{
                userSelect: 'none',
              }}
              color={pathname === '/' ? "$tint" : "$color"}
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
        paddingBottom={0}
        paddingLeft={shouldReserveSidebarSpace ? 72 : 0}
        position="relative"
        transition="padding-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
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
        animation="slow"
        bottom={shouldReserveSidebarSpace ? 30 : 76}
        left={shouldReserveSidebarSpace ? 30 : 20}
        onPress={() => {
          setIsAIModalOpen(true);
          // Trigger focus immediately after user interaction (iOS Safari requirement)
          if (Platform.OS === 'web' && typeof document !== 'undefined') {
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
        backgroundColor="rgba(255, 255, 255, 0.8)"
        borderRadius={999}
        height={56}
        hoverStyle={Platform.OS === 'web' ? {
          backgroundColor: 'rgba(0, 122, 255, 0.25)',
          scale: 1.05,
          userSelect: 'none',
        } : {
          backgroundColor: 'rgba(0, 122, 255, 0.25)',
          scale: 1.05,
        }}
        justifyContent="center"
        paddingHorizontal="$3"
        paddingVertical="$3"
        position="absolute"
        pressStyle={{
          backgroundColor: 'rgba(0, 122, 255, 0.35)',
          scale: 0.95,
        }}
        style={Platform.OS === 'web' ? {
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
        width={56}
        zIndex={9990}
      >
        <IconSymbol
          name="brain"
          color="#007AFF"
          size={24}
        />
      </Button>

      {/* Bottom Tab Bar - Only on small screens */}
      {dimensionsReady && !showSidebar && (
        <>
          <View
            alignItems="center"
            backgroundColor="$background"
            borderTopColor="$borderColor"
            borderTopWidth="$0.5"
            flexDirection="row"
            justifyContent="space-around"
            paddingHorizontal={0}
            paddingVertical="$1.5"
            shadowColor="$shadowColor"
            shadowOffset={{ width: 0, height: -1 }}
            shadowOpacity={0.1}
            shadowRadius={2}
          >
            {bottomNavItems.map((item, index) => {
              const href = 'href' in item ? item.href : (item as any).href;
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
                    color={isActive ? "$tint" : "$tabIconDefault"}
                    size={22}
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
              onPress={() => {
                // Focus search or open search modal
                handleFocusSearch();
              }}
              alignItems="center"
              backgroundColor="$tint"
              borderRadius={999}
              height={40}
              hoverStyle={{
                backgroundColor: 'rgba(0, 122, 255, 0.9)',
                scale: 1.05,
              }}
              justifyContent="center"
              paddingHorizontal="$2.5"
              paddingVertical="$2.5"
              pressStyle={{
                backgroundColor: 'rgba(0, 122, 255, 0.8)',
                scale: 0.95,
              }}
              shadowColor="$shadowColor"
              shadowOffset={{ width: 0, height: 4 }}
              shadowOpacity={0.3}
              shadowRadius={8}
              width={40}
              elevation={8}
              style={{
                marginBottom: -20,
              }}
            >
              <IconSymbol
                name="magnify"
                color="white"
                size={18}
              />
            </Button>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

