import { Text, View } from "react-native";
import Login from '../components/Login'
import {auth} from './../configs/Firebase_Config'
import { Redirect } from "expo-router";
export default function Index() {

  return (
    <View
      style={{
        flex: 1

      }}
    >
      <Login/>
    </View>
  );
}
