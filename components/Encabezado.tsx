import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NotificationCard from "./NotificationCard";
import axios from "axios";
import { BASE_URL } from "@/config/api";
import { BlurView } from "expo-blur";
import { AntDesign } from "@expo/vector-icons";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter, usePathname } from "expo-router";

interface Appointment {
  id: string;
  fecha: string;
  hora_inicio: string;
  nombreMascota?: string; // For vet notifications
  nombreVeterinario?: string; // For user notifications
}

interface DynamicNotification {
  id: string;
  message: string;
  icon: any; // ImageSourcePropType
  type: "new_appointment" | "upcoming_appointment" | "appointment_tomorrow";
}

// 🔹 Función para formatear fecha legible
function formatearFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function Encabezado() {
  const [modalVisible, setModalVisible] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [dynamicNotifications, setDynamicNotifications] = useState<DynamicNotification[]>([]);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const showLogout = pathname === "/Perfilvet" || pathname === "/PerfilDueno";
  const showNotificationBell = pathname === "/HomeDueno" || pathname === "/Iniciovet";

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userId");
      await AsyncStorage.removeItem("userType");
      router.replace("/Iniciarsesion1");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const role = await AsyncStorage.getItem("userType");
      const id = await AsyncStorage.getItem("userId");
      setUserRole(role);
      setUserId(id);
      console.log("Fetched User Role:", role);
      console.log("Fetched User ID:", id);
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchAppointmentsAndGenerateNotifications = async () => {
      try {
        let appointments: Appointment[] = [];
        if (userRole === "veterinario") {
          const response = await axios.get(`${BASE_URL}/api/citasVeterinario/${userId}`);
          appointments = response.data;
        } else if (userRole === "usuario") {
          const response = await axios.get(`${BASE_URL}/api/citasDueno/${userId}`);
          appointments = response.data;
        }

        const now = new Date();
        const newNotifs: DynamicNotification[] = [];

        appointments.forEach((appointment) => {
          const appointmentDateTime = new Date(`${appointment.fecha}T${appointment.hora_inicio}`);

          // Notification: Appointment starting in 20 minutes
          const twentyMinutesBefore = new Date(appointmentDateTime.getTime() - 20 * 60 * 1000);
          if (now >= twentyMinutesBefore && now < appointmentDateTime) {
            newNotifs.push({
              id: `upcoming-${appointment.id}`,
              message: `Tu cita comenzará pronto, ¡prepárate!`, // Generic message for now
              icon: require("../assets/images/navegacion/campana.png"),
              type: "upcoming_appointment",
            });
          }

          // Notification: Appointment tomorrow (for user)
          if (userRole === "usuario") {
            const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
            const appointmentDate = new Date(appointmentDateTime.getFullYear(), appointmentDateTime.getMonth(), appointmentDateTime.getDate());
            if (appointmentDate.getTime() === tomorrow.getTime()) {
              newNotifs.push({
                id: `tomorrow-${appointment.id}`,
                message: `Tu mascota tiene programada una cita mañana, ¡Revísala en tu agenda!`, // Generic message for now
                icon: require("../assets/images/navegacion/campana.png"),
                type: "appointment_tomorrow",
              });
            }
          }

          // Notification: New appointment (for vet) - within 7 days
          const diferenciaDias = Math.floor((appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          if (userRole === "veterinario" && diferenciaDias >= 0 && diferenciaDias <= 7) {
            newNotifs.push({
              id: `new-vet-${appointment.id}`,
              message: `Tienes una nueva cita para el ${formatearFecha(appointment.fecha)}, ¡Revísala en tu agenda!`,
              icon: require("../assets/images/navegacion/campana.png"),
              type: "new_appointment",
            });
          }
        });

        setDynamicNotifications(newNotifs);
        setHasNewNotifications(newNotifs.length > 0); // Update red dot status
      } catch (error) {
        console.error("Error fetching appointments or generating notifications:", error);
      }
    };

    if (userId && userRole) {
      fetchAppointmentsAndGenerateNotifications();
      // Refresh notifications every minute
      const interval = setInterval(fetchAppointmentsAndGenerateNotifications, 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [userId, userRole]);

  // Notificaciones fijas para veterinarios
  const fixedVetNotifications = [
    { id: "vet-fixed-1", message: "¡Recuerda actualizar tu perfil!", icon: require("../assets/images/navegacion/campana.png") },
    { id: "vet-fixed-2", message: "¡Recuerda estar pendiente de tus citas!", icon: require("../assets/images/navegacion/campana.png") },
  ];

  // Notificaciones fijas para usuarios
  const fixedUserNotifications = [
    { id: "user-fixed-1", message: "¡Recuerda actualizar tu perfil!", icon: require("../assets/images/navegacion/campana.png") },
    { id: "user-fixed-2", message: "¡Agenda una cita de chequeo para tu mascota!", icon: require("../assets/images/navegacion/campana.png") },
  ];

  const handleDismissNotification = (id: string) => {
    setDynamicNotifications((prevNotifs) => prevNotifs.filter((notif) => notif.id !== id));
  };

  return (
    <View style={styles.header}>
      {/* LOGO IZQUIERDA */}
      <Image
        source={require("../assets/images/navegacion/Pata.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.headerRight}>
        {/* CAMPANA COMO BOTÓN */}
        {showNotificationBell && (
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.campanaContainer}>
            <Image
              source={require("../assets/images/navegacion/campana.png")}
              style={styles.campana}
              resizeMode="contain"
            />
            {hasNewNotifications && <View style={styles.redDot} />}
          </TouchableOpacity>
        )}

        {/* BOTÓN DE LOGOUT */}
        {showLogout && (
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Image
              source={require("../assets/images/navegacion/iconosalir.png")}
              style={styles.iconoSalir}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>

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
              {userRole === "veterinario" &&
                fixedVetNotifications.map((notif) => (
                  <NotificationCard
                    key={notif.id}
                    id={notif.id}
                    message={notif.message}
                    icon={notif.icon}
                  />
                ))}

              {userRole === "usuario" &&
                fixedUserNotifications.map((notif) => (
                  <NotificationCard
                    key={notif.id}
                    id={notif.id}
                    message={notif.message}
                    icon={notif.icon}
                  />
                ))}

              {dynamicNotifications.map((notif) => (
                <NotificationCard
                  key={notif.id}
                  id={notif.id}
                  message={notif.message}
                  icon={notif.icon}
                  onDismiss={handleDismissNotification}
                />
              ))}
            </ScrollView>

            {/* Icono/imagen de salir abajo (PNG) que también cierra */}
            <View style={styles.footer}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>Cerrar</Text>
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
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  campana: {
    width: 30,                      
    height: 35,                    
  },
  campanaContainer: {
    position: "relative",
  },
  redDot: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "red",
    borderRadius: 5,
    width: 10,
    height: 10,
  },
  logoutButton: {
    marginLeft: 15,
  },
  iconoSalir: {
    width: 28,
    height: 28,
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
  footer: {
    paddingHorizontal: 14,          // Espaciado lateral
    paddingVertical: 10,            // Espaciado superior e inferior
    borderTopWidth: 1,              // Línea superior separadora del footer
    borderTopColor: "#000000",      
    alignItems: "center",       // Alinea el contenido (icono) hacia el centro
  },
  closeButtonText: {
    color: "#479454",
    fontSize: 16,
    fontWeight: "bold",
  },
});
