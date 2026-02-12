import { Tabs } from 'expo-router';
import { Home, MessageSquare, User } from 'lucide-react-native';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#ffffff',
                    borderTopWidth: 1,
                    borderTopColor: '#e5e7eb',
                },
                tabBarActiveTintColor: '#2563eb',
                tabBarInactiveTintColor: '#9ca3af',
            }}
        >
            <Tabs.Screen
                name="insights"
                options={{
                    title: 'Insights',
                    tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="consultations"
                options={{
                    title: 'Consultations',
                    tabBarIcon: ({ color, size }) => <MessageSquare size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
                }}
            />
        </Tabs>
    );
}
