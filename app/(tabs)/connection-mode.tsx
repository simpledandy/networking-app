import { IconSymbol } from '@/components/ui/IconSymbol';
import { MagicGradients, MagicPalette } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

function ConnectionOption({ 
  title, 
  subtitle, 
  description, 
  icon, 
  gradient, 
  onPress 
}: { 
  title: string; 
  subtitle: string; 
  description: string; 
  icon: string; 
  gradient: string[]; 
  onPress: () => void; 
}) {
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
        <LinearGradient colors={gradient as [string, string, ...string[]]} style={styles.optionCard}>
          <View style={styles.optionHeader}>
            <IconSymbol name={icon as any} size={32} color={MagicPalette.white} />
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>{title}</Text>
              <Text style={styles.optionSubtitle}>{subtitle}</Text>
            </View>
          </View>
          <Text style={styles.optionDescription}>{description}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function ConnectionModeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { category, subcategories } = useLocalSearchParams<{ 
    category: string; 
    subcategories: string; 
  }>();

  const handleMakeAvailable = () => {
    // Navigate to a screen where user can set their availability
    console.log('Make myself available for:', category, subcategories);
    // For now, just go back to main screen
    router.push('/(tabs)/');
  };

  const handleFindPeople = () => {
    // Navigate to people discovery screen
    console.log('Find people for:', category, subcategories);
    // For now, just go back to main screen
    router.push('/(tabs)/');
  };

  const handleBack = () => {
    router.back();
  };

  const selectedSubcategories = subcategories?.split(',') || [];
  const categoryName = t(`category.${category}`);

  return (
    <LinearGradient colors={MagicGradients.main as [string, string, ...string[]]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={MagicPalette.white} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{t('connectionMode.title')}</Text>
          <Text style={styles.headerSubtitle}>
            {categoryName} • {selectedSubcategories.length} {t('connectionMode.activities')}
          </Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.selectedActivities}>
            <Text style={styles.sectionTitle}>{t('connectionMode.selectedActivities')}</Text>
            <View style={styles.activitiesList}>
              {selectedSubcategories.map((subcategory, index) => (
                <View key={index} style={styles.activityChip}>
                  <Text style={styles.activityText}>
                    {t(`${category}.${subcategory}`)}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.optionsContainer}>
            <Text style={styles.sectionTitle}>{t('connectionMode.chooseMode')}</Text>
            
            <ConnectionOption
              title={t('connectionMode.makeAvailable.title')}
              subtitle={t('connectionMode.makeAvailable.subtitle')}
              description={t('connectionMode.makeAvailable.description')}
              icon="person.2.fill"
              gradient={[MagicPalette.green, MagicPalette.teal]}
              onPress={handleMakeAvailable}
            />

            <ConnectionOption
              title={t('connectionMode.findPeople.title')}
              subtitle={t('connectionMode.findPeople.subtitle')}
              description={t('connectionMode.findPeople.description')}
              icon="magnifyingglass"
              gradient={[MagicPalette.purple, MagicPalette.pink]}
              onPress={handleFindPeople}
            />
          </View>
        </ScrollView>
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
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 24,
    padding: 20,
    paddingBottom: 40,
  },
  selectedActivities: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: MagicPalette.purple,
    marginBottom: 16,
  },
  activitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  activityChip: {
    backgroundColor: MagicPalette.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  activityText: {
    fontSize: 14,
    color: MagicPalette.darkGray,
    fontWeight: '500',
  },
  optionsContainer: {
    flex: 1,
  },
  optionCard: {
    padding: 24,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: MagicPalette.purple,
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  optionText: {
    flex: 1,
    marginLeft: 16,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: MagicPalette.white,
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
    color: MagicPalette.white,
    opacity: 0.9,
  },
  optionDescription: {
    fontSize: 16,
    color: MagicPalette.white,
    opacity: 0.95,
    lineHeight: 24,
  },
}); 