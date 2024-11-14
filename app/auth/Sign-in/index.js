import React, { useState, useEffect, useRef } from 'react';
import { Text, TextInput, View, StyleSheet, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { Colors } from './../../../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from './../../../configs/Firebase_Config';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

export default function SignIn() {
  const navigation = useNavigation();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const emailAnimation = useRef(new Animated.Value(0)).current;
  const passwordAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  const onSignIn = () => {
    if (!email || !password) {
      // Use Alert.alert for iOS compatibility
      alert("Please enter all details");
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        router.replace('/(tabs)/urlenter');
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage, errorCode);
        if (errorCode === "auth/invalid-credential") {
          alert("Invalid Credentials!");
        }
      });
  };

  return (
    <LinearGradient
      colors={['#CE0075', '#0057FB', '#00FFEF']}
      style={styles.container}
    >
      <BlurView intensity={100} style={StyleSheet.absoluteFill} />

      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Let's Sign You in!</Text>
        <Text style={styles.subtitle}>Welcome Back!</Text>
        <Text style={styles.subtitle}>You've been missed!</Text>

        <Animated.View style={[styles.inputContainer, { transform: [{ scale: emailAnimation.interpolate({ inputRange: [0, 1], outputRange: [1, 1.05] }) }] }]}>
          <TextInput
            style={styles.input}
            placeholder="Enter Email"
            placeholderTextColor="#888"
            onChangeText={(value) => setEmail(value)}
          />
        </Animated.View>

        <Animated.View style={[styles.inputContainer, { transform: [{ scale: passwordAnimation.interpolate({ inputRange: [0, 1], outputRange: [1, 1.05] }) }] }]}>
          <TextInput
            style={styles.input}
            placeholder="Enter Password"
            placeholderTextColor="#888"
            secureTextEntry={!showPassword}
            onChangeText={(value) => setPassword(value)}
          />
          <TouchableOpacity 
            style={styles.eyeIcon} 
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons 
              name={showPassword ? 'eye-off' : 'eye'} 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity style={styles.signInButton} onPress={onSignIn}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.createAccountButton}
          onPress={() => router.replace('/auth/Sign-up')}
        >
          <Text style={styles.createAccountText}>New user? Create Account</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  content: {
    width: width * 0.8,
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'outfit-Bold',
    fontSize: 32,
    color: 'white',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontFamily: 'outfit-Bold',
    fontSize: 24,
    color: 'white',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  inputContainer: {
    width: '100%',
    marginTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 60,
    justifyContent: 'center',
    shadowColor: "#000",
  },
  input: {
    fontFamily: 'outfit-Regular',
    fontSize: 16,
    color: 'white',
  },
  signInButton: {
    marginTop: 30,
    backgroundColor: 'rgba(0, 122, 255, 0.8)',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    shadowColor: "#000",
  },
  buttonText: {
    fontFamily: 'outfit-Bold',
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  createAccountButton: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  createAccountText: {
    fontFamily: 'outfit-Regular',
    color: 'text',
    fontSize: 16,
    textAlign: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});