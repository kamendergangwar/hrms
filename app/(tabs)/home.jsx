import { RefreshControl, ScrollView } from 'react-native'
import React, { useCallback, useRef, useState } from 'react'
import CheckInOutCard from '../../components/HomeScreen/CheckinCheckoutCard'
import BirthdaysCard from '../../components/HomeScreen/BirthdaysCard'
import NewHiresCard from '../../components/HomeScreen/NewHires'
import LeaveReportCard from '../../components/HomeScreen/LeaveReportCard'
import UpcomingHolidaysCard from '../../components/HomeScreen/UpcomingHolidaysCard'

const Home = () => {
    const [refreshing, setRefreshing] = useState(false);
    const checkInOutCardRef = useRef(null);
    const birthdayCardRef = useRef(null);
    const newHireCardRef = useRef(null);
    const holidayCardRef = useRef(null);
    const leaveCardRef = useRef(null);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);

        // Create an array of all the data-fetching promises
        const promises = [];
        if (checkInOutCardRef.current) {
            promises.push(checkInOutCardRef.current.getCheckInData());
        }
        if (birthdayCardRef.current) {
            promises.push(birthdayCardRef.current.getData());
        }
        if (newHireCardRef.current) {
            promises.push(newHireCardRef.current.getData());
        }
        if (holidayCardRef.current) {
            promises.push(holidayCardRef.current.getData());
        }
        // This is the corrected line
        if (leaveCardRef.current) {
            promises.push(leaveCardRef.current.getData());
        }

        try {
            // Wait for all promises to resolve
            await Promise.all(promises);
        } catch (error) {
            console.error("Failed to refresh data:", error);
            // Optionally show an alert to the user
        } finally {
            // This will only run after all fetches are complete (or have failed)
            setRefreshing(false);
        }
    }, []); // Dependencies array is empty as refs don't change

    return (
        <ScrollView
            className="px-4 dark:bg-black"
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            {/* The onRefreshSuccess prop is no longer needed */}
            <CheckInOutCard ref={checkInOutCardRef} />
            <BirthdaysCard ref={birthdayCardRef} />
            <NewHiresCard ref={newHireCardRef} />
            <LeaveReportCard ref={leaveCardRef} />
            <UpcomingHolidaysCard ref={holidayCardRef} />
        </ScrollView>
    )
}

export default Home;