import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import MenuVet from "@/components/MenuVet";
import Encabezado from "@/components/Encabezado"; 

interface Cita {
  id: string;
  nombreMascota: string;
  hora: string;
  fecha: string;
  tipo: string;
}

const citas: Cita[] = [
  {
    id: "1",
    nombreMascota: "Lucca",
    hora: "8:00 am - 9:00 am",
    fecha: "18/01/2025",
    tipo: "Cita general",
  },
  {
    id: "2",
    nombreMascota: "Max",
    hora: "10:00 am - 11:00 am",
    fecha: "18/01/2025",
    tipo: "Cirugía general",
  },
  {
    id: "3",
    nombreMascota: "Luna",
    hora: "2:00 pm - 3:00 pm",
    fecha: "18/01/2025",
    tipo: "Vacunación",
  },
];

export default function CitasScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/*  Encabezado reutilizable */}
      <Encabezado />

      {/* Título local de la pantalla (no reutilizable) */}
      <Text style={styles.titulo}>Mis citas para hoy</Text>

      {/* Lista de citas */}
      <FlatList
        data={citas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Avatar del paciente */}
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="paw-outline" size={28} color="green" />
            </View>

            <View style={styles.info}>
              <Text style={styles.nombre}>{item.nombreMascota}</Text>

              <View style={styles.row}>
                <Ionicons name="time-outline" size={16} color="green" />
                <Text style={styles.texto}>{item.hora}</Text>
                <Text style={styles.fecha}>{item.fecha}</Text>
              </View>

              <View style={styles.row}>
                <Ionicons name="medkit-outline" size={16} color="green" />
                <Text style={styles.texto}>{item.tipo}</Text>
              </View>
            </View>
          </View>
        )}
      />

      {/* 🐾 Menú inferior */}
      <MenuVet />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 16,
    textAlign: "center",
    color: "#000",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center",
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "green",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  nombre: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  texto: {
    fontSize: 14,
    marginLeft: 4,
  },
  fecha: {
    fontSize: 12,
    marginLeft: 10,
    color: "gray",
  },
});

