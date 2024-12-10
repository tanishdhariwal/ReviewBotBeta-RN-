import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Animated, Dimensions, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Menu, MenuItem } from 'react-native-material-menu';
import { auth } from './../../configs/Firebase_Config';
import FloatingShapes from './../../components/FloatingShapes';
import ProductSection from './../../components/ProductSection';

const { width, height } = Dimensions.get('window');
const user = auth.currentUser;

const validateUrl = (url) => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname.includes('amazon');
  } catch (e) {
    return false;
  }
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
      colors={['#4A00E0', '#8E2DE2']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
            <MenuItem disabled style={styles.menuItem}>{user?.email}</MenuItem>
            <MenuItem onPress={handleLogout} style={styles.menuItem}>
              Logout
            </MenuItem>
          </Menu>
        </View>

        <Text style={styles.title}>Summarize Reviews</Text>

        <Animated.View style={styles.card}>
          <View style={styles.inputContainer}>
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
          </View>
        </Animated.View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/TopRatedProducts')}>
            <Ionicons name="star" size={24} color="white" />
            <Text style={styles.buttonText}>Top Rated</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/RecentlyViewedProducts')}>
            <Ionicons name="time" size={24} color="white" />
            <Text style={styles.buttonText}>Recently Viewed</Text>
          </TouchableOpacity>
        </View>

        <ProductSection title="Top Rated Products" />
        <ProductSection title="Recently Viewed Products" />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 40,
  },
  profileMenuContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  menu: {
    marginTop: 50,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 5,
  },
  menuItem: {
    color: '#4A00E0',
    fontSize: 16,
    padding: 10,
  },
  profileButton: {
    alignSelf: 'flex-end',
  },
  title: {
    fontSize: 32,
    color: 'white',
    marginBottom: 40,
    fontFamily: 'outfit-Bold',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    width: width * 0.9,
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: "#000",
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
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 15,
    width: '100%',
    height: 50,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  sendButton: {
    backgroundColor: '#4A00E0',
    borderRadius: 50,
    padding: 10,
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 30,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    width: '40%',
  },
  buttonText: {
    color: 'white',
    marginTop: 5,
    fontSize: 16,
    fontFamily: 'outfit-Medium',
  },
});

