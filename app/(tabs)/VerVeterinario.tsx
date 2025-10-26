import React, { useEffect, useState } from "react";
import {View,Text,Image,StyleSheet,ScrollView,ActivityIndicator,TouchableOpacity,} from "react-native";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import Encabezado from "../../components/Encabezado";
import BotonGeneral from "../../components/BotonGeneral";
import { Picker } from "@react-native-picker/picker";
import { Calendar } from "react-native-calendars";

export default function VerVeterinario() {
  const { id } = useLocalSearchParams(); // id del veterinario enviado desde HomeDueno

  const [veterinario, setVeterinario] = useState<any>(null);
  const [horarios, setHorarios] = useState<any[]>([]);
  const [servicios, setServicios] = useState<any[]>([]);
  const [selectedServicio, setSelectedServicio] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHour, setSelectedHour] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const response = await axios.get(`http://192.168.101.73:3000/api/veterinarios/detalle/${id}`);
        setVeterinario(response.data.vet);
        setHorarios(response.data.horarios);
        setServicios(response.data.servicios);
      } catch (error) {
        console.error("Error al cargar el veterinario:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, [id]);

  const renderEstrellas = (promedio: number) => {
    const estrellas = [];
    for (let i = 1; i <= 5; i++) {
      if (promedio >= i) estrellas.push(<Text key={i} style={styles.estrella}>⭐</Text>);
      else if (promedio >= i - 0.5) estrellas.push(<Text key={i} style={styles.mediaEstrella}>🟊</Text>);
      else estrellas.push(<Text key={i} style={[styles.estrella, styles.estrellaVacia]}>☆</Text>);
    }
    return estrellas;
  };

  const generarHoras = () => {
    const horas = [];
    for (let h = 0; h < 24; h++) {
      horas.push(`${String(h).padStart(2, "0")}:00`);
      horas.push(`${String(h).padStart(2, "0")}:30`);
    }
    return horas;
  };

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
    <ScrollView style={styles.container}>
      <Encabezado />

      {/* 🟢 Sección principal */}
      <View style={styles.contenedorPrincipal}>
        {/* Foto + info */}
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
            <Text style={styles.especialidad}>Especialización: cirugía</Text>
            <View style={styles.estrellasFila}>
              {renderEstrellas(Number(veterinario.promedio_calificaciones))}
              <Text style={styles.promedio}>{veterinario.promedio_calificaciones}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 🔹 Línea divisoria verde */}
      <View style={styles.lineaVerde} />

      {/* 🟢 Sección descripción */}
      <View style={styles.contenedorTexto}>
        <Text style={styles.titulo}>
          Conoce a {veterinario.nombre.split(" ")[0]}
        </Text>
        <Text style={styles.descripcion}>
          {veterinario.descripcion_de_perfil || "Sin descripción disponible."}
        </Text>
      </View>

      <View style={styles.lineaVerde} />

      {/* 🟢 Sección horarios */}
      <View style={styles.contenedorTexto}>
        <Text style={styles.titulo}>Horarios</Text>
        {horarios.length > 0 ? (
          horarios.map((h, index) => (
            <Text key={index} style={styles.horarioTexto}>
              <Text style={styles.horarioDia}>{h.dia_semana}:</Text>{" "}
              {h.hora_inicio && h.hora_fin
                ? `${h.hora_inicio} – ${h.hora_fin}`
                : "Cerrado"}
            </Text>
          ))
        ) : (
          <Text style={styles.horarioTexto}>Cerrado</Text>
        )}
      </View>

      {/* 🔹 Menú de servicios */}
      <View style={styles.contenedorTexto}>
        <Text style={styles.titulo}>Servicios disponibles</Text>
        <Picker
          selectedValue={selectedServicio}
          onValueChange={(itemValue) => setSelectedServicio(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Selecciona un servicio" value="" />
          {servicios.map((s) => (
            <Picker.Item key={s.id} label={s.nombre} value={s.id} />
          ))}
        </Picker>
      </View>

      {/* 🔹 Calendario */}
      <View style={styles.contenedorTexto}>
        <Text style={styles.titulo}>Selecciona una fecha</Text>
        <Calendar
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: "#479454" },
          }}
        />
      </View>

      {/* 🔹 Carrusel de horas */}
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

      {/* 🔹 Botón agendar */}
      <View style={{ padding: 16 }}>
        <BotonGeneral title="Agendar cita" onPress={() => console.log("Agendar")} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff", flex: 1 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

  contenedorPrincipal: { padding: 16, backgroundColor: "#fff" },
  infoSuperior: { flexDirection: "row", alignItems: "center" },
  foto: { width: 80, height: 80, borderRadius: 40, marginRight: 16 },
  infoTexto: { flex: 1 },
  nombre: { fontSize: 18, fontWeight: "bold", color: "#000" },
  especialidad: { fontSize: 14, color: "#666", marginTop: 2 },
  estrellasFila: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  estrella: { fontSize: 18, color: "#FFD700" },
  mediaEstrella: { fontSize: 18, color: "#FFD700", opacity: 0.8 },
  estrellaVacia: { color: "#FFD700", opacity: 0.3 },
  promedio: { marginLeft: 6, fontSize: 14, color: "#333" },

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
