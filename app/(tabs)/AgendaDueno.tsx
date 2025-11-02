import Encabezado from "@/components/Encabezado";
import MascotaCard from "@/components/MascotaCard";
import MenuDueno from "@/components/MenuDueno";
import { BASE_URL } from "@/config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
  calificada: number; // 1 if rated, 0 if not
  id_veterinario_o_zootecnista: string;
}

export default function AgendaDueno() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"pendientes" | "pasadas">("pendientes");

  const router = useRouter();

  const getCitas = useCallback(async () => {
    setLoading(true);
    try {
      const idDueno = await AsyncStorage.getItem("userId");
      if (!idDueno) {
        console.error("❌ No se encontró el id del dueño logueado");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${BASE_URL}/api/citasDueno/${idDueno}`);
      setCitas(response.data);
    } catch (error) {
      console.error("❌ Error obteniendo citas:", error);
      Alert.alert("Error", "No se pudieron obtener las citas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      getCitas();
    }, [getCitas])
  );

  const marcarComoCulminada = async (id: string) => {
    try {
      await axios.put(`${BASE_URL}/api/citasDueno/estado/${id}`, { estado: 2 });
      getCitas();
    } catch (error) {
      console.error("❌ Error al actualizar cita:", error);
      Alert.alert("Error", "No se pudo actualizar el estado de la cita.");
    }
  };

  const ahora = new Date();
  const citasPendientes = citas.filter((c) => {
    const fechaHoraInicio = new Date(`${c.fecha.split('T')[0]}T${c.hora_inicio}`);
    return fechaHoraInicio > ahora;
  });
  const citasPasadas = citas.filter((c) => {
    const fechaHoraInicio = new Date(`${c.fecha.split('T')[0]}T${c.hora_inicio}`);
    return fechaHoraInicio <= ahora;
  });

  const citasFiltradas = tab === "pendientes" ? citasPendientes : citasPasadas;

  if (loading && citas.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#7BBD92" />
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
          style={[styles.tab, tab === "pasadas" && styles.tabActivo]}
          onPress={() => setTab("pasadas")}
        >
          <Text style={[styles.tabTexto, tab === "pasadas" && styles.tabTextoActivo]}>
            Citas pasadas
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
            const estaCulminada = item.id_estado_cita === 2;

            const ahora = new Date();
            const fechaHoraInicio = new Date(`${item.fecha.split('T')[0]}T${item.hora_inicio}`);
            const esPasada = fechaHoraInicio <= ahora;

            const botones = [];
            if (tab === 'pasadas') {
              if (!estaCulminada) {
                botones.push({
                  texto: "Culminó",
                  onPress: () => marcarComoCulminada(item.id),
                });
              } else if (item.calificada === 0) {
                botones.push({
                  texto: "Calificar",
                  onPress: () => router.push({
                    pathname: "/Calificar",
                    params: {
                      idCita: item.id,
                      idVeterinario: item.id_veterinario_o_zootecnista,
                      idServicio: item.id_servicio,
                    },
                  }),
                });
              }
            }

            return (
              <MascotaCard
                key={item.id}
                nombre={item.nombre_mascota}
                hora={`${item.hora_inicio} - ${item.hora_finalizacion}`}
                fecha={new Date(item.fecha).toLocaleDateString("es-CO", { timeZone: 'America/Bogota' })}
                tipo={item.nombre_servicio}
                foto={
                  item.foto
                    ? { uri: item.foto }
                    : require("../../assets/images/navegacion/foto.png")
                }
                botones={botones}
                isCompleted={estaCulminada}
                appointmentId={item.id}
                estado={item.id_estado_cita}
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
    color: "#7BBD92",
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