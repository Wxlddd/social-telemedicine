# Social Telemedicine App Prototype

This project is a social telemedicine app prototype built with React Native (Expo), Supabase, and Tailwind CSS (NativeWind).

## 1. Supabase Setup
1. Create a new Supabase project.
2. Go to the **SQL Editor**.
3. Copy the content of `schema.sql` (found in the root) and run it.
   - This creates tables: `profiles`, `posts`, `comments`.
   - Sets up strict Row Level Security (RLS) policies.
   - Sets up the `handle_new_user` trigger for automatic profile creation.

## 2. Environment Variables
1. Rename `.env.example` to `.env` (or `.env.local` if using Expo).
2. Fill in your keys (found in Supabase Settings > API):
   ```
   EXPO_PUBLIC_SUPABASE_URL=your-project-url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

## 3. Running the App
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npx expo start
   ```
3. Scan the QR code with your phone (using Expo Go) or run on an iOS/Android Simulator.

## 4. Verification & Testing Access Control

### Role: Patient
1. Sign up as "Patient".
2. **Consultations**: You can "Ask Question".
3. **Insights**: You can view the feed but **cannot** post.

### Role: Doctor (Unverified)
1. Sign up as "Doctor".
2. **Insights**: Try to post -> Button should be hidden or allow you to select media, but the insertion will be blocked by RLS if not verified.
3. **Consultations**: Try to reply -> Should be blocked.

### Role: Verified Doctor (Simulating Verification)
To verify a doctor for testing purposes:
1. Go to your Supabase Dashboard -> Table Editor -> `profiles`.
2. Find your user row (by email).
3. Set `is_verified_doctor` to `TRUE`.
4. Restart the app or Re-login (to refresh the session and profile data).
5. **Insights**: You can now successfully create posts.
6. **Consultations**: You can now reply to patient questions.
