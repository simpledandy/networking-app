import { IconSymbol } from '@/components/ui/IconSymbol';
import { MagicGradients, MagicPalette } from '@/constants/Colors';
import { useState } from 'react';
import { Animated, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function CreateEventScreen() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [desc, setDesc] = useState('');
  const [success, setSuccess] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const handleCreate = () => {
    if (title && date && desc) {
      setSuccess(true);
      setTitle('');
      setDate('');
      setDesc('');
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.delay(1200),
        Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start(() => setSuccess(false));
    }
  };

  return (
    <View style={styles.bg}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <IconSymbol name="calendar" size={28} color={MagicPalette.purple} style={{ marginRight: 8 }} />
          <Text style={styles.title}>Create Event</Text>
        </View>
        <TextInput
          placeholder="Event Title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
        <TextInput
          placeholder="Date (YYYY-MM-DD)"
          value={date}
          onChangeText={setDate}
          style={styles.input}
        />
        <TextInput
          placeholder="Description"
          value={desc}
          onChangeText={setDesc}
          style={[styles.input, { height: 80 }]}
          multiline
        />
        <TouchableOpacity style={styles.createBtn} onPress={handleCreate}>
          <IconSymbol name="plus.circle.fill" size={20} color={MagicPalette.white} style={{ marginRight: 8 }} />
          <Text style={styles.createBtnText}>Create</Text>
        </TouchableOpacity>
        {success && (
          <Animated.View style={[styles.successRow, { opacity: fadeAnim }] }>
            <IconSymbol name="checkmark.circle.fill" size={28} color={MagicPalette.green} style={{ marginRight: 8 }} />
            <Text style={styles.success}>Event created!</Text>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: MagicGradients.card[0],
    alignItems: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: MagicPalette.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginTop: 32,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 0,
    borderRadius: 16,
    backgroundColor: MagicPalette.lightGray,
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 12,
    width: '100%',
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MagicPalette.purple,
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginTop: 4,
    marginBottom: 2,
    alignSelf: 'center',
    shadowColor: MagicPalette.purple,
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  createBtnText: {
    color: MagicPalette.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  successRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  success: {
    color: MagicPalette.green,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
}); 