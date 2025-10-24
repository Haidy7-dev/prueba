import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface Veterinario {
  id_veterinario: string;
  nombre: string;
  foto: string;
  promedio_calificaciones: float;
  total_resenas: number;
}

interface Props {
  veterinario: Veterinario;
  onPress: () => void;
}

export default function TarjetaVeterinario({ veterinario, onPress }: Props) {
  const renderEstrellas = (promedio: number) => {
    const estrellas = [];
    const promedioRedondeado = Math.round(promedio);
    
    for (let i = 1; i <= 5; i++) {
      estrellas.push(
        <Text key={i} style={styles.estrella}>
          {i <= promedioRedondeado ? '⭐' : '☆'}
        </Text>
      );
    }
    return estrellas;
  };

  const promedio = parseFloat(veterinario.promedio_calificaciones);

  return (
    <View style={styles.card}>
      <Image 
        source={veterinario.foto ? { uri: veterinario.foto } : require('../assets/images/navegacion/foto.png')} 
        style={styles.foto}
      />
      <View style={styles.info}>
        <Text style={styles.nombre} numberOfLines={1}>{veterinario.nombre}</Text>
        <View style={styles.calificacionContainer}>
          <View style={styles.estrellas}>
            {renderEstrellas(promedio)}
          </View>
          <Text style={styles.resenas}>
            ({veterinario.total_resenas} {veterinario.total_resenas === 1 ? 'reseña' : 'reseñas'})
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
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  foto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
    backgroundColor: '#f0f0f0',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  nombre: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  calificacionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  estrellas: {
    flexDirection: 'row',
  },
  estrella: {
    fontSize: 16,
    marginRight: 2,
  },
  resenas: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  boton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  botonTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});