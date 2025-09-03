import React from 'react';
import { ActivityIndicator, Image, Platform, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect } from "expo-router";
import { images } from '../constants';
import { useAuthContext } from '../context/AuthProvider';
// StatusBar is managed in RootLayout, so it's not needed here.
// import { StatusBar } from 'expo-status-bar'; 
import { useColorScheme } from 'nativewind';
// We are not using the push notification data on this screen.
// import { usePushNotifications } from '../hooks/usePushNotifications';

export default function Welcome() {
  const { colorScheme } = useColorScheme();
  const { loading, isLogged } = useAuthContext();
  const osName = Platform.OS;

  // The push notification hook can be removed if the token/data isn't used here.
  // const { expoPushToken, notification } = usePushNotifications();
  // const data = JSON.stringify(notification, undefined, 2);

  if (loading) {
    // This loading screen implementation is excellent.
    return (
      <SafeAreaView className="bg-primary dark:bg-black h-full">
        <View className="w-full justify-center items-center h-full">
          <Image source={colorScheme === 'light' ? images.full_icon : images.full_icon_dark} className="w-[240px]" resizeMode='contain' />
          <View className="absolute bottom-20">
            <ActivityIndicator
              animating={true}
              color={colorScheme === 'light' ? "#0038C0" : "white"}
              size={osName === "ios" ? "large" : 50}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (isLogged) {
    // CORRECTED: Redirect to the home screen inside the (tabs) layout group.
    return <Redirect href="/(tabs)/home" />;
  } else {
    return <Redirect href="/sign-in" />;
  }
}