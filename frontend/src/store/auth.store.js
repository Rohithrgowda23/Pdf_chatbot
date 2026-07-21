import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            setAuth: (user, token) => {
                localStorage.setItem('jwt_token', token);
                set({ user, token, isAuthenticated: true });
            },

            updateUser: (user) => set({ user }),

            logout: () => {
                localStorage.removeItem('jwt_token');
                set({ user: null, token: null, isAuthenticated: false });
            },

            getToken: () => get().token,
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
