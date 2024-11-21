import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

export default function UserUpdate() {
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      navigation.setOptions({ headerTitle: 'Info' });
    }, [navigation])
  );

  return (
    <View className="flex-1 justify-center mx-4">
      <View className="flex flex-col bg-white p-4 m-4 rounded-lg justify-center">
        <Text className="text-lg font-semibold my-2">Username</Text>
        <TextInput
          className="border border-gray-300 p-2 rounded mb-2"
          placeholder="Ingrese el título"
        />
        <Text className="text-lg font-semibold my-2">Email</Text>
        <TextInput
          className="border border-gray-300 p-2 rounded mb-2 "
          placeholder="Ingrese la descripción"
          multiline
        />
        <Text className="text-lg font-semibold my-2">Password</Text>
        <TextInput
          className="border border-gray-300 p-2 rounded mb-2 "
          placeholder="Ingrese la descripción"
          multiline
        />

        <TouchableOpacity className="bg-white w-60 self-center p-1 rounded-full border-2 border-purple-500 my-4 ">
          <Text className="text-purple-500 text-center text-lg">
            Actualizar Informacion
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}