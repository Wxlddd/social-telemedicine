import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuthStore } from '../lib/store';
import { supabase } from '../lib/supabase';
import { Video, ResizeMode } from 'expo-av';
// import item from expo-image-picker in real app

export default function CreatePost() {
    const router = useRouter();
    const { type } = useLocalSearchParams<{ type: 'insight' | 'consultation' }>(); // 'insight' or 'consultation'
    const { user } = useAuthStore();

    const [content, setContent] = useState('');
    const [videoUri, setVideoUri] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handlePickVideo = async () => {
        // Implement ImagePicker logic here 
        Alert.alert("Pick Video", "This would open ImagePicker");
        // Mock selection
        // setVideoUri('http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4');
    };

    const handleSubmit = async () => {
        if (!user) return;
        setLoading(true);

        try {
            // Upload video to Supabase Storage (omitted for prototype)
            // const publicVideoUrl = ...

            const { error } = await supabase.from('posts').insert({
                user_id: user.id,
                type: type,
                content: content,
                video_url: videoUri,
            });

            if (error) throw error;

            Alert.alert("Success", "Post created!");
            router.back();
        } catch (e: any) {
            Alert.alert("Error", e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-white p-4">
            <Text className="text-2xl font-bold mb-4">
                {type === 'insight' ? 'New Medical Insight' : 'Ask a Question'}
            </Text>

            <TextInput
                className="border border-gray-300 rounded p-4 mb-4 text-lg"
                placeholder={type === 'insight' ? "Describe your insight..." : "What's your health question?"}
                multiline
                numberOfLines={4}
                value={content}
                onChangeText={setContent}
            />

            {type === 'insight' && (
                <TouchableOpacity
                    onPress={handlePickVideo}
                    className="bg-gray-100 h-48 justify-center items-center rounded mb-4"
                >
                    {videoUri ? (
                        <Text>Video Selected</Text>
                    ) : (
                        <Text className="text-blue-500 font-bold">+ Upload Video</Text>
                    )}
                </TouchableOpacity>
            )}

            <TouchableOpacity
                onPress={handleSubmit}
                disabled={loading}
                className="bg-blue-600 p-4 rounded items-center"
            >
                {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">Post</Text>}
            </TouchableOpacity>
        </View>
    );
}
