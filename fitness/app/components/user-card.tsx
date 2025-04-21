import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // Import useRouter for navigation

interface UserCardProps {
  name: string;
  average: number;
  calories: number;
  points: number;
}

export default function UserCard({ name, average, calories, points }: UserCardProps) {
  const router = useRouter(); // Use Expo Router's router

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={24} color="#888" />
          </View>
          <Text style={styles.userName}>{name}</Text>
        </View>
        <TouchableOpacity
          style={styles.viewMoreButton}
          onPress={() =>
            router.push({
              pathname: "/UserDetail",
              params: { name, average, calories, points },
            })
          }
        >
          <Text style={styles.viewMoreText}>View More</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <View style={styles.statIconContainer}>
            <Ionicons name="stats-chart" size={18} color="#1DB954" />
          </View>
          <Text style={styles.statValue}>{average}%</Text>
          <Text style={styles.statLabel}>Average</Text>
        </View>

        <View style={styles.statItem}>
          <View style={styles.statIconContainer}>
            <Ionicons name="flame" size={18} color="#FF4A55" />
          </View>
          <Text style={styles.statValue}>{calories}</Text>
          <Text style={styles.statLabel}>Calories</Text>
        </View>

        <View style={styles.statItem}>
          <View style={styles.statIconContainer}>
            <Ionicons name="trophy" size={18} color="#1DB954" />
          </View>
          <Text style={styles.statValue}>{points}</Text>
          <Text style={styles.statLabel}>Points</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2A2A2A",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  userName: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statItem: {
    alignItems: "center",
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#2A2A2A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  statValue: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  statLabel: {
    color: "#888",
    fontSize: 12,
  },
  viewMoreButton: {
    marginTop: -10,
    backgroundColor: "#1DB954",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  viewMoreText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
});