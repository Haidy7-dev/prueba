import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import Encabezado from "../../components/Encabezado";
import MenuDueno from "../../components/MenuDueno";
import ModalOferta from "../../components/ModalOferta";
import TarjetaOferta from "../../components/TarjetaOferta";
import TarjetaVeterinario from "../../components/TarjetaVeterinario";




// Datos fijos de ofertas
const OFERTAS = [
  {
    id: 1,
    titulo: 'Oferta',
    descuento: '50% de descuento',
    descripcion: 'En la pasta para las pulgas',
    beneficio: 'Revisión gratuita incluida 🐾',
    condicion: 'Solo por tiempo limitado',
    imagen: require("../../assets/images/navegacion/oferta.png"),
  },
  {
    id: 2,
    titulo: 'Oferta',
    descuento: '50% de descuento',
    descripcion: 'En la pasta para las pulgas',
    beneficio: 'Revisión gratuita incluida 🐾',
    condicion: 'Solo por tiempo limitado',
    imagen: require("../../assets/images/navegacion/oferta.png"),
  },
  {
    id: 3,
    titulo: 'Oferta',
    descuento: '50% de descuento',
    descripcion: 'En la pasta para las pulgas',
    beneficio: 'Revisión gratuita incluida 🐾',
    condicion: 'Solo por tiempo limitado',
    imagen: require("../../assets/images/navegacion/oferta.png"),
  },
  {
    id: 4,
    titulo: 'Oferta',
    descuento: '50% de descuento',
    descripcion: 'En la pasta para las pulgas',
    beneficio: 'Revisión gratuita incluida 🐾',
    condicion: 'Solo por tiempo limitado',
    imagen: require("../../assets/images/navegacion/oferta.png"),
  },
];

export default function HomeDueno() {
  const [veterinarios, setVeterinarios] = useState([]);
  const [veterinariosFiltrados, setVeterinariosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [ofertaSeleccionada, setOfertaSeleccionada] = useState(null);

  // Obtener veterinarios al cargar el componente
  const getVeterinarios = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        //IP Salomé casa
        // "http://--------:3000/api/veterinarios"
        //IP Salomé datos
        //"http://10.121.63.130:3000/api/veterinarios"

        //IP Haidy casa
        //"http://192.168.1.16:3000/api/veterinariosa"
        //IP Haidy datos
        "http://10.164.93.119:3000/api/veterinarios"

        
      );
      console.log('Veterinarios obtenidos:', response.data);
      setVeterinarios(response.data);
      setVeterinariosFiltrados(response.data);
    } catch (error) {
      console.log("Error al obtener los datos de los veterinarios:", error);
    } finally {
      setLoading(false);
    }
  };

  // Buscar veterinarios
  const buscarVeterinarios = async (texto: string) => {
    setBusqueda(texto);
    
    if (texto.trim() === '') {
      setVeterinariosFiltrados(veterinarios);
      return;
    }

    try {
      const response = await axios.get(
        //IP Salomé casa
        // "http://--------:3000/api/veterinarios/buscar"
        //IP Salomé datos
        //"http://10.121.63.130:3000/api/veterinarios/buscar"

        //IP Haidy casa
        //"http://192.168.1.16:3000/api/veterinarios/buscar"
        //IP Haidy datos
        "http://10.164.93.119:3000/api/veterinarios/buscar"
        
        
        , {
        params: { query: texto }
      });
      console.log('Resultados de búsqueda:', response.data);
      setVeterinariosFiltrados(response.data);
    } catch (error) {
      console.log("Error al buscar veterinarios:", error);
      // Filtrado local como fallback
      const filtrados = veterinarios.filter(vet =>
        vet.nombre.toLowerCase().includes(texto.toLowerCase())
      );
      setVeterinariosFiltrados(filtrados);
    }
  };

  useEffect(() => {
    getVeterinarios();
  }, []);

  const handleOfertaPress = (oferta) => {
    setOfertaSeleccionada(oferta);
    setModalVisible(true);
  };

  const handleVeterinarioPress = (veterinario) => {
    console.log('Ver perfil de:', veterinario.nombre);
    // Aquí puedes navegar al perfil del veterinario
    // navigation.navigate('PerfilVeterinario', { id: veterinario.id_veterinario });
  };

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
          {/* Buscador */}
          <View style={styles.buscadorContainer}>
            <Text style={styles.iconoBuscar}>🔍</Text>
            <TextInput
              style={styles.buscador}
              placeholder="Buscar veterinario"
              value={busqueda}
              onChangeText={buscarVeterinarios}
              placeholderTextColor="#999"
            />
          </View>

          {/* Sección de Ofertas */}
          <Text style={styles.seccionTitulo}>Ofertas</Text>
          <FlatList
            horizontal
            data={OFERTAS}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TarjetaOferta
                oferta={item}
                onPress={() => handleOfertaPress(item)}
              />
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listaOfertas}
          />

          {/* Sección de Veterinarios Recomendados */}
          <Text style={styles.seccionTitulo}>Veterinarios recomendados</Text>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4CAF50" />
              <Text style={styles.loadingText}>Cargando veterinarios...</Text>
            </View>
          ) : veterinariosFiltrados.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {busqueda ? 'No se encontraron veterinarios' : 'No hay veterinarios disponibles'}
              </Text>
            </View>
          ) : (
            <View style={styles.listaVeterinarios}>
              {veterinariosFiltrados.map((veterinario) => (
                <TarjetaVeterinario
                  key={veterinario.id_veterinario}
                  veterinario={veterinario}
                  onPress={() => handleVeterinarioPress(veterinario)}
                />
              ))}
            </View>
          )}
        </ScrollView>

        {/* Modal de Oferta */}
        <ModalOferta
          visible={modalVisible}
          oferta={ofertaSeleccionada}
          onClose={() => setModalVisible(false)}
        />

        <MenuDueno />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contenido: {
    flex: 1,
    paddingHorizontal: 16,
  },
  buscadorContainer: {
    marginTop: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === 'ios' ? 12 : 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  iconoBuscar: {
    fontSize: 18,
    marginRight: 10,
  },
  buscador: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    color: '#333',
  },
  seccionTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 8,
    color: '#333',
  },
  listaOfertas: {
    paddingVertical: 8,
  },
  listaVeterinarios: {
    marginTop: 8,
    marginBottom: 100, // Espacio para el menú inferior
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});