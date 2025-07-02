import { IconSymbol } from '@/components/ui/IconSymbol';
import { MagicGradients, MagicPalette } from '@/constants/Colors';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const users = {
  alex: { id: 'alex', name: 'Alex Johnson', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  jamie: { id: 'jamie', name: 'Jamie Lee', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  sam: { id: 'sam', name: 'Sam Patel', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
  taylor: { id: 'taylor', name: 'Taylor Morgan', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
};

const initialReviews = {
  alex: [
    { id: '1', text: 'Great session!', rating: 5, avatar: users.jamie.avatar, name: users.jamie.name, date: '2024-06-01' },
  ],
  jamie: [],
  sam: [],
  taylor: [],
};

type Review = { id: string; text: string; rating: number; avatar: string; name: string; date: string };

export default function ReviewScreen() {
  const { userId } = useLocalSearchParams<{ userId?: string }>();
  const targetId = userId || 'alex';
  const user = users[targetId as keyof typeof users];
  const [reviewsByUser, setReviewsByUser] = useState<{ [key: string]: any[] }>(initialReviews);
  const [input, setInput] = useState('');
  const [rating, setRating] = useState(0);
  const [starAnim, setStarAnim] = useState(-1);

  const submitReview = () => {
    if (input.trim() && rating > 0) {
      const newReview: Review = {
        id: Date.now().toString(),
        text: input,
        rating,
        avatar: users.taylor.avatar, // Assume current user is Taylor
        name: users.taylor.name,
        date: new Date().toISOString().slice(0, 10),
      };
      setReviewsByUser(prev => ({
        ...prev,
        [targetId]: [newReview, ...(prev[targetId] || [])],
      }));
      setInput('');
      setRating(0);
      setStarAnim(-1);
    }
  };

  return (
    <View style={styles.bg}>
      <View style={styles.card}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
          <Text style={styles.userName}>Review {user.name}</Text>
        </View>
        <Text style={styles.title}>Leave a Review</Text>
        <View style={styles.starsRow}>
          {[1,2,3,4,5].map(i => (
            <TouchableOpacity
              key={i}
              onPress={() => { setRating(i); setStarAnim(i); setTimeout(() => setStarAnim(-1), 150); }}
              activeOpacity={0.7}
              style={{ transform: [{ scale: starAnim === i ? 1.2 : 1 }] }}
            >
              <Text style={{ fontSize: 28, color: i <= rating ? MagicPalette.yellow : '#ccc' }}>{i <= rating ? '★' : '☆'}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Write your review..."
          style={styles.input}
        />
        <TouchableOpacity style={styles.submitBtn} onPress={submitReview}>
          <IconSymbol name="paperplane.fill" size={20} color={MagicPalette.white} style={{ marginRight: 8 }} />
          <Text style={styles.submitBtnText}>Submit</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>Reviews</Text>
      <FlatList
        data={reviewsByUser[targetId] || []}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.reviewCard}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                {[1,2,3,4,5].map(i => (
                  <Text key={i} style={{ color: i <= item.rating ? MagicPalette.yellow : '#ccc', fontSize: 18 }}>{i <= item.rating ? '★' : '☆'}</Text>
                ))}
                <Text style={styles.date}>{item.date}</Text>
                <Text style={styles.reviewerName}>{item.name}</Text>
              </View>
              <Text style={styles.reviewText}>{item.text}</Text>
            </View>
          </View>
        )}
        style={{ width: '100%' }}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
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
    padding: 20,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginBottom: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  input: {
    borderWidth: 0,
    borderRadius: 16,
    backgroundColor: '#f0f4f8',
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 12,
    width: '100%',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginTop: 4,
    marginBottom: 2,
    alignSelf: 'center',
    shadowColor: '#007AFF',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  submitBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 12,
    alignSelf: 'flex-start',
  },
  reviewCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: MagicPalette.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    width: '100%',
    maxWidth: 400,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    marginTop: 2,
  },
  reviewText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginLeft: 8,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#007AFF',
  },
  reviewerName: {
    fontSize: 13,
    color: '#888',
    marginLeft: 8,
    fontWeight: '600',
  },
}); 