// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, Platform, ActivityIndicator } from 'react-native';
// import { AntDesign, Entypo } from '@expo/vector-icons';
// import DateTimePickerModal from 'react-native-modal-datetime-picker';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import moment from 'moment';
// import { Dropdown } from 'react-native-element-dropdown';
// import { useAuthContext } from '../../context/AuthProvider';
// import { useColorScheme } from 'nativewind';
// import * as SecureStore from 'expo-secure-store';
// import Http from '../../services/httpService';
// import { CustomButton, Loader } from '../../components';

// const RaiseRegRequest = React.memo((props) => {
//     const router = useRouter();
//     const { colorScheme } = useColorScheme();
//     const { date: initialDate } = useLocalSearchParams();
//     const { user } = useAuthContext();
//     const [refreshing, setRefreshing] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [submitting, setSubmitting] = useState(false);
//     const [date, setDate] = useState(initialDate ? moment(initialDate, 'DD-MM-YYYY').toDate() : new Date());
//     const [showDatePicker, setShowDatePicker] = useState(false);
//     const [showCheckInTimePicker, setShowCheckInTimePicker] = useState(false);
//     const [showCheckOutTimePicker, setShowCheckOutTimePicker] = useState(false);
//     const [checkInTime, setCheckInTime] = useState(null);
//     const [checkOutTime, setCheckOutTime] = useState(null);
//     const [totalHours, setTotalHours] = useState(null);
//     const [reason, setReason] = useState('');
//     const [desc, setDesc] = useState("");
//     const [data, setData] = useState();
//     const [reasons, setReasons] = useState([]);
//     const [dropdownLoading, setDropdownLoading] = useState(true);

//     const getReasons = async () => {
//         try {
//             const response = await Http.get("/getRegulariseReason");
//             if (response.ok) {
//                 const data = await response.json();
//                 setReasons(data.data.map(item => ({ label: item, value: item })));
//                 setDropdownLoading(false);
//             } else {
//                 throw new Error('Failed to fetch reasons. Please try again.');
//             }
//         } catch (error) {
//             console.error("Error", error.message);
//             setDropdownLoading(false);
//         }
//     };


//     const getDateData = async () => {
//         setLoading(true);
//         const parsedDate = moment(date, 'DD-MM-YYYY');
//         const formattedDate = parsedDate.format('YYYY-MM-DD');

//         const userId = await SecureStore.getItemAsync('user_id');
//         const payload = new FormData();
//         payload.append("user_id", userId);
//         payload.append("checkin_date", formattedDate);

//         try {
//             const response = await Http.post("/getRegulariseDate", payload);
//             if (response.ok) {
//                 const data = await response.json();
//                 setCheckInTime(data?.data?.[0]?.clock_in ? data?.data?.[0]?.clock_in === "00:00:00" ? null : moment(data?.data?.[0]?.clock_in, "HH:mm:ss").format("hh:mm A") : null);
//                 setCheckOutTime(data?.data?.[0]?.clock_out ? data?.data?.[0]?.clock_out === "00:00:00" ? null : moment(data?.data?.[0]?.clock_out, "HH:mm:ss").format("hh:mm A") : null);
//                 setData(data?.data?.[0]);
//             } else {
//                 throw new Error('Failed to get data. Please try again.');
//             }
//         } catch (error) {
//             Alert.alert("Error", error.message);
//         } finally {
//             setLoading(false);
//             setRefreshing(false);
//         }
//     };

//     useEffect(() => {
//         if (date) {
//             getDateData();
//         }
//     }, [date]);

//     useEffect(() => {
//         getReasons();
//     }, []);

//     const handleConfirmDate = (selectedDate) => {
//         const currentDate = selectedDate || date;
//         if (moment(currentDate).isAfter(moment())) {
//             Alert.alert("Error", "Selected date cannot be in the future.");
//             setShowDatePicker(false);
//             return;
//         }
//         setShowDatePicker(Platform.OS === 'ios');
//         setDate(currentDate);
//         setShowDatePicker(false);
//     };

//     const handleConfirmIntime = (selectedTime) => {
//         const selectedCheckInTime = moment(selectedTime).format('hh:mm A');
//         if (checkOutTime && moment(selectedCheckInTime, 'hh:mm A').isAfter(moment(checkOutTime, 'hh:mm A'))) {
//             Alert.alert("Error", "Check-in time cannot be after check-out time.");
//             setShowCheckInTimePicker(Platform.OS === 'ios');
//             setShowCheckInTimePicker(false);
//             return;
//         }
//         setCheckInTime(selectedCheckInTime);
//         setShowCheckInTimePicker(Platform.OS === 'ios');
//         setShowCheckInTimePicker(false);
//     };

