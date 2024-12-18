import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import GetStarted from '../components/GetStarted';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
export default function Index() {
  const [user, setUser] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      setUser(storedUser);
      if (storedUser) {
        router.push('/(tabs)/urlenter');
      }
    };
    checkUser();
  }, []);

  return (
    <View 
      style={{
        flex: 1
      }}
    >
      <GetStarted />
    </View>
  );
}
