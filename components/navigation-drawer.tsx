import React, { useEffect } from 'react';
import { Animated, Dimensions } from 'react-native';
import { PanGestureHandler, PanGestureHandlerGestureEvent, PanGestureHandlerStateChangeEvent, State } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { Button, ScrollView, View, XStack, YStack } from 'tamagui';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ICON_SIZES, MENU_ITEM_MIN_HEIGHT } from '@/constants/layout';
import { OPACITY } from '@/constants/opacity';
import { getIconColor } from '@/utils/icons';
import { INTERACTIVE_COLORS } from '@/utils/interactive-colors';
import { isTabActive } from '@/utils/navigation';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items?: Array<{
    id: string;
    name: string;
    href: string;
    icon: string;
    label: string;
    customPage?: boolean;
    comingSoon?: boolean;
  }>;
  groups?: Array<{
    name: string;
    icon: string;
    roles: Array<{
      id: string;
      name: string;
      href: string;
      icon: string;
      label: string;
      customPage?: boolean;
      comingSoon?: boolean;
    }>;
  }>;
  currentPath?: string;
  onNavigate?: (href: string) => void;
  onRoleSelect?: (roleId: string) => void;
  currentRoleId?: string;
  onSlideProgress?: (progress: number) => void;
  title?: string;
  onChangeRole?: () => void;
  showRoleHint?: boolean;
  children?: React.ReactNode;
  side?: 'left' | 'right';
}

const { width: screenWidth } = Dimensions.get('window');
const DRAWER_WIDTH = Math.min(300, screenWidth * 0.8);

