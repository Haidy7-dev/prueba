import { useRouter } from "expo-router";
import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageSourcePropType,
} from "react-native";

interface BotonAccion {
  texto: string;
  onPress?: () => void;
  disabled?: boolean;
}

interface MascotaCardProps {
  nombre: string;
  hora: string;
  fecha: string;
  tipo: string;
  foto: ImageSourcePropType;
  botones?: BotonAccion[];
  // New props for internal navigation
  isCompleted?: boolean;
  appointmentId?: string;
}

export default function MascotaCard({
  nombre,
  hora,
  fecha,
  tipo,
  foto,
  botones = [],
  isCompleted,
  appointmentId,
}: MascotaCardProps) {
  const router = useRouter();

  const handleCardPress = () => {
    if (isCompleted && appointmentId) {
      router.push({
        pathname: "/DetalleCita",
        params: { idCita: appointmentId },
      });
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={isCompleted ? 0.8 : 1}
      onPress={handleCardPress}
      style={styles.card}
      disabled={!isCompleted}
    >
      <View style={styles.infoContainer}>
        <Image source={foto} style={styles.foto} />
        <View style={styles.textContainer}>
          <Text style={styles.nombre}>{nombre}</Text>
          <Text style={styles.detalle}>⏰ {hora}</Text>
          <Text style={styles.detalle}>📅 {fecha}</Text>
          <Text style={styles.detalle}>🩺 {tipo}</Text>
        </View>
      </View>

      {botones.length > 0 && (
        <View style={styles.botonesContainer}>
          {botones.map((boton, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.boton,
                boton.disabled ? styles.botonDisabled : styles.botonEnabled,
              ]}
              onPress={boton.onPress}
              disabled={boton.disabled || !boton.onPress}
            >
              <Text style={styles.textoBoton}>{boton.texto}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  foto: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  textContainer: { flex: 1 },
  nombre: { fontSize: 18, fontWeight: "700", color: "#333" },
  detalle: { color: "#666", marginTop: 4 },
  botonesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  boton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  botonEnabled: {
    backgroundColor: "#479454",
  },
  botonDisabled: {
    backgroundColor: "#ccc",
  },
  textoBoton: {
    color: "#fff",
    fontWeight: "600",
  },
});