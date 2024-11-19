import { View } from "react-native";
import { Slot } from "expo-router";
import { LocalidadProvider } from "../Context/LocalidadesContext";

export default function Layout() {
  return (
    <LocalidadProvider>
      <View className="flex-1 bg-slate-500/20 justify-center">
        <Slot />
      </View>
    </LocalidadProvider>
  );
}