export function NavigationDrawer({ isOpen, onClose, items, groups, currentPath, onNavigate, onRoleSelect, currentRoleId, onSlideProgress, title, onChangeRole, showRoleHint, children, side = 'right' }: NavigationDrawerProps) {
  const translateX = React.useRef(new Animated.Value(DRAWER_WIDTH)).current;

  useEffect(() => {
    // Reset the animated value when the drawer state changes
    translateX.setValue(isOpen ? 0 : DRAWER_WIDTH);

    Animated.spring(translateX, {
      toValue: isOpen ? 0 : DRAWER_WIDTH,
      useNativeDriver: true,
      tension: 65,
      friction: 10,
    }).start(() => {
      // Notify when animation completes
      onSlideProgress?.(isOpen ? 1 : 0);
    });

    // Add listener to track animation progress
    const listener = translateX.addListener(({ value }) => {
      const progress = 1 - (value / DRAWER_WIDTH);
      onSlideProgress?.(progress);
    });

    return () => {
      translateX.removeListener(listener);
    };
  }, [isOpen, translateX, onSlideProgress]);

  const onGestureEvent = Animated.event<PanGestureHandlerGestureEvent>(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: PanGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX, velocityX } = event.nativeEvent;
      const threshold = DRAWER_WIDTH * 0.3;
      
      // For right drawer: swipe right to close (translationX > 0)
      // For left drawer: swipe left to close (translationX < 0)
      const isSwipeClose = side === 'right' 
        ? (translationX > threshold || velocityX > 500)
        : (translationX < -threshold || velocityX < -500);

      if (isSwipeClose) {
        // Close drawer
        runOnJS(onClose)();
      } else {
        // Snap back to open
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 10,
        }).start();
      }
    }
  };

  const handleNavigate = (href: string) => {
    onNavigate?.(href);
    onClose();
  };

  const handleRoleSelect = (roleId: string) => {
    onRoleSelect?.(roleId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          opacity: translateX.interpolate({
            inputRange: [0, DRAWER_WIDTH],
            outputRange: [1, 0],
          }),
          zIndex: 1000,
        }}
        onTouchStart={onClose}
      />

      {/* Drawer */}
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            ...(side === 'left' ? { left: 0 } : { right: 0 }),
            bottom: 0,
            width: DRAWER_WIDTH,
            backgroundColor: '#ffffff',
            shadowColor: '#000',
            shadowOffset: { width: side === 'left' ? 2 : -2, height: 0 },
            shadowOpacity: 0.25,
            shadowRadius: 10,
            elevation: 16,
            transform: [{
              translateX: side === 'left' ? -translateX : translateX
            }],
            zIndex: 1001,
          }}
        >
          <View flex={1} backgroundColor="$backgroundSecondary">
            {/* Header */}
            <View
              padding="$4"
              borderBottomWidth={1}
              borderBottomColor="$borderColor"
            >
              <XStack alignItems="center" justifyContent="space-between">
                <ThemedText fontSize="$5" fontWeight="$6">
                  {title || 'Navigation'}
                </ThemedText>
                <Button
                  onPress={onClose}
                  backgroundColor="transparent"
                  padding="$1"
                  size="$2"
                >
                  <IconSymbol name="close" size={20} />
                </Button>
              </XStack>
            </View>

            {/* Navigation Items or Custom Content */}
            {children ? (
              <View flex={1}>{children}</View>
            ) : (
              <ScrollView flex={1} showsVerticalScrollIndicator={false}>
                <YStack gap="$1">
                  {groups ? (
                    // Render grouped roles
                    groups.map((group, groupIndex) => (
                      <YStack key={group.name}>
                        {/* Group Header */}
                        <YStack
                          backgroundColor={INTERACTIVE_COLORS.groupHeaderBackground}
                          borderTopColor={INTERACTIVE_COLORS.groupHeaderBorder}
                          borderTopWidth={groupIndex > 0 ? "$0.5" : 0}
                          justifyContent="center"
                          minHeight={MENU_ITEM_MIN_HEIGHT}
                          paddingHorizontal="$4"
                        >
                          <XStack alignItems="center" gap="$2.5">
                            <IconSymbol
                              name={group.icon as any}
                              color="#FFFFFF"
                              size={ICON_SIZES.large}
                            />
                            <ThemedText
                              style={{ opacity: OPACITY.subtle }}
                              color="#FFFFFF"
                              fontSize="$5"
                              fontWeight="$4"
                              marginLeft="$1"
                            >
                              {group.name}
                            </ThemedText>
                          </XStack>
                        </YStack>

                        {/* Group Roles */}
                        <YStack padding="$2">
                          {group.roles.map((role) => {
                            const isSelected = currentRoleId === role.id;
                            const isComingSoon = role.comingSoon;

                            return (
                              <Button
                                key={role.id}
                                onPress={() => {
                                  if (isComingSoon) return; // Don't allow selection of coming soon items
                                  handleRoleSelect(role.id);
                                }}
                                backgroundColor={isSelected ? 'rgba(0, 122, 255, 0.1)' : 'transparent'}
                                borderRadius="$3"
                                padding="$3"
                                alignItems="center"
                                justifyContent="flex-start"
                                minWidth="100%"
                                opacity={isComingSoon ? 0.6 : 1}
                              >
                                <XStack alignItems="center" gap="$3" width="100%">
                                  <IconSymbol
                                    name={role.icon as any}
                                    color={isComingSoon ? '#888888' : (isSelected ? '$tint' : '#FFFFFF')}
                                    size={20}
                                  />
                                  <ThemedText
                                    color={isComingSoon ? '#888888' : (isSelected ? '$tint' : '#FFFFFF')}
                                    fontSize="$4"
                                    fontWeight={isSelected ? '$6' : '$4'}
                                    flex={1}
                                    textAlign="left"
                                  >
                                    {role.label}
                                  </ThemedText>
                                  {isComingSoon && (
                                    <IconSymbol
                                      name="clock-outline"
                                      color="#888888"
                                      size={16}
                                    />
                                  )}
                                </XStack>
                              </Button>
                            );
                          })}
                        </YStack>
                      </YStack>
                    ))
                  ) : (
                    // Render flat items (for navigation)
                    <YStack gap="$1" padding="$2">
                      {items?.map((item) => {
                        const isRoleSelection = !!onRoleSelect;
                        const isSelected = isRoleSelection
                          ? currentRoleId === item.id
                          : isTabActive(item.href || '', currentPath || '');

                        const isComingSoon = item.comingSoon;

                        return (
                          <Button
                            key={item.id}
                            onPress={() => {
                              if (isComingSoon) return; // Don't allow selection of coming soon items
                              if (isRoleSelection) {
                                handleRoleSelect(item.id);
                              } else {
                                handleNavigate(item.href || '');
                              }
                            }}
                            backgroundColor={isSelected ? 'rgba(0, 122, 255, 0.1)' : 'transparent'}
                            borderRadius="$3"
                            padding="$3"
                            alignItems="center"
                            justifyContent="flex-start"
                            minWidth="100%"
                            opacity={isComingSoon ? 0.6 : 1}
                          >
                            <XStack alignItems="center" gap="$3" width="100%">
                              <IconSymbol
                                name={(item.icon || (item as any).icon) as any}
                                color={isComingSoon ? '#888888' : getIconColor(isSelected, 'light')}
                                size={20}
                              />
                              <ThemedText
                                color={isComingSoon ? '#888888' : getIconColor(isSelected, 'light')}
                                fontSize="$4"
                                fontWeight={isSelected ? '$6' : '$4'}
                                flex={1}
                                textAlign="left"
                              >
                                {item.label}
                              </ThemedText>
                              {isSelected && (
                                <IconSymbol
                                  name="check"
                                  color="$tint"
                                  size={16}
                                />
                              )}
                              {isComingSoon && (
                                <IconSymbol
                                  name="clock-outline"
                                  color="#888888"
                                  size={16}
                                />
                              )}
                            </XStack>
                          </Button>
                        );
                      })}
                    </YStack>
                  )}
                </YStack>
              </ScrollView>
            )}

            {/* Footer with hints */}
            {(showRoleHint || onRoleSelect) && (
              <View
                padding="$4"
                paddingBottom="$6"
                borderTopWidth={1}
                borderTopColor="$borderColor"
                gap="$3"
              >
                {onRoleSelect ? (
                  <ThemedText
                    fontSize="$3"
                    color="$color"
                    opacity={0.7}
                    textAlign="center"
                  >
                    App navi  
                  </ThemedText>
                ) : showRoleHint ? (
                  <>
                    <ThemedText
                      fontSize="$3"
                      color="$color"
                      opacity={0.7}
                      textAlign="center"
                    >
                      Missing features? Change role or report bug/idea
                    </ThemedText>
                    <XStack gap="$2">
                      <Button
                        flex={1}
                        onPress={() => {
                          onClose();
                          onChangeRole?.();
                        }}
                        backgroundColor="$blue500"
                        borderRadius="$3"
                        padding="$3"
                      >
                        <ThemedText
                          color="white"
                          fontSize="$4"
                          fontWeight="$5"
                          textAlign="center"
                        >
                          Change Role
                        </ThemedText>
                      </Button>
                      <Button
                        flex={1}
                        onPress={() => {
                          // TODO: Implement bug/idea reporting
                          console.log('Report bug/idea clicked');
                        }}
                        backgroundColor="$gray500"
                        borderRadius="$3"
                        padding="$3"
                      >
                        <ThemedText
                          color="white"
                          fontSize="$4"
                          fontWeight="$5"
                          textAlign="center"
                        >
                          Report Issue
                        </ThemedText>
                      </Button>
                    </XStack>
                  </>
                ) : null}
              </View>
            )}
          </View>
        </Animated.View>
      </PanGestureHandler>
    </>
  );
}
