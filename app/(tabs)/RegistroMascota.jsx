import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import BotonGeneral from "../../components/BotonGeneral";

export default function RegistroMascota() {
  const [sexo, setSexo] = useState("");
  const [especie, setEspecie] = useState("");
  const [raza, setRaza] = useState("");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Patas decorativas */}
      <Image source={require("../../assets/images/navegacion/patas_superior.png")} style={styles.patasArriba} />

      <Text style={styles.titulo}>Registro</Text>

      {/* Icono central */}
      <MaterialCommunityIcons name="dog" size={50} color="#4CAF50" style={styles.icono} />

      {/* Campo: Nombre */}
      <Text style={styles.label}>Nombre</Text>
      <TextInput style={styles.input} placeholder="" />

      {/* Campo: Sexo */}
      <Text style={styles.label}>Sexo</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={sexo} onValueChange={(value) => setSexo(value)} style={styles.picker}>
          <Picker.Item label="Seleccionar" value="" />
          <Picker.Item label="Macho" value="Macho" />
          <Picker.Item label="Hembra" value="Hembra" />
        </Picker>
      </View>

      {/* Campo: Peso */}
      <Text style={styles.label}>Peso</Text>
      <TextInput style={styles.input} placeholder="" keyboardType="numeric" />

      {/* Campo: Edad */}
      <Text style={styles.label}>Edad</Text>
      <TextInput style={styles.input} placeholder="" keyboardType="numeric" />

      {/* Campo: Especie */}
      <Text style={styles.label}>Especie</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={especie} onValueChange={(value) => setEspecie(value)} style={styles.picker}>
          <Picker.Item label="Seleccionar" value="" />
          <Picker.Item label="Perro" value="Perro" />
          <Picker.Item label="Gato" value="Gato" />
        </Picker>
      </View>

      {/* Campo: Raza */}
      <Text style={styles.label}>Raza</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={raza} onValueChange={(value) => setRaza(value)} style={styles.picker}>
          <Picker.Item label="Seleccionar" value="" />
          <Picker.Item label="Labrador" value="Labrador" />
          <Picker.Item label="Bulldog" value="Bulldog" />
          <Picker.Item label="Siames" value="Siames" />
        </Picker>
      </View>

      {/* Botón guardar */}
      <View style={{ marginTop: 25 }}>
        <BotonGeneral title="Guardar" onPress={() => {}} />
      </View>

      {/* Patas decorativas inferior */}
      <Image source={require("../../assets/images/navegacion/patas_inferior.png")} style={styles.patasAbajo} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#FFFFFF",
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  icono: {
    marginBottom: 15,
  },
  label: {
    alignSelf: "flex-start",
    marginLeft: "10%",
    marginTop: 10,
    fontSize: 14,
    color: "#000000",
  },
  input: {
    width: "80%",
    height: 40,
    borderWidth: 2,
    borderColor: "#4CAF50",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  pickerContainer: {
    width: "80%",
    height: 40,
    borderWidth: 2,
    borderColor: "#4CAF50",
    borderRadius: 8,
    justifyContent: "center",
    marginTop: 5,
  },
  picker: {
    height: 40,
    width: "100%",
  },
  patasArriba: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    position: "absolute",
    top: 0,
    left: 0,
  },
  patasAbajo: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    position: "absolute",
    bottom: 0,
    right: 0,
  },
});


