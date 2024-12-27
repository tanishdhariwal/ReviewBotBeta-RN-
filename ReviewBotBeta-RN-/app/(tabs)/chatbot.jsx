import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Dimensions, KeyboardAvoidingView, Platform, Keyboard, SafeAreaView, Clipboard, BackHandler } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { getProduct, getChatResponse, get_user_chat } from '../../apiComms';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TypingAnimation } from 'react-native-typing-animation'; // Ensure correct import
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function ChatBot() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef(null);
  const [product, setProduct] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    async function checkUserSession() {
      try {
        let asin = await AsyncStorage.getItem('asin');
        console.log(asin);
        const productData = await getProduct(asin);
        setProduct(productData);
      } catch (error) {
        console.error('Failed to fetch product details:', error);
      }
    }
    checkUserSession();
  }, []);

  useEffect(() => {
    async function fetchChats() {
      try {
        console.log("checking")
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
    }
    fetchChats();
  }, [product]);

  useEffect(() => {
    const backAction = () => {
      router.back();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [router]);

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
    setIsTyping(true);

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
      setIsTyping(false);
    }
  };

  const copyToClipboard = async (text) => {
    await Clipboard.setString(text);
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

  const renderItem = ({ item }) => (
    <View 
      style={[
        styles.messageContainer, 
        item.isUser ? styles.userMessageContainer : styles.aiMessageContainer
      ]}
    >
      <View 
        style={[
          styles.messageRow, 
          item.isUser ? styles.userMessageRow : styles.aiMessageRow
        ]}
      >
        {!item.isUser && (
          <View style={styles.profileIcon}>
            <MaterialCommunityIcons name="robot" size={24} color="#00FFEF" />
          </View>
        )}
        <View 
          style={[
            styles.messageBubble, 
            item.isUser ? styles.userBubble : styles.aiBubble
          ]}
        >
          <Text style={styles.messageText}>{item.text}</Text>
        </View>
        {item.isUser && (
          <View style={styles.profileIcon}>
            <MaterialCommunityIcons name="account-circle" size={24} color="#00FFEF" />
          </View>
        )}
      </View>
      {!item.isUser && (
        <View style={styles.copySection}>
          <TouchableOpacity 
            style={styles.copyButton}
            onPress={() => copyToClipboard(item.text)}
          >
            <Ionicons name="copy-outline" size={24} color="#00FFEF" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <LinearGradient
          colors={['#1a1a1a', '#000000']}
          style={styles.background}
        />
        <View style={styles.header}>
          <Animated.Text 
            entering={FadeInDown.duration(1000).springify()}
            style={styles.title}
          >
            ChatBot
          </Animated.Text>
        </View>
        <Animated.View 
          entering={FadeInUp.duration(1000).springify()}
          style={styles.chatContainer}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.flatListContent}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            showsVerticalScrollIndicator={false}
          />
          {isTyping && (
            <View style={styles.typingIndicatorContainer}>
              <TypingAnimation 
                dotColor="#00FFEF" 
                dotMargin={5} 
                dotAmplitude={3} 
                dotSpeed={0.15} 
                //dotRadius={3} 
                dotX={12} 
                dotY={6} 
              />
            </View>
          )}
        </Animated.View>
        <Animated.View 
          entering={FadeInUp.duration(1000).springify()}
          style={styles.inputContainer}
        >
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            placeholderTextColor="#888"
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <LinearGradient
              colors={['#00FFEF', '#0057FB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.sendButtonGradient}
            >
              <Ionicons name="send" size={24} color="black" />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
    //paddingTop: Platform.OS === 'android' ? height * 0.02 : 0, // Add padding for Android
  },
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: height,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: height * 0.02,
    paddingBottom: height * 0.02,
  },
  backButton: {
    position: 'absolute',
    left: width * 0.05,
    zIndex: 10,
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'outfit-Bold',
    fontSize: width * 0.06,
    color: '#00FFEF',
    textAlign: 'center',
  },
  chatContainer: {
    flex: 1,
    width: width,
    paddingHorizontal: 0, // Remove horizontal padding
  },
  flatListContent: {
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.02, // Add some horizontal padding to the list
  },
  messageContainer: {
    marginVertical: 4,
    width: '100%',
  },
  userMessageContainer: {
    alignItems: 'flex-end',
    paddingLeft: '15%', // Give space on the left for user messages
  },
  aiMessageContainer: {
    alignItems: 'flex-start',
    paddingRight: '15%', // Give space on the right for AI messages
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  userMessageRow: {
    justifyContent: 'flex-end',
  },
  aiMessageRow: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginHorizontal: 8,
  },
  userBubble: {
    backgroundColor: 'rgba(0, 123, 255, 0.2)',
    borderBottomRightRadius: 4, // Sharper corner for user messages
  },
  aiBubble: {
    backgroundColor: 'rgb(0, 156, 176)',
    borderBottomLeftRadius: 4,
    padding : 10,
    paddingRight: 35, // Increase right padding for AI messages
     // Sharper corner for AI messages
  },
  profileIcon: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 156, 176, 0.2)',
    borderRadius: 16,
    marginHorizontal: 4,
  },
  messageText: {
    color: '#FFFFFF',
    fontFamily: 'outfit-Regular',
    fontSize: width * 0.04,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.01,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  input: {
    flex: 1,
    height: height * 0.06,
    color: '#FFFFFF',
    fontFamily: 'outfit-Regular',
    marginRight: width * 0.02,
    fontSize: width * 0.04,
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
    borderRadius: height * 0.03,
    paddingHorizontal: width * 0.03,
  },
  sendButton: {
    width: height * 0.06,
    height: height * 0.06,
    borderRadius: height * 0.03,
    overflow: 'hidden',
  },
  sendButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typingIndicatorContainer: {
    padding: 10,
    marginLeft: 10,
    alignSelf: 'flex-start',
    backgroundColor: 'rgb(0, 156, 176)',
    borderRadius: 20,    marginBottom: 10,  },  typingIndicatorText: {    color: '#888',
    fontFamily: 'outfit-Regular',
    fontSize: width * 0.04,
  },
  copySection: {
    alignSelf: 'flex-end',
    marginRight: '5%',
    marginTop: 2,
  },
  copyButton: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    padding: 10,
    borderRadius: 12,
  },
});
