import { MagicGradients, MagicPalette } from '@/constants/Colors';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Animated, Easing, FlatList, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const events = [
  {
    id: '1',
    title: 'Networking Breakfast',
    date: '2024-06-01',
    description: 'Meet professionals over breakfast.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    host: { id: 'taylor', name: 'Taylor Morgan', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    tags: ['Breakfast', 'In-Person'],
    location: 'Cafe Luna, SF',
    attendees: [
      { id: 'alex', name: 'Alex Johnson', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
      { id: 'jamie', name: 'Jamie Lee', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
      { id: 'sam', name: 'Sam Patel', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
    ],
  },
  {
    id: '2',
    title: 'Tech Mixer',
    date: '2024-06-05',
    description: 'Connect with tech enthusiasts.',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    host: { id: 'jamie', name: 'Jamie Lee', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    tags: ['Mixer', 'Tech'],
    location: 'The Hub, SF',
    attendees: [
      { id: 'taylor', name: 'Taylor Morgan', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
      { id: 'alex', name: 'Alex Johnson', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
      { id: 'sam', name: 'Sam Patel', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
    ],
  },
  {
    id: '3',
    title: 'Startup Pitch Night',
    date: '2024-06-10',
    description: 'Pitch your startup idea.',
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80',
    host: { id: 'sam', name: 'Sam Patel', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
    tags: ['Pitch', 'Startup', 'Evening'],
    location: 'Innovation Hall, SF',
    attendees: [
      { id: 'taylor', name: 'Taylor Morgan', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
      { id: 'alex', name: 'Alex Johnson', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    ],
  },
];

const initialComments = {
  '1': [
    { id: 'c1', user: { name: 'Jamie Lee', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' }, text: 'Looking forward to this!' },
  ],
  '2': [],
  '3': [],
};

const initialReactions = {
  '1': { like: 2, celebrate: 1, insightful: 0 },
  '2': { like: 0, celebrate: 0, insightful: 0 },
  '3': { like: 0, celebrate: 0, insightful: 0 },
};

const palette = ['#7F7FD5', '#E684AE', '#86A8E7', '#91EAE4', '#FEC163', '#FF6F91'];

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

export default function EventDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const event = events.find(e => e.id === id);
  const [comments, setComments] = useState(initialComments[id as keyof typeof initialComments] || []);
  const [commentInput, setCommentInput] = useState('');
  const [reactions, setReactions] = useState<{ [key: string]: number }>(initialReactions[id as keyof typeof initialReactions] || {});
  const [confetti, setConfetti] = useState(false);
  const animValue = useRef(new Animated.Value(0)).current;

  if (!event) return <View style={styles.container}><Text>Event not found.</Text></View>;

  const handleAddComment = () => {
    if (commentInput.trim()) {
      setComments(prev => [
        ...prev,
        { id: Date.now().toString(), user: { name: 'Taylor Morgan', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' }, text: commentInput },
      ]);
      setCommentInput('');
      setConfetti(true);
      Animated.sequence([
        Animated.timing(animValue, { toValue: 1, duration: 400, useNativeDriver: true, easing: Easing.out(Easing.exp) }),
        Animated.timing(animValue, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start(() => setConfetti(false));
    }
  };

  const handleReact = (type: string) => {
    setReactions(prev => ({ ...prev, [type]: (prev[type] || 0) + 1 }));
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <LinearGradient colors={MagicGradients.main as [string, string, ...string[]]} style={{ flex: 1 }} start={{x:0,y:0}} end={{x:1,y:1}}>
        <ScrollView contentContainerStyle={{ alignItems: 'center', padding: 24, paddingBottom: 120, minHeight: '100%' }} keyboardShouldPersistTaps="handled">
          <BlurView intensity={90} tint="light" style={[styles.cardBlur, { marginTop: 40, marginBottom: 32 }] }>
            <View style={[styles.card, { backgroundColor: 'rgba(255,255,255,0.85)', borderWidth: 0, shadowColor: MagicPalette.purple, shadowOpacity: 0.18, shadowRadius: 24, shadowOffset: { width: 0, height: 8 }, elevation: 10 }] }>
              <Image
                source={{ uri: event.image && event.image.trim() !== '' ? event.image : 'https://cdn-icons-png.flaticon.com/512/747/747310.png' }}
                style={styles.image}
                resizeMode="cover"
              />
              <Text style={styles.title}>{event.title}</Text>
              <Text style={styles.date}>{event.date} • {event.location}</Text>
              <View style={styles.chipRow}>
                {event.tags.map(tag => (
                  <LinearGradient key={tag} colors={MagicGradients.chip as [string, string]} style={styles.chip}><Text style={styles.chipText}>{tag}</Text></LinearGradient>
                ))}
              </View>
              <Text style={styles.desc}>{event.description}</Text>
              <View style={styles.sectionDivider} />
              <Text style={styles.sectionTitle}>Host</Text>
              <TouchableOpacity onPress={() => router.push({ pathname: event.host.id === 'taylor' ? '/(tabs)/profile' : '/(tabs)/friend-profile', params: { id: event.host.id } })} activeOpacity={0.8} style={{ alignItems: 'center', marginBottom: 8 }}>
                <View style={styles.avatarRing}><Image source={{ uri: event.host.avatar }} style={styles.hostAvatar} /></View>
                <Text style={styles.hostName}>{event.host.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                  <Text style={{ fontSize: 15, fontWeight: 'bold', color: MagicPalette.purple }}>{getReputation(event.host)}</Text>
                  <Text style={{ fontSize: 15, marginLeft: 4 }}>{getLevel(getReputation(event.host)).emoji} {getLevel(getReputation(event.host)).label}</Text>
                </View>
              </TouchableOpacity>
              <Text style={styles.sectionTitle}>Attendees</Text>
              <FlatList
                data={event.attendees}
                keyExtractor={item => item.id}
                horizontal
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => router.push({ pathname: item.id === 'taylor' ? '/(tabs)/profile' : '/(tabs)/friend-profile', params: { id: item.id } })} activeOpacity={0.8} style={{ alignItems: 'center', marginRight: 16 }}>
                    <View style={styles.avatarRing}><Image source={{ uri: item.avatar }} style={styles.attendeeAvatar} /></View>
                    <Text style={styles.attendeeName}>{item.name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                      <Text style={{ fontSize: 13, fontWeight: 'bold', color: MagicPalette.purple }}>{getReputation(item)}</Text>
                      <Text style={{ fontSize: 13, marginLeft: 2 }}>{getLevel(getReputation(item)).emoji}</Text>
                    </View>
                  </TouchableOpacity>
                )}
                style={{ marginTop: 8 }}
                contentContainerStyle={{ paddingBottom: 8 }}
                showsHorizontalScrollIndicator={false}
              />
              <View style={styles.sectionDivider} />
              <View style={styles.reactionsRow}>
                {['👍','😂','🔥','💜','🎉'].map(emoji => (
                  <TouchableOpacity key={emoji} style={styles.reactBtn} onPress={() => handleReact(emoji)}>
                    <Animated.Text style={[styles.reactIcon, { transform: [{ scale: animValue }] }]}>{emoji}</Animated.Text>
                    <Text>{reactions[emoji] || 0}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.sectionTitle}>Comments</Text>
              <BlurView intensity={60} tint="light" style={[styles.commentsSection, { marginBottom: 0, marginTop: 8, borderWidth: 0, backgroundColor: 'rgba(255,255,255,0.7)' }] }>
                {comments.length === 0 && (
                  <Text style={styles.noCommentsText}>No comments yet. Be the first!</Text>
                )}
                <FlatList
                  data={comments}
                  keyExtractor={item => item.id}
                  renderItem={({ item }) => (
                    <View style={styles.commentCard}>
                      <TouchableOpacity onPress={() => router.push({ pathname: item.user.id === 'taylor' ? '/(tabs)/profile' : '/(tabs)/friend-profile', params: { id: item.user.id } })} activeOpacity={0.8}>
                        <View style={styles.avatarRing}><Image source={{ uri: item.user.avatar }} style={styles.commentAvatar} /></View>
                      </TouchableOpacity>
                      <View style={styles.commentContent}>
                        <Text style={styles.commentName}>{item.user.name}</Text>
                        <Text style={styles.commentText}>{item.text}</Text>
                      </View>
                    </View>
                  )}
                  style={{ width: '100%' }}
                  scrollEnabled={false}
                />
              </BlurView>
            </View>
          </BlurView>
        </ScrollView>
        <BlurView intensity={60} tint="light" style={[styles.inputBarBlur, { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 8, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.85)', zIndex: 10 }] }>
          <View style={[styles.commentInputRow, { backgroundColor: 'transparent', padding: 0 }] }>
            <Image source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} style={styles.commentAvatar} />
            <TextInput
              value={commentInput}
              onChangeText={setCommentInput}
              placeholder="Add a comment..."
              style={[styles.commentInput, { fontSize: 16, backgroundColor: 'transparent' }]}
              placeholderTextColor={MagicPalette.purple}
              onSubmitEditing={handleAddComment}
              returnKeyType="send"
            />
            <TouchableOpacity style={styles.addCommentBtn} onPress={handleAddComment}>
              <Text style={{ color: MagicPalette.white, fontWeight: 'bold' }}>Post</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
        {confetti && <View style={styles.confetti}><Text style={{ fontSize: 40 }}>🎊🎉✨</Text></View>}
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MagicPalette.white,
    alignItems: 'center',
    padding: 16,
  },
  scrollContainer: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: MagicPalette.white,
    minHeight: '100%',
  },
  card: {
    backgroundColor: MagicPalette.white,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    maxWidth: 420,
    marginTop: 32,
    borderWidth: 1,
    borderColor: MagicPalette.border,
  },
  image: {
    width: '100%',
    maxWidth: 380,
    height: 140,
    borderRadius: 18,
    marginBottom: 12,
    objectFit: 'cover',
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: MagicPalette.purple,
    shadowColor: MagicPalette.purple,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  title: {
    fontFamily: 'System',
    fontWeight: '900',
    fontSize: 26,
    color: MagicPalette.purple,
    marginBottom: 4,
    textAlign: 'left',
  },
  date: {
    color: MagicPalette.gray,
    marginBottom: 4,
    fontSize: 13,
    textAlign: 'left',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  chip: {
    backgroundColor: MagicPalette.chip,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginRight: 6,
    marginBottom: 6,
  },
  chipText: {
    color: MagicPalette.purple,
    fontWeight: '600',
    fontSize: 13,
  },
  desc: {
    fontSize: 15,
    color: MagicPalette.text,
    marginBottom: 16,
    textAlign: 'left',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 12,
    marginBottom: 6,
    color: MagicPalette.purple,
    alignSelf: 'flex-start',
    textAlign: 'left',
  },
  hostRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  hostAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    borderWidth: 2,
    borderColor: MagicPalette.white,
  },
  hostName: {
    fontWeight: 'bold',
    fontSize: 15,
    color: MagicPalette.blue,
  },
  attendeeCard: {
    alignItems: 'center',
    marginRight: 16,
  },
  attendeeAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginBottom: 4,
    borderWidth: 2,
    borderColor: MagicPalette.white,
  },
  attendeeName: {
    fontSize: 13,
    color: MagicPalette.text,
    fontWeight: '600',
    textAlign: 'center',
    maxWidth: 60,
  },
  reactionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 12,
    gap: 16,
  },
  reactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MagicPalette.background,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginHorizontal: 4,
  },
  reactIcon: {
    fontSize: 18,
    marginRight: 4,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: MagicPalette.border,
    alignSelf: 'stretch',
    marginVertical: 18,
    borderRadius: 1,
  },
  commentsSection: {
    width: '100%',
    backgroundColor: MagicPalette.background,
    borderRadius: 16,
    padding: 14,
    marginTop: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: MagicPalette.border,
  },
  noCommentsText: {
    color: MagicPalette.gray,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 8,
  },
  commentCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: MagicPalette.white,
    borderRadius: 12,
    padding: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: MagicPalette.border,
  },
  commentContent: {
    flex: 1,
  },
  commentAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
    borderWidth: 1,
    borderColor: MagicPalette.white,
  },
  commentName: {
    fontWeight: 'bold',
    fontSize: 13,
    color: MagicPalette.blue,
    marginRight: 8,
  },
  commentText: {
    fontSize: 14,
    color: MagicPalette.text,
    flex: 1,
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: MagicPalette.white,
    borderRadius: 16,
    padding: 8,
  },
  commentInput: {
    flex: 1,
    borderWidth: 0,
    fontSize: 15,
    backgroundColor: 'transparent',
    paddingVertical: 6,
    paddingHorizontal: 0,
    marginRight: 8,
  },
  addCommentBtn: {
    backgroundColor: MagicPalette.purple,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  cardBlur: { borderRadius: 24, marginTop: 32, marginBottom: 16, marginHorizontal: 0, overflow: 'hidden', shadowColor: MagicPalette.purple, shadowOpacity: 0.12, shadowRadius: 24, shadowOffset: { width: 0, height: 8 }, elevation: 8 },
  avatarRing: { borderWidth: 2, borderColor: MagicPalette.purple, borderRadius: 20, padding: 2, marginHorizontal: 2 },
  inputBarBlur: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 8, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.85)', zIndex: 10 },
  fab: { backgroundColor: MagicPalette.yellow, borderRadius: 24, padding: 10, marginLeft: 6, shadowColor: MagicPalette.yellow, shadowOpacity: 0.2, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  confetti: { position: 'absolute', top: 60, left: 0, right: 0, alignItems: 'center', zIndex: 20 },
}); 