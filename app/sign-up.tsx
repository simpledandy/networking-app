import { MagicalButton } from '@/components/ui/MagicalButton';
import { MagicPalette } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AuthContext } from './_layout';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { updateProfile } = useContext(AuthContext);

  const handleSignUp = () => {
    if (!email || !password || !confirm) {
      setError('Please fill all fields.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    // Mock backend: accept any non-empty credentials
    updateProfile({
      name: 'Taylor Morgan',
      email,
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      title: 'Product Designer',
      company: 'Designify',
      location: 'San Francisco, CA',
      interests: ['UX', 'Startups', 'AI', 'Networking'],
      bio: 'Passionate about connecting people and building beautiful products. Always open to new opportunities and collaborations.',
      connections: 128,
      sessions: 14,
      reviews: 23,
      friends: [
        { id: 'alex', name: 'Alex Johnson', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
        { id: 'jamie', name: 'Jamie Lee', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
        { id: 'sam', name: 'Sam Patel', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
      ],
    });
    router.replace('/onboarding');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        placeholder="Confirm Password"
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry
        style={styles.input}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <MagicalButton title="Sign Up" onPress={handleSignUp} color={MagicPalette.purple} style={{ marginTop: 12 }} />
      <TouchableOpacity onPress={() => router.replace('/sign-in')} style={{ marginTop: 16 }}>
        <Text style={styles.link}>Already have an account? Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: MagicPalette.white,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: MagicPalette.purple,
    marginBottom: 24,
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
  },
  error: {
    color: MagicPalette.pink,
    marginBottom: 8,
    textAlign: 'center',
  },
  link: {
    color: MagicPalette.blue,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
  },
}); 