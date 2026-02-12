import { create } from 'zustand';
import { supabase } from './supabase';
import { Session } from '@supabase/supabase-js';

interface UserProfile {
    id: string;
    email: string;
    role: 'patient' | 'doctor';
    is_verified_doctor: boolean;
    full_name?: string;
    avatar_url?: string;
}

interface AuthState {
    session: Session | null;
    user: UserProfile | null;
    loading: boolean;
    setSession: (session: Session | null) => void;
    fetchProfile: () => Promise<void>;
    signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    session: null,
    user: null,
    loading: true,
    setSession: (session) => {
        set({ session });
        if (session) {
            get().fetchProfile();
        } else {
            set({ user: null, loading: false });
        }
    },
    fetchProfile: async () => {
        const { session } = get();
        if (!session?.user) return;

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (error) {
                console.error('Error fetching profile:', error);
            } else {
                set({ user: data as UserProfile, loading: false });
            }
        } catch (e) {
            console.error(e);
            set({ loading: false });
        }
    },
    signOut: async () => {
        await supabase.auth.signOut();
        set({ session: null, user: null });
    },
}));
