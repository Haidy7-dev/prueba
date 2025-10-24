import { Ionicons } from '@expo/vector-icons';
import { Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { useRouter } from "expo-router";
import React, { useState } from "react";

import BotonGeneral from "../../components/BotonGeneral";

const screenWidth = Dimensions.get('window').width;

export default function Registro() {
  const [mascotas, setMascotas] = useState(1);
  const router = useRouter();

  const Incremento = () => {
    setMascotas(prevMascotas => prevMascotas + 1);
  };

  const Decremento = () => {
    if (mascotas > 1) {
      setMascotas(prevMascotas => prevMascotas - 1);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registro</Text>

      <TextInput placeholder="Identificación" style={styles.input} />
      <TextInput placeholder="Primer nombre" style={styles.input} />
      <TextInput placeholder="Segundo nombre" style={styles.input} />
      <TextInput placeholder="Primer apellido" style={styles.input} />
      <TextInput placeholder="Segundo apellido" style={styles.input} />
      <TextInput placeholder="Correo electrónico" style={styles.input} keyboardType="email-address" />
      <TextInput placeholder="Dirección de residencia" style={styles.input} />
      <TextInput placeholder="Teléfono" style={styles.input} keyboardType="phone-pad" />

      <View style={styles.stepperContainer}>
        <Text style={styles.stepperLabel}>Número de mascotas</Text>
        <View style={styles.stepperControl}>
          <TouchableOpacity onPress={Decremento}>
            <Ionicons name="chevron-down-outline" size={28} color="#4CAF50" />
          </TouchableOpacity>
          
          <Text style={styles.stepperValue}>{mascotas}</Text>
          
          <TouchableOpacity onPress={Incremento}>
            <Ionicons name="chevron-up-outline" size={28} color="#4CAF50" />
          </TouchableOpacity>
        </View>
      </View>

      <TextInput
        placeholder="Contraseña"
        style={styles.input}
        secureTextEntry
      />
      
      <BotonGeneral
        title="Guardar"
        onPress={() => router.push("/HomeDueno")}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0000", 
    marginBottom: 20,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderRadius: 8,
    padding: 12,
    width: "90%",
    marginBottom: 12,
    fontSize: 16,
    minHeight: 50,
  },
  stepperContainer: {
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderRadius: 8,
    width: "90%",
    marginBottom: 12,
    minHeight: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  stepperLabel: {
    fontSize: 16,
    color: '#555',
  },
  stepperControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepperValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginHorizontal: 10,
    minWidth: 20,
    textAlign: 'center',
  },
});