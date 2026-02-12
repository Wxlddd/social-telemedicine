import '../global.css';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../lib/store';
import { View, ActivityIndicator } from 'react-native';

export default function Layout() {
    const { session, loading, setSession } = useAuthStore();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
    }, []);

    useEffect(() => {
        if (loading) return;

        const inAuthGroup = segments[0] === '(auth)';

        if (!session && !inAuthGroup) {
            // Redirect to the sign-in page.
            router.replace('/(auth)/login');
        } else if (session && inAuthGroup) {
            // Redirect away from the sign-in page.
            router.replace('/(tabs)/insights');
        }
    }, [session, loading, segments]);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
    );
}
