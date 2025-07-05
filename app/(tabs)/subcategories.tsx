import { IconSymbol } from '@/components/ui/IconSymbol';
import { MagicGradients, MagicPalette } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Subcategories for each main category
const subcategoriesData = {
  sports: [
    { id: 'football', name: 'Football', icon: 'sportscourt.fill' },
    { id: 'basketball', name: 'Basketball', icon: 'sportscourt.fill' },
    { id: 'tennis', name: 'Tennis', icon: 'sportscourt.fill' },
    { id: 'swimming', name: 'Swimming', icon: 'sportscourt.fill' },
    { id: 'running', name: 'Running', icon: 'figure.run' },
    { id: 'cycling', name: 'Cycling', icon: 'figure.run' },
    { id: 'yoga', name: 'Yoga', icon: 'figure.run' },
    { id: 'gym', name: 'Gym', icon: 'figure.run' },
  ],
  travel: [
    { id: 'backpacking', name: 'Backpacking', icon: 'airplane' },
    { id: 'cityExploration', name: 'City Exploration', icon: 'airplane' },
    { id: 'hiking', name: 'Hiking', icon: 'leaf.fill' },
    { id: 'beach', name: 'Beach', icon: 'airplane' },
    { id: 'camping', name: 'Camping', icon: 'leaf.fill' },
    { id: 'roadTrip', name: 'Road Trip', icon: 'airplane' },
    { id: 'cultural', name: 'Cultural', icon: 'airplane' },
    { id: 'adventure', name: 'Adventure', icon: 'airplane' },
  ],
  tech: [
    { id: 'coding', name: 'Coding', icon: 'laptopcomputer' },
    { id: 'hackathon', name: 'Hackathon', icon: 'laptopcomputer' },
    { id: 'startup', name: 'Startup', icon: 'laptopcomputer' },
    { id: 'ai', name: 'AI/ML', icon: 'laptopcomputer' },
    { id: 'gaming', name: 'Gaming', icon: 'gamecontroller.fill' },
    { id: 'webDev', name: 'Web Development', icon: 'laptopcomputer' },
    { id: 'mobileDev', name: 'Mobile Development', icon: 'laptopcomputer' },
    { id: 'dataScience', name: 'Data Science', icon: 'laptopcomputer' },
  ],
  creative: [
    { id: 'art', name: 'Art', icon: 'paintbrush.fill' },
    { id: 'design', name: 'Design', icon: 'paintbrush.fill' },
    { id: 'photography', name: 'Photography', icon: 'paintbrush.fill' },
    { id: 'writing', name: 'Writing', icon: 'paintbrush.fill' },
    { id: 'music', name: 'Music', icon: 'music.note' },
    { id: 'dance', name: 'Dance', icon: 'paintbrush.fill' },
    { id: 'crafting', name: 'Crafting', icon: 'paintbrush.fill' },
    { id: 'film', name: 'Film', icon: 'paintbrush.fill' },
  ],
  business: [
    { id: 'networking', name: 'Networking', icon: 'building.2.fill' },
    { id: 'mentoring', name: 'Mentoring', icon: 'building.2.fill' },
    { id: 'investment', name: 'Investment', icon: 'building.2.fill' },
    { id: 'collaboration', name: 'Collaboration', icon: 'building.2.fill' },
    { id: 'freelance', name: 'Freelance', icon: 'building.2.fill' },
    { id: 'jobHunting', name: 'Job Hunting', icon: 'building.2.fill' },
    { id: 'startup', name: 'Startup', icon: 'building.2.fill' },
    { id: 'sales', name: 'Sales', icon: 'building.2.fill' },
  ],
  social: [
    { id: 'meetup', name: 'Meetup', icon: 'person.3.fill' },
    { id: 'party', name: 'Party', icon: 'person.3.fill' },
    { id: 'dating', name: 'Dating', icon: 'person.3.fill' },
    { id: 'friendship', name: 'Friendship', icon: 'person.3.fill' },
    { id: 'language', name: 'Language Exchange', icon: 'person.3.fill' },
    { id: 'bookClub', name: 'Book Club', icon: 'person.3.fill' },
    { id: 'movie', name: 'Movie Night', icon: 'person.3.fill' },
    { id: 'boardGames', name: 'Board Games', icon: 'person.3.fill' },
  ],
  learning: [
    { id: 'language', name: 'Language', icon: 'book.fill' },
    { id: 'course', name: 'Course', icon: 'book.fill' },
    { id: 'workshop', name: 'Workshop', icon: 'book.fill' },
    { id: 'tutoring', name: 'Tutoring', icon: 'book.fill' },
    { id: 'studyGroup', name: 'Study Group', icon: 'book.fill' },
    { id: 'skillShare', name: 'Skill Share', icon: 'book.fill' },
    { id: 'reading', name: 'Reading', icon: 'book.fill' },
    { id: 'research', name: 'Research', icon: 'book.fill' },
  ],
  food: [
    { id: 'cooking', name: 'Cooking', icon: 'fork.knife' },
    { id: 'restaurant', name: 'Restaurant', icon: 'fork.knife' },
    { id: 'baking', name: 'Baking', icon: 'fork.knife' },
    { id: 'wine', name: 'Wine Tasting', icon: 'fork.knife' },
    { id: 'coffee', name: 'Coffee', icon: 'fork.knife' },
    { id: 'foodTour', name: 'Food Tour', icon: 'fork.knife' },
    { id: 'picnic', name: 'Picnic', icon: 'fork.knife' },
    { id: 'bbq', name: 'BBQ', icon: 'fork.knife' },
  ],
  music: [
    { id: 'concert', name: 'Concert', icon: 'music.note' },
    { id: 'jamming', name: 'Jamming', icon: 'music.note' },
    { id: 'karaoke', name: 'Karaoke', icon: 'music.note' },
    { id: 'festival', name: 'Festival', icon: 'music.note' },
    { id: 'recording', name: 'Recording', icon: 'music.note' },
    { id: 'instrument', name: 'Instrument', icon: 'music.note' },
    { id: 'singing', name: 'Singing', icon: 'music.note' },
    { id: 'dj', name: 'DJ', icon: 'music.note' },
  ],
  gaming: [
    { id: 'videoGames', name: 'Video Games', icon: 'gamecontroller.fill' },
    { id: 'boardGames', name: 'Board Games', icon: 'gamecontroller.fill' },
    { id: 'cardGames', name: 'Card Games', icon: 'gamecontroller.fill' },
    { id: 'esports', name: 'Esports', icon: 'gamecontroller.fill' },
    { id: 'rpg', name: 'RPG', icon: 'gamecontroller.fill' },
    { id: 'strategy', name: 'Strategy', icon: 'gamecontroller.fill' },
    { id: 'puzzle', name: 'Puzzle', icon: 'gamecontroller.fill' },
    { id: 'vr', name: 'VR Gaming', icon: 'gamecontroller.fill' },
  ],
  fitness: [
    { id: 'workout', name: 'Workout', icon: 'figure.run' },
    { id: 'crossfit', name: 'CrossFit', icon: 'figure.run' },
    { id: 'pilates', name: 'Pilates', icon: 'figure.run' },
    { id: 'zumba', name: 'Zumba', icon: 'figure.run' },
    { id: 'boxing', name: 'Boxing', icon: 'figure.run' },
    { id: 'martialArts', name: 'Martial Arts', icon: 'figure.run' },
    { id: 'dance', name: 'Dance Fitness', icon: 'figure.run' },
    { id: 'strength', name: 'Strength Training', icon: 'figure.run' },
  ],
  outdoors: [
    { id: 'hiking', name: 'Hiking', icon: 'leaf.fill' },
    { id: 'camping', name: 'Camping', icon: 'leaf.fill' },
    { id: 'fishing', name: 'Fishing', icon: 'leaf.fill' },
    { id: 'kayaking', name: 'Kayaking', icon: 'leaf.fill' },
    { id: 'rockClimbing', name: 'Rock Climbing', icon: 'leaf.fill' },
    { id: 'skiing', name: 'Skiing', icon: 'leaf.fill' },
    { id: 'snowboarding', name: 'Snowboarding', icon: 'leaf.fill' },
    { id: 'surfing', name: 'Surfing', icon: 'leaf.fill' },
  ],
};

