import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import BotonGeneral from "../../components/BotonGeneral"; // 👈 importa tu botón

export default function RegistroVeteri() {
  const router = useRouter();
  const [Especializaciones, setEspecializaciones] = useState([]);

  const getEspecializaciones = async () => {
    try {
      const response = await axios.get(
        "http://10.121.63.130:3000/api/especializaciones"
      );
        setEspecializaciones(response.data);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getEspecializaciones();
  }, []);
  // Estados para pickers
  const [especializacion, setEspecializacion] = useState("");
  const [servicio, setServicio] = useState("");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registro</Text>

      <TextInput placeholder="Identificación" style={styles.input} />
      <TextInput placeholder="Primer nombre" style={styles.input} />
      <TextInput placeholder="Segundo nombre" style={styles.input} />
      <TextInput placeholder="Primer apellido" style={styles.input} />
      <TextInput placeholder="Segundo apellido" style={styles.input} />
      <TextInput
        placeholder="Correo electrónico"
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Teléfono"
        style={styles.input}
        keyboardType="phone-pad"
      />
      <TextInput placeholder="Dirección de la clínica" style={styles.input} />

      {/* Picker de Especialización */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={especializacion}
          onValueChange={(itemValue) => setEspecializacion(itemValue)}
          style={styles.picker}
        >
          {Especializaciones.map((esp: any) => (
            <Picker.Item
              key={esp.nombre}
              label={esp.nombre}
              value={esp.nombre}
            />
          ))}
        </Picker>
      </View>

      {/* Picker de Servicios */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={servicio}
          onValueChange={(itemValue) => setServicio(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Servicios" value="" enabled={false} />
          <Picker.Item label="Consulta general" value="consulta" />
          <Picker.Item label="Vacunación" value="vacunacion" />
          <Picker.Item label="Desparasitación" value="desparasitacion" />
          <Picker.Item label="Radiología" value="radiologia" />
        </Picker>
      </View>

      <TextInput
        placeholder="Contraseña"
        style={styles.input}
        secureTextEntry
      />

      {/* Botón Guardar */}
      <BotonGeneral
        title="Guardar"
        onPress={() => router.push("./Iniciarsesion1")}
      />
    </ScrollView>
  );
}

// Estilos
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
    color: "#0000",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderRadius: 8,
    padding: 12,
    width: "100%",
    marginBottom: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderRadius: 8,
    width: "100%",
    marginBottom: 12,
  },
  picker: {
    height: 50,
    width: "100%",
  },
});
