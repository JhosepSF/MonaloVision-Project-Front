import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView, ActivityIndicator, Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { clasificarDanoCacao, DiagnosticResult } from '../services/api';

const { width } = Dimensions.get('window');

export default function TomarFotoScreen() {
  const [fotoCacao, setFotoCacao] = useState<string | null>(null);
  const [analizando, setAnalizando] = useState(false);
  const [resultado, setResultado] = useState<DiagnosticResult | null>(null);
  const [verSegmentado, setVerSegmentado] = useState(true);

  const tomarFoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se necesita permiso para usar la cámara.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 0.8,
        mediaTypes: 'images' as any,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setFotoCacao(result.assets[0].uri);
        setResultado(null);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo abrir la cámara.');
    }
  };

  const seleccionarGaleria = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false,
        quality: 0.8,
        mediaTypes: 'images' as any,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setFotoCacao(result.assets[0].uri);
        setResultado(null);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar la foto de la galería.');
    }
  };

  const analizarImagen = async () => {
    if (!fotoCacao) {
      Alert.alert('Sin foto', 'Primero toma o selecciona una foto de tu cacao.');
      return;
    }

    setAnalizando(true);
    try {
      const res = await clasificarDanoCacao(fotoCacao);
      setResultado(res);
    } catch (error: any) {
      console.error('Error al clasificar daño de cacao:', error);
      Alert.alert(
        'Error de conexión',
        'No se pudo conectar con el servidor. Verifica que el backend esté activo y que la IP en api.ts sea correcta.'
      );
    } finally {
      setAnalizando(false);
    }
  };

  const reiniciar = () => {
    setFotoCacao(null);
    setResultado(null);
    setVerSegmentado(true);
  };

  // Helper to map and sanitize combining Unicode tilde keys for presentation
  const formatClassName = (name: string) => {
    // Replace combining tilde or NFD chars
    const normalized = name.normalize('NFC');
    if (normalized.includes('Sana')) return 'Sana (Sin Daño)';
    if (normalized.includes('Ligero')) return 'Daño Ligero';
    if (normalized.includes('Moderado')) return 'Daño Moderado';
    if (normalized.includes('Severo')) return 'Daño Severo';
    return normalized;
  };

  // Helper to obtain semantic colors per class
  const getClassColors = (name: string) => {
    const normalized = name.normalize('NFC');
    if (normalized.includes('Sana')) {
      return { primary: '#2E7D32', bg: '#E8F5E9', border: '#C8E6C9' };
    }
    if (normalized.includes('Ligero')) {
      return { primary: '#F57F17', bg: '#FFF9C4', border: '#FFF59D' };
    }
    if (normalized.includes('Moderado')) {
      return { primary: '#E65100', bg: '#FFE0B2', border: '#FFCC80' };
    }
    // Severo
    return { primary: '#D84315', bg: '#FFCCBC', border: '#FFAB91' };
  };

  const colors = resultado ? getClassColors(resultado.clase) : { primary: '#558B2F', bg: '#F1F8E9', border: '#DCEDC8' };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      
      {!fotoCacao ? (
        <>
          {/* Estado inicial - sin foto */}
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="camera-outline" size={80} color="#558B2F" />
            </View>
            <Text style={styles.emptyTitle}>Captura tu Cacao</Text>
            <Text style={styles.emptySubtitle}>
              Toma una foto clara o sube una imagen desde tu galería para diagnosticar la plaga Monalonion.
            </Text>
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={[styles.bigBtn, styles.btnCamera]} onPress={tomarFoto} activeOpacity={0.8}>
              <Ionicons name="camera" size={28} color="#fff" />
              <Text style={styles.bigBtnText}>Tomar Foto</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.bigBtn, styles.btnGallery]} onPress={seleccionarGaleria} activeOpacity={0.8}>
              <Ionicons name="images" size={28} color="#fff" />
              <Text style={styles.bigBtnText}>Subir de Galería</Text>
            </TouchableOpacity>
          </View>

          {/* Consejos de toma de imágenes */}
          <View style={styles.tipsCard}>
            <View style={styles.tipsHeader}>
              <Ionicons name="bulb-outline" size={22} color="#D84315" />
              <Text style={styles.tipsTitle}>Consejos de Captura</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={18} color="#558B2F" />
              <Text style={styles.tipText}>Centra el fruto de cacao en el encuadre.</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={18} color="#558B2F" />
              <Text style={styles.tipText}>Asegura buena iluminación natural sin reflejos.</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={18} color="#558B2F" />
              <Text style={styles.tipText}>Evita que salgan ramas u otros frutos superpuestos.</Text>
            </View>
          </View>
        </>
      ) : (
        <>
          {/* Image Display Section with Segmentation Base64 toggle */}
          <View style={styles.cardContainer}>
            <Text style={styles.sectionTitle}>Visualización del Fruto</Text>
            
            {resultado?.segmented_image && verSegmentado ? (
              <Image 
                source={{ uri: `data:image/jpeg;base64,${resultado.segmented_image}` }} 
                style={styles.fotoPreview} 
                resizeMode="cover"
              />
            ) : (
              <Image source={{ uri: fotoCacao }} style={styles.fotoPreview} resizeMode="cover" />
            )}

            {resultado?.segmented_image && (
              <View style={styles.toggleContainer}>
                <TouchableOpacity 
                  style={[styles.toggleBtn, !verSegmentado && styles.toggleBtnActive]} 
                  onPress={() => setVerSegmentado(false)}
                >
                  <Text style={[styles.toggleText, !verSegmentado && styles.toggleTextActive]}>Original</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.toggleBtn, verSegmentado && styles.toggleBtnActive]} 
                  onPress={() => setVerSegmentado(true)}
                >
                  <Text style={[styles.toggleText, verSegmentado && styles.toggleTextActive]}>Segmentado AI</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {analizando && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#558B2F" />
              <Text style={styles.loadingText}>Ejecutando Modelos en Backend...</Text>
              <Text style={styles.loadingSubtext}>Segmentando con Mask R-CNN y clasificando con ViT-Tiny + SVM</Text>
            </View>
          )}

          {resultado !== null && !analizando && (
            <>
              {/* Resultado Diagnóstico Principal */}
              <View style={[styles.resultCard, { borderColor: colors.primary, shadowColor: colors.primary }]}>
                <Text style={styles.resultLabel}>Diagnóstico Encontrado</Text>
                <Text style={[styles.resultValue, { color: colors.primary }]}>
                  {formatClassName(resultado.clase)}
                </Text>
                
                <View style={[styles.resultBadge, { backgroundColor: colors.bg, borderColor: colors.border, borderWidth: 1 }]}>
                  <Ionicons name="ribbon-outline" size={18} color={colors.primary} />
                  <Text style={[styles.resultBadgeText, { color: colors.primary }]}>
                    Confianza: {(resultado.confianza * 100).toFixed(2)}%
                  </Text>
                </View>

                {resultado.segmentation_success ? (
                  <Text style={styles.segmentationSuccessText}>
                    * Cacao detectado y segmentado con éxito por Mask R-CNN.
                  </Text>
                ) : (
                  <Text style={styles.segmentationWarningText}>
                    * No se pudo segmentar el cacao; se analizó la imagen original completa.
                  </Text>
                )}
              </View>

              {/* Distribución de Probabilidades */}
              <View style={styles.probsCard}>
                <Text style={styles.probsTitle}>Distribución de Confianza</Text>
                {Object.entries(resultado.probabilities).map(([name, val]) => {
                  const itemColors = getClassColors(name);
                  const isWinner = name.normalize('NFC') === resultado.clase.normalize('NFC');
                  return (
                    <View key={name} style={styles.probRow}>
                      <View style={styles.probTextHeader}>
                        <Text style={[styles.probName, isWinner && { fontWeight: '700', color: '#4E342E' }]}>
                          {formatClassName(name)}
                        </Text>
                        <Text style={styles.probPercent}>{(val * 100).toFixed(2)}%</Text>
                      </View>
                      <View style={styles.probBarBackground}>
                        <View 
                          style={[
                            styles.probBarForeground, 
                            { 
                              width: `${Math.max(val * 100, 3)}%`, 
                              backgroundColor: itemColors.primary 
                            }
                          ]} 
                        />
                      </View>
                    </View>
                  );
                })}
              </View>
            </>
          )}

          {/* Contenedor de Botones de Acción */}
          <View style={styles.actionsContainer}>
            {!analizando && resultado === null && (
              <TouchableOpacity style={[styles.bigBtn, styles.btnEstimar]} onPress={analizarImagen} activeOpacity={0.8}>
                <Ionicons name="analytics" size={24} color="#fff" />
                <Text style={styles.bigBtnText}>Analizar Fruto</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              style={[styles.bigBtn, styles.btnSecondary]} 
              onPress={reiniciar}
              disabled={analizando}
              activeOpacity={0.8}
            >
              <Ionicons name="refresh" size={24} color="#fff" />
              <Text style={styles.bigBtnText}>Nueva Foto</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Pure white background as requested
  },
  contentContainer: {
    padding: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  emptyIconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#F1F8E9', // Soft green circle background
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#8BC34A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2E7D32', // Deep forest green
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#757575',
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonsContainer: {
    gap: 14,
    marginBottom: 32,
  },
  bigBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  btnCamera: {
    backgroundColor: '#558B2F', // Soft Forest Green
  },
  btnGallery: {
    backgroundColor: '#8D6E63', // Earthy Brown
  },
  btnEstimar: {
    backgroundColor: '#D84315', // Autumn Terracotta
  },
  btnSecondary: {
    backgroundColor: '#757575', // Warm neutral gray
  },
  bigBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 17,
  },
  tipsCard: {
    backgroundColor: '#FFF3E0', // Very soft autumn orange background
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FF8F00', // Autumn Amber Orange
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#5D4037', // Earthy brown
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 13,
    color: '#5D4037',
    flex: 1,
    lineHeight: 18,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#EFEBE9',
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#8D6E63',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  fotoPreview: {
    width: '100%',
    height: 320,
    borderRadius: 16,
    backgroundColor: '#EFEBE9',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#EFEBE9',
    borderRadius: 12,
    padding: 4,
    marginTop: 14,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  toggleBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#757575',
  },
  toggleTextActive: {
    color: '#558B2F', // Soft Green
    fontWeight: '700',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#DCEDC8',
    borderRadius: 16,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E7D32',
    marginTop: 12,
  },
  loadingSubtext: {
    fontSize: 13,
    color: '#757575',
    textAlign: 'center',
    paddingHorizontal: 24,
    lineHeight: 18,
    marginTop: 6,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  resultLabel: {
    fontSize: 12,
    color: '#8D6E63',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  resultValue: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 14,
    textAlign: 'center',
  },
  resultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  resultBadgeText: {
    fontSize: 14,
    fontWeight: '700',
  },
  segmentationSuccessText: {
    fontSize: 11,
    color: '#558B2F',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 14,
  },
  segmentationWarningText: {
    fontSize: 11,
    color: '#D84315',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 14,
  },
  probsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#EFEBE9',
    padding: 20,
    marginBottom: 20,
  },
  probsTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#8D6E63',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  probRow: {
    marginBottom: 14,
  },
  probTextHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  probName: {
    fontSize: 14,
    color: '#555555',
    fontWeight: '500',
  },
  probPercent: {
    fontSize: 13,
    color: '#757575',
    fontWeight: '600',
  },
  probBarBackground: {
    height: 8,
    backgroundColor: '#EFEBE9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  probBarForeground: {
    height: '100%',
    borderRadius: 4,
  },
  actionsContainer: {
    gap: 12,
  },
});
