import BotonGeneral from "@/components/BotonGeneral";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function ElegirRol() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Huellita arriba izquierda */}
      <Image
        source={require("../../assets/images/navegacion/patas_superior.png")}
        style={styles.ImagenSuperior}
      />

      {/* Texto principal */}
      <Text style={styles.titulo}>Elige tu rol</Text>

      {/* Imagen central */}
      <Image
        source={require("../../assets/images/navegacion/vete.png")} 
        style={styles.ImagenCentral}
        resizeMode="contain"
      />

      {/* Botones */}
      <View style={styles.botonesContainer}>
        <BotonGeneral
          title="Soy dueño de mascota"
          onPress={() => router.push("./Registro")}
        />
        <View style={{ height: 15 }} /> 
        <BotonGeneral
          title="Soy veterinario"
          onPress={() => router.push("./Registroveteri")}
        />
      </View>

      {/* Huellita abajo derecha */}
      <Image
        source={require("../../assets/images/navegacion/patas_inferior.png")}
        style={styles.ImagenInferior}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#fff" 
  },
  titulo: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  ImagenCentral: {
    width: 350,
    height: 350,
    marginBottom: 15,
  },
  botonesContainer: {
    width: "80%",
    alignItems: "center",
    resizeMode: "contain"
  },
  ImagenSuperior: {
    position: "absolute",
    top: 20,
    left: 20,
    width: 60,
    height: 60,
  },
  ImagenInferior: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    resizeMode: "contain"
  },
});
