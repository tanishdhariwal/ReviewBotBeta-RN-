import { Text, TextInput, View, StyleSheet, ToastAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRouter } from 'expo-router'
import {Colors} from './../../../constants/Colors'
import { TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {auth} from './../../../configs/Firebase_Config'

export default function SignUp() {
  const navigation = useNavigation();
  const router = useRouter();


  useEffect(()=>{
     navigation.setOptions({
      headerShown:false
     })
  },[])
  const [email,setEmail] = useState();
  const [password,setPassword] = useState();
  const [Name,setName] = useState();

const onCreateAccount=()=>{

    if(!email||!password||!Name)
    {
        ToastAndroid.show("Please enter all details",ToastAndroid.CENTER);
        return;
    }
createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    console.log(user);
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage,errorCode);
    // ..
  });
  }


  return (
    <View
    style={{
      backgroundColor:Colors.CREAM,
      padding:'5%',
      paddingTop:'15%',
      height:'100%',
      alignContent:'center'
      
    }}>
       <TouchableOpacity 
        onPress={()=>router.back()}> 
        <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      <Text
      style={{
        fontFamily:'outfit-Bold',
        fontSize:30,
        marginTop:'15%',
        textAlign:'justify',
      }}>Create new Account</Text>

<View style={{
            marginTop:'10%',
        }}>
            <Text style={{
                fontFamily:'outfit-Regular',
            }}>    Name</Text>
            <TextInput style={styles.input} placeholder='Enter name'
            onChangeText={(value=>setName(value))}/>

        </View>

<View style={{
            marginTop:'10%',
        }}>
            <Text style={{
                fontFamily:'outfit-Regular',
            }}>    Email</Text>
            <TextInput style={styles.input} placeholder='Enter Email'
            onChangeText={(value=>setEmail(value))}/>

        </View>
        <View style={{
            marginTop:'10%',             
        }}>
            <Text style={{
                fontFamily:'outfit-Regular',
            }}>    Password</Text>
            <TextInput
            secureTextEntry={true}
             style={styles.input} placeholder='Enter Password'
             onChangeText={(value=>setPassword(value))}/>

        </View>
        <TouchableOpacity onPress={onCreateAccount} style = {{
            marginTop:'10%',
            padding:'5%',
            backgroundColor:Colors.BLACK,
            borderRadius:20,

        }}>
            <Text style = {{
                color:Colors.WHITE,
                fontFamily:'outfit-Bold',
                textAlign:'center', 
            }}>Create Account</Text>
        </TouchableOpacity>
        <TouchableOpacity 
        onPress={()=>router.replace('auth/Sign-in')}
        style = {{
            marginTop:'10%',
            padding:'5%',
            borderWidth:1,
            borderRadius:20,

        }}>
            <Text style = {{
                fontFamily:'outfit-Regular',
                textAlign:'center', 
            }}>Sign In</Text>
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