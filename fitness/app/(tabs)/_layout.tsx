import { Tabs } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import CustomTabBar from "../components/custom-tab-bar";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 0,
          height: 0,
        },
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
      initialRouteName="profile"
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: "Shop",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: "Activity",
        }}
      />
      <Tabs.Screen
        name="[...missing]"
        options={{ href: null }}
      />
    </Tabs>
  );
}