import React from 'react';
import UserAvatar from './UserAvatar';
import { format } from 'date-fns';
import { useSocket } from '../../context/SocketContext';
import { useEffect, useState } from 'react';

const ConversationItem = ({ chat, active, onClick, online }) => {
  const { socket } = useSocket();
  const friend = chat.friend?.user || chat.friend;
  const lastMsg = chat.last_message || chat.lastMessage;
  const [unreadCount, setUnreadCount] = useState(0);

  const displayUnread = active ? 0 : unreadCount;

  useEffect(() => {
    if (!socket) return;

    socket.emit('get_unread_count', { chatId: chat.id });

    const handleUnreadCount = (data) => {
      const count = typeof data === 'object' ? data.count : data;
      const receivedChatId = typeof data === 'object' ? data.chatId : null;

      if (receivedChatId && receivedChatId !== chat.id) return;
      
      setUnreadCount(count);
    };

    const handleMessagesRead = (data) => {
      const receivedId = data && typeof data === 'object' ? (data.chatId || data.chat_id) : data;
      if (receivedId === chat.id) {
        setUnreadCount(0);
      }
    };

    socket.on('unread_count', handleUnreadCount);
    socket.on('messages_read', handleMessagesRead);

    return () => {
      socket.off('unread_count', handleUnreadCount);
      socket.off('messages_read', handleMessagesRead);
    };
  }, [socket, chat.id]);


  if (!friend) {
    console.error('Invalid chat object:', chat);
    return null;
  }

  return (
    <div
      onClick={onClick}
      className={`flex items-center p-3 cursor-pointer hover:bg-gray-100 transition-colors ${active ? 'bg-gray-200' : ''}`}
    >
      <div className="relative">
        <UserAvatar user={friend} />
        {online && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        )}
      </div>
      <div className="ml-3 flex-1 min-w-0 border-b border-gray-100 pb-2">
        {/* Ligne du haut */}
        <div className="flex justify-between items-start">
          <h3 className="text-sm font-semibold truncate">
            {friend.username}
          </h3>

          <div className="flex flex-col items-end shrink-0 ml-2">
            {lastMsg && (
              <span className="text-xs text-gray-500 leading-none">
                {format(new Date(lastMsg.created_at || lastMsg.createdAt), 'p')}
              </span>
            )}
          </div>
        </div>

        {/* Ligne du bas */}
        <div className="mt-1 flex items-center justify-between">
          <p className="text-xs text-gray-500 truncate">
            {lastMsg?.content || 'Started a conversation'}
          </p>
          {displayUnread > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-whatsapp-teal text-white rounded-full">
              {displayUnread}
            </span>
          )}
        </div>
      </div>

    </div>
  );
};

export default ConversationItem;
