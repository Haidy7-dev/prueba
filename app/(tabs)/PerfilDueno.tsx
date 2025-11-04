import BotonGeneral from "@/components/BotonGeneral";
import Encabezado from "@/components/Encabezado";
import { BASE_URL } from "@/config/api";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
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
  const router = useRouter();
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

        // Actualizar el estado del perfil con los datos obtenidos
        setPerfil({
          id: datos.id || "",
          primer_nombre: datos.primer_nombre || "",
          segundo_nombre: datos.segundo_nombre || "",
          primer_apellido: datos.primer_apellido || "",
          segundo_apellido: datos.segundo_apellido || "",
          correo_electronico: datos.correo_electronico || "",
          direccion: datos.direccion || "",
          telefono: datos.telefono || "",
          n_de_mascotas: datos.n_de_mascotas?.toString() || "",
          foto: datos.foto || "foto.png",
        });

        if (datos.foto) {
          if (datos.foto.startsWith('http') || datos.foto.startsWith('file')) {
            setFotoPerfil(datos.foto);
          } else {
            setFotoPerfil(`${BASE_URL}/pethub/${datos.foto}`);
          }
        } else {
          setFotoPerfil(`${BASE_URL}/pethub/foto.png`);
        }
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

      let fotoFilename = perfil.foto; // Por defecto, usa la foto existente
      if (fotoPerfil) {
        // Si hay una nueva foto seleccionada (que ya fue subida y tiene la URL completa)
        fotoFilename = fotoPerfil.split('/').pop() || perfil.foto; // Extrae solo el nombre del archivo
      }

      const datosActualizados = {
        primer_nombre: perfil.primer_nombre,
        segundo_nombre: perfil.segundo_nombre,
        primer_apellido: perfil.primer_apellido,
        segundo_apellido: perfil.segundo_apellido,
        correo_electronico: perfil.correo_electronico,
        direccion: perfil.direccion,
        telefono: perfil.telefono,
        n_de_mascotas: perfil.n_de_mascotas,
        foto: fotoFilename, // Envía solo el nombre del archivo
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
      const uri = resultado.assets[0].uri;

      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        Alert.alert("Error", "Usuario no identificado para subir la foto.");
        return;
      }

      const formData = new FormData();
      const fileName = uri.split('/').pop() || 'foto.jpg';
      const fileType = fileName.split('.').pop() || 'jpg';

      formData.append('foto', {
        uri,
        name: fileName,
        type: `image/${fileType}`,
      } as any);

      try {
        const response = await axios.post(`${BASE_URL}/upload/usuario/${userId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        // El backend debe devolver la ruta completa o el nombre del archivo
        // Asumiendo que devuelve { ruta: "nombre_del_archivo.jpg" }
        setFotoPerfil(`${BASE_URL}/pethub/${response.data.ruta}`);
        Alert.alert("Éxito", "Foto de perfil actualizada.");
      } catch (error) {
        console.error("Error al subir la foto:", error);
        Alert.alert("Error", "No se pudo subir la foto de perfil.");
      }
    }
  };

  // 🔹 Cambiar valores del formulario
  const handleChange = (field: keyof PerfilUsuario, value: string) => {
    setPerfil({ ...perfil, [field]: value });
  };

  return (
    <View style={styles.container}>
      {/* --- ENCABEZADO --- */}
      <Encabezado />

      {/* --- CONTENIDO PRINCIPAL --- */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* IMAGEN DE PERFIL */}
        <View style={styles.profileImageContainer}>
          <Image
            source={
              fotoPerfil
                ? { uri: fotoPerfil }
                : { uri: `${BASE_URL}/pethub/foto.png` }
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
