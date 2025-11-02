import BotonGeneral from "@/components/BotonGeneral";
import { BASE_URL } from "@/config/api";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Platform, ScrollView, StyleSheet, Text, TextInput, View, } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Especializacion {
  id: number;
  nombre: string;
}

interface Servicio {
  id: number;
  nombre: string;
}

export default function RegistroVeteri() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  //  Estados para campos del formulario
  const [id, setId] = useState("");
  const [primerNombre, setPrimerNombre] = useState("");
  const [segundoNombre, setSegundoNombre] = useState("");
  const [primerApellido, setPrimerApellido] = useState("");
  const [segundoApellido, setSegundoApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccionClinica, setDireccionClinica] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [especializacion, setEspecializacion] = useState<string | null>(null);
  const [servicio, setServicio] = useState<number | null>(null);

  // Listas de opciones
  const [especializacionesList, setEspecializacionesList] = useState<Especializacion[]>([]);
  const [serviciosList, setServiciosList] = useState<Servicio[]>([]);

  // --- Obtener especializaciones ---
  useEffect(() => {
    const getEspecializaciones = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/especializaciones`);
        setEspecializacionesList(response.data);
      } catch (error) {
        console.log("❌ Error al obtener las especializaciones:", error);
      }
    };
    getEspecializaciones();
  }, []);

  // --- Obtener servicios ---
  useEffect(() => {
    const getServicios = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/servicio`);
        setServiciosList(response.data);
      } catch (error) {
        console.log("❌ Error al obtener los servicios:", error);
      }
    };
    getServicios();
  }, []);

  //  Enviar datos al backend
  const handleRegistro = async () => {
    if (!id || !primerNombre || !primerApellido || !correo || !contrasena) {
      Alert.alert("Campos incompletos", "Por favor llena todos los campos obligatorios.");
      return;
    }

    if (telefono && telefono.length > 15) {
      Alert.alert("Error", "El número de teléfono no puede tener más de 15 dígitos.");
      return;
    }

    try {
      const requestBody: any = {
        id: parseInt(id),
        primer_nombre: primerNombre,
        segundo_nombre: segundoNombre,
        primer_apellido: primerApellido,
        segundo_apellido: segundoApellido,
        correo_electronico: correo,
        telefono,
        direccion_clinica: direccionClinica,
        contrasena,
      };

      if (especializacion !== null) {
        requestBody.especializacion = especializacion;
      }
      if (servicio !== null) {
        requestBody.servicio = servicio;
      }

      const response = await axios.post(`${BASE_URL}/api/registroVeterina`, requestBody);

      if (response.status === 201) {
        Alert.alert("✅ Registro exitoso", "Veterinario registrado correctamente.");
        router.push("./Perfilvet");
      }
    } catch (error: any) {
      console.error("❌ Error al registrar veterinario:", error);
      if (error.response) {
        console.error("Respuesta de error del servidor:", error.response.data);
        Alert.alert("Error", `No se pudo registrar el veterinario: ${error.response.data.message || 'Error desconocido'}`);
      } else if (error.request) {
        console.error("No se recibió respuesta del servidor:", error.request);
        Alert.alert("Error", "No se pudo conectar al servidor. Verifique su conexión a internet.");
      } else {
        Alert.alert("Error", "Ocurrió un error inesperado al registrar el veterinario");
      }
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        {
          paddingBottom:
            Platform.OS === "android"
              ? (insets.bottom || 10) + 30
              : insets.bottom + 30,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Registro</Text>

      <TextInput placeholder="Identificación" style={styles.input} keyboardType="numeric" value={id} onChangeText={setId} />
      <TextInput placeholder="Primer nombre" style={styles.input} value={primerNombre} onChangeText={setPrimerNombre} />
      <TextInput placeholder="Segundo nombre" style={styles.input} value={segundoNombre} onChangeText={setSegundoNombre} />
      <TextInput placeholder="Primer apellido" style={styles.input} value={primerApellido} onChangeText={setPrimerApellido} />
      <TextInput placeholder="Segundo apellido" style={styles.input} value={segundoApellido} onChangeText={setSegundoApellido} />
      <TextInput placeholder="Correo electrónico" style={styles.input} keyboardType="email-address" value={correo} onChangeText={setCorreo} />
      <TextInput placeholder="Teléfono" style={styles.input} keyboardType="phone-pad" value={telefono} onChangeText={setTelefono} />
      <TextInput placeholder="Dirección de la clínica" style={styles.input} value={direccionClinica} onChangeText={setDireccionClinica} />

      {/* Picker de Especialización */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={especializacion}
          onValueChange={(itemValue) => setEspecializacion(itemValue === "" ? null : itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Selecciona una especialización" value="" />
          {especializacionesList.map((esp) => (
            <Picker.Item key={esp.id} label={esp.nombre} value={esp.nombre} />
          ))}
        </Picker>
      </View>

      {/* Picker de Servicio */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={servicio}
          onValueChange={(itemValue) => setServicio(itemValue === "" ? null : Number(itemValue))}
          style={styles.picker}
        >
          <Picker.Item label="Selecciona un servicio" value="" />
          {serviciosList.map((serv) => (
            <Picker.Item key={serv.id} label={serv.nombre} value={serv.id} />
          ))}
        </Picker>
      </View>

      <TextInput
        placeholder="Contraseña"
        style={styles.input}
        secureTextEntry
        value={contrasena}
        onChangeText={setContrasena}
      />

      <BotonGeneral title="Guardar" onPress={handleRegistro} />
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
});
