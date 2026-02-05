import React, { useEffect, useState } from 'react';
import { LogOut, MessageSquare, UserPlus, User } from 'lucide-react';
import UserAvatar from './UserAvatar';
import ChatList from './ChatList';
import RequestList from './RequestList';
import FriendList from './FriendList';
import UserSearch from './UserSearch';
import { useFriendRequests } from '../../hooks/useFriends';
import { useSocket } from '../../context/SocketContext';

const Sidebar = ({ user, logout, selectedChat, onSelectChat }) => {
  const {socket} = useSocket();
  const [activeTab, setActiveTab] = useState('chats');
  const { data: friendRequests = [], refetch } = useFriendRequests();

  const hasPendingRequests = friendRequests.length > 0 && activeTab !== 'requests';

  useEffect(() => {
    if (socket) {
      socket.on('friend_request_received', () => {
        refetch();
      });
    }
  }, [socket, refetch]);


  const renderContent = () => {
    switch (activeTab) {
      case 'requests':
        return <RequestList />;
      case 'friends':
        return <FriendList onSelectChat={(chat) => {
            onSelectChat(chat);
            setActiveTab('chats');
        }} />;
      case 'chats':
      default:
        return <ChatList selectedChat={selectedChat} onSelectChat={onSelectChat} />;
    }
  };
  
  return (
    <div className="w-1/3 min-w-[300px] max-w-[450px] border-r border-gray-200 flex flex-col">
      {/* Sidebar Header */}
      <div className="h-20 bg-[#f0f2f5] border-b border-gray-200 px-4 flex items-center justify-between">
        <div className="flex flex-col items-center mr-4">
          <UserAvatar user={user} />
          <span className='text-xs text-gray-600 mt-1 font-medium truncate max-w-[80px]'>{user.username}</span>
        </div>

        <div className="flex items-center space-x-4 text-gray-500">
          <div className="flex items-center space-x-3 pl-3">
            <div className="relative">
              <UserPlus
                size={20}
                className={`cursor-pointer transition-colors ${activeTab === 'requests' ? 'text-whatsapp-teal' : 'hover:text-gray-700'}`}
                onClick={() => setActiveTab('requests')}
                title="Friend Requests"
              />
              {hasPendingRequests && (
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-[#f0f2f5] rounded-full"></div>
              )}
            </div>
            <MessageSquare size={20} className={`cursor-pointer transition-colors ${activeTab === 'chats' ? 'text-whatsapp-teal' : 'hover:text-gray-700'}`} onClick={() => setActiveTab('chats')} title="Chats" />
            <User size={20} className={`cursor-pointer transition-colors ${activeTab === 'friends' ? 'text-whatsapp-teal' : 'hover:text-gray-700'}`} onClick={() => setActiveTab('friends')} title="Friends" />
            <div className="relative">
              <span className="cursor-pointer hover:text-gray-700" onClick={() => setActiveTab('search')} title="Search Users">
                🔍
              </span>
            </div>
          </div>
          <div className="border-l pl-3 border-gray-300">
            <LogOut size={20} className="cursor-pointer hover:text-gray-700" onClick={logout} title="Logout" />
          </div>
        </div>
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto bg-white">
        {activeTab === 'search' && <UserSearch />}
        {activeTab !== 'search' && renderContent()}
      </div>
    </div>
  );
};

export default Sidebar;
