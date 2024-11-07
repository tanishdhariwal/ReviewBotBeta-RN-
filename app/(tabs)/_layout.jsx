import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      headerShown:false
    }}>
        <Tabs.Screen name = "myTrip"
        options={{
          //tabBarIcon:({color})=>
        }}/>        
        <Tabs.Screen name = "Discover"/>        
        <Tabs.Screen name = "profle"/>        

    </Tabs>
  )
}