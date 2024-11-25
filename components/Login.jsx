import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

export default function Login(){
    const router = useRouter();
  return (
    <LinearGradient
      colors={['#CE0075', '#0057FB', '#00FFEF']}
      style={styles.container}
    >
      <BlurView intensity={100} style={StyleSheet.absoluteFill} />
      <View style={styles.innerContainer}>
        <Image source={require('./../assets/images/image.png')}
          style={{
              width:'100%',
              height:'50%',
          }}
        />
        <View style={styles.contentContainer}>
          <Text style={{
              fontSize:30,
              fontFamily:"outfit-Bold",
              textAlign:'center',
              color:Colors.BLACK
          }}>EasyPick </Text>
          <Text style={{
              marginTop:0,
              padding:20,
              fontSize:15,
              fontFamily:"outfit-Regular",    
              textAlign:'center',
              color:Colors.RANDOM
          }}>Experience the future of shopping with ReviewBot: Your AI-driven companion for insightful, efficient, and informed purchasing!</Text>
          <TouchableOpacity style={styles.button}
              onPress={()=>router.push('auth/Sign-in')}
          >
              <Text style = {{
                  padding:15,
                  color:Colors.WHITE,
                  textAlign:'center',
                  fontFamily:"outfit-Regular",
                  fontSize:20,
              }}>Get started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    innerContainer:{
        flex: 1,
    },
    gradientContainer:{
        marginTop:'-20%',
        borderTopLeftRadius:50,
        borderTopRightRadius:50,
        height:'100%',
        overflow: 'hidden',
    },
    contentContainer:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    button:{
        marginTop:'15%',
        backgroundColor:Colors.BLACK,
        borderRadius:20,
    }
})