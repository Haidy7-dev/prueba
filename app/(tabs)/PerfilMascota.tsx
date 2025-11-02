import BotonGeneral from "@/components/BotonGeneral";
import MenuDueno from "@/components/MenuDueno";
import { BASE_URL } from "@/config/api";
import { Feather } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, } from "react-native";

export default function PerfilMascota() {
  const { id } = useLocalSearchParams(); // Debe recibirse como idMascota desde la navegación
  console.log("🟢 ID recibido:", id);

  // Estados
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);
  const [nombre, setNombre] = useState("");
  const [peso, setPeso] = useState("");
  const [sexo, setSexo] = useState("");
  const [edad, setEdad] = useState("");
  const [razaSeleccionada, setRazaSeleccionada] = useState("");
  const [razas, setRazas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --- OBTENER RAZAS ---
  const getRazas = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/raza`);
      setRazas(response.data);
    } catch (error) {
      console.log("❌ Error al obtener las razas:", error);
    }
  };

  // --- OBTENER PERFIL DE LA MASCOTA ---
  const getPerfilMascota = async () => {
    try {
      if (!id) {
        console.log("⚠️ No se recibió id");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${BASE_URL}/api/mascota/${id}`);

      console.log("📦 Respuesta del backend:", response.data);

      // Si el backend devuelve un array
      const mascota = Array.isArray(response.data)
        ? response.data[0]
        : response.data;

      if (!mascota) {
        Alert.alert("Aviso", "No se encontró información de la mascota.");
        return;
      }

      setNombre(mascota.nombre || "");
      setPeso(mascota.peso ? mascota.peso.toString() : "");
      setSexo(mascota.sexo || "");
      setEdad(mascota.edad ? mascota.edad.toString() : "");
      setRazaSeleccionada(mascota.id_raza?.toString() || "");
      setFotoPerfil(mascota.foto || null);
    } catch (error: any) {
      console.log("❌ Error al cargar perfil:", error.response?.data || error.message);
      Alert.alert("Error", "No se pudo cargar la información de la mascota.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRazas();
    getPerfilMascota();
  }, [id]);

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

  // --- SUBIR FOTO SI ES NUEVA ---
  const subirFotoSiNueva = async () => {
    if (!fotoPerfil || (!fotoPerfil.startsWith('file://') && !fotoPerfil.startsWith('content://'))) {
      // No es una foto nueva, devolver la existente
      return fotoPerfil;
    }

    try {
      const formData = new FormData();
      formData.append('foto', {
        uri: fotoPerfil,
        type: 'image/jpeg', // Ajustar según el tipo si es necesario
        name: 'foto.jpg',
      } as any);

      const response = await axios.post(`${BASE_URL}/upload/mascota/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("📤 Foto subida:", response.data);
      return response.data.ruta; // Retornar la ruta del archivo subido
    } catch (error: any) {
      console.log("❌ Error al subir foto:", error.response?.data || error.message);
      // En caso de error, devolver la foto existente para no perderla
      return fotoPerfil;
    }
  };

  // --- GUARDAR INFORMACIÓN ---
  const manejarGuardar = async () => {
    try {
      if (!id) {
        Alert.alert("Error", "No se encontró el ID de la mascota.");
        return;
      }

      // Subir foto si es nueva
      const rutaFoto = await subirFotoSiNueva();

      const payload = {
        nombre,
        peso,
        sexo,
        edad,
        id_raza: razaSeleccionada,
        foto: rutaFoto,
      };

      console.log("📤 Enviando datos al backend:", payload);

      await axios.put(`${BASE_URL}/api/mascota/${id}`, payload);

      // Actualizar el estado de la foto para refrescar la imagen mostrada
      setFotoPerfil(rutaFoto);

      Alert.alert("Éxito", "El perfil de tu mascota ha sido guardado correctamente.");
    } catch (error: any) {
      console.log("❌ Error al guardar:", error.response?.data || error.message);
      Alert.alert("Error", "No se pudo guardar la información.");
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#14841C" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.mainContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* FOTO DE PERFIL */}
          <View style={styles.avatarWrapper}>
            <Image
              source={
                fotoPerfil
                  ? { uri: `${BASE_URL}/pethub/${fotoPerfil}` }
                  : require("../../assets/images/navegacion/foto1.png")
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

          {/* TÍTULO */}
          <Text style={styles.titulo}>Perfil de mi mascota</Text>

          {/* CAMPOS */}
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
          />

          <Text style={styles.label}>Peso (kg)</Text>
          <TextInput
            style={styles.input}
            value={peso}
            onChangeText={setPeso}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Edad (años)</Text>
          <TextInput
            style={styles.input}
            value={edad}
            onChangeText={setEdad}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Sexo</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={sexo}
              onValueChange={(itemValue) => setSexo(itemValue)}
            >
              <Picker.Item label="Seleccione una opción" value="" />
              <Picker.Item label="Macho" value="Macho" />
              <Picker.Item label="Hembra" value="Hembra" />
            </Picker>
          </View>

          <Text style={styles.label}>Raza</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={razaSeleccionada}
              onValueChange={(itemValue) => setRazaSeleccionada(itemValue)}
            >
              <Picker.Item label="Seleccione una raza" value="" />
              {razas.map((r: any) => (
                <Picker.Item key={r.id_raza} label={r.nombre} value={r.id_raza.toString()} />
              ))}
            </Picker>
          </View>

          {/* BOTÓN GUARDAR */}
          <View style={styles.botonContainer}>
            <BotonGeneral title="Guardar" onPress={manejarGuardar} />
          </View>
        </ScrollView>

        {/* MENÚ FIJO */}
        <View style={styles.menuContainer}>
          <MenuDueno />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  keyboardContainer: { flex: 1, backgroundColor: "#fff" },
  mainContainer: { flex: 1, justifyContent: "space-between", backgroundColor: "#fff" },
  scrollContainer: { alignItems: "center", paddingVertical: 30 },
  avatarWrapper: { position: "relative", alignItems: "center", justifyContent: "center", marginBottom: 15 },
  avatar: { width: 130, height: 130, borderRadius: 70, backgroundColor: "#E0E0E0" },
  editIconContainer: { position: "absolute", bottom: 8, right: 8, backgroundColor: "#fff", borderRadius: 20, padding: 6, borderWidth: 1, borderColor: "#000" },
  titulo: { fontSize: 20, fontWeight: "bold", alignSelf: "flex-start", marginLeft: "10%", marginTop: 10 },
  label: { alignSelf: "flex-start", marginLeft: "10%", marginTop: 10, fontSize: 14 },
  input: { width: "80%", height: 40, borderWidth: 1.5, borderColor: "#14841C", borderRadius: 8, paddingHorizontal: 10, marginTop: 5 },
  pickerContainer: { width: "80%", height: 45, borderWidth: 1.5, borderColor: "#14841C", borderRadius: 8, justifyContent: "center", marginTop: 5 },
  botonContainer: { width: "80%", marginTop: 20 },
  menuContainer: { marginTop: 10 },
});
