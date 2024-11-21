import { Tabs } from 'expo-router';
import { View } from 'react-native'; 
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function Layout() {
  return (
    <View className="flex-1">
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#EBEAFF",
            borderTopColor: "#605EA1",
          },
          tabBarActiveTintColor: "#605EA1",
          tabBarInactiveTintColor: "#605EA180",
        }}>
        <Tabs.Screen 
        name="Home" 
        options={{
          title: "Mapa",
          tabBarIcon: ({color}) => <FontAwesome6 name="map-location-dot" size={24} color={color}/>
        }} />
        <Tabs.Screen 
        name="User" 
        options={{
          title: "Info usuario",
          tabBarIcon: ({color}) => <FontAwesome6 name="user-large" size={24} color={color}/>
        }} />
      </Tabs>
    </View>
  );
}