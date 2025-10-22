import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker"; // ← Permite elegir fotos desde la galería
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MenuDueno from "../../components/MenuDueno";

export default function PerfilDueno() {
  // Estado del perfil del usuario
  const [perfil, setPerfil] = useState({
    nombre: "",
    identificacion: "",
    correo: "",
    direccion: "",
    telefono: "",
  });

  // Estado para la imagen del perfil
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);

  // 📸 Función para abrir la galería y seleccionar una imagen
  const seleccionarImagen = async () => {
    // Pedir permiso para acceder a la galería
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permiso.granted) {
      Alert.alert("Permiso denegado", "Debes permitir el acceso a tus fotos.");
      return;
    }

    // Abrir la galería
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // permite recortar
      aspect: [1, 1], // formato cuadrado
      quality: 0.8,
    });

    if (!resultado.canceled) {
      // Actualiza la imagen del perfil con la seleccionada
      setFotoPerfil(resultado.assets[0].uri);
    }
  };

  // Actualizar campos del formulario
  const handleChange = (field: string, value: string) => {
    setPerfil({ ...perfil, [field]: value });
  };

  return (
    <View style={styles.container}>
      {/* --- ENCABEZADO SUPERIOR --- */}
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
                ? { uri: fotoPerfil } // Si el usuario seleccionó una imagen, la muestra
                : require("../../assets/images/navegacion/sinfoto.png") // Si no, muestra la por defecto
            }
            style={styles.profileImage}
            resizeMode="cover"
          />

          {/* ICONO DE EDICIÓN (CÁMARA) */}
          <TouchableOpacity style={styles.editIconContainer} onPress={seleccionarImagen}>
            <Feather name="edit-3" size={18} color="#000000" />
          </TouchableOpacity>
        </View>

        {/* TÍTULO */}
        <Text style={styles.title}>Editar perfil</Text>

        {/* CAMPOS DEL FORMULARIO */}
        <TextInput
          style={styles.input}
          placeholder="Nombre completo"
          value={perfil.nombre}
          onChangeText={(text) => handleChange("nombre", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Identificación"
          value={perfil.identificacion}
          onChangeText={(text) => handleChange("identificacion", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          keyboardType="email-address"
          value={perfil.correo}
          onChangeText={(text) => handleChange("correo", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Dirección de residencia"
          value={perfil.direccion}
          onChangeText={(text) => handleChange("direccion", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Teléfono"
          keyboardType="phone-pad"
          value={perfil.telefono}
          onChangeText={(text) => handleChange("telefono", text)}
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
    paddingHorizontal: 20,
    paddingTop: 10,
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

  // --- CAMPOS DE FORMULARIO ---
  input: {
    width: "100%",
    borderWidth: 1.5,
    borderColor: "#14841C",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12,
    fontSize: 15,
    color: "#333",
  },
});
