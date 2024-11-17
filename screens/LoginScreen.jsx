import React, { useState } from "react";
import { View, Image, ScrollView, TouchableOpacity, TextInput, Text, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { useNavigation } from "@react-navigation/native";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../firebase-config";

const uri = "https://img.freepik.com/free-photo/futuristic-metaverse-empty-room-product-display-presentation-abstract-technology-scifi-with-neon-light-3d-background_56104-2314.jpg?t=st=1729570804~exp=1729574404~hmac=80d623c0d325909a8ec098b65d7479fa0bf332b335e8e5c07dcfb62e13985113&w=1380";
const profilePicture = "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?t=st=1729570653~exp=1729574253~hmac=2fe296113c3fe861e651890e89a2def21268848476945d928a109185fd6cb05b&w=740";

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const createAccount = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Account created");
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        console.log(error);
        alert(error.message);
      });
  };

  const login = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Logged in");
        const user = userCredential.user;
        console.log(user);
        navigation.navigate("Home");
      })
      .catch((error) => {
        console.log(error);
        alert(error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri }} style={[styles.image, StyleSheet.absoluteFill]} />
      <View style={{ width: 100, height: 100, backgroundColor: "purple", position: "absolute" }}></View>
      <ScrollView contentContainerStyle={{ flex: 1, width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }}>
        <BlurView intensity={100}>
          <View style={styles.login}>
            <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
            <View>
              <Text style={{ fontSize: 17, fontWeight: "400", color: "white" }}>E-mail</Text>
              <TextInput onChangeText={(text) => setEmail(text)} style={styles.input} placeholder="Example@mail.com" />
            </View>
            <View>
              <Text style={{ fontSize: 17, fontWeight: "400", color: "white" }}>Password</Text>
              <TextInput onChangeText={(text) => setPassword(text)} style={styles.input} placeholder="Password" secureTextEntry={true} />
            </View>
            <TouchableOpacity onPress={login} style={[styles.button, { backgroundColor: "#18016190" }]}>
              <Text style={{ color: "white", fontSize: 17, fontWeight: "400" }}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={createAccount} style={[styles.button, { backgroundColor: "#1F254490" }]}>
              <Text style={{ color: "white", fontSize: 17, fontWeight: "400" }}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </ScrollView>
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
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  login: {
    width: 350,
    height: 500,
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: "#fff",
    borderWidth: 1,
    marginVertical: 30,
  },
  input: {
    width: 250,
    height: 40,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 10,
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#ffffff90",
    marginBottom: 20,
  },
  button: {
    width: 250,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    borderColor: "#ffffff90",
    borderWidth: 1,
  },
});

export default LoginScreen;