import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function EditarPerfilMascota() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Icono del perro en lugar de imagen */}
      <View style={styles.avatarWrapper}>
        <MaterialCommunityIcons name="dog" size={80} color="#4CAF50" />
        <Feather name="edit-2" size={18} color="#000" style={styles.editIcon} />
      </View>

      <Text style={styles.titulo}>Editar perfil</Text>

      <Text style={styles.label}>Nombre</Text>
      <TextInput style={styles.input} />

      <Text style={styles.label}>Peso</Text>
      <TextInput style={styles.input} />

      <Text style={styles.label}>Sexo</Text>
      <TextInput style={styles.input} />

      <Text style={styles.label}>Raza</Text>
      <View style={styles.input} />

      {/* Enlace */}
      <TouchableOpacity>
        <Text style={styles.link}>Ver perfil de mi otra mascota</Text>
      </TouchableOpacity>

      {/* Botones inferiores */}
      <View style={styles.iconRow}>
        <TouchableOpacity>
          <Feather name="plus-circle" size={50} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Feather name="trash-2" size={50} color="black" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#FFFFFF",
  },
  avatarWrapper: {
    width: 120,
    height: 120,
    borderRadius: 100,
    backgroundColor: "#B3EAC9",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  editIcon: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "#fff",
    padding: 3,
    borderRadius: 50,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginLeft: "10%",
    marginTop: 20,
  },
  label: {
    alignSelf: "flex-start",
    marginLeft: "10%",
    marginTop: 10,
    fontSize: 14,
  },
  input: {
    width: "80%",
    height: 40,
    borderWidth: 2,
    borderColor: "#4CAF50",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  link: {
    color: "#4CAF50",
    marginTop: 20,
    textDecorationLine: "underline",
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "60%",
    marginTop: 20,
  },
});
