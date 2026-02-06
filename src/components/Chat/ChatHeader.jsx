import React from 'react';
import UserAvatar from '../Sidebar/UserAvatar';
import { ArrowLeft } from 'lucide-react';

const ChatHeader = ({ friend, online, typing, onBack }) => {
  const user = friend?.user || friend;

  if (!user) return null;

  return (
    <div className="h-16 bg-[#f0f2f5] border-b border-gray-200 flex items-center justify-between px-4 py-2">
      <div className="flex items-center">
        {onBack && (
          <button 
            onClick={onBack}
            className="sm:hidden mr-3 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={24} />
          </button>
        )}
        <UserAvatar user={user} />
        <div className="ml-3">
          <h2 className="text-sm font-semibold leading-tight">{user.username}</h2>
          <p className="text-xs text-gray-500">
            {typing ? <span className="text-whatsapp-teal font-medium">typing...</span> : (online ? 'Online' : 'Offline')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