function SubcategoryCard({ subcategory, onPress, isSelected }: { subcategory: any; onPress: () => void; isSelected: boolean }) {
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
          colors={isSelected ? MagicGradients.purple as [string, string, ...string[]] : MagicGradients.card as [string, string, ...string[]]} 
          style={[styles.subcategoryCard, isSelected && styles.selectedCard]}
        >
          <IconSymbol 
            name={subcategory.icon as any} 
            size={32} 
            color={isSelected ? MagicPalette.white : MagicPalette.purple} 
            style={{ marginBottom: 12 }} 
          />
          <Text style={[styles.subcategoryText, isSelected && styles.selectedText]}>
            {t(`${subcategory.category}.${subcategory.id}`)}
          </Text>
          {isSelected && (
            <View style={styles.checkmark}>
              <IconSymbol name="checkmark.circle.fill" size={20} color={MagicPalette.white} />
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function SubcategoriesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { category } = useLocalSearchParams<{ category: string }>();
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);

  const subcategories = subcategoriesData[category as keyof typeof subcategoriesData] || [];

  const handleSubcategoryToggle = (subcategoryId: string) => {
    setSelectedSubcategories(prev => 
      prev.includes(subcategoryId) 
        ? prev.filter(id => id !== subcategoryId)
        : [...prev, subcategoryId]
    );
  };

  const handleContinue = () => {
    if (selectedSubcategories.length === 0) return;
    
    router.push({
      pathname: '/(tabs)/connection-mode',
      params: { 
        category,
        subcategories: selectedSubcategories.join(',')
      }
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <LinearGradient colors={MagicGradients.main as [string, string, ...string[]]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={MagicPalette.white} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{t(`category.${category}`)}</Text>
          <Text style={styles.headerSubtitle}>{t('subcategories.chooseActivities')}</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <FlatList
          data={subcategories}
          keyExtractor={item => item.id}
          numColumns={2}
          renderItem={({ item }) => (
            <SubcategoryCard
              subcategory={{ ...item, category }}
              onPress={() => handleSubcategoryToggle(item.id)}
              isSelected={selectedSubcategories.includes(item.id)}
            />
          )}
          style={styles.subcategoriesList}
          contentContainerStyle={styles.subcategoriesContent}
        />

        {/* Continue Button */}
        {selectedSubcategories.length > 0 && (
          <View style={styles.bottomActions}>
            <TouchableOpacity 
              style={styles.continueButton} 
              onPress={handleContinue}
              activeOpacity={0.9}
            >
              <LinearGradient 
                colors={MagicGradients.purple as [string, string, ...string[]]} 
                style={styles.continueGradient}
              >
                <Text style={styles.continueText}>{t('subcategories.continue')}</Text>
                <IconSymbol name="chevron.right" size={20} color={MagicPalette.white} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: MagicPalette.white,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: MagicPalette.white,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    backgroundColor: MagicPalette.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
  },
  subcategoriesList: {
    flex: 1,
  },
  subcategoriesContent: {
    padding: 16,
    paddingBottom: 100,
  },
  subcategoryCard: {
    flex: 1,
    margin: 6,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    shadowColor: MagicPalette.purple,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  subcategoryText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: MagicPalette.darkGray,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: MagicPalette.purple,
  },
  selectedText: {
    color: MagicPalette.white,
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: MagicPalette.white,
    borderTopWidth: 1,
    borderTopColor: MagicPalette.lightGray,
  },
  continueButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  continueGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  continueText: {
    color: MagicPalette.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
}); 