# Networking App

A modern React Native (Expo) app for networking events, built with Expo Router and ready for Supabase backend integration.

## Project Overview
This app provides a social platform for discovering, creating, and joining networking events. It features:
- Custom navigation and theming
- Event creation and discovery
- User profiles and onboarding
- Ready for Supabase backend integration

---

## Prerequisites
- **Node.js** (v18 or newer recommended)
- **npm** (v9 or newer) or **yarn**
- **Expo CLI**: `npm install -g expo-cli`
- **EAS CLI** (for cloud builds): `npm install -g eas-cli`
- (Optional) **Git** for version control

---

## Setup
1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd networking-app
   ```
2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```
3. **Start Expo development server:**
   ```sh
   expo start
   ```

---

## Running the App
- **On Android/iOS device:**
  - Install the Expo Go app from the Play Store/App Store.
  - Scan the QR code from `expo start` in your terminal or browser.
- **On Android emulator/iOS simulator:**
  - Make sure you have the emulator/simulator running.
  - Press `a` (Android) or `i` (iOS) in the Expo CLI terminal.

---

## Building an APK (Android)
1. **Cloud build (recommended):**
   ```sh
   eas build -p android --profile preview
   ```
   - Follow the link provided after the build completes to download your APK.
2. **Local build (advanced, requires Android SDK):**
   ```sh
   expo run:android --variant release
   ```

---

## Integrating Supabase Backend
1. **Create a Supabase project:**
   - Go to [supabase.com](https://supabase.com/) and create a new project.
2. **Install Supabase client:**
   ```sh
   npm install @supabase/supabase-js
   ```
3. **Configure Supabase:**
   - Create a file (e.g., `lib/supabase.ts`):
     ```ts
     import { createClient } from '@supabase/supabase-js';
     export const supabase = createClient('https://<your-project>.supabase.co', '<your-anon-key>');
     ```
   - Add your Supabase URL and anon key from your Supabase dashboard.
4. **Use Supabase in your app:**
   - Import and use the `supabase` client for authentication, database, and storage features.
   - Example usage:
     ```ts
     import { supabase } from '@/lib/supabase';
     const { data, error } = await supabase.from('events').select('*');
     ```
5. **Environment variables (optional):**
   - Use a `.env` file and a library like `react-native-dotenv` for managing secrets.

---

## Useful Commands
- `expo start` — Start the development server
- `eas build -p android` — Build Android APK in the cloud
- `expo run:android` — Build and run locally (requires Android SDK)
- `npm run lint` — Lint the codebase
- `npm install` — Install dependencies

---

## Resources
- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router](https://expo.github.io/router/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [EAS Build](https://docs.expo.dev/build/introduction/)

---

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License
[MIT](LICENSE)
