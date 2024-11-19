import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Slot } from "expo-router";
import { LocalidadProvider } from './Context/LocalidadesContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <LocalidadProvider>
        <View style={styles.container}>
          <StatusBar style="light" />
          <Slot /> {/* Aquí se renderizan las rutas */}
        </View>
      </LocalidadProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
});