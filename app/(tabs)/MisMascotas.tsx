import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '@/config/api';
import MenuDueno from '@/components/MenuDueno';
import Encabezado from '@/components/Encabezado';

// Define el tipo para una mascota
interface Mascota {
  id: number;
  nombre: string;
  foto: string;
  // Agrega otros campos que necesites
}

// Componente para la tarjeta de una mascota
const PetCard = ({ mascota, onPress }: { mascota: Mascota; onPress: () => void }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Image
      source={mascota.foto ? { uri: `${BASE_URL}/pethub/${mascota.foto}` } : require('../../assets/images/navegacion/foto1.png')}
      style={styles.petImage}
    />
    <Text style={styles.petName}>{mascota.nombre}</Text>
  </TouchableOpacity>
);

export default function MisMascotas() {
  const router = useRouter();
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMascotas = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
          Alert.alert('Error', 'No se pudo obtener el ID del usuario.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${BASE_URL}/api/mascotas/usuario/${userId}`);
        setMascotas(response.data);

      } catch (error) {
        console.error('Error al obtener las mascotas:', error);
        Alert.alert('Error', 'No se pudieron cargar tus mascotas.');
      } finally {
        setLoading(false);
      }
    };

    fetchMascotas();
  }, []);

  const handlePetPress = (id: number) => {
    router.push({ pathname: './PerfilMascota', params: { id: id.toString() } });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#14841C" style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <Encabezado />

      <Text style={styles.title}>Mis Mascotas</Text>

      {mascotas.length > 0 ? (
        <FlatList
          data={mascotas}
          renderItem={({ item }) => <PetCard mascota={item} onPress={() => handlePetPress(item.id)} />}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.list}
        />
      ) : (
        <Text style={styles.noMascotasText}>No tienes mascotas registradas.</Text>
      )}

      <TouchableOpacity style={styles.addButton} onPress={() => router.push('./RegistroMascota')}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <MenuDueno />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  list: {
    paddingHorizontal: 10,
  },
  card: {
    flex: 1,
    margin: 10,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    elevation: 2,
  },
  petImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  petName: {
    fontSize: 16,
    fontWeight: '600',
  },
  noMascotasText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
  addButton: {
    position: 'absolute',
    bottom: 120, // Ajusta según la altura de tu menú
    right: 30,
    backgroundColor: '#14841C',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 30,
    lineHeight: 30,
  },
});
