import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {Alert,Image,ScrollView,StyleSheet,Text,TextInput,TouchableOpacity,View,} from "react-native";
import MenuDueno from "../../components/MenuDueno";
import BotonGeneral from "@/components/BotonGeneral";
import axios from "axios";

export default function PerfilDueno() {
  // Estado del perfil
  const [perfil, setPerfil] = useState({
    nombre: "",
    identificacion: "",
    correo: "",
    direccion: "",
    telefono: "",
    numMascotas: "",
  });

  // Función para guardar los datos del perfil en el backend
const guardarPerfil = async () => {
  try {
    // Objeto con la información del perfil
    const datosPerfil = {
      nombre: perfil.nombre,
      identificacion: perfil.identificacion,
      correo: perfil.correo,
      direccion: perfil.direccion,
      telefono: perfil.telefono,
      //numero_mascotas: perfil.numeroMascotas,
    };

    //IP Salomé casa
    const respuesta = await axios.post("http://192.168.101.73:3000/api/usuario", datosPerfil);
    //IP Salomé datos
    //const respuesta = await axios.post("http://10.121.63.130:3000/api/usuario", datosPerfil);

    //IP Haidy casa
        //const respuesta = await axios.post("http://192.168.1.16:3000/api/usuario", datosPerfil);
    //IP Haidy datos
    //const respuesta = await axios.post("http://10.164.93.119:3000/api/usuario", datosPerfil);
    

    // Si llega respuesta exitosa
    Alert.alert("Éxito", "El perfil se actualizó correctamente");
    console.log("Respuesta del servidor:", respuesta.data);
  } catch (error) {
    console.error("Error al guardar el perfil:", error);
    Alert.alert("Error", "No se pudo guardar la información del perfil");
  }
};

  // Estado para la imagen del perfil
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);

  // Seleccionar imagen
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

  // Cambiar valores del formulario
  const handleChange = (field: string, value: string) => {
    setPerfil({ ...perfil, [field]: value });
  };

  return (
    <View style={styles.container}>
      {/* --- ENCABEZADO --- */}
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/navegacion/Pata.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <TouchableOpacity>
          <Image
            source={require("../../assets/images/navegacion/iconosalir.png")}
            style={styles.iconSalir}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* IMAGEN DE PERFIL */}
        <View style={styles.profileImageContainer}>
          <Image
            source={
              fotoPerfil
                ? { uri: fotoPerfil }
                : require("../../assets/images/navegacion/foto.png")
            }
            style={styles.profileImage}
            resizeMode="cover"
          />

          {/* Icono de edición */}
          <TouchableOpacity style={styles.editIconContainer} onPress={seleccionarImagen}>
            <Feather name="edit-3" size={18} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Título */}
        <Text style={styles.title}>Editar perfil</Text>

        {/* FORMULARIO */}
        <View style={styles.formContainer}>
          <Text style={styles.label}>Nombre completo</Text>
          <TextInput
            style={styles.input}
            value={perfil.nombre}
            onChangeText={(text) => handleChange("nombre", text)}
          />

          <Text style={styles.label}>Identificación</Text>
          <TextInput
            style={styles.input}
            value={perfil.identificacion}
            onChangeText={(text) => handleChange("identificacion", text)}
          />

          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            keyboardType="email-address"
            value={perfil.correo}
            onChangeText={(text) => handleChange("correo", text)}
          />

          <Text style={styles.label}>Dirección de residencia</Text>
          <TextInput
            style={styles.input}
            value={perfil.direccion}
            onChangeText={(text) => handleChange("direccion", text)}
          />

          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={styles.input}
            keyboardType="phone-pad"
            value={perfil.telefono}
            onChangeText={(text) => handleChange("telefono", text)}
          />

          <Text style={styles.label}>Número de mascotas</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={perfil.numMascotas}
            onChangeText={(text) => handleChange("numMascotas", text)}
          />
        </View>

        <BotonGeneral
          title="Guardar"
          onPress={guardarPerfil}
        />

      </ScrollView>
      
      {/* --- MENÚ INFERIOR --- */}
      <MenuDueno />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  // --- ENCABEZADO ---
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 5,
  },
  logo: {
    width: 40,
    height: 50,
  },
  iconSalir: {
    width: 30,
    height: 30,
  },

  // --- CONTENIDO PRINCIPAL ---
  content: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 25,
    paddingBottom: 100, // espacio para el menú
  },

  // --- IMAGEN DE PERFIL ---
  profileImageContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  profileImage: {
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
    borderColor: "#000000",
  },

  // --- TÍTULO ---
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },

  // --- FORMULARIO ---
  formContainer: {
    width: "100%",
  },
  label: {
    color: "#333",
    fontSize: 15,
    marginBottom: 4,
    fontWeight: "600",
  },
  input: {
    width: "100%",
    borderWidth: 1.5,
    borderColor: "#14841C",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 14,
    fontSize: 15,
    color: "#333",
  },
});
