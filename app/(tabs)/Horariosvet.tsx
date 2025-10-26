import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
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

  const diasSemana = [
    { nombre: "Lun", valor: "Lunes" },
    { nombre: "Mar", valor: "Martes" },
    { nombre: "Mié", valor: "Miércoles" },
    { nombre: "Jue", valor: "Jueves" },
    { nombre: "Vie", valor: "Viernes" },
    { nombre: "Sáb", valor: "Sábado" },
    { nombre: "Dom", valor: "Domingo" },
  ];

  // 🔹 Estado para manejar bloques por día
  const [horariosPorDia, setHorariosPorDia] = useState<Record<string, { inicio: string | null; fin: string | null }[]>>({});
  const [cargando, setCargando] = useState(false);

  // 🔹 Horas AM para inicio
  const horasAM: string[] = [];
  for (let h = 6; h < 12; h++) {
    horasAM.push(`${h}:00`);
    horasAM.push(`${h}:30`);
  }

  // 🔹 Horas PM para finalización
  const horasPM: string[] = [];
  for (let h = 12; h <= 23; h++) {
    horasPM.push(`${h}:00`);
    horasPM.push(`${h}:30`);
  }

  // 🔹 Cargar horarios desde backend
  useEffect(() => {
    const cargarHorarios = async () => {
      try {
        setCargando(true);
        const res = await axios.get("http://192.168.101.73:3000/api/horarios");
        const data = res.data;

        const agrupado: Record<string, { inicio: string; fin: string }[]> = {};
        data.forEach((item: any) => {
          if (!agrupado[item.dia_semana]) agrupado[item.dia_semana] = [];
          agrupado[item.dia_semana].push({
            inicio: item.hora_inicio.slice(0, 5),
            fin: item.hora_finalizacion.slice(0, 5),
          });
        });
        setHorariosPorDia(agrupado);
      } catch (error) {
        console.error("Error cargando horarios:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarHorarios();
  }, []);

  // 🔹 Agregar bloque horario a un día
  const agregarBloque = (dia: string) => {
    setHorariosPorDia((prev) => ({
      ...prev,
      [dia]: [...(prev[dia] || []), { inicio: null, fin: null }],
    }));
  };

  // 🔹 Seleccionar hora dentro de un bloque
  const setHora = (dia: string, index: number, tipo: "inicio" | "fin", hora: string) => {
    setHorariosPorDia((prev) => {
      const nuevoDia = [...(prev[dia] || [])];
      nuevoDia[index][tipo] = hora;
      return { ...prev, [dia]: nuevoDia };
    });
  };

  // 🔹 Guardar todos los bloques seleccionados
  const guardarHorario = async () => {
    const diasSeleccionados = Object.keys(horariosPorDia);
    if (diasSeleccionados.length === 0) {
      Alert.alert("Selecciona al menos un día");
      return;
    }

    try {
      setCargando(true);
      await axios.delete("http://192.168.101.73:3000/api/horarios"); // limpia antes de guardar (opcional)

      for (const dia of diasSeleccionados) {
        for (const bloque of horariosPorDia[dia]) {
          if (!bloque.inicio || !bloque.fin) continue;
          const data = {
            dia_semana: dia,
            hora_inicio: bloque.inicio + ":00",
            hora_finalizacion: bloque.fin + ":00",
          };
          await axios.post("http://192.168.101.73:3000/api/horarios", data);
        }
      }

      Alert.alert("Éxito", "Horarios actualizados correctamente.");
      router.push("./Perfilvet");
    } catch (error) {
      console.error("Error al guardar horario:", error);
      Alert.alert("Error", "No se pudo guardar el horario en la base de datos.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.titulo}>Selecciona tu horario de trabajo</Text>
        <Text style={styles.introduccion}>
          Puedes configurar varios bloques por día (por ejemplo: 8:00 am – 12:00 pm y 2:00 pm – 6:00 pm).
        </Text>

        {diasSemana.map((dia) => (
          <View key={dia.valor} style={styles.cardDia}>
            <Text style={styles.subtitulo}>{dia.valor}</Text>

            {(horariosPorDia[dia.valor] || []).map((bloque, index) => (
              <View key={index} style={styles.bloqueContainer}>
                <Text style={styles.label}>Inicio (AM):</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {horasAM.map((hora) => (
                    <TouchableOpacity
                      key={`inicio-${dia.valor}-${index}-${hora}`}
                      style={[
                        styles.horaCard,
                        bloque.inicio === hora && styles.horaSeleccionada,
                      ]}
                      onPress={() => setHora(dia.valor, index, "inicio", hora)}
                    >
                      <Text
                        style={[
                          styles.horaTexto,
                          bloque.inicio === hora && styles.textoSeleccionado,
                        ]}
                      >
                        {moment(hora, "H:mm").format("hh:mm A")}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <Text style={styles.label}>Fin (PM):</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {horasPM.map((hora) => (
                    <TouchableOpacity
                      key={`fin-${dia.valor}-${index}-${hora}`}
                      style={[
                        styles.horaCard,
                        bloque.fin === hora && styles.horaSeleccionada,
                      ]}
                      onPress={() => setHora(dia.valor, index, "fin", hora)}
                    >
                      <Text
                        style={[
                          styles.horaTexto,
                          bloque.fin === hora && styles.textoSeleccionado,
                        ]}
                      >
                        {moment(hora, "H:mm").format("hh:mm A")}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            ))}

            <TouchableOpacity
              style={styles.botonAgregar}
              onPress={() => agregarBloque(dia.valor)}
            >
              <Text style={styles.textoAgregar}>+ Agregar bloque</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={{ marginTop: 40, marginBottom: 100 }}>
          <BotonGeneral
            title={cargando ? "Guardando..." : "Guardar horario"}
            onPress={guardarHorario}
          />
        </View>
      </ScrollView>

      <MenuVet />
    </KeyboardAvoidingView>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  scrollContainer: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 40,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
    textAlign: "center",
  },
  introduccion: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    marginHorizontal: 25,
    marginBottom: 20,
  },
  cardDia: {
    width: "90%",
    backgroundColor: "#f0f9f1",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: "700",
    color: "#14841C",
    marginBottom: 10,
  },
  bloqueContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
    fontWeight: "600",
  },
  horaCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    width: 90,
    height: 50,
  },
  horaSeleccionada: {
    backgroundColor: "#14841C",
  },
  horaTexto: {
    fontSize: 15,
    color: "#333",
  },
  textoSeleccionado: {
    color: "#fff",
    fontWeight: "bold",
  },
  botonAgregar: {
    alignSelf: "flex-end",
    marginTop: 5,
  },
  textoAgregar: {
    color: "#14841C",
    fontWeight: "600",
    fontSize: 14,
  },
});







