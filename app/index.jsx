import * as React from "react";
import { View, StyleSheet, Text } from "react-native";
import MapView, { Polygon } from "react-native-maps";
import { useRef, useState, useEffect } from "react";
import { db } from "../firebase-config";
import { ref, get, child, set } from "firebase/database";
import { useRouter } from "expo-router";
import { useLocalidad } from "../Context/LocalidadesContext";
import * as Location from "expo-location";

function Index() {
  const mapRef = useRef(null);
  const [localidades, setLocalidades] = useState([]);
  const [polygonColors, setPolygonColors] = useState({});
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const router = useRouter();
  const { setLocalidad } = useLocalidad();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      console.log("Ubicación obtenida: ", location);
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
    })();
  }, []);

  useEffect(() => {
    console.log("user location: ", latitude, longitude);
  }, [latitude, longitude]);

  useEffect(() => {
    fetch(
      "https://bogota-laburbano.opendatasoft.com/api/explore/v2.1/catalog/datasets/poligonos-localidades/records?limit=20"
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.results) {
          const features = data.results
            .map((feature) => {
              if (
                feature.geometry &&
                feature.geometry.geometry &&
                feature.geometry.geometry.coordinates
              ) {
                return {
                  coordinates: feature.geometry.geometry.coordinates[0][0].map(
                    (coord) => ({
                      latitude: coord[1],
                      longitude: coord[0],
                    })
                  ),
                  name: feature["Nombre de la localidad"],
                };
              } else {
                console.error("Invalid feature geometry", feature);
                return null;
              }
            })
            .filter((feature) => feature !== null);
          setLocalidades(features);
        } else {
          console.error("No results found in the response");
        }
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      for (const localidad of localidades) {
        const localidadRef = ref(db, "localidades/" + localidad.name);
        const snapshot = await get(child(localidadRef, "incidentes"));
        let incidentes = 0;
        if (snapshot.exists()) {
          incidentes = snapshot.val();
        }
        // Obtener los reportes de la localidad
        const reportesSnapshot = await get(
          ref(db, "reportes/" + localidad.name)
        );
        if (reportesSnapshot.exists()) {
          const reportes = reportesSnapshot.val();
          const now = new Date();
          for (const reporteId in reportes) {
            const reporte = reportes[reporteId];
            const reporteDate = new Date(reporte.date);
            const timeDifference = now - reporteDate;
            const daysDifference = timeDifference / (1000 * 3600 * 24);
            if (daysDifference > 1) {
              // Si ha pasado más de un día, decrementar el contador de incidentes
              incidentes -= 1;
              // Eliminar el reporte de la base de datos
              await set(
                ref(db, "reportes/" + localidad.name + "/" + reporteId),
                null
              );
            }
          }
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

        // Actualizar el contador de incidentes en la base de datos
        await set(localidadRef, {
          incidentes: incidentes,
        });
      }
    }, 100);

    return () => clearInterval(interval);
  }, [localidades]);

  const handlePress = (name) => {
    setLocalidad(name);
    router.push("/Report");
  };

  return (
    <View style={styles.container}>
      {latitude && longitude ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        >
          {localidades.map((localidad, index) => (
            <Polygon
              key={index}
              coordinates={localidad.coordinates}
              strokeColor={
                polygonColors[localidad.name]?.strokeColor || "#347928"
              }
              fillColor={polygonColors[localidad.name]?.fillColor || "#B1D69050"}
              strokeWidth={2}
              onPress={() => handlePress(localidad.name)}
            />
          ))}
        </MapView>
      ) : (
        <View>
          <Text>Cargando ubicación...</Text>
        </View>
      )}
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

export default Index;
