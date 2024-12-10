import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const Shape = ({ size, color, initialPosition }) => {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);

  React.useEffect(() => {
    translateY.value = withRepeat(
      withTiming(Math.random() * 40 - 20, {
        duration: 2000 + Math.random() * 2000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
    translateX.value = withRepeat(
      withTiming(Math.random() * 40 - 20, {
        duration: 2000 + Math.random() * 2000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.shape,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          ...initialPosition,
        },
        animatedStyle,
      ]}
    />
  );
};

export default function FloatingShapes() {
  return (
    <View style={styles.container}>
      <Shape size={20} color="rgba(255, 255, 255, 0.2)" initialPosition={{ top: 20, left: 40 }} />
      <Shape size={30} color="rgba(255, 255, 255, 0.15)" initialPosition={{ top: 60, right: 60 }} />
      <Shape size={15} color="rgba(255, 255, 255, 0.25)" initialPosition={{ top: 100, left: 80 }} />
      <Shape size={25} color="rgba(255, 255, 255, 0.1)" initialPosition={{ top: 40, right: 100 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height,
    zIndex: 1,
  },
  shape: {
    position: 'absolute',
  },
});

