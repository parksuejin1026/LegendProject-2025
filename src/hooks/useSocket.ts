import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';



export const useSocket = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const socketInitializer = async () => {
            await fetch('/api/socket/io');
            const socketInstance = io({
                path: '/api/socket/io',
                addTrailingSlash: false,
            });

            socketInstance.on('connect', () => {
                console.log('Socket connected:', socketInstance.id);
                setIsConnected(true);
            });

            socketInstance.on('disconnect', () => {
                console.log('Socket disconnected');
                setIsConnected(false);
            });

            setSocket(socketInstance);
        };

        socketInitializer();

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, []);

    return { socket, isConnected };
};
