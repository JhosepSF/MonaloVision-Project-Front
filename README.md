# PigVision - Frontend (Aplicación Móvil)

## 📱 Descripción
Aplicación móvil desarrollada en React Native con Expo para la estimación inteligente del peso de cerdos mediante análisis de imágenes usando inteligencia artificial. La app combina una interfaz amigable en tonos azul y blanco con un backend potente de IA para proporcionar estimaciones precisas rápidamente.

## 🚀 Repositorios del Proyecto
- **Frontend (App Móvil)**: https://github.com/JhosepSF/PigVision-Project-Front
- **Backend (Modelos IA)**: https://github.com/JhosepSF/PigVision-Project-Back

## 📋 Requisitos Previos

### Software Necesario
- Node.js (v16 o superior)
- npm o yarn
- Expo CLI
- Android Studio (para emulador Android) o Xcode (para iOS)
- Expo Go app en dispositivo móvil (opcional)

### Backend
Asegúrate de tener el backend corriendo en tu red local. Por defecto, la app se conecta a:
```
http://192.168.100.7:8000
```

## 🔧 Instalación

### 1. Clonar el Repositorio
```bash
git clone https://github.com/JhosepSF/PigVision-Project-Front.git
cd PigVision-Project-Front
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar la URL del Backend
Edita el archivo `src/services/api.ts` y cambia la IP por la de tu servidor backend:
```typescript
const api = axios.create({
  baseURL: 'http://TU_IP_BACKEND:8000',
  timeout: 60000,
});
```

## ▶️ Ejecución

### Modo Desarrollo
```bash
# Iniciar Expo
npx expo start

# Escanea el código QR con Expo Go (Android/iOS)
# O presiona 'a' para Android Emulator
# O presiona 'i' para iOS Simulator
```

### Limpiar Caché (si hay problemas)
```bash
npx expo start -c
```

## 📦 Compilación

### Build para Android (APK)
```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login en Expo
eas login

# Configurar build
eas build:configure

# Crear APK
eas build -p android --profile preview
```

### Build para iOS
```bash
eas build -p ios --profile preview
```

## 📁 Estructura del Proyecto
```
Front/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── CustomHeader.tsx # Encabezado personalizado
│   │   └── Footer.tsx       # Pie de página
│   ├── navigation/          # Navegación de la app
│   │   └── AppNavigator.tsx # Navigator principal
│   ├── screens/            # Pantallas principales
│   │   ├── TomarFotoScreen.tsx      # Captura y estimación
│   │   ├── MenuRegistroScreen.tsx   # Menú principal
│   │   └── HistorialScreen.tsx      # Historial de estimaciones
│   └── services/           # Servicios API
│       └── api.ts          # Configuración Axios
├── assets/                 # Recursos estáticos (imágenes, logos)
├── App.tsx                # Componente principal
├── app.json               # Configuración de Expo
├── eas.json              # Configuración de build
└── package.json          # Dependencias
```

## 🎯 Funcionalidades

1. **Captura de Imagen**: Tomar foto del cerdo con la cámara del dispositivo o seleccionar desde galería
2. **Estimación de Peso**: Envío de imagen al backend para análisis con IA y obtención de peso estimado
3. **Historial**: Almacenamiento local de estimaciones realizadas con fecha y foto
4. **Interfaz Intuitiva**: Diseño moderno en tonos azul y blanco, fácil de usar
5. **Análisis en Tiempo Real**: Feedback inmediato sobre el peso estimado

## 🛠️ Tecnologías Utilizadas

- **React Native**: Framework para desarrollo móvil
- **Expo**: Plataforma de desarrollo
- **TypeScript**: Lenguaje de programación
- **Axios**: Cliente HTTP para API REST
- **AsyncStorage**: Almacenamiento local
- **React Navigation**: Navegación entre pantallas
- **Expo Camera**: Acceso a cámara del dispositivo
- **Expo Image Picker**: Selección de imágenes

## 📱 Capturas de Pantalla

#### Pantalla Principal
![Pantalla Principal](assets/1.jpeg)

#### Captura de Foto
![Pantalla de Captura](assets/2.jpeg)

#### Procesamiento de Imagen
![Pantalla de Comprobación del Cerdo](assets/3.jpeg)

#### Resultado de Estimación
![Pantalla de Análisis](assets/4.jpeg)

#### Historial de Estimaciones
![Pantalla de Estimación](assets/5.jpeg)

#### Detalles del Historial
![Pantalla de Historial de Estimaciones](assets/6.jpeg)

## 🐛 Solución de Problemas

### Error de Conexión con Backend
- Verifica que el backend esté corriendo en la IP configurada
- Confirma que estás en la misma red WiFi que el servidor backend
- Revisa que la IP en `src/services/api.ts` sea correcta
- Desactiva firewall temporalmente si es necesario
- En Android, asegúrate de que `cleartext` no esté bloqueado para HTTP

### Error al Instalar Dependencias
```bash
rm -rf node_modules
npm cache clean --force
npm install
```

### Caché de Expo no se Actualiza
```bash
npx expo start -c
```

### Error de Permisos de Cámara
- Asegúrate de que la app tiene permisos de cámara en ajustes del dispositivo
- En Android: Settings > Apps > PigVision > Permissions > Camera
- En iOS: Settings > Privacy > Camera > PigVision

## 👥 Autor
Jhosep SF

## 📄 Licencia
Este proyecto es parte de un trabajo académico.

## 📞 Soporte
Para más información, consulta el [Manual de Usuario](MANUAL_USUARIO.md) y el [Manual Técnico](MANUAL_TECNICO.md).
