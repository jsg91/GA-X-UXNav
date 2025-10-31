import { usePathname, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Animated, Dimensions, Modal, StatusBar, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input, ScrollView, View, XStack, YStack } from 'tamagui';

import { NavigationDrawer } from '@/components/navigation-drawer';
import { ProfileMenu } from '@/components/profile-menu';
import { RoleSwitcher } from '@/components/role-switcher';
import { SidebarNavigation } from '@/components/sidebar-navigation';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { NotificationBadge } from '@/components/ui/notification-badge';
import { SearchBar } from '@/components/ui/search-bar';
import { AI_MODAL_DIMENSIONS, HEADER_HEIGHT, HEADER_PADDING, ICON_SIZES, SIDEBAR_BREAKPOINT } from '@/constants/layout';
import { OPACITY } from '@/constants/opacity';
import { AI_MODAL_SHADOW, BOTTOM_NAV_SHADOW } from '@/constants/shadow-styles';
import { Z_INDEX } from '@/constants/z-index';
import { useNavigationHotkeys } from '@/hooks/use-navigation-hotkeys';
import { useNavigationItems } from '@/hooks/use-navigation-items';
import { useRoleContext } from '@/hooks/use-role-context';
import { useThemeContext } from '@/hooks/use-theme-context';
import { useAIChat } from '@/hooks/useAIChat';
import { useModalState } from '@/hooks/useModalState';
import { useNavigationState } from '@/hooks/useNavigationState';
import { useResponsiveBehavior } from '@/hooks/useResponsiveBehavior';
import { NAVIGATION_CONFIG, Role, ROLE_CONFIG } from '@/navigation';
import { stopPropagation } from '@/utils/event-handlers';
import { getIconColor } from '@/utils/icons';
import { INTERACTIVE_COLORS } from '@/utils/interactive-colors';
import { getItemHref, isTabActive } from '@/utils/navigation';
import { isBrowserEnvironment, isWeb } from '@/utils/platform';
import { navigateTo } from '@/utils/router';
import { createCloseHandler } from '@/utils/state-helpers';

interface ResponsiveNavigationProps {
  children: React.ReactNode;
}

