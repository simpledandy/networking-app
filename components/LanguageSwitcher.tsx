import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import i18n from '../i18n';

const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'uz', label: 'UZ' },
];

export function LanguageSwitcher() {
  const current = i18n.language;
  return (
    <View style={styles.row}>
      {LANGS.map(lang => (
        <TouchableOpacity
          key={lang.code}
          style={[styles.btn, current === lang.code && styles.active]}
          onPress={() => i18n.changeLanguage(lang.code)}
        >
          <Text style={[styles.text, current === lang.code && styles.activeText]}>{lang.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  btn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#eee',
    marginHorizontal: 2,
  },
  active: {
    backgroundColor: '#7F7FD5',
  },
  text: {
    fontWeight: 'bold',
    color: '#333',
  },
  activeText: {
    color: '#fff',
  },
}); 