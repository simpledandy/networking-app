import { IconSymbol } from '@/components/ui/IconSymbol';
import { MagicGradients, MagicPalette } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Purpose categories with icons and colors
const purposeCategories = [
  {
    id: 'findMentor',
    icon: 'person.2.circle.fill',
    color: MagicPalette.purple,
    gradient: MagicGradients.main,
  },
  {
    id: 'findMentee',
    icon: 'person.3.sequence.fill',
    color: MagicPalette.blue,
    gradient: [MagicPalette.blue, MagicPalette.teal],
  },
  {
    id: 'collaborate',
    icon: 'person.2.square.fill',
    color: MagicPalette.pink,
    gradient: [MagicPalette.pink, MagicPalette.hotPink],
  },
  {
    id: 'network',
    icon: 'network',
    color: MagicPalette.teal,
    gradient: [MagicPalette.teal, MagicPalette.blue],
  },
  {
    id: 'learn',
    icon: 'book.fill',
    color: MagicPalette.orange,
    gradient: [MagicPalette.orange, MagicPalette.yellow],
  },
  {
    id: 'share',
    icon: 'lightbulb.fill',
    color: MagicPalette.yellow,
    gradient: [MagicPalette.yellow, MagicPalette.orange],
  },
  {
    id: 'startup',
    icon: 'rocket.fill',
    color: MagicPalette.hotPink,
    gradient: [MagicPalette.hotPink, MagicPalette.pink],
  },
  {
    id: 'job',
    icon: 'briefcase.fill',
    color: MagicPalette.green,
    gradient: [MagicPalette.green, MagicPalette.teal],
  },
  {
    id: 'freelance',
    icon: 'laptopcomputer',
    color: MagicPalette.blue,
    gradient: [MagicPalette.blue, MagicPalette.purple],
  },
  {
    id: 'investment',
    icon: 'chart.line.uptrend.xyaxis',
    color: MagicPalette.green,
    gradient: [MagicPalette.green, MagicPalette.blue],
  },
  {
    id: 'social',
    icon: 'person.3.fill',
    color: MagicPalette.pink,
    gradient: [MagicPalette.pink, MagicPalette.purple],
  },
  {
    id: 'creative',
    icon: 'paintbrush.fill',
    color: MagicPalette.orange,
    gradient: [MagicPalette.orange, MagicPalette.hotPink],
  },
  {
    id: 'tech',
    icon: 'cpu.fill',
    color: MagicPalette.purple,
    gradient: [MagicPalette.purple, MagicPalette.blue],
  },
  {
    id: 'business',
    icon: 'building.2.fill',
    color: MagicPalette.teal,
    gradient: [MagicPalette.teal, MagicPalette.green],
  },
];

interface PurposePreferencesProps {
  selectedPurposes: string[];
  onPurposesChange: (purposes: string[]) => void;
  maxSelections?: number;
}

function PurposeCard({ purpose, isSelected, onPress }: { purpose: any; isSelected: boolean; onPress: () => void }) {
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
          colors={isSelected ? purpose.gradient : ['#f8f9fa', '#f8f9fa']} 
          style={[styles.purposeCard, isSelected && styles.selectedCard]}
        >
          <IconSymbol 
            name={purpose.icon} 
            size={28} 
            color={isSelected ? MagicPalette.white : purpose.color} 
            style={{ marginBottom: 6 }} 
          />
          <Text style={[styles.purposeText, isSelected && styles.selectedText]}>
            {t(`purpose.${purpose.id}`)}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function PurposePreferences({ 
  selectedPurposes, 
  onPurposesChange, 
  maxSelections = 5 
}: PurposePreferencesProps) {
  const { t } = useTranslation();

  const handlePurposeToggle = (purposeId: string) => {
    if (selectedPurposes.includes(purposeId)) {
      onPurposesChange(selectedPurposes.filter(id => id !== purposeId));
    } else if (selectedPurposes.length < maxSelections) {
      onPurposesChange([...selectedPurposes, purposeId]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('purpose.title')}</Text>
        <Text style={styles.subtitle}>
          {t('purpose.subtitle')} ({selectedPurposes.length}/{maxSelections})
        </Text>
      </View>

      <FlatList
        data={purposeCategories}
        keyExtractor={item => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <PurposeCard
            purpose={item}
            isSelected={selectedPurposes.includes(item.id)}
            onPress={() => handlePurposeToggle(item.id)}
          />
        )}
        style={styles.purposesList}
        contentContainerStyle={{ paddingBottom: 16 }}
      />

      {selectedPurposes.length > 0 && (
        <View style={styles.selectedSection}>
          <Text style={styles.selectedTitle}>Selected Purposes:</Text>
          <View style={styles.selectedChips}>
            {selectedPurposes.map(purposeId => {
              const purpose = purposeCategories.find(p => p.id === purposeId);
              return (
                <LinearGradient 
                  key={purposeId} 
                  colors={purpose?.gradient || MagicGradients.main} 
                  style={styles.selectedChip}
                >
                  <Text style={styles.selectedChipText}>
                    {t(`purpose.${purposeId}`)}
                  </Text>
                </LinearGradient>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: MagicPalette.purple,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: MagicPalette.darkGray,
    lineHeight: 20,
  },
  purposesList: {
    flex: 1,
  },
  purposeCard: {
    flex: 1,
    margin: 6,
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
    shadowColor: MagicPalette.purple,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  selectedCard: {
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  purposeText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    color: MagicPalette.darkGray,
  },
  selectedText: {
    color: MagicPalette.white,
  },
  selectedSection: {
    padding: 16,
    paddingTop: 8,
  },
  selectedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: MagicPalette.purple,
    marginBottom: 8,
  },
  selectedChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  selectedChipText: {
    color: MagicPalette.white,
    fontSize: 12,
    fontWeight: '600',
  },
}); 