import Encabezado from "@/components/Encabezado";
import MascotaCard from "@/components/MascotaCard";
import MenuVet from "@/components/MenuVet";
import { BASE_URL } from "@/config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {ActivityIndicator,SafeAreaView,ScrollView,StyleSheet,Text,TouchableOpacity,View,} from "react-native";

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
  console.log("AgendaVet component rendered");
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

      const citasProcesadas = citasData.map((cita) => {
        const ahora = new Date();
        const citaFechaHora = new Date(`${cita.fecha.split('T')[0]}T${cita.hora_inicio}`);

        return { ...cita, esPasada: citaFechaHora < ahora };
      });

      setCitas(citasProcesadas);
      console.log("Citas fetched and set:", citasProcesadas);
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
    const originalCitas = [...citas];
    const newCitas = citas.map((cita) => {
      if (cita.id === idCita) {
        return { ...cita, id_estado_cita: estado };
      }
      return cita;
    });
    setCitas(newCitas);

    try {
      await axios.put(`${BASE_URL}/api/citasVeterinario/${idCita}/estado`, {
        estado,
      });
    } catch (error) {
      setCitas(originalCitas);
      console.error("❌ Error al actualizar estado:", error);
    }
  };

  const citasFiltradas = citas.filter((c) => {
    if (tab === "pasadas") {
      return c.esPasada;
    } else { // tab === "futuras"
      return !c.esPasada;
    }
  });

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
            Citas Futuras
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {citasFiltradas.length === 0 ? (
          <Text style={styles.noCitas}>No hay citas {tab === "pasadas" ? "pasadas" : "futuras"}.</Text>
        ) : (
          citasFiltradas.map((item) => (
            <TouchableOpacity key={item.id} onPress={() => router.push(`/(tabs)/DetalleCita?idCita=${item.id}`)}>
              <MascotaCard
                nombre={item.nombreMascota}
                hora={`${item.hora_inicio} - ${item.hora_finalizacion}`}
                fecha={new Date(item.fecha).toLocaleDateString("es-CO")}
                tipo={item.servicio}
                foto={
                  item.foto
                    ? { uri: `${BASE_URL}/pethub/${item.foto}` }
                    : { uri: `${BASE_URL}/pethub/foto.png` }
                }
                botones={
                  tab === "pasadas"
                    ? [
                        {
                          texto: "Culminó",
                          onPress: () => {
                            actualizarEstado(item.id, 2);
                          },
                          disabled: item.id_estado_cita === 2,
                        },
                        {
                          texto: "No asistió",
                          onPress: () => {
                            actualizarEstado(item.id, 3);
                          },
                          disabled: item.id_estado_cita === 3,
                        },
                      ]
                    : []
                }
                isCompleted={tab === "futuras"}
                appointmentId={item.id}
                estado={item.id_estado_cita}
              />
            </TouchableOpacity>
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
