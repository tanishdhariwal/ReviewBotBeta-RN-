import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Dimensions, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Ionicons from '@expo/vector-icons/Ionicons';


const { width, height } = Dimensions.get('window');

export default function ChatBot() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);

  const hardcodedReply = "This is a hardcoded message";

  const sendMessage = () => {
    if (inputText.trim() === '') return;

    const newUserMessage = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
    };

    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setInputText('');

    // Simulate a delay before the AI responds
    setTimeout(() => {
      const newAIMessage = {
        id: (Date.now() + 1).toString(),
        text: hardcodedReply,
        isUser: false,
      };
      setMessages(prevMessages => [...prevMessages, newAIMessage]);
    }, 1000);
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);
  

  return (
    <LinearGradient
      colors={['#CE0075', '#0057FB', '#00FFEF']}
      style={styles.container}
    >
      <BlurView intensity={100} style={StyleSheet.absoluteFill} />

      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.replace('/ProductAnalysis')}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <Text style={styles.title}>EasyPick Chat</Text>

      <KeyboardAvoidingView
        style={{ flex: 1, width: '100%' }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.messageBubble, item.isUser ? styles.userBubble : styles.aiBubble]}>
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          )}
          contentContainerStyle={styles.chatContainer}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            placeholderTextColor="#888"
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: height * 0.05, // Adjust padding dynamically
  },
  backButton: {
    position: 'absolute',
    top: height * 0.05, // Adjust dynamically based on screen height
    left: width * 0.05, // Adjust dynamically based on screen width
    zIndex: 10,
  },
  title: {
    fontFamily: 'outfit-Bold',
    fontSize: width * 0.06, // Dynamically adjust font size
    color: 'white',
    textAlign: 'center',
    marginBottom: height * 0.03,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  chatContainer: {
    flexGrow: 1,
    width: width * 0.9, // Adjust width based on screen size
    alignSelf: 'center',
    paddingVertical: height * 0.02,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: width * 0.03, // Adjust padding dynamically
    borderRadius: width * 0.05, // Adjust radius dynamically
    marginVertical: height * 0.01,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  messageText: {
    color: 'white',
    fontFamily: 'outfit-Regular',
    fontSize: width * 0.04, // Adjust font size dynamically
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width * 0.9, // Adjust width dynamically
    alignSelf: 'center',
    marginBottom: height * 0.02, // Avoid overlap
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  input: {
    flex: 1,
    height: height * 0.07, // Adjust height dynamically
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: height * 0.035, // Adjust radius dynamically
    paddingHorizontal: width * 0.05,
    color: 'white',
    fontFamily: 'outfit-Regular',
    marginRight: width * 0.02,
  },
  sendButton: {
    width: height * 0.07,
    height: height * 0.07,
    backgroundColor: 'rgba(0, 122, 255, 0.8)',
    borderRadius: height * 0.035,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
