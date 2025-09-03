import * as React from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useColorScheme } from 'nativewind'; // 1. Remove 'styled' from the import
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AttendanceCalendarView from '../../components/ServicesComponents/AttendanceCalendarView';
import AttendanceWeekView from '../../components/ServicesComponents/AttendanceWeekView';
import { Dropdown } from 'react-native-element-dropdown';
import { AntDesign } from '@expo/vector-icons';
import { UserMockData } from '../../data/UserMockData';

const FirstRoute = ({ userId }) => (
  <View className="flex-1 justify-center dark:bg-black">
    <AttendanceWeekView userId={userId} />
  </View>
);

const SecondRoute = ({ userId }) => (
  <View className="flex-1 justify-center dark:bg-black">
    <AttendanceCalendarView userId={userId} />
  </View>
);

// 2. Delete the styled() wrapper completely
// const StyledTabBar = styled(TabBar);

export default function AttendanceView() {
  const [index, setIndex] = React.useState(0);
  const { colorScheme } = useColorScheme();
//  console.log('Current color scheme:', colorScheme);
  const [users, setUsers] = React.useState([]);
  const [selectedUser, setSelectedUser] = React.useState('');

  const [routes] = React.useState([
    { key: 'first', title: 'Week' },
    { key: 'second', title: 'Month' },
  ]);

  React.useEffect(() => {
    // setUsers(UserMockData)
  }, []);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'first':
        return <FirstRoute userId={selectedUser} />;
      case 'second':
        return <SecondRoute userId={selectedUser} />;
      default:
        return null;
    }
  };

  // const renderTabBar = props => (
  //   // 3. Use the original TabBar component and a 'style' prop
  //   <TabBar
  //     {...props}
  //     indicatorStyle={{ backgroundColor: colorScheme === 'light' ? '#0038C0' : 'white' }}
  //     style={{ backgroundColor: colorScheme === 'light' ? '#fff' : '#000' }}
  //     labelStyle={{ color: colorScheme === 'light' ? 'black' : 'white' }}
      
  //   />
  // );

  const renderTabBar = props => (
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor: colorScheme === 'light' ? '#0038C0' : '#fff' }}
    style={{ backgroundColor: colorScheme === 'light' ? '#fff' : '#000' }}
    labelStyle={{
      color: colorScheme === 'light' ? '#000000' : '#ffffff', // Explicit hex codes
      fontWeight: '500',
      fontSize: 16, // Ensure consistent rendering
    }}
    activeColor={colorScheme === 'light' ? '#000000' : '#ffffff'} // Explicitly set active tab label color
    inactiveColor={colorScheme === 'light' ? '#000000' : '#ffffff'} // Explicitly set inactive tab label color
  />
);

  const renderItem = item => {
    return (
      <View className="flex-row items-center p-4 justify-between bg-white dark:bg-black-100">
        <Text className="ml-4 dark:text-gray-100 text-[14px]" style={{ fontWeight: item.user_id === selectedUser ? "600" : "400" }}>{item.name} - {item.empId}</Text>
        {item.user_id === selectedUser && (
          <AntDesign
            color={colorScheme === 'light' ? "blue" : "white"}
            name="check"
            size={20}
          />
        )}
      </View>
    );
  };

  return (
    <>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={renderTabBar}
      />
      {users.length > 0 &&
        <View className="px-6 bg-white dark:bg-black-100">
          <Dropdown
            mode="modal"
            className="h-10 border rounded-full p-4 mb-4 border-gray-50 bg-blue-100"
            placeholderStyle="text-base text-gray-100"
            selectedTextStyle="text-base"
            inputSearchStyle="h-10 rounded-full text-base"
            iconStyle="w-5 h-5"
            data={users}
            search
            labelField="name"
            valueField="user_id"
            placeholder="Select user"
            searchPlaceholder="Search..."
            value={selectedUser}
            onChange={(item) => {
              setSelectedUser(item.user_id);
            }}
            renderLeftIcon={() => (
              <AntDesign style={{ marginRight: 6 }} color="black" name="Safety" size={20} />
            )}
            renderItem={renderItem}
          />
        </View>
      }
    </>
  );
}