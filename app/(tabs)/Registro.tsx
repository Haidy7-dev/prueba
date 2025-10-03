import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View, } from "react-native";
import BotonGeneral from "../../components/BotonGeneral"; // 👈 importa tu botón


export default function Registro() {
  const [mascotas, setMascotas] = useState("1");
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registro</Text>

      <TextInput placeholder="Identificación" style={styles.input} />
      <TextInput placeholder="Primer nombre" style={styles.input} />
      <TextInput placeholder="Segundo nombre" style={styles.input} />
      <TextInput placeholder="Primer apellido" style={styles.input} />
      <TextInput placeholder="Segundo apellido" style={styles.input} />
      <TextInput
        placeholder="Correo electrónico"
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput placeholder="Dirección de residencia" style={styles.input} />
      <TextInput
        placeholder="Teléfono"
        style={styles.input}
        keyboardType="phone-pad"
      />

      {/* Selector número de mascotas */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={mascotas}
          onValueChange={(itemValue) => setMascotas(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="1" value="1" />
          <Picker.Item label="2" value="2" />
          <Picker.Item label="3" value="3" />
          <Picker.Item label="4" value="4" />
          <Picker.Item label="5 o más" value="5" />
        </Picker>
      </View>

      <TextInput
        placeholder="Contraseña"
        style={styles.input}
        secureTextEntry
      />

      {/* Botón reutilizable */}
      <BotonGeneral
        title="Guardar"
        onPress={() => router.push("/Iniciarsesion1")}
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
  },
  input: {
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderRadius: 8,
    padding: 12,
    width: "100%",
    marginBottom: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderRadius: 8,
    width: "100%",
    marginBottom: 12,
  },
  picker: {
    height: 50,
    width: "100%",
  },
});
