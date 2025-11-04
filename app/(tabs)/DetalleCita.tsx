import Encabezado from "@/components/Encabezado";
import MenuDueno from "@/components/MenuDueno";
import MenuVet from "@/components/MenuVet";
import ResumenCitaCard from "@/components/ResumenCitaCard";
import { BASE_URL } from "@/config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, SafeAreaView } from "react-native";
import EstrellaCalificacion from "@/components/EstrellaCalificacion";

interface ResumenCita {
  id: number;
  modalidad: string;
  hora_inicio: string;
  hora_finalizacion: string;
  iva: number;
  total: number;
  id_cita: number;

  // Relaciones
  nombre_mascota: string;
  sexo_mascota: string;
  nombre_usuario: string;
  correo_usuario: string;
  nombre_veterinario: string;
  correo_veterinario: string;
  nombre_servicio: string;
  precio_servicio: number;
  fotoMascota?: string;
  lugar?: string;
  calificada?: number; // 1 if rated, 0 if not
}

export default function DetalleCita() {
  const params = useLocalSearchParams();
  const idCita = Array.isArray(params.idCita) ? params.idCita[0] : params.idCita;

  const [resumen, setResumen] = useState<ResumenCita | null>(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<string | null>(null);
  const [rating, setRating] = useState(0);


  // 🧩 Obtener tipo de usuario
  useEffect(() => {
    const obtenerTipoUsuario = async () => {
      try {
        const tipo = await AsyncStorage.getItem("userType");
        setUserType(tipo);
      } catch (error) {
        console.error("❌ Error al obtener tipo de usuario:", error);
      }
    };
    obtenerTipoUsuario();
  }, []);

  // 🧩 Cargar resumen de cita
  useEffect(() => {
    if (!idCita) return;

    const fetchResumen = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/resumencitas/${idCita}`);
        setResumen(response.data);
      } catch (error) {
        console.error("❌ Error al cargar resumen de cita:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResumen();
  }, [idCita]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#008000" />
        <Text style={styles.loaderText}>Cargando detalle de la cita...</Text>
      </View>
    );
  }

  if (!resumen) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se encontró el resumen de la cita.</Text>
      </View>
    );
  }

  const handleCalificar = async () => {
    try {
      const id_usuario = await AsyncStorage.getItem("userId");
      if (!id_usuario) {
        Alert.alert("Error", "No se encontró el usuario logueado");
        return;
      }

      await axios.post(`${BASE_URL}/api/calificaciones`, {
        puntaje: rating,
        id_cita: idCita,
        id_usuario: id_usuario,
      });

      Alert.alert("✅", "¡Gracias por calificar!");
      // Refresh the resumen to update calificada status
      const response = await axios.get(`${BASE_URL}/api/resumencitas/${idCita}`);
      setResumen(response.data);
    } catch (error) {
      console.error("❌ Error al guardar calificación:", error);
      Alert.alert("Error", "No se pudo guardar la calificación");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Encabezado />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ResumenCitaCard
          nombre_mascota={resumen.nombre_mascota}
          sexo_mascota={resumen.sexo_mascota}
          nombre_servicio={resumen.nombre_servicio}
          precio_servicio={resumen.precio_servicio}
          modalidad={resumen.modalidad}
          hora_inicio={resumen.hora_inicio}
          hora_finalizacion={resumen.hora_finalizacion}
          iva={resumen.iva}
          total={resumen.total}
          nombre_usuario={resumen.nombre_usuario}
          correo_usuario={resumen.correo_usuario}
          nombre_veterinario={resumen.nombre_veterinario}
          correo_veterinario={resumen.correo_veterinario}
          lugar={resumen.lugar ?? "No especificado"}
          fotoMascota={resumen.fotoMascota}
        />


      </ScrollView>

      {userType === "veterinario" ? <MenuVet /> : null}
      {userType === "usuario" ? <MenuDueno /> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100, // Space for menu
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderText: {
    marginTop: 10,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
  calificacionContainer: {
    alignItems: "center",
    marginTop: 20,
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    marginBottom: 20,
  },
  calificacionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  botonCalificar: {
    backgroundColor: "#479454",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 15,
  },
  textoBotonCalificar: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
