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

const ChatWindow = ({ selectedChat }) => {
  const { user } = useAuth();
  const { socket, onlineUsers } = useSocket();
  const [isFriendTyping, setIsFriendTyping] = useState(false);
  const queryClient = useQueryClient();
  const messagesEndRef = useRef(null);

  const friendId = selectedChat?.friend?.user?.id;
  const { data: messages = [] } = useMessageHistory(friendId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    if(selectedChat) {
      socket.emit('mark_read', {
        chatId: selectedChat.id,
        receiverId: friendId,
      });
    }

  }, [messages, selectedChat, socket, user, friendId]);

  useEffect(() => {
    if (!socket || !selectedChat) return;

    const handleReceiveMessage = (message) => {
      if (message.senderId === friendId || message.receiverId === friendId) {
        queryClient.setQueryData(['messages', friendId], (old) => {
           if (!old) return [message];
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

    const handleMarkRead = (data) => {
      const chatId = data.chatId || data;
      // The event payload likely contains the ID of the user who read the messages.
      // It might be 'senderId' (from the emit) or 'readerId'.
      const readerId = data.readerId || data.senderId;
      
      console.log('Read receipt for:', chatId, 'by:', readerId);

      // Only mark messages as read if the current selected chat matches 
      // AND the person who read the messages is the friend (not self).
      if (chatId === selectedChat.id && readerId === friendId) {
        queryClient.setQueryData(['messages', friendId], (old) => {
          if (!old) return old;
          return old.map(m => ({
            ...m,
            isRead: true,
          }));
        });
      }
    };  

    socket.on('display_typing', handleTypingStatus);
    socket.on('receive_message', handleReceiveMessage);
    socket.on('typing_status', handleTypingStatus);
    socket.on('message_read', handleMarkRead);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('typing_status', handleTypingStatus);
      socket.off('display_typing', handleTypingStatus);
      socket.off('message_read', handleMarkRead);
    };
  }, [socket, selectedChat, friendId, queryClient]);

  const handleSendMessage = (content) => {
    if (!selectedChat || !socket) return;

    socket.emit('send_message', {
      receiverId: friendId,
      chatId: selectedChat.id,
      content,
    });

    const newMessage = {
      id: uuidv4(),
      senderId: user.id,
      receiver_id: friendId,
      content,
      createdAt: new Date(),
    };

    queryClient.setQueryData(['messages', friendId], (old) => {
      return old ? [...old, newMessage] : [newMessage];
    });
  };

  const handleTyping = (status) => {
    if (socket && selectedChat) {
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

  return (
    <div className="flex-1 flex flex-col bg-[#efeae2]">
      <ChatHeader
        friend={selectedChat.friend}
        online={onlineUsers.some(u => u.id === friendId || u === friendId)}
        typing={isFriendTyping}
      />
      <div className="flex-1 overflow-y-auto px-6 py-4 chat-bg">
        <div className="flex flex-col space-y-2">
          {messages.map((msg) => (
            <MessageItem
              key={msg.id}
              message={msg}
              isOwn={msg.senderId === user.id}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <MessageInput onSendMessage={handleSendMessage} onTyping={handleTyping} />
    </div>
  );
};

export default ChatWindow;
