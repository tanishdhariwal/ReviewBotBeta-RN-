// apiComms.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Alert } from "react-native";

// Set the base URL for axios requests

axios.defaults.baseURL = `http://${process.env.EXPO_PUBLIC_BACKEND_URL}:5000`; // Replace with your backend URL

// export default axios;

export const LoginUser = async (userData) => {
  try {
    console.log("Logging in user with data: ", userData);
    const { email, password } = userData;
    console.log(email);
    const response = await axios.post(
      `/login`,
      { email: email, password: password },
      {
        headers: {
          "Content-Type": "application/json",
          "Device-Type": "Mobile",
        },
      }
    );
    if (response.status != 200) {
      Alert.alert("Error Invalid Credentials");
    }
    // Alert.alert("Logged in successfully");
    return response;
  } catch (error) {
    Alert.alert("An error occurred. Please try again.", response.status);

    // throw error;
  }
};

export const SignUpUser = async (userData) => {
  // const toastId = toast.loading("Signing up...", { duration: Infinity });
  console.log("SigningUP");
  try {
    //   const { username, email, password } = userData;
    console.log(userData);
    const response = await axios.post(`/signup`, userData);
    //   toast.dismiss(toastId);
    if (response.status === 201) {
      // toast.success("Sign up successful! Please log in.", { duration: 4000 });
      Alert.alert("Sign up successful! Please log in.");
    }
    return response.data;
  } catch (error) {
    //   toast.dismiss(toastId);
    //   toast.error(error.message || "Sign up failed. Please try again.");
    Alert.alert("Sign up failed. Please try again.");

    throw error;
  }
};

export const checkURL = async (asinData) => {
  try {
    const response = await axios.post(`/product_url_validation`, asinData, {
      headers: { "device-type": "Mobile", "Content-Type": "application/json", "authorization" : AsyncStorage.getItem("user") },
    });
    if (!response.data.isValid) {
      toast.error("Unable to help right now");
    }
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.error || "Validation failed.");
    throw error;
  }
};


export const getProduct = async (asin) => {
  try {
    const userjson = await AsyncStorage.getItem("user");
    const user = JSON.parse(userjson);
    console.log(user.token);
    console.log(asin);
    const response = await axios.get(`/get_product/${asin}`, { headers: { "device-type": "Mobile", "Content-Type": "application/json", "authorization" : user.token }},);
    console.log(response.data);
    return response.data;
  } catch (error) {
    // toast.error(error.response?.data?.error || "Failed to fetch product details.")
    Alert.alert("Failed to fetch product details.");
    throw error;
  }
};

export const get_user_chat = async (UID_ASIN_PAYLOAD) => {
  try {
    const userjson = await AsyncStorage.getItem("user");
    const user = JSON.parse(userjson);
    console.log(user.token);
    const response = await axios.post(`/get_user_chat`, UID_ASIN_PAYLOAD, { headers: { "device-type": "Mobile", "Content-Type": "application/json", "authorization" : user.token }},);
    return response.data;
  } catch (error) {
    // toast.error("Failed to load chat history");
    Alert.alert("Failed to load chat history");
    throw error;
  }
};

export const getChatResponse = async (payload) => {
  try {
    const userjson = await AsyncStorage.getItem("user");
    const user = JSON.parse(userjson);
    console.log(user.token);
    const response = await axios.post(`/chat_response`, payload,  { headers: { "device-type": "Mobile", "Content-Type": "application/json", "authorization" : user.token }},);
    return response.data;
  } catch (error) {
    // toast.error("Failed to get response. Please try again.");
    Alert.alert("Failed to get response. Please try again.");
    throw error;
  }
};

export const getUserChats = async () => {
  try {
    const userjson = await AsyncStorage.getItem("user");
    const user = JSON.parse(userjson);
    console.log(user.token);
    const response = await axios.get(`/get_user_chats`, { headers: { "device-type": "Mobile", "Content-Type": "application/json", "authorization" : user.token }},);
    console.log(response.data);
    return response.data;
  } catch (error) {
    // toast.error('Error fetching user chats.');
    Alert.alert("Error fetching user chats.");
    throw error;
  }
};

export const deleteUserChat = async (asin) => {
  try {
    const userjson = await AsyncStorage.getItem("user");
    const user = JSON.parse(userjson);
    console.log(user.token);
    const response = await axios.delete(`/delete_user_chat/${asin}`, { headers: { "device-type": "Mobile", "Content-Type": "application/json", "authorization" : user.token }});
    Alert.alert("Chat deleted successfully");
    return response.data;
  } catch (error) {
    Alert.alert("Failed to delete chat.");
    throw error;
  }
};