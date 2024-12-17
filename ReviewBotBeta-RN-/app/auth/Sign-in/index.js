import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRouter } from 'expo-router';

import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { LoginUser } from '../../../apiComms';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');



export default function SignIn() {
  const navigation = useNavigation();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const formOpacity = useSharedValue(0);
  const formTranslateY = useSharedValue(50);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
    formOpacity.value = withSpring(1);
    formTranslateY.value = withSpring(0);
  }, []);

  const formAnimatedStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
    transform: [{ translateY: formTranslateY.value }],
  }));

  const onSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Please enter all details");
      return;
    }

    try {

      // const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const payload = { email, password };
      const response = await LoginUser(payload);
      // storing the response in AsyncStorage
      console.log(response);
      await AsyncStorage.setItem('user', JSON.stringify(response.data));
      console.log(response);

      router.replace('/(tabs)/urlenter');
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        alert("Invalid Credentials!");
      } else {
        alert("An error occurred. Please try again.");
      }

    }
  };

  const onForgotPassword = async () => {
    if (!email) {
      Alert.alert("Please enter your email address");
      return;
    }
    try {
      // Implement forgot password logic using custom auth
      // For example, if you have a function sendPasswordResetEmail in your custom auth
      await sendPasswordResetEmail(email); // Make sure to define this function in your custom auth
      Alert.alert("Password reset email sent!");
    } catch (error) {
      console.log(error.message);
      Alert.alert("An error occurred. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "android"||"ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar style="light" />
      <LinearGradient
        colors={['#1a1a1a', '#000000']}
        style={styles.background}
      />
      <ScrollView 
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.logoContainer}>
          <Image
            source={require('./../../../assets/images/Group 1.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </TouchableOpacity>
        
        <View style={styles.content}>
          <Animated.View
            entering={FadeInUp.duration(1000).springify()}
            style={styles.header}
          >
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue your AI-powered shopping experience</Text>
          </Animated.View>

          <Animated.View style={[styles.form, formAnimatedStyle]}>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#00FFEF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#00FFEF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#888"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color="#00FFEF" 
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.forgotPassword} onPress={onForgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.signInButton}
              onPress={onSignIn}
            >
              <LinearGradient
                colors={['#00FFEF', '#0057FB']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.signInButtonText}>Sign In</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.createAccount}
              onPress={() => router.replace('/auth/Sign-up')}
            >
              <Text style={styles.createAccountText}>
                Don't have an account? <Text style={styles.createAccountTextBold}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  logo: {
    width: width * 0.6,
    height: 50,
  },
  content: {
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#00FFEF',
    textAlign: 'center',
  },
  form: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 20,
    paddingBottom: 8,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
  },
  eyeIcon: {
    padding: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#00FFEF',
    fontSize: 14,
  },
  signInButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  buttonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  signInButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  createAccount: {
    alignItems: 'center',
  },
  createAccountText: {
    color: '#CCCCCC',
    fontSize: 14,
  },
  createAccountTextBold: {
    color: '#00FFEF',
    fontWeight: 'bold',
  },
});

