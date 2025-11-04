import Encabezado from "@/components/Encabezado";
import MascotaCard from "@/components/MascotaCard";
import MenuVet from "@/components/MenuVet";
import { BASE_URL } from "@/config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, View, } from "react-native";

interface Cita {
  id: string;
  nombreMascota: string;
  fecha: string;
  hora_inicio: string;
  hora_finalizacion: string;
  servicio: string;
  modalidad: string;
  iva: number;
  total: number;
  id_estado_cita: number | null;
  foto?: string;
}

export default function InicioVet() {
  const router = useRouter();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Obtener citas del veterinario logueado
  const getCitas = async () => {
    try {
      const idVet = await AsyncStorage.getItem("userId");
      if (!idVet) {
        console.error("❌ No se encontró el id del veterinario logueado");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${BASE_URL}/api/citasVeterinario/${idVet}`);
      const today = new Date();
      const todayString = today.toISOString().split('T')[0];
      const citasHoy = response.data.filter((cita: Cita) => cita.fecha.split('T')[0] === todayString);
      setCitas(citasHoy);
    } catch (error) {
      console.error("❌ Error al obtener las citas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCitas();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#008000" />
        <Text style={styles.loaderText}>Cargando citas...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Encabezado />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.titulo}>Mis citas para hoy</Text>

        {citas.length === 0 ? (
          <Text style={styles.noCitas}>No hay citas registradas.</Text>
        ) : (
          <View>
            {citas.map((item) => (
              <MascotaCard
                key={item.id}
                nombre={item.nombreMascota}
                hora={`${item.hora_inicio} - ${item.hora_finalizacion}`}
                fecha={new Date(item.fecha).toLocaleDateString("es-CO")}
                tipo={item.servicio}
                foto={
                  item.foto
                    ? { uri: item.foto }
                    : { uri: `${BASE_URL}/pethub/foto.png` }
                }
                estado={item.id_estado_cita}
                onPress={() =>
                  router.push({
                    pathname: "/DetalleCita",
                    params: { idCita: item.id },
                  })
                }
              />
            ))}
          </View>
        )}
      </ScrollView>

      <MenuVet />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 100, // 👈 espacio suficiente para que no tape el menú
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 16,
    textAlign: "center",
    color: "#000",
  },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loaderText: { marginTop: 10, color: "#666" },
  noCitas: { textAlign: "center", color: "#555", fontSize: 16, marginTop: 20 },
});
