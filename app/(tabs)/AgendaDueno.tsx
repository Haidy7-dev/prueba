import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MenuDueno from "../../components/MenuDueno";
import { useRouter } from "expo-router";
import MascotaCard from "@/components/MascotaCard";
import Encabezado from "@/components/Encabezado";

interface Cita {
  id: string;
  nombre_mascota: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  tipo: string;
  foto?: string;
  id_estado_cita?: number | null;
  id_servicio: string;
  id_veterinario_o_zootecnista: string;
  id_usuario: string;
  calificada?: boolean; // viene del backend
  esPendiente?: boolean;
  culminada?: boolean;
}

export default function AgendaDueno() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"pendientes" | "completadas">("pendientes");

  const router = useRouter();
  const BASE_URL = "http://192.168.101.73:3000";

  const getCitas = async () => {
    try {
      const idDueno = await AsyncStorage.getItem("userId");
      if (!idDueno) {
        console.error("❌ No se encontró el id del dueño logueado");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${BASE_URL}/api/citasDueno/${idDueno}`);
      const citasData: Cita[] = response.data;

      const ahora = new Date();

      // Procesar citas
      const procesadas = citasData.map((cita) => {
        const fechaHoraFin = new Date(`${cita.fecha}T${cita.hora_fin}`);
        const esPendiente = fechaHoraFin > ahora && !cita.calificada;
        const culminada = fechaHoraFin < ahora && !cita.calificada;

        return {
          ...cita,
          esPendiente,
          culminada,
        };
      });

      setCitas(procesadas);
    } catch (error) {
      console.error("❌ Error al obtener citas del dueño:", error);
    } finally {
      setLoading(false);
    }
  };

  const marcarComoCulminada = async (idCita: string) => {
    try {
      await axios.put(`${BASE_URL}/api/citasDueno/${idCita}/culmino`);
      getCitas(); // refrescar
    } catch (error) {
      console.error("❌ Error al marcar cita como culminada:", error);
    }
  };

  useEffect(() => {
    getCitas();
  }, []);

  const citasPendientes = citas.filter(
    (c) => c.esPendiente || c.culminada
  );
  const citasCompletadas = citas.filter((c) => c.calificada);

  const citasFiltradas =
    tab === "pendientes" ? citasPendientes : citasCompletadas;

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#479454" />
        <Text style={styles.loaderText}>Cargando citas...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Encabezado />

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, tab === "pendientes" && styles.tabActivo]}
          onPress={() => setTab("pendientes")}
        >
          <Text
            style={[
              styles.tabTexto,
              tab === "pendientes" && styles.tabTextoActivo,
            ]}
          >
            Citas pendientes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, tab === "completadas" && styles.tabActivo]}
          onPress={() => setTab("completadas")}
        >
          <Text
            style={[
              styles.tabTexto,
              tab === "completadas" && styles.tabTextoActivo,
            ]}
          >
            Citas completadas
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {citasFiltradas.length === 0 ? (
          <Text style={styles.noCitas}>No hay citas {tab}.</Text>
        ) : (
          citasFiltradas.map((item) => (
            <MascotaCard
              key={item.id}
              nombre={item.nombre_mascota}
              hora={`${item.hora_inicio} - ${item.hora_fin}`}
              fecha={item.fecha}
              tipo={item.tipo}
              foto={
                item.foto
                  ? { uri: item.foto }
                  : require("../../assets/images/navegacion/foto.png")
              }
              estado={item.id_estado_cita}
              onAccionPrincipal={
                item.culminada && !item.calificada
                  ? () => marcarComoCulminada(item.id)
                  : undefined
              }
              textoAccionPrincipal="Culminó"
              colorAccionPrincipal="#479454"
              onAccionSecundaria={
                item.culminada
                  ? () =>
                      router.push({
                        pathname: "/Calificar",
                        params: {
                          id: item.id,
                          idServicio: item.id_servicio,
                          idVet: item.id_veterinario_o_zootecnista,
                        },
                      })
                  : undefined
              }
              textoAccionSecundaria={
                item.culminada ? "Calificar" : undefined
              }
              colorAccionSecundaria="#6CBA79"
            />
          ))
        )}
      </ScrollView>

      <MenuDueno />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loaderText: { marginTop: 10, color: "#666" },
  scrollContent: { padding: 16, paddingBottom: 100 },
  noCitas: {
    textAlign: "center",
    color: "#555",
    fontSize: 16,
    marginTop: 20,
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#7BBD92",
    marginTop: 10,
    marginHorizontal: 0,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#7BBD92",
    backgroundColor: "#fff",
  },
  tabActivo: {
    backgroundColor: "#7BBD92",
  },
  tabTexto: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  tabTextoActivo: {
    color: "#fff",
  },
});
