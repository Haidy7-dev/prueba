import Checkbox from "expo-checkbox";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const IniciarSesion1: React.FC = () => {
  const router = useRouter();
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require("@/assets/images/navegacion/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Título del formulario */}
      <View style={styles.form}>
        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          placeholder="email@gmail.com"
          style={styles.input}
          placeholderTextColor="#9e9e9e"
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          placeholder="********"
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#9e9e9e"
        />

        {/* Recuérdame y Olvidaste contraseña */}
        <View style={styles.optionsRow}>
          <View style={styles.rememberMe}>
            <Checkbox
              value={rememberMe}
              onValueChange={setRememberMe}
              color={rememberMe ? "#6CBA79" : undefined}
            />
            <Text style={styles.rememberText}>Recuérdame</Text>
          </View>
          <TouchableOpacity>
            <Text
              onPress={() => router.push("./RecuperarContrasena")}
              style={styles.forgotPassword}
            >
              ¿Olvidaste tu contraseña?
            </Text>
          </TouchableOpacity>
        </View>

        {/* Botones */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push("./index")}
        >
          <Text style={styles.loginButtonText}>Iniciar sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => router.push("./ElegirRol")}
        >
          <Text style={styles.registerButtonText}>Registrarse</Text>
        </TouchableOpacity>
      </View>

      {/* Patitas inferiores */}
      <Image
        source={require("@/assets/images/navegacion/patas_abajo.png")}
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
    marginTop: 40,
    width: width * 0.6,
    height: 120,
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
    marginTop: 10,
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
  forgotPassword: {
    fontSize: 12,
    color: "#6CBA79",
    fontWeight: "600",
  },
  loginButton: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#6CBA79",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#6CBA79",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerButton: {
    marginTop: 10,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#6CBA79",
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  paws: {
    width: width,
    height: 80,
    marginBottom: 10,
  },
});
