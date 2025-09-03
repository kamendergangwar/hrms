import { View, Text, Dimensions } from 'react-native';
import React from 'react';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { useColorScheme } from 'nativewind'; // 1. Remove 'styled' from the import
import ApprovalsList from '../../components/Approval/ApprovalsList';

// 2. Remove the styled() HOC completely
// const StyledTabBar = styled(TabBar);

const PendingRoutes = ({ title }) => (
  <View className="flex-1 dark:bg-black">
    <ApprovalsList type="pending" screen={title} />
  </View>
);

const ApprovedRoutes = ({ title }) => (
  <View className="flex-1 dark:bg-black">
    <ApprovalsList type="approved" screen={title} />
  </View>
);

const RejectedRoutes = ({ title }) => (
  <View className="flex-1 dark:bg-black">
    <ApprovalsList type="rejected" screen={title} />
  </View>
);

// NOTE: Expo Router automatically passes `route` as a prop to screen components.
// You might need to use `useLocalSearchParams` if `route.params` is undefined.
// Let's assume for now it works as you expect.
export default function Approvals({ route }) {
  // A safe way to get params:
  const params = route?.params || {};
  const { title } = params;

  const [index, setIndex] = React.useState(0);
  const { colorScheme } = useColorScheme();

  const renderTabBar = props => (
    // 3. Use the original TabBar component and pass a `style` prop instead of `className`
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: colorScheme === 'light' ? '#0038C0' : 'white' }}
      style={{ backgroundColor: colorScheme === 'light' ? '#fff' : '#000' }}
      labelStyle={{ color: colorScheme === 'light' ? 'black' : "white" }}
    />
  );

  const [routes] = React.useState([
    { key: 'pending', title: 'Pending' },
    { key: 'approved', title: 'Approved' },
    { key: 'rejected', title: 'Rejected' },
  ]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'pending':
        return <PendingRoutes type="pending" title={title} />;
      case 'approved':
        return <ApprovedRoutes type="approved" title={title} />;
      case 'rejected':
        return <RejectedRoutes type="rejected" title={title} />;
      default:
        return null;
    }
  };

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: Dimensions.get('window').width }}
      renderTabBar={renderTabBar}
      lazy={true}
    />
  );
}