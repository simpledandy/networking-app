import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { createContext, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/IconSymbol';
import { MagicPalette } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { StyleSheet, Text, View } from 'react-native';

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

function CustomHeader() {
  const pathname = usePathname();
  const router = useRouter();
  let title = 'Feed';
  let icon = 'person.2.fill';
  let showBack = false;
  // Define root tabs
  const rootTabs = ['/','/(tabs)','/(tabs)/index','/(tabs)/sessions','/(tabs)/profile','/(tabs)/explore','/(tabs)/create-event'];
  if (pathname.includes('/sessions')) {
    title = 'Sessions';
    icon = 'calendar';
  } else if (pathname.includes('/profile')) {
    title = 'Profile';
    icon = 'person.crop.circle';
  } else if (pathname.includes('/explore')) {
    title = 'Explore';
    icon = 'sparkles';
  } else if (pathname.includes('/create-event')) {
    title = 'Create';
    icon = 'plus.circle.fill';
  }
  if (!rootTabs.includes(pathname)) {
    showBack = true;
  }
  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: MagicPalette.white }}>
      <View style={styles.header}>
        {showBack && (
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 10, padding: 6, borderRadius: 20, backgroundColor: MagicPalette.purple, shadowColor: MagicPalette.purple, shadowOpacity: 0.15, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}>
            <IconSymbol name="chevron.left" size={22} color={MagicPalette.white} />
          </TouchableOpacity>
        )}
        <IconSymbol name={icon as any} size={28} color={MagicPalette.purple} style={{ marginRight: 10 }} />
        <Text style={styles.headerText}>{title}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: MagicPalette.white,
    borderBottomWidth: 1,
    borderBottomColor: MagicPalette.gray,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: MagicPalette.black,
  },
});

export default function RootLayout() {
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
        <Stack>
          {showAuth ? (
            <>
              <Stack.Screen name="sign-in" options={{ headerShown: false }} />
              <Stack.Screen name="sign-up" options={{ headerShown: false }} />
              <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            </>
          ) : (
            <>
              <Stack.Screen name="(tabs)" options={{ headerShown: true, header: () => <CustomHeader /> }} />
              <Stack.Screen name="+not-found" options={{ headerShown: false }} />
            </>
          )}
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthContext.Provider>
  );
}
