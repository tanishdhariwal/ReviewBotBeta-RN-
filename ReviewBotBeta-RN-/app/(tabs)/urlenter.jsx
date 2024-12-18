import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  FlatList,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import ProfileDropdown from "./../../components/ProfileDropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { checkURL, getUserChats } from "../../apiComms";

const { width, height } = Dimensions.get("window");

export default function URLEnter() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  const [productData, setProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [userChats, setUserChats] = useState([]);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const user = await AsyncStorage.getItem("user");
        if (user !== null) {
          setUserName(JSON.parse(user).username);
        }
      } catch (error) {
        console.error("Failed to fetch user from AsyncStorage", error);
      }
    };

    fetchUserName();
  }, []);

  const fetchUserChats = async () => {
    try {
      const response = await getUserChats();
      setUserChats(response);
      setModalVisible(true);
    } catch (error) {
      console.error('Failed to fetch user chats:', error);
    }
  };

  const handleChatPress = async (asin) => {
    await AsyncStorage.setItem('asin', asin);
    setModalVisible(false);
    router.push('/ProductAnalysis');
  };

  const validateAndSubmit = () => {
    if (!url) {
      setError("Please enter a URL");
      return;
    }

    const asinRegex = /\/([A-Z0-9]{10})(?=\/|$|\?)/;
    const match = url.match(asinRegex);
    return match ? { asin: match[1] } : { asin: "false" };
  };
  const handleNavigateToReviewChat = async () => {
    if (url !== "") {
      try {
        const validationResponse = validateAndSubmit(url);
        if (validationResponse.asin !== "false") {
          //setIsLoading(true);
          const data = await checkURL({ asin: validationResponse.asin });
          const asin = validationResponse.asin;
          if (data.isValid) {
            await AsyncStorage.setItem("asin", asin);
            //navigate(`/analysis`, { state: { asin: validationResponse.asin } });
            router.push("/ProductAnalysis", { asin: validationResponse.asin });
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "android" || "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar style="light" />
      <LinearGradient
        colors={["#1a1a1a", "#000000"]}
        style={styles.background}
      />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.logoContainer}
        >
          <Image
            source={require("./../../assets/images/Group 1.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <ProfileDropdown userName={userName} />
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Enter Product URL</Text>
          <Text style={styles.subtitle}>
            Paste an Amazon.com product URL to start analyzing reviews{" "}
            {userName}
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="https://www.amazon.com/..."
              placeholderTextColor="#888"
              value={url}
              onChangeText={(text) => {
                setUrl(text);
                setError("");
              }}
              autoCapitalize="none"
              keyboardType="url"
            />
            <TouchableOpacity
              style={styles.pasteButton}
              onPress={async () => {
                const clipboardContent = await Clipboard.getStringAsync();
                setUrl(clipboardContent);
              }}
            >
              <Ionicons name="clipboard-outline" size={20} color="#00FFEF" />
            </TouchableOpacity>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={styles.analyzeButton}
            onPress={handleNavigateToReviewChat}
          >
            <LinearGradient
              colors={["#00FFEF", "#0057FB"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.analyzeButtonText}>Analyze Reviews</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.userChatsButton}
            onPress={fetchUserChats}
          >
            <LinearGradient
              colors={["#00FFEF", "#0057FB"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.userChatsButtonText}>View Previous Chats</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Previous Chats</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={userChats}
              keyExtractor={(item) => item.product_asin_no}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.chatTile}
                  onPress={() => handleChatPress(item.product_asin_no)}
                >
                  <View>
                    <Text style={styles.chatTitle}>{item.title}</Text>
                    <Text style={styles.chatDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#666" />
                </TouchableOpacity>
              )}
              style={styles.chatList}
            />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: height,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 20,
  },
  logoContainer: {
    height: 40,
  },
  logo: {
    height: "100%",
    width: 100,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 500,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
    fontFamily: "outfit-Bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#CCCCCC",
    textAlign: "center",
    marginBottom: 24,
    fontFamily: "outfit-Regular",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    width: "100%",
  },
  input: {
    flex: 1,
    height: 50,
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "outfit-Regular",
  },
  pasteButton: {
    padding: 8,
  },
  errorText: {
    color: "#FF4444",
    fontSize: 14,
    marginBottom: 16,
    fontFamily: "outfit-Regular",
  },
  analyzeButton: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
  },
  buttonGradient: {
    paddingVertical: 14,
    alignItems: "center",
  },
  analyzeButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "outfit-Bold",
  },
  userChatsButton: {
    width: "100%",
    marginTop: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  userChatsButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "outfit-Bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: '50%',
    maxHeight: '80%',
    width: '100%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2d3436',
    fontFamily: "outfit-Bold",
  },
  closeButton: {
    padding: 5,
  },
  chatList: {
    marginTop: 10,
  },
  chatTile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 4,
    fontFamily: "outfit-Regular",
  },
  chatDate: {
    fontSize: 14,
    color: '#636e72',
    fontFamily: "outfit-Regular",
  },
});
