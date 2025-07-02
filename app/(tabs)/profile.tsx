import { MagicPalette } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { useContext, useMemo, useState } from 'react';
import { Alert, Button, FlatList, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AuthContext } from '../_layout';

const profile = {
  name: 'Taylor Morgan',
  title: 'Product Designer',
  company: 'Designify',
  location: 'San Francisco, CA',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  interests: ['UX', 'Startups', 'AI', 'Networking'],
  bio: 'Passionate about connecting people and building beautiful products. Always open to new opportunities and collaborations.',
  connections: 128,
  sessions: 14,
  reviews: 23,
  friends: [
    { id: 'alex', name: 'Alex Johnson', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { id: 'jamie', name: 'Jamie Lee', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { id: 'sam', name: 'Sam Patel', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
  ],
};

const currentUserId = 'taylor';

function MagicalButton({ title, onPress, color = MagicPalette.purple, icon, style = {} }) {
  return (
    <TouchableOpacity style={[{
      flexDirection: 'row', alignItems: 'center', backgroundColor: color, borderRadius: 24, paddingVertical: 10, paddingHorizontal: 24, marginVertical: 4, alignSelf: 'center', shadowColor: color, shadowOpacity: 0.12, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 }, style]} onPress={onPress} activeOpacity={0.85}>
      {icon}
      <Text style={{ color: MagicPalette.white, fontWeight: 'bold', fontSize: 16 }}>{title}</Text>
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut, updateProfile } = useContext(AuthContext);
  if (!user) return null;
  const [editVisible, setEditVisible] = useState(false);
  const [editProfile, setEditProfile] = useState(user);

  // Mock additional activity data
  const eventsCreated = 12; // TODO: fetch from backend
  const comments = 34; // TODO: fetch from backend
  const reactions = 56; // TODO: fetch from backend

  // Reputation calculation
  const reputation = useMemo(() => {
    let score = 0;
    score += Math.min(user.connections, 200) * 2;
    score += Math.min(user.sessions, 100) * 5;
    score += Math.min(user.reviews, 50) * 10;
    score += Math.min(eventsCreated, 50) * 8;
    score += Math.min(user.friends.length, 100) * 3;
    score += Math.min(comments, 200) * 1;
    score += Math.min(reactions, 200) * 0.5;
    // Decay: mock last activity 10 days ago (no decay)
    // If last activity > 30 days, score *= 0.9
    return Math.min(Math.round(score), 1000);
  }, [user, eventsCreated, comments, reactions]);

  const getLevel = (score: number) => {
    if (score < 200) return { label: 'Newbie', emoji: '🌱' };
    if (score < 400) return { label: 'Social Explorer', emoji: '🧭' };
    if (score < 600) return { label: 'Connector', emoji: '🤝' };
    if (score < 800) return { label: 'Influencer', emoji: '🌟' };
    return { label: 'Super Networker', emoji: '🚀' };
  };
  const level = getLevel(reputation);

  const handleSave = () => {
    updateProfile(editProfile);
    setEditVisible(false);
    Alert.alert('Profile updated!');
  };

  return (
    <ScrollView contentContainerStyle={{ alignItems: 'center', padding: 16 }}>
      <View style={styles.card}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.title}>{user.title} at {user.company}</Text>
        <Text style={styles.location}>{user.location}</Text>
        <View style={styles.chipRow}>
          {(user.interests || []).map((interest) => (
            <View key={interest} style={styles.chip}>
              <Text style={styles.chipText}>{interest}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.bio}>{user.bio}</Text>
        {/* Reputation System */}
        <View style={styles.reputationBox}>
          <Text style={styles.repLabel}>Reputation</Text>
          <View style={styles.repRow}>
            <Text style={styles.repScore}>{reputation}</Text>
            <Text style={styles.repLevel}>{level.emoji} {level.label}</Text>
          </View>
          <View style={styles.repBarBg}>
            <View style={[styles.repBarFill, { width: `${reputation / 10}%` }]} />
          </View>
        </View>
        {/* End Reputation System */}
        <View style={styles.statsRow}>
          <View style={styles.stat}><Text style={styles.statNum}>{user.connections}</Text><Text style={styles.statLabel}>Connections</Text></View>
          <View style={styles.stat}><Text style={styles.statNum}>{user.sessions}</Text><Text style={styles.statLabel}>Sessions</Text></View>
          <View style={styles.stat}><Text style={styles.statNum}>{user.reviews}</Text><Text style={styles.statLabel}>Reviews</Text></View>
        </View>
        <MagicalButton title="Edit Profile" onPress={() => setEditVisible(true)} icon={null} />
        <MagicalButton title="Sign Out" onPress={() => { signOut(); router.replace('/sign-in'); }} color={MagicPalette.pink} icon={null} />
        <MagicalButton title="View/Add Reviews" onPress={() => router.push('/(tabs)/review')} color={MagicPalette.blue} icon={null} />
        <View style={styles.friendsSection}>
          <Text style={styles.friendsTitle}>Friends</Text>
          <FlatList
            data={user.friends || []}
            keyExtractor={item => item.id}
            horizontal
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.friendCard}
                onPress={() => {
                  if (item.id !== currentUserId) {
                    router.push({ pathname: '/(tabs)/friend-profile', params: { id: item.id } });
                  }
                }}
              >
                <Image source={{ uri: item.avatar }} style={styles.friendAvatar} />
                <Text style={styles.friendName}>{item.name}</Text>
              </TouchableOpacity>
            )}
            style={{ marginTop: 8 }}
          />
        </View>
      </View>
      <Modal visible={editVisible} animationType="slide">
        <View style={[styles.container, { justifyContent: 'center', backgroundColor: MagicPalette.gray }]}> 
          <View style={[styles.card, { width: '100%', backgroundColor: MagicPalette.white }]}> 
            <Text style={[styles.name, { color: MagicPalette.purple }]}>Edit Profile</Text>
            <TextInput value={editProfile.name} onChangeText={v => setEditProfile(p => ({ ...p, name: v }))} style={styles.input} placeholder="Name" placeholderTextColor={MagicPalette.darkGray} />
            <TextInput value={editProfile.title} onChangeText={v => setEditProfile(p => ({ ...p, title: v }))} style={styles.input} placeholder="Title" placeholderTextColor={MagicPalette.darkGray} />
            <TextInput value={editProfile.company} onChangeText={v => setEditProfile(p => ({ ...p, company: v }))} style={styles.input} placeholder="Company" placeholderTextColor={MagicPalette.darkGray} />
            <TextInput value={editProfile.location} onChangeText={v => setEditProfile(p => ({ ...p, location: v }))} style={styles.input} placeholder="Location" placeholderTextColor={MagicPalette.darkGray} />
            <TextInput value={editProfile.bio} onChangeText={v => setEditProfile(p => ({ ...p, bio: v }))} style={styles.input} placeholder="Bio" multiline placeholderTextColor={MagicPalette.darkGray} />
            <TextInput value={editProfile.avatar} onChangeText={v => setEditProfile(p => ({ ...p, avatar: v }))} style={styles.input} placeholder="Avatar URL" placeholderTextColor={MagicPalette.darkGray} />
            <Button title="Save" onPress={handleSave} color={MagicPalette.purple} />
            <Button title="Cancel" onPress={() => setEditVisible(false)} color={MagicPalette.darkGray} />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MagicPalette.gray,
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
    shadowColor: MagicPalette.purple,
    shadowOpacity: 0.10,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
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
    marginBottom: 4,
    color: MagicPalette.purple,
  },
  title: {
    fontSize: 16,
    color: MagicPalette.blue,
    marginBottom: 2,
  },
  location: {
    fontSize: 14,
    color: MagicPalette.teal,
    marginBottom: 10,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  chip: {
    backgroundColor: MagicPalette.teal,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  chipText: {
    color: MagicPalette.purple,
    fontWeight: '600',
  },
  bio: {
    fontSize: 15,
    color: MagicPalette.black,
    marginBottom: 16,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
    marginTop: 8,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statNum: {
    fontSize: 18,
    fontWeight: 'bold',
    color: MagicPalette.purple,
  },
  statLabel: {
    fontSize: 13,
    color: MagicPalette.darkGray,
  },
  editBtn: {
    backgroundColor: MagicPalette.purple,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginBottom: 10,
    marginTop: 4,
  },
  editBtnText: {
    color: MagicPalette.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  friendsSection: {
    marginTop: 24,
    width: '100%',
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
  },
  input: {
    borderWidth: 1,
    borderColor: MagicPalette.teal,
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
    color: MagicPalette.black,
    backgroundColor: MagicPalette.white,
  },
  reputationBox: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 8,
    padding: 12,
    backgroundColor: MagicPalette.gray,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: MagicPalette.purple,
    shadowColor: MagicPalette.purple,
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  repLabel: {
    fontWeight: 'bold',
    color: MagicPalette.purple,
    fontSize: 15,
    marginBottom: 2,
  },
  repRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 12,
  },
  repScore: {
    fontSize: 22,
    fontWeight: 'bold',
    color: MagicPalette.purple,
    marginRight: 8,
  },
  repLevel: {
    fontSize: 16,
    fontWeight: '600',
    color: MagicPalette.blue,
  },
  repBarBg: {
    width: '100%',
    height: 10,
    backgroundColor: MagicPalette.white,
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 2,
    borderWidth: 1,
    borderColor: MagicPalette.purple,
  },
  repBarFill: {
    height: '100%',
    backgroundColor: MagicPalette.purple,
    borderRadius: 5,
  },
}); 