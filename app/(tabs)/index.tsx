import { IconSymbol } from '@/components/ui/IconSymbol';
import { MagicGradients, MagicPalette } from '@/constants/Colors';
import { findBestMatches, User } from '@/utils/purposeMatching';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Animated, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Activity categories with icons and colors
const activityCategories = [
  {
    id: 'sports',
    icon: 'sportscourt.fill',
    color: MagicPalette.orange,
    gradient: [MagicPalette.orange, MagicPalette.yellow],
  },
  {
    id: 'travel',
    icon: 'airplane',
    color: MagicPalette.blue,
    gradient: [MagicPalette.blue, MagicPalette.teal],
  },
  {
    id: 'tech',
    icon: 'laptopcomputer',
    color: MagicPalette.purple,
    gradient: [MagicPalette.purple, MagicPalette.pink],
  },
  {
    id: 'creative',
    icon: 'paintbrush.fill',
    color: MagicPalette.hotPink,
    gradient: [MagicPalette.hotPink, MagicPalette.orange],
  },
  {
    id: 'business',
    icon: 'building.2.fill',
    color: MagicPalette.teal,
    gradient: [MagicPalette.teal, MagicPalette.green],
  },
  {
    id: 'social',
    icon: 'person.3.fill',
    color: MagicPalette.pink,
    gradient: [MagicPalette.pink, MagicPalette.purple],
  },
  {
    id: 'learning',
    icon: 'book.fill',
    color: MagicPalette.green,
    gradient: [MagicPalette.green, MagicPalette.blue],
  },
  {
    id: 'food',
    icon: 'fork.knife',
    color: MagicPalette.yellow,
    gradient: [MagicPalette.yellow, MagicPalette.orange],
  },
  {
    id: 'music',
    icon: 'music.note',
    color: MagicPalette.purple,
    gradient: [MagicPalette.purple, MagicPalette.hotPink],
  },
  {
    id: 'gaming',
    icon: 'gamecontroller.fill',
    color: MagicPalette.blue,
    gradient: [MagicPalette.blue, MagicPalette.purple],
  },
  {
    id: 'fitness',
    icon: 'figure.run',
    color: MagicPalette.green,
    gradient: [MagicPalette.green, MagicPalette.teal],
  },
  {
    id: 'outdoors',
    icon: 'leaf.fill',
    color: MagicPalette.teal,
    gradient: [MagicPalette.teal, MagicPalette.green],
  },
];

// Mock data for matched people
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alex Chen',
    title: 'Senior Product Manager',
    company: 'TechCorp',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    purposes: ['tech', 'business'],
    interests: ['tech', 'ux', 'startups'],
    bio: 'Experienced PM looking to mentor junior developers and designers',
    location: 'San Francisco, CA',
    connections: 156,
    sessions: 23,
    reviews: 45,
    level: 'connector',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    title: 'UX Designer',
    company: 'Design Studio',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    purposes: ['creative', 'tech'],
    interests: ['design', 'art', 'ux'],
    bio: 'Creative designer seeking collaboration on innovative projects',
    location: 'New York, NY',
    connections: 89,
    sessions: 12,
    reviews: 28,
    level: 'socialExplorer',
  },
  {
    id: '3',
    name: 'Mike Rodriguez',
    title: 'Startup Founder',
    company: 'InnovateLab',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    purposes: ['business', 'tech'],
    interests: ['startups', 'tech', 'ai'],
    bio: 'Building the next big thing in fintech. Looking for co-founders and investors',
    location: 'Austin, TX',
    connections: 234,
    sessions: 45,
    reviews: 67,
    level: 'influencer',
  },
  {
    id: '4',
    name: 'Emma Wilson',
    title: 'Software Engineer',
    company: 'CodeFlow',
    avatar: 'https://randomuser.me/api/portraits/women/46.jpg',
    purposes: ['tech', 'learning'],
    interests: ['tech', 'ai', 'gaming'],
    bio: 'Full-stack developer passionate about AI and machine learning',
    location: 'Seattle, WA',
    connections: 67,
    sessions: 8,
    reviews: 15,
    level: 'newbie',
  },
  {
    id: '5',
    name: 'David Kim',
    title: 'Investment Analyst',
    company: 'Venture Capital',
    avatar: 'https://randomuser.me/api/portraits/men/47.jpg',
    purposes: ['business', 'social'],
    interests: ['startups', 'business', 'networking'],
    bio: 'Looking for promising startups and innovative business ideas',
    location: 'Boston, MA',
    connections: 189,
    sessions: 34,
    reviews: 52,
    level: 'connector',
  },
];

