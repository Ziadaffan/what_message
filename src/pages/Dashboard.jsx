import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import Sidebar from '../components/Sidebar/Sidebar';
import ChatWindow from '../components/Chat/ChatWindow';
import { useQueryClient } from '@tanstack/react-query';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { socket } = useSocket();
  const [selectedChat, setSelectedChat] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    };

    const handleNewChat = (chat) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('new_chat', handleNewChat);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('new_chat', handleNewChat);
    };
  }, [socket, queryClient]);

  return (
    <div className="flex h-screen bg-whatsapp-teal p-0 sm:p-4 overflow-hidden">
      <div className="flex h-full w-full max-w-[1600px] mx-auto bg-white shadow-lg overflow-hidden">
        
        {/* Sidebar */}
        <Sidebar 
          user={user} 
          logout={logout} 
          selectedChat={selectedChat} 
          onSelectChat={setSelectedChat} 
        />

        {/* Chat Window */}
        <ChatWindow selectedChat={selectedChat} />

      </div>
    </div>
  );
};

export default Dashboard;
