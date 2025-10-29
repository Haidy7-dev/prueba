import Encabezado from "@/components/Encabezado";
import MascotaCard from "@/components/MascotaCard";
import MenuVet from "@/components/MenuVet";
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
  nombreMascota: string;
  fecha: string;
  hora_inicio: string;
  hora_finalizacion: string;
  servicio: string;
  foto?: string;
  id_estado_cita: number;
  esPasada?: boolean;
}

export default function AgendaVet() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"pasadas" | "futuras">("pasadas");

  const router = useRouter();

  const getCitas = async () => {
    try {
      const idVet = await AsyncStorage.getItem("userId");
      if (!idVet) {
        console.error("❌ No se encontró el id del veterinario logueado");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${BASE_URL}/api/citasVeterinario/${idVet}`);
      const citasData: Cita[] = response.data;

      const ahora = new Date();

      const citasProcesadas = citasData.map((cita) => {
        const fechaHoraInicio = new Date(`${cita.fecha}T${cita.hora_inicio}`);
        return { ...cita, esPasada: fechaHoraInicio < ahora };
      });

      setCitas(citasProcesadas);
    } catch (error) {
      console.error("❌ Error al obtener citas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCitas();
  }, []);

  const actualizarEstado = async (idCita: string, estado: number) => {
    try {
      await axios.put(`${BASE_URL}/api/citasVeterinario/${idCita}/estado`, {
        estado,
      });
      getCitas();
    } catch (error) {
      console.error("❌ Error al actualizar estado:", error);
    }
  };

  const citasFiltradas = citas.filter((c) =>
    tab === "pasadas" ? c.esPasada : !c.esPasada
  );

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
          style={[styles.tab, tab === "pasadas" && styles.tabActivo]}
          onPress={() => setTab("pasadas")}
        >
          <Text style={[styles.tabTexto, tab === "pasadas" && styles.tabTextoActivo]}>
            Citas pasadas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, tab === "futuras" && styles.tabActivo]}
          onPress={() => setTab("futuras")}
        >
          <Text style={[styles.tabTexto, tab === "futuras" && styles.tabTextoActivo]}>
            Citas futuras
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
              nombre={item.nombreMascota}
              hora={`${item.hora_inicio} - ${item.hora_finalizacion}`}
              fecha={new Date(item.fecha).toLocaleDateString("es-CO")}
              tipo={item.servicio}
              foto={
                item.foto
                  ? { uri: item.foto }
                  : require("../../assets/images/navegacion/foto.png")
              }
              botones={
                tab === "pasadas"
                  ? [
                      {
                        texto: "Culminó",
                        color:
                          item.id_estado_cita === 2 ? "#479454" : "#ccc",
                        onPress: () => actualizarEstado(item.id, 2),
                      },
                      {
                        texto: "No asistió",
                        color:
                          item.id_estado_cita === 3 ? "#C94A4A" : "#ccc",
                        onPress: () => actualizarEstado(item.id, 3),
                      },
                    ]
                  : []
              }
              onPress={
                tab === "futuras"
                  ? () =>
                      router.push({
                        pathname: "/DetalleCita",
                        params: { idCita: item.id },
                      })
                  : undefined
              }
            />
          ))
        )}
      </ScrollView>

      <MenuVet />
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
