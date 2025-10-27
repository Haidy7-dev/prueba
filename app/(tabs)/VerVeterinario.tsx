import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import Encabezado from "../../components/Encabezado";
import BotonGeneral from "../../components/BotonGeneral";
import MenuDueno from "../../components/MenuDueno"; // ✅ Menú inferior
import { Picker } from "@react-native-picker/picker";
import { Calendar } from "react-native-calendars";

// --- Helpers para estrellas
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

// --- Agrupar horarios por rango igual
function groupHorarios(
  horarios: {
    dia_semana: string;
    hora_inicio: string;
    hora_finalizacion: string;
  }[]
) {
  const dayOrder = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];
  const map = new Map<string, string[]>();
  horarios.forEach((h) => {
    const key = `${h.hora_inicio}|${h.hora_finalizacion}`;
    const arr = map.get(key) || [];
    arr.push(h.dia_semana);
    map.set(key, arr);
  });
  const groups = Array.from(map.entries()).map(([key, days]) => {
    const [start, end] = key.split("|");
    days.sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));
    return { days, start, end };
  });
  groups.sort((a, b) => {
    const dayOrder = [
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
      "Domingo",
    ];
    return dayOrder.indexOf(a.days[0]) - dayOrder.indexOf(b.days[0]);
  });
  return groups;
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

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      try {
        const resp = await axios.get(
          `http://192.168.101.73:3000/api/veterinarios/detalle/${id}`
        );
        setVeterinario(resp.data.vet);
        setEspecializaciones(resp.data.especializaciones || []);
        setHorarios(resp.data.horarios || []);
        setServicios(resp.data.servicios || []);
      } catch (err) {
        console.error("Error al cargar el veterinario:", err);
        Alert.alert(
          "Error",
          "No fue posible cargar la información del veterinario."
        );
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, [id]);

  const horariosAgrupados = useMemo(() => groupHorarios(horarios), [horarios]);

  const renderEstrellas = (promedio: number) => {
    const { fullStars, half } = computeStars(promedio);
    const estrellas = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        estrellas.push(
          <Text key={i} style={styles.estrella}>
            ★
          </Text>
        );
      } else if (half && i === fullStars + 1) {
        estrellas.push(
          <Text key={i} style={styles.mediaEstrella}>
            ⯪
          </Text>
        );
      } else {
        estrellas.push(
          <Text key={i} style={styles.estrellaVacia}>
            ☆
          </Text>
        );
      }
    }
    return estrellas;
  };

  const generarHoras = () => {
    const horas: string[] = [];
    for (let h = 0; h < 24; h++) {
      horas.push(`${String(h).padStart(2, "0")}:00`);
      horas.push(`${String(h).padStart(2, "0")}:30`);
    }
    return horas;
  };

  const handleAgendar = async () => {
    if (!selectedServicio) return Alert.alert("Seleccione un servicio");
    if (!selectedDate) return Alert.alert("Seleccione una fecha");
    if (!selectedHour) return Alert.alert("Seleccione una hora");

    const id_usuario = "1052795396"; // temporal
    const id_mascota = 1; // temporal

    setBookingLoading(true);
    try {
      const payload = {
        fecha: selectedDate,
        hora_inicio: selectedHour,
        id_veterinario: veterinario.id,
        id_servicio: selectedServicio,
        id_usuario,
        id_mascota,
      };
      await axios.post("http://192.168.101.73:3000/api/citas", payload);
      Alert.alert("Agendado", "Tu cita fue creada correctamente.");
    } catch (err) {
      console.error("Error agendando:", err);
      Alert.alert("Error", "No fue posible agendar la cita.");
    } finally {
      setBookingLoading(false);
    }
  };

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const todayStr = `${yyyy}-${mm}-${dd}`;

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
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 100 }} // ✅ espacio para el menú
      >
        

        <View style={styles.contenedorPrincipal}>
          <View style={styles.infoSuperior}>
            <Image
              source={
                veterinario.foto
                  ? { uri: veterinario.foto }
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
                <Text style={styles.promedio}>
                  {veterinario.promedio_calificaciones}
                </Text>
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
          {horariosAgrupados.length > 0 ? (
            horariosAgrupados.map((g, idx) => (
              <Text key={idx} style={styles.horarioTexto}>
                <Text style={styles.horarioDia}>{g.days.join(", ")}: </Text>
                {g.start && g.end ? `${g.start} – ${g.end}` : "Cerrado"}
              </Text>
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
                label={`${s.nombre} (${s.duracion} min)`}
                value={s.id}
              />
            ))}
          </Picker>
        </View>

        <View style={styles.contenedorTexto}>
          <Text style={styles.titulo}>Selecciona una fecha</Text>
          <Calendar
            minDate={todayStr}
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: "#479454" },
            }}
            theme={{
              selectedDayBackgroundColor: "#479454",
              todayTextColor: "#479454",
              arrowColor: "#479454",
              monthTextColor: "#000",
            }}
          />
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
          {generarHoras().map((hora, index) => (
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

      {/* ✅ Menú fijo al fondo */}
      <MenuDueno />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff", flex: 1 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  contenedorPrincipal: { padding: 16, backgroundColor: "#fff" },
  infoSuperior: { flexDirection: "row", alignItems: "center" },
  foto: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginRight: 16,
    backgroundColor: "#f0f0f0",
  },
  infoTexto: { flex: 1 },
  nombre: { fontSize: 20, fontWeight: "bold", color: "#000" },
  especialidad: { fontSize: 14, color: "#666", marginTop: 6 },
  estrellasFila: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  estrella: { fontSize: 18, color: "#FFB800", marginRight: 4 },
  mediaEstrella: { fontSize: 18, color: "#FFB800", marginRight: 4 },
  estrellaVacia: {
    fontSize: 18,
    color: "#FFB800",
    opacity: 0.4,
    marginRight: 4,
  },
  promedio: { marginLeft: 8, fontSize: 14, color: "#333" },
  lineaVerde: {
    borderBottomWidth: 1,
    borderBottomColor: "#479454",
    marginHorizontal: 16,
  },
  contenedorTexto: { padding: 16 },
  titulo: { fontWeight: "bold", fontSize: 16, color: "#000", marginBottom: 8 },
  descripcion: { fontSize: 14, color: "#555", lineHeight: 20 },
  horarioTexto: { fontSize: 14, color: "#333", marginBottom: 4 },
  horarioDia: { fontWeight: "bold" },
  picker: {
    backgroundColor: "#f4f4f4",
    borderRadius: 8,
    marginTop: 8,
  },
  horasScroll: { marginVertical: 12, paddingHorizontal: 16 },
  hora: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginRight: 10,
  },
  horaSeleccionada: {
    backgroundColor: "#479454",
    borderColor: "#479454",
  },
  horaTexto: { color: "#000" },
  horaTextoSeleccionada: { color: "#fff", fontWeight: "bold" },
});
