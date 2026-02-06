import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import UserAvatar from './UserAvatar';
import { useSearchUsers, useSendFriendRequest } from '../../hooks/useSearch';
import { useSocket } from '../../context/SocketContext';

const UserSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sendingTo, setSendingTo] = useState(null);
  const { data: searchResults = [] } = useSearchUsers(searchTerm);
  const sendRequestMutation = useSendFriendRequest();
  const {socket} = useSocket();

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSendRequest = (userId) => {
      setSendingTo(userId);
      sendRequestMutation.mutate(userId, {
          onSuccess: () => {
              socket.emit('friend_request_sent', {receiverId: userId});
              alert('Request sent!');
              setSearchTerm('');
              setSendingTo(null); 
          },
          onError: (err) => {
              alert(err.response.data.message);
              setSendingTo(null); 
          }
      });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 bg-white">
        <div className="relative flex items-center bg-gray-100 rounded-lg px-3 py-2">
          <Search size={18} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search users to add..."
            className="bg-transparent text-sm w-full focus:outline-none"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-2">
        {searchTerm.length > 0 && (
            <>
            <p className="px-4 text-xs font-semibold text-gray-500 mb-2">SEARCH RESULTS</p>
            {searchResults.map((u) => (
            <div key={u.id} className="flex items-center p-3 hover:bg-gray-100">
                <UserAvatar user={u} />
                <div className="ml-3 flex-1">
                <p className="text-sm font-medium">{u.username}</p>
                </div>
                <button
                onClick={() => handleSendRequest(u.id)}
                className="bg-whatsapp-teal text-white p-1 rounded-md"
                disabled={sendingTo === u.id}
                >
                {sendingTo === u.id ? 'Sending...' : <Plus size={16} />}
                </button>
            </div>
            ))}
            </>
        )}
      </div>
    </div>
  );
};

export default UserSearch;