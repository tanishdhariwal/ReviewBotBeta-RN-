import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Dimensions, KeyboardAvoidingView, Platform, Keyboard, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getProduct, getChatResponse, get_user_chat } from '../../apiComms';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function ChatBot() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef(null);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        let asin = await AsyncStorage.getItem('asin');
        Alert.alert(asin);
        console.log(asin);
        const productData = await getProduct(asin); // Use the provided ASIN
        setProduct(productData);
      } catch (error) {
        console.error('Failed to fetch product details:', error);
      }
    };

    fetchProduct();
  }, []);

  useEffect(() => {
    const fetchExistingChats = async () => {
      try {
        const asin = await AsyncStorage.getItem('asin');
        const data = await get_user_chat({ product_asin: asin });
        if (data && data.exchanges && data.exchanges.length > 0) {
          const messages = data.exchanges.flatMap((exchange, index) => {
            const msgs = [];
            if (exchange.user_query && exchange.user_query.trim()) {
              msgs.push({
                id: `${index}-user`,
                text: exchange.user_query,
                isUser: true,
              });
            }
            if (exchange.bot_response && exchange.bot_response.trim()) {
              msgs.push({
                id: `${index}-bot`,
                text: exchange.bot_response,
                isUser: false,
              });
            }
            return msgs;
          });
          setMessages(messages);
        } else {
          setMessages([
            { id: '1', text: "Hello! How can I assist you today?", isUser: false },
          ]);
        }
      } catch (error) {
        console.error('Error fetching existing chats:', error);
        setMessages([
          { id: '1', text: "Hello! How can I assist you today?", isUser: false },
        ]);
      }
    };

    fetchExistingChats();
  }, [product]);

  const sendMessage = async () => {
    if (inputText.trim() === '') return;

    const newUserMessage = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
    };

    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const asin = await AsyncStorage.getItem('asin');
      const data = await getChatResponse({ currentMessage: inputText, productASIN: asin });
      const newAIMessage = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        isUser: false,
      };
      setMessages(prevMessages => [...prevMessages, newAIMessage]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
    } finally {
      setIsLoading(false);
    }
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
      colors={['#FFFFFF', '#FFFFFF', '#FFFFFF']}
      style={styles.container}
    >
      <BlurView intensity={100} style={StyleSheet.absoluteFill} />

      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="black " />
      </TouchableOpacity>

      <Text style={styles.title}>ChatBot</Text>

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
    color: 'black',
    textAlign: 'center',
    marginBottom: height * 0.03,
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
    color: 'black',
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
  input: {
    flex: 1,
    height: height * 0.07, // Adjust height dynamically
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: height * 0.035, // Adjust radius dynamically
    paddingHorizontal: width * 0.05,
    color: 'black',
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
