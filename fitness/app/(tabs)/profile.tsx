import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useEffect, useState } from "react";
import UserCard from "../components/user-card";
import { io } from "socket.io-client";

// Backend API URL (adjust if hosted elsewhere)
const API_URL = "http://localhost:3000/api/sensor";

export default function ProfileScreen() {
  // State to store sensor data
  const [sensorData, setSensorData] = useState({
    heartRate: null,
    cadence: null,
    speed: null,
    oxygen: null,
    lastUpdated: null,
  });

  // Fetch sensor data on component mount
  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const response = await axios.get(API_URL);
        setSensorData(response.data);
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      }
    };

    fetchSensorData();
  }, []);

  // Optional: Real-time updates with Socket.IO
 
  useEffect(() => {
    const socket = io("http://localhost:3000");
    socket.on("sensorData", (data) => {
      setSensorData(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);


  // Derive metrics for UserCard
  const userMetrics = {
    name: "John Doe", // Replace with dynamic user data if available
    average: sensorData.heartRate || 97, // Use heart rate as average
    calories: sensorData.speed ? Math.round(sensorData.speed * 10) : 150, // Estimate calories from speed
    points: sensorData.oxygen || 100, // Use oxygen as points
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Group Info</Text>
        <View style={styles.profileIcon}>
          <Image
            source={{ uri: "https://via.placeholder.com/28" }} // Placeholder profile image
            style={{ width: 28, height: 28, borderRadius: 14 }}
          />
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <UserCard {...userMetrics} />
        <UserCard {...userMetrics} />
        <UserCard {...userMetrics} />
        <UserCard {...userMetrics} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  profileIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#1DB954",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    marginBottom: 120,
  },
});