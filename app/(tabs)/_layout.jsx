import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { Ionicons, MaterialIcons, MaterialCommunityIcons, Feather, FontAwesome } from '@expo/vector-icons';
import { useColorScheme } from "nativewind";
import { useAuthContext } from "../../context/AuthProvider";
import { Dropdown } from 'react-native-element-dropdown';

// This is a helper component for your custom header
const HeaderTitle = ({ title, colorScheme, user }) => {
    const router = useRouter();
    const [approvalTitle, setApprovalTitle] = useState("My Approvals");

    const approvalOptions = [
        { label: 'My Approvals', value: 'My Approvals' },
        { label: 'My Requests', value: 'My Requests' }
    ];

    const handleApprovalChange = (value) => {
        setApprovalTitle(value);
        // You can use router.setParams if needed, but managing state locally is often simpler
    };

    const avatarExists = user?.avatar && user?.avatar?.trim() !== '';
    const headerTextColor = colorScheme === "light" ? "black" : "#CDCDE0";

    return (
        <View className="flex-row items-center ml-4">
            <TouchableOpacity onPress={() => router.push('/my-profile')}>
                {avatarExists ? (
                    <Image source={{ uri: user?.avatar }} className="w-10 h-10 rounded-full mr-2" />
                ) : (
                    <View className="w-10 h-10 rounded-full mr-2 bg-secondary justify-center items-center">
                        <Text className="text-white text-lg font-bold">{user?.name?.charAt(0)?.toUpperCase()}</Text>
                    </View>
                )}
            </TouchableOpacity>
            {title === "Approvals" ? (
                <View className="font-bold ml-2 w-[180px]">
                    <Dropdown
                        data={approvalOptions}
                        labelField="label"
                        valueField="value"
                        value={approvalTitle}
                        onChange={item => handleApprovalChange(item.value)}
                        selectedTextStyle={{ fontSize: 21, fontWeight: '600', color: headerTextColor }}
                        renderRightIcon={() => <FontAwesome name="chevron-down" size={18} color={headerTextColor} />}
                    />
                </View>
            ) : (
                <Text className="text-xl font-bold ml-2 dark:text-gray-100">{title}</Text>
            )}
        </View>
    );
};

// This is a helper component for your header right icons
const HeaderRight = ({ colorScheme }) => {
    const router = useRouter();
    const iconColor = colorScheme === "light" ? "black" : "white";
    // Dummy unread count for display
    const unreadCount = 0;

    return (
        <View className="flex-row items-center mr-4">
            <TouchableOpacity className="mr-4" onPress={() => router.push("/organization?focus=yes")}>
                <MaterialIcons name="search" size={24} color={iconColor} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/notifications")}>
                <MaterialCommunityIcons name="bell-outline" size={24} color={iconColor} />
                {unreadCount > 0 && (
                    <View className="absolute -right-1 -top-1 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center">
                        <Text className="text-white text-[10px] font-bold">{unreadCount > 9 ? "9+" : unreadCount}</Text>
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );
};


const TabLayout = () => {
    const { colorScheme } = useColorScheme();
    const { user } = useAuthContext();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: colorScheme === "light" ? "#0038C0" : "white",
                tabBarInactiveTintColor: "#737373",
                tabBarStyle: {
                    backgroundColor: colorScheme === "light" ? "#fff" : "#000",
                    height: 80,
                    borderTopColor: colorScheme === "light" ? "#E5E7EB" : "#27272A",
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    paddingBottom: 10,
                },
                tabBarIconStyle: {
                    marginTop: 10
                },
                headerStyle: {
                    backgroundColor: colorScheme === "light" ? "#fff" : "#000",
                },
                headerTitle: "", // We use a custom header component instead
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    headerLeft: () => <HeaderTitle title="Home" colorScheme={colorScheme} user={user} />,
                    headerRight: () => <HeaderRight colorScheme={colorScheme} />,
                    tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="services"
                options={{
                    title: "Services",
                    headerLeft: () => <HeaderTitle title="Services" colorScheme={colorScheme} user={user} />,
                    headerRight: () => <HeaderRight colorScheme={colorScheme} />,
                    tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="view-dashboard-outline" size={size} color={color} />,
                }}
            />
            {/* For the custom plus button, you create a screen that redirects or opens a modal */}
            <Tabs.Screen
                name="plus" // You need a file `app/(tabs)/plus.jsx`
                options={{
                    title: "",
                    // This is a simplified way to create a custom button
                    // A more advanced way involves the tabBarButton prop
                    tabBarButton: () => (
                        <TouchableOpacity className="flex-1 justify-center items-center" onPress={() => alert('Open Modal!')}>
                             <Ionicons name="add-circle" size={48} color={colorScheme === "light" ? "#0038C0" : "white"} />
                        </TouchableOpacity>
                    )
                }}
            />
            <Tabs.Screen
                name="approvals"
                options={{
                    title: "Approvals",
                    headerLeft: () => <HeaderTitle title="Approvals" colorScheme={colorScheme} user={user} />,
                    headerRight: () => <HeaderRight colorScheme={colorScheme} />,
                    tabBarIcon: ({ color, size }) => <Feather name="check-square" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="more"
                options={{
                    title: "More",
                    headerLeft: () => <HeaderTitle title="More" colorScheme={colorScheme} user={user} />,
                    headerRight: () => <HeaderRight colorScheme={colorScheme} />,
                    tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="dots-vertical-circle-outline" size={size} color={color} />,
                }}
            />
        </Tabs>
    );
};

export default TabLayout;