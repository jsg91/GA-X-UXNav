import { useEffect } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

export function HelloWave() {
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  useEffect(() => {
    // Animate the rotation with a repeating wave motion
    rotation.value = withRepeat(
      withTiming(25, { duration: 300 }),
      4, // Repeat 4 times
      true // Reverse the animation
    );
  }, [rotation]);

  return (
    <Animated.Text
      style={[{
        fontSize: 28,
        lineHeight: 32,
        marginTop: -6,
      }, animatedStyle]}>
      👋
    </Animated.Text>
  );
}
