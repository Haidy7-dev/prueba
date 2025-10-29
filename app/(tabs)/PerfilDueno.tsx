import BotonGeneral from "@/components/BotonGeneral";
import { BASE_URL } from "@/config/api";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, } from "react-native";
import MenuDueno from "../../components/MenuDueno";

// 🟢 Tipo del perfil de usuario
type PerfilUsuario = {
  id: string;
  primer_nombre: string;
  segundo_nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  correo_electronico: string;
  direccion: string;
  telefono: string;
  n_de_mascotas: string;
  foto: string;
};

export default function PerfilDueno() {
  const [perfil, setPerfil] = useState<PerfilUsuario>({
    id: "",
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    correo_electronico: "",
    direccion: "",
    telefono: "",
    n_de_mascotas: "",
    foto: "",
  });

  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);

  // 🔹 Cargar perfil desde el backend
  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) return Alert.alert("Error", "Usuario no encontrado");

        const respuesta = await axios.get(`${BASE_URL}/api/usuario/${userId}`);
        const datos = respuesta.data;

        setPerfil({
          id: datos.id || "",
          primer_nombre: datos.primer_nombre || "",
          segundo_nombre: datos.segundo_nombre || "",
          primer_apellido: datos.primer_apellido || "",
          segundo_apellido: datos.segundo_apellido || "",
          correo_electronico: datos.correo_electronico || "",
          direccion: datos.direccion || "",
          telefono: datos.telefono || "",
          n_de_mascotas: datos.n_de_mascotas?.toString() || "0",
          foto: datos.foto || "",
        });

        setFotoPerfil(datos.foto || null);
      } catch (error) {
        console.error("❌ Error al cargar perfil:", error);
        Alert.alert("Error", "No se pudo cargar la información del perfil");
      }
    };

    cargarPerfil();
  }, []);

  // 🔹 Guardar cambios del perfil
  const guardarPerfil = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) return Alert.alert("Error", "Usuario no identificado");

      const datosActualizados = {
        primer_nombre: perfil.primer_nombre,
        segundo_nombre: perfil.segundo_nombre,
        primer_apellido: perfil.primer_apellido,
        segundo_apellido: perfil.segundo_apellido,
        correo_electronico: perfil.correo_electronico,
        direccion: perfil.direccion,
        telefono: perfil.telefono,
        n_de_mascotas: perfil.n_de_mascotas,
        foto: fotoPerfil || perfil.foto,
      };

      await axios.put(`${BASE_URL}/api/usuario/${userId}`, datosActualizados);

      Alert.alert("✅ Éxito", "La información ha sido actualizada correctamente");
    } catch (error) {
      console.error("❌ Error al guardar perfil:", error);
      Alert.alert("Error", "No se pudo guardar la información del perfil");
    }
  };

  // 🔹 Seleccionar imagen
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

  // 🔹 Cambiar valores del formulario
  const handleChange = (field: keyof PerfilUsuario, value: string) => {
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
          <TouchableOpacity
            style={styles.editIconContainer}
            onPress={seleccionarImagen}
          >
            <Feather name="edit-3" size={18} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Título */}
        <Text style={styles.title}>Editar perfil</Text>

        {/* FORMULARIO GENERADO AUTOMÁTICAMENTE */}
        {(
          [
            ["Primer nombre", "primer_nombre"],
            ["Segundo nombre", "segundo_nombre"],
            ["Primer apellido", "primer_apellido"],
            ["Segundo apellido", "segundo_apellido"],
            ["Correo electrónico", "correo_electronico"],
            ["Dirección", "direccion"],
            ["Teléfono", "telefono"],
            ["Número de mascotas", "n_de_mascotas"],
          ] as [string, keyof PerfilUsuario][]
        ).map(([label, key]) => (
          <View key={key} style={{ width: "100%", marginBottom: 14 }}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
              style={styles.input}
              value={perfil[key]}
              onChangeText={(text) => handleChange(key, text)}
              keyboardType={
                key === "telefono"
                  ? "phone-pad"
                  : key === "correo_electronico"
                  ? "email-address"
                  : key === "n_de_mascotas"
                  ? "numeric"
                  : "default"
              }
            />
          </View>
        ))}

        <BotonGeneral title="Guardar" onPress={guardarPerfil} />
      </ScrollView>

      {/* --- MENÚ INFERIOR --- */}
      <MenuDueno />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 5,
  },
  logo: { width: 40, height: 50 },
  iconSalir: { width: 30, height: 30 },
  content: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 25,
    paddingBottom: 100,
  },
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
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
    fontSize: 15,
    color: "#333",
  },
});
