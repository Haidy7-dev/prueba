import MenuDueno from "@/components/MenuDueno";
import BotonGeneral from "@/components/BotonGeneral";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {Image,ScrollView,StyleSheet,Text,TextInput,TouchableOpacity,View,Alert,KeyboardAvoidingView,Platform,} from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function EditarPerfilMascota() {
  // Estados
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);
  const [nombre, setNombre] = useState("");
  const [peso, setPeso] = useState("");
  const [sexo, setSexo] = useState("");
  const [razaSeleccionada, setRazaSeleccionada] = useState(""); 
  const [razas, setRazas] = useState([]); 

  // --- OBTENER RAZAS DESDE LA BASE DE DATOS ---
  const getRazas = async () => {
    try {
      const response = await axios.get(
        // "http://10.121.63.130:3000/api/razas"  // IP Salomé datos
         "http://192.168.101.73:3000/api/razas"  // IP Salomé casa
       // "http://10.164.93.119:3000/api/razas" // IP Haidy datos
      );
      setRazas(response.data);
    } catch (error) {
      console.log("Error al obtener las razas:", error);
    }
  };

  useEffect(() => {
    getRazas();
  }, []);

  // --- SELECCIONAR IMAGEN DE PERFIL ---
  const seleccionarImagen = async () => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permiso.granted) {
      Alert.alert("Permiso denegado", "Debes permitir el acceso a tus fotos.");
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!resultado.canceled) {
      setFotoPerfil(resultado.assets[0].uri);
    }
  };

  // --- GUARDAR INFORMACIÓN ---
  const manejarGuardar = () => {
    console.log("Datos de la mascota guardados:");
    console.log({ nombre, peso, sexo, razaSeleccionada, fotoPerfil });

    Alert.alert("Éxito", "El perfil de tu mascota ha sido guardado correctamente.");
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.mainContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* --- FOTO DE PERFIL --- */}
          <View style={styles.avatarWrapper}>
            <Image
              source={
                fotoPerfil
                  ? { uri: fotoPerfil }
                  : require("../../assets/images/navegacion/foto.png")
              }
              style={styles.avatar}
            />
            <TouchableOpacity
              style={styles.editIconContainer}
              onPress={seleccionarImagen}
            >
              <Feather name="edit-3" size={18} color="#000" />
            </TouchableOpacity>
          </View>

          {/* --- TÍTULO --- */}
          <Text style={styles.titulo}>Editar perfil</Text>

          {/* --- CAMPOS DE TEXTO --- */}
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Nombre de la mascota"
          />

          <Text style={styles.label}>Peso</Text>
          <TextInput
            style={styles.input}
            value={peso}
            onChangeText={setPeso}
            placeholder="Peso (kg)"
            keyboardType="numeric"
          />

          {/* --- SELECT: SEXO --- */}
          <Text style={styles.label}>Sexo</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={sexo}
              onValueChange={(itemValue) => setSexo(itemValue)}
            >
              <Picker.Item label="Seleccione una opción" value="" />
              <Picker.Item label="Macho" value="macho" />
              <Picker.Item label="Hembra" value="hembra" />
            </Picker>
          </View>

          {/* --- SELECT: RAZA (desde la BD) --- */}
          <Text style={styles.label}>Raza</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={razaSeleccionada}
              onValueChange={(itemValue) => setRazaSeleccionada(itemValue)}
            >
              <Picker.Item label="Seleccione una raza" value="" />
              {razas.map((r: any) => (
                <Picker.Item
                  key={r.id}
                  label={r.nombre}
                  value={r.nombre}
                />
              ))}
            </Picker>
          </View>

          {/* --- BOTÓN GUARDAR --- */}
          <View style={styles.botonContainer}>
            <BotonGeneral title="Guardar" onPress={manejarGuardar} />
          </View>

          {/* Enlace para ver otra mascota */}
          <TouchableOpacity>
            <Text style={styles.link}>Ver perfil de mi otra mascota</Text>
          </TouchableOpacity>

          {/* --- BOTONES INFERIORES --- */}
          <View style={styles.iconRow}>
            <TouchableOpacity style={styles.iconButton}>
              <Feather name="plus-circle" size={45} color="black" />
              <Text style={styles.iconText}>Agregar mascota</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Feather name="trash-2" size={45} color="black" />
              <Text style={styles.iconText}>Eliminar mascota</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* --- MENÚ FIJO CON ESPACIO --- */}
        <View style={styles.menuContainer}>
          <MenuDueno />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  mainContainer: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  scrollContainer: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#FFFFFF",
    paddingBottom: 40,
  },
  avatarWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 70,
    backgroundColor: "#E0E0E0",
  },
  editIconContainer: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 6,
    borderWidth: 1,
    borderColor: "#000",
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginLeft: "10%",
    marginTop: 10,
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
    borderWidth: 1.5,
    borderColor: "#14841C",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  pickerContainer: {
    width: "80%",
    height: 45,
    borderWidth: 1.5,
    borderColor: "#14841C",
    borderRadius: 8,
    justifyContent: "center",
    marginTop: 5,
  },
  botonContainer: {
    width: "80%",
    marginTop: 20,
  },
  link: {
    color: "#14841C",
    marginTop: 20,
    textDecorationLine: "underline",
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "90%",
    marginTop: 30,
    marginBottom: 30,
  },
  iconButton: {
    alignItems: "center",
  },
  iconText: {
    marginTop: 5,
    fontSize: 13,
    color: "#000",
    textAlign: "center",
  },
  menuContainer: {
    marginTop: 10,
  },
});






