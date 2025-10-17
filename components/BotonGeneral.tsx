import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity } from 'react-native';

const screenWidth = Dimensions.get('window').width;

interface BotonGeneralProps {
  title: string;
  onPress: () => void;
}

const BotonGeneral: React.FC<BotonGeneralProps> = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#479454',
    paddingVertical: 12, // Altura del botón
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'center', // Centrar el botón horizontalmente
    width: screenWidth * 0.80, // 80% del ancho de la pantalla
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    resizeMode: 'contain'
  },
});

export default BotonGeneral;