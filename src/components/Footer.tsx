import { View, Text, StyleSheet } from 'react-native';

export default function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>©2026 MONALOVISION</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingVertical: 12,
    backgroundColor: '#E8F5E9', // Sage Green background
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#DCEDC8', // Soft green divider
  },
  footerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#558B2F', // Forest green text
    letterSpacing: 1,
  },
});
