import React, { useEffect, useRef, useState } from 'react';
import ChatHeader from './ChatHeader';
import MessageItem from './MessageItem';
import MessageInput from './MessageInput';
import { MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { useMessageHistory } from '../../hooks/useMessages';
import { useQueryClient } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';

const ChatWindow = ({ selectedChat, onBack }) => {
  const { user } = useAuth();
  const { socket, onlineUsers } = useSocket();
  const [isFriendTyping, setIsFriendTyping] = useState(false);
  const queryClient = useQueryClient();
  const messagesEndRef = useRef(null);

  const getFriendId = () => {
    if (!selectedChat) return null;
    return selectedChat.friendId || selectedChat.friend?.user?.id || selectedChat.friend?.id;
  };

  const friendId = getFriendId();
  const friend = selectedChat?.friend?.user || selectedChat?.friend;

  const { data: messages = [], isLoading } = useMessageHistory(friendId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (socket && selectedChat) {
      socket.emit('join_chat', { chatId: selectedChat.id });
      
      return () => {
        socket.emit('leave_chat', { chatId: selectedChat.id });
      };
    }
  }, [socket, selectedChat]);



  useEffect(() => {
    if (!socket || !selectedChat || !friendId) return;

    const handleReceiveMessage = (message) => {
      if (message.senderId === friendId || message.receiverId === friendId) {
        queryClient.setQueryData(['messages', friendId], (old) => {
          if (!old) return [message];
          
          const existingOptimisticIndex = old.findIndex(m => 
            (m.tempId && m.tempId === message.tempId) || (m.id === message.tempId)
          );

          if (existingOptimisticIndex > -1) {
            const newMessages = [...old];
            newMessages[existingOptimisticIndex] = message;
            return newMessages;
          }

          if (old.find(m => m.id === message.id)) return old;

          return [...old, message];
        });
      }
    };

    const handleTypingStatus = ({ senderId, isTyping: typingStatus }) => {
      if (senderId === friendId) {
        setIsFriendTyping(typingStatus);
      }
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('typing_status', handleTypingStatus);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('typing_status', handleTypingStatus);
    };
  }, [socket, selectedChat, friendId, queryClient]);

  const handleSendMessage = (content) => {
    if (!selectedChat || !socket || !friendId) return;

    const tempId = uuidv4();
    const newMessage = {
      id: tempId,
      tempId: tempId,
      senderId: user.id,
      receiverId: friendId,
      content,
      createdAt: new Date().toISOString(),
    };

    queryClient.setQueryData(['messages', friendId], (old) => {
      return old ? [...old, newMessage] : [newMessage];
    });
    socket.emit('send_message', {
      receiverId: friendId,
      chatId: selectedChat.id,
      content,
      tempId,
    });
  };

  const handleTyping = (status) => {
    if (socket && selectedChat && friendId) {
      socket.emit('typing', { receiverId: friendId, isTyping: status });
    }
  };

  if (!selectedChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-10 bg-[#efeae2]">
        <div className="bg-whatsapp-teal/10 p-6 rounded-full mb-4">
          <MessageSquare size={64} className="text-whatsapp-teal" />
        </div>
        <h1 className="text-2xl font-light text-gray-700">WhatsApp for Web</h1>
        <p className="text-gray-500 mt-2 max-w-sm">
          Send and receive messages without keeping your phone online.
        </p>
      </div>
    );
  }

  if (!friend) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-10 bg-[#efeae2]">
        <p className="text-red-500">Error: Invalid chat data</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#efeae2] overflow-hidden h-full">
      <ChatHeader
        friend={friend}
        online={onlineUsers.some(u => u.id === friendId || u === friendId)}
        typing={isFriendTyping}
        onBack={onBack}
      />
      <div className="flex-1 overflow-y-auto px-6 py-4 chat-bg">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Loading messages...</p>
          </div>
        ) : (
          <div className="flex flex-col space-y-2">
            {messages.map((msg) => (
              <MessageItem
                key={msg.id}
                message={msg}
                isOwn={msg.senderId === user.id}
                isRead={msg.isRead}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      <MessageInput onSendMessage={handleSendMessage} onTyping={handleTyping} />
    </div>
  );
};

export default ChatWindow;
