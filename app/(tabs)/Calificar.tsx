import BotonGeneral from "@/components/BotonGeneral";
import Encabezado from "@/components/Encabezado";
import MenuDueno from "@/components/MenuDueno";
import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CalificarScreen() {
  // Estado para guardar la cantidad de estrellas seleccionadas (1 a 5)
  const [rating, setRating] = useState(0);

  // Función para actualizar la calificación
  const handleStarPress = (index: number) => {
    setRating(index);
  };

  return (
    <View style={styles.container}>
      {/* Contenido scrollable para evitar cortes en pantallas pequeñas */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Barra superior */}
        <Encabezado />

        {/* Título */}
        <Text style={styles.title}>Califica al veterinario</Text>

        {/* Cuadro verde con perritos y patita */}
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

        {/* Texto de instrucción */}
        <Text style={styles.textoInstruccion}>Selecciona la cantidad de estrellas</Text>

        {/* Estrellas */}
        <View style={styles.estrellasContainer}>
          {[1, 2, 3, 4, 5].map((index) => (
            <TouchableOpacity key={index} onPress={() => handleStarPress(index)}>
              <FontAwesome
                name={index <= rating ? "star" : "star-o"}
                size={40}
                color="#FFB800"
                style={styles.estrella}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Botón reutilizable */}
        <BotonGeneral
          title="Calificar"
          onPress={() => alert(`Has calificado con ${rating} estrellas`)}
        />
      </ScrollView>
      <MenuDueno active="Calificar" />
      {/* Menú inferior fijo */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    alignItems: "center",
    paddingBottom: 100, // espacio para el menú inferior
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginTop: 25,
  },
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
  perritos: {
    position: "absolute",
    top: -100,
    width: 220,
    height: 120,
  },
  patita: {
    position: "absolute",
    top: 15,
    width: 40,
    height: 40,
  },
  textoCuadro: {
    marginTop: 45,
    fontSize: 18,
    fontWeight: "500",
    color: "#0000",
  },
  textoInstruccion: {
    marginTop: 30,
    fontSize: 16,
    color: "#0000",
  },
  estrellasContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  estrella: {
    marginHorizontal: 8,
  },
});
