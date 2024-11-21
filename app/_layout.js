import { View } from "react-native";
import { Stack } from "expo-router";
import { LocalidadProvider } from "../Context/LocalidadesContext";

export default function Layout() {
  return (
    <LocalidadProvider>
      <View className="flex-1">
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </View>
    </LocalidadProvider>
  );
}
