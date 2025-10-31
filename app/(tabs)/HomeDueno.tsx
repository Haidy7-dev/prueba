import { BASE_URL } from "@/config/api";
import { EvilIcons } from "@expo/vector-icons";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Encabezado from "../../components/Encabezado";
import MenuDueno from "../../components/MenuDueno";
import ModalOferta from "../../components/ModalOferta";
import TarjetaOferta from "../../components/TarjetaOferta";
import TarjetaVeterinario, { Veterinario } from "../../components/TarjetaVeterinario";


const OFERTAS = [
  {
    id: 1,
    id_veterinario: 1002234684, 
    titulo: "Oferta",
    descuento: "50% de descuento",
    descripcion: "En la pasta para las pulgas",
    beneficio: "Revisión gratuita incluida 🐾",
    condicion: "Solo por tiempo limitado",
    imagen: require("../../assets/images/navegacion/oferta.png"),
  },
  {
    id: 2,
    id_veterinario: 1002234684, 
    titulo: "Oferta",
    descuento: "50% de descuento",
    descripcion: "En la pasta para las pulgas",
    beneficio: "Revisión gratuita incluida 🐾",
    condicion: "Solo por tiempo limitado",
    imagen: require("../../assets/images/navegacion/oferta.png"),
  },
  {
    id: 3,
    id_veterinario: 1002234684, 
    titulo: "Oferta",
    descuento: "50% de descuento",
    descripcion: "En la pasta para las pulgas",
    beneficio: "Revisión gratuita incluida 🐾",
    condicion: "Solo por tiempo limitado",
    imagen: require("../../assets/images/navegacion/oferta.png"),
  },
  {
    id: 4,
    id_veterinario: 1002234684, 
    titulo: "Oferta",
    descuento: "50% de descuento",
    descripcion: "En la pasta para las pulgas",
    beneficio: "Revisión gratuita incluida 🐾",
    condicion: "Solo por tiempo limitado",
    imagen: require("../../assets/images/navegacion/oferta.png"),
  },
];

export default function HomeDueno() {
  // 🔹 Estados
  const [veterinarios, setVeterinarios] = useState<Veterinario[]>([]);
  const [veterinariosFiltrados, setVeterinariosFiltrados] = useState<Veterinario[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [ofertaSeleccionada, setOfertaSeleccionada] = useState<any>(null);



  const router = useRouter();

  // 🟢 Obtener veterinarios al cargar
  const getVeterinarios = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/veterinarios`);
      console.log("Veterinarios obtenidos:", response.data);
      setVeterinarios(response.data);
      setVeterinariosFiltrados(response.data);
    } catch (error) {
      console.log("Error al obtener los datos de los veterinarios:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🟢 Buscar veterinarios
  const buscarVeterinarios = async (texto: string) => {
    setBusqueda(texto);

    if (texto.trim() === "") {
      setVeterinariosFiltrados(veterinarios);
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/api/veterinarios/buscar`, {
        params: { query: texto },
      });
      console.log("Resultados de búsqueda:", response.data);
      setVeterinariosFiltrados(response.data);
    } catch (error) {
      console.log("Error al buscar veterinarios:", error);

      // 🔸 Filtro local como respaldo
      const filtrados = veterinarios.filter((vet: Veterinario) =>
        vet.nombre.toLowerCase().includes(texto.toLowerCase())
      );
      setVeterinariosFiltrados(filtrados);
    }
  };

  // 🟢 Ejecutar al montar
  useEffect(() => {
    getVeterinarios();
  }, []);

  // 🟢 Handlers
  const handleOfertaPress = (oferta: any) => {
    setOfertaSeleccionada(oferta);
    setModalVisible(true);
  };

  // 🔸 Cuando se presione “Ver perfil” dentro del modal
  const handleVerPerfilOferta = (oferta: any) => {
    if (oferta?.id_veterinario) {
      router.push({
        pathname: "./VerVeterinario",
        params: { id: oferta.id_veterinario },
      });
      setModalVisible(false);
    } else {
      console.log("⚠️ Esta oferta no tiene un id_veterinario asignado");
    }
  };

  const handleVeterinarioPress = (veterinario: Veterinario) => {
    router.push({
      pathname: "./VerVeterinario",
      params: { id: veterinario.id },
    });
  };



  // 🟢 Render
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        <Encabezado />

        <ScrollView
          style={styles.contenido}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* 🔍 Buscador */}
          <View style={styles.buscadorContainer}>
            <EvilIcons name="search" style={styles.iconoBuscar} />
            <TextInput
              style={styles.buscador}
              value={busqueda}
              onChangeText={buscarVeterinarios}
            />
          </View>

          {/* 🎁 Sección de Ofertas */}
          <Text style={styles.seccionTitulo}>Ofertas</Text>
          <FlatList
            horizontal
            data={OFERTAS}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TarjetaOferta oferta={item} onPress={() => handleOfertaPress(item)} />
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listaOfertas}
          />

          {/* 🧑‍⚕️ Veterinarios recomendados */}
          <Text style={styles.seccionTitulo}>Veterinarios recomendados</Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#479454" />
              <Text style={styles.loadingText}>Cargando veterinarios...</Text>
            </View>
          ) : veterinariosFiltrados.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {busqueda
                  ? "No se encontraron veterinarios"
                  : "No hay veterinarios disponibles"}
              </Text>
            </View>
          ) : (
            <View style={styles.listaVeterinarios}>
              {veterinariosFiltrados.map((veterinario) => (
                <TarjetaVeterinario
                  key={veterinario.id}
                  veterinario={veterinario}
                  onPress={() => handleVeterinarioPress(veterinario)}
                />
              ))}
            </View>
          )}


        </ScrollView>

        {/* 🟢 Modal de oferta */}
        <ModalOferta
          visible={modalVisible}
          oferta={ofertaSeleccionada}
          onClose={() => setModalVisible(false)}
          onVerPerfil={handleVerPerfilOferta} // 👈 se agrega esta prop
        />



        <MenuDueno />
      </View>
    </SafeAreaView>
  );
}

// 🎨 ESTILOS
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contenido: {
    flex: 1,
    paddingHorizontal: 16,
  },
  buscadorContainer: {
    marginTop: 16,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === "ios" ? 12 : 4,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  iconoBuscar: {
    fontSize: 30,
    marginRight: 10,
    color: "#000000",
  },
  buscador: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    color: "#333",
  },
  seccionTitulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    marginTop: 8,
    color: "#000",
  },
  listaOfertas: {
    paddingVertical: 8,
  },
  listaVeterinarios: {
    marginTop: 8,
    marginBottom: 100,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },

});
