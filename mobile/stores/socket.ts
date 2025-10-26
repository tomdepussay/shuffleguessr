import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

async function getOrCreateUserId(): Promise<string> {
    try {
        let userId = await AsyncStorage.getItem('userId');
        if (!userId) {
            userId = uuid.v4();
            await AsyncStorage.setItem('userId', userId);
        }
        return userId;
    } catch (e) {
        console.error('Erreur lors de la récupération de userId', e);
        throw e;
    }
}

type SocketState = {
    socket: WebSocket | null;
    isConnected: boolean;
    userId: string | null;
    connect: (url: string) => void;
    createGame: (pseudo: string) => void;
    joinGame: (code: string, pseudo: string) => void;
    disconnect: () => void;
};

const useSocket = create<SocketState>((set, get) => ({
    socket: null,
    isConnected: false,
    userId: null,

    connect: async (url: string) => {
        const userId = await getOrCreateUserId();
        let socket = new WebSocket(url);

        socket.onopen = () => {
            console.log('✅ WebSocket connecté');
            set({ socket, isConnected: true });

            socket.send(JSON.stringify({ type: 'register', userId }));
        };

        socket.onclose = () => {
            console.log('❌ WebSocket déconnecté, tentative de reconnexion...');
            set({ socket: null, isConnected: false });
            setTimeout(() => {
                get().connect(url);
            }, 3000);
        };

        socket.onerror = (err) => {
            console.error('Erreur WebSocket', err);
        };
    },

    createGame: (pseudo: string) => {
        get().socket?.send(
            JSON.stringify({
                type: 'create',
                userId: get().userId,
                pseudo,
            })
        );
    },

    joinGame: (code: string, pseudo: string) => {
        get().socket?.send(
            JSON.stringify({
                type: 'join',
                userId: get().userId,
                code,
                pseudo,
            })
        );
    },

    disconnect: () => {
        console.log('WebSocket déconnecté');
        set((state) => {
            state.socket?.close();
            return { socket: null, isConnected: false };
        });
    },
}));

export default useSocket;
