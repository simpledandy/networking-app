import { IconSymbol } from '@/components/ui/IconSymbol';
import { MagicGradients, MagicPalette } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Mock data for consulting sessions
const mockSessions = [
  {
    id: '1',
    user: {
      name: 'Alex Chen',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      title: 'Senior Product Manager',
      company: 'TechCorp',
    },
    sessionType: 'one-to-one',
    topic: 'Startup Strategy Consultation',
    duration: '45 min',
    scheduledFor: 'Today, 2:00 PM',
    status: 'upcoming',
    price: '$150',
    sharedInterests: ['tech', 'startups', 'product'],
  },
  {
    id: '2',
    user: {
      name: 'Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      title: 'UX Designer',
      company: 'Design Studio',
    },
    sessionType: 'group',
    topic: 'Design Thinking Workshop',
    duration: '90 min',
    scheduledFor: 'Tomorrow, 10:00 AM',
    status: 'confirmed',
    price: '$75',
    sharedInterests: ['design', 'ux', 'creative'],
  },
  {
    id: '3',
    user: {
      name: 'Mike Rodriguez',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      title: 'Startup Founder',
      company: 'InnovateLab',
    },
    sessionType: 'one-to-one',
    topic: 'Investment Pitch Review',
    duration: '60 min',
    scheduledFor: 'Dec 15, 3:30 PM',
    status: 'pending',
    price: '$200',
    sharedInterests: ['startups', 'business', 'innovation'],
  },
  {
    id: '4',
    user: {
      name: 'Emma Wilson',
      avatar: 'https://randomuser.me/api/portraits/women/46.jpg',
      title: 'Software Engineer',
      company: 'CodeFlow',
    },
    sessionType: 'group',
    topic: 'AI/ML Best Practices',
    duration: '120 min',
    scheduledFor: 'Dec 20, 1:00 PM',
    status: 'completed',
    price: '$60',
    sharedInterests: ['tech', 'ai', 'development'],
  },
  {
    id: '5',
    user: {
      name: 'David Kim',
      avatar: 'https://randomuser.me/api/portraits/men/47.jpg',
      title: 'Investment Analyst',
      company: 'Venture Capital',
    },
    sessionType: 'one-to-one',
    topic: 'VC Funding Strategy',
    duration: '45 min',
    scheduledFor: 'Dec 25, 11:00 AM',
    status: 'cancelled',
    price: '$180',
    sharedInterests: ['business', 'investment', 'startups'],
  },
];

const sessionFilters = [
  { id: 'all', label: 'All', icon: 'calendar' },
  { id: 'upcoming', label: 'Upcoming', icon: 'clock.fill' },
  { id: 'completed', label: 'Completed', icon: 'checkmark.circle.fill' },
  { id: 'cancelled', label: 'Cancelled', icon: 'xmark.circle.fill' },
];

