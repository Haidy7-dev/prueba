import Encabezado from "@/components/Encabezado";
import MenuDueno from "@/components/MenuDueno";
import MenuVet from "@/components/MenuVet";
import ResumenCitaCard from "@/components/ResumenCitaCard";
import { BASE_URL } from "@/config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View, } from "react-native";

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
}

export default function DetalleCita() {
  const params = useLocalSearchParams();
  const idCita = Array.isArray(params.idCita) ? params.idCita[0] : params.idCita;

  const [resumen, setResumen] = useState<ResumenCita | null>(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<string | null>(null);

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
        const response = await axios.get(`${BASE_URL}/api/ResumenCitas/${idCita}`);
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

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Encabezado />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      

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

      {/* 🧩 Mostrar menú según el tipo de usuario */}
      {userType === "veterinario" ? <MenuVet /> : null}
      {userType === "usuario" ? <MenuDueno /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  
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
});
