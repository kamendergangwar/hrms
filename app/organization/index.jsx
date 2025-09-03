import * as React from 'react';
import { Dimensions, View } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { useColorScheme } from 'nativewind'; // 1. Remove 'styled' from the import
import SearchHeader from './SearchHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import ColleaguesList from '../../components/OrganizationComponents/ColleaguesList';

// 2. Delete the styled() wrapper completely
// const StyledTabBar = styled(TabBar);

const FirstRoute = ({ searchQuery, index }) => (
    <View className="flex-1 dark:bg-black">
        <ColleaguesList searchQuery={searchQuery} index={index} url="/organization_colleagues" />
    </View>
);

const SecondRoute = ({ searchQuery, index }) => (
    <View className="flex-1 dark:bg-black">
        <ColleaguesList searchQuery={searchQuery} index={index} url="/organization_department" />
    </View>
);

export default function OrganizationView() {
    const params = useLocalSearchParams();
    const { focus = 'no' } = params;
    const [index, setIndex] = React.useState(0);
    const { colorScheme } = useColorScheme();
    const [searchQuery, setSearchQuery] = React.useState("");

    const clearSearchQuery = () => {
        setSearchQuery("");
    };

    const renderTabBar = props => (
        // 3. Use the original TabBar component and a 'style' prop
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: colorScheme === 'light' ? '#0038C0' : 'white' }}
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

    const [routes] = React.useState([
        { key: 'first', title: 'Colleagues' },
        { key: 'second', title: 'Departments' },
    ]);

    const renderScene = ({ route }) => {
        switch (route.key) {
            case 'first':
                return <FirstRoute searchQuery={searchQuery} index={index} />;
            case 'second':
                return <SecondRoute searchQuery={searchQuery} index={index} />;
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colorScheme === 'light' ? "white" : "black" }}>
            <SearchHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} focus={focus} index={index} />
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={(newIndex) => {
                    clearSearchQuery();
                    setIndex(newIndex);
                }}
                initialLayout={{ width: Dimensions.get('window').width }}
                renderTabBar={renderTabBar}
            />
        </SafeAreaView>
    );
}