//     const handleConfirmOuttime = (selectedTime) => {
//         const selectedCheckOutTime = moment(selectedTime).format('hh:mm A');
//         if (moment(selectedCheckOutTime, 'hh:mm A').isBefore(moment(checkInTime, 'hh:mm A'))) {
//             Alert.alert("Error", "Check-out time cannot be before check-in time.");
//             setShowCheckOutTimePicker(Platform.OS === 'ios');
//             setShowCheckOutTimePicker(false);
//             return;
//         }
//         setCheckOutTime(selectedCheckOutTime);
//         setShowCheckOutTimePicker(Platform.OS === 'ios');
//         setShowCheckOutTimePicker(false);
//     };

//     const calculateTotalHours = (checkIn, checkOut) => {
//         if (checkIn && checkOut) {
//             const diffMilliseconds = moment(checkOut, 'hh:mm A').diff(moment(checkIn, 'hh:mm A'));
//             const diffDuration = moment.duration(diffMilliseconds);
//             const hours = Math.floor(diffDuration.asHours());
//             const minutes = diffDuration.minutes();
//             const formattedHours = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
//             setTotalHours(formattedHours);
//         } else {
//             setTotalHours(null);
//         }
//     };

//     useEffect(() => {
//         calculateTotalHours(checkInTime, checkOutTime);
//     }, [checkInTime, checkOutTime]);

//     const handleSubmit = async () => {
//         if (!checkInTime || !checkOutTime || !reason) {
//             Alert.alert("Error", "Please fill all the fields.");
//             return;
//         }

//         setSubmitting(true);
//         const userId = await SecureStore.getItemAsync('user_id');
//         const payload = new FormData();
//         payload.append("user_id", userId);
//         payload.append("attendence_id", data?.attendence_id ? data?.attendence_id : 0);
//         payload.append("checkin_date", moment(date).format('YYYY-MM-DD'));
//         payload.append("checkin_new", moment(checkInTime, "hh:mm A").format("HH:mm:ss"));
//         payload.append("checkout_new", moment(checkOutTime, "hh:mm A").format("HH:mm:ss"));
//         payload.append("reason", reason);
//         payload.append("description", desc);
//         try {
//             const response = await Http.post("/addRegulariseRequest", payload);
//             if (response.ok) {
//                 Alert.alert("Success", "Request raised successfully.", [
//                     { text: "OK", onPress: () => router.back() }
//                 ]);
//             } else {
//                 throw new Error('Failed to submit request. Please try again.');
//             }
//         } catch (error) {
//             Alert.alert("Error", error.message);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const renderItem = item => {
//         return (
//             <View className="flex-row items-center p-4 justify-between bg-white dark:bg-black-100">
//                 <Text className="ml-4 dark:text-gray-100 text-[14px]" style={{ fontWeight: item.value === reason ? "600" : "400" }}>{item.label}</Text>
//                 {item.value === reason && (
//                     <AntDesign
//                         color={colorScheme === 'light' ? "blue" : "white"}
//                         name="check"
//                         size={20}
//                     />
//                 )}
//             </View>
//         );
//     };

