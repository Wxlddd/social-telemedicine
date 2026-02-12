import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { clsx } from 'clsx';
import { Stethoscope, User } from 'lucide-react-native';

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [role, setRole] = useState<'patient' | 'doctor'>('patient');
    const [loading, setLoading] = useState(false);

    async function signUpWithEmail() {
        if (!email || !password || !fullName) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        setLoading(true);
        const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    role: role,
                },
            },
        });

        if (signUpError) {
            Alert.alert('Error', signUpError.message);
        } else {
            // Trigger handle_new_user via DB trigger
            // Just inform user
            Alert.alert('Success', 'Account created! Please check your email for verification.');
        }
        setLoading(false);
    }

    return (
        <View className="flex-1 justify-center items-center bg-gray-50 px-6">
            <View className="w-full max-w-sm">
                <Text className="text-3xl font-bold text-blue-600 mb-2 text-center">Join SocialMed</Text>
                <Text className="text-gray-500 mb-8 text-center">Connect with healthcare professionals</Text>

                {/* Role Selection */}
                <View className="flex-row justify-between mb-6">
                    <TouchableOpacity
                        onPress={() => setRole('patient')}
                        className={clsx(
                            "flex-1 p-4 rounded-lg border-2 mr-2 items-center justify-center",
                            role === 'patient' ? "border-blue-600 bg-blue-50" : "border-gray-200 bg-white"
                        )}
                    >
                        <User size={24} color={role === 'patient' ? '#2563EB' : '#9CA3AF'} />
                        <Text className={clsx("mt-2 font-bold", role === 'patient' ? "text-blue-600" : "text-gray-400")}>Patient</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setRole('doctor')}
                        className={clsx(
                            "flex-1 p-4 rounded-lg border-2 ml-2 items-center justify-center",
                            role === 'doctor' ? "border-blue-600 bg-blue-50" : "border-gray-200 bg-white"
                        )}
                    >
                        <Stethoscope size={24} color={role === 'doctor' ? '#2563EB' : '#9CA3AF'} />
                        <Text className={clsx("mt-2 font-bold", role === 'doctor' ? "text-blue-600" : "text-gray-400")}>Doctor</Text>
                    </TouchableOpacity>
                </View>

                <TextInput
                    onChangeText={(text) => setFullName(text)}
                    value={fullName}
                    placeholder="Full Name"
                    className="bg-white border border-gray-300 rounded-lg p-4 mb-4"
                />

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
                    onPress={signUpWithEmail}
                    disabled={loading}
                    className={clsx(
                        "bg-blue-600 rounded-lg p-4 items-center mb-4",
                        loading && "opacity-50"
                    )}
                >
                    <Text className="text-white font-bold text-lg">{loading ? 'Creating Account...' : 'Sign Up'}</Text>
                </TouchableOpacity>

                <View className="flex-row justify-center">
                    <Text className="text-gray-600">Already have an account? </Text>
                    <Link href="/login" replace asChild>
                        <TouchableOpacity>
                            <Text className="text-blue-600 font-bold">Sign In</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
        </View>
    );
}
