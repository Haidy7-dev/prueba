import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

interface MascotaCardProps {
  nombre: string;
  hora: string;
  fecha: string;
  tipo: string;
  foto: any;
  onPress?: () => void;
  estado?: number | null;

  // 🔹 Botón 1 (Culminó)
  onCulmino?: () => void;

  // 🔹 Botón 2 (puede ser "No asistió" o "Calificar")
  onAccionSecundaria?: () => void;
  textoAccionSecundaria?: string; // 👈 texto dinámico ("No asistió" o "Calificar")
  colorAccionSecundaria?: string; // 👈 color del botón secundario
}

export default function MascotaCard({
  nombre,
  hora,
  fecha,
  tipo,
  foto,
  onPress,
  estado,
  onCulmino,
  onAccionSecundaria,
  textoAccionSecundaria = "Acción",
  colorAccionSecundaria = "#555", // color por defecto
}: MascotaCardProps) {
  // --- Formateadores de fecha y hora ---
  const formatFecha = (fechaStr: string) => {
    try {
      return new Date(fechaStr).toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return fechaStr;
    }
  };

  const formatHora = (horaStr: string) => {
    if (!horaStr.includes("-")) return horaStr;
    const [inicio, fin] = horaStr.split(" - ");
    const format = (h: string) =>
      new Date(`1970-01-01T${h.trim()}`).toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    return `${format(inicio)} - ${format(fin)}`;
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <View style={styles.card}>
        <Image source={foto} style={styles.avatar} />

        <View style={styles.info}>
          <Text style={styles.nombre}>{nombre}</Text>

          {/* Fecha */}
          <View style={styles.row}>
            <Ionicons name="time-outline" size={16} color="green" />
            <Text style={styles.texto}>{formatHora(hora)}</Text>
          </View>

          <View style={styles.row}>
            <Ionicons name="calendar-outline" size={16} color="green" />
            <Text style={styles.texto}>{formatFecha(fecha)}</Text>
          </View>

          {/* Tipo de cita */}
          <View style={styles.row}>
            <MaterialCommunityIcons
              name="stethoscope"
              size={16}
              color="#1C8D3D"
            />
            <Text style={styles.texto}>{tipo}</Text>
          </View>

          {/* Botones dinámicos */}
          {(onCulmino || onAccionSecundaria) && (
            <View style={styles.botonesRow}>
              {onCulmino && (
                <TouchableOpacity
                  style={[styles.boton, { backgroundColor: "#14841C" }]}
                  onPress={onCulmino}
                >
                  <Text style={styles.botonTexto}>Culminó</Text>
                </TouchableOpacity>
              )}

              {onAccionSecundaria && (
                <TouchableOpacity
                  style={[
                    styles.boton,
                    { backgroundColor: colorAccionSecundaria },
                  ]}
                  onPress={onAccionSecundaria}
                >
                  <Text style={styles.botonTexto}>{textoAccionSecundaria}</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 12,
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  nombre: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#000",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  texto: {
    fontSize: 14,
    color: "#333",
    marginLeft: 6,
  },
  botonesRow: { flexDirection: "row", marginTop: 8, gap: 10 },
  boton: { paddingVertical: 6, paddingHorizontal: 16, borderRadius: 15 },
  botonTexto: { color: "#fff", fontSize: 13, fontWeight: "600" },
});
