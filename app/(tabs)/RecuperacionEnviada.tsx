import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get("window");

const RecuperacionEnviada = () => {
  const router = useRouter();

  const email = "jazmin@gmail.com"; 

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require("@/assets/images/navegacion/logo.png")} 
      style={styles.logo} resizeMode="contain" />

      {/* Mensaje */}
      <Text style={styles.text}>
        Hemos enviado un enlace de recuperación a:
      </Text>
      <Text style={styles.email}>{email}</Text>
      <Text style={styles.text}>
        Revisa tu bandeja de entrada y sigue las instrucciones para cambiar tu contraseña.
      </Text>

      {/* Botón para volver al login */}
      <TouchableOpacity style={styles.button} onPress={() => router.push("./IniciarSesion1")}>
        <Text style={styles.buttonText}>Volver al inicio</Text>
      </TouchableOpacity>

      {/* Patitas abajo */}
      <Image source={require("@/assets/images/navegacion/patas_abajo.png")} 
      style={styles.paws} resizeMode="contain" />
    </View>
  );
};

export default RecuperacionEnviada;

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
  text: {
    textAlign: "center",
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
    lineHeight: 18,
  },
  email: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#6CBA79",
    width: "100%",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 25,
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
