import BotonGeneral from "@/components/BotonGeneral";
import MenuVet from "@/components/MenuVet";
import ResumenCitaCard from "@/components/ResumenCitaCard";
import { BASE_URL } from "@/config/api";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, } from "react-native";

export default function PerfilVeterinario() {
  const router = useRouter();

  const [idVet, setIdVet] = useState<string | null>(null);
  const [primerNombre, setPrimerNombre] = useState("");
  const [segundoNombre, setSegundoNombre] = useState("");
  const [primerApellido, setPrimerApellido] = useState("");
  const [segundoApellido, setSegundoApellido] = useState("");
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [especializacion, setEspecializacion] = useState("");
  const [informacion, setInformacion] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);
  const [especializaciones, setEspecializaciones] = useState([]);
  const [servicios, setServicios] = useState<any[]>([]);
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState<any[]>([]);
  const [serviciosList, setServiciosList] = useState<any[]>([]);

  // ✅ Cargar veterinario desde backend
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const id = await AsyncStorage.getItem("userId");
        if (!id) return;

        setIdVet(id);

        const res = await axios.get(`${BASE_URL}/api/veterinarios/detalle/${id}`);
        const { vet, especializaciones: vetEspecializaciones } = res.data;

        setPrimerNombre(vet.primer_nombre || "");
        setSegundoNombre(vet.segundo_nombre || "");
        setPrimerApellido(vet.primer_apellido || "");
        setSegundoApellido(vet.segundo_apellido || "");
        setNombres(`${vet.primer_nombre || ""} ${vet.segundo_nombre || ""}`.trim());
        setApellidos(`${vet.primer_apellido || ""} ${vet.segundo_apellido || ""}`.trim());
        setCorreo(vet.correo_electronico || "");
        setTelefono(vet.telefono || "");
        setInformacion(vet.descripcion_de_perfil || "");
        if (vet.foto) {
          if (vet.foto.startsWith('http') || vet.foto.startsWith('file')) {
            setFotoPerfil(vet.foto);
          } else {
            setFotoPerfil(`${BASE_URL}/pethub/${vet.foto}`);
          }
        } else {
          setFotoPerfil(null);
        }

        if (vetEspecializaciones.length > 0) {
          setEspecializacion(vetEspecializaciones[0].nombre);
        }
      } catch (error: any) {
        console.error("Error al cargar perfil:", error);
        Alert.alert("Error", "No se pudo cargar el perfil del veterinario.");
      }
    };
    cargarDatos();
  }, []);



  // ✅ Cargar lista de especializaciones
  useEffect(() => {
    const getEspecializaciones = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/especializaciones`);
        setEspecializaciones(response.data);
      } catch (error) {
        console.log("Error al obtener especializaciones:", error);
      }
    };
    getEspecializaciones();
  }, []);

  // ✅ Cargar lista de servicios
  useEffect(() => {
    const getServicios = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/servicio`);
        setServiciosList(response.data);
      } catch (error) {
        console.log("Error al obtener servicios:", error);
      }
    };
    getServicios();
  }, []);

  // ✅ Cargar servicios del veterinario
  useEffect(() => {
    if (idVet) {
      const cargarServiciosVet = async () => {
        try {
          const resp = await axios.get(`${BASE_URL}/api/veterinarios/detalle/${idVet}`);
          setServicios(resp.data.servicios || []);
          setServiciosSeleccionados(resp.data.servicios || []);
        } catch (error) {
          console.error("Error al cargar servicios del veterinario:", error);
        }
      };
      cargarServiciosVet();
    }
  }, [idVet]);

  // ✅ Guardar perfil
  const manejarGuardar = async () => {
    if (!idVet) return Alert.alert("Error", "No se pudo identificar al veterinario.");

    try {
      let fotoFilename = null;
      if (fotoPerfil) {
        fotoFilename = fotoPerfil.split('/').pop();
      }

      await axios.put(`${BASE_URL}/api/veterinarios/${idVet}`, {
        primer_nombre: primerNombre,
        segundo_nombre: segundoNombre,
        primer_apellido: primerApellido,
        segundo_apellido: segundoApellido,
        correo_electronico: correo,
        telefono,
        especializacion,
        informacion,
        foto: fotoFilename,
        servicios: serviciosSeleccionados,
      });

      Alert.alert("Éxito", "Perfil actualizado correctamente.");
    } catch (error) {
      console.error("Error al guardar perfil:", error);
      Alert.alert("Error", "No se pudo guardar la información.");
    }
  };

  const irAHorarios = () => router.push("/Horariosvet");

  const seleccionarImagen = async () => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permiso.granted) {
      Alert.alert("Permiso denegado", "Debes permitir el acceso a tus fotos.");
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!resultado.canceled) {
      const uri = resultado.assets[0].uri;

      if (idVet) {
        const formData = new FormData();
      const fileName = uri.split('/').pop() || 'foto.jpg';
      const fileType = fileName.split('.').pop() || 'jpg';

      formData.append('foto', {
        uri,
        name: fileName,
        type: `image/${fileType}`,
      } as any);

        try {
          const response = await axios.post(`${BASE_URL}/upload/veterinario/${idVet}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          // The backend returns the filename, so we can update the state with the full URL
          setFotoPerfil(`${BASE_URL}/pethub/${response.data.ruta}`);
          Alert.alert("Éxito", "Foto de perfil actualizada.");
        } catch (error) {
          console.error("Error al subir la foto:", error);
          Alert.alert("Error", "No se pudo subir la foto de perfil.");
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/navegacion/Pata.png")}
          style={styles.logo}
        />
        <TouchableOpacity onPress={() => router.push("/")}>
          <Image
            source={require("../../assets/images/navegacion/iconosalir.png")}
            style={styles.iconSalir}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileImageContainer}>
          <Image
            source={
              fotoPerfil
                ? { uri: fotoPerfil }
                : require("../../assets/images/navegacion/foto.png")
            }
            style={styles.profileImage}
          />
          <TouchableOpacity
            style={styles.editIconContainer}
            onPress={seleccionarImagen}
          >
            <Feather name="edit-3" size={18} color="#000" />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Editar perfil</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombres"
          value={nombres}
          onChangeText={(text) => {
            setNombres(text);
            const parts = text.split(" ");
            setPrimerNombre(parts[0] || "");
            setSegundoNombre(parts.slice(1).join(" ") || "");
          }}
        />
        <TextInput
          style={styles.input}
          placeholder="Apellidos"
          value={apellidos}
          onChangeText={(text) => {
            setApellidos(text);
            const parts = text.split(" ");
            setPrimerApellido(parts[0] || "");
            setSegundoApellido(parts.slice(1).join(" ") || "");
          }}
        />
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          value={correo}
          onChangeText={setCorreo}
        />
        <TextInput
          style={styles.input}
          placeholder="Teléfono"
          value={telefono}
          onChangeText={setTelefono}
        />

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={especializacion}
            onValueChange={(val) => setEspecializacion(val)}
          >
            <Picker.Item label="Seleccione su especialización" value="" />
            {especializaciones.map((esp: any) => (
              <Picker.Item key={esp.id} label={esp.nombre} value={esp.nombre} />
            ))}
          </Picker>
        </View>

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Mi información..."
          value={informacion}
          onChangeText={setInformacion}
          multiline
        />

        <Text style={styles.sectionTitle}>Servicios que ofreces:</Text>
        {serviciosList.map((serv) => {
          const isSelected = serviciosSeleccionados.some((s: any) => s.id === serv.id);
          const selectedServicio = serviciosSeleccionados.find((s: any) => s.id === serv.id);
          return (
            <View key={serv.id} style={styles.servicioContainer}>
              <TouchableOpacity
                style={[
                  styles.checkboxContainer,
                  isSelected && styles.checkboxSelected,
                ]}
                onPress={() => {
                  if (isSelected) {
                    setServiciosSeleccionados((prev) =>
                      prev.filter((s: any) => s.id !== serv.id)
                    );
                  } else {
                    setServiciosSeleccionados((prev) => [
                      ...prev,
                      { id: serv.id, precio: "" },
                    ]);
                  }
                }}
              >
                <Text style={styles.checkboxText}>{serv.nombre}</Text>
              </TouchableOpacity>
              {isSelected && (
                <TextInput
                  placeholder="Precio"
                  style={styles.inputPrecio}
                  keyboardType="numeric"
                  value={selectedServicio?.precio?.toString() || ""}
                  onChangeText={(text) => {
                    setServiciosSeleccionados((prev) =>
                      prev.map((s: any) =>
                        s.id === serv.id ? { ...s, precio: text } : s
                      )
                    );
                  }}
                />
              )}
            </View>
          );
        })}



        <View style={styles.botonesContainer}>
          <BotonGeneral title="Guardar" onPress={manejarGuardar} />
          <Text style={styles.infoText}>
            ¡Ya casi terminas! Guarda tu info y organiza tus horarios.
          </Text>
          <BotonGeneral title="Ir a horarios" onPress={irAHorarios} />
        </View>
      </ScrollView>

      <MenuVet />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 40 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  logo: { width: 40, height: 40 },
  iconSalir: { width: 30, height: 30 },
  content: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 25,
    paddingBottom: 100,
  },
  profileImageContainer: { position: "relative", alignItems: "center" },
  profileImage: { width: 130, height: 130, borderRadius: 70, backgroundColor: "#E0E0E0" },
  editIconContainer: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 6,
    borderWidth: 1,
    borderColor: "#000",
  },
  title: { fontSize: 18, fontWeight: "bold", alignSelf: "flex-start", marginLeft: 25 },
  input: {
    borderWidth: 1,
    borderColor: "green",
    borderRadius: 8,
    padding: 10,
    width: "100%",
    marginBottom: 12,
    fontSize: 14,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "green",
    borderRadius: 8,
    width: "100%",
    marginBottom: 12,
  },
  textArea: { height: 80, textAlignVertical: "top" },
  botonesContainer: { width: "100%", alignItems: "center", marginTop: 10 },
  infoText: {
    textAlign: "center",
    color: "#444",
    fontSize: 13,
    marginVertical: 12,
    fontStyle: "italic",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
    width: "90%",
    textAlign: "left",
  },
  servicioContainer: {
    width: "90%",
    marginBottom: 12,
  },
  checkboxContainer: {
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderRadius: 8,
    padding: 12,
    width: "100%",
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  checkboxSelected: {
    backgroundColor: "#E8F5E8",
    borderColor: "#4CAF50",
  },
  checkboxText: {
    fontSize: 16,
    color: "#000",
  },
  inputPrecio: {
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderRadius: 8,
    padding: 12,
    width: "100%",
    marginTop: 8,
    minHeight: 50,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginVertical: 20,
  },
  noCitasText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginVertical: 20,
  },
});
