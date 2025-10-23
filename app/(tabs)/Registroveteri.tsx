import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import BotonGeneral from "@/components/BotonGeneral";
import MenuVet from "@/components/MenuVet";
import moment from "moment";
import "moment/locale/es";

moment.locale("es");

export default function Horariovet() {
  const router = useRouter();

  // Días de la semana (en mayúscula inicial para coincidir con ENUM)
  const diasSemana = [
    { nombre: "Lun", valor: "Lunes" },
    { nombre: "Mar", valor: "Martes" },
    { nombre: "Mié", valor: "Miércoles" },
    { nombre: "Jue", valor: "Jueves" },
    { nombre: "Vie", valor: "Viernes" },
    { nombre: "Sáb", valor: "Sábado" },
    { nombre: "Dom", valor: "Domingo" },
  ];

  const [diasSeleccionados, setDiasSeleccionados] = useState<string[]>([]);
  const [horaInicio, setHoraInicio] = useState<string | null>(null);
  const [horaFin, setHoraFin] = useState<string | null>(null);

  // Generar lista de horas
  const horas: string[] = [];
  for (let h = 8; h <= 20; h++) {
    horas.push(`${h}:00`);
    horas.push(`${h}:30`);
  }

  // Selección múltiple de días
  const toggleDia = (dia: string) => {
    setDiasSeleccionados((prev) =>
      prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]
    );
  };

  // --- GUARDAR HORARIO EN BD ---
  const guardarHorario = async () => {
    if (diasSeleccionados.length === 0) {
      Alert.alert("Selecciona al menos un día");
      return;
    }
    if (!horaInicio || !horaFin) {
      Alert.alert("Selecciona hora de inicio y finalización");
      return;
    }

    try {
      // Enviar un horario por cada día seleccionado
      for (const dia of diasSeleccionados) {
        const data = {
          dia_semana: dia,
          hora_inicio: horaInicio + ":00", // formato compatible con TIME
          hora_finalizacion: horaFin + ":00",
        };

        // Cambia la IP según tu entorno local
        await axios.post("http://10.164.93.119:3000/api/horarios", data);
      }

      Alert.alert("Éxito", "Horarios guardados correctamente.");
      router.push("./Perfilvet");
    } catch (error) {
      console.error("Error al guardar horario:", error);
      Alert.alert("Error", "No se pudo guardar el horario en la base de datos.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Selecciona tu horario de trabajo</Text>

      {/* Carrusel de días */}
      <Text style={styles.subtitulo}>Días de la semana</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {diasSemana.map((dia) => (
          <TouchableOpacity
            key={dia.valor}
            style={[
              styles.diaCard,
              diasSeleccionados.includes(dia.valor) && styles.diaSeleccionado,
            ]}
            onPress={() => toggleDia(dia.valor)}
          >
            <Text
              style={[
                styles.diaTexto,
                diasSeleccionados.includes(dia.valor) && styles.textoSeleccionado,
              ]}
            >
              {dia.nombre}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Hora inicio */}
      <Text style={styles.subtitulo}>Hora de inicio</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {horas.map((hora) => (
          <TouchableOpacity
            key={`inicio-${hora}`}
            style={[
              styles.horaCard,
              horaInicio === hora && styles.horaSeleccionada,
            ]}
            onPress={() => setHoraInicio(hora)}
          >
            <Text
              style={[
                styles.horaTexto,
                horaInicio === hora && styles.textoSeleccionado,
              ]}
            >
              {moment(hora, "H:mm").format("hh:mm A")}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Hora final */}
      <Text style={styles.subtitulo}>Hora de finalización</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {horas.map((hora) => (
          <TouchableOpacity
            key={`fin-${hora}`}
            style={[
              styles.horaCard,
              horaFin === hora && styles.horaSeleccionada,
            ]}
            onPress={() => setHoraFin(hora)}
          >
            <Text
              style={[
                styles.horaTexto,
                horaFin === hora && styles.textoSeleccionado,
              ]}
            >
              {moment(hora, "H:mm").format("hh:mm A")}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Botón guardar */}
      <View style={{ marginTop: 25 }}>
        <BotonGeneral title="Guardar horario" onPress={guardarHorario} />
      </View>

      {/* Menú inferior */}
      <View style={{ marginTop: 10 }}>
        <MenuVet />
      </View>
    </View>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
    alignItems: "center",
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: "600",
    alignSelf: "flex-start",
    marginLeft: 20,
    marginTop: 15,
    color: "#555",
  },
  diaCard: {
    backgroundColor: "#e3f2fd",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 6,
    width: 70,
    height: 70,
  },
  diaSeleccionado: {
    backgroundColor: "#14841C",
  },
  diaTexto: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  textoSeleccionado: {
    color: "#fff",
    fontWeight: "bold",
  },
  horaCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    marginTop: 10,
    width: 100,
    height: 60,
  },
  horaSeleccionada: {
    backgroundColor: "#14841C",
  },
  horaTexto: {
    fontSize: 16,
    color: "#333",
  },
});

