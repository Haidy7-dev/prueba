import BotonGeneral from "@/components/BotonGeneral";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View, } from "react-native";

export default function PerfilVeterinario() {
  const [nombre, setNombre] = useState("");
  const [identificacion, setIdentificacion] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [especializacion, setEspecializacion] = useState("");
  const [informacion, setInformacion] = useState("");

  const manejarGuardar = () => {
    console.log("Datos guardados");
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Ionicons name="paw-outline" size={30} color="green" />
        <Ionicons name="log-out-outline" size={30} color="green" />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Foto de perfil vacía */}
        <View style={styles.avatarContainer}>
          <View style={styles.emptyAvatar}>
            <Ionicons name="person-outline" size={50} color="green" />
          </View>
          <View style={styles.editIcon}>
            <Ionicons name="pencil" size={16} color="#fff" />
          </View>
        </View>

        {/* Título */}
        <Text style={styles.title}>Editar perfil</Text>

        {/* Campos de texto */}
        <TextInput
          style={styles.input}
          placeholder="Nombre completo"
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput
          style={styles.input}
          placeholder="Identificación"
          value={identificacion}
          onChangeText={setIdentificacion}
        />
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          value={correo}
          onChangeText={setCorreo}
        />
        <TextInput
          style={styles.input}
          placeholder="Teléfono"
          value={telefono}
          onChangeText={setTelefono}
        />

        {/* Especialización */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={especializacion}
            onValueChange={(itemValue) => setEspecializacion(itemValue)}
          >
            <Picker.Item label="Especialización" value="" />
            <Picker.Item label="Cirugía" value="cirugia" />
            <Picker.Item label="Medicina general" value="general" />
            <Picker.Item label="Dermatología" value="dermatologia" />
            <Picker.Item label="Odontología" value="odontologia" />
          </Picker>
        </View>

        {/* Información */}
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Mi información..."
          value={informacion}
          onChangeText={setInformacion}
          multiline
        />

        {/* Texto guía */}
        <Text style={styles.helperText}>
          Haz clic en el botón para elegir u organizar tus horarios de atención.
        </Text>

        {/* Botón reutilizable */}
        <BotonGeneral
          title="Horarios"
          onPress={manejarGuardar}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  avatarContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  emptyAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "green",
    justifyContent: "center",
    alignItems: "center",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 135,
    backgroundColor: "green",
    borderRadius: 12,
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
    marginLeft: 25,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "green",
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 25,
    marginBottom: 12,
    fontSize: 14,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "green",
    borderRadius: 8,
    marginHorizontal: 25,
    marginBottom: 12,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  helperText: {
    textAlign: "center",
    fontSize: 13,
    color: "#555",
    marginTop: 5,
    marginBottom: 10,
    marginHorizontal: 20,
  },
});


