import { Text, View } from "react-native";
import GetStarted from '../components/GetStarted';
import axios from 'axios';
// Remove Firebase auth import
// import { auth } from '../configs/Firebase_Config';
// Import custom auth functions if needed
// import { checkAuthStatus } from './../utils/auth';
// ...existing code...
axios.defaults.baseURL = "http://192.168.235.125:5000";
axios.defaults.withCredentials = true;
export default function Index() {
  // ...existing code...

  // Adjust authentication logic as needed
  // For example, check if the user is logged in using custom auth
  // const user = await checkAuthStatus(); // Ensure this function is adjusted for React Native

  return (
    <View 
      style={{
        flex: 1
        // ...existing code...
      }}
    >
      <GetStarted/>
    </View>
  );
}
