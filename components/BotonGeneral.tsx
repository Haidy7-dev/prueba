import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

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
    paddingVertical: 12,
    paddingHorizontal: 75,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
    
    
  
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