// Mock chat data
const mockChats = [
  {
    id: '1',
    user: mockUsers[0],
    lastMessage: 'Hey! I saw you\'re into tech startups. Would love to connect!',
    timestamp: '2m ago',
    unread: 1,
  },
  {
    id: '2',
    user: mockUsers[1],
    lastMessage: 'Thanks for the connection request! Let\'s chat about design collaboration.',
    timestamp: '15m ago',
    unread: 0,
  },
  {
    id: '3',
    user: mockUsers[2],
    lastMessage: 'Your startup idea sounds interesting. When are you free to discuss?',
    timestamp: '1h ago',
    unread: 2,
  },
];

function CategoryCard({ category, isSelected, onPress }: { category: any; isSelected: boolean; onPress: () => void }) {
  const { t } = useTranslation();
  const [scaleAnim] = useState(new Animated.Value(1));

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    onPress();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
        <LinearGradient 
          colors={isSelected ? category.gradient : ['#f8f9fa', '#f8f9fa']} 
          style={[styles.categoryCard, isSelected && styles.selectedCard]}
        >
          <IconSymbol 
            name={category.icon} 
            size={20} 
            color={isSelected ? MagicPalette.white : category.color} 
            style={{ marginBottom: 6 }} 
          />
          <Text style={[styles.categoryText, isSelected && styles.selectedText]}>
            {t(`category.${category.id}`)}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}



