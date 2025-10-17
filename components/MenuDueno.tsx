import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

// 📸 Íconos del menú (ajusta las rutas según tu proyecto)
const icons = {
  casa: require("../assets/images/navegacion/casa.png"),
  calendario: require("../assets/images/navegacion/calendario.png"),
  mascotas: require("../assets/images/navegacion/mascotas.png"),
  persona: require("../assets/images/navegacion/persona.png"),
};

interface MenuDuenoProps {
  active?: string; // nombre de la pantalla activa, ej: "Inicio", "Agenda"
}

export default function MenuDueno({ active }: MenuDuenoProps) {
  const router = useRouter();

  const items = [
    { name: "Inicio", icon: icons.casa, route: "/inicio" },
    { name: "Agenda", icon: icons.calendario, route: "/agenda" },
    { name: "Mascotas", icon: icons.mascotas, route: "/mascotas" },
    { name: "Perfil", icon: icons.persona, route: "/perfil" },
  ];

  return (
    <View style={styles.container}>
      {items.map((item) => (
        <TouchableOpacity
          key={item.name}
          onPress={() => router.push(item.route)}
          style={[
            styles.item,
            active === item.name && styles.activeItem, // resalta el activo
          ]}
        >
          <Image
            source={item.icon}
            style={[
              styles.icon,
              active === item.name && styles.activeIcon, // cambio de color si está activo
            ]}
            resizeMode="contain"
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#2F5D38", // verde base
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
  },
  icon: {
    width: 28,
    height: 28,
    
  },
  activeItem: {
    backgroundColor: "#3D7447",
  },
  activeIcon: {
    tintColor: "#FFD700", // dorado para el ítem activo
  },
});
