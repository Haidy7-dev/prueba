/**
 * Centralized API configuration.
 * 
 * Cambia esta dirección IP por la IP de tu máquina donde se ejecuta el backend.
 * Para encontrar tu IP, puedes usar `ipconfig` en Windows o `ifconfig` en macOS/Linux.
 * Asegúrate de que tu dispositivo móvil y tu computadora estén en la misma red WiFi.
 */
const API_IP = "192.168.101.73"; // 👈 ¡CAMBIA ESTA IP CUANDO SEA NECESARIO!

export const BASE_URL = `http://${API_IP}:3000`;