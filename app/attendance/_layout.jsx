import { Stack } from "expo-router";
import { useColorScheme } from 'nativewind';

const AttendanceLayout = () => {
    const { colorScheme } = useColorScheme();
    const headerBackgroundColor = colorScheme === 'light' ? '#fff' : '#000';
    const headerTextColor = colorScheme === 'light' ? '#000' : '#CDCDE0';

    return (
        <Stack
            // 1. Define common options here
            screenOptions={{
                headerStyle: { backgroundColor: headerBackgroundColor },
                headerTintColor: headerTextColor,
            }}
        >
            {/* 2. Now, each screen only needs to define what's unique to it */}
            <Stack.Screen name="index" options={{ title: "Attendance" }} />
            <Stack.Screen name="view" options={{ title: "Attendance" }} />
            <Stack.Screen name="regularization" options={{ title: "Regularization" }} />
        </Stack>
    );
}

export default AttendanceLayout;