import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';

type SocketContextType = {
    socket: WebSocket | null;
};

export const SocketContext = createContext<SocketContextType>({
    socket: null,
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const socketRef = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        socketRef.current = new WebSocket(`ws://10.184.17.240:8080`);

        socketRef.current.onopen = () => {
            console.log('WebSocket connecté');
            setIsConnected(true);
        };

        socketRef.current.onclose = () => {
            console.log('WebSocket déconnecté');
            setIsConnected(false);
        };

        socketRef.current.onerror = (err) => {
            console.error('Erreur WebSocket', err);
        };

        return () => {
            socketRef.current?.close();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket: socketRef.current }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
