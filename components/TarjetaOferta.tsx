import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
      <View style={{flexDirection: 'row', gap: 5 }}>
        <View style={styles.izquierda}>
          <Text style={styles.descripcion}>{oferta.descripcion}</Text>
          
          <TouchableOpacity style={styles.boton} onPress={onPress}>
            <View style={styles.botonContenido}>
            <Text style={styles.botonTexto}>Ver más</Text>
            <Image
                source={require('../assets/images/navegacion/iconoVerMasBlanco.png')}
                style={styles.iconoVerMas}
              />
            </View>
          </TouchableOpacity>

        </View>
        <View style={styles.derecha}>
          <Image source={oferta.imagen} style={styles.imagen} resizeMode="cover" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    paddingRight: 0,
    paddingBottom: 0,
    marginHorizontal: 8,
    width: 270,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 6,
    overflow: 'hidden',
  },
  descuento: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    textAlign: 'center',
  },
  descripcion: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  imagen: {
    width: '100%',
    height: 100,
    borderRadius: 5,
  },
  boton: {
    backgroundColor: '#479454',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonContenido: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonTexto: {
    color: '#fff',
    fontSize: 14,
    marginRight: 6, // separa el texto del ícono
  },
  iconoVerMas: {
    width: 18,
    height: 18,
    tintColor: '#fff', // mantiene el color blanco del ícono si es PNG transparente
  },
  izquierda: {
    width: '49%',
    paddingBottom: 10
  },
  derecha: {
    width: '49%'
  }
});