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
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import ProfileDropdown from "./../../components/ProfileDropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { checkURL, getProduct } from "../../apiComms";
import * as Clipboard from "expo-clipboard";


const { width, height } = Dimensions.get("window");

export default function URLEnter() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  const [productData, setProduct] = useState(null);
  //const [isLoading, setIsLoading] = useState(false);

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
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        let asin = await AsyncStorage.getItem('asin');
        const productData = await getProduct(asin); // Use the provided ASIN
        setProduct(productData);
      } catch (error) {
        console.error('Failed to fetch product details:', error);
      }
    };

    fetchProduct();
  }, []);
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
          if (data.isValid) {
            AsyncStorage.setItem("asin", validationResponse.asin);
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
          onPress={() => router.push("/urlenter")}
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
        </View>
      </View>
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
});
