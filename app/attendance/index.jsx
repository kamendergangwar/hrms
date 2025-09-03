import { View, SafeAreaView } from 'react-native';
import React from 'react';
import MenuItem from '../../components/MenuItem';

const AttendanceIndex = () => {
  const items = [
    { id: 1, label: 'View', href: '/attendance/view', icon: "star", color: "#EF4444" },
    { id: 2, label: 'Regularization', href: '/attendance/regularization', icon: "star", color: "#EF4444" }
  ];

  return (
    <SafeAreaView className="flex-1 dark:bg-black">
      <View className="flex-1">
        {/* Pass the key directly to the component being rendered in the loop */}
        {items.map((item) => (
          <MenuItem key={item.id} item={item} />
        ))}
      </View>
    </SafeAreaView>
  );
}

export default AttendanceIndex;