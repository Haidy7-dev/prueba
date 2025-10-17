import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import BotonGeneral from "../../components/BotonGeneral";

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Huellita arriba izquierda */}
      <Image
        source={require("../../assets/images/navegacion/patas_superior.png")}
        style={styles.ImagenSuperior}
      />

      {/* Huellita abajo derecha */}
      <Image
        source={require("../../assets/images/navegacion/patas_inferior.png")}
        style={styles.ImagenInferior}
      />

      {/* Contenedor de card + perritos */}
      <View style={styles.cardContainer}>
        {/* Perritos arriba del cuadro */}
        <Image
          source={require("../../assets/images/navegacion/perritos.png")}
          style={styles.ImagenPerritos}
        />

        {/* Card central */}
        <View style={styles.card}>
          <Image
            source={require("../../assets/images/navegacion/pata_centro.png")}
            style={styles.ImagenPatita}
          />
          <Text style={styles.texto}>
            ¡Bienvenido a <Text style={styles.negrilla}>Patas sin Barreras!</Text>
          </Text>
          <Text style={styles.texto}>
            Porque cuidar a tu mascota nunca fue tan fácil.
          </Text>
          <Text style={styles.texto}>¡Empieza a agendar hoy mismo!</Text>
        </View>
      </View>

      {/* Botón continuar */}
      <View style={styles.botonContainer}>
        <BotonGeneral
          title="Continuar"
          onPress={() => router.push("./Iniciarsesion1")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#fff" 
  },
  cardContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  card: { 
    width: "85%", 
    borderWidth: 2, 
    borderColor: "green", 
    borderRadius: 15, 
    padding: 20, 
    alignItems: "center", 
    marginTop: 40, // deja espacio para que los perritos no se solapen
    backgroundColor: "#fff"
  },
  ImagenPerritos: { 
    width: 380, 
    height: 100, 
    position: "absolute", 
    top: -50, // hace que los perritos queden sobre el cuadro
    zIndex: 1 ,
    resizeMode: "contain"
  },
  ImagenPatita: { 
    width: 40, 
    height: 40, 
    marginBottom: 10 
  },
  texto: { 
    fontSize: 16, 
    textAlign: "center", 
    marginBottom: 5 
  },
  negrilla: { 
    fontWeight: "bold" 
  },
  botonContainer: { 
    marginTop: 20, 
    alignSelf: "center" 
  },
  ImagenSuperior: { 
    position: "absolute", 
    top: 20, 
    left: 20, 
    width: 80, 
    height: 80, 
    resizeMode: "contain"
  },
  ImagenInferior: { 
    position: "absolute", 
    bottom: 20, 
    right: 20, 
    width: 80, 
    height: 80,
    resizeMode: "contain"
  }
});
