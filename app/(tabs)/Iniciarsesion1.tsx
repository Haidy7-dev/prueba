import Checkbox from "expo-checkbox";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import axios from "axios";

const { width } = Dimensions.get("window");

const IniciarSesion1: React.FC = () => {
  const router = useRouter();
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Campos incompletos", "Por favor ingresa tu correo y contraseña.");
      return;
    }

    try {
      setCargando(true);

      // 🔹 Primero intenta iniciar sesión como veterinario
      try {
        const vetRes = await axios.post("http://192.168.101.73:3000/api/loginVeterinario", {
          correo_electronico: email,
          contrasena: password,
        });

        if (vetRes.data && vetRes.data.id) {
          Alert.alert("Inicio exitoso", "Bienvenido veterinario y/o zootecnista 🩺");
          router.push("./Iniciovet");
          return;
        }
      } catch (error: any) {
        // Si el error es "Veterinario no encontrado", continúa con el siguiente login
        if (error.response && error.response.data?.message !== "Veterinario no encontrado") {
          console.error("Error en login veterinario:", error.response?.data || error.message);
          Alert.alert("Error", "Ocurrió un problema al verificar el veterinario.");
          return;
        }
      }

      // 🔹 Si no está en veterinarios, intenta como usuario dueño
      try {
        const duenoRes = await axios.post("http://192.168.101.73:3000/api/loginUsuario", {
          correo_electronico: email,
          contrasena: password,
        });

        if (duenoRes.data && duenoRes.data.id) {
          Alert.alert("Inicio exitoso", "Bienvenido dueño 🐾");
          router.push("./HomeDueno");
          return;
        } else {
          Alert.alert("Error", "Correo o contraseña incorrectos.");
        }
      } catch (error: any) {
        console.error("Error en login usuario:", error.response?.data || error.message);
        Alert.alert("Error", "No se pudo conectar al servidor o usuario no encontrado.");
      }

    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require("../../assets/images/navegacion/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Formulario */}
      <View style={styles.form}>
        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          placeholder="ana.gomez@example.com"
          style={styles.input}
          placeholderTextColor="#9e9e9e"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          placeholder="123456"
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#9e9e9e"
          value={password}
          onChangeText={setPassword}
        />

        {/* Recuérdame */}
        <View style={styles.optionsRow}>
          <View style={styles.rememberMe}>
            <Checkbox
              value={rememberMe}
              onValueChange={setRememberMe}
              color={rememberMe ? "#6CBA79" : undefined}
            />
            <Text style={styles.rememberText}>Recuérdame</Text>
          </View>
        </View>

        {/* Botón de inicio */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={cargando}
        >
          <Text style={styles.loginButtonText}>
            {cargando ? "Verificando..." : "Iniciar sesión"}
          </Text>
        </TouchableOpacity>

        {/* Botón de registro */}
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => router.push("./ElegirRol")}
        >
          <Text style={styles.registerButtonText}>Registrarse</Text>
        </TouchableOpacity>
      </View>

      {/* Patitas inferiores */}
      <Image
        source={require("../../assets/images/navegacion/patas_abajo.png")}
        style={styles.paws}
        resizeMode="contain"
      />
    </View>
  );
};

export default IniciarSesion1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    marginTop: 50,
    width: width * 0.6,
    height: 170,
  },
  form: {
    width: "80%",
  },
  label: {
    fontWeight: "bold",
    color: "#333",
    fontSize: 14,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#6CBA79",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 45,
    marginTop: 5,
    fontSize: 14,
    color: "#333",
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },
  rememberMe: {
    flexDirection: "row",
    alignItems: "center",
  },
  rememberText: {
    marginLeft: 6,
    fontSize: 12,
    color: "#333",
  },
  loginButton: {
    marginTop: 35,
    borderWidth: 1,
    borderColor: "#6CBA79",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#479454",
    fontSize: 20,
    fontWeight: "bold",
  },
  registerButton: {
    marginTop: 15,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#479454",
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  paws: {
    width: width,
    height: 80,
    marginBottom: 10,
  },
});



