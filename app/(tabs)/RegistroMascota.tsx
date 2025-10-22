import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import BotonGeneral from "../../components/BotonGeneral";

export default function RegistroMascota() {
  const router = useRouter();
  const [sexo, setSexo] = useState([]);
  const [especie, setEspecie] = useState([]);
  const [raza, setRaza] = useState([]);

  const getEspecie = async () => {
    try {
      const response = await axios.get(
        //IP Salomé casa
        // "http://--------:3000/api/especie"
        //IP Salomé datos
        // "http://10.121.63.130:3000/api/especie"

        //IP Haidy casa
        //"http://192.168.1.16:3000/api/especie"
        //IP Haidy datos
        "http://10.164.93.119:3000/api/especie"
      );
      setEspecie(response.data);
    } catch (error) {
      console.error("Error al obtener los datos de la especie", error);
    }
  };

    useEffect(() => {
        getEspecie();
      }, []);


    const getRaza = async () => {
    try {
      const response = await axios.get(
        //IP Salomé casa
        // "http://--------:3000/api/raza"
        //IP Salomé datos
        // "http://10.121.63.130:3000/api/raza"

        //IP Haidy casa
        //"http://192.168.1.16:3000/api/raza"
        //IP Haidy datos
        "http://10.164.93.119:3000/api/raza"
      );
      setRaza(response.data);
    } catch (error) {
      console.error("Error al obtener los datos de la raza", error);
    }
  };

    useEffect(() => {
        getRaza();
      }, []);
 
  // Estados para pickers
    const [especies, setEspecies] = useState("");
    const [razas, setRazas] = useState("");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Huellita arriba izquierda */}
      <Image source={require("../../assets/images/navegacion/patas_superior.png")} style={styles.ImagenSuperior} />

      <Text style={styles.title}>Registro</Text>

      {/* Icono central */}
      <Image source={require("../../assets/images/navegacion/iconomasco1.png")} style={styles.icono} />

      {/* Campo: Nombre */}
      <TextInput placeholder="Nombre" style={styles.input} />

      {/* Picker de Sexo */}
      <View style={styles.pickerContainer}>
        <Picker selectedValue={sexo} onValueChange={(value) => setSexo(value)} style={styles.picker}>
          <Picker.Item label="Macho" value="Macho" />
          <Picker.Item label="Hembra" value="Hembra" />
        </Picker>
      </View>

      {/* Campo: Peso y Edad*/}
      <TextInput placeholder="Peso" style={styles.input} keyboardType="numeric" />
      <TextInput placeholder="Edad" style={styles.input} keyboardType="numeric" />

      {/* Picker de Especie */}
      <View style={styles.pickerContainer}>
              <Picker
                selectedValue={especies}
                onValueChange={(itemValue) => setEspecies(itemValue)}
                style={styles.picker}
              >
                {especie.map((espe: any) => (
                  <Picker.Item
                    key={espe.nombre}
                    label={espe.nombre}
                    value={espe.nombre}
                  />
                ))}
              </Picker>
            </View>

      {/* Picker de Raza */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={razas}
          onValueChange={(itemValue) => setRazas(itemValue)}
          style={styles.picker}
        >
          {raza.map((raz: any) => (
            <Picker.Item
              key={raz.nombre}
              label={raz.nombre}
              value={raz.nombre}
            />
          ))}
        </Picker>
      </View>

      {/* Botón guardar */}
      <BotonGeneral
              title="Guardar"
              onPress={() => router.push("./Perfilvet")}
            />

      {/* Huellita abajo derecha */}
      <Image source={require("../../assets/images/navegacion/patas_inferior.png")} style={styles.ImagenInferior} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // Asegura que el ScrollView ocupe todo el espacio disponible
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0000",
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
    resizeMode: "contain"
  },
});


