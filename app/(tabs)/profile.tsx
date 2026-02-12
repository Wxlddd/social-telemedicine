import { View, Text, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../../lib/store';
import { useRouter } from 'expo-router';

export default function Profile() {
    const { user, signOut } = useAuthStore();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut();
        router.replace('/(auth)/login');
    };

    return (
        <View className="flex-1 items-center justify-center bg-white">
            <Text className="text-2xl font-bold mb-4">Profile</Text>
            {user && (
                <View className="items-center mb-8">
                    <Text className="text-lg">{user.full_name}</Text>
                    <Text className="text-gray-500">{user.email}</Text>
                    <Text className="text-blue-600 font-bold mt-2 uppercase">{user.role}</Text>
                    {user.is_verified_doctor && (
                        <Text className="text-green-600 font-bold mt-1">Verified Doctor</Text>
                    )}
                </View>
            )}
            <TouchableOpacity
                onPress={handleSignOut}
                className="bg-red-500 px-6 py-3 rounded-lg"
            >
                <Text className="text-white font-bold">Sign Out</Text>
            </TouchableOpacity>
        </View>
    );
}