function SessionCard({ session, onPress }: { session: any; onPress: () => void }) {
  const { t } = useTranslation();
  const [scaleAnim] = useState(new Animated.Value(1));

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.98, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    onPress();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return MagicPalette.blue;
      case 'confirmed': return MagicPalette.green;
      case 'completed': return MagicPalette.purple;
      case 'cancelled': return MagicPalette.red;
      case 'pending': return MagicPalette.orange;
      default: return MagicPalette.gray;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming': return 'Upcoming';
      case 'confirmed': return 'Confirmed';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      case 'pending': return 'Pending';
      default: return 'Unknown';
    }
  };

  // Ensure sharedInterests is always an array
  const sharedInterests = session.sharedInterests || [];

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
        <LinearGradient colors={MagicGradients.card as [string, string, ...string[]]} style={styles.sessionCardGradient}>
          <View style={styles.sessionCard}>
            <View style={styles.sessionHeader}>
              <View style={styles.avatarContainer}>
                <Image source={{ uri: session.user.avatar }} style={styles.avatar} />
                <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(session.status) }]} />
              </View>
              
              <View style={styles.sessionInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.userName}>{session.user.name}</Text>
                  <View style={styles.priceContainer}>
                    <Text style={styles.priceText}>{session.price}</Text>
                  </View>
                </View>
                <Text style={styles.userTitle}>{session.user.title}</Text>
                <Text style={styles.userCompany}>{session.user.company}</Text>
              </View>
              
              <View style={styles.sessionMeta}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(session.status) }]}>
                  <Text style={styles.statusText}>{getStatusText(session.status)}</Text>
                </View>
              </View>
            </View>
            
            <Text style={styles.sessionTopic} numberOfLines={2}>
              {session.topic}
            </Text>
            
            <View style={styles.sessionDetails}>
              <View style={styles.detailRow}>
                <IconSymbol name="calendar" size={16} color={MagicPalette.darkGray} />
                <Text style={styles.detailText}>{session.scheduledFor}</Text>
              </View>
              <View style={styles.detailRow}>
                <IconSymbol name="clock" size={16} color={MagicPalette.darkGray} />
                <Text style={styles.detailText}>{session.duration}</Text>
              </View>
              <View style={styles.detailRow}>
                <IconSymbol name={session.sessionType === 'one-to-one' ? 'person.fill' : 'person.3.fill'} size={16} color={MagicPalette.darkGray} />
                <Text style={styles.detailText}>{session.sessionType === 'one-to-one' ? '1-on-1' : 'Group'}</Text>
              </View>
            </View>
            
            <View style={styles.sharedInterests}>
              {sharedInterests.slice(0, 3).map((interest: string, index: number) => (
                <View key={index} style={styles.interestChip}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

function FilterButton({ filter, isActive, onPress }: { filter: any; isActive: boolean; onPress: () => void }) {
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
          colors={isActive ? MagicGradients.purple as [string, string, ...string[]] : ['#f8f9fa', '#f8f9fa']} 
          style={[styles.filterButton, isActive && styles.activeFilterButton]}
        >
          <IconSymbol 
            name={filter.icon} 
            size={16} 
            color={isActive ? MagicPalette.white : MagicPalette.darkGray} 
            style={{ marginRight: 6 }} 
          />
          <Text style={[styles.filterText, isActive && styles.activeFilterText]}>
            {filter.label}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function SessionsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSessionPress = () => {
    router.push({
      pathname: '/chat-conversation',
      params: { chatId: '1' }
    });
  };

  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId);
  };

  const filteredSessions = mockSessions.filter(session => {
    if (activeFilter === 'upcoming') return session.status === 'upcoming';
    if (activeFilter === 'completed') return session.status === 'completed';
    if (activeFilter === 'cancelled') return session.status === 'cancelled';
    return true;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconSymbol name="calendar.badge.clock" size={32} color={MagicPalette.purple} style={{ marginRight: 12 }} />
        <View>
          <Text style={styles.title}>{t('sessions.title')}</Text>
          <Text style={styles.subtitle}>{t('sessions.subtitle')}</Text>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <FlatList
          data={sessionFilters}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <FilterButton
              filter={item}
              isActive={activeFilter === item.id}
              onPress={() => handleFilterChange(item.id)}
            />
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.filtersList}
        />
      </View>

      {/* Sessions List */}
      <FlatList
        data={filteredSessions}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <SessionCard
            session={item}
            onPress={handleSessionPress}
          />
        )}
        style={styles.sessionsList}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <IconSymbol name="message" size={48} color={MagicPalette.darkGray} />
            <Text style={styles.emptyText}>{t('sessions.noSessions')}</Text>
            <Text style={styles.emptySubtext}>{t('sessions.startConnecting')}</Text>
          </View>
        }
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: MagicPalette.purple,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: MagicPalette.darkGray,
    lineHeight: 22,
  },
  filtersContainer: {
    marginBottom: 20,
  },
  filtersList: {
    paddingHorizontal: 4,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 4,
    shadowColor: MagicPalette.purple,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  activeFilterButton: {
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: MagicPalette.darkGray,
  },
  activeFilterText: {
    color: MagicPalette.white,
  },
  sessionsList: {
    flex: 1,
  },
  sessionCardGradient: {
    borderRadius: 18,
    marginBottom: 12,
    padding: 2,
  },
  sessionCard: {
    backgroundColor: MagicPalette.white,
    borderRadius: 18,
    padding: 16,
    shadowColor: MagicPalette.purple,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: MagicPalette.white,
  },
  sessionInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: MagicPalette.purple,
  },
  priceContainer: {
    backgroundColor: MagicPalette.green,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priceText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: MagicPalette.white,
  },
  userTitle: {
    fontSize: 14,
    color: MagicPalette.darkGray,
    marginBottom: 2,
  },
  userCompany: {
    fontSize: 12,
    color: MagicPalette.darkGray,
  },
  sessionMeta: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: MagicPalette.white,
  },
  sessionTopic: {
    fontSize: 16,
    fontWeight: '600',
    color: MagicPalette.purple,
    lineHeight: 22,
    marginBottom: 12,
  },
  sessionDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 13,
    color: MagicPalette.darkGray,
    marginLeft: 6,
  },
  sharedInterests: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  interestChip: {
    backgroundColor: MagicPalette.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  interestText: {
    fontSize: 11,
    color: MagicPalette.darkGray,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: MagicPalette.darkGray,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: MagicPalette.darkGray,
    textAlign: 'center',
    lineHeight: 20,
  },
}); 