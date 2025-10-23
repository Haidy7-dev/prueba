import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

interface Oferta {
  id: number;
  titulo: string;
  descuento: string;
  descripcion: string;
  beneficio: string;
  condicion: string;
  imagen: any;
}

interface Props {
  oferta: Oferta;
  onPress: () => void;
}

export default function TarjetaOferta({ oferta, onPress }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.descuento}>{oferta.descuento}</Text>
      <Text style={styles.descripcion}>{oferta.descripcion}</Text>
      <Image source={oferta.imagen} style={styles.imagen} resizeMode="cover" />
      <TouchableOpacity style={styles.boton} onPress={onPress}>
        <Text style={styles.botonTexto}>Ver más</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 8,
    width: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  descuento: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  descripcion: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  imagen: {
    width: '100%',
    height: 80,
    borderRadius: 8,
    marginBottom: 12,
  },
  boton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  botonTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});