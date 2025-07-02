import { IconSymbol } from '@/components/ui/IconSymbol';
import { MagicGradients, MagicPalette } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Animated, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Person = { id: string; name: string; avatar: string };

const topics = [
  { id: '1', title: 'Product Design', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80', trending: true, people: [{ id: 'alex', name: 'Alex Johnson', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' }] },
  { id: '2', title: 'AI & Machine Learning', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80', trending: true, people: [{ id: 'jamie', name: 'Jamie Lee', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' }] },
  { id: '3', title: 'Startup Funding', image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80', trending: false, people: [{ id: 'sam', name: 'Sam Patel', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' }] },
  { id: '4', title: 'Remote Work', image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80', trending: false, people: [{ id: 'taylor', name: 'Taylor Morgan', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' }] },
];

const initialFriends: Person[] = [
  { id: 'alex', name: 'Alex Johnson', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
];

export default function ExploreScreen() {
  const [search, setSearch] = useState('');
  const [findAnim] = useState(new Animated.Value(1));
  const [friends, setFriends] = useState(initialFriends);
  const [successMsg, setSuccessMsg] = useState('');
  const filtered = topics.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));
  const router = useRouter();

  const handleFind = (person: Person) => {
    Animated.sequence([
      Animated.timing(findAnim, { toValue: 1.12, duration: 120, useNativeDriver: true }),
      Animated.timing(findAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
    if (!friends.find(f => f.id === person.id)) {
      setFriends([...friends, person]);
      setSuccessMsg(`You are now friends with ${person.name}!`);
      setTimeout(() => setSuccessMsg(''), 1500);
    } else {
      setSuccessMsg(`Already friends with ${person.name}`);
      setTimeout(() => setSuccessMsg(''), 1200);
    }
  };

  const handleConnectNow = () => {
    const person: Person = topics[0].people[0];
    handleFind(person);
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <IconSymbol name="paperplane.fill" size={28} color="#007AFF" style={{ marginRight: 8 }} />
        <Text style={styles.title}>Explore Topics</Text>
      </View>
      <View style={styles.searchBar}>
        <IconSymbol name="chevron.left.forwardslash.chevron.right" size={20} color="#888" style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Search topics..."
          value={search}
          onChangeText={setSearch}
          style={styles.input}
        />
      </View>
      {successMsg ? <Text style={styles.successMsg}>{successMsg}</Text> : null}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <LinearGradient colors={MagicGradients.card as [string, string, ...string[]]} style={styles.cardGradient}>
            <View style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, marginTop: -18 }}>
                <Text style={[styles.topicTitle, { color: MagicPalette.purple }]}>{item.title}</Text>
                {item.trending && <View style={styles.trendingBadge}><Text style={styles.trendingText}>Trending</Text></View>}
              </View>
              {item.people.map(person => (
                <Animated.View key={person.id} style={{ transform: [{ scale: findAnim }] }}>
                  <TouchableOpacity style={[styles.findBtn, { backgroundColor: MagicPalette.purple }]} onPress={() => handleFind(person)} activeOpacity={0.85}>
                    <TouchableOpacity onPress={() => router.push({ pathname: person.id === 'taylor' ? '/(tabs)/profile' : '/(tabs)/friend-profile', params: { id: person.id } })} activeOpacity={0.8}>
                      <Image source={{ uri: person.avatar }} style={styles.personAvatar} />
                    </TouchableOpacity>
                    <Text style={[styles.findBtnText, { color: MagicPalette.white }]}>Find {person.name}</Text>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </LinearGradient>
        )}
        style={{ width: '100%' }}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
      <Text style={styles.cta}>Ready to connect? Start a conversation with someone new!</Text>
      <TouchableOpacity style={styles.connectBtn} onPress={handleConnectNow}>
        <IconSymbol name="plus.circle.fill" size={22} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.connectBtnText}>Connect Now</Text>
      </TouchableOpacity>
      <View style={styles.friendsSection}>
        <Text style={styles.friendsTitle}>Your Friends</Text>
        <FlatList
          data={friends}
          keyExtractor={item => item.id}
          horizontal
          renderItem={({ item }) => (
            <View style={styles.friendCard}>
              <TouchableOpacity onPress={() => router.push({ pathname: item.id === 'taylor' ? '/(tabs)/profile' : '/(tabs)/friend-profile', params: { id: item.id } })} activeOpacity={0.8}>
                <Image source={{ uri: item.avatar }} style={styles.friendAvatar} />
              </TouchableOpacity>
              <Text style={styles.friendName}>{item.name}</Text>
            </View>
          )}
          style={{ marginTop: 8 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  input: {
    flex: 1,
    borderWidth: 0,
    fontSize: 16,
    backgroundColor: 'transparent',
    paddingVertical: 6,
    paddingHorizontal: 0,
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
    height: 100,
    borderRadius: 14,
    marginBottom: 8,
    objectFit: 'cover',
  },
  topicTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: MagicPalette.purple,
    marginRight: 8,
  },
  trendingBadge: {
    backgroundColor: MagicPalette.yellow,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 4,
  },
  trendingText: {
    color: MagicPalette.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
  findBtn: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  findBtnText: {
    color: MagicPalette.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  cta: {
    fontSize: 16,
    fontWeight: '500',
    marginVertical: 24,
    textAlign: 'center',
  },
  connectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MagicPalette.purple,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'center',
    marginBottom: 8,
  },
  connectBtnText: {
    color: MagicPalette.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  successMsg: {
    color: '#2ecc40',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 15,
  },
  personAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
    borderWidth: 2,
    borderColor: MagicPalette.white,
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
    fontWeight: '600',
  },
});
