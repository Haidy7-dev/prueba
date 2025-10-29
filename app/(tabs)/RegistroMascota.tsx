import { BASE_URL } from "@/config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import BotonGeneral from "../../components/BotonGeneral";

export default function RegistroMascota() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [sexo, setSexo] = useState("Macho");
  const [peso, setPeso] = useState("");
  const [edad, setEdad] = useState("");
  const [id_especie, setIdEspecie] = useState("");
  const [id_raza, setIdRaza] = useState("");
  const [id_usuario, setIdUsuario] = useState<string | null>(null);

  const [especies, setEspecies] = useState<{ id_especie: number; nombre: string }[]>([]);
  const [razas, setRazas] = useState<{ id_raza: number; nombre: string; id_especie: number }[]>([]);

  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (userId) setIdUsuario(userId);
      } catch (error) {
        console.error("Error al cargar usuario:", error);
      }
    };
    obtenerUsuario();
    getEspecies();
  }, []);

  const getEspecies = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/especie`);
      setEspecies(response.data);
    } catch (error) {
      // También cargamos las razas aquí para tenerlas disponibles
      console.error("Error al obtener especies:", error);
    }
  };

  const getRazas = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/raza`);
      console.log("Razas obtenidas:", response.data);
      setRazas(response.data);
    } catch (error) {
      console.error("Error al obtener razas:", error);
    }
  };

  // Cargar todas las razas al inicio
  useEffect(() => {
    getRazas();
  }, []);

  // Filtrar razas cuando cambia la especie
  const razasFiltradas = id_especie ? razas.filter((r) => r.id_especie === parseInt(id_especie)) : [];


  const handleGuardar = async () => {
    try {
      if (!id_usuario) {
        Alert.alert("Error", "No se encontró el usuario logueado");
        return;
      }

      // Validaciones
      if (!nombre.trim()) {
        Alert.alert("Error", "El nombre es obligatorio");
        return;
      }
      if (!peso || isNaN(parseFloat(peso))) {
        Alert.alert("Error", "El peso debe ser un número válido");
        return;
      }
      if (!edad || isNaN(parseInt(edad))) {
        Alert.alert("Error", "La edad debe ser un número válido");
        return;
      }
      if (!id_especie) {
        Alert.alert("Error", "Debe seleccionar una especie");
        return;
      }
      if (!id_raza) {
        Alert.alert("Error", "Debe seleccionar una raza");
        return;
      }

      const mascota = {
        nombre: nombre.trim(),
        sexo,
        peso: parseFloat(peso),
        edad: parseInt(edad),
        id_usuario: parseInt(id_usuario),
        id_especie: parseInt(id_especie),
        id_raza: parseInt(id_raza),
        foto: "foto.png", // valor por defecto según tu tabla
      };

      console.log("Enviando datos de mascota:", mascota);

      const response = await axios.post(`${BASE_URL}/api/mascota`, mascota);
      console.log("Respuesta del servidor:", response.data);

      Alert.alert("Éxito", "Mascota registrada correctamente");
      router.push("./PerfilMascota");
    } catch (error: any) {
      console.error("Error al registrar mascota:", error);
      if (error.response) {
        console.error("Respuesta de error del servidor:", error.response.data);
        Alert.alert("Error", `No se pudo registrar la mascota: ${error.response.data.message || 'Error desconocido'}`);
      } else if (error.request) {
        console.error("No se recibió respuesta del servidor:", error.request);
        Alert.alert("Error", "No se pudo conectar al servidor. Verifique su conexión a internet.");
      } else {
        Alert.alert("Error", "Ocurrió un error inesperado al registrar la mascota");
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require("../../assets/images/navegacion/patas_superior.png")} style={styles.ImagenSuperior} />
      <Text style={styles.title}>Registro de Mascota</Text>
      <Image source={require("../../assets/images/navegacion/iconomasco1.png")} style={styles.icono} />

      <TextInput placeholder="Nombre" style={styles.input} value={nombre} onChangeText={setNombre} />

      <View style={styles.pickerContainer}>
        <Picker selectedValue={sexo} onValueChange={setSexo} style={styles.picker}>
          <Picker.Item label="Macho" value="Macho" />
          <Picker.Item label="Hembra" value="Hembra" />
        </Picker>
      </View>

      <TextInput placeholder="Peso (kg)" style={styles.input} keyboardType="numeric" value={peso} onChangeText={setPeso} />
      <TextInput placeholder="Edad" style={styles.input} keyboardType="numeric" value={edad} onChangeText={setEdad} />

      <View style={styles.pickerContainer}>
        <Picker 
          selectedValue={id_especie} 
          onValueChange={(itemValue) => {
            setIdEspecie(itemValue);
            setIdRaza(""); // Reiniciar la raza al cambiar de especie
          }} 
          style={styles.picker}>
          <Picker.Item label="Seleccione especie" value="" />
          {especies.map((e) => (
            <Picker.Item key={e.id_especie || e.nombre} label={e.nombre} value={String(e.id_especie)} />
          ))}
        </Picker>
      </View>

      <View style={styles.pickerContainer}>
        <Picker selectedValue={id_raza} onValueChange={setIdRaza} style={styles.picker} enabled={!!id_especie && razasFiltradas.length > 0}>
          <Picker.Item label="Seleccione raza" value="" />
          {razasFiltradas.map((r) => (
            <Picker.Item key={r.id_raza || r.nombre} label={r.nombre} value={String(r.id_raza)} />
          ))}
        </Picker>
      </View>

      <BotonGeneral title="Guardar" onPress={handleGuardar} />

      <TouchableOpacity onPress={() => router.push("./PerfilMascota")}>
        <Text style={styles.omitirText}>Omitir</Text>
      </TouchableOpacity>

      <Image source={require("../../assets/images/navegacion/patas_inferior.png")} style={styles.ImagenInferior} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
    marginTop: 20,
  },
  icono: {
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderRadius: 8,
    padding: 12,
    width: "90%",
    marginBottom: 12,
    minHeight: 50,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderRadius: 8,
    width: "90%",
    marginBottom: 12,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  ImagenSuperior: {
    position: "absolute",
    top: 20,
    left: 20,
    width: 60,
    height: 60,
  },
  ImagenInferior: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  omitirText: {
    marginTop: 10,
    color: "#4CAF50",
    textDecorationLine: "underline",
    fontSize: 16,
  },
});
