import React from 'react';
import ConversationItem from './ConversationItem';
import { useConversations } from '../../hooks/useChats';
import { useSocket } from '../../context/SocketContext';

const ChatList = ({ selectedChat, onSelectChat }) => {
  const { data: conversations = [], isLoading, isError, error } = useConversations();
  const { onlineUsers } = useSocket();

  const getFriendId = (chat) => {
    return chat.friendId || chat.friend?.user?.id || chat.friend?.id;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-sm text-gray-500">Loading conversations...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-sm text-red-500">Error: {error?.message || 'Failed to load conversations'}</div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-sm text-gray-400 text-center">
          <p>No conversations yet</p>
          <p className="text-xs mt-1">Search for users to start chatting!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-2">
      {conversations.map((chat) => {
        const friendId = getFriendId(chat);
        return (
          <ConversationItem
            key={chat.id}
            chat={chat}
            active={selectedChat?.id === chat.id}
            onClick={() => onSelectChat(chat)}
            online={onlineUsers.some(u => (u.id === friendId || u === friendId))}
          />
        );
      })}
    </div>
  );
};

export default ChatList;
