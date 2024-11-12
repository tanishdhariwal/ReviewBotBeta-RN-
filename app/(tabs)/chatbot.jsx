import { View, Text } from 'react-native'
import React from 'react'
import { useNavigation, useRouter } from 'expo-router'

export default function ChatBot() {
  const navigation = useNavigation();
  const router = useRouter();
  
  return (
    <View>
      <Text>ChatBot</Text>
    </View>
  )
}