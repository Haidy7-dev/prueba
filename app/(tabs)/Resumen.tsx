import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

export default function Resumen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Título */}
      <Text style={styles.title}>Cita</Text>

      {/* Tarjeta principal */}
      <View style={styles.card}>
        {/* Encabezado con imagen y datos */}
        <View style={styles.headerRow}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/616/616408.png", // Imagen genérica
            }}
            style={styles.petImage}
          />
          <View style={styles.headerInfo}>
            <View style={styles.rowBetween}>
              <Text style={styles.petName}>Lucca</Text>
              <Text style={styles.petId}>001</Text>
            </View>
            <View style={styles.iconText}>
              <Ionicons name="time-outline" size={16} color="#2E7D32" />
              <Text style={styles.text}>8:00 a.m - 9:00 a.m</Text>
            </View>
            <View style={styles.iconText}>
              <Ionicons name="calendar-outline" size={16} color="#2E7D32" />
              <Text style={styles.text}>12/11/2025</Text>
            </View>
            <View style={styles.iconText}>
              <MaterialCommunityIcons name="stethoscope" size={16} color="#2E7D32" />
              <Text style={styles.boldText}>Cirugía general</Text>
            </View>
            <View style={styles.iconText}>
              <Ionicons name="male" size={16} color="#2E7D32" />
              <Text style={styles.text}>Macho</Text>
            </View>
          </View>
        </View>

        {/* Dueño */}
        <View style={styles.section}>
          <View style={styles.iconText}>
            <Ionicons name="person-circle-outline" size={18} color="#2E7D32" />
            <Text style={styles.label}>Daniela Restrepo</Text>
          </View>
          <View style={styles.iconText}>
            <Ionicons name="mail-outline" size={18} color="#2E7D32" />
            <Text style={styles.email}>danielarest.2023@gmail.com</Text>
          </View>
        </View>

        {/* Veterinario */}
        <View style={styles.section}>
          <View style={styles.iconText}>
            <Ionicons name="medical-outline" size={18} color="#2E7D32" />
            <Text style={styles.label}>Sara Lee</Text>
          </View>
          <View style={styles.iconText}>
            <Ionicons name="mail-outline" size={18} color="#2E7D32" />
            <Text style={styles.email}>sara.lee.vet@gmail.com</Text>
          </View>
        </View>

        {/* Detalles del servicio */}
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Cómo se hará el servicio:</Text>
          <View style={styles.iconText}>
            <Ionicons name="home-outline" size={16} color="#2E7D32" />
            <Text style={styles.infoValue}>Presencial</Text>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Lugar en donde se hará:</Text>
          <View style={styles.iconText}>
            <Ionicons name="location-outline" size={16} color="#2E7D32" />
            <Text style={styles.infoValue}>
              Av. Circunvalar S-21, Circunvalar, Pereira
            </Text>
          </View>
        </View>

        {/* Costos */}
        <View style={styles.priceBox}>
          <View style={styles.priceRow}>
            <Text>Cirugía general</Text>
            <Text>$500.000 COP</Text>
          </View>
          <View style={styles.priceRow}>
            <Text>IVA</Text>
            <Text>16%</Text>
          </View>
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalText}>Total:</Text>
            <Text style={styles.totalText}>$580.000 COP</Text>
          </View>
        </View>
      </View>

      {/* Botón opcional */}
      {/* <BotonGeneral texto="Volver" onPress={() => router.back()} /> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#1A472A",
  },
  card: {
    backgroundColor: "#F7FBF8",
    borderRadius: 20,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  petImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
    backgroundColor: "#E0E0E0",
  },
  headerInfo: {
    flex: 1,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  petName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  petId: {
    color: "#888",
  },
  iconText: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 3,
  },
  text: {
    color: "#333",
    fontSize: 14,
  },
  boldText: {
    fontWeight: "600",
    fontSize: 14,
  },
  section: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#DADADA",
  },
  label: {
    fontWeight: "bold",
    color: "#000",
  },
  email: {
    color: "#2C7A7B",
  },
  infoBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  infoLabel: {
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  infoValue: {
    color: "#333",
  },
  priceBox: {
    marginTop: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#DDD",
    paddingTop: 5,
    marginTop: 5,
  },
  totalText: {
    fontWeight: "bold",
    color: "#2E7D32",
  },
});
    
