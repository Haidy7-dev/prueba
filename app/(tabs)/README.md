# Documentación del Componente `VerVeterinario.tsx`

Este documento proporciona una explicación detallada de cada sección y elemento del código en el archivo `VerVeterinario.tsx`. El objetivo es facilitar la comprensión de su funcionalidad y estructura para estudio y mantenimiento.

## 1. Importaciones

Esta sección detalla las librerías y componentes externos que `VerVeterinario.tsx` utiliza.

```typescriptreact
import { BASE_URL } from "@/config/api";
// Importa la constante BASE_URL desde el archivo de configuración de la API.
// Esta URL se utiliza para construir las rutas completas de las solicitudes HTTP al backend.

import AsyncStorage from "@react-native-async-storage/async-storage";
// Importa AsyncStorage, una utilidad para almacenar datos de forma persistente y asíncrona en el dispositivo.
// Se utiliza para guardar y recuperar el ID del usuario logueado.

import { Picker } from "@react-native-picker/picker";
// Importa el componente Picker, que proporciona una interfaz para seleccionar un elemento de una lista desplegable.
// Se utiliza para que el usuario elija un servicio disponible.

import axios from "axios";
// Importa Axios, un cliente HTTP basado en promesas para el navegador y Node.js.
// Se utiliza para realizar solicitudes HTTP (GET, POST) al backend de la aplicación.

import { useLocalSearchParams } from "expo-router";
// Importa el hook useLocalSearchParams de expo-router, que permite acceder a los parámetros de la URL local.
// Se utiliza para obtener el 'id' del veterinario de la ruta actual.

import React, { useEffect, useMemo, useState } from "react";
// Importa hooks fundamentales de React:
// - React: La librería principal para construir interfaces de usuario.
// - useEffect: Para realizar efectos secundarios en componentes funcionales (ej. carga de datos).
// - useMemo: Para memorizar valores calculados y evitar recálculos innecesarios.
// - useState: Para añadir estado a componentes funcionales.

import {
  ActivityIndicator, // Componente UI que muestra un indicador de carga circular.
  Alert,             // API para mostrar cuadros de diálogo de alerta nativos.
  Image,             // Componente UI para mostrar imágenes.
  ScrollView,        // Componente de contenedor que permite el desplazamiento de su contenido.
  StyleSheet,        // API para crear hojas de estilo (CSS-like) para componentes React Native.
  Text,              // Componente UI para mostrar texto.
  TouchableOpacity,  // Componente UI que envuelve una vista para hacerla sensible al tacto, con opacidad reducida al presionar.
  View,              // El componente de contenedor más fundamental para construir la interfaz de usuario.
} from "react-native";
// Importa componentes y APIs esenciales de React Native para construir la interfaz de usuario móvil.

```typescriptreact
// Configurar locale español para el calendario
LocaleConfig.locales['es'] = {
  monthNames: [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ],
  monthNamesShort: ['Ene.', 'Feb.', 'Mar.', 'Abr.', 'May.', 'Jun.', 'Jul.', 'Ago.', 'Sep.', 'Oct.', 'Nov.', 'Dic.'],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['Dom.', 'Lun.', 'Mar.', 'Mié.', 'Jue.', 'Vie.', 'Sáb.'],
  today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';
```
### Explicación de `LocaleConfig`
- **`LocaleConfig.locales['es'] = {...}`**: Este bloque configura el objeto de localización para el idioma español. Define los nombres completos y abreviados de los meses y días de la semana en español. Esto asegura que el componente `Calendar` muestre la información de fecha en el formato culturalmente apropiado para los usuarios de habla hispana.
- **`LocaleConfig.defaultLocale = 'es';`**: Establece el idioma español como el idioma predeterminado para todos los componentes `Calendar` en la aplicación, a menos que se especifique lo contrario.

## 2. Componentes Personalizados Importados

Esta sección describe los componentes personalizados desarrollados localmente que son utilizados por `VerVeterinario.tsx`.

```typescriptreact
import BotonGeneral from "../../components/BotonGeneral";
// Importa el componente BotonGeneral, un botón reutilizable con estilos predefinidos.
// Se utiliza para la acción de agendar cita.

import Encabezado from "../../components/Encabezado";
// Importa el componente Encabezado, que probablemente representa la barra superior de la aplicación.
// Proporciona una interfaz consistente en la parte superior de la pantalla.

import MenuDueno from "../../components/MenuDueno";
// Importa el componente MenuDueno, que probablemente es un menú de navegación específico para el rol de dueño de mascota.
// Se utiliza para la navegación principal en la parte inferior de la pantalla.

## 3. Funciones de Utilidad

Esta sección describe las funciones auxiliares que realizan cálculos o formatean datos.

```typescriptreact
const computeStars = (prom: number) => {
  const full = Math.floor(prom);
  const frac = prom - full;
  let half = false;
  let roundedUp = false;
  if (frac >= 0.75) {
    roundedUp = true;
  } else if (frac >= 0.5) {
    half = true;
  }
  const fullStars = roundedUp ? full + 1 : full;
  return { fullStars, half, roundedUp };
};
```
### Explicación de `computeStars`
- **Propósito**: Calcula el número de estrellas completas y si hay una media estrella para una calificación promedio dada.
- **`prom: number`**: El promedio de calificación del veterinario.
- **`full`**: Parte entera del promedio.
- **`frac`**: Parte fraccionaria del promedio.
- **`half`**: Booleano que indica si hay una media estrella (si la fracción es >= 0.5 y < 0.75).
- **`roundedUp`**: Booleano que indica si la calificación se redondea hacia arriba a la siguiente estrella completa (si la fracción es >= 0.75).
- **`fullStars`**: El número final de estrellas completas a mostrar, considerando el redondeo.
- **Retorna**: Un objeto `{ fullStars, half, roundedUp }` con los resultados del cálculo.

```typescriptreact
function formatTime(timeString: string) {
  const [hour, minute] = timeString.split(':').map(Number);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${String(minute).padStart(2, '0')} ${ampm}`;
}
```
### Explicación de `formatTime`
- **Propósito**: Formatea una cadena de tiempo en formato 'HH:MM' a un formato de 12 horas con AM/PM (ej. '09:00' -> '9:00 AM', '14:30' -> '2:30 PM').
- **`timeString: string`**: La cadena de tiempo a formatear (ej. "09:00", "14:30").
- **`hour`, `minute`**: Extrae la hora y los minutos de la cadena.
- **`ampm`**: Determina si es 'AM' o 'PM'.
- **`formattedHour`**: Convierte la hora a formato de 12 horas.
- **Retorna**: La cadena de tiempo formateada.

## 4. Componente Principal `VerVeterinario`

Esta es la función principal del componente que define la interfaz de usuario y la lógica de la pantalla.

```typescriptreact
export default function VerVeterinario() {
  const { id } = useLocalSearchParams();
  // Obtiene el parámetro 'id' de la URL local. Este 'id' se utiliza para identificar al veterinario cuyo perfil se va a mostrar.

  const [veterinario, setVeterinario] = useState<any>(null);
  // Estado para almacenar la información del veterinario. Inicialmente es null.

  const [horarios, setHorarios] = useState<any[]>([]);
  // Estado para almacenar los horarios de atención del veterinario. Inicialmente es un array vacío.

  const [servicios, setServicios] = useState<any[]>([]);
  // Estado para almacenar la lista de servicios ofrecidos por el veterinario. Inicialmente es un array vacío.

  const [especializaciones, setEspecializaciones] = useState<any[]>([]);
  // Estado para almacenar las especializaciones del veterinario. Inicialmente es un array vacío.

  const [selectedServicio, setSelectedServicio] = useState<any>("");
  // Estado para almacenar el ID del servicio que el usuario ha seleccionado del Picker. Inicialmente es una cadena vacía.

  const [selectedDate, setSelectedDate] = useState<string>("");
  // Estado para almacenar la fecha seleccionada por el usuario en el calendario. Inicialmente es una cadena vacía.

  const [selectedHour, setSelectedHour] = useState<string>("");
  // Estado para almacenar la hora seleccionada por el usuario para la cita. Inicialmente es una cadena vacía.

  const [loading, setLoading] = useState(true);
  // Estado booleano para indicar si los datos del veterinario están cargando. Inicialmente es true.

  const [bookingLoading, setBookingLoading] = useState(false);
  // Estado booleano para indicar si la solicitud de agendamiento de cita está en progreso. Inicialmente es false.
```
### Explicación de los Estados y `useLocalSearchParams`
- **`id`**: Obtenido de `useLocalSearchParams()`, es el identificador único del veterinario que se está visualizando.
- **`veterinario`, `setVeterinario`**: Almacena el objeto completo del veterinario una vez cargado de la API.
- **`horarios`, `setHorarios`**: Contiene un array de objetos de horario del veterinario.
- **`servicios`, `setServicios`**: Contiene un array de objetos de servicio ofrecidos por el veterinario.
- **`especializaciones`, `setEspecializaciones`**: Contiene un array de objetos de especialización del veterinario.
- **`selectedServicio`, `setSelectedServicio`**: Controla el servicio que el usuario ha elegido en el `Picker`.
- **`selectedDate`, `setSelectedDate`**: Almacena la fecha que el usuario ha seleccionado en el `Calendar`.
- **`selectedHour`, `setSelectedHour`**: Almacena la hora específica que el usuario ha elegido para la cita.
- **`loading`, `setLoading`**: Gestiona el estado de carga inicial de los datos del veterinario.
- **`bookingLoading`, `setBookingLoading`**: Gestiona el estado de carga cuando se intenta agendar una cita.

```