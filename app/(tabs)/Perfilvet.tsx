import { useRouter } from "expo-router";
import BotonGeneral from "@/components/BotonGeneral";
import MenuVet from "@/components/MenuVet";
import { Feather } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import React, { useState, useEffect } from "react";
import {ScrollView,StyleSheet,Text,TextInput,View,Image,TouchableOpacity,Alert,} from "react-native";

export default function PerfilVeterinario() {
  const router = useRouter();

  // --- Estados de los datos del formulario ---
  const [nombre, setNombre] = useState("");
  const [identificacion, setIdentificacion] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [especializacion, setEspecializacion] = useState("");
  const [informacion, setInformacion] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);

  // --- Estado para las especializaciones desde la base de datos ---
  const [especializaciones, setEspecializaciones] = useState([]);

  // --- OBTENER DATOS DE LA BASE DE DATOS ---
  const getEspecializaciones = async () => {
    try {
      const response = await axios.get(
        // "http://10.121.63.130:3000/api/especializaciones"  // Salomé datos
         "http://192.168.101.73:3000/api/especializaciones"  // Salomé casa
        //"http://10.164.93.119:3000/api/especializaciones"  // Haidy datos

      );
      setEspecializaciones(response.data);
    } catch (error) {
      console.log("Error al obtener las especializaciones:", error);
    }
  };

  useEffect(() => {
    getEspecializaciones();
  }, []);

  // --- GUARDAR INFORMACIÓN ---
  const manejarGuardar = () => {
    console.log("Datos guardados correctamente:");
    console.log({
      nombre,
      identificacion,
      correo,
      telefono,
      especializacion,
      informacion,
      fotoPerfil,
    });
    Alert.alert("Éxito", "La información ha sido guardada correctamente.");
  };

  // --- NAVEGAR A HORARIOS ---
  const irAHorarios = () => {
    router.push("/Horariosvet");
  };

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
          <TouchableOpacity
            style={styles.editIconContainer}
            onPress={seleccionarImagen}
          >
            <Feather name="edit-3" size={18} color="#000" />
          </TouchableOpacity>
        </View>

        {/* TÍTULO */}
        <Text style={styles.title}>Editar perfil</Text>

        {/* CAMPOS DE TEXTO */}
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

        {/* PICKER DE ESPECIALIZACIÓN (desde la BD) */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={especializacion}
            onValueChange={(itemValue) => setEspecializacion(itemValue)}
          >
            <Picker.Item label="Seleccione su especialización" value="" />
            {especializaciones.map((esp: any) => (
              <Picker.Item key={esp.id} label={esp.nombre} value={esp.nombre} />
            ))}
          </Picker>
        </View>

        {/* INFORMACIÓN */}
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Mi información..."
          value={informacion}
          onChangeText={setInformacion}
          multiline
        />

        {/* BOTONES */}
        <View style={styles.botonesContainer}>
          <BotonGeneral title="Guardar" onPress={manejarGuardar} />
          <Text style={styles.infoText}>
            ¡Ya casi terminas! Guarda tu info y organiza tus horarios.
          </Text>

          <BotonGeneral title="Ir a horarios" onPress={irAHorarios} />
        </View>
      </ScrollView>

      {/* --- MENÚ INFERIOR --- */}
      <MenuVet />
    </View>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  logo: {
    width: 40,
    height: 40,
  },
  iconSalir: {
    width: 30,
    height: 30,
  },
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
    textAlign: "left",
    alignSelf: "flex-start",
    marginLeft: 25,
    marginBottom: 10,
  },
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
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  botonesContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  infoText: {
    textAlign: "center",
    color: "#444",
    fontSize: 13,
    marginVertical: 12,
    marginHorizontal: 20,
    fontStyle: "italic",
  },
});









