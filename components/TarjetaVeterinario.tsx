import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BASE_URL } from '@/config/api';

export interface Veterinario {
  id: string;
  nombre: string;
  foto: string;
  promedio_calificaciones: number;
  total_resenas: number;
  servicios_ofrecidos: string;
}

interface Props {
  veterinario: Veterinario;
  onPress: () => void;
}

export default function TarjetaVeterinario({ veterinario, onPress }: Props) {
  const renderEstrellas = (promedio: number) => {
    const estrellas = [];
    const llenas = Math.floor(promedio);
    const tieneMedia = promedio - llenas >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= llenas) {
        // estrella llena
        estrellas.push(
          <Text key={i} style={[styles.estrella, { color: '#FFD700' }]}>★</Text>
        );
      } else if (i === llenas + 1 && tieneMedia) {
        // media estrella (usamos overlay visual)
        estrellas.push(
          <View key={i} style={styles.mediaEstrellaContainer}>
            <Text style={[styles.estrella, { color: '#FFD700', position: 'absolute', width: '50%', overflow: 'hidden' }]}>★</Text>
            <Text style={[styles.estrella, { color: '#E0E0E0' }]}>★</Text>
          </View>
        );
      } else {
        // estrella vacía (solo borde)
        estrellas.push(
          <Text key={i} style={[styles.estrella, { color: '#E0E0E0' }]}>★</Text>
        );
      }
    }
    return estrellas;
  };

  const promedio = parseFloat(veterinario.promedio_calificaciones?.toString() || '0');

  return (
    <View style={styles.card}>
      <Image
        source={
          veterinario.foto
            ? { uri: `${BASE_URL}/pethub/${veterinario.foto}` }
            : { uri: `${BASE_URL}/pethub/foto.png` }
        }
        style={styles.foto}
        resizeMode="cover"
      />

      <View style={styles.infoContainer}>
        <Text style={styles.nombre}>{veterinario.nombre}</Text>

        <View style={styles.calificacionContainer}>
          <View style={styles.estrellas}>{renderEstrellas(promedio)}</View>
          <Text style={styles.resenas}>
            ({veterinario.total_resenas}{' '}
            {veterinario.total_resenas === 1 ? 'reseña' : 'reseñas'})
          </Text>
        </View>

        <TouchableOpacity style={styles.boton} onPress={onPress}>
          <Text style={styles.botonTexto}>Ver más</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    overflow: 'hidden',
  },
  foto: {
    width: 100,
    height: '100%',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  nombre: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
    marginBottom: 6,
  },
  calificacionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  estrellas: {
    flexDirection: 'row',
  },
  estrella: {
    fontSize: 18,
    marginRight: 2,
  },
  mediaEstrellaContainer: {
    position: 'relative',
  },
  resenas: {
    fontSize: 12,
    color: '#555',
    marginLeft: 8,
  },
  boton: {
    backgroundColor: '#479454',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  botonTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});