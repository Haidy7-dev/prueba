import { BASE_URL } from "@/config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";

// Configurar locale español para el calendario
LocaleConfig.locales['es'] = {
  monthNames: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ],
  monthNamesShort: ['Ene.', 'Feb.', 'Mar.', 'Abr.', 'May.', 'Jun.', 'Jul.', 'Ago.', 'Sep.', 'Oct.', 'Nov.', 'Dic.'],
  dayNames: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
  dayNamesShort: ['Lun.', 'Mar.', 'Mié.', 'Jue.', 'Vie.', 'Sáb.', 'Dom.'],
  today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';
import BotonGeneral from "../../components/BotonGeneral";
import Encabezado from "../../components/Encabezado";
import MenuDueno from "../../components/MenuDueno";

// --- Función para mostrar estrellas
const computeStars = (prom: number) => {
  const full = Math.floor(prom);
  const frac = prom - full;
  let half = false;
  let roundedUp = false;
  if (frac >= 0.75) {
    roundedUp = true;
  } else if (frac >= 0.5) {
    half = true;
  }
  const fullStars = roundedUp ? full + 1 : full;
  return { fullStars, half, roundedUp };
};

// --- Agrupar horarios por rango de tiempo
function formatTime(timeString: string) {
  const [hour, minute] = timeString.split(':').map(Number);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${String(minute).padStart(2, '0')} ${ampm}`;
}

export default function VerVeterinario() {
  const { id } = useLocalSearchParams();
  const [veterinario, setVeterinario] = useState<any>(null);
  const [horarios, setHorarios] = useState<any[]>([]);
  const [servicios, setServicios] = useState<any[]>([]);
  const [especializaciones, setEspecializaciones] = useState<any[]>([]);
  const [selectedServicio, setSelectedServicio] = useState<any>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedHour, setSelectedHour] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  // 🔹 Cargar datos del veterinario
  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      try {
        const resp = await axios.get(`${BASE_URL}/api/veterinarios/detalle/${id}`);
        setVeterinario(resp.data.vet);
        setEspecializaciones(resp.data.especializaciones || []);
        setHorarios(resp.data.horarios || []);
        setServicios(resp.data.servicios || []);
      } catch (err) {
        console.error("Error al cargar el veterinario:", err);
        Alert.alert("Error", "No fue posible cargar la información del veterinario.");
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, [id]);

  const horariosPorDia = useMemo(() => {
    const dayOrder = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    const grouped: Record<string, { start: string; end: string }[]> = {};
    horarios.forEach((h) => {
      if (!grouped[h.dia_semana]) {
        grouped[h.dia_semana] = [];
      }
      grouped[h.dia_semana].push({ start: h.hora_inicio, end: h.hora_finalizacion });
    });
    // Sort blocks by start time for each day
    for (const day in grouped) {
      grouped[day].sort((a, b) => a.start.localeCompare(b.start));
    }
    
    const sortedGrouped: Record<string, { start: string; end: string }[]> = {};
    dayOrder.forEach(day => {
      if (grouped[day]) {
        sortedGrouped[day] = grouped[day];
      }
    });

    return sortedGrouped;
  }, [horarios]);

  // 🔹 Mostrar estrellas
  const renderEstrellas = (promedio: number) => {
    const { fullStars, half } = computeStars(promedio);
    const estrellas = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) estrellas.push(<Text key={i} style={styles.estrella}>★</Text>);
      else if (half && i === fullStars + 1) estrellas.push(<Text key={i} style={styles.mediaEstrella}>⯪</Text>);
      else estrellas.push(<Text key={i} style={styles.estrellaVacia}>☆</Text>);
    }
    return estrellas;
  };

  // 🔹 Obtener días únicos del veterinario
  const diasDisponibles = useMemo(() => {
    const dias = new Set(horarios.map(h => h.dia_semana));
    return Array.from(dias);
  }, [horarios]);

  // 🔹 Mapear día de la semana numérico a español
  const getDiaSemana = (dateString: string) => {
    const date = new Date(dateString);
    const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    return dias[date.getDay()];
  };

  // 🔹 Generar horas válidas basadas en el día seleccionado
  const generarHorasValidas = (selectedDate: string) => {
    if (!selectedDate) return [];
    const diaSeleccionado = getDiaSemana(selectedDate);
    const horariosDelDia = horarios.filter(h => h.dia_semana === diaSeleccionado);
    if (horariosDelDia.length === 0) return [];

    const horas: string[] = [];
    horariosDelDia.forEach(h => {
      const [horaInicio, minInicio] = h.hora_inicio.split(':').map(Number);
      const [horaFin, minFin] = h.hora_finalizacion.split(':').map(Number);
      let current = horaInicio * 60 + minInicio;
      const end = horaFin * 60 + minFin;
      while (current < end) {
        const hStr = String(Math.floor(current / 60)).padStart(2, '0');
        const mStr = String(current % 60).padStart(2, '0');
        horas.push(`${hStr}:${mStr}`);
        current += 30;
      }
    });
    return [...new Set(horas)].sort(); // Eliminar duplicados y ordenar
  };

  // 🔹 Resetear hora seleccionada cuando cambie la fecha
  useEffect(() => {
    setSelectedHour("");
  }, [selectedDate]);

  // 🔹 Agendar cita
  const handleAgendar = async () => {
    if (!selectedServicio) return Alert.alert("Seleccione un servicio");
    if (!selectedDate) return Alert.alert("Seleccione una fecha");
    if (!selectedHour) return Alert.alert("Seleccione una hora");

    setBookingLoading(true);
    try {
      // Recuperar ID del usuario logueado
      const id_usuario = await AsyncStorage.getItem("userId");
      if (!id_usuario) {
        Alert.alert("Error", "No se encontró el usuario. Inicia sesión nuevamente.");
        return;
      }

      const id_mascota = 1; // ⚠️ Temporal hasta integrar selección de mascota

      const payload = {
        fecha: selectedDate,
        hora_inicio: selectedHour,
        id_veterinario: id, // viene desde useLocalSearchParams()
        id_servicio: selectedServicio,
        id_usuario,
        id_mascota,
        modalidad: "Presencial",
        id_estado_cita: 1, // Establecer estado como 'Pendiente'
      };

      console.log("📤 Enviando cita:", payload);

      await axios.post(`${BASE_URL}/api/citas`, payload);
      Alert.alert("Agendado", "Tu cita fue creada correctamente.");
    } catch (err) {
      console.error("Error agendando:", err);
      Alert.alert("Error", "No fue posible agendar la cita.");
    } finally {
      setBookingLoading(false);
    }
  };

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#479454" />
      </View>
    );
  }

  if (!veterinario) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No se encontró información del veterinario.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Encabezado />

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.contenedorPrincipal}>
          <View style={styles.infoSuperior}>
            <Image
              source={
                veterinario.foto
                  ? { uri: `${BASE_URL}/pethub/${veterinario.foto}` }
                  : require("../../assets/images/navegacion/foto.png")
              }
              style={styles.foto}
            />
            <View style={styles.infoTexto}>
              <Text style={styles.nombre}>{veterinario.nombre}</Text>
              <Text style={styles.especialidad}>
                <Text style={{ fontWeight: "600" }}>Especialización: </Text>
                {especializaciones.length
                  ? especializaciones.map((e: any) => e.nombre).join(", ")
                  : "Sin especificar"}
              </Text>
              <View style={styles.estrellasFila}>
                {renderEstrellas(Number(veterinario.promedio_calificaciones))}
                <Text style={styles.promedio}>{veterinario.promedio_calificaciones}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.lineaVerde} />

        <View style={styles.contenedorTexto}>
          <Text style={styles.titulo}>
            Conoce a {String(veterinario.nombre).split(" ")[0]}
          </Text>
          <Text style={styles.descripcion}>
            {veterinario.descripcion_de_perfil || "Sin descripción disponible."}
          </Text>
        </View>

        <View style={styles.lineaVerde} />

        <View style={styles.contenedorTexto}>
          <Text style={styles.titulo}>Horarios</Text>
          {Object.keys(horariosPorDia).length > 0 ? (
            Object.entries(horariosPorDia).map(([dia, bloques]) => (
              <View key={dia} style={{ marginBottom: 5 }}>
                <Text style={styles.horarioDia}>{dia}:</Text>
                {bloques.map((bloque, idx) => (
                  <Text key={idx} style={styles.horarioTexto}>
                    {formatTime(bloque.start)} – {formatTime(bloque.end)}
                  </Text>
                ))}
              </View>
            ))
          ) : (
            <Text style={styles.horarioTexto}>Cerrado</Text>
          )}
        </View>

        <View style={styles.contenedorTexto}>
          <Text style={styles.titulo}>Servicios disponibles</Text>
          <Picker
            selectedValue={selectedServicio}
            onValueChange={(v) => setSelectedServicio(v)}
            style={styles.picker}
          >
            <Picker.Item label="Selecciona un servicio" value="" />
            {servicios.map((s: any) => (
              <Picker.Item
                key={s.id}
                label={`${s.nombre} (${s.duracion} min) - ${s.precio}`}
                value={s.id}
              />
            ))}
          </Picker>
        </View>

        <View style={styles.contenedorTexto}>
          <Text style={styles.titulo}>Selecciona una fecha</Text>
          <View style={styles.calendarContainer}>
            <Calendar
              minDate={todayStr}
              firstDay={1}
              onDayPress={(day) => {
                const diaSemana = getDiaSemana(day.dateString);
                if (diasDisponibles.includes(diaSemana)) {
                  setSelectedDate(day.dateString);
                } else {
                  Alert.alert("Fecha no disponible", "El veterinario no atiende en este día.");
                }
              }}
              markedDates={{
                [selectedDate]: { selected: true, selectedColor: "#479454" },
              }}
              theme={{
                selectedDayBackgroundColor: "#479454",
                todayTextColor: "#479454",
                arrowColor: "#479454",
                monthTextColor: "#000",
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 14,
                stylesheet: {
                  calendar: {
                    header: {
                      
                    }
                  }
                }
              }}
              style={styles.calendar}
            />
          </View>
        </View>

        <View style={{ paddingHorizontal: 16 }}>
          <Text style={[styles.titulo, { marginTop: 8 }]}>
            Selecciona un horario
          </Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horasScroll}
        >
          {generarHorasValidas(selectedDate).map((hora, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedHour(hora)}
              style={[
                styles.hora,
                selectedHour === hora && styles.horaSeleccionada,
              ]}
            >
              <Text
                style={[
                  styles.horaTexto,
                  selectedHour === hora && styles.horaTextoSeleccionada,
                ]}
              >
                {hora}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={{ padding: 16 }}>
          <BotonGeneral
            title={bookingLoading ? "Agendando..." : "Agendar cita"}
            disabled={bookingLoading}
            onPress={handleAgendar}
          />
        </View>
      </ScrollView>

      <MenuDueno />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff", flex: 1 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  contenedorPrincipal: { padding: 16, backgroundColor: "#fff" },
  infoSuperior: { flexDirection: "row", alignItems: "center" },
  foto: { width: 90, height: 90, borderRadius: 45, marginRight: 16, backgroundColor: "#f0f0f0" },
  infoTexto: { flex: 1 },
  nombre: { fontSize: 20, fontWeight: "bold", color: "#000" },
  especialidad: { fontSize: 14, color: "#666", marginTop: 6 },
  estrellasFila: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  estrella: { fontSize: 18, color: "#FFB800", marginRight: 4 },
  mediaEstrella: { fontSize: 18, color: "#FFB800", marginRight: 4 },
  estrellaVacia: { fontSize: 18, color: "#FFB800", opacity: 0.4, marginRight: 4 },
  promedio: { marginLeft: 8, fontSize: 14, color: "#333" },
  lineaVerde: { borderBottomWidth: 1, borderBottomColor: "#479454", marginHorizontal: 16 },
  contenedorTexto: { padding: 16 },
  titulo: { fontWeight: "bold", fontSize: 16, color: "#000", marginBottom: 8 },
  descripcion: { fontSize: 14, color: "#555", lineHeight: 20 },
  horarioTexto: { fontSize: 14, color: "#555", marginLeft: 10, marginBottom: 3 },
  horarioDia: { fontWeight: "bold", fontSize: 15, color: "#333" },
  servicioNombre: { fontWeight: "bold", fontSize: 15, color: "#333" },
  servicioDetalle: { fontSize: 14, color: "#555", marginLeft: 10, marginBottom: 3 },
  picker: { backgroundColor: "#f4f4f4", borderRadius: 8, marginTop: 8 },
  horasScroll: { marginVertical: 12, paddingHorizontal: 16 },
  hora: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14, marginRight: 10 },
  horaSeleccionada: { backgroundColor: "#479454", borderColor: "#479454" },
  horaTexto: { color: "#000" },
  horaTextoSeleccionada: { color: "#fff", fontWeight: "bold" },
  calendarContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  calendar: {
    borderRadius: 10,
  },
});
