import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import BotonGeneral from "../../components/BotonGeneral";

export default function RegistroMascota() {
  const router = useRouter();
  const [sexo, setSexo] = useState([]);
  const [especie, setEspecie] = useState([]);
  const [raza, setRaza] = useState([]);

  const getEspecie = async () => {
    try {
      const response = await axios.get("http://192.168.101.73:3000/api/especie");
      setEspecie(response.data);
    } catch (error) {
      console.error("Error al obtener los datos de la especie", error);
    }
  };

  const getRaza = async () => {
    try {
      const response = await axios.get("http://192.168.101.73:3000/api/raza");
      setRaza(response.data);
    } catch (error) {
      console.error("Error al obtener los datos de la raza", error);
    }
  };

  useEffect(() => {
    getEspecie();
    getRaza();
  }, []);

  // Estados para pickers
  const [especies, setEspecies] = useState("");
  const [razas, setRazas] = useState("");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require("../../assets/images/navegacion/patas_superior.png")} style={styles.ImagenSuperior} />
      <Text style={styles.title}>Registro</Text>
      <Image source={require("../../assets/images/navegacion/iconomasco1.png")} style={styles.icono} />

      <TextInput placeholder="Nombre" style={styles.input} />
      <View style={styles.pickerContainer}>
        <Picker selectedValue={sexo} onValueChange={(value) => setSexo(value)} style={styles.picker}>
          <Picker.Item label="Macho" value="Macho" />
          <Picker.Item label="Hembra" value="Hembra" />
        </Picker>
      </View>

      <TextInput placeholder="Peso" style={styles.input} keyboardType="numeric" />
      <TextInput placeholder="Edad" style={styles.input} keyboardType="numeric" />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={especies}
          onValueChange={(itemValue) => setEspecies(itemValue)}
          style={styles.picker}
        >
          {especie.map((espe: any) => (
            <Picker.Item key={espe.nombre} label={espe.nombre} value={espe.nombre} />
          ))}
        </Picker>
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={razas}
          onValueChange={(itemValue) => setRazas(itemValue)}
          style={styles.picker}
        >
          {raza.map((raz: any) => (
            <Picker.Item key={raz.nombre} label={raz.nombre} value={raz.nombre} />
          ))}
        </Picker>
      </View>

      {/* Botón guardar */}
      <BotonGeneral title="Guardar" onPress={() => router.push("./PerfilMascota")} />

      {/* Omitir */}
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



