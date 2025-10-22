import MenuVet from "@/components/MenuVet";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Agenda() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<"pasadas" | "futuras">("futuras");

  // Datos de ejemplo
  const citasPasadas = [
    {
      id: "1",
      nombre: "Lucca",
      fecha: "01/09/2025",
      hora: "8:00 AM - 9:00 AM",
      estado: "Culminado",
    },
    {
      id: "2",
      nombre: "Lucca",
      fecha: "05/09/2025",
      hora: "9:00 AM - 10:00 AM",
      estado: "No asistió",
    },
  ];

  const citasFuturas = [
    {
      id: "3",
      nombre: "Lucca",
      fecha: "10/09/2025",
      hora: "10:00 AM - 11:00 AM",
      estado: "Corte general",
    },
    {
      id: "4",
      nombre: "Lucca",
      fecha: "15/09/2025",
      hora: "11:00 AM - 12:00 PM",
      estado: "Vacunación",
    },
  ];

  const renderCita = ({ item }: any) => (
    <View style={styles.card}>
      {/* Icono de mascota en lugar de imagen */}
      <Ionicons name="paw-outline" size={40} color="#4CAF50" style={{ marginRight: 12 }} />

      {/* Información de la cita */}
      <View style={{ flex: 1 }}>
        <Text style={styles.nombre}>{item.nombre}</Text>

        <View style={styles.row}>
          <Ionicons name="time-outline" size={16} color="gray" />
          <Text style={styles.texto}>{item.hora}</Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="calendar-outline" size={16} color="gray" />
          <Text style={styles.texto}>{item.fecha}</Text>
        </View>

        {/* Estado de la cita */}
        <View style={styles.estadoContainer}>
          <Text
            style={[
              styles.estado,
              item.estado === "Culminado"
                ? styles.culminado
                : item.estado === "No asistió"
                ? styles.noAsistio
                : styles.futuro,
            ]}
          >
            {item.estado}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "pasadas" && styles.tabActive]}
          onPress={() => setSelectedTab("pasadas")}
        >
          <Text
            style={[styles.tabText, selectedTab === "pasadas" && styles.tabTextActive]}
          >
            Citas pasadas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === "futuras" && styles.tabActive]}
          onPress={() => setSelectedTab("futuras")}
        >
          <Text
            style={[styles.tabText, selectedTab === "futuras" && styles.tabTextActive]}
          >
            Citas futuras
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lista de citas */}
      <FlatList
        data={selectedTab === "pasadas" ? citasPasadas : citasFuturas}
        keyExtractor={(item) => item.id}
        renderItem={renderCita}
      />
      <MenuVet />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },

  // Tabs
  tabs: { flexDirection: "row", marginBottom: 10 },
  tab: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#ccc",
  },
  tabActive: { borderBottomColor: "#4CAF50" },
  tabText: { fontWeight: "bold", color: "gray" },
  tabTextActive: { color: "#4CAF50" },

  // Card
  card: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    padding: 12,
    marginBottom: 10,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  nombre: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 2 },
  texto: { marginLeft: 4, color: "gray", fontSize: 13 },

  // Estado (chip)
  estadoContainer: { marginTop: 6 },
  estado: {
    fontSize: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    overflow: "hidden",
    alignSelf: "flex-start",
    color: "#fff",
  },
  culminado: { backgroundColor: "green" },
  noAsistio: { backgroundColor: "red" },
  futuro: { backgroundColor: "#1E88E5" },
});
