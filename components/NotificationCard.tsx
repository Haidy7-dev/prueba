import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageSourcePropType,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

interface NotificationCardProps {
  id: string;
  message: string;
  icon: ImageSourcePropType;
  onDismiss?: (id: string) => void;
}

export default function NotificationCard({
  id,
  message,
  icon,
  onDismiss,
}: NotificationCardProps) {
  return (
    <View style={styles.notificationBox}>
      <Image source={icon} style={styles.iconoNotificacion} resizeMode="contain" />
      <Text style={styles.notificationText}>{message}</Text>
      {onDismiss && (
        <TouchableOpacity onPress={() => onDismiss(id)} style={styles.dismissButton}>
          <AntDesign name="close" size={16} color="#999" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  notificationBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee", // Lighter border for individual notifications
  },
  iconoNotificacion: {
    width: 38,
    height: 38,
    marginRight: 12,
  },
  notificationText: {
    flex: 1,
    color: "#000000",
    fontSize: 14,
  },
  dismissButton: {
    padding: 5,
  },
});
