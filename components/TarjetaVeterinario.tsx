import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type VeterinarioProps = {
  nombre: string;
  imagen: string;
  calificacion: number;
  resenas: number;
  onPress?: () => void;
};

export default function TarjetaVeterinario({
  nombre,
  imagen,
  calificacion,
  resenas,
  onPress,
}: VeterinarioProps) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: imagen }} style={styles.image} />

      <View style={styles.info}>
        <Text style={styles.nombre}>{nombre}</Text>

        <View style={styles.rating}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Ionicons
              key={i}
              name={i < calificacion ? "star" : "star-outline"}
              size={16}
              color="#FFB800"
            />
          ))}
          <Text style={styles.resenas}>({resenas} reseñas)</Text>
        </View>

        <TouchableOpacity style={styles.boton} onPress={onPress}>
          <Text style={styles.textoBoton}>Ver más</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  info: {
    marginLeft: 10,
    flex: 1,
  },
  nombre: {
    fontWeight: "bold",
    color: "#333",
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  resenas: {
    fontSize: 12,
    color: "#777",
    marginLeft: 4,
  },
  boton: {
    backgroundColor: "#14841C",
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
  },
  textoBoton: {
    color: "#fff",
    fontWeight: "600",
  },
});
