import * as React from 'react';
import { Dimensions, View, TouchableOpacity } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import moment from 'moment';
import MyRegularisationRequests from '../../components/RegularizationComponents/MyReqularizationRequests';
import MyApprovalsRequest from '../../components/RegularizationComponents/MyApprovalsRequest';
import { useColorScheme } from 'nativewind'; // Use this instead of useTailwind for consistency

const FirstRoute = () => (
  // Use the standard className prop
  <View className="flex-1 h-full dark:bg-black">
    <MyRegularisationRequests />
  </View>
);

const SecondRoute = () => (
  <View className="flex-1 dark:bg-black">
    <MyApprovalsRequest />
  </View>
);

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
});

export default function AttendanceRegularization() {
  const router = useRouter();
  const today = moment().format('DD-MM-YYYY');
  const [index, setIndex] = React.useState(0);
  const { colorScheme } = useColorScheme(); // Get the color scheme
  const [routes] = React.useState([
    { key: 'first', title: 'My Requests' },
    { key: 'second', title: 'My Approvals' },
  ]);

  const renderTabBar = props => (
    // 1. Use the original TabBar component
    <TabBar
      {...props}
      // 2. Convert styles to style objects, just like in approvals.jsx
      indicatorStyle={{ backgroundColor: colorScheme === 'light' ? '#0038C0' : 'white' }}
      style={{ backgroundColor: colorScheme === 'light' ? '#fff' : '#000' }}
      labelStyle={{ color: colorScheme === 'light' ? 'black' : 'white' }}
    />
  );

  return (
    // 3. Use the standard className prop for components that support it
    <View className="flex-1">
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={renderTabBar}
      />
      {index === 0 && (
        <TouchableOpacity
          className="absolute bottom-14 right-6 bg-blue-500 rounded-full p-4 shadow-lg"
          onPress={() => router.push(`/raise-regularize-request/${today}`)}
        >
          <MaterialIcons name="add" size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
}