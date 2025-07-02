import { MagicalButton } from '@/components/ui/MagicalButton';
import { MagicGradients, MagicPalette } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Animated, Easing, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AuthContext } from './_layout';

const AVATARS = [
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/men/45.jpg',
  'https://randomuser.me/api/portraits/women/47.jpg',
  'https://randomuser.me/api/portraits/men/46.jpg',
];
const INTERESTS = [
  'Tech', 'Design', 'Startups', 'AI', 'Networking', 'Art', 'Music', 'Gaming', 'Sports', 'Travel', 'Food', 'Writing',
];

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [interests, setInterests] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { updateProfile, user } = useContext(AuthContext);
  const fadeAnim = useState(new Animated.Value(1))[0];

  const next = () => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true, easing: Easing.out(Easing.exp) }).start(() => {
      setStep(s => s + 1);
      fadeAnim.setValue(1);
    });
  };
  const prev = () => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true, easing: Easing.out(Easing.exp) }).start(() => {
      setStep(s => s - 1);
      fadeAnim.setValue(1);
    });
  };

  const handleAddInterest = () => {
    if (customInterest.trim() && !interests.includes(customInterest.trim())) {
      setInterests([...interests, customInterest.trim()]);
      setCustomInterest('');
    }
  };

  const handleFinish = () => {
    if (!name || !avatar || interests.length === 0 || !bio) {
      setError('Please complete all fields.');
      return;
    }
    updateProfile({
      ...user,
      name,
      avatar,
      interests,
      bio,
      title: user?.title || '',
      company: user?.company || '',
      location: user?.location || '',
      connections: user?.connections || 0,
      sessions: user?.sessions || 0,
      reviews: user?.reviews || 0,
      friends: user?.friends || [],
    });
    router.replace('/(tabs)');
  };

  return (
    <LinearGradient colors={MagicGradients.main as [string, string, ...string[]]} style={{ flex: 1 }}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>  
        {step === 0 && (
          <View style={styles.centered}>
            <Image source={require('../assets/images/partial-react-logo.png')} style={{ width: 120, height: 120, marginBottom: 24 }} />
            <Text style={styles.title}>Welcome to Magic Networking!</Text>
            <Text style={styles.subtitle}>Connect, grow, and shine with your new network ✨</Text>
            <MagicalButton title="Get Started" onPress={next} color={MagicPalette.purple} style={{ marginTop: 32 }} />
          </View>
        )}
        {step === 1 && (
          <View style={styles.centered}>
            <Text style={styles.title}>What's your name?</Text>
            <TextInput
              placeholder="Your name"
              value={name}
              onChangeText={setName}
              style={styles.input}
              autoFocus
            />
            <View style={styles.rowBtns}>
              <MagicalButton title="Back" onPress={prev} color={MagicPalette.gray} style={{ marginTop: 24, marginRight: 8 }} />
              <MagicalButton title="Next" onPress={next} color={MagicPalette.purple} style={{ marginTop: 24 }} />
            </View>
          </View>
        )}
        {step === 2 && (
          <View style={styles.centered}>
            <Text style={styles.title}>Choose your avatar</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 24 }} contentContainerStyle={{ alignItems: 'center' }}>
              {AVATARS.map(uri => (
                <TouchableOpacity key={uri} onPress={() => setAvatar(uri)} style={[styles.avatarWrap, avatar === uri && styles.avatarSelected]}>
                  <Image source={{ uri }} style={styles.avatar} />
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.rowBtns}>
              <MagicalButton title="Back" onPress={prev} color={MagicPalette.gray} style={{ marginTop: 24, marginRight: 8 }} />
              <MagicalButton title="Next" onPress={next} color={MagicPalette.purple} style={{ marginTop: 24 }} />
            </View>
          </View>
        )}
        {step === 3 && (
          <View style={styles.centered}>
            <Text style={styles.title}>Pick your interests</Text>
            <View style={styles.chipWrap}>
              {INTERESTS.map(interest => (
                <TouchableOpacity
                  key={interest}
                  style={[styles.chip, interests.includes(interest) && styles.chipSelected]}
                  onPress={() => setInterests(interests.includes(interest) ? interests.filter(i => i !== interest) : [...interests, interest])}
                >
                  <Text style={[styles.chipText, interests.includes(interest) && { color: MagicPalette.white }]}>{interest}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ flexDirection: 'row', marginTop: 12 }}>
              <TextInput
                placeholder="Add custom..."
                value={customInterest}
                onChangeText={setCustomInterest}
                style={[styles.input, { flex: 1, marginRight: 8 }]}
              />
              <MagicalButton title="Add" onPress={handleAddInterest} color={MagicPalette.blue} style={{ paddingHorizontal: 16 }} />
            </View>
            <View style={styles.rowBtns}>
              <MagicalButton title="Back" onPress={prev} color={MagicPalette.gray} style={{ marginTop: 24, marginRight: 8 }} />
              <MagicalButton title="Next" onPress={next} color={MagicPalette.purple} style={{ marginTop: 24 }} />
            </View>
          </View>
        )}
        {step === 4 && (
          <View style={styles.centered}>
            <Text style={styles.title}>Write a short bio</Text>
            <TextInput
              placeholder="Tell us about yourself..."
              value={bio}
              onChangeText={setBio}
              multiline
              style={[styles.input, { minHeight: 80 }]}
            />
            <View style={styles.rowBtns}>
              <MagicalButton title="Back" onPress={prev} color={MagicPalette.gray} style={{ marginTop: 24, marginRight: 8 }} />
              <MagicalButton title="Next" onPress={next} color={MagicPalette.purple} style={{ marginTop: 24 }} />
            </View>
          </View>
        )}
        {step === 5 && (
          <View style={styles.centered}>
            <Text style={styles.title}>Ready to join?</Text>
            <Image source={{ uri: avatar }} style={[styles.avatar, { marginBottom: 12 }]} />
            <Text style={styles.summaryText}>{name}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 8 }}>
              {interests.map(i => (
                <View key={i} style={[styles.chip, styles.chipSelected, { margin: 2 }]}><Text style={[styles.chipText, { color: MagicPalette.white }]}>{i}</Text></View>
              ))}
            </View>
            <Text style={[styles.summaryText, { fontSize: 15, color: MagicPalette.text, marginBottom: 8 }]}>{bio}</Text>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <MagicalButton title="Finish Onboarding" onPress={handleFinish} color={MagicPalette.purple} style={{ marginTop: 24 }} />
          </View>
        )}
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: MagicPalette.purple,
    marginBottom: 18,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: MagicPalette.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: MagicPalette.purple,
    backgroundColor: MagicPalette.white,
    marginBottom: 14,
    padding: 10,
    borderRadius: 10,
    fontSize: 16,
    minWidth: 220,
    maxWidth: 320,
  },
  avatarWrap: {
    borderWidth: 2,
    borderColor: MagicPalette.purple,
    borderRadius: 40,
    marginHorizontal: 8,
    padding: 2,
  },
  avatarSelected: {
    borderColor: MagicPalette.blue,
    borderWidth: 3,
    shadowColor: MagicPalette.blue,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 8,
  },
  chip: {
    backgroundColor: MagicPalette.chip,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  chipSelected: {
    backgroundColor: MagicPalette.purple,
  },
  chipText: {
    color: MagicPalette.purple,
    fontWeight: '600',
    fontSize: 14,
  },
  rowBtns: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  error: {
    color: MagicPalette.red,
    marginBottom: 8,
    textAlign: 'center',
  },
  summaryText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: MagicPalette.purple,
    textAlign: 'center',
    marginBottom: 4,
  },
}); 