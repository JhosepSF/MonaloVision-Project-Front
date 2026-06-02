import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, RefreshControl, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DiagnosticoRecord } from '../services/api';

export default function HistorialScreen() {
  const [diagnosticos, setDiagnosticos] = useState<DiagnosticoRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const cargarHistorial = async () => {
    setLoading(true);
    try {
      const historialStr = await AsyncStorage.getItem('historial_estimaciones');
      if (historialStr) {
        const historial = JSON.parse(historialStr);
        setDiagnosticos(historial);
      }
    } catch (error) {
      console.error('Error al cargar historial:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarHistorial();
  }, []);

  const limpiarHistorial = async () => {
    try {
      await AsyncStorage.removeItem('historial_estimaciones');
      setDiagnosticos([]);
    } catch (error) {
      console.error('Error al limpiar historial:', error);
    }
  };

  // Helper to map and sanitize combining Unicode tilde keys for presentation
  const formatClassName = (name: string) => {
    const normalized = name.normalize('NFC');
    if (normalized.includes('Sana')) return 'Sana';
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

  const renderItem = ({ item }: { item: DiagnosticoRecord }) => {
    const fecha = new Date(item.fecha);
    const fechaFormato = fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const colors = getClassColors(item.clase);

    return (
      <View style={styles.card}>
        <Image source={{ uri: item.fotoUri }} style={styles.cardImage} resizeMode="cover" />
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: '#4E342E' }]}>
              {formatClassName(item.clase)}
            </Text>
            <View style={[styles.badge, { backgroundColor: colors.bg, borderColor: colors.border, borderWidth: 1 }]}>
              <Text style={[styles.badgeText, { color: colors.primary }]}>
                {(item.confianza * 100).toFixed(0)}%
              </Text>
            </View>
          </View>
          <View style={styles.cardFooter}>
            <Ionicons name="calendar-outline" size={14} color="#8D6E63" />
            <Text style={styles.cardFecha}>{fechaFormato}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {diagnosticos.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="file-tray-outline" size={80} color="#8D6E63" />
          </View>
          <Text style={styles.emptyTitle}>Sin Diagnósticos</Text>
          <Text style={styles.emptySubtitle}>
            Las clasificaciones de cacao que realices aparecerán en este historial.
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Historial</Text>
              <Text style={styles.headerSubtitle}>{diagnosticos.length} análisis guardados</Text>
            </View>
            <TouchableOpacity style={styles.clearButton} onPress={limpiarHistorial} activeOpacity={0.8}>
              <Ionicons name="trash-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={diagnosticos}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={cargarHistorial}
                colors={['#558B2F', '#D84315']}
                tintColor="#558B2F"
                progressBackgroundColor="#FFFFFF"
              />
            }
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Pure white background as requested
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#2E7D32', // Deep forest green
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#757575',
    marginTop: 2,
  },
  clearButton: {
    backgroundColor: '#D84315', // Autumn Terracotta
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#D84315',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#EFEBE9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardImage: {
    width: 100,
    height: 100,
    backgroundColor: '#EFEBE9',
  },
  cardContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardFecha: {
    fontSize: 12,
    color: '#8D6E63', // Soft earthy brown
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#F1F8E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#8BC34A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#8D6E63',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    lineHeight: 20,
  },
});
