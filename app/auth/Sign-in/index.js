import { Text, TextInput, View, StyleSheet, ToastAndroid } from 'react-native'
import React, { useEffect, useState} from 'react'
import { useNavigation, useRouter } from 'expo-router'
import {Colors} from './../../../constants/Colors'
import { TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {auth} from './../../../configs/Firebase_Config'

export default function SignIn() {
    const navigation = useNavigation();
    const router = useRouter();

    const[email,setEmail] = useState();
    const[password,setPassword] = useState();

    useEffect(()=>{
        navigation.setOptions({headerShown:false})
    },[])   

const onSignIn=()=>{
    if(!email||!password)
    {
        ToastAndroid.show("Please enter all details",ToastAndroid.CENTER)
    }
signInWithEmailAndPassword(auth, email, password)
router.replace('/(tabs)/chatbot')
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    console.log(user);
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage,errorCode);
    if(errorCode=="auth/invalid-credential")
    {
        ToastAndroid.show("Invalid Credentials!",ToastAndroid.LONG)
    }
  });
}
  return (

    <View style = {{
        padding:'5%',
        paddingTop:'15%',
        backgroundColor:Colors.CREAM,
        height:'100%',
    }}>
        <TouchableOpacity 
        onPress={()=>router.back()}> 
        <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{
            fontFamily:'outfit-Bold',
            fontSize:30,
            textAlign:'justify',
            marginTop:20,

        }}>Let's Sign You in!</Text>
        
        <Text style={{
            fontFamily:'outfit-Bold',
            fontSize:30,
            textAlign:'justify',
            color:Colors.GRAY,
            marginTop:20,

        }}>Welcome Back!</Text>
        <Text style={{
            fontFamily:'outfit-Medium',
            fontSize:30,
            textAlign:'justify',
            marginTop:20,

        }}>You've been missed!</Text>
        <View style={{
            marginTop:'10%',
        }}>
            <Text style={{
                fontFamily:'outfit-Regular',
            }}>Email</Text>
            <TextInput onChangeText = {(value)=>setEmail(value)} style={styles.input} placeholder='Enter Email'/>

        </View>
        <View style={{
            marginTop:'10%',             
        }}>
            <Text style={{
                fontFamily:'outfit-Regular',
            }}>Password</Text>
            <TextInput 
            secureTextEntry={true}
            onChangeText = {(value)=>setPassword(value)}
            style={styles.input} 
            placeholder='Enter Password'/>

        </View>
        <TouchableOpacity onPress = {onSignIn} style = {{ 
            marginTop:'10%',
            padding:'5%',
            backgroundColor:Colors.BLACK,
            borderRadius:20,

        }}>
            <Text style = {{
                color:Colors.WHITE,
                fontFamily:'outfit-Bold',
                textAlign:'center', 
            }}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity 
        onPress={()=>router.replace('/auth/Sign-up')}
        style = {{
            marginTop:'10%',
            padding:'5%',
            borderWidth:1,
            borderRadius:20,

        }}>
            <Text style = {{
                fontFamily:'outfit-Regular',
                textAlign:'center', 
            }}>New user? Create Account</Text>
        </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    input:{
        padding:10,
        borderWidth:1,
        borderRadius:20,
        borderColor:Colors.GRAY,
        fontFamily:'outfit-Regular',

    }
})