import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL for the Django server. Edit this to match your local IP when testing on a physical device.
const api = axios.create({
  baseURL: 'http://192.168.172.7:8000',
  timeout: 60000, // 60 seconds to allow for deep-learning model load and inference
});

const CLASSIFY_ENDPOINT = '/api/classify/';

export type DiagnosticResult = {
  clase: string;          // 'DañoLigero' | 'DañoModerado' | 'DañoSevero' | 'Sana'
  confianza: number;      // 0.0 to 1.0
  probabilities: Record<string, number>;
  segmentation_success: boolean;
  segmented_image: string | null; // Base64 string
  latency_ms: number;
};

export type DiagnosticoRecord = {
  id: string;
  fotoUri: string;
  clase: string;
  confianza: number;
  segmentedImageB64: string | null;
  fecha: string;
};

export const clasificarDanoCacao = async (fotoUri: string): Promise<DiagnosticResult> => {
  console.log('[API] Starting cacao disease classification...');
  console.log('[API] Image URI:', fotoUri);

  const formData = new FormData();

  // Extract filename from URI
  const filename = fotoUri.split('/').pop() || 'cacao_sample.jpg';
  console.log('[API] File name:', filename);

  // @ts-ignore - FormData accepts custom Blob/File objects in React Native
  formData.append('image', {
    uri: fotoUri,
    type: 'image/jpeg',
    name: filename,
  });

  try {
    const requestUrl = api.defaults.baseURL + CLASSIFY_ENDPOINT;
    console.log('[API] Sending request to:', requestUrl);

    const response = await api.post(CLASSIFY_ENDPOINT, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('[API] Response received successfully!');

    const data = response.data;

    if (data.error) {
      throw new Error(data.error);
    }

    const resultado: DiagnosticResult = {
      clase: data.class,
      confianza: data.confidence,
      probabilities: data.probabilities,
      segmentation_success: data.segmentation_success,
      segmented_image: data.segmented_image,
      latency_ms: data.latency_ms,
    };

    // Save this diagnosis into local storage history
    await guardarEnHistorial(fotoUri, resultado.clase, resultado.confianza, resultado.segmented_image);

    return resultado;
  } catch (error: any) {
    console.error('[API] Detailed classification error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      code: error.code,
    });
    throw error;
  }
};

const guardarEnHistorial = async (
  fotoUri: string,
  clase: string,
  confianza: number,
  segmentedImageB64: string | null
) => {
  try {
    const historialStr = await AsyncStorage.getItem('historial_estimaciones');
    const historial: DiagnosticoRecord[] = historialStr ? JSON.parse(historialStr) : [];

    const nuevoRegistro: DiagnosticoRecord = {
      id: Date.now().toString(),
      fotoUri,
      clase,
      confianza,
      segmentedImageB64,
      fecha: new Date().toISOString(),
    };

    historial.unshift(nuevoRegistro); // Add to the beginning of the list

    // Limit to the last 50 diagnostics
    const historialLimitado = historial.slice(0, 50);

    await AsyncStorage.setItem('historial_estimaciones', JSON.stringify(historialLimitado));
  } catch (error) {
    console.error('Error saving diagnosis in history:', error);
  }
};

export default api;
