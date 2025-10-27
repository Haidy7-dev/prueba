import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

interface ResumenCitaCardProps {
  nombre_mascota: string;
  sexo_mascota: string;
  nombre_servicio: string;
  precio_servicio: number;
  modalidad: string;
  hora_inicio: string;
  hora_finalizacion: string;
  iva: number;
  total: number;
  nombre_usuario: string;
  correo_usuario: string;
  nombre_veterinario: string;
  correo_veterinario: string;
  lugar: string;
  fotoMascota?: string;
}

export default function ResumenCitaCard({
  nombre_mascota,
  sexo_mascota,
  nombre_servicio,
  precio_servicio,
  modalidad,
  hora_inicio,
  hora_finalizacion,
  iva,
  total,
  nombre_usuario,
  correo_usuario,
  nombre_veterinario,
  correo_veterinario,
  lugar,
  fotoMascota,
}: ResumenCitaCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Cita</Text>

      {/* CONTENEDOR 1: Mascota + dueño + veterinario */}
      <View style={styles.card}>
        {/* Sección mascota */}
        <View style={styles.headerMascota}>
          <Image
            source={
              fotoMascota
                ? { uri: fotoMascota }
                : require("../assets/images/navegacion/foto.png")
            }
            style={styles.profileImage}
            resizeMode="cover"
          />

          <View style={styles.infoMascota}>
            <Text style={styles.nombreMascota}>{nombre_mascota}</Text>

            <View style={styles.row}>
              <Ionicons name="time-outline" size={16} color="#2E7D32" />
              <Text style={styles.textIcon}>
                {hora_inicio} - {hora_finalizacion}
              </Text>
            </View>

            <View style={styles.row}>
              <MaterialCommunityIcons
                name="medical-bag"
                size={16}
                color="#2E7D32"
              />
              <Text style={styles.textIcon}>{nombre_servicio}</Text>
            </View>

            <View style={styles.row}>
              <Ionicons
                name={sexo_mascota === "Macho" ? "male" : "female"}
                size={16}
                color="#2E7D32"
              />
              <Text style={styles.textIcon}>{sexo_mascota}</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Dueño */}
        <View style={styles.rowDatosColumn}>
          <View style={styles.row}>
            <Ionicons name="person-outline" size={20} color="#2E7D32" />
            <Text style={styles.nombreDato}>{nombre_usuario}</Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="mail-outline" size={18} color="#2E7D32" />
            <Text style={styles.correoDato}>{correo_usuario}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Veterinario */}
        <View style={styles.rowDatosColumn}>
          <View style={styles.row}>
            <MaterialCommunityIcons
              name="stethoscope"
              size={20}
              color="#2E7D32"
            />
            <Text style={styles.nombreDato}>{nombre_veterinario}</Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="mail-outline" size={18} color="#2E7D32" />
            <Text style={styles.correoDato}>{correo_veterinario}</Text>
          </View>
        </View>
      </View>

      {/* CONTENEDOR 2: Detalles del servicio */}
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.labelInfo}>Como se hará el servicio:</Text>
          <Text style={styles.valueInfo}>{modalidad}</Text>
        </View>

        <View style={styles.dividerLight} />

        <View style={styles.rowBetween}>
          <Text style={styles.labelInfo}>Lugar:</Text>
          <Text style={[styles.valueInfo, { maxWidth: "60%", textAlign: "right" }]}>
            {lugar || "Sin definir"}
          </Text>
        </View>
      </View>

      {/* CONTENEDOR 3: Costos */}
      {/* CONTENEDOR 3: Costos */}
<View style={[styles.card, styles.cardCostos]}>
  <View style={styles.rowBetween}>
    <Text style={styles.labelCosto}>{nombre_servicio}:</Text>
    <Text style={styles.valorCosto}>
      ${precio_servicio.toLocaleString("es-CO")} Cop
    </Text>
  </View>

  <View style={styles.dividerLight} />

  <View style={styles.rowBetween}>
    <Text style={styles.labelCosto}>Iva:</Text>
    <Text style={styles.valorCosto}>{iva}%</Text>
  </View>

  {/* Sección total con fondo verde que ocupa el borde inferior */}
  <View style={styles.totalContainer}>
    <View style={styles.rowBetween}>
      <Text style={styles.totalLabel}>Total:</Text>
      <Text style={styles.totalValue}>
        ${total.toLocaleString("es-CO")} Cop
      </Text>
    </View>
  </View>
</View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D1D1D1", // gris claro
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  headerMascota: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 95,
    height: 95,
    borderRadius: 10,
    marginRight: 15,
  },
  infoMascota: { flex: 1 },
  nombreMascota: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  textIcon: {
    fontSize: 14,
    marginLeft: 5,
    color: "#444",
  },
  divider: {
    height: 1.5,
    backgroundColor: "#CFCFCF",
    marginVertical: 10,
  },
  dividerLight: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 8,
  },
  rowDatosColumn: {
    flexDirection: "column",
    gap: 5,
  },
  nombreDato: {
    fontSize: 15,
    marginLeft: 6,
    color: "#000",
  },
  correoDato: {
    fontSize: 14,
    color: "#444",
    marginLeft: 6,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  labelInfo: { fontSize: 15, color: "#000" },
  valueInfo: { fontSize: 15, color: "#333" },
  labelCosto: { fontSize: 15, color: "#000" },
  valorCosto: { fontSize: 15, color: "#333" },

 cardCostos: {
  paddingBottom: 0, // elimina espacio debajo del total
  overflow: "hidden", // permite que el fondo verde toque el borde
 
},

totalContainer: {
  backgroundColor: "#7BBD92",
  borderBottomLeftRadius: 12,
  borderBottomRightRadius: 12,
  paddingVertical: 10,
  paddingHorizontal: 15, // puedes mantenerlo si quieres texto alineado, o quitarlo
  marginTop: 10,
  marginHorizontal: -15, // 🔥 hace que el color se extienda hasta los bordes del card
},

totalLabel: {
  fontSize: 16,
  fontWeight: "bold",
  color: "#000",
},

totalValue: {
  fontSize: 16,
  fontWeight: "bold",
  color: "#000",
},

});
