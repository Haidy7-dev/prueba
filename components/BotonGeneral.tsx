import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';

const screenWidth = Dimensions.get('window').width;

interface BotonGeneralProps {
  title: string;
  onPress: () => void;
  disabled?: boolean; // 🟢 nuevo prop opcional
  loading?: boolean;  // 🟢 nuevo prop opcional
}

const BotonGeneral: React.FC<BotonGeneralProps> = ({ title, onPress, disabled = false, loading = false }) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled]}
      onPress={!disabled ? onPress : undefined}
      disabled={disabled}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#479454',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'center',
    width: screenWidth * 0.8,
  },
  disabled: {
    backgroundColor: '#393b39ff', 
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default BotonGeneral;
