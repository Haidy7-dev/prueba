import React from "react";
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";

interface Oferta {
  id: number;
  idVeterinario: number; // 👈 nuevo campo
  titulo: string;
  descuento: string;
  descripcion: string;
  beneficio: string;
  condicion: string;
  imagen: any;
}

interface ModalOfertaProps {
  visible: boolean;
  oferta: Oferta | null;
  onClose: () => void;
  onVerPerfil?: (oferta?: Oferta) => void;
}

export default function ModalOferta({
  visible,
  oferta,
  onClose,
  onVerPerfil,
}: ModalOfertaProps) {
  if (!oferta) return null;

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <BlurView intensity={80} tint="light" style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.cuadroVerde}>
            <TouchableOpacity onPress={onClose} style={styles.iconoCerrar}>
              <Feather name="x" size={28} color="#000" />
            </TouchableOpacity>

            <Text style={styles.titulo}>Oferta</Text>

            <View style={styles.cuadroNegro}>
              <View style={styles.superior}>
                <Text style={styles.descuento}>{oferta.descuento}</Text>
                <Text style={styles.descripcion}>{oferta.descripcion}</Text>
                <Text style={styles.textoNormal}>
                  ¡Conoce al veterinario de la oferta!
                </Text>
                <Text style={styles.textoNegrita}>{oferta.beneficio}</Text>
                <Text style={[styles.textoNormal, { marginTop: 6 }]}>
                  {oferta.condicion}
                </Text>
              </View>

              <View style={styles.inferior}>
                <View style={styles.izquierda}>
                  <TouchableOpacity
                    style={styles.boton}
                    onPress={() => onVerPerfil?.(oferta)}
                  >
                    <View style={styles.botonContenido}>
                      <Text style={styles.botonTexto}>Ver perfil</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={styles.derecha}>
                  <Image
                    source={oferta.imagen}
                    style={styles.imagen}
                    resizeMode="cover"
                  />
                </View>
              </View>
            </View>


          </View>
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { alignItems: "center", justifyContent: "center", width: "85%" },
  cuadroVerde: {
    borderColor: "#2A4712",
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: "#fff",
    padding: 14,
    width: "100%",
    alignItems: "center",
    position: "relative",
  },
  iconoCerrar: { position: "absolute", top: 10, right: 12 },
  titulo: {
    color: "#479454",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  cuadroNegro: {
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    paddingRight: 0,
    paddingBottom: 0,
    width: "100%",
  },
  superior: { alignItems: "center", marginBottom: 10 },
  descuento: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  descripcion: {
    fontSize: 14,
    color: "#333",
    marginVertical: 8,
    textAlign: "center",
  },
  textoNormal: { fontSize: 13, textAlign: "center", color: "#333" },
  textoNegrita: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
  },
  inferior: { flexDirection: "row", gap: 5, justifyContent: "space-between" },
  izquierda: { width: "49%", justifyContent: "center" },
  derecha: { width: "49%" },
  boton: {
    backgroundColor: "#479454",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  botonContenido: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  botonTexto: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 6,
  },
  imagen: { width: "100%", height: 100, borderRadius: 5 },

});
