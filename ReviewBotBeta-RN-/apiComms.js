// apiComms.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Alert } from "react-native";

// Set the base URL for axios requests

axios.defaults.baseURL = "http://192.168.1.15:5000"; // Replace with your backend URL

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
    Alert.alert("Logged in successfully");
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
      headers: { "device-type": "Mobile", "Content-Type": "application/json", "token" : AsyncStorage.getItem("token") },
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