import { View, StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"

interface TabNavigatorProps {
  activeTab: string
}

export default function TabNavigator({ activeTab }: TabNavigatorProps) {
  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.tab}>
        <Ionicons name="home-outline" size={24} color={activeTab === "home" ? "#1DB954" : "#888"} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab}>
        <Ionicons name="search-outline" size={24} color={activeTab === "search" ? "#1DB954" : "#888"} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tab}
        onPress={() => {
          if (activeTab !== "group") {
            navigation.navigate("GroupInfo" as never)
          } else {
            navigation.navigate("Analytics" as never)
          }
        }}
      >
        <Ionicons name="people" size={24} color={activeTab === "group" ? "#1DB954" : "#888"} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab}>
        <Ionicons name="settings-outline" size={24} color={activeTab === "settings" ? "#1DB954" : "#888"} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#1A1A1A",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#2A2A2A",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
})
