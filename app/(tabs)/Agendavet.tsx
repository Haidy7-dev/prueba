import MenuVet from "@/components/MenuVet";
import Encabezado from "@/components/Encabezado"; 
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {FlatList,Image,StyleSheet,Text,TouchableOpacity,View,} from "react-native";

export default function Agenda() {
  const [selectedTab, setSelectedTab] = useState<"pasadas" | "futuras">("futuras");
  const [estadoCitas, setEstadoCitas] = useState<{ [key: string]: "culmino" | "noAsistio" | null }>({});

  const handleEstado = (id: string, estado: "culmino" | "noAsistio") => {
    setEstadoCitas((prev) => ({
      ...prev,
      [id]: prev[id] === estado ? null : estado,
    }));
  };

  const citasPasadas = [
    { id: "1", nombre: "Lucca", fecha: "10/07/2025", hora: "8:00 am - 9:00 am" },
    { id: "2", nombre: "Lucca", fecha: "09/07/2025", hora: "8:00 am - 9:00 am" },
  ];

  const citasFuturas = [
    { id: "3", nombre: "Lucca", fecha: "10/10/2025", hora: "8:00 am - 9:00 am" },
    { id: "4", nombre: "Lucca", fecha: "12/10/2025", hora: "8:00 am - 9:00 am" },
    { id: "5", nombre: "Lucca", fecha: "14/10/2025", hora: "8:00 am - 9:00 am" },
  ];

  const renderCita = ({ item }: any) => {
    const estado = estadoCitas[item.id];

    return (
      <View style={styles.card}>
        <Image
          source={require("../../assets/images/navegacion/foto.png")}
          style={styles.avatar}
        />

        <View style={styles.cardInfo}>
          <Text style={styles.nombre}>{item.nombre}</Text>

          <View style={styles.row}>
            <Ionicons name="time-outline" size={14} color="gray" />
            <Text style={styles.texto}>{item.hora}</Text>
          </View>

          <View style={styles.row}>
            <Ionicons name="calendar-outline" size={14} color="gray" />
            <Text style={styles.texto}>{item.fecha}</Text>
          </View>

          <View style={styles.botonesRow}>
            <TouchableOpacity
              style={[
                styles.boton,
                estado === "culmino" ? styles.culminoActivo : styles.culmino,
              ]}
              onPress={() => handleEstado(item.id, "culmino")}
            >
              <Text style={styles.botonTexto}>Culminó</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.boton,
                estado === "noAsistio" ? styles.noAsistioActivo : styles.noAsistio,
              ]}
              onPress={() => handleEstado(item.id, "noAsistio")}
            >
              <Text style={styles.botonTexto}>No asistió</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* ✅ Encabezado general reutilizable */}
      <Encabezado />

      {/* ✅ Título de esta pantalla (separado del encabezado) */}
      <Text style={styles.tituloAgenda}>Mi Agenda</Text>

      {/* --- Tabs --- */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "pasadas" && styles.tabActiva]}
          onPress={() => setSelectedTab("pasadas")}
        >
          <Text
            style={[styles.tabTexto, selectedTab === "pasadas" && styles.tabTextoActivo]}
          >
            Citas pasadas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === "futuras" && styles.tabActiva]}
          onPress={() => setSelectedTab("futuras")}
        >
          <Text
            style={[styles.tabTexto, selectedTab === "futuras" && styles.tabTextoActivo]}
          >
            Citas futuras
          </Text>
        </TouchableOpacity>
      </View>

      {/* --- Lista de citas --- */}
      <FlatList
        data={selectedTab === "pasadas" ? citasPasadas : citasFuturas}
        keyExtractor={(item) => item.id}
        renderItem={renderCita}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* --- Menú inferior --- */}
      <View style={styles.menuContainer}>
        <MenuVet />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },

  // --- Título principal ---
  tituloAgenda: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#14841C",
    textAlign: "center",
    marginVertical: 15,
  },

  // --- Tabs ---
  tabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  tabActiva: {
    borderBottomWidth: 3,
    borderBottomColor: "#14841C",
  },
  tabTexto: {
    color: "#888",
    fontWeight: "bold",
    fontSize: 14,
  },
  tabTextoActivo: {
    color: "#14841C",
  },

  // --- Tarjetas ---
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 15,
    padding: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 40,
    marginRight: 10,
  },
  cardInfo: {
    flex: 1,
  },
  nombre: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  texto: {
    fontSize: 13,
    color: "gray",
    marginLeft: 4,
  },
  botonesRow: {
    flexDirection: "row",
    marginTop: 6,
    gap: 10,
  },
  boton: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  botonTexto: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  culmino: { backgroundColor: "#14841C" },
  culminoActivo: { backgroundColor: "#0B570F" },
  noAsistio: { backgroundColor: "#555" },
  noAsistioActivo: { backgroundColor: "#222" },
  menuContainer: {
    marginTop: 10,
  },
});

