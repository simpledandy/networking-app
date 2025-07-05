import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { createContext, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import 'react-native-reanimated';
import i18n from '../i18n';

import { MagicPalette } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Mock Auth Context (move to a separate file for real projects)
const initialProfile = {
  name: 'Taylor Morgan',
  title: 'Product Designer',
  company: 'Designify',
  location: 'San Francisco, CA',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
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
} as const;
export const AuthContext = createContext<{ user: typeof initialProfile | null; signOut: () => void; updateProfile: (p: any) => void; }>({ user: initialProfile, signOut: () => {}, updateProfile: (p: any) => {} });



function AppContent() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [user, setUser] = useState<typeof initialProfile | null>(initialProfile);
  const showAuth = !user;
  const signOut = () => setUser(null);
  const updateProfile = (p: any) => setUser(p);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, signOut, updateProfile }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          {showAuth ? (
            <>
              <Stack.Screen name="sign-in" options={{ headerShown: false }} />
              <Stack.Screen name="sign-up" options={{ headerShown: false }} />
              <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            </>
          ) : (
            <>
              <Stack.Screen 
                name="(tabs)"
                options={{
                  title: "Tabs",
                  headerStyle: { backgroundColor: MagicPalette.white },
                }}
              />
              <Stack.Screen 
                name="chat-conversation" 
                options={{ 
                  headerShown: false,
                  presentation: 'modal'
                }} 
              />
              <Stack.Screen name="+not-found" options={{ headerShown: false }} />
            </>
          )}
        </Stack>
      </ThemeProvider>
    </AuthContext.Provider>
  );
}

export default function RootLayout() {
  return (
    <I18nextProvider i18n={i18n}>
      <AppContent />
    </I18nextProvider>
  );
}
