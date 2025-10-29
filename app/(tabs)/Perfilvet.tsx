import BotonGeneral from "@/components/BotonGeneral";
import MenuVet from "@/components/MenuVet";
import { BASE_URL } from "@/config/api";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, } from "react-native";

export default function PerfilVeterinario() {
  const router = useRouter();
  
  const [idVet, setIdVet] = useState<string | null>(null);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [especializacion, setEspecializacion] = useState("");
  const [informacion, setInformacion] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);
  const [especializaciones, setEspecializaciones] = useState([]);

  // ✅ Cargar veterinario desde backend
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const id = await AsyncStorage.getItem("userId");
        if (!id) return;

        setIdVet(id);

        const res = await axios.get(`${BASE_URL}/api/veterinarios/${id}`);
        const v = res.data;
        setNombre(v.nombre || "");
        setCorreo(v.correo_electronico || "");
        setTelefono(v.telefono || "");
        setEspecializacion(v.especializacion || "");
        setInformacion(v.informacion || "");
        setFotoPerfil(v.foto || null);
      } catch (error: any) {
        console.error("Error al cargar perfil:", error);
        Alert.alert("Error", "No se pudo cargar el perfil del veterinario.");
      }
    };
    cargarDatos();
  }, []);

  // ✅ Cargar lista de especializaciones
  useEffect(() => {
    const getEspecializaciones = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/especializaciones`);
        setEspecializaciones(response.data);
      } catch (error) {
        console.log("Error al obtener especializaciones:", error);
      }
    };
    getEspecializaciones();
  }, []);

  // ✅ Guardar perfil
  const manejarGuardar = async () => {
    if (!idVet) return Alert.alert("Error", "No se pudo identificar al veterinario.");

    try {
      await axios.put(`${BASE_URL}/api/veterinarios/${idVet}`, {
        nombre,
        correo_electronico: correo,
        telefono,
        especializacion,
        informacion,
        foto: fotoPerfil,
      });

      Alert.alert("Éxito", "Perfil actualizado correctamente.");
    } catch (error) {
      console.error("Error al guardar perfil:", error);
      Alert.alert("Error", "No se pudo guardar la información.");
    }
  };

  const irAHorarios = () => router.push("/Horariosvet");

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

    if (!resultado.canceled) setFotoPerfil(resultado.assets[0].uri);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/navegacion/Pata.png")}
          style={styles.logo}
        />
        <TouchableOpacity>
          <Image
            source={require("../../assets/images/navegacion/iconosalir.png")}
            style={styles.iconSalir}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileImageContainer}>
          <Image
            source={
              fotoPerfil
                ? { uri: fotoPerfil }
                : require("../../assets/images/navegacion/foto.png")
            }
            style={styles.profileImage}
          />
          <TouchableOpacity
            style={styles.editIconContainer}
            onPress={seleccionarImagen}
          >
            <Feather name="edit-3" size={18} color="#000" />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Editar perfil</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre completo"
          value={nombre}
          onChangeText={setNombre}
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

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={especializacion}
            onValueChange={(val) => setEspecializacion(val)}
          >
            <Picker.Item label="Seleccione su especialización" value="" />
            {especializaciones.map((esp: any) => (
              <Picker.Item key={esp.id} label={esp.nombre} value={esp.nombre} />
            ))}
          </Picker>
        </View>

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Mi información..."
          value={informacion}
          onChangeText={setInformacion}
          multiline
        />

        <View style={styles.botonesContainer}>
          <BotonGeneral title="Guardar" onPress={manejarGuardar} />
          <Text style={styles.infoText}>
            ¡Ya casi terminas! Guarda tu info y organiza tus horarios.
          </Text>
          <BotonGeneral title="Ir a horarios" onPress={irAHorarios} />
        </View>
      </ScrollView>

      <MenuVet />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 40 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  logo: { width: 40, height: 40 },
  iconSalir: { width: 30, height: 30 },
  content: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 25,
    paddingBottom: 100,
  },
  profileImageContainer: { position: "relative", alignItems: "center" },
  profileImage: { width: 130, height: 130, borderRadius: 70, backgroundColor: "#E0E0E0" },
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
  title: { fontSize: 18, fontWeight: "bold", alignSelf: "flex-start", marginLeft: 25 },
  input: {
    borderWidth: 1,
    borderColor: "green",
    borderRadius: 8,
    padding: 10,
    width: "100%",
    marginBottom: 12,
    fontSize: 14,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "green",
    borderRadius: 8,
    width: "100%",
    marginBottom: 12,
  },
  textArea: { height: 80, textAlignVertical: "top" },
  botonesContainer: { width: "100%", alignItems: "center", marginTop: 10 },
  infoText: {
    textAlign: "center",
    color: "#444",
    fontSize: 13,
    marginVertical: 12,
    fontStyle: "italic",
  },
});
