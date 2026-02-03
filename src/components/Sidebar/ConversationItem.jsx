import React from 'react';
import UserAvatar from './UserAvatar';
import { format } from 'date-fns';

const ConversationItem = ({ chat, active, onClick, online }) => {
  const lastMsg = chat.last_message;
  const friend = chat.friend;

  return (
    <div
      onClick={onClick}
      className={`flex items-center p-3 cursor-pointer hover:bg-gray-100 transition-colors ${active ? 'bg-gray-200' : ''}`}
    >
      <div className="relative">
        <UserAvatar user={friend.user} />
        {online && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        )}
      </div>
      <div className="ml-3 flex-1 min-w-0 border-b border-gray-100 pb-2">
        <div className="flex justify-between items-baseline">
          <h3 className="text-sm font-semibold truncate">{friend.user.username}</h3>
          {lastMsg && (
            <span className="text-xs text-gray-500">
              {format(new Date(lastMsg.created_at), 'p')}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 truncate mt-0.5">
          {lastMsg?.content || 'Started a conversation'}
        </p>
      </div>
    </div>
  );
};

export default ConversationItem;
