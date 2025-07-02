import { MagicPalette } from '@/constants/Colors';
import { StyleSheet, View } from 'react-native';

// This is a shim for web and Android where the tab bar is generally opaque.
export default function FancyTabBarBackground() {
  return (
    <View style={styles.background} />
  );
}

export function useBottomTabOverflow() {
  return 0;
}

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: MagicPalette.white,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
});
