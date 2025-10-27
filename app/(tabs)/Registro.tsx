import { Ionicons } from "@expo/vector-icons";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import axios from "axios";
import BotonGeneral from "../../components/BotonGeneral";

export default function RegistroUsuario() {
  const [form, setForm] = useState({
    id: "",
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    correo_electronico: "",
    direccion: "",
    telefono: "",
    n_de_mascotas: "1",
    contrasena: "",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const Incremento = () => {
    const num = parseInt(form.n_de_mascotas) + 1;
    setForm({ ...form, n_de_mascotas: num.toString() });
  };

  const Decremento = () => {
    const num = parseInt(form.n_de_mascotas);
    if (num > 1) setForm({ ...form, n_de_mascotas: (num - 1).toString() });
  };

  const handleRegistro = async () => {
    const { id, primer_nombre, primer_apellido, correo_electronico, contrasena } = form;

    if (!id || !primer_nombre || !primer_apellido || !correo_electronico || !contrasena) {
      Alert.alert("Campos obligatorios", "Por favor completa los campos requeridos.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://192.168.101.73:3000/api/usuario", form);
      console.log("✅ Usuario guardado:", response.data);
      Alert.alert("Éxito", "Usuario registrado correctamente.");
      router.push("/HomeDueno");
    } catch (error: any) {
      console.error("❌ Error al registrar:", error);
      Alert.alert("Error", error.response?.data?.message || "No se pudo registrar el usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        {
          paddingBottom:
            Platform.OS === "android"
              ? (insets.bottom || 10) + 20
              : insets.bottom + 20,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Registro de Usuario</Text>

      <TextInput placeholder="Identificación" style={styles.input} keyboardType="numeric"
        value={form.id} onChangeText={(t) => handleChange("id", t)} />
      <TextInput placeholder="Primer nombre" style={styles.input}
        value={form.primer_nombre} onChangeText={(t) => handleChange("primer_nombre", t)} />
      <TextInput placeholder="Segundo nombre" style={styles.input}
        value={form.segundo_nombre} onChangeText={(t) => handleChange("segundo_nombre", t)} />
      <TextInput placeholder="Primer apellido" style={styles.input}
        value={form.primer_apellido} onChangeText={(t) => handleChange("primer_apellido", t)} />
      <TextInput placeholder="Segundo apellido" style={styles.input}
        value={form.segundo_apellido} onChangeText={(t) => handleChange("segundo_apellido", t)} />
      <TextInput placeholder="Correo electrónico" style={styles.input} keyboardType="email-address"
        value={form.correo_electronico} onChangeText={(t) => handleChange("correo_electronico", t)} />
      <TextInput placeholder="Dirección de residencia" style={styles.input}
        value={form.direccion} onChangeText={(t) => handleChange("direccion", t)} />
      <TextInput placeholder="Teléfono" style={styles.input} keyboardType="phone-pad"
        value={form.telefono} onChangeText={(t) => handleChange("telefono", t)} />

      {/* Stepper */}
      <View style={styles.stepperContainer}>
        <Text style={styles.stepperLabel}>Número de mascotas</Text>
        <View style={styles.stepperControl}>
          <TouchableOpacity onPress={Decremento}>
            <Ionicons name="chevron-down-outline" size={28} color="#4CAF50" />
          </TouchableOpacity>
          <Text style={styles.stepperValue}>{form.n_de_mascotas}</Text>
          <TouchableOpacity onPress={Incremento}>
            <Ionicons name="chevron-up-outline" size={28} color="#4CAF50" />
          </TouchableOpacity>
        </View>
      </View>

      <TextInput placeholder="Contraseña" style={styles.input} secureTextEntry
        value={form.contrasena} onChangeText={(t) => handleChange("contrasena", t)} />

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 20 }} />
      ) : (
        <BotonGeneral title="Guardar" onPress={handleRegistro} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", color: "#000", marginBottom: 20, marginTop: 20 },
  input: { borderWidth: 1, borderColor: "#4CAF50", borderRadius: 8, padding: 12, width: "90%", marginBottom: 12, minHeight: 50 },
  stepperContainer: { borderWidth: 1, borderColor: "#4CAF50", borderRadius: 8, width: "90%", marginBottom: 12, minHeight: 50, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 15 },
  stepperLabel: { fontSize: 16, color: "#555" },
  stepperControl: { flexDirection: "row", alignItems: "center" },
  stepperValue: { fontSize: 18, fontWeight: "bold", color: "#555", marginHorizontal: 10, minWidth: 20, textAlign: "center" },
});


