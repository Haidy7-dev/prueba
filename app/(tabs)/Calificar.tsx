import BotonGeneral from "@/components/BotonGeneral";
import Encabezado from "@/components/Encabezado";
import MenuDueno from "@/components/MenuDueno";
import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CalificarScreen() {
  const [rating, setRating] = useState(0);
  const { idCita } = useLocalSearchParams();
  const router = useRouter();
  const BASE_URL = "http://192.168.101.73:3000";

  const handleCalificar = async () => {
    try {
      const id_usuario = await AsyncStorage.getItem("userId");
      if (!id_usuario) {
        Alert.alert("Error", "No se encontró el usuario logueado");
        return;
      }

      await axios.post(`${BASE_URL}/api/calificaciones`, {
        puntaje: rating,
        id_cita: idCita,
        id_usuario,
      });

      Alert.alert("✅", "¡Gracias por calificar!");
      router.push("/AgendaDueno");
    } catch (error) {
      console.error("❌ Error al guardar calificación:", error);
      Alert.alert("Error", "No se pudo guardar la calificación");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Encabezado />
        <Text style={styles.title}>Califica al veterinario</Text>

        <View style={styles.cuadro}>
          <Image
            source={require("../../assets/images/navegacion/perritos.png")}
            style={styles.perritos}
            resizeMode="contain"
          />
          <Image
            source={require("../../assets/images/navegacion/pata_centro.png")}
            style={styles.patita}
            resizeMode="contain"
          />
          <Text style={styles.textoCuadro}>¿Cuál es tu calificación?</Text>
        </View>

        <Text style={styles.textoInstruccion}>Selecciona la cantidad de estrellas</Text>

        <View style={styles.estrellasContainer}>
          {[1, 2, 3, 4, 5].map((index) => (
            <TouchableOpacity key={index} onPress={() => setRating(index)}>
              <FontAwesome
                name={index <= rating ? "star" : "star-o"}
                size={40}
                color="#FFB800"
                style={styles.estrella}
              />
            </TouchableOpacity>
          ))}
        </View>

        <BotonGeneral
          title="Calificar"
          onPress={handleCalificar}
        />
      </ScrollView>
      <MenuDueno />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  scrollContainer: { alignItems: "center", paddingBottom: 100 },
  title: { fontSize: 24, fontWeight: "bold", color: "#000", marginTop: 25 },
  cuadro: {
    backgroundColor: "#FFFFFF",
    borderColor: "#14841C",
    borderWidth: 2,
    borderRadius: 10,
    width: "85%",
    alignItems: "center",
    marginTop: 130,
    paddingVertical: 20,
    position: "relative",
  },
  perritos: { position: "absolute", top: -100, width: 220, height: 120 },
  patita: { position: "absolute", top: 15, width: 40, height: 40 },
  textoCuadro: { marginTop: 45, fontSize: 18, fontWeight: "500", color: "#000" },
  textoInstruccion: { marginTop: 30, fontSize: 16, color: "#000" },
  estrellasContainer: { flexDirection: "row", justifyContent: "center", marginVertical: 20 },
  estrella: { marginHorizontal: 8 },
});