//     return (
//         <>
//             <Loader isLoading={loading} />
//             <ScrollView className="flex-1 p-4 dark:bg-black">
//                 <View className="mb-8">
//                     <Text className="font-semibold dark:text-gray-100">Employee</Text>
//                     <Text className="text-black dark:text-gray-100">{user.name}</Text>
//                 </View>
//                 <TouchableOpacity className="mb-9 flex-row items-center justify-between" onPress={() => setShowDatePicker(true)}>
//                     <View>
//                         <Text className="font-semibold dark:text-gray-100">Date</Text>
//                         <Text className="dark:text-gray-100">{moment(date).format('DD-MM-YYYY')}</Text>
//                     </View>
//                     <Entypo name="chevron-small-right" size={24} color="black" />
//                 </TouchableOpacity>
//                 <View className="p-4 bg-white dark:bg-black-100 rounded-xl">
//                     <View className="flex-row justify-between">
//                         <View className="mb-4">
//                             <TouchableOpacity onPress={() => setShowCheckInTimePicker(true)}>
//                                 <Text className="font-semibold text-green-400">Clock In</Text>
//                                 <Text className="dark:text-gray-100">{checkInTime ? checkInTime : '--/--'}</Text>
//                             </TouchableOpacity>
//                         </View>
//                         <View className="mb-4">
//                             <TouchableOpacity onPress={() => setShowCheckOutTimePicker(true)}>
//                                 <Text className="font-semibold text-red-400">Clock Out</Text>
//                                 <Text className="dark:text-gray-100">{checkOutTime ? checkOutTime : '--/--'}</Text>
//                             </TouchableOpacity>
//                         </View>
//                         <View className="mb-4">
//                             <View className="items-center">
//                                 <Text className="font-semibold dark:text-gray-100">{totalHours ? totalHours : '00:00'}</Text>
//                                 <Text className="dark:text-gray-100">Hrs</Text>
//                             </View>
//                         </View>
//                     </View>
//                     <View>
//                         {dropdownLoading ? (
//                             <View className="h-10 border rounded-full p-2 mb-4 border-gray-50 bg-blue-100">
//                                 <ActivityIndicator size="small" color={colorScheme === 'light' ? "#0000ff" : "white"} />
//                             </View>
//                         ) : (
//                             <Dropdown
//                                 mode="modal"
//                                 className="h-10 border rounded-full p-2 mb-4 border-gray-50 bg-blue-100"
//                                 placeholderStyle="text-base text-gray-100"
//                                 selectedTextStyle="text-base"
//                                 inputSearchStyle="h-10 rounded-full text-base"
//                                 iconStyle="w-5 h-5"
//                                 data={reasons}
//                                 search
//                                 maxHeight={300}
//                                 labelField="label"
//                                 valueField="value"
//                                 placeholder="Select reason*"
//                                 searchPlaceholder="Search..."
//                                 value={reason}
//                                 onChange={(item) => {
//                                     setReason(item.value);
//                                 }}
//                                 renderLeftIcon={() => (
//                                     <AntDesign style={{ marginRight: 6 }} color="black" name="Safety" size={20} />
//                                 )}
//                                 renderItem={renderItem}
//                             />
//                         )}
//                         <TextInput
//                             className="bg-blue-100 h-16 rounded-lg p-2"
//                             underlineColorAndroid="transparent"
//                             placeholder="Description"
//                             placeholderTextColor="black"
//                             numberOfLines={10}
//                             multiline={true}
//                             value={desc}
//                             onChangeText={(e) => setDesc(e)}
//                         />
//                     </View>
//                 </View>
//             </ScrollView>

//             <View>
//                 <View className="flex-row justify-around bg-white dark:bg-black-100 p-8">
//                     <TouchableOpacity className="p-4 px-8 bg-red-500 rounded-full" onPress={() => router.back()}>
//                         <Text className="text-white font-semibold">Cancel</Text>
//                     </TouchableOpacity>
//                     <CustomButton
//                         title="Submit"
//                         handlePress={handleSubmit}
//                         textStyles="text-white font-semibold text-sm"
//                         containerStyles="rounded-full bg-green-500 p-4 px-8"
//                         isLoading={submitting}
//                     />
//                 </View>
//             </View>
//             {Platform.OS === 'ios' ? (
//                 <>
//                     <DateTimePickerModal
//                         isVisible={showDatePicker}
//                         mode="date"
//                         onConfirm={handleConfirmDate}
//                         onCancel={() => setShowDatePicker(false)}

//                     />
//                     <DateTimePickerModal
//                         isVisible={showCheckInTimePicker}
//                         mode="time"
//                         date={checkInTime ? moment(checkInTime, 'hh:mm A').toDate() : new Date()}
//                         onConfirm={handleConfirmIntime}
//                         onCancel={() => setShowCheckInTimePicker(false)}
//                     />
//                     <DateTimePickerModal
//                         isVisible={showCheckOutTimePicker}
//                         mode="time"
//                         date={checkOutTime ? moment(checkOutTime, 'hh:mm A').toDate() : new Date()}
//                         onConfirm={handleConfirmOuttime}
//                         onCancel={() => setShowCheckOutTimePicker(false)}
//                     />
//                 </>
//             ) : (
//                 <>
//                     {showDatePicker && (
//                         <DateTimePicker
//                             value={date}
//                             mode="date"
//                             display="default"
//                             onChange={(event, selectedDate) => {
//                                 setShowDatePicker(false);
//                                 handleConfirmDate(selectedDate);
//                             }}
//                         />
//                     )}
//                     {showCheckInTimePicker && (
//                         <DateTimePicker
//                             //value={date}
//                             value={checkInTime ? moment(checkInTime, 'hh:mm A').toDate() : new Date()}
//                             mode="time"
//                             display="default"

