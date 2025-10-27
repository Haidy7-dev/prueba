import { useRouter, usePathname } from "expo-router";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context"; // 👈 Importante


const icons = {
  casa: require("../assets/images/navegacion/casa.png"),
  calendario: require("../assets/images/navegacion/calendario.png"),
  persona: require("../assets/images/navegacion/persona.png"),
};

export default function MenuVet() {
  const router = useRouter();
  const pathname = usePathname(); // 📍 Detecta la pantalla actual
  const insets = useSafeAreaInsets(); // 👈 Detecta el área segura del dispositivo


  const items = [
    { name: "Inicio", icon: icons.casa, route: "/Iniciovet" },
    { name: "Agenda", icon: icons.calendario, route: "/Agendavet" },
    { name: "Perfil", icon: icons.persona, route: "/Perfilvet" },
  ];

  return (
    <View 
    style={[
      styles.container,
     { paddingBottom: Platform.OS === "android" ? insets.bottom || 10 : insets.bottom}, 
      ]}
      >
      {items.map((item) => {
        const isActive = pathname === item.route;

        return (
          <TouchableOpacity
            key={item.name}
            onPress={() => router.push(item.route)}
            style={[styles.item, isActive && styles.activeItem]}
          >
            <Image
              source={item.icon}
              style={[styles.icon, isActive && styles.activeIcon]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#2F5D38",
    paddingVertical: 10,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 10, // sombra Android
    shadowColor: "#000", // sombra iOS
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  item: {
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    borderRadius: 15,
    width: 50,
  },
  icon: {
    width: 28,
    height: 28,
    tintColor: "#FFFFFF", // blanco por defecto
  },
  activeItem: {
    backgroundColor: "#3D7447",
  },
  activeIcon: {
    tintColor: "#fff", // color del ícono activo
  },
});


