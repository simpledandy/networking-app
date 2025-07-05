import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { FancyTabBarBackground } from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: FancyTabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      {/*
        To use translations for tab labels/titles, set them in each screen component (e.g. index.tsx, explore.tsx, etc.)
        using useTranslation, and pass them as options via router or navigation props.
        This avoids context issues with I18nextProvider in Expo Router layouts.
      */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'connect',
          tabBarLabel: 'connect',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="sparkles" color={color} />,
        }}
      />
      <Tabs.Screen
        name="sessions"
        options={{
          title: 'sessions',
          tabBarLabel: 'sessions',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="calendar.badge.clock" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'profile',
          tabBarLabel: 'profile',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.crop.circle" color={color} />,
        }}
      />

      <Tabs.Screen
        name="friend-profile"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="subcategories"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="connection-mode"
        options={{
          href: null,
        }}
      />

    </Tabs>
  );
}
