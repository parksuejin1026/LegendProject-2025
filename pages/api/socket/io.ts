import { Server as NetServer } from 'http';
import { NextApiRequest } from 'next';
import { Server as ServerIO } from 'socket.io';
import { NextApiResponse } from 'next';

export type NextApiResponseServerIO = NextApiResponse & {
    socket: any & {
        server: NetServer & {
            io: ServerIO;
        };
    };
};

export const config = {
    api: {
        bodyParser: false,
    },
};

const ioHandler = (_req: NextApiRequest, res: NextApiResponseServerIO) => {
    if (!res.socket.server.io) {
        const path = '/api/socket/io';
        const httpServer: NetServer = res.socket.server as any;
        const io = new ServerIO(httpServer, {
            path: path,
            addTrailingSlash: false,
        });

        io.on('connection', (socket) => {
            console.log('Socket connected:', socket.id);

            socket.on('join-room', (roomId) => {
                socket.join(roomId);
                console.log(`Socket ${socket.id} joined room ${roomId}`);
                // 방에 있는 다른 사람들에게 알림
                socket.to(roomId).emit('user-connected', socket.id);
            });

            socket.on('make-move', (data) => {
                // 같은 방에 있는 다른 사람들에게 수신된 돌 위치 전송
                socket.to(data.roomId).emit('receive-move', data);
            });

            socket.on('game-over', (data) => {
                socket.to(data.roomId).emit('game-over', data);
            });

            socket.on('send-emote', (data) => {
                socket.to(data.roomId).emit('receive-emote', data.emote);
            });

            socket.on('quick-match', () => {
                let foundRoom = null;
                const rooms = io.sockets.adapter.rooms;

                for (const [roomId, participants] of rooms) {
                    // socket.id와 같은 방은 제외 (자신의 개인 방)
                    if (roomId !== socket.id && participants.size === 1) {
                        foundRoom = roomId;
                        break;
                    }
                }

                if (foundRoom) {
                    socket.join(foundRoom);
                    console.log(`Socket ${socket.id} joined room ${foundRoom} (Quick Match)`);
                    socket.emit('room-joined', { roomId: foundRoom, role: 'guest' }); // 게스트 (백돌)
                    socket.to(foundRoom).emit('user-connected', socket.id);
                } else {
                    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
                    socket.join(newRoomId);
                    console.log(`Socket ${socket.id} created room ${newRoomId} (Quick Match)`);
                    socket.emit('room-joined', { roomId: newRoomId, role: 'host' }); // 호스트 (흑돌)
                }
            });

            socket.on('disconnect', () => {
                console.log('Socket disconnected:', socket.id);
            });
        });

        res.socket.server.io = io;
    }
    res.end();
};

export default ioHandler;
