import * as React from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Polygon } from "react-native-maps";
import { useRef, useState, useEffect } from "react";
import { db } from "../firebase-config"; // Asegúrate de ajustar la ruta según tu estructura de archivos
import { ref, get, child, set } from "firebase/database";

function HomeScreen() {
  const mapRef = useRef(null);
  const [localidades, setLocalidades] = useState([]);
  const [polygonColors, setPolygonColors] = useState({});

  useEffect(() => {
    fetch("https://bogota-laburbano.opendatasoft.com/api/explore/v2.1/catalog/datasets/poligonos-localidades/records?limit=20")
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Agregar esta línea para inspeccionar la respuesta
        if (data.results) {
          const features = data.results.map((feature) => {
            if (feature.geometry && feature.geometry.geometry && feature.geometry.geometry.coordinates) {
              return {
                coordinates: feature.geometry.geometry.coordinates[0][0].map((coord) => ({
                  latitude: coord[1],
                  longitude: coord[0],
                })),
                name: feature["Nombre de la localidad"],
              };
            } else {
              console.error("Invalid feature geometry", feature);
              return null;
            }
          }).filter(feature => feature !== null);
          setLocalidades(features);
        } else {
          console.error("No results found in the response");
        }
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      localidades.forEach(async (localidad) => {
        const localidadRef = ref(db, "localidades/" + localidad.name);
        const snapshot = await get(child(localidadRef, "incidentes"));
        let incidentes = 0;
        if (snapshot.exists()) {
          incidentes = snapshot.val();
        }

        let fillColor;
        let strokeColor;
        if (incidentes <= 3) {
          fillColor = "#A1EEBD80"; // Verde
          strokeColor = "#1F452980";
        } else if (incidentes <= 5) {
          fillColor = "#FCF59680"; // Amarillo
          strokeColor = "#FBD288";
        } else if (incidentes <= 7) {
          fillColor = "#DE8F5F80"; // Naranja
          strokeColor = "#FA812F";
        } else {
          fillColor = "#F9545480"; // Rojo
          strokeColor = "#8B0000";
        }

        setPolygonColors((prevColors) => ({
          ...prevColors,
          [localidad.name]: { fillColor, strokeColor },
        }));
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [localidades]);

  const handlePress = async (name) => {
    try {
      const localidadRef = ref(db, "localidades/" + name);
      const snapshot = await get(child(localidadRef, "incidentes"));
      let incidentes = 0;
      if (snapshot.exists()) {
        incidentes = snapshot.val();
      }
      incidentes += 1;

      await set(localidadRef, {
        incidentes: incidentes,
      });

      console.log(`Incidentes en ${name}: ${incidentes}`);
    } catch (error) {
      console.error("Error al enviar los datos a Firebase:", error);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 4.627835831777713,
          longitude: -74.06409737200865,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {localidades.map((localidad, index) => (
          <Polygon
            key={index}
            coordinates={localidad.coordinates}
            strokeColor={polygonColors[localidad.name]?.strokeColor || "#347928"}
            fillColor={polygonColors[localidad.name]?.fillColor || "#B1D69050"}
            strokeWidth={2}
            onPress={() => handlePress(localidad.name)}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export default HomeScreen;