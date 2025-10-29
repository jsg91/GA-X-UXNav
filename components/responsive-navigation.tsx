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
  // Get first visible role from groups (fallback if getAllRoles is not available)
  const getFirstVisibleRole = (): Role => {
    for (const group of ROLE_CONFIG.groups) {
      const visibleRole = group.roles.find(role => role.visible);
      if (visibleRole) return visibleRole;
    }
    // Fallback to first role if none visible (shouldn't happen)
    return ROLE_CONFIG.groups[0]?.roles[0] || { id: 'pilot', name: 'Pilot', icon: 'airplane', label: 'Pilot', visible: true };
  };
  const [currentRole, setCurrentRole] = useState<Role>(getFirstVisibleRole()); // Default to first visible role
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  // Initialize dimensionsReady as true for mobile platforms to ensure bottom nav shows immediately
  const [dimensionsReady, setDimensionsReady] = useState(Platform.OS !== 'web');
  const [hasMeasuredDimensions, setHasMeasuredDimensions] = useState(false);
  const [showHelpOverlay, setShowHelpOverlay] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

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

        window.addEventListener('resize', handleResize);
        return () => {
          if (typeof window !== 'undefined' && typeof window.removeEventListener === 'function') {
            window.removeEventListener('resize', handleResize);
          }
        };
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

  const handleSearchResultSelect = (result: any) => {
    console.log('Search result selected:', result);
    if (result.href) {
      router.push(result.href as any);
    }
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
        backgroundColor="transparent"
        barStyle={resolvedTheme === 'dark' ? 'light-content' : 'dark-content'}
      />

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
        <View
          alignItems="center"
          backgroundColor="rgba(0, 0, 0, 0.5)"
          bottom={0}
          justifyContent="center"
          left={0}
          position="absolute"
          right={0}
          top={0}
          zIndex={9998}
        >
          <View
            backgroundColor="$background"
            borderRadius="$4"
            margin="$4"
            maxHeight="80%"
            maxWidth={600}
            padding="$6"
            shadowColor="$shadowColor"
            shadowOffset={{ width: 0, height: 10 }}
            shadowOpacity={0.25}
            shadowRadius={10}
            width="90%"
          >
            <XStack alignItems="center" justifyContent="space-between" marginBottom="$4">
              <ThemedText type="title">GA-X AI Assistant</ThemedText>
              <Button size="$2" onPress={() => setIsAIModalOpen(false)}>
                <IconSymbol name="close" size={16} />
              </Button>
            </XStack>

            <ThemedText color="$color" marginBottom="$4" opacity={0.8}>
              AI capabilities coming soon! This will provide intelligent assistance for flight planning,
              maintenance scheduling, document analysis, and more.
            </ThemedText>

            <YStack flex={1} gap="$2">
              <ThemedText color="$tint" fontSize="$3" fontWeight="600">What AI can do:</ThemedText>
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
          >
            <RoleSwitcher
              currentRole={currentRole}
              onRoleChange={handleRoleChange}
            />
            
            {/* News icon - only on big screens */}
            {(Platform.OS === 'web' || (dimensionsReady && showSidebar)) && (
              <Button
                onPress={AlertUtils.showAviationUpdates}
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
                  color="$color"
                  size={24}
                />
              </Button>
            )}

            {/* Search bar - only on big screens */}
            {(Platform.OS === 'web' || (dimensionsReady && showSidebar)) && (
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
            marginVertical="$1"
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
          >
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
        </XStack>
      </View>

      {/* Sidebar Backdrop - Click to collapse */}
      {dimensionsReady && showSidebar && sidebarExpanded && (
        <View
          onPress={() => setSidebarExpanded(false)}
          animation="quick"
          backgroundColor="rgba(0, 0, 0, 0.1)"
          bottom={0}
          left={72}
          opacity={sidebarExpanded ? 1 : 0}
          pointerEvents={sidebarExpanded ? "auto" : "none"}
          position="absolute"
          right={0}
          top={0}
          transition="opacity 0.2s ease-in-out"
          zIndex={999}
        />
      )}

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
            onExpansionChange={setSidebarExpanded}
            onNavigate={handleTabPress}
          />
        )}

        {/* Main Content */}
        {children}
      </View>

      {/* Bottom Tab Bar - Only on small screens */}
      {dimensionsReady && !showSidebar && (
        <View
          alignItems="center"
          backgroundColor="$background"
          borderTopColor="$borderColor"
          borderTopWidth="$0.5"
          flexDirection="row"
          justifyContent="space-around"
          paddingHorizontal="$4"
          paddingVertical="$2"
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
                  style={{
                    userSelect: 'none',
                  }}
                  onPress={() => handleTabPress(item.href)}
                  alignItems="center"
                  backgroundColor="transparent"
                  flex={1}
                  flexDirection="column"
                  gap="$0.5"
                  justifyContent="center"
                  minHeight={64}
                  paddingVertical="$2"
                >
                  <IconSymbol
                    name={item.icon as any}
                    color={isActive ? "$tint" : "$tabIconDefault"}
                    size={24}
                  />
                  <ThemedText
                    style={{
                      userSelect: 'none',
                    }}
                    color={isActive ? "$tint" : "$tabIconDefault"}
                    fontSize="$2"
                    textAlign="center"
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

