import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions, 
  Animated, 
  Image 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';

const { width, height } = Dimensions.get('window');

export default function GetStarted() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a1a', '#000000']}
        style={styles.background}
      />
      <View style={styles.content}>
        <MotiView
          from={{
            opacity: 0,
            scale: 0.5,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            type: 'timing',
            duration: 1000,
          }}
          style={styles.logoContainer}
        >
          <Image
            source={require('./../assets/images/Group 1.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </MotiView>

        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.subtitle}>AI-Powered Shopping Assistant</Text>
          <Text style={styles.description}>
            Make informed decisions with our AI-driven review analysis and personalized shopping recommendations
          </Text>
        </Animated.View>

        <MotiView
          from={{
            opacity: 0,
            scale: 0.8,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            type: 'timing',
            duration: 800,
            delay: 400,
          }}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.replace('auth/Sign-in')}
          >
            <LinearGradient
              colors={['#00FFEF', '#0057FB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </LinearGradient>
          </TouchableOpacity>
        </MotiView>

        <MotiView
          from={{
            opacity: 0,
          }}
          animate={{
            opacity: 0.6,
          }}
          transition={{
            type: 'timing',
            duration: 800,
            delay: 800,
          }}
        >
          <Text style={styles.footnote}>
          Revolutionized through AI-driven insights
          </Text>
        </MotiView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: height,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  logo: {
    width: width * 0.7,
    height: 60,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'outfit-Regular',
    color: '#00FFEF',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    fontFamily: 'outfit-Regular',
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 20,
    maxWidth: width * 0.8,
  },
  button: {
    width: width * 0.8,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 20,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
    fontFamily: 'outfit-Bold',
  },
  footnote: {
    fontSize: 14,
    fontFamily: 'outfit-Regular',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

