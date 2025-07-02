import { MagicPalette } from '@/constants/Colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const allFriends = {
  alex: {
    id: 'alex',
    name: 'Alex Johnson',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'Tech enthusiast and avid networker. Loves hackathons and coffee.',
    interests: ['Tech', 'Networking', 'Coffee'],
    connections: 42,
    sessions: 7,
    reviews: 5,
    eventsCreated: 2,
    comments: 12,
    reactions: 8,
    friends: [
      { id: 'jamie', name: 'Jamie Lee', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
      { id: 'sam', name: 'Sam Patel', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
    ],
  },
  jamie: {
    id: 'jamie',
    name: 'Jamie Lee',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    bio: 'Product designer and community builder. Always up for a chat!',
    interests: ['Design', 'Community', 'Art'],
    connections: 58,
    sessions: 10,
    reviews: 8,
    eventsCreated: 3,
    comments: 20,
    reactions: 15,
    friends: [
      { id: 'alex', name: 'Alex Johnson', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
      { id: 'sam', name: 'Sam Patel', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
    ],
  },
  sam: {
    id: 'sam',
    name: 'Sam Patel',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    bio: "Startup founder and connector. Let's build something amazing.",
    interests: ['Startups', 'AI', 'Pitching'],
    connections: 33,
    sessions: 5,
    reviews: 3,
    eventsCreated: 1,
    comments: 7,
    reactions: 4,
    friends: [
      { id: 'alex', name: 'Alex Johnson', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
      { id: 'jamie', name: 'Jamie Lee', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    ],
  },
};

function MagicalButton({ title, onPress, color = MagicPalette.purple, icon, style = {} }) {
  return (
    <TouchableOpacity style={[{
      flexDirection: 'row', alignItems: 'center', backgroundColor: color, borderRadius: 24, paddingVertical: 10, paddingHorizontal: 24, marginVertical: 4, alignSelf: 'center', shadowColor: color, shadowOpacity: 0.12, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 }, style]} onPress={onPress} activeOpacity={0.85}>
      {icon}
      <Text style={{ color: MagicPalette.white, fontWeight: 'bold', fontSize: 16 }}>{title}</Text>
    </TouchableOpacity>
  );
}

function getReputation(user) {
  let score = 0;
  score += Math.min(user.connections || 0, 200) * 2;
  score += Math.min(user.sessions || 0, 100) * 5;
  score += Math.min(user.reviews || 0, 50) * 10;
  score += Math.min(user.eventsCreated || 0, 50) * 8;
  score += Math.min((user.friends?.length || 0), 100) * 3;
  score += Math.min(user.comments || 0, 200) * 1;
  score += Math.min(user.reactions || 0, 200) * 0.5;
  return Math.min(Math.round(score), 1000);
}

function getLevel(score) {
  if (score < 200) return { label: 'Newbie', emoji: '🌱' };
  if (score < 400) return { label: 'Social Explorer', emoji: '🧭' };
  if (score < 600) return { label: 'Connector', emoji: '🤝' };
  if (score < 800) return { label: 'Influencer', emoji: '🌟' };
  return { label: 'Super Networker', emoji: '🚀' };
}

export default function FriendProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const friend = allFriends[id as keyof typeof allFriends];
  const currentUserId = 'taylor';

  if (id === currentUserId) {
    router.replace('/(tabs)/profile');
    return null;
  }

  if (!friend) return <View style={styles.container}><Text>Friend not found.</Text></View>;

  return (
    <ScrollView contentContainerStyle={{ alignItems: 'center', padding: 16 }}>
      <View style={styles.card}>
        <TouchableOpacity onPress={() => router.push({ pathname: id === 'taylor' ? '/(tabs)/profile' : '/(tabs)/friend-profile', params: { id } })} activeOpacity={0.8}>
          <Image source={{ uri: friend.avatar }} style={styles.avatar} />
        </TouchableOpacity>
        <Text style={styles.name}>{friend.name}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: MagicPalette.purple }}>{getReputation(friend)}</Text>
          <Text style={{ fontSize: 18, marginLeft: 6 }}>{getLevel(getReputation(friend)).emoji} {getLevel(getReputation(friend)).label}</Text>
        </View>
        {friend.bio && <Text style={{ fontSize: 15, color: MagicPalette.text, marginBottom: 8, textAlign: 'center' }}>{friend.bio}</Text>}
        {friend.interests && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 10 }}>
            {friend.interests.map((interest: string) => (
              <View key={interest} style={{ backgroundColor: MagicPalette.chip, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, margin: 3 }}>
                <Text style={{ color: MagicPalette.purple, fontWeight: '600', fontSize: 13 }}>{interest}</Text>
              </View>
            ))}
          </View>
        )}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 12 }}>
          <View style={{ alignItems: 'center', marginHorizontal: 12 }}>
            <Text style={{ fontWeight: 'bold', color: MagicPalette.purple }}>{friend.connections}</Text>
            <Text style={{ color: MagicPalette.gray, fontSize: 13 }}>Connections</Text>
          </View>
          <View style={{ alignItems: 'center', marginHorizontal: 12 }}>
            <Text style={{ fontWeight: 'bold', color: MagicPalette.purple }}>{friend.sessions}</Text>
            <Text style={{ color: MagicPalette.gray, fontSize: 13 }}>Sessions</Text>
          </View>
          <View style={{ alignItems: 'center', marginHorizontal: 12 }}>
            <Text style={{ fontWeight: 'bold', color: MagicPalette.purple }}>{friend.reviews}</Text>
            <Text style={{ color: MagicPalette.gray, fontSize: 13 }}>Reviews</Text>
          </View>
          <View style={{ alignItems: 'center', marginHorizontal: 12 }}>
            <Text style={{ fontWeight: 'bold', color: MagicPalette.purple }}>{friend.eventsCreated}</Text>
            <Text style={{ color: MagicPalette.gray, fontSize: 13 }}>Events</Text>
          </View>
        </View>
        <Text style={styles.friendsTitle}>Friends</Text>
        <FlatList
          data={friend.friends}
          keyExtractor={item => item.id}
          horizontal
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.friendCard} onPress={() => router.push({ pathname: '/(tabs)/friend-profile', params: { id: item.id } })}>
              <Image source={{ uri: item.avatar }} style={styles.friendAvatar} />
              <Text style={styles.friendName}>{item.name}</Text>
            </TouchableOpacity>
          )}
          style={{ marginTop: 8 }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MagicPalette.background,
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
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  friendsTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
    color: MagicPalette.purple,
  },
  friendCard: {
    alignItems: 'center',
    marginRight: 16,
  },
  friendAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 4,
    borderWidth: 2,
    borderColor: MagicPalette.white,
  },
  friendName: {
    fontSize: 13,
    color: MagicPalette.black,
    fontWeight: '600',
    textAlign: 'center',
    maxWidth: 60,
  },
}); 