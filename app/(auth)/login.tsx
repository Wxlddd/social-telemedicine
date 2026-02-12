import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { clsx } from 'clsx';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function signInWithEmail() {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) Alert.alert('Error', error.message);
        setLoading(false);
    }

    return (
        <View className="flex-1 justify-center items-center bg-gray-50 px-6">
            <View className="w-full max-w-sm">
                <Text className="text-3xl font-bold text-blue-600 mb-8 text-center">SocialMed</Text>

                <TextInput
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    placeholder="Email"
                    autoCapitalize="none"
                    className="bg-white border border-gray-300 rounded-lg p-4 mb-4"
                />

                <TextInput
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    secureTextEntry={true}
                    placeholder="Password"
                    autoCapitalize="none"
                    className="bg-white border border-gray-300 rounded-lg p-4 mb-6"
                />

                <TouchableOpacity
                    onPress={signInWithEmail}
                    disabled={loading}
                    className={clsx(
                        "bg-blue-600 rounded-lg p-4 items-center mb-4",
                        loading && "opacity-50"
                    )}
                >
                    <Text className="text-white font-bold text-lg">{loading ? 'Loading...' : 'Sign In'}</Text>
                </TouchableOpacity>

                <View className="flex-row justify-center">
                    <Text className="text-gray-600">Don't have an account? </Text>
                    <Link href="/signup" replace asChild>
                        <TouchableOpacity>
                            <Text className="text-blue-600 font-bold">Sign Up</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
        </View>
    );
}
