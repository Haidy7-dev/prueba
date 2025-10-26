// src/componentes/Encabezado.tsx
import { AntDesign } from "@expo/vector-icons"; // ícono X
import { BlurView } from "expo-blur";
import React, { useState } from "react";
import {Image,Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View,} from "react-native";

export default function Encabezado() {
  const [modalVisible, setModalVisible] = useState(false);

  // Ejemplo estático de notificaciones (puedes reemplazar por datos de tu API)
  const notificaciones = [
    "¡Ya es momento de desparasitar a tu mascota!",
    "Hay nuevas promociones en vacunas para la rabia. ¡Míralas ya!",
    "¡Recuerda actualizar tu perfil!",
  ];

  return (
    <View style={styles.header}>
      {/* LOGO IZQUIERDA */}
      <Image
        source={require("../assets/images/navegacion/Pata.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* CAMPANA COMO BOTÓN */}
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Image
          source={require("../assets/images/navegacion/campana.png")}
          style={styles.campana}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* MODAL DE NOTIFICACIONES */}
      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        {/* Fondo borroso que ocupa toda la pantalla */}
        <BlurView intensity={70} tint="light" style={styles.blurContainer}>
          {/* Contenedor de la ventana */}
          <View style={styles.modalContainer}>
            {/* Título y X arriba derecha */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Notificaciones</Text>

              {/* X (icono de Expo) arriba a la derecha */}
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeTopBtn}
              >
                <AntDesign name="close" size={22} color="#000" />
              </TouchableOpacity>
            </View>

            {/* Lista de notificaciones */}
            <ScrollView style={styles.listContainer} contentContainerStyle={{ paddingVertical: 8 }}>
              {notificaciones.map((texto, idx) => (
                <View key={idx} style={styles.notificationBox}>
                  {/* icono de notificación (PNG) */}
                  <Image
                    source={require("../assets/images/navegacion/icononotificacion.png")}
                    style={styles.iconoNotificacion}
                    resizeMode="contain"
                  />

                  {/* texto */}
                  <Text style={styles.notificationText}>{texto}</Text>
                </View>
              ))}
            </ScrollView>

            {/* Icono/imagen de salir abajo (PNG) que también cierra */}
            <View style={styles.footer}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Image
                  source={require("../assets/images/navegacion/iconosalir.png")}
                  style={styles.iconoSalir}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",           // Coloca los elementos (logo y campana) en una fila horizontal
    justifyContent: "space-between",// Separa los elementos: uno a la izquierda y otro a la derecha
    alignItems: "center",           // Centra verticalmente los elementos dentro de la fila
    paddingHorizontal: 18,          // Espaciado horizontal (márgenes internos en los lados)
    paddingVertical: 10,            // Espaciado vertical (márgenes internos arriba y abajo)
    paddingTop: 40,
    backgroundColor: "#FFFFFF",    
    width: "100%",                
  },
  logo: {
    width: 50,                     
    height: 60,                     
  },
  campana: {
    width: 30,                      
    height: 35,                    
  },
  blurContainer: {
    flex: 1,                        // Ocupar toda la pantalla
    justifyContent: "center",       // Centrar verticalmente el contenido (la ventana modal)
    alignItems: "center",           // Centrar horizontalmente el contenido
  },
  modalContainer: {
    width: "85%",                  
    backgroundColor: "#fff",        
    borderRadius: 10,               
    borderWidth: 1.4,               // Grosor del borde
    borderColor: "#2A4712",         
    paddingVertical: 8,             // Espaciado interno arriba y abajo
    overflow: "hidden",             // Oculta cualquier contenido que se salga de los bordes redondeados
    // Sombra (solo visible en Android e iOS, no en web)
    shadowColor: "#000",            // Color de la sombra
    shadowOpacity: 0.18,            // Opacidad de la sombra (cuán fuerte se ve)
    shadowOffset: { width: 0, height: 2 }, // Posición de la sombra (abajo del contenedor)
    shadowRadius: 6,                // Difuminado de la sombra
    elevation: 8,                   // Intensidad de la sombra (solo Android)
  },
  modalHeader: {
    flexDirection: "row",           // Elementos en fila (texto y botón X)
    alignItems: "center",           // Centrar verticalmente
    paddingHorizontal: 14,          // Espaciado interno a los lados
    paddingTop: 5,                  // Espaciado arriba
    paddingBottom: 10,               // Espaciado abajo
    borderBottomWidth: 1,           // Línea divisoria en la parte inferior
    borderBottomColor: "#000000",   // Color gris claro de la línea divisoria
  },
  modalTitle: {
    flex: 1,                        // Ocupa todo el ancho disponible (para centrar el texto)
    fontSize: 20,                   
    textAlign: "center",           
    color: "#479454",             
    fontWeight: "700",              // Negrita
  },
  closeTopBtn: {
    position: "absolute",           // Posicionamiento libre dentro del modalHeader
    right: 10,                      // Separado 10px del borde derecho
    top: 3,                         // Separado 3px del borde superior
    padding: 6,                     // Área táctil más amplia para facilitar el clic
  },
  listContainer: {
    maxHeight: 300,                 // Altura máxima del scroll antes de que empiece a desplazarse
  },
  notificationBox: {
    flexDirection: "row",           // Icono y texto en línea horizontal
    alignItems: "center",           // Centra verticalmente el icono y el texto
    paddingVertical: 12,            // Espaciado interno vertical
    paddingHorizontal: 14,          // Espaciado interno lateral
    borderBottomWidth: 1,           // Línea separadora entre notificaciones
    borderBottomColor: "#000000",   
  },
  iconoNotificacion: {
    width: 38,                      
    height: 38,                     
    marginRight: 12,                // Espacio entre el icono y el texto
  },
  notificationText: {
    flex: 1,                        // Hace que el texto ocupe el espacio restante de la fila
    color: "#000000",             
    fontSize: 14,                   
  },
  footer: {
    paddingHorizontal: 14,          // Espaciado lateral
    paddingVertical: 10,            // Espaciado superior e inferior
    borderTopWidth: 1,              // Línea superior separadora del footer
    borderTopColor: "#000000",      
    alignItems: "flex-start",       // Alinea el contenido (icono) hacia la izquierda
  },
  iconoSalir: {
    width: 28,                     
    height: 28,                     
  },
});
