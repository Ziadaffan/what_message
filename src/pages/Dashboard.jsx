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
        <div className={`${selectedChat ? 'hidden sm:flex' : 'flex'} w-full sm:w-1/3 sm:min-w-[300px] sm:max-w-[450px] border-r border-gray-200`}>
          <Sidebar 
            user={user} 
            logout={logout} 
            selectedChat={selectedChat} 
            onSelectChat={setSelectedChat} 
          />
        </div>

        {/* Chat Window */}
        <div className={`${selectedChat ? 'flex' : 'hidden sm:flex'} flex-1 flex flex-col h-full overflow-hidden`}>
          <ChatWindow 
            selectedChat={selectedChat} 
            onBack={() => setSelectedChat(null)} 
          />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
