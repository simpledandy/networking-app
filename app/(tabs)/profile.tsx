import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { MagicalButton } from '@/components/ui/MagicalButton';
import { MagicGradients, MagicPalette } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Activity categories for profile
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
            size={24} 
            color={isSelected ? MagicPalette.white : category.color} 
            style={{ marginBottom: 4 }} 
          />
          <Text style={[styles.categoryText, isSelected && styles.selectedText]}>
            {t(`category.${category.id}`)}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: string; icon: string; color: string }) {
  return (
    <View style={styles.statCard}>
      <IconSymbol name={icon} size={20} color={color} style={{ marginBottom: 8 }} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['tech', 'business', 'creative']);
  const [isAvailable, setIsAvailable] = useState(true);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSignOut = () => {
    router.push('/sign-in');
  };

  const handleEditProfile = () => {
    // Handle profile editing
    console.log('Edit profile');
  };

  const toggleAvailability = () => {
    setIsAvailable(!isAvailable);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <LinearGradient colors={MagicGradients.main as [string, string, ...string[]]} style={styles.profileHeader}>
        <View style={styles.profileInfo}>
          <Image 
            source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} 
            style={styles.profileAvatar} 
          />
          <View style={styles.profileDetails}>
            <Text style={styles.profileName}>Taylor Morgan</Text>
            <Text style={styles.profileTitle}>Product Designer</Text>
            <Text style={styles.profileCompany}>Designify</Text>
            <Text style={styles.profileLocation}>San Francisco, CA</Text>
          </View>
        </View>
        
        <View style={styles.profileActions}>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <IconSymbol name="pencil" size={16} color={MagicPalette.purple} />
            <Text style={styles.editButtonText}>{t('profile.edit')}</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <StatCard 
          title={t('profile.connections')} 
          value="128" 
          icon="person.2.fill" 
          color={MagicPalette.blue} 
        />
        <StatCard 
          title={t('profile.sessions')} 
          value="14" 
                      icon="bubble.left.fill" 
          color={MagicPalette.green} 
        />
        <StatCard 
          title={t('profile.reviews')} 
          value="23" 
          icon="star.fill" 
          color={MagicPalette.yellow} 
        />
      </View>

      {/* Availability Toggle */}
      <View style={styles.availabilityContainer}>
        <LinearGradient colors={MagicGradients.card as [string, string, ...string[]]} style={styles.availabilityCard}>
          <View style={styles.availabilityHeader}>
            <IconSymbol name="wifi" size={20} color={MagicPalette.purple} />
            <Text style={styles.availabilityTitle}>{t('profile.availability')}</Text>
          </View>
          <Text style={styles.availabilityDescription}>
            {isAvailable ? t('profile.availableDescription') : t('profile.unavailableDescription')}
          </Text>
          <TouchableOpacity 
            style={[styles.availabilityToggle, isAvailable && styles.availabilityToggleActive]} 
            onPress={toggleAvailability}
          >
            <View style={[styles.toggleThumb, isAvailable && styles.toggleThumbActive]} />
          </TouchableOpacity>
        </LinearGradient>
      </View>

      {/* Activity Categories */}
      <View style={styles.categoriesContainer}>
        <View style={styles.sectionHeader}>
          <IconSymbol name="sparkles" size={24} color={MagicPalette.purple} />
          <Text style={styles.sectionTitle}>{t('profile.interests')}</Text>
        </View>
        <Text style={styles.sectionDescription}>
          {t('profile.interestsDescription')}
        </Text>
        
        <View style={styles.categoriesGrid}>
          {activityCategories.map(category => (
            <CategoryCard
              key={category.id}
              category={category}
              isSelected={selectedCategories.includes(category.id)}
              onPress={() => handleCategoryToggle(category.id)}
            />
          ))}
        </View>
      </View>

      {/* Bio */}
      <View style={styles.bioContainer}>
        <LinearGradient colors={MagicGradients.card as [string, string, ...string[]]} style={styles.bioCard}>
          <View style={styles.sectionHeader}>
            <IconSymbol name="text.quote" size={20} color={MagicPalette.purple} />
            <Text style={styles.sectionTitle}>{t('profile.bio')}</Text>
          </View>
          <Text style={styles.bioText}>
            Passionate about connecting people and building beautiful products. 
            I love collaborating on innovative projects and helping others grow their skills.
          </Text>
        </LinearGradient>
      </View>

      {/* Settings */}
      <View style={styles.settingsContainer}>
        <LinearGradient colors={MagicGradients.card as [string, string, ...string[]]} style={styles.settingsCard}>
          <TouchableOpacity style={styles.settingItem}>
            <IconSymbol name="bell.fill" size={20} color={MagicPalette.purple} />
            <Text style={styles.settingText}>{t('profile.notifications')}</Text>
            <IconSymbol name="chevron.right" size={16} color={MagicPalette.darkGray} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <IconSymbol name="lock.fill" size={20} color={MagicPalette.purple} />
            <Text style={styles.settingText}>{t('profile.privacy')}</Text>
            <IconSymbol name="chevron.right" size={16} color={MagicPalette.darkGray} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <IconSymbol name="questionmark.circle.fill" size={20} color={MagicPalette.purple} />
            <Text style={styles.settingText}>{t('profile.help')}</Text>
            <IconSymbol name="chevron.right" size={16} color={MagicPalette.darkGray} />
          </TouchableOpacity>
          
          <View style={styles.settingItem}>
            <IconSymbol name="globe" size={20} color={MagicPalette.purple} />
            <Text style={styles.settingText}>{t('profile.language')}</Text>
            <LanguageSwitcher />
          </View>
        </LinearGradient>
      </View>

      {/* Sign Out */}
      <View style={styles.signOutContainer}>
        <MagicalButton
          title={t('profile.signOut')}
          onPress={handleSignOut}
          color={MagicPalette.hotPink}
          style={{ marginBottom: 24 }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  profileHeader: {
    padding: 20,
    paddingTop: 40,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
    borderWidth: 3,
    borderColor: MagicPalette.white,
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: MagicPalette.white,
    marginBottom: 4,
  },
  profileTitle: {
    fontSize: 16,
    color: MagicPalette.white,
    opacity: 0.9,
    marginBottom: 2,
  },
  profileCompany: {
    fontSize: 14,
    color: MagicPalette.white,
    opacity: 0.8,
    marginBottom: 2,
  },
  profileLocation: {
    fontSize: 14,
    color: MagicPalette.white,
    opacity: 0.7,
  },
  profileActions: {
    alignItems: 'flex-end',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MagicPalette.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: MagicPalette.purple,
    fontWeight: '600',
    marginLeft: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: MagicPalette.white,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: MagicPalette.purple,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: MagicPalette.purple,
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: MagicPalette.darkGray,
    textAlign: 'center',
  },
  availabilityContainer: {
    padding: 16,
  },
  availabilityCard: {
    padding: 16,
    borderRadius: 16,
    shadowColor: MagicPalette.purple,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  availabilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  availabilityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: MagicPalette.purple,
    marginLeft: 8,
  },
  availabilityDescription: {
    fontSize: 14,
    color: MagicPalette.darkGray,
    marginBottom: 16,
    lineHeight: 20,
  },
  availabilityToggle: {
    width: 50,
    height: 28,
    backgroundColor: MagicPalette.lightGray,
    borderRadius: 14,
    padding: 2,
    alignSelf: 'flex-start',
  },
  availabilityToggleActive: {
    backgroundColor: MagicPalette.green,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    backgroundColor: MagicPalette.white,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  toggleThumbActive: {
    transform: [{ translateX: 22 }],
  },
  categoriesContainer: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: MagicPalette.purple,
    marginLeft: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: MagicPalette.darkGray,
    marginBottom: 16,
    lineHeight: 20,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryCard: {
    width: '30%',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
    shadowColor: MagicPalette.purple,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  selectedCard: {
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    color: MagicPalette.darkGray,
  },
  selectedText: {
    color: MagicPalette.white,
  },
  bioContainer: {
    padding: 16,
  },
  bioCard: {
    padding: 16,
    borderRadius: 16,
    shadowColor: MagicPalette.purple,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  bioText: {
    fontSize: 14,
    color: MagicPalette.darkGray,
    lineHeight: 20,
  },
  settingsContainer: {
    padding: 16,
  },
  settingsCard: {
    borderRadius: 16,
    shadowColor: MagicPalette.purple,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: MagicPalette.white,
    borderBottomWidth: 1,
    borderBottomColor: MagicPalette.lightGray,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: MagicPalette.darkGray,
    marginLeft: 12,
  },
  signOutContainer: {
    padding: 16,
  },
}); 