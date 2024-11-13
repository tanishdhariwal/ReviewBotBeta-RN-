import React, { useState, useEffect, useRef } from 'react';
import { Text, TextInput, View, StyleSheet, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { Colors } from './../../../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from './../../../configs/Firebase_Config';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

export default function SignUp() {
  const navigation = useNavigation();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const nameAnimation = useRef(new Animated.Value(0)).current;
  const emailAnimation = useRef(new Animated.Value(0)).current;
  const passwordAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);


  const onCreateAccount = () => {
    if (!name || !email || !password) {
      alert("Please enter all details");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        router.replace('/(tabs)/urlenter');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage, errorCode);
        alert(errorMessage);
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
        <Text style={styles.title}>Create New Account</Text>
        <Text style={styles.subtitle}>Join our community!</Text>

        <Animated.View style={[styles.inputContainer, { transform: [{ scale: nameAnimation.interpolate({ inputRange: [0, 1], outputRange: [1, 1.05] }) }] }]}>
          <TextInput
            style={styles.input}
            placeholder="Enter Name"
            placeholderTextColor="#888"
            onChangeText={(value) => setName(value)}
          />
        </Animated.View>

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
            secureTextEntry={true}
            onChangeText={(value) => setPassword(value)}
          />
        </Animated.View>

        <TouchableOpacity style={styles.signUpButton} onPress={onCreateAccount}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.signInButton}
          onPress={() => router.replace('auth/Sign-in')}
        >
          <Text style={styles.signInText}>Already have an account? Sign In</Text>
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
    marginBottom: 20,
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
  signUpButton: {
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
  signInButton: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  signInText: {
    fontFamily: 'outfit-Regular',
    color: 'black',
    fontSize: 14,
    textAlign: 'center',
  },
});