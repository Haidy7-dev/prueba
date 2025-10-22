import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TextInput, FlatList } from "react-native";
import Encabezado from "../../components/Encabezado";
import MenuDueno from "../../components/MenuDueno";
import TarjetaVeterinario from "../../components/TarjetaVeterinario";
import TarjetaOferta from "../../components/TarjetaOferta";
//import api from "../../services/api";

export default function HomeDueno() {
  const [veterinarios, setVeterinarios] = useState([]);
  const [ofertas, setOfertas] = useState([]);

  useEffect(() => {
    // Obtener datos del backend
    const fetchData = async () => {
      try {
        const resVets = await api.get("/api/veterinarios");
        //const resOfertas = await api.get("/api/ofertas");
        setVeterinarios(resVets.data);
        setOfertas(resOfertas.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Encabezado />

      <ScrollView contentContainerStyle={styles.scroll}>
        <TextInput
          style={styles.searchBar}
          placeholder="Buscar veterinario"
          placeholderTextColor="#777"
        />

        <Text style={styles.sectionTitle}>Ofertas</Text>
        <FlatList
          horizontal
          data={ofertas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TarjetaOferta
              titulo={item.titulo}
              descripcion={item.descripcion}
              imagen={item.imagen}
            />
          )}
          showsHorizontalScrollIndicator={false}
        />

        <Text style={styles.sectionTitle}>Veterinarios recomendados</Text>
        {veterinarios.map((vet) => (
          <TarjetaVeterinario
            key={vet.id_veterinario}
            nombre={vet.nombre}
            imagen={vet.foto}
            calificacion={vet.calificacion || 0}
            resenas={vet.resenas || 0}
            onPress={() => console.log("Ver más de", vet.nombre)}
          />
        ))}
      </ScrollView>

      <MenuDueno />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scroll: {
    paddingBottom: 100,
    paddingHorizontal: 15,
  },
  searchBar: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginVertical: 10,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
    marginVertical: 10,
  },
});
