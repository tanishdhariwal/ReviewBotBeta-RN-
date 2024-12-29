import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { ActivityIndicator, View } from 'react-native';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'outfit-Regular': require('./../assets/fonts/Outfit-Regular.ttf'),
    'outfit-Medium': require('./../assets/fonts/Outfit-Medium.ttf'),
    'outfit-Bold': require('./../assets/fonts/Outfit-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

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
