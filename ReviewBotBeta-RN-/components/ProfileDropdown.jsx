import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../configs/Firebase_Config';
import { useRouter } from 'expo-router';

export default function ProfileDropdown({ userName }) {
  userName = auth.currentUser.displayName;
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.profileButton} 
        onPress={() => setIsOpen(!isOpen)}
      >
        <Image
          source={require('./../assets/images/icon.png')}
          style={styles.avatar}
        />
        <Text style={styles.userName}>{userName}</Text>
        <Ionicons 
          name={isOpen ? "chevron-up" : "chevron-down"} 
          size={20} 
          color="#00FFEF" 
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdown}>
          <TouchableOpacity 
            style={styles.dropdownItem}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color="#00FFEF" />
            <Text style={styles.dropdownText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    position: 'relative',

  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  userName: {
    color: '#FFFFFF',
    marginRight: 8,
    fontSize: 14,
    fontFamily: 'outfit-Regular',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: 8,
    backgroundColor: 'rgba(26, 26, 26, 0.95)',
    borderRadius: 12,
    padding: 8,
    minWidth: 150,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  dropdownText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'outfit-Regular',
  },
});

