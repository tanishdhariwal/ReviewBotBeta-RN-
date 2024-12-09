import { Stack } from "expo-router";
import {useFonts} from "expo-font";

export default function RootLayout() {

  useFonts({
    'outfit-Regular':require('./../assets/fonts/Outfit-Regular.ttf'),
    'outfit-Medium':require('./../assets/fonts/Outfit-Medium.ttf'),
    'outfit-Bold':require('./../assets/fonts/Outfit-Bold.ttf'),
  })


  return (
      <Stack screenOptions={{
        headerShown:false
      }}>
      <Stack.Screen name="index" options={{
        headerShown:false
      }}/>
    </Stack>
  );
}
