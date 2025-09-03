import { Redirect, Stack } from "expo-router";
import { Loader } from "../../components";
import { useAuthContext } from "../../context/AuthProvider";
import * as Application from 'expo-application';
import { Text, View } from "react-native";

const isDev = process.env.EXPO_PUBLIC_API_BASE_URL == "https://hrmdev.heliosadvisory.com/api";
const isUat = process.env.EXPO_PUBLIC_API_BASE_URL == "https://hrmuat.heliosadvisory.com/api";

const AuthLayout = () => {
  const { loading, isLogged } = useAuthContext();

  // CORRECTED: Redirect to the home screen inside the (tabs) layout group.
  if (!loading && isLogged) return <Redirect href="/(tabs)/home" />;

  return (
    <>
      <Stack>
        <Stack.Screen
          name="sign-in"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="sign-up"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      <Loader isLoading={loading} />
      
      <View className="items-center p-2 w-full bg-primary dark:bg-black">
        <Text className="dark:text-gray-100 font-semibold text-center">
          Version:{" "}
          {isDev
            ? `${Application.nativeApplicationVersion}-DEV`
            : isUat
              ? `${Application.nativeApplicationVersion}-UAT`
              : Application.nativeApplicationVersion || "N/A"
          }
        </Text>
      </View>
    </>
  );
};

export default AuthLayout;