function MatchCard({ match, onConnect, onMessage, onViewProfile }: { 
  match: { user: User; score: number; reasons: string[] }; 
  onConnect: () => void; 
  onMessage: () => void; 
  onViewProfile: () => void; 
}) {
  const { t } = useTranslation();
  const [connectAnim] = useState(new Animated.Value(1));

  const handleConnect = () => {
    Animated.sequence([
      Animated.timing(connectAnim, { toValue: 1.1, duration: 150, useNativeDriver: true }),
      Animated.timing(connectAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
    onConnect();
  };

  return (
    <LinearGradient colors={MagicGradients.card as [string, string, ...string[]]} style={styles.matchCardGradient}>
      <View style={styles.matchCard}>
        <View style={styles.matchHeader}>
          <TouchableOpacity onPress={onViewProfile} activeOpacity={0.8}>
            <Image source={{ uri: match.user.avatar }} style={styles.matchAvatar} />
          </TouchableOpacity>
          <View style={styles.matchInfo}>
            <Text style={styles.matchName}>{match.user.name}</Text>
            <Text style={styles.matchTitle}>{match.user.title}</Text>
            <Text style={styles.matchCompany}>{match.user.company}</Text>
          </View>
          <View style={styles.matchScore}>
            <Text style={styles.matchScoreText}>{match.score}%</Text>
            <Text style={styles.matchScoreLabel}>Match</Text>
          </View>
        </View>
        
        <Text style={styles.matchBio}>{match.user.bio}</Text>
        <Text style={styles.matchLocation}>{match.user.location}</Text>
        
        {match.reasons && match.reasons.length > 0 && (
          <View style={styles.matchReasons}>
            {match.reasons.slice(0, 2).map((reason, index) => (
              <View key={index} style={styles.reasonChip}>
                <Text style={styles.reasonText}>{reason}</Text>
              </View>
            ))}
          </View>
        )}
        
        <View style={styles.matchActions}>
          <Animated.View style={{ transform: [{ scale: connectAnim }] }}>
            <TouchableOpacity style={styles.connectBtn} onPress={handleConnect} activeOpacity={0.85}>
              <IconSymbol name="person.2.fill" size={16} color={MagicPalette.white} style={{ marginRight: 6 }} />
              <Text style={styles.connectBtnText}>{t('activity.connect')}</Text>
            </TouchableOpacity>
          </Animated.View>
          
          <TouchableOpacity style={styles.messageBtn} onPress={onMessage} activeOpacity={0.85}>
            <IconSymbol name="bubble.left.fill" size={16} color={MagicPalette.purple} style={{ marginRight: 6 }} />
            <Text style={styles.messageBtnText}>{t('activity.message')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

export default function ConnectScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isMatching, setIsMatching] = useState(false);
  const [matches, setMatches] = useState<{ user: User; score: number; reasons: string[] }[]>([]);
  const [showMatches, setShowMatches] = useState(false);

  // Mock current user data
  const currentUser: User = {
    id: 'current',
    name: 'Taylor Morgan',
    title: 'Product Designer',
    company: 'Designify',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    purposes: selectedCategories,
    interests: ['UX', 'Startups', 'AI', 'Networking'],
    bio: 'Passionate about connecting people and building beautiful products.',
    location: 'San Francisco, CA',
    connections: 128,
    sessions: 14,
    reviews: 23,
    level: 'connector',
  };

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const handleFindMatches = () => {
    if (selectedCategories.length === 0) return;
    
    setIsMatching(true);
    setShowMatches(false);
    
    // Simulate API call with the new matching algorithm
    setTimeout(() => {
      const userWithPurposes = { ...currentUser, purposes: selectedCategories };
      const bestMatches = findBestMatches(userWithPurposes, mockUsers, 10);
      setMatches(bestMatches);
      setIsMatching(false);
      setShowMatches(true);
    }, 2000);
  };

  const handleConnect = () => {
    // Handle connection logic
    console.log('Connecting...');
  };

  const handleMessage = () => {
    router.push({
      pathname: '/chat-conversation',
      params: { chatId: '1' }
    });
  };

  const handleViewProfile = () => {
    router.push('/(tabs)/friend-profile');
  };

  const handleChatPress = () => {
    router.push({
      pathname: '/chat-conversation',
      params: { chatId: '1' }
    });
  };

  if (isMatching) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient colors={MagicGradients.main as [string, string, ...string[]]} style={styles.loadingCard}>
          <ActivityIndicator size="large" color={MagicPalette.white} />
          <Text style={styles.loadingText}>{t('activity.matching')}</Text>
        </LinearGradient>
      </View>
    );
  }

  if (showMatches) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setShowMatches(false)} style={styles.backButton}>
            <IconSymbol name="chevron.left" size={24} color={MagicPalette.purple} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('activity.matchesFound', { count: matches.length })}</Text>
        </View>
        
        <FlatList
          data={matches}
          keyExtractor={item => item.user.id}
          renderItem={({ item }) => (
            <MatchCard
              match={item}
              onConnect={handleConnect}
              onMessage={handleMessage}
              onViewProfile={handleViewProfile}
            />
          )}
          style={styles.matchesList}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <IconSymbol name="person.2.slash" size={48} color={MagicPalette.darkGray} />
              <Text style={styles.emptyText}>{t('activity.noMatches')}</Text>
            </View>
          }
        />
      </View>
    );
  }

  return (
    <LinearGradient colors={MagicGradients.main as [string, string, ...string[]]} style={styles.container}>
      {/* Header with Chat Icon */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <IconSymbol name="sparkles" size={32} color={MagicPalette.white} style={{ marginRight: 12 }} />
          <View>
            <Text style={styles.title}>{t('activity.whatToDo')}</Text>
            <Text style={styles.subtitle}>{t('activity.discoverPeople')}</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.chatIcon} onPress={handleChatPress}>
          <IconSymbol name="bubble.left.and.bubble.right.fill" size={24} color={MagicPalette.white} />
          {mockChats.some(chat => chat.unread > 0) && (
            <View style={styles.unreadIndicator}>
              <Text style={styles.unreadCount}>
                {mockChats.reduce((sum, chat) => sum + chat.unread, 0)}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Selected Categories */}
        {selectedCategories.length > 0 && (
          <View style={styles.selectedSection}>
            <Text style={styles.selectedTitle}>{t('activity.selectedCategories')}</Text>
            <View style={styles.selectedCategories}>
              {selectedCategories.map(categoryId => {
                const category = activityCategories.find(cat => cat.id === categoryId);
                return (
                  <View key={categoryId} style={styles.selectedChip}>
                    <Text style={styles.selectedChipText}>{t(`category.${categoryId}`)}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.categoriesTitle}>{t('activity.chooseCategory')}</Text>
          <FlatList
            data={activityCategories}
            keyExtractor={item => item.id}
            numColumns={3}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <CategoryCard
                category={item}
                isSelected={selectedCategories.includes(item.id)}
                onPress={() => handleCategoryPress(item.id)}
              />
            )}
            style={styles.categoriesList}
            contentContainerStyle={styles.categoriesContent}
            scrollEnabled={false}
          />
        </View>

        {/* Find People Button */}
        <View style={styles.bottomActions}>
          <TouchableOpacity 
            style={[
              styles.findPeopleButton,
              selectedCategories.length === 0 && styles.findPeopleButtonDisabled
            ]} 
            onPress={handleFindMatches}
            disabled={selectedCategories.length === 0}
          >
            <LinearGradient 
              colors={selectedCategories.length > 0 
                ? MagicGradients.purple as [string, string, ...string[]]
                : [MagicPalette.lightGray, MagicPalette.lightGray]
              } 
              style={styles.findPeopleButtonGradient}
            >
              <IconSymbol name="sparkles" size={20} color={selectedCategories.length > 0 ? MagicPalette.white : MagicPalette.darkGray} />
              <Text style={[
                styles.findPeopleButtonText,
                selectedCategories.length === 0 && styles.findPeopleButtonTextDisabled
              ]}>
                {t('activity.findPeople')}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: MagicPalette.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  loadingCard: {
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: 200,
  },
  loadingText: {
    color: MagicPalette.white,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  chatIcon: {
    position: 'relative',
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: MagicPalette.purple,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  unreadIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: MagicPalette.hotPink,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: MagicPalette.white,
  },
  unreadCount: {
    color: MagicPalette.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: MagicPalette.purple,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: MagicPalette.white,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: MagicPalette.white,
    opacity: 0.9,
    lineHeight: 22,
  },

  categoriesSection: {
    marginBottom: 24,
    flex: 1,
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: MagicPalette.purple,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  categoriesList: {
    flex: 1,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  categoryCard: {
    flex: 1,
    aspectRatio: 1,
    margin: 6,
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: MagicPalette.purple,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    minHeight: 80,
  },
  selectedCard: {
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    color: MagicPalette.darkGray,
    marginTop: 4,
  },
  selectedText: {
    color: MagicPalette.white,
  },
  selectedSection: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  selectedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: MagicPalette.purple,
    marginBottom: 12,
  },
  selectedCategories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MagicPalette.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: MagicPalette.purple,
    shadowColor: MagicPalette.purple,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  selectedChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: MagicPalette.purple,
  },
  bottomActions: {
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  findPeopleButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: MagicPalette.purple,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  findPeopleButtonDisabled: {
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  findPeopleButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  findPeopleButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: MagicPalette.white,
    marginLeft: 8,
  },
  findPeopleButtonTextDisabled: {
    color: MagicPalette.darkGray,
  },

  matchesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  matchCardGradient: {
    borderRadius: 18,
    marginBottom: 16,
    padding: 2,
  },
  matchCard: {
    backgroundColor: MagicPalette.white,
    borderRadius: 18,
    padding: 16,
    shadowColor: MagicPalette.purple,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  matchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  matchAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  matchInfo: {
    flex: 1,
  },
  matchName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: MagicPalette.purple,
    marginBottom: 2,
  },
  matchTitle: {
    fontSize: 14,
    color: MagicPalette.darkGray,
    marginBottom: 2,
  },
  matchCompany: {
    fontSize: 12,
    color: MagicPalette.darkGray,
  },
  matchScore: {
    alignItems: 'center',
  },
  matchScoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: MagicPalette.green,
  },
  matchScoreLabel: {
    fontSize: 10,
    color: MagicPalette.darkGray,
  },
  matchBio: {
    fontSize: 14,
    color: MagicPalette.darkGray,
    lineHeight: 20,
    marginBottom: 8,
  },
  matchLocation: {
    fontSize: 12,
    color: MagicPalette.darkGray,
    marginBottom: 16,
  },
  matchReasons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  reasonChip: {
    backgroundColor: MagicPalette.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  reasonText: {
    fontSize: 11,
    color: MagicPalette.darkGray,
    fontWeight: '500',
  },
  matchActions: {
    flexDirection: 'row',
    gap: 12,
  },
  connectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: MagicPalette.purple,
    padding: 12,
    borderRadius: 8,
  },
  connectBtnText: {
    color: MagicPalette.white,
    fontWeight: '600',
    fontSize: 14,
  },
  messageBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: MagicPalette.white,
    borderWidth: 1,
    borderColor: MagicPalette.purple,
    padding: 12,
    borderRadius: 8,
  },
  messageBtnText: {
    color: MagicPalette.purple,
    fontWeight: '600',
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: MagicPalette.darkGray,
    textAlign: 'center',
    marginTop: 16,
  },
});
