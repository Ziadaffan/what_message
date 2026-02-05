import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!user) return;

    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      auth: { token: localStorage.getItem('token') },
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('get_online_users');
    });

    newSocket.on('get_online_users', (users) => {
      setOnlineUsers(users);
    });

    newSocket.on('user_online', (userId) => {
      setOnlineUsers((prev) => {
        if (prev.some(u => (u.id === userId || u === userId))) {
          return prev;
        }
        return [...prev, userId];
      });
    });

    newSocket.on('user_offline', (userId) => {
      setOnlineUsers((prev) => 
        prev.filter(u => (u.id !== userId && u !== userId))
      );
    });

    return () => {
      newSocket.close();
    };
  }, [user]);


  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