//                             onChange={(event, selectedTime) => {
//                                 if (event.type === 'set') {
//                                     handleConfirmIntime(selectedTime);
//                                 }
//                                 setShowCheckInTimePicker(false);
//                             }}
//                         />
//                     )}
//                     {showCheckOutTimePicker && (
//                         <DateTimePicker

//                             value={checkOutTime ? moment(checkOutTime, 'hh:mm A').toDate() : new Date()}
//                             mode="time"
//                             display="default"

//                             onChange={(event, selectedTime) => {
//                                 if (event.type === 'set') {

//                                     handleConfirmOuttime(selectedTime);
//                                 }
//                                 setShowCheckOutTimePicker(false);
//                             }}
//                         />
//                     )}
//                 </>
//             )}
//         </>
//     );
// });

// export default RaiseRegRequest;
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, Platform, ActivityIndicator } from 'react-native';
import { AntDesign, Entypo } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import moment from 'moment';
import { Dropdown } from 'react-native-element-dropdown';
import { useAuthContext } from '../../context/AuthProvider';
import { useColorScheme } from 'nativewind';
import * as SecureStore from 'expo-secure-store';
import Http from '../../services/httpService';
import { CustomButton, Loader } from '../../components';

const RaiseRegRequest = React.memo(() => {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const params = useLocalSearchParams();
  console.log("useLocalSearchParams:", params); // Debug log
  const { date: initialDate } = params;
  const { user } = useAuthContext();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [date, setDate] = useState(
    initialDate && moment(initialDate, 'DD-MM-YYYY').isValid()
      ? moment(initialDate, 'DD-MM-YYYY').toDate()
      : new Date() // Current date: 2025-09-03 12:59 PM IST
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCheckInTimePicker, setShowCheckInTimePicker] = useState(false);
  const [showCheckOutTimePicker, setShowCheckOutTimePicker] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [totalHours, setTotalHours] = useState(null);
  const [reason, setReason] = useState(null); // Changed to null
  const [desc, setDesc] = useState('');
  const [data, setData] = useState(null);
  const [reasons, setReasons] = useState([]);
  const [dropdownLoading, setDropdownLoading] = useState(true);

  const getReasons = async () => {
    try {
      const response = await Http.get("/getRegulariseReason");
      if (response.ok) {
        const responseData = await response.json();
        console.log("getRegulariseReason response:", responseData);
        if (responseData?.data && Array.isArray(responseData.data)) {
          const mappedReasons = responseData.data.map(item => ({ label: item, value: item }));
          setReasons(mappedReasons);
          setReason(mappedReasons[0]?.value || null); // Set default reason
        } else {
          console.warn("getRegulariseReason returned invalid data:", responseData);
          setReasons([]);
          setReason(null);
        }
        setDropdownLoading(false);
      } else {
        throw new Error('Failed to fetch reasons. Please try again.');
      }
    } catch (error) {
      console.error("Error fetching reasons:", error.message);
      setReasons([]);
      setReason(null);
      setDropdownLoading(false);
      Alert.alert("Error", "Failed to load reasons. Please try again.");
    }
  };

  const getDateData = async () => {
    setLoading(true);
    const parsedDate = moment(date, 'DD-MM-YYYY');
    const formattedDate = parsedDate.format('YYYY-MM-DD');

    const userId = await SecureStore.getItemAsync('user_id');
    if (!userId) {
      Alert.alert("Error", "User ID not found.");
      setLoading(false);
      return;
    }

    const payload = new FormData();
    payload.append("user_id", userId);
    payload.append("checkin_date", formattedDate);

    try {
      const response = await Http.post("/getRegulariseDate", payload);
      if (response.ok) {
        const responseData = await response.json();
        console.log("getRegulariseDate response:", responseData);
        if (responseData?.data?.[0]) {
          setCheckInTime(
            responseData.data[0].clock_in && responseData.data[0].clock_in !== "00:00:00"
              ? moment(responseData.data[0].clock_in, "HH:mm:ss").format("hh:mm A")
              : null
          );
          setCheckOutTime(
            responseData.data[0].clock_out && responseData.data[0].clock_out !== "00:00:00"
              ? moment(responseData.data[0].clock_out, "HH:mm:ss").format("hh:mm A")
              : null
          );
          setData(responseData.data[0]);
        } else {
          console.warn("No data found for date:", formattedDate);
          setCheckInTime(null);
          setCheckOutTime(null);
          setData(null);
        }
      } else {
        throw new Error('Failed to get data. Please try again.');
      }
    } catch (error) {
      console.error("Error fetching date data:", error.message);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    console.log("Date changed:", date);
    if (date && moment(date).isValid()) {
      getDateData();
    }
  }, [date]);

  useEffect(() => {
    getReasons();
  }, []);

  const handleConfirmDate = (selectedDate) => {
    if (!selectedDate) {
      setShowDatePicker(false);
      return;
    }
    const currentDate = selectedDate || date;
    if (moment(currentDate).isAfter(moment())) {
      Alert.alert("Error", "Selected date cannot be in the future.");
      setShowDatePicker(false);
      return;
    }
    setDate(currentDate);
    setShowDatePicker(false);
  };

  const handleConfirmIntime = (selectedTime) => {
    if (!selectedTime) {
      setShowCheckInTimePicker(false);
      return;
    }
    const selectedCheckInTime = moment(selectedTime).format('hh:mm A');
    if (checkOutTime && moment(selectedCheckInTime, 'hh:mm A').isAfter(moment(checkOutTime, 'hh:mm A'))) {
      Alert.alert("Error", "Check-in time cannot be after check-out time.");
      setShowCheckInTimePicker(false);
      return;
    }
    setCheckInTime(selectedCheckInTime);
    setShowCheckInTimePicker(false);
  };

  const handleConfirmOuttime = (selectedTime) => {
    if (!selectedTime) {
      setShowCheckOutTimePicker(false);
      return;
    }
    const selectedCheckOutTime = moment(selectedTime).format('hh:mm A');
    if (checkInTime && moment(selectedCheckOutTime, 'hh:mm A').isBefore(moment(checkInTime, 'hh:mm A'))) {
      Alert.alert("Error", "Check-out time cannot be before check-in time.");
      setShowCheckOutTimePicker(false);
      return;
    }
    setCheckOutTime(selectedCheckOutTime);
    setShowCheckOutTimePicker(false);
  };

  const calculateTotalHours = (checkIn, checkOut) => {
    if (checkIn && checkOut) {
      const diffMilliseconds = moment(checkOut, 'hh:mm A').diff(moment(checkIn, 'hh:mm A'));
      const diffDuration = moment.duration(diffMilliseconds);
      const hours = Math.floor(diffDuration.asHours());
      const minutes = diffDuration.minutes();
      const formattedHours = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      setTotalHours(formattedHours);
    } else {
      setTotalHours(null);
    }
  };

  useEffect(() => {
    calculateTotalHours(checkInTime, checkOutTime);
  }, [checkInTime, checkOutTime]);

  const handleSubmit = async () => {
    if (!checkInTime || !checkOutTime || !reason) {
      Alert.alert("Error", "Please fill all the required fields.");
      return;
    }

    setSubmitting(true);
    const userId = await SecureStore.getItemAsync('user_id');
    if (!userId) {
      Alert.alert("Error", "User ID not found.");
      setSubmitting(false);
      return;
    }

    const payload = new FormData();
    payload.append("user_id", userId);
    payload.append("attendence_id", data?.attendence_id ? data.attendence_id : 0);
    payload.append("checkin_date", moment(date).format('YYYY-MM-DD'));
    payload.append("checkin_new", moment(checkInTime, "hh:mm A").format("HH:mm:ss"));
    payload.append("checkout_new", moment(checkOutTime, "hh:mm A").format("HH:mm:ss"));
    payload.append("reason", reason);
    payload.append("description", desc);
    try {
      const response = await Http.post("/addRegulariseRequest", payload);
      if (response.ok) {
        Alert.alert("Success", "Request raised successfully.", [
          { text: "OK", onPress: () => router.back() }
        ]);
      } else {
        throw new Error('Failed to submit request. Please try again.');
      }
    } catch (error) {
      console.error("Error submitting request:", error.message);
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const renderItem = item => {
    if (!item || !item.label || !item.value) {
      console.warn("Invalid item in renderItem:", item);
      return null;
    }
    return (
      <View className="flex-row items-center p-3 justify-between bg-white dark:bg-gray-900">
        <Text className="ml-4 text-gray-700 dark:text-gray-200 text-base" style={{ fontWeight: item.value === reason ? "bold" : "normal" }}>
          {item.label}
        </Text>
        {item.value === reason && (
          <AntDesign
            color={colorScheme === 'light' ? "#007AFF" : "#00C4FF"}
            name="check"
            size={20}
          />
        )}
      </View>
    );
  };

  const renderDropdown = React.useMemo(() => {
    console.log("Rendering Dropdown, reasons:", reasons, "reason:", reason);
    if (!dropdownLoading && reasons.length > 0) {
      return (
        <Dropdown
          mode="modal"
          className="w-full h-12 border rounded-lg p-2 mb-4 border-gray-300 bg-white dark:bg-gray-800"
          placeholderStyle={{ fontSize: 16, color: colorScheme === 'light' ? '#6B7280' : '#D1D5DB' }}
          selectedTextStyle={{ fontSize: 16, color: colorScheme === 'light' ? '#1F2937' : '#F9FAFB' }}
          inputSearchStyle={{ height: 40, fontSize: 16, borderRadius: 8, backgroundColor: '#F3F4F6', color: '#1F2937' }}
          iconStyle={{ width: 20, height: 20 }}
          data={reasons}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Select reason*"
          searchPlaceholder="Search..."
          value={reason}
          onChange={(item) => setReason(item.value)}
          renderLeftIcon={() => (
            <AntDesign style={{ marginRight: 8 }} color={colorScheme === 'light' ? '#374151' : '#9CA3AF'} name="Safety" size={20} />
          )}
          renderItem={renderItem}
        />
      );
    }
    return (
      <View className="w-full h-12 border rounded-lg p-2 mb-4 border-gray-300 bg-white dark:bg-gray-800 flex-row items-center">
        {dropdownLoading ? (
          <ActivityIndicator size="small" color={colorScheme === 'light' ? '#3B82F6' : '#60A5FA'} />
        ) : (
          <Text className="text-gray-500 dark:text-gray-400 text-base">No reasons available</Text>
        )}
      </View>
    );
  }, [dropdownLoading, reasons, reason, colorScheme]);

  return (
    <>
      <Loader isLoading={loading} />
      <ScrollView className="flex-1 p-6 bg-white dark:bg-gray-900">
        {/* Employee Section */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-800 dark:text-gray-100">Employee Details</Text>
          <Text className="text-base text-gray-600 dark:text-gray-300 mt-1">{user.name}</Text>
        </View>

        {/* Date Selection */}
        <TouchableOpacity
          className="mb-6 flex-row items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          onPress={() => setShowDatePicker(true)}
        >
          <View>
            <Text className="text-sm font-medium text-gray-500 dark:text-gray-400">Date</Text>
            <Text className="text-base text-gray-800 dark:text-gray-200">
              {moment(date).format('DD-MM-YYYY')}
            </Text>
          </View>
          <Entypo name="chevron-small-right" size={24} color={colorScheme === 'light' ? '#374151' : '#D1D5DB'} />
        </TouchableOpacity>

        {/* Clock Times Card */}
        <View className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <View className="flex-row justify-between mb-4">
            <View className="items-center">
              <TouchableOpacity onPress={() => setShowCheckInTimePicker(true)}>
                <Text className="text-sm font-medium text-green-600 dark:text-green-400">Clock In</Text>
                <Text className="text-lg text-gray-800 dark:text-gray-200 mt-1">
                  {checkInTime ? checkInTime : '--/--'}
                </Text>
              </TouchableOpacity>
            </View>
            <View className="items-center">
              <TouchableOpacity onPress={() => setShowCheckOutTimePicker(true)}>
                <Text className="text-sm font-medium text-red-600 dark:text-red-400">Clock Out</Text>
                <Text className="text-lg text-gray-800 dark:text-gray-200 mt-1">
                  {checkOutTime ? checkOutTime : '--/--'}
                </Text>
              </TouchableOpacity>
            </View>
            <View className="items-center">
              <Text className="text-sm font-medium text-gray-500 dark:text-gray-400">Total</Text>
              <Text className="text-lg text-gray-800 dark:text-gray-200 mt-1">
                {totalHours ? totalHours : '00:00'}
              </Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400">Hrs</Text>
            </View>
          </View>
        </View>

        {/* Reason and Description */}
        <View className="mb-6 ">
          {renderDropdown}
          <TextInput
             className="w-full mt-4 h-24 p-4 bg-blue-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 text-base"
           //className="bg-blue-50 h-16 rounded-lg p-2"
            placeholder="Enter description (optional)"
            placeholderTextColor={colorScheme === 'light' ? '#6B7280' : '#D1D5DB'}
            numberOfLines={6}
            multiline={true}
            value={desc}
            onChangeText={(e) => setDesc(e)}
          />
        </View>
      </ScrollView>

      {/* Action Buttons */}
      {/* <View className="p-4 bg-white dark:bg-gray-900">
        <View className="flex-row justify-between">
          <TouchableOpacity
            className="flex-1 mr-2 bg-red-600 dark:bg-red-700 rounded-lg p-3"
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text className="text-white text-center font-semibold text-base">Cancel</Text>
          </TouchableOpacity>
          <CustomButton
            title="Submit"
            handlePress={handleSubmit}
            textStyles="text-white font-semibold text-base"
            containerStyles="flex-1 ml-2 bg-blue-600 dark:bg-blue-700 rounded-lg p-3"
            isLoading={submitting}
          />
        </View>
      </View> */}
                  <View>
                 <View className="flex-row justify-around bg-white dark:bg-black-100 p-8">
                     <TouchableOpacity className="p-4 px-8 bg-red-500 rounded-full" onPress={() => router.back()}>
                         <Text className="text-white font-semibold">Cancel</Text>
                     </TouchableOpacity>
                     <CustomButton
                        title="Submit"
                        handlePress={handleSubmit}
                        textStyles="text-white font-semibold text-sm"
                        containerStyles="rounded-full bg-green-500 p-4 px-8"
                        isLoading={submitting}
                    />
                </View>
            </View>

      {/* Date and Time Pickers */}
      {Platform.OS === 'ios' ? (
        <>
          <DateTimePickerModal
            isVisible={showDatePicker}
            mode="date"
            date={date}
            onConfirm={handleConfirmDate}
            onCancel={() => setShowDatePicker(false)}
            style={{ backgroundColor: colorScheme === 'light' ? '#FFFFFF' : '#1F2937' }}
          />
          <DateTimePickerModal
            isVisible={showCheckInTimePicker}
            mode="time"
            date={checkInTime ? moment(checkInTime, 'hh:mm A').toDate() : new Date()}
            onConfirm={handleConfirmIntime}
            onCancel={() => setShowCheckInTimePicker(false)}
            style={{ backgroundColor: colorScheme === 'light' ? '#FFFFFF' : '#1F2937' }}
          />
          <DateTimePickerModal
            isVisible={showCheckOutTimePicker}
            mode="time"
            date={checkOutTime ? moment(checkOutTime, 'hh:mm A').toDate() : new Date()}
            onConfirm={handleConfirmOuttime}
            onCancel={() => setShowCheckOutTimePicker(false)}
            style={{ backgroundColor: colorScheme === 'light' ? '#FFFFFF' : '#1F2937' }}
          />
        </>
      ) : (
        <>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                handleConfirmDate(selectedDate);
              }}
              style={{ backgroundColor: colorScheme === 'light' ? '#FFFFFF' : '#1F2937' }}
            />
          )}
          {showCheckInTimePicker && (
            <DateTimePicker
              value={checkInTime ? moment(checkInTime, 'hh:mm A').toDate() : new Date()}
              mode="time"
              display="default"
              onChange={(event, selectedTime) => {
                if (event.type === 'set' && selectedTime) {
                  handleConfirmIntime(selectedTime);
                }
                setShowCheckInTimePicker(false);
              }}
              style={{ backgroundColor: colorScheme === 'light' ? '#FFFFFF' : '#1F2937' }}
            />
          )}
          {showCheckOutTimePicker && (
            <DateTimePicker
              value={checkOutTime ? moment(checkOutTime, 'hh:mm A').toDate() : new Date()}
              mode="time"
              display="default"
              onChange={(event, selectedTime) => {
                if (event.type === 'set' && selectedTime) {
                  handleConfirmOuttime(selectedTime);
                }
                setShowCheckOutTimePicker(false);
              }}
              style={{ backgroundColor: colorScheme === 'light' ? '#FFFFFF' : '#1F2937' }}
            />
          )}
        </>
      )}
    </>
  );
});

export default RaiseRegRequest;