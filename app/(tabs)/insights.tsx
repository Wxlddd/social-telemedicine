import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { useAuthStore } from '../../lib/store';
import { supabase } from '../../lib/supabase';
import { Video, ResizeMode } from 'expo-av';
import { Plus } from 'lucide-react-native';

const { height } = Dimensions.get('window');

// Mock data until we connect DB
const MOCK_DATA = [
    { id: '1', video_url: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4', title: 'Heart Health Tips', doctor: 'Dr. Smith' },
    { id: '2', video_url: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4', title: 'Diabetes Management', doctor: 'Dr. Jones' },
];

export default function Insights() {
    const { user } = useAuthStore();
    const [posts, setPosts] = useState(MOCK_DATA);

    // Fetch posts from Supabase (placeholder logic)
    useEffect(() => {
        // fetchPosts();
    }, []);

    const renderItem = ({ item }: { item: any }) => (
        <View style={{ height: height - 130, width: '100%' }} className="bg-black justify-center items-center relative">
            <Video
                style={{ width: '100%', height: '100%' }}
                source={{ uri: item.video_url }}
                resizeMode={ResizeMode.COVER}
                shouldPlay={true} // In real app, manage focus
                isLooping
                isMuted={false}
            />
            <View className="absolute bottom-10 left-4 right-4 bg-transparent">
                <Text className="text-white font-bold text-xl mb-1">{item.title}</Text>
                <Text className="text-white opacity-80">{item.doctor}</Text>
            </View>
        </View>
    );

    const handleCreatePost = () => {
        if (!user?.is_verified_doctor) {
            Alert.alert("Restricted", "Only verified doctors can post technical insights.");
            return;
        }
        Alert.alert("Create Post", "Open Video Camera/Picker");
    };

    return (
        <View className="flex-1 bg-black">
            <FlatList
                data={posts}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                snapToInterval={height - 130} // Adjust based on TabBar height
                decelerationRate="fast"
            />

            {/* FAB for Doctors */}
            {user?.is_verified_doctor && (
                <TouchableOpacity
                    onPress={handleCreatePost}
                    className="absolute top-12 right-4 bg-blue-600 p-3 rounded-full"
                >
                    <Plus color="white" size={24} />
                </TouchableOpacity>
            )}
        </View>
    );
}
