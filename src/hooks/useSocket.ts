import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

let socket: Socket;

export const useSocket = () => {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const socketInitializer = async () => {
            await fetch('/api/socket/io');
            socket = io({
                path: '/api/socket/io',
            });

            socket.on('connect', () => {
                setIsConnected(true);
            });

            socket.on('disconnect', () => {
                setIsConnected(false);
            });
        };

        socketInitializer();

        return () => {
            if (socket) socket.disconnect();
        };
    }, []);

    return { socket, isConnected };
};
