import React from 'react';
import ConversationItem from './ConversationItem';
import { useConversations } from '../../hooks/useChats';
import { useSocket } from '../../context/SocketContext';

const ChatList = ({ selectedChat, onSelectChat }) => {
  const { data: conversations = [] } = useConversations();
  const { onlineUsers } = useSocket();

  return (
    <div className="py-2">
      {conversations.map((chat) => (
        <ConversationItem
          key={chat.id}
          chat={chat}
          active={selectedChat?.id === chat.id}
          onClick={() => onSelectChat(chat)}
          online={onlineUsers.some(u => (u.id === chat.friend?.user?.id || u === chat.friend?.user?.id))}
        />
      ))}
    </div>
  );
};

export default ChatList;
