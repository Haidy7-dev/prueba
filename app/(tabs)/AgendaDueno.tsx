import Encabezado from "@/components/Encabezado";
import MascotaCard from "@/components/MascotaCard";
import MenuDueno from "@/components/MenuDueno";
import { BASE_URL } from "@/config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Cita {
  id: string;
  nombre_mascota: string;
  fecha: string;
  hora_inicio: string;
  hora_finalizacion: string;
  nombre_servicio: string;
  foto?: string;
  id_estado_cita: number;
  calificada?: boolean;
}

export default function AgendaDueno() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"pendientes" | "completadas">("pendientes");

  const router = useRouter();

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

      setCitas(citasData);
    } catch (error) {
      console.error("❌ Error obteniendo citas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCitas();
  }, []);

  const marcarComoCulminada = async (id: string) => {
    try {
      await axios.put(`${BASE_URL}/api/citasDueno/estado/${id}`, { estado: 2 });
      getCitas();
    } catch (error) {
      console.error("❌ Error al actualizar cita:", error);
    }
  };

  const citasPendientes = citas.filter((c) => c.id_estado_cita === 1);
  const citasCompletadas = citas.filter((c) => c.id_estado_cita === 2);
  const citasFiltradas = tab === "pendientes" ? citasPendientes : citasCompletadas;

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

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, tab === "pendientes" && styles.tabActivo]}
          onPress={() => setTab("pendientes")}
        >
          <Text style={[styles.tabTexto, tab === "pendientes" && styles.tabTextoActivo]}>
            Citas pendientes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, tab === "completadas" && styles.tabActivo]}
          onPress={() => setTab("completadas")}
        >
          <Text style={[styles.tabTexto, tab === "completadas" && styles.tabTextoActivo]}>
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
          citasFiltradas.map((item) => {
            const ahora = new Date();
            const horaFin = new Date(`${item.fecha}T${item.hora_finalizacion}`);
            const esPasada = horaFin < ahora;

            return (
              <MascotaCard
                key={item.id}
                nombre={item.nombre_mascota}
                hora={`${item.hora_inicio} - ${item.hora_finalizacion}`}
                fecha={new Date(item.fecha).toLocaleDateString("es-CO")}
                tipo={item.nombre_servicio}
                foto={
                  item.foto
                    ? { uri: item.foto }
                    : require("../../assets/images/navegacion/foto.png")
                }
                botones={
                  tab === "pendientes"
                    ? [
                        {
                          texto: "Culminó",
                          color: esPasada ? "#479454" : "#ccc",
                          onPress: esPasada
                            ? () => marcarComoCulminada(item.id)
                            : undefined,
                        },
                        {
                          texto: "Calificar",
                          color: esPasada ? "#6CBA79" : "#ccc",
                          onPress: esPasada
                            ? () =>
                                router.push({
                                  pathname: "/Calificar",
                                  params: {
                                    id: item.id,
                                  },
                                })
                            : undefined,
                        },
                      ]
                    : []
                }
                onPress={
                  tab === "completadas"
                    ? () =>
                        router.push({
                          pathname: "/DetalleCita",
                          params: { id: item.id },
                        })
                    : undefined
                }
              />
            );
          })
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
    marginTop: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#7BBD92",
  },
  tabActivo: { backgroundColor: "#7BBD92" },
  tabTexto: { fontSize: 16, fontWeight: "600", color: "#000" },
  tabTextoActivo: { color: "#fff" },
});
