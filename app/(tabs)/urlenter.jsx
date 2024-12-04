import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Animated, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { Menu, MenuItem } from 'react-native-material-menu';
import {auth} from './../../configs/Firebase_Config';
const { width } = Dimensions.get('window');
const userrr = auth.currentUser;
const validateUrl = (url) => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname.includes('a');
  } catch (e) {
    return false;
  }
  console.log(userrr);
};

export default function UrlEnter() {
  const [url, setUrl] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();

  const handleSend = () => {
    if (validateUrl(url)) {
      router.push('/ProductAnalysis');
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
  
  return (
    <LinearGradient
      colors={['#FDF1E6', '#FAD6A5', '#F4A997']}
      style={styles.container}
    >
      <BlurView intensity={100} style={StyleSheet.absoluteFill} />

      <View style={styles.profileMenuContainer}>
        <Menu
          visible={menuVisible}
          anchor={
            <TouchableOpacity style={styles.profileButton} onPress={showMenu}>
              <Ionicons name="person-circle-outline" size={45} color="white" />
            </TouchableOpacity>
          }
          onRequestClose={hideMenu}
          style={styles.menu}
        >
          <MenuItem disabled style={styles.menuItem}>{userrr}</MenuItem>
          <MenuItem onPress={handleLogout} style={styles.menuItem}>
            Logout
          </MenuItem>
        </Menu>
      </View>

      <Text style={styles.title}>Summarize Reviews</Text>

      <Animated.View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={url}
          onChangeText={setUrl}
          placeholder="Enter Amazon product URL"
          placeholderTextColor="#888"
        />
        <TouchableOpacity 
          style={styles.sendButton} 
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
  profileMenuContainer: {
    position: 'absolute',
    top: 60, // Adjust to place menu below icon
    right: 20,
  },
  menu: {
    marginTop: 50, // Ensures dropdown is below the icon
    backgroundColor: 'black', // Menu color remains white
    borderRadius: 8,
    elevation: 5, // Adds subtle shadow for better visibility
  },
  menuItem: {
    color: 'black', // Text color for items
    fontSize: 16,
    padding: 10,
  },
  profileButton: {
    alignSelf: 'flex-end',
  },
  title: {
    fontSize: 32,
    color: 'black',
    marginBottom: 40,
    fontFamily: 'outfit-Bold',
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
    color: 'black',
  },
  sendButton: {
    backgroundColor: 'rgba(0, 122, 255, 0.8)',
    borderRadius: 50,
    padding: 10,
    marginLeft: 10,
  },
});