export function ResponsiveNavigation({ children }: ResponsiveNavigationProps) {
  const { resolvedTheme } = useThemeContext();
  const { currentRole, setCurrentRole } = useRoleContext();
  const router = useRouter();
  const pathname = usePathname();
  const { width, height } = useWindowDimensions();
  const screenWidth = Dimensions.get('window').width;

  // Use the navigation state hook
  const navigationState = useNavigationState();

  // Use hooks for complex state management
  const aiChat = useAIChat();
  const modalState = useModalState();
  const responsiveBehavior = useResponsiveBehavior();

  const [notificationCount] = useState(3); // Mock notification count
  const [messageCount] = useState(2); // Mock message count

  // AI chat logic is now handled by useAIChat hook

  // Responsive behavior is now handled by useResponsiveBehavior hook
  // Update document title when pathname or role changes
  useEffect(() => {
    responsiveBehavior.updateDocumentTitle(pathname, currentRole);
  }, [pathname, currentRole, responsiveBehavior]);

  // Navigation state is now handled by useNavigationState hook

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

  // Message sending logic is now handled by useAIChat hook

  // Hotkey handlers
  const handleFocusSearch = () => {
    // Focus the search bar in header if available
    if (isWeb && navigationState.dimensionsReady && navigationState.showSidebar) {
      if (typeof document !== 'undefined' && typeof document.querySelector === 'function') {
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          searchInput.select(); // Select all text for easy replacement
        }
      }
    }
  };

  const handleToggleAI = aiChat.toggleModal;

  const handleCloseModals = () => {
    modalState.closeAll();
    aiChat.setIsOpen(false);
    navigationState.setSidebarExpanded(false);
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
  const allBottomNavItems = useNavigationItems(currentRole, { forLargeScreen: false });
  const mainBottomNavItems = useNavigationItems(currentRole, { forLargeScreen: false, forSmallScreenMainOnly: true });
  const nonMainBottomNavItems = allBottomNavItems.filter(item =>
    !mainBottomNavItems.some(mainItem => mainItem.id === item.id)
  );

  // Use main items only on small screens, all items on large screens
  const bottomNavItems = !navigationState.showSidebar ? mainBottomNavItems : allBottomNavItems;

  // For drawer, show all items when it's a pilot
  const drawerItems = currentRole?.id === 'pilot' ? allBottomNavItems : nonMainBottomNavItems;

  // Create role groups for the role switcher drawer
  const roleGroups = useMemo(() => {
    return ROLE_CONFIG.groups.map(group => ({
      name: group.name,
      icon: group.icon,
      roles: group.roles.map(role => ({
        id: role.id,
        name: role.name,
        href: '', // Not used for role selection
        icon: role.icon,
        label: role.label,
        customPage: false,
        comingSoon: 'comingSoon' in role ? role.comingSoon : false,
      }))
    })).filter(group => group.roles.length > 0);
  }, []);

  // Get current tab index based on pathname and screen size
  const getCurrentTabIndex = () => {
    const currentIndex = bottomNavItems.findIndex(item => {
      return isTabActive(getItemHref(item), pathname);
    });
    return currentIndex >= 0 ? currentIndex : 0;
  };

  // Keyboard tracking is now handled by useResponsiveBehavior hook

  // Calculate AI modal positioning based on keyboard state
  const aiModalBottom = useMemo(() => {
    if (navigationState.showSidebar) return 100;
    if (responsiveBehavior.keyboardHeight > 0) return responsiveBehavior.keyboardHeight + 10;
    // Account for bottom nav bar on mobile (keep consistent position when keyboard closed)
    return !navigationState.showSidebar && isWeb ? 80 : 140;
  }, [navigationState.showSidebar, responsiveBehavior.keyboardHeight]);

  const aiModalTop = useMemo(() => {
    if (navigationState.showSidebar) return undefined;
    // Only set top when keyboard is closed, use bottom positioning when keyboard is open
    return responsiveBehavior.keyboardHeight > 0 ? undefined : HEADER_HEIGHT + 10;
  }, [navigationState.showSidebar, responsiveBehavior.keyboardHeight]);

  const aiModalMaxHeight = useMemo(() => {
    if (navigationState.showSidebar) return "80vh";
    if (responsiveBehavior.keyboardHeight > 0 && responsiveBehavior.isBrowserEnvironment) {
      // Use visual viewport height when keyboard is open
      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      // Calculate max height: viewport height minus header minus bottom position
      // bottom position is keyboardHeight + 10, so we need to account for that
      const availableHeight = viewportHeight - HEADER_HEIGHT - (responsiveBehavior.keyboardHeight + 10) - 10;
      return `${Math.max(AI_MODAL_DIMENSIONS.minAvailableHeight, availableHeight)}px`;
    }
    // Without keyboard, use window height minus header and bottom nav
    const bottomNavHeight = !navigationState.showSidebar ? 68 : 0;
    return `${Math.max(AI_MODAL_DIMENSIONS.minAvailableHeight, height - HEADER_HEIGHT - bottomNavHeight - 20)}px`;
  }, [navigationState.showSidebar, responsiveBehavior.keyboardHeight, responsiveBehavior.isBrowserEnvironment, height]);

  const aiModalMinHeight = useMemo(() => {
    if (navigationState.showSidebar) return AI_MODAL_DIMENSIONS.minHeight;
    // Reduce minHeight when keyboard is open to prevent modal from being pushed up
    if (responsiveBehavior.keyboardHeight > 0) return AI_MODAL_DIMENSIONS.minHeightKeyboard;
    return AI_MODAL_DIMENSIONS.minHeight;
  }, [navigationState.showSidebar, responsiveBehavior.keyboardHeight]);

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
      {modalState.helpOverlay.visible && (
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
      {aiChat.isOpen && (
        <Modal
          onRequestClose={createCloseHandler(aiChat.setIsOpen)}
          animationType="fade"
          transparent={true}
          visible={aiChat.isOpen}
        >
          <View
            onPress={createCloseHandler(aiChat.setIsOpen)}
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
              borderRadius={navigationState.showSidebar ? "$5" : "$4"}
              bottom={aiModalBottom}
              left={navigationState.showSidebar ? 100 : 5}
              maxHeight={aiModalMaxHeight}
              maxWidth={navigationState.showSidebar ? AI_MODAL_DIMENSIONS.maxWidthSidebar : undefined}
              minHeight={aiModalMinHeight}
              minWidth={navigationState.showSidebar ? AI_MODAL_DIMENSIONS.minWidthSidebar : undefined}
              padding={navigationState.showSidebar ? "$6" : "$4"}
              position="absolute"
              right={navigationState.showSidebar ? undefined : 5}
              shadowColor={resolvedTheme === 'dark' ? 'rgba(0, 0, 0, 0.5)' : AI_MODAL_SHADOW.shadowColor}
              shadowOffset={{ width: AI_MODAL_SHADOW.shadowOffset.width, height: navigationState.showSidebar ? AI_MODAL_SHADOW.shadowOffset.height : 0 }}
              shadowOpacity={resolvedTheme === 'dark' ? 0.3 : AI_MODAL_SHADOW.shadowOpacity}
              shadowRadius={AI_MODAL_SHADOW.shadowRadius}
              top={aiModalTop}
              width={navigationState.showSidebar ? "auto" : undefined}
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
                  ref={aiChat.scrollViewRef}
                  contentContainerStyle={{ paddingBottom: 16 }}
                  flex={1}
                  showsVerticalScrollIndicator={true}
                >
                  <YStack gap="$3" paddingBottom="$2">
                    {aiChat.messages.map((message) => (
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
                    ref={aiChat.inputRef}
                    onBlur={(e: any) => {
                      // Prevent blur when sending message (keep keyboard open)
                      if (isWeb && aiChat.isSending) {
                        // Small delay to allow state update, then refocus
                        setTimeout(() => {
                          if (aiChat.inputRef.current) {
                            try {
                              if (typeof aiChat.inputRef.current.focus === 'function') {
                                aiChat.inputRef.current.focus();
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
                    onChangeText={aiChat.setInputValue}
                    onSubmitEditing={(e: any) => {
                      if (aiChat.inputValue.trim()) {
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
                    value={aiChat.inputValue}
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
                    onPress={aiChat.sendMessage}
                    disabled={!aiChat.canSendMessage}
                    backgroundColor={aiChat.canSendMessage ? "$tint" : "$borderColor"}
                    borderRadius={999}
                    height={36}
                    opacity={aiChat.canSendMessage ? OPACITY.full : OPACITY.veryLight}
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

      {/* Navigation Drawer for additional navigation items */}
      <NavigationDrawer
        isOpen={modalState.hamburger.visible}
        onClose={() => modalState.hamburger.setVisible(false)}
        items={drawerItems}
        currentPath={pathname}
        onNavigate={handleTabPress}
        onSlideProgress={modalState.hamburger.setSlideProgress}
        title={`${currentRole?.name || 'User'} Navigation`}
        onChangeRole={() => modalState.roleSwitcher.show()}
        showRoleHint={currentRole?.id === 'pilot'}
      />

      {/* Role Switcher Drawer - Small screens use left drawer, large screens use modal */}
      {width < SIDEBAR_BREAKPOINT ? (
        <NavigationDrawer
          isOpen={modalState.roleSwitcher.visible}
          onClose={() => modalState.roleSwitcher.hide()}
          groups={roleGroups}
          title="Change Role"
          side="left"
          onSlideProgress={modalState.roleSwitcher.setSlideProgress}
          onRoleSelect={(roleId) => {
            let selectedRole: Role | undefined;

            for (const group of ROLE_CONFIG.groups) {
              selectedRole = group.roles.find(role => role.id === roleId);
              if (selectedRole) break;
            }

            if (selectedRole) {
              setCurrentRole(selectedRole);
              setIsRoleSwitcherOpen(false);
            }
          }}
          currentRoleId={currentRole?.id}
        />
      ) : (
        modalState.roleSwitcher.visible && (
          <Modal
            onRequestClose={createCloseHandler(modalState.roleSwitcher.setVisible)}
            animationType="fade"
            transparent={true}
            visible={modalState.roleSwitcher.visible}
          >
            <View
              onPress={createCloseHandler(modalState.roleSwitcher.setVisible)}
              alignItems="flex-start"
              bottom={0}
              flex={1}
              justifyContent="flex-start"
              left={0}
              position="absolute"
              right={0}
              top={0}
              zIndex={Z_INDEX.aiModalOverlay}
            >
              <View
                onPress={stopPropagation}
                backgroundColor="$backgroundSecondary"
                borderRadius="$5"
                left={HEADER_PADDING}
                maxHeight={500}
                maxWidth={400}
                minWidth={300}
                padding="$4"
                top={HEADER_HEIGHT}
                width="auto"
              >
                <RoleSwitcher
                  currentRole={currentRole}
                  onRoleChange={(role) => {
                    setCurrentRole(role);
                    setIsRoleSwitcherOpen(false);
                  }}
                />
              </View>
            </View>
          </Modal>
        )
      )}

      {/* Animated wrapper for entire interface */}
      <Animated.View
        style={{
          flex: 1,
          transform: [{
            translateX: (modalState.hamburger.slideProgress * -Math.min(300, screenWidth * 0.8)) +
                       (modalState.roleSwitcher.slideProgress * Math.min(300, screenWidth * 0.8))
          }]
        }}
      >
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
              onOpenDrawer={() => setIsRoleSwitcherOpen(true)}
            />
            
            {/* News icon - on all platforms */}
            {navigationState.dimensionsReady && (
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
            {navigationState.showSidebar && (
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
              if (navigationState.sidebarExpanded) {
                navigationState.setSidebarExpanded(false);
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
          flex={1}
          minHeight={0}
            paddingBottom={!navigationState.showSidebar ? (width < SIDEBAR_BREAKPOINT ? 78 : 68) : 0} // Account for bottom nav height + extra padding on small screens
          paddingLeft={navigationState.shouldReserveSidebarSpace ? 72 : 0}
          position="relative"
        >
        {/* Sidebar Navigation - Overlays content on large screens */}
        {navigationState.shouldReserveSidebarSpace && (
          <SidebarNavigation
            currentRole={currentRole}
            expanded={navigationState.sidebarExpanded}
            onExpansionChange={navigationState.setSidebarExpanded}
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
        bottom={navigationState.shouldReserveSidebarSpace ? 30 : 76}
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
        left={navigationState.shouldReserveSidebarSpace ? 30 : 20}
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
      {navigationState.dimensionsReady && !navigationState.showSidebar && (
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
            paddingBottom={!navigationState.showSidebar && width < SIDEBAR_BREAKPOINT ? 18 : 6} // Extra 10px on small screens
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
            {/* Hamburger menu for non-main items on small screens */}
            {!navigationState.showSidebar && nonMainBottomNavItems.length > 0 && (
              <Button
                style={{
                  userSelect: 'none',
                }}
                onPress={modalState.hamburger.toggle}
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
                  name="menu"
                  color={getIconColor(false, resolvedTheme)}
                  size={ICON_SIZES.large}
                />
              </Button>
            )}
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
      </Animated.View>
    </SafeAreaView>
  );
}

