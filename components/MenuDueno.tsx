import { usePathname, useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context"; // 👈 Importante

// 📸 Íconos del menú
const icons = {
  casa: require("../assets/images/navegacion/casa.png"),
  calendario: require("../assets/images/navegacion/calendario.png"),
  mascotas: require("../assets/images/navegacion/mascotas.png"),
  persona: require("../assets/images/navegacion/persona.png"),
};

export default function MenuDueno() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets(); // 👈 Detecta el área segura del dispositivo

  const items = [
    { name: "Inicio", icon: icons.casa, route: "/HomeDueno" },
    { name: "Agenda", icon: icons.calendario, route: "/AgendaDueno" },
    { name: "Mascotas", icon: icons.mascotas, route: "/RegistroMascota" },
    { name: "Perfil", icon: icons.persona, route: "/PerfilDueno" },
  ];

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: Platform.OS === "android" ? insets.bottom || 10 : insets.bottom}, // 👈 Ajusta automáticamente
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
    paddingVertical: 12,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  item: {
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    borderRadius: 15,
    width: 60,
  },
  icon: {
    width: 30,
    height: 30,
    tintColor: "#FFFFFF",
  },
  activeItem: {
    backgroundColor: "#3D7447",
  },
  activeIcon: {
    tintColor: "#fff",
  },
});
