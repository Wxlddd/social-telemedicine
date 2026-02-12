import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useAuthStore } from '../../lib/store';
import { Plus } from 'lucide-react-native';

const MOCK_QUESTIONS = [
    { id: '1', content: 'I have a rash on my arm, what should I do?', author: 'Patient X', replies: 2 },
    { id: '2', content: 'Is 98.6 fever?', author: 'Patient Y', replies: 5 },
];

export default function Consultations() {
    const { user } = useAuthStore();
    const [questions, setQuestions] = useState(MOCK_QUESTIONS);

    const handleAskQuestion = () => {
        if (user?.role !== 'patient') {
            // Doctors usually don't ask questions here, but typically they might? 
            // Spec says "Patients asking health questions"
            Alert.alert("Info", "This is for patients to ask questions.");
            return;
        }
        Alert.alert("Ask Question", "Open Text/Video Input");
    };

    return (
        <View className="flex-1 bg-gray-50 pt-12">
            <Text className="text-2xl font-bold px-4 mb-4">Consultations</Text>

            <FlatList
                data={questions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View className="bg-white p-4 mx-4 mb-4 rounded-lg shadow-sm">
                        <Text className="font-semibold text-lg mb-2">{item.content}</Text>
                        <View className="flex-row justify-between items-center">
                            <Text className="text-gray-500 text-sm">by {item.author}</Text>
                            <Text className="text-blue-500 font-bold">{item.replies} Replies</Text>
                        </View>
                        {/* Only doctors can reply, check in detail view */}
                        <TouchableOpacity
                            className="mt-3 bg-gray-100 p-2 rounded items-center"
                            onPress={() => Alert.alert("Details", "Go to detail view to see/add replies")}
                        >
                            <Text className="text-blue-600">View Discussion</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />

            {user?.role === 'patient' && (
                <TouchableOpacity
                    onPress={handleAskQuestion}
                    className="absolute bottom-6 right-6 bg-blue-600 p-4 rounded-full shadow-lg"
                >
                    <Plus color="white" size={32} />
                </TouchableOpacity>
            )}
        </View>
    );
}
