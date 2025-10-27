import { usePathname, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, StatusBar, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, View, XStack, YStack } from 'tamagui';

import { ProfileMenu } from '@/components/profile-menu';
import { RoleSwitcher } from '@/components/role-switcher';
import { SidebarNavigation } from '@/components/sidebar-navigation';
import { ThemedText } from '@/components/themed-text';
import { AlertUtils } from '@/components/ui/alert-utils';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { NotificationBadge } from '@/components/ui/notification-badge';
import { SearchBar } from '@/components/ui/search-bar';
import { NAVIGATION_CONFIG, ROLE_CONFIG, Role } from '@/constants/NAVIGATION';
import { useNavigationHotkeys } from '@/hooks/use-navigation-hotkeys';
import { useThemeContext } from '@/hooks/use-theme-context';

interface ResponsiveNavigationProps {
  children: React.ReactNode;
}

// Breakpoint for showing sidebar vs bottom nav
const SIDEBAR_BREAKPOINT = 768;

export function ResponsiveNavigation({ children }: ResponsiveNavigationProps) {
  const { resolvedTheme } = useThemeContext();
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const [notificationCount] = useState(3); // Mock notification count
  const [messageCount] = useState(2); // Mock message count
  const [currentRole, setCurrentRole] = useState<Role>(ROLE_CONFIG.roles[0]); // Default to Pilot
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [dimensionsReady, setDimensionsReady] = useState(false);
  const [showHelpOverlay, setShowHelpOverlay] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  // Handle initial responsive detection - assume large screen on web initially to prevent bottom nav flash
  useEffect(() => {
    if (Platform.OS === 'web') {
      // On web, assume large screen initially to prevent bottom nav flash
      setDimensionsReady(true);

      // Add resize listener for responsive updates on web
      const handleResize = () => {
        // Force re-render to recalculate responsive layout
        setDimensionsReady(true);
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    } else {
      // On mobile, wait for actual dimensions
      setDimensionsReady(true);
    }
  }, []);

  // Determine if we should show sidebar (large screens) or bottom nav (small screens)
  // On web, default to showing sidebar to prevent bottom nav flash, but still respect actual screen size
  const showSidebar = Platform.OS === 'web'
    ? (dimensionsReady ? width >= SIDEBAR_BREAKPOINT : true)  // Assume sidebar on web initially
    : (dimensionsReady && width >= SIDEBAR_BREAKPOINT);  // Only show sidebar on mobile if dimensions confirm large screen

  // Sidebar space is reserved when dimensions are ready and sidebar should be shown

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
    AlertUtils.showNotification(notificationCount, 'notification');
  };

  const handleMessagePress = () => {
    AlertUtils.showNotification(messageCount, 'message');
  };

  const handleTabPress = (href: string) => {
    router.push(href as any);
  };

  const handleRoleChange = (role: Role) => {
    setCurrentRole(role);
    // Here you could add logic to update permissions, load role-specific data, etc.
  };

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // TODO: Implement global search functionality
    // Could search across aircraft, aerodromes, documents, etc.
  };

  // Hotkey handlers
  const handleFocusSearch = () => {
    console.log('ResponsiveNavigation: handleFocusSearch called');
    // Focus the search bar in header if available
    if (dimensionsReady && showSidebar) {
      const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
      if (searchInput) {
        console.log('ResponsiveNavigation: Found search input, focusing');
        searchInput.focus();
        searchInput.select(); // Select all text for easy replacement
      } else {
        console.log('ResponsiveNavigation: Search input not found');
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

  // Get current tab index based on pathname and screen size
  const getCurrentTabIndex = () => {
    const tabItems = NAVIGATION_CONFIG.tabBar.items.filter(item => {
      const itemWithScreenProps = item as any;
      return item.visible && (showSidebar ? itemWithScreenProps.largeScreen : itemWithScreenProps.smallScreen);
    });
    const currentIndex = tabItems.findIndex(item => {
      // Handle root path
      if (item.href === '/(tabs)/' && pathname === '/') return true;
      // Handle other tab paths
      if (item.href && pathname.includes(item.href.replace('/(tabs)/', ''))) return true;
      return item.href === pathname;
    });
    return currentIndex >= 0 ? currentIndex : 0;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        barStyle={resolvedTheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
      />

      {/* Help Overlay */}
      {showHelpOverlay && (
        <View
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          backgroundColor="rgba(0, 0, 0, 0.5)"
          alignItems="center"
          justifyContent="center"
          zIndex={9999}
        >
          <View
            backgroundColor="$background"
            borderRadius="$4"
            padding="$6"
            margin="$4"
            maxWidth={400}
            shadowColor="$shadowColor"
            shadowOffset={{ width: 0, height: 10 }}
            shadowOpacity={0.25}
            shadowRadius={10}
          >
            <ThemedText type="title" textAlign="center" marginBottom="$4">
              Keyboard Shortcuts
            </ThemedText>

            <YStack gap="$3" marginBottom="$4">
              {Object.entries((NAVIGATION_CONFIG as any).hotkeys?.navigation || {}).map(([key, config]: [string, any]) => (
                <XStack key={key} justifyContent="space-between" alignItems="center">
                  <ThemedText color="$color">{config?.description}</ThemedText>
                  <ThemedText fontSize="$2" backgroundColor="$background" paddingHorizontal="$2" paddingVertical="$1" borderRadius="$2" style={{ fontFamily: 'monospace' }}>
                    {config?.keys?.toUpperCase()}
                  </ThemedText>
                </XStack>
              ))}

              {Object.entries((NAVIGATION_CONFIG as any).hotkeys?.actions || {}).map(([key, config]: [string, any]) => (
                <XStack key={key} justifyContent="space-between" alignItems="center">
                  <ThemedText color="$color">{config?.description}</ThemedText>
                  <ThemedText fontSize="$2" backgroundColor="$background" paddingHorizontal="$2" paddingVertical="$1" borderRadius="$2" style={{ fontFamily: 'monospace' }}>
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
        <View
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          backgroundColor="rgba(0, 0, 0, 0.5)"
          alignItems="center"
          justifyContent="center"
          zIndex={9998}
        >
          <View
            backgroundColor="$background"
            borderRadius="$4"
            padding="$6"
            margin="$4"
            width="90%"
            maxWidth={600}
            maxHeight="80%"
            shadowColor="$shadowColor"
            shadowOffset={{ width: 0, height: 10 }}
            shadowOpacity={0.25}
            shadowRadius={10}
          >
            <XStack justifyContent="space-between" alignItems="center" marginBottom="$4">
              <ThemedText type="title">GA-X AI Assistant</ThemedText>
              <Button size="$2" onPress={() => setIsAIModalOpen(false)}>
                <IconSymbol name="close" size={16} />
              </Button>
            </XStack>

            <ThemedText color="$color" opacity={0.8} marginBottom="$4">
              AI capabilities coming soon! This will provide intelligent assistance for flight planning,
              maintenance scheduling, document analysis, and more.
            </ThemedText>

            <YStack gap="$2" flex={1}>
              <ThemedText fontSize="$3" fontWeight="600" color="$tint">What AI can do:</ThemedText>
              <ThemedText color="$color">• Analyze flight patterns and suggest optimizations</ThemedText>
              <ThemedText color="$color">• Predict maintenance needs based on usage data</ThemedText>
              <ThemedText color="$color">• Generate flight plans considering weather and regulations</ThemedText>
              <ThemedText color="$color">• Cross-reference documents and find relevant information</ThemedText>
            </YStack>
          </View>
        </View>
      )}

      {/* Header - Full width */}
      <View
        backgroundColor="$background"
        borderBottomWidth="$0.5"
        borderBottomColor="$borderColor"
        position="relative"
        shadowColor="$shadowColor"
        shadowOffset={{ width: 0, height: 1 }}
        shadowOpacity={0.1}
        shadowRadius={2}
      >
        <XStack
          alignItems="center"
          justifyContent="space-between"
          paddingHorizontal={0}
          paddingVertical={0}
          minHeight={56}
          height="100%"
          position="relative"
        >
          {/* Left section - RoleSwitcher and News icon */}
          <XStack
            width={120}
            height="100%"
            alignItems="center"
            justifyContent="flex-start"
            gap="$2"
          >
            <RoleSwitcher
              currentRole={currentRole}
              onRoleChange={handleRoleChange}
            />
            {/* News icon - only on big screens */}
            {dimensionsReady && showSidebar && (
              <Button
                size="$2"
                backgroundColor="transparent"
                padding="$2"
                height="100%"
                onPress={AlertUtils.showAviationUpdates}
                hoverStyle={Platform.OS === 'web' ? {
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  transform: 'scale(1.02)',
                } : {
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  transform: 'scale(1.02)',
                }}
                pressStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  transform: 'scale(0.98)',
                }}
              >
                <IconSymbol
                  name="newspaper"
                  size={20}
                  color="$color"
                />
              </Button>
            )}
          </XStack>

          {/* Search bar - only on big screens */}
          {dimensionsReady && showSidebar && (
            <XStack height="100%" alignItems="center">
              <SearchBar
                onSearch={handleSearch}
                width={300}
              />
            </XStack>
          )}

          {/* GA-X title - centered on full header width */}
          <Button
            position="absolute"
            left={0}
            right={0}
            top={0}
            bottom={0}
            alignItems="center"
            justifyContent="center"
            backgroundColor="transparent"
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
            hoverStyle={Platform.OS === 'web' ? {
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              transform: 'scale(1.02)',
              cursor: 'pointer',
            } : {
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              transform: 'scale(1.02)',
            }}
            pressStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              transform: 'scale(0.98)',
            }}
            style={Platform.OS === 'web' ? { cursor: 'pointer' } : {}}
            accessibilityLabel="Navigate to home page"
            accessibilityRole="button"
          >
          <ThemedText
            type="title"
            textAlign="center"
            color={pathname === '/' ? "$tint" : "$color"}
            style={{
              userSelect: 'none',
            }}
          >
            GA-X
          </ThemedText>
          </Button>


          {/* Right section - notifications and profile */}
          <View width={70} height="100%" alignItems="flex-end" justifyContent="center">
            <XStack height="100%" alignItems="center" gap="$2">
              {/* Messages Icon */}
              <NotificationBadge
                count={messageCount}
                icon="message-text"
                onPress={handleMessagePress}
              />

              {/* Notification Bell Icon */}
              <NotificationBadge
                count={notificationCount}
                icon="bell"
                onPress={handleNotificationPress}
              />

              {/* Profile Menu */}
              <ProfileMenu />
            </XStack>
          </View>
        </XStack>
      </View>

      {/* Sidebar Backdrop - Click to collapse */}
      {dimensionsReady && showSidebar && sidebarExpanded && (
        <View
          position="absolute"
          left={72}
          top={0}
          bottom={0}
          right={0}
          backgroundColor="rgba(0, 0, 0, 0.1)"
          zIndex={999}
          onPress={() => setSidebarExpanded(false)}
          animation="quick"
          opacity={sidebarExpanded ? 1 : 0}
          pointerEvents={sidebarExpanded ? "auto" : "none"}
          transition="opacity 0.2s ease-in-out"
        />
      )}

      {/* Main Content Area - Fixed padding reserved immediately on web */}
      <View
        flex={1}
        paddingBottom={0}
        position="relative"
        paddingLeft={dimensionsReady && showSidebar ? 72 : 0}
        animation="quick"
        transition="padding-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      >
        {/* Sidebar Navigation - Overlays content on large screens */}
        {dimensionsReady && showSidebar && (
          <SidebarNavigation
            onNavigate={handleTabPress}
            onExpansionChange={setSidebarExpanded}
          />
        )}

        {/* Main Content */}
        {children}
      </View>

      {/* Bottom Tab Bar - Only on small screens */}
      {dimensionsReady && !showSidebar && (
        <View
          backgroundColor="$background"
          flexDirection="row"
          justifyContent="space-around"
          alignItems="center"
          paddingHorizontal="$4"
          paddingVertical="$2"
          borderTopWidth="$0.5"
          borderTopColor="$borderColor"
          shadowColor="$shadowColor"
          shadowOffset={{ width: 0, height: -1 }}
          shadowOpacity={0.1}
          shadowRadius={2}
        >
          {NAVIGATION_CONFIG.tabBar.items
            .filter(item => item.visible && (item as any).smallScreen)
            .map((item, index) => {
              const isActive = getCurrentTabIndex() === index;
              return (
                <Button
                  key={item.id}
                  flex={1}
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  paddingVertical="$2"
                  minHeight={64}
                  gap="$0.5"
                  backgroundColor="transparent"
                  onPress={() => handleTabPress(item.href)}
                  style={{
                    userSelect: 'none',
                  }}
                >
                  <IconSymbol
                    name={item.icon as any}
                    size={24}
                    color={isActive ? "$tint" : "$tabIconDefault"}
                  />
                  <ThemedText
                    fontSize="$2"
                    textAlign="center"
                    color={isActive ? "$tint" : "$tabIconDefault"}
                    style={{
                      userSelect: 'none',
                    }}
                  >
                    {item.name}
                  </ThemedText>
                </Button>
              );
            })}
        </View>
      )}
    </SafeAreaView>
  );
}

