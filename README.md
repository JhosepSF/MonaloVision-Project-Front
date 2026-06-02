# MonaloVision - Frontend (Aplicación Móvil)

## 📱 Descripción
Aplicación móvil desarrollada en React Native con Expo para la **detección, clasificación y diagnóstico del nivel de daño por la plaga del chinche del cacao (*Monalonion dissimulatum*)** mediante el análisis fotográfico respaldado por Inteligencia Artificial. La aplicación cuenta con un diseño ergonómico de alta legibilidad bajo luz solar directa en tonos verdes suaves y otoñales, e integra modelos neuronales de vanguardia ejecutados en el servidor backend.

## 🚀 Repositorios del Proyecto
* **Frontend (App Móvil)**: [https://github.com/JhosepSF/MonaloVision-Project-Front](https://github.com/JhosepSF/MonaloVision-Project-Front)
* **Backend (Inferencia IA)**: [https://github.com/JhosepSF/MonaloVision-Project-Back](https://github.com/JhosepSF/MonaloVision-Project-Back)

---

## 📋 Requisitos Previos

### Software Necesario
* **Node.js** (v18 o superior recomendado)
* **npm** o **yarn**
* **Expo CLI** (incluido en las dependencias locales)
* **Expo Go** instalado en tu dispositivo móvil (Android/iOS) para pruebas locales en campo.

### Backend Activo
La aplicación requiere que el backend Django esté encendido y accesible en el mismo segmento de red WiFi local. Por defecto, está enlazado a:
```
http://192.168.172.7:8000
```

---

## 🔧 Instalación y Configuración

### 1. Clonar el Repositorio
```bash
git clone https://github.com/JhosepSF/MonaloVision-Project-Front.git
cd MonaloVision-Project-Front
```

### 2. Instalar Dependencias
Instala los paquetes nativos compatibles alineados al SDK de Expo:
```bash
npm install
```

### 3. Configurar la URL del Backend
Edita el archivo `src/services/api.ts` y actualiza la dirección IP de tu servidor backend de inferencia:
```typescript
const api = axios.create({
  baseURL: 'http://192.168.172.7:8000', // Modifica por la IP activa de tu PC
  timeout: 60000,
});
```

---

## ▶️ Ejecución de la Aplicación

### Modo Desarrollo
Inicia el entorno de desarrollo y emulación local de Expo:
```bash
npx expo start
```
* Abre la aplicación de **Expo Go** en tu celular y **escanea el código QR** generado en tu terminal.
* Asegúrate de que tanto tu PC de desarrollo como tu celular estén conectados a la **misma red WiFi** para que puedan comunicarse a través de la IP local configurada.

---

## 📦 Compilación y Generación del APK (Nativo)

El empaquetado nativo está enlazado a la plataforma Expo Application Services (EAS) con el ID del proyecto: `bc31b4b7-72f2-4716-8757-ca96683719ad`.

### Generar instalador para Android (APK):
```bash
# Instalar EAS CLI de manera global
npm install -g eas-cli

# Iniciar sesión con tus credenciales de Expo
eas login

# Iniciar la compilación nativa en los servidores de la nube
eas build -p android --profile production
```

---

## 📁 Estructura del Proyecto

```
Front/
├── src/
│   ├── components/            # Componentes reutilizables de UI
│   │   ├── CustomHeader.tsx   # Encabezado verde forestal (#2E7D32)
│   │   └── Footer.tsx         # Pie de página de derechos de autor
│   ├── navigation/            # Sistema de navegación
│   │   └── AppNavigator.tsx   # Stack Navigator móvil principal
│   ├── screens/               # Pantallas (Vistas) principales
│   │   ├── TomarFotoScreen.tsx    # Captura, análisis, gráfico y toggle AI
│   │   ├── MenuRegistroScreen.tsx # Menú principal de bienvenida
│   │   └── HistorialScreen.tsx    # Historial de diagnósticos local
│   └── services/              # Lógica externa
│       └── api.ts             # Cliente Axios e integración AsyncStorage
├── assets/                    # Recursos de diseño (logo.webp, muestras)
├── App.tsx                    # Punto de entrada
├── app.json                   # Propiedades y plugins de Expo
├── eas.json                   # Configuración del empaquetado en la nube
└── package.json               # Dependencias del proyecto
```

---

## 🎯 Funcionalidades Principales

1. **Captura Fotográfica Optimizada**: Captura fotos del cacao usando la cámara trasera con CameraX o selecciona imágenes directamente de la galería de tu celular.
2. **Segmentación y Limpieza AI**: El backend procesa tu foto con **Mask R-CNN** y recorta el cacao sobre un fondo negro, permitiéndote presionar el botón *"Segmentado AI"* para ver exactamente el área del fruto evaluada por el modelo.
3. **Diagnóstico Preciso de Plaga**: Envía el cacao a inferencia (ViT-Tiny + SVM) y lo clasifica en una de las 4 fases: `Sana`, `Daño Ligero`, `Daño Moderado` o `Daño Severo`.
4. **Distribución Probabilística**: Muestra un gráfico de barras horizontales detallado del porcentaje de probabilidad de afectación para cada estadio.
5. **Historial Offline**: Registra tus diagnósticos anteriores de manera local sin consumir tu almacenamiento y de forma 100% autónoma en el campo sin conexión a internet.

---

## 🐛 Solución de Problemas

### Error de Conexión con el Servidor
* Asegúrate de que el backend de Django esté encendido y escuchando en `0.0.0.0:8000`.
* Confirma que tu celular y tu PC estén en el mismo WiFi y que no tengas ningún Firewall bloqueando el puerto `8000` en tu PC.
* Verifica que la IP escrita en `api.ts` coincida con la de tu computadora.

### Limpieza de Caché de Expo
Si la aplicación presenta comportamientos inusuales en Expo Go, puedes borrar la caché ejecutando:
```bash
npx expo start -c
```

---

**Versión del Proyecto**: 2.0  
**Fecha de Actualización**: Junio 2026  
**Desarrollado por**: Jhosep SF & Frank  
**Soporte de Documentación**: Consultar [Manual Técnico](MANUAL_TECNICO.md) y [Manual de Usuario](MANUAL_USUARIO.md)  
