import { IconSymbol } from '@/components/ui/IconSymbol';
import { MagicalButton } from '@/components/ui/MagicalButton';
import { MagicGradients, MagicPalette } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Animated, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const events = [
  {
    id: '1',
    title: 'Networking Breakfast',
    date: '2024-06-01',
    description: 'Meet professionals over breakfast.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    host: { name: 'Taylor Morgan', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    tags: ['Breakfast', 'In-Person'],
    location: 'Cafe Luna, SF',
    attendees: [
      'https://randomuser.me/api/portraits/men/45.jpg',
      'https://randomuser.me/api/portraits/women/44.jpg',
      'https://randomuser.me/api/portraits/men/46.jpg',
    ],
  },
  {
    id: '2',
    title: 'Tech Mixer',
    date: '2024-06-05',
    description: 'Connect with tech enthusiasts.',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    host: { name: 'Jamie Lee', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    tags: ['Mixer', 'Tech'],
    location: 'The Hub, SF',
    attendees: [
      'https://randomuser.me/api/portraits/men/32.jpg',
      'https://randomuser.me/api/portraits/men/45.jpg',
      'https://randomuser.me/api/portraits/women/44.jpg',
      'https://randomuser.me/api/portraits/men/46.jpg',
    ],
  },
  {
    id: '3',
    title: 'Startup Pitch Night',
    date: '2024-06-10',
    description: 'Pitch your startup idea.',
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80',
    host: { name: 'Sam Patel', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
    tags: ['Pitch', 'Startup', 'Evening'],
    location: 'Innovation Hall, SF',
    attendees: [
      'https://randomuser.me/api/portraits/men/32.jpg',
      'https://randomuser.me/api/portraits/women/44.jpg',
    ],
  },
];

function AttendeesAvatars({ attendees }: { attendees: string[] }) {
  const router = useRouter();
  return (
    <View style={{ flexDirection: 'row', marginTop: 6 }}>
      {attendees.slice(0, 3).map((uri: string, i: number) => (
        <TouchableOpacity key={uri} onPress={() => router.push({ pathname: uri === 'https://randomuser.me/api/portraits/men/32.jpg' ? '/(tabs)/profile' : '/(tabs)/friend-profile', params: { id: /* map uri to id */ '' } })} activeOpacity={0.8}>
          <Image
            source={{ uri }}
            style={{ width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: '#fff', marginLeft: i === 0 ? 0 : -10 }}
          />
        </TouchableOpacity>
      ))}
      {attendees.length > 3 && (
        <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center', marginLeft: -10, borderWidth: 2, borderColor: '#fff' }}>
          <Text style={{ color: '#888', fontWeight: 'bold', fontSize: 13 }}>+{attendees.length - 3}</Text>
        </View>
      )}
    </View>
  );
}

export default function FeedScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [joinAnim] = useState(new Animated.Value(1));

  const handleJoin = () => {
    Animated.sequence([
      Animated.timing(joinAnim, { toValue: 1.15, duration: 120, useNativeDriver: true }),
      Animated.timing(joinAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
  };

  const handleEventPress = (event: any) => {
    router.push({ pathname: '/(tabs)/event-details', params: { id: event.id } });
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <IconSymbol name="person.2.fill" size={32} color={MagicPalette.purple} style={{ marginRight: 8 }} />
        <Text style={styles.greeting}>Welcome to Networking!</Text>
      </View>
      <MagicalButton
        title="Create Event"
        onPress={() => router.push('/(tabs)/create-event')}
        color={MagicPalette.purple}
        icon={<IconSymbol name="plus.circle.fill" size={22} color="#fff" style={{ marginRight: 8 }} />}
        style={{ marginBottom: 12 }}
      />
      <Text style={styles.sectionTitle}>Recent Events & Projects</Text>
      <FlatList
        data={events}
        keyExtractor={item => item.id}
        refreshing={refreshing}
        onRefresh={() => setRefreshing(false)}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleEventPress(item)} activeOpacity={0.9}>
            <LinearGradient colors={MagicGradients.card as [string, string, ...string[]]} style={styles.cardGradient}>
              <View style={styles.card}>
                <Image source={{ uri: item.image }} style={styles.cardImage} />
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: -18, marginBottom: 8 }}>
                  <TouchableOpacity onPress={() => router.push({ pathname: item.host.name === 'Taylor Morgan' ? '/(tabs)/profile' : '/(tabs)/friend-profile', params: { id: item.host.id } })} activeOpacity={0.8}>
                    <Image source={{ uri: item.host.avatar }} style={styles.hostAvatar} />
                  </TouchableOpacity>
                  <Text style={styles.hostName}>{item.host.name}</Text>
                  <View style={{ flexDirection: 'row', marginLeft: 8 }}>
                    {item.tags.map(tag => (
                      <LinearGradient key={tag} colors={MagicGradients.chip as [string, string]} style={styles.chip}><Text style={styles.chipText}>{tag}</Text></LinearGradient>
                    ))}
                  </View>
                </View>
                <Text style={styles.eventTitle}>{item.title}</Text>
                <Text style={styles.eventDate}>{item.date} • {item.location}</Text>
                <Text style={styles.eventDesc}>{item.description}</Text>
                <AttendeesAvatars attendees={item.attendees} />
                <Animated.View style={{ transform: [{ scale: joinAnim }], marginTop: 12 }}>
                  <TouchableOpacity style={[styles.joinBtn, { backgroundColor: MagicPalette.purple }]} onPress={handleJoin} activeOpacity={0.85}>
                    <IconSymbol name="person.2.fill" size={18} color={MagicPalette.white} style={{ marginRight: 8 }} />
                    <Text style={[styles.joinBtnText, { color: MagicPalette.white }]}>Join</Text>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}
        style={{ width: '100%' }}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 16,
  },
  cardGradient: {
    borderRadius: 18,
    marginBottom: 18,
    padding: 2,
  },
  card: {
    backgroundColor: 'transparent',
    borderRadius: 18,
    padding: 16,
    shadowColor: MagicPalette.purple,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderRadius: 14,
    marginBottom: 8,
    objectFit: 'cover',
  },
  hostAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: MagicPalette.white,
    marginRight: 8,
    marginTop: 2,
  },
  hostName: {
    fontWeight: 'bold',
    fontSize: 15,
    color: MagicPalette.purple,
    marginRight: 8,
  },
  chip: {
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginRight: 6,
    backgroundColor: 'transparent',
  },
  chipText: {
    color: MagicPalette.pink,
    fontWeight: '700',
    fontSize: 13,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: MagicPalette.purple,
    marginBottom: 2,
  },
  eventDate: {
    color: MagicPalette.teal,
    marginBottom: 2,
    fontSize: 13,
  },
  eventDesc: {
    fontSize: 15,
    color: MagicPalette.black,
    marginBottom: 8,
  },
  joinBtn: {
    backgroundColor: MagicPalette.purple,
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignSelf: 'flex-start',
    shadowColor: MagicPalette.purple,
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  joinBtnText: {
    color: MagicPalette.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
