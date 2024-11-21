import React, { useState } from "react";
import { View, Text, TextInput, Button, Image, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter, useFocusEffect } from "expo-router";
import { db } from "../firebase-config";
import { ref, get, child, set, push } from "firebase/database";
import { useLocalidad } from "../Context/LocalidadesContext";
import { useNavigation } from "@react-navigation/native";
import { Stack } from "expo-router";

export default function Report() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [image, setImage] = useState(null);
  const router = useRouter();
  const navigation = useNavigation();
  const { localidad } = useLocalidad();

  useFocusEffect(
    React.useCallback(() => {
      navigation.setOptions({ headerTitle: `Reportar en ${localidad}` });
    }, [localidad])
  );

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setTime(currentTime);
  };

  const handleSubmit = async () => {
    try {
      const localidadRef = ref(db, "localidades/" + localidad);
      const snapshot = await get(child(localidadRef, "incidentes"));
      let incidentes = 0;
      if (snapshot.exists()) {
        incidentes = snapshot.val();
      }
      console.log(incidentes);
      incidentes += 1;
      console.log(incidentes);

      await set(localidadRef, {
        incidentes: incidentes,
      });

      const reportRef = push(ref(db, "reportes/" + localidad));
      await set(reportRef, {
        title,
        description,
        date: date.toISOString(),
        time: time.toISOString(),
        image: image || "", // Asegúrate de que image no sea undefined
      });

      console.log("Reporte enviado:", {
        title,
        description,
        date,
        time,
        image,
        localidad,
      });

      router.push("/Home"); // Redirigir a la página principal o a otra página después de enviar el reporte
    } catch (error) {
      console.error("Error al enviar el reporte:", error);
    }
  };

  return (
    <View>
      <Stack.Screen 
      options={{ 
        headerShown: true,
        headerTintColor: "#605EA1",
        headerLeft: () => {},
        headerRight: () => {},
        headerBackTitleVisible: false,
      }} 
      
      />
      <View className="bg-white mx-8 rounded-lg mt-10">
        <View className="flex flex-col m-4 ">
          <Text className="text-lg font-semibold my-2">Título</Text>
          <TextInput
            className="border border-gray-300 p-2 rounded mb-2"
            value={title}
            onChangeText={setTitle}
            placeholder="Ingrese el título"
          />

          <Text className="text-lg font-semibold my-2">Descripción</Text>
          <TextInput
            className="border border-gray-300 p-2 rounded mb-2 h-24"
            value={description}
            onChangeText={setDescription}
            placeholder="Ingrese la descripción"
            multiline
          />

          <View className="my-2 flex flex-row gap-5">
            <Text className="text-lg font-semibold">Fecha</Text>
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          </View>

          <View className="my-2 flex flex-row gap-8">
            <Text className="text-lg font-semibold">Hora</Text>
            <DateTimePicker
              value={time}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          </View>

          <TouchableOpacity onPress={pickImage} className="bg-blue-500 p-4 rounded my-2">
            <Text className="text-white text-center text-lg">Seleccionar Imagen</Text>
          </TouchableOpacity>
          {image && <Image source={{ uri: image }} className="w-full h-48 my-2" />}

          <TouchableOpacity onPress={handleSubmit} className="bg-white w-60 self-center p-2 rounded-full border-2 border-purple-500 my-2 ">
            <Text className="text-purple-500 text-center text-lg">Enviar Reporte</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}