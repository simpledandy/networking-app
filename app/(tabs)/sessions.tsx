import { IconSymbol } from '@/components/ui/IconSymbol';
import { MagicGradients, MagicPalette } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const professionals = [
  { id: 'alex', name: 'Alex Johnson', keywords: 'design, ux', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', online: true },
  { id: 'jamie', name: 'Jamie Lee', keywords: 'engineering, backend', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', online: false },
  { id: 'sam', name: 'Sam Patel', keywords: 'marketing, growth', avatar: 'https://randomuser.me/api/portraits/men/45.jpg', online: true },
];

export default function SessionsScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState('');
  const filtered = professionals.filter(
    p =>
      p.name.toLowerCase().includes(filter.toLowerCase()) ||
      p.keywords.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.calendarBtn}
        onPress={() => router.push('/(tabs)/calendar')}
        accessibilityLabel="View Calendar"
        activeOpacity={0.7}
      >
        <Ionicons name="calendar" size={28} color={MagicPalette.blue} />
      </TouchableOpacity>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <IconSymbol name="list.bullet" size={28} color={MagicPalette.blue} style={{ marginRight: 8 }} />
        <Text style={styles.title}>Available Sessions</Text>
      </View>
      <TextInput
        placeholder="Filter people by name or keyword..."
        value={filter}
        onChangeText={setFilter}
        style={styles.input}
      />
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <TouchableOpacity
                style={styles.avatarWrap}
                onPress={() => router.push({ pathname: item.id === 'taylor' ? '/(tabs)/profile' : '/(tabs)/friend-profile', params: { id: item.id } })}
                activeOpacity={0.8}
              >
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                {item.online && <View style={styles.onlineDot} />}
              </TouchableOpacity>
              <View>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.keywords}>{item.keywords}</Text>
              </View>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionBtn} onPress={() => router.push({ pathname: '/(tabs)/chat', params: { userId: item.id } })} activeOpacity={0.8}>
                <IconSymbol name="bubble.left.and.bubble.right.fill" size={18} color={MagicPalette.white} style={{ marginRight: 6 }} />
                <Text style={styles.actionBtnText}>Message</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={() => {}} activeOpacity={0.8}>
                <IconSymbol name="calendar" size={18} color={MagicPalette.white} style={{ marginRight: 6 }} />
                <Text style={styles.actionBtnText}>Book Session</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        style={{ width: '100%' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: MagicPalette.background,
    position: 'relative',
  },
  calendarBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: MagicPalette.white,
    borderRadius: 24,
    padding: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 8,
    textAlign: 'left',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    backgroundColor: MagicPalette.white,
  },
  card: {
    backgroundColor: MagicGradients.card[0],
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  avatarWrap: {
    position: 'relative',
    marginRight: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  onlineDot: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: MagicPalette.green,
    borderWidth: 2,
    borderColor: MagicPalette.white,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  keywords: {
    color: MagicPalette.gray,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MagicPalette.blue,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: MagicPalette.blue,
    shadowOpacity: 0.10,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  actionBtnText: {
    color: MagicPalette.white,
    fontWeight: 'bold',
    fontSize: 15,
  },
}); 