import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

type OfertaProps = {
  titulo: string;
  descripcion: string;
  imagen: string;
  onPress?: () => void;
};

export default function TarjetaOferta({
  titulo,
  descripcion,
  imagen,
  onPress,
}: OfertaProps) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: imagen }} style={styles.image} />
      <Text style={styles.titulo}>{titulo}</Text>
      <Text style={styles.descripcion}>{descripcion}</Text>
      <TouchableOpacity style={styles.boton} onPress={onPress}>
        <Text style={styles.textoBoton}>Ver más</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: 160,
    marginRight: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 80,
    borderRadius: 10,
  },
  titulo: {
    fontWeight: "bold",
    marginTop: 8,
    color: "#14841C",
  },
  descripcion: {
    fontSize: 12,
    color: "#333",
  },
  boton: {
    backgroundColor: "#14841C",
    marginTop: 6,
    borderRadius: 6,
    paddingVertical: 4,
    alignItems: "center",
  },
  textoBoton: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
});
