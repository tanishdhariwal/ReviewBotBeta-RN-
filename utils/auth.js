import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Alert } from "react-native";

export const LoginUser = async (userData) => {
  try {
    const { email, password } = userData;
    console.log("inside auth");
    const response = await axios.post(
      `/login`,
      {
        headers: {
          "Content-Type": "application/json",
          "Device-type": "Mobile",
        },
      },
      { email, password }
    );
    console.log("after method")
    if (response.status !== 200) {
      Alert.alert("Invalid credentials");
    } else {
      const user = { userName: response.username, email: response.email };
      AsyncStorage.setItem("user", JSON.stringify(response.data));
      Alert.alert("Logged in successfully");
    }
    console.log(response.data.message);
    return response.data;
  } catch (error) {
    Alert.alert("Server Issue.");
    throw error;
  }
};

export const SignUpUser = async (userData) => {
  try {
    const { username, email, password } = userData;
    const response = await axios.post(`/signup`, { username, email, password });
    if (response.status === 201) {
      Alert.alert("Sign up successful! Please log in.");
    }
    return response.data;
  } catch (error) {
    Alert.alert(error.message || "Sign up failed. Please try again.");
    throw error;
  }
};

export const checkAuthStatus = async () => {
  try {
    const response = await axios.get(`/authstatus`);
    if (response.status === 200) {
      return response.data; // Should return user data if authenticated
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const LogoutUser = async () => {
  try {
    const response = await axios.get(`/logout`);
    if (response.status !== 200) {
      Alert.alert("Unable to logout");
      throw new Error("Unable to Logout");
    }
    Alert.alert("Logout successful");
  } catch (error) {
    Alert.alert("An error occurred");
    throw error;
  }
};

// ...Include the rest of the custom auth functions, adjusted for React Native...
