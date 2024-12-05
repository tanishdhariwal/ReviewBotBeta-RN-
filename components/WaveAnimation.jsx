import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function WaveAnimation() {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 5000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(progress.value, [0, 1], [0, -15]) }],
  }));

  const waveAnimatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(progress.value, [0, 1], [0, -width]) }],
  }));

  const createWavePath = () => {
    const waveHeight = 20;
    const points = [];
    for (let i = 0; i <= width + 100; i += 10) {
      const y = Math.sin((i / width) * 4 * Math.PI) * waveHeight;
      points.push(`${i},${y + height * 0.2}`);
    }
    return `M0,${height * 0.2} ${points.join(' ')} V0 H0 Z`;
  };

  return (
    <View style={styles.container}>
      <ExpoLinearGradient
        colors={['#4A00E0', '#8E2DE2']}
        style={StyleSheet.absoluteFillObject}
      />
      <Animated.View style={[styles.waveContainer, animatedStyles]}>
        <Svg height={height * 0.2 + 20} width={width * 2}>
          <Defs>
            <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor="#4A00E0" stopOpacity="1" />
              <Stop offset="1" stopColor="#8E2DE2" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Animated.View style={waveAnimatedStyles}>
            <Path d={createWavePath()} fill="url(#grad)" />
          </Animated.View>
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.2,
    overflow: 'hidden',
    zIndex: 5,
  },
  waveContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.2 + 20,
  },
});

