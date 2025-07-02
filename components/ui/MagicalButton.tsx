import { MagicPalette } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

interface MagicalButtonProps {
  title: string;
  onPress: () => void;
  color?: string;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const MagicalButton: React.FC<MagicalButtonProps> = ({ title, onPress, color = MagicPalette.purple, icon, style }) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color, shadowColor: color }, style]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginVertical: 4,
    alignSelf: 'center',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  text: {
    color: MagicPalette.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 