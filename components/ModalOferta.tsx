import React from 'react';
import { View, Text, Image, TouchableOpacity, Modal, StyleSheet, ScrollView, Platform } from 'react-native';

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
  visible: boolean;
  oferta: Oferta | null;
  onClose: () => void;
}

export default function ModalOferta({ visible, oferta, onClose }: Props) {
  if (!oferta) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <Text style={styles.titulo}>{oferta.titulo}</Text>
            <Text style={styles.descuentoGrande}>{oferta.descuento}</Text>
            
            <Image source={oferta.imagen} style={styles.imagenGrande} resizeMode="cover" />
            
            <View style={styles.contenido}>
              <Text style={styles.descripcion}>{oferta.descripcion}</Text>
              
              <View style={styles.seccion}>
                <Text style={styles.etiqueta}>✓ Incluye:</Text>
                <Text style={styles.texto}>{oferta.beneficio}</Text>
              </View>
              
              <View style={styles.seccion}>
                <Text style={styles.etiqueta}>⏰ Condición:</Text>
                <Text style={styles.textoCondicion}>{oferta.condicion}</Text>
              </View>
              
              <TouchableOpacity style={styles.botonPerfil} onPress={onClose}>
                <Text style={styles.botonPerfilTexto}>Ver perfil</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  scrollContent: {
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
    textAlign: 'center',
    marginTop: 30,
  },
  descuentoGrande: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  imagenGrande: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginBottom: 16,
  },
  contenido: {
    paddingHorizontal: 8,
  },
  descripcion: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  seccion: {
    marginBottom: 16,
  },
  etiqueta: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  texto: {
    fontSize: 14,
    color: '#666',
  },
  textoCondicion: {
    fontSize: 14,
    color: '#FF5722',
    fontWeight: '500',
  },
  botonPerfil: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  botonPerfilTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});