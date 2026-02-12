import { View, Text } from 'react-native';
import { Link, Redirect } from 'expo-router';

export default function Index() {
    // For now redirect to auth or tabs based on state (mocked)
    // return <Redirect href="/(tabs)/insights" />;
    return (
        <View className="flex-1 items-center justify-center bg-white">
            <Text className="text-xl font-bold text-blue-500">Social Telemedicine</Text>
            <Link href="/(auth)/login" className="mt-4 p-2 bg-blue-500 text-white rounded">
                Go to Login
            </Link>
        </View>
    );
}
