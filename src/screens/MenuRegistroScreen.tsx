import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function MenuRegistroScreen() {
  const navigation = useNavigation<any>();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      {/* Hero section con el logo de MonaloVision */}
      <View style={styles.heroSection}>
        <View style={styles.iconContainer}>
          <Image source={require('../../assets/logo.webp')} style={styles.iconImage} resizeMode="contain" />
        </View>
        <Text style={styles.welcome}>Bienvenido a</Text>
        <Text style={styles.appName}>MonaloVision</Text>
        <Text style={styles.tagline}>Detección inteligente de Monalonion dissimulatum en cacao</Text>
      </View>

      {/* Opciones principales */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.card, styles.cardPrimary]}
          onPress={() => navigation.navigate('TomarFoto')}
          activeOpacity={0.9}
        >
          <View style={styles.cardHeaderRow}>
            <View style={[styles.cardIconContainer, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="camera" size={32} color="#558B2F" />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Analizar Cacao</Text>
              <Text style={styles.cardSubtitle}>Toma o sube una foto de tu cacao para clasificar el nivel de plaga</Text>
            </View>
          </View>
          <View style={styles.cardArrow}>
            <Ionicons name="chevron-forward" size={24} color="#558B2F" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.cardSecondary]}
          onPress={() => navigation.navigate('Historial')}
          activeOpacity={0.9}
        >
          <View style={styles.cardHeaderRow}>
            <View style={[styles.cardIconContainer, { backgroundColor: '#FBE9E7' }]}>
              <Ionicons name="list" size={32} color="#D84315" />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Ver Historial</Text>
              <Text style={styles.cardSubtitle}>Consulta reportes, diagnósticos y clasificaciones previas</Text>
            </View>
          </View>
          <View style={styles.cardArrow}>
            <Ionicons name="chevron-forward" size={24} color="#D84315" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Info footer */}
      <View style={styles.infoFooter}>
        <Ionicons name="leaf-outline" size={18} color="#8BC34A" />
        <Text style={styles.infoText}>Diagnóstico basado en ViT-Tiny + SVM</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Pure white background as requested
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
    alignItems: 'center',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 40,
    width: '100%',
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#F1F8E9', // Very soft green circle background
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#8BC34A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  iconImage: {
    width: 110,
    height: 110,
  },
  welcome: {
    fontSize: 15,
    color: '#8D6E63', // Earthy brown
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  appName: {
    fontSize: 38,
    fontWeight: '900',
    color: '#2E7D32', // Deep forest green
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 14,
    color: '#707070',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  actionsContainer: {
    width: '100%',
    gap: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardPrimary: {
    borderColor: '#DCEDC8', // Soft green border
  },
  cardSecondary: {
    borderColor: '#FFCCBC', // Soft autumn terracotta border
  },
  cardHeaderRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  cardIconContainer: {
    width: 58,
    height: 58,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextContainer: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4E342E', // Deep earthy brown
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#757575',
    lineHeight: 18,
  },
  cardArrow: {
    marginLeft: 8,
  },
  infoFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 48,
    gap: 6,
  },
  infoText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8D6E63', // Soft brown
  }
});
