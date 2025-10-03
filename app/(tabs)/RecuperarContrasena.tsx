import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get("window");

const RecuperarContrasena = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleSend = () => {
    Alert.alert("Correo enviado", "Te hemos enviado un enlace de recuperación.");
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require("@/assets/images/navegacion/logo.png")} 
      style={styles.logo} resizeMode="contain" />

      {/* Texto descriptivo */}
      <Text style={styles.textInfo}>
        Ingresa tu correo electrónico para enviarte un enlace de recuperación de contraseña.
      </Text>

      {/* Correo */}
      <Text style={styles.label}>Correo electrónico</Text>
      <TextInput
        placeholder="ejemplo@gmail.com"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      {/* Botón */}
      <TouchableOpacity style={styles.button} onPress={handleSend}>
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>

      {/* Patitas */}
      <Image source={require("@/assets/images/navegacion/patas_abajo.png")} 
      style={styles.paws} resizeMode="contain" />
    </View>
  );
};

export default RecuperarContrasena;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 60,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 25,
  },
  logo: {
    width: 180,
    height: 150,
    marginBottom: 20,
  },
  textInfo: {
    textAlign: "center",
    fontSize: 14,
    color: "#555",
    marginBottom: 25,
    lineHeight: 18,
  },
  label: {
    alignSelf: "flex-start",
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#6CBA79",
    width: "100%",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#6CBA79",
    width: "100%",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 40,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  paws: {
    width: width * 0.8,
    height: 80,
    position: "absolute",
    bottom: 20,
  },
});
