import { Text, View } from "react-native";
import GetStarted from '../components/GetStarted'


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
