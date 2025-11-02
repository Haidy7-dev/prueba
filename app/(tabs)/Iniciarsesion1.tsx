import { BASE_URL } from "@/config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Checkbox from "expo-checkbox";
import { useRouter } from "expo-router";
import React, { useRef, useState, useEffect } from "react";
import {ActivityIndicator,Alert,Dimensions,Image,StyleSheet,Text,TextInput,TouchableOpacity,View,Animated,} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Video, ResizeMode } from "expo-av";

const { width } = Dimensions.get("window");

const IniciarSesion1: React.FC = () => {
  const router = useRouter();
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 🔹 Animación para mostrar/ocultar video del pajarito
  const [showVideo, setShowVideo] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const videoRef = useRef<Video>(null);

  // 🔹 Cargar credenciales guardadas al montar el componente
  useEffect(() => {
    const loadSavedCredentials = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem("savedEmail");
        const savedPassword = await AsyncStorage.getItem("savedPassword");
        const savedRememberMe = await AsyncStorage.getItem("rememberMe");

        if (savedEmail) setEmail(savedEmail);
        if (savedPassword) setPassword(savedPassword);
        if (savedRememberMe === "true") setRememberMe(true);
      } catch (error) {
        console.error("Error cargando credenciales guardadas:", error);
      }
    };

    loadSavedCredentials();
  }, []);

  const toggleEye = () => {
    if (showVideo) {
      // Ocultar video y volver al ojo
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowVideo(false));
    } else {
      // Mostrar video y ocultar ojo
      setShowVideo(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }

    // Cambiar visibilidad de la contraseña también
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Campos incompletos", "Por favor ingresa tu correo y contraseña.");
      return;
    }

    setCargando(true);

    try {
      let encontrado = false;

      // 🔹 1️⃣ Buscar en veterinario_o_zootecnista
      try {
        const vetRes = await axios.post(`${BASE_URL}/api/loginVeterinario`, {
          correo_electronico: email,
          contrasena: password,
        });

        if (vetRes.data && vetRes.data.id) {
          await AsyncStorage.setItem("userId", vetRes.data.id.toString());
          await AsyncStorage.setItem("userType", "veterinario");

          // 🔹 Guardar credenciales si rememberMe está activado
          if (rememberMe) {
            await AsyncStorage.setItem("savedEmail", email);
            await AsyncStorage.setItem("savedPassword", password);
            await AsyncStorage.setItem("rememberMe", "true");
          } else {
            await AsyncStorage.removeItem("savedEmail");
            await AsyncStorage.removeItem("savedPassword");
            await AsyncStorage.removeItem("rememberMe");
          }

          Alert.alert("Inicio exitoso", "Bienvenido veterinario 🩺");
          router.replace("./Iniciovet");
          encontrado = true;
        }
      } catch (error: any) {
        // Si no es veterinario, seguimos con usuario
      }

      // 🔹 2️⃣ Si no fue veterinario, buscar en usuario
      if (!encontrado) {
        try {
          const userRes = await axios.post(`${BASE_URL}/api/loginUsuario`, {
            correo_electronico: email,
            contrasena: password,
          });

          if (userRes.data && userRes.data.id) {
            await AsyncStorage.setItem("userId", userRes.data.id.toString());
            await AsyncStorage.setItem("userType", "usuario");

            // 🔹 Guardar credenciales si rememberMe está activado
            if (rememberMe) {
              await AsyncStorage.setItem("savedEmail", email);
              await AsyncStorage.setItem("savedPassword", password);
              await AsyncStorage.setItem("rememberMe", "true");
            } else {
              await AsyncStorage.removeItem("savedEmail");
              await AsyncStorage.removeItem("savedPassword");
              await AsyncStorage.removeItem("rememberMe");
            }

            Alert.alert("Inicio exitoso", "Bienvenido dueño 🐾");
            router.replace("./HomeDueno");
            encontrado = true;
          }
        } catch (error: any) {
          // tampoco mostramos alerta aquí, esperamos hasta el final
        }
      }

      // 🔹 3️⃣ Si no se encontró en ninguna tabla
      if (!encontrado) {
        Alert.alert("Error", "Correo o contraseña incorrectos.");
      }

    } catch (error) {
      console.error("❌ Error general en login:", error);
      Alert.alert("Error", "No se pudo conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/navegacion/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

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
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="123456"
            secureTextEntry={!showPassword}
            style={[styles.input, { borderWidth: 0, flex: 1 }]}
            placeholderTextColor="#9e9e9e"
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.eyeButton} onPress={toggleEye}>
            {showVideo ? (
              <Animated.View style={{ opacity: fadeAnim }}>
                <Video
                  ref={videoRef}
                  source={require("../../assets/images/navegacion/pajaro.mp4")}
                  style={styles.video}
                  resizeMode={ResizeMode.CONTAIN}
                  shouldPlay
                  isLooping
                />
              </Animated.View>
            ) : (
              <Animated.View
                style={{
                  opacity: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0],
                  }),
                }}
              >
                <FontAwesome5 name="eye" size={22} color="#479454" />
              </Animated.View>
            )}
          </TouchableOpacity>
        </View>

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

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={cargando}>
          {cargando ? (
            <ActivityIndicator color="#479454" />
          ) : (
            <Text style={styles.loginButtonText}>Iniciar sesión</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.registerButton} onPress={() => router.push("./ElegirRol")}>
          <Text style={styles.registerButtonText}>Registrarse</Text>
        </TouchableOpacity>
      </View>

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
  container: { flex: 1, backgroundColor: "#fff", alignItems: "center", justifyContent: "space-between" },
  logo: { marginTop: 50, width: width * 0.6, height: 170 },
  form: { width: "80%" },
  label: { fontWeight: "bold", color: "#333", fontSize: 14, marginTop: 15 },
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#6CBA79",
    borderRadius: 10,
    marginTop: 5,
  },
  eyeButton: {
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  video: {
    width: 40,
    height: 40,
  },
  optionsRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 15 },
  rememberMe: { flexDirection: "row", alignItems: "center" },
  rememberText: { marginLeft: 6, fontSize: 12, color: "#333" },
  loginButton: {
    marginTop: 35,
    borderWidth: 1,
    borderColor: "#6CBA79",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  loginButtonText: { color: "#479454", fontSize: 20, fontWeight: "bold" },
  registerButton: {
    marginTop: 15,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#479454",
  },
  registerButtonText: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  paws: { width: width, height: 80, marginBottom: 10 },
});
