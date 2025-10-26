import { Stack } from 'expo-router';
import './global.css';
import { SocketProvider } from '@/contexts/SocketContext';

export default function RootLayout() {
    return (
        <SocketProvider>
            <Stack screenOptions={{ headerShown: false }} />
        </SocketProvider>
    );
}
