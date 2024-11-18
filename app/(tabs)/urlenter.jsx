import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Animated, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useNavigation, useRouter } from 'expo-router';
import { Menu, MenuItem } from 'react-native-material-menu';

const { width, height } = Dimensions.get('window');

const validateUrl = (url) => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname.includes('amazon.com');
  } catch (e) {
    return false;
  }
};

export default function UrlEnter() {
  const [url, setUrl] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const inputAnimation = React.useRef(new Animated.Value(0)).current;
  const [menuVisible, setMenuVisible] = useState(false);
  const username = "User123"; // Replace with actual username logic

  const navigation = useNavigation();
  const router = useRouter();
  const handleSend = () => {
    console.log('URL entered:', url);
    console.log('Validation result:', validateUrl(url));

    if (validateUrl(url)) {
      router.push('/chatbot');
      console.log('Sending URL:', url);
      setUrl('');
    } else {
      Alert.alert('Invalid URL', 'Please enter a valid Amazon product URL.');
    }
  };

  const showMenu = () => setMenuVisible(true);
  const hideMenu = () => setMenuVisible(false);
  const handleLogout = () => {
    hideMenu();
    router.replace('/./../auth/Sign-in');
  };

  const inputScale = inputAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  });

  return (
    <LinearGradient
    colors={['#CE0075', '#0057FB', '#00FFEF']}
      style={styles.container}
    >
      <BlurView intensity={100} style={StyleSheet.absoluteFill} />
      
      <Menu
        visible={menuVisible}
        anchor={
          <TouchableOpacity style={styles.profileButton} onPress={showMenu}>
            <Ionicons name="person-circle-outline" size={32} color="white" />
          </TouchableOpacity>
        }
        onRequestClose={hideMenu}
      >
        <MenuItem disabled>{username}</MenuItem>
        <MenuItem onPress={handleLogout}>Logout</MenuItem>
      </Menu>

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
    marginTop: '-70%',
    marginLeft: '70%',
  },
});
