import React, { useState } from "react";
import {View,Text,StyleSheet,Dimensions,TouchableOpacity,ScrollView,Button,} from "react-native";
import moment from "moment";
import "moment/locale/es";
import { useRouter } from "expo-router";
import BotonGeneral from "@/components/BotonGeneral";
import MenuVet from "@/components/MenuVet";

moment.locale("es");

const { width } = Dimensions.get("window");

export default function Horariovet() {
  const router = useRouter();
  const [fechaSeleccionada, setFechaSeleccionada] = useState(moment());
  const [horaSeleccionada, setHoraSeleccionada] = useState<string | null>(null);

  // Próximos 7 días
  const dias = Array.from({ length: 7 }, (_, i) => moment().add(i, "days"));

  // Horas disponibles
  const horas: string[] = [];
  for (let h = 8; h <= 20; h++) {
    horas.push(`${h}:00`);
    horas.push(`${h}:30`);
  }

  const guardarHorario = () => {
    if (!horaSeleccionada) {
      alert("Por favor selecciona una hora antes de guardar.");
      return;
    }
    alert(
      `Horario guardado:\n${fechaSeleccionada.format(
        "dddd D [de] MMMM"
      )} a las ${horaSeleccionada}`
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Selecciona tu horario de trabajo</Text>

      {/* Días en fila */}
      <Text style={styles.subtitulo}>Día</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollDias}
      >
        {dias.map((dia, index) => {
          const seleccionado = dia.isSame(fechaSeleccionada, "day");
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.cardDia,
                seleccionado && styles.cardDiaSeleccionado,
              ]}
              onPress={() => setFechaSeleccionada(dia)}
            >
              <Text
                style={[
                  styles.dia,
                  seleccionado && styles.textoSeleccionado,
                ]}
              >
                {dia.format("ddd").replace(".", "").slice(0, 3)}
              </Text>
              <Text
                style={[
                  styles.fecha,
                  seleccionado && styles.textoSeleccionado,
                ]}
              >
                {dia.format("D MMM")}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Horas en fila */}
      <Text style={styles.subtitulo}>Hora</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollHoras}
      >
        {horas.map((hora, index) => {
          const seleccionado = horaSeleccionada === hora;
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.cardHora,
                seleccionado && styles.cardHoraSeleccionada,
              ]}
              onPress={() => setHoraSeleccionada(hora)}
            >
              <Text
                style={[
                  styles.textoHora,
                  seleccionado && styles.textoHoraSeleccionada,
                ]}
              >
                {moment(hora, "H:mm").format("hh:mm A")}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Botón reutilizable */}
      <BotonGeneral
          title="Guardar horario"
          onPress={() => router.push("./Perfilvet")}
        />

        <MenuVet />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: "600",
    alignSelf: "flex-start",
    marginLeft: 20,
    marginTop: 10,
    color: "#555",
  },
  scrollDias: {
    marginTop: 10,
    maxHeight: 90,
  },
  cardDia: {
    backgroundColor: "#e3f2fd",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    width: 70,
    height: 70,
  },
  cardDiaSeleccionado: {
    backgroundColor: "#4caf50",
  },
  dia: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  fecha: {
    fontSize: 12,
    color: "#666",
  },
  textoSeleccionado: {
    color: "#fff",
    fontWeight: "bold",
  },
  scrollHoras: {
    marginTop: 10,
    maxHeight: 90,
  },
  cardHora: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    width: 100,
    height: 60,
  },
  cardHoraSeleccionada: {
    backgroundColor: "#4caf50",
  },
  textoHora: {
    fontSize: 16,
    color: "#333",
  },
  textoHoraSeleccionada: {
    color: "#fff",
    fontWeight: "bold",
  },
  
});




