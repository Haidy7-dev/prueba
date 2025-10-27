import MenuDueno from "@/components/MenuDueno";
import BotonGeneral from "@/components/BotonGeneral";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Image,ScrollView,StyleSheet,Text,TextInput,TouchableOpacity,View,Alert,KeyboardAvoidingView,Platform,ActivityIndicator,} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams } from "expo-router";

export default function PerfilMascota() {
  const { idMascota } = useLocalSearchParams(); // Debe recibirse como idMascota desde la navegación
  console.log("🟢 ID recibido:", idMascota);

  // Estados
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);
  const [nombre, setNombre] = useState("");
  const [peso, setPeso] = useState("");
  const [sexo, setSexo] = useState("");
  const [razaSeleccionada, setRazaSeleccionada] = useState("");
  const [razas, setRazas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --- OBTENER RAZAS ---
  const getRazas = async () => {
    try {
      const response = await axios.get("http://192.168.101.73:3000/api/razas");
      setRazas(response.data);
    } catch (error) {
      console.log("❌ Error al obtener las razas:", error);
    }
  };

  // --- OBTENER PERFIL DE LA MASCOTA ---
  const getPerfilMascota = async () => {
    try {
      if (!idMascota) {
        console.log("⚠️ No se recibió idMascota");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `http://192.168.101.73:3000/api/perfilMascota/${idMascota}`
      );

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
      setRazaSeleccionada(mascota.raza || mascota.raza_id?.toString() || "");
      setFotoPerfil(mascota.foto || mascota.imagen || null);
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
  }, [idMascota]);

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
  const manejarGuardar = async () => {
    try {
      if (!idMascota) {
        Alert.alert("Error", "No se encontró el ID de la mascota.");
        return;
      }

      const payload = {
        nombre,
        peso,
        sexo,
        raza: razaSeleccionada,
        foto: fotoPerfil,
      };

      console.log("📤 Enviando datos al backend:", payload);

      await axios.put(
        `http://192.168.101.73:3000/api/perfilMascota/${idMascota}`,
        payload
      );

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

          <Text style={styles.label}>Raza</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={razaSeleccionada}
              onValueChange={(itemValue) => setRazaSeleccionada(itemValue)}
            >
              <Picker.Item label="Seleccione una raza" value="" />
              {razas.map((r: any) => (
                <Picker.Item key={r.id_raza} label={r.nombre} value={r.nombre} />
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




