import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useNavigation, useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function UrlEnter() {
  const [url, setUrl] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const inputAnimation = React.useRef(new Animated.Value(0)).current;

  const handleSend = () => {
    console.log('Sending URL:', url);
    setUrl('');
  };
  const navigation = useNavigation();
  const router = useRouter();

  const inputScale = inputAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  });

  return (
    <LinearGradient
      colors={['#D16BA5', '#86A8E7', '#5FFBF1']}
      style={styles.container}
    >
      <BlurView intensity={100} style={StyleSheet.absoluteFill} />
      
      <TouchableOpacity style={styles.profileButton}>
        <Ionicons name="person-circle-outline" size={32} color="white" />
      </TouchableOpacity>

      <Text style={styles.title}>Easy Pick Chatbot</Text>

      <Animated.View style={[styles.inputContainer, { transform: [{ scale: inputScale }] }]}>
        <TextInput
          style={styles.input}
          value={url}
          onChangeText={setUrl}
          placeholder="Enter Amazon product URL"
          placeholderTextColor="#888"

        />
        <TouchableOpacity 
          style={[styles.sendButton, inputFocused && styles.sendButtonActive]} 
          onPress={handleSend}
        >
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    color: 'black',
    marginBottom: 40,
    fontFamily:'outfit-Bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    paddingHorizontal: 15,
    width: width * 0.8,
    maxWidth: 400,
    height: 60,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: 'white',
  },
  sendButton: {
    backgroundColor: 'rgba(0, 122, 255, 0.8)',
    borderRadius: 50,
    padding: 10,
    marginLeft: 10,
  },
  sendButtonActive: {
    backgroundColor: 'rgba(0, 122, 255, 1)',
  },
  profileButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
});
