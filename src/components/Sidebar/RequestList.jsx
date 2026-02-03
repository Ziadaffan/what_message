import React from 'react';
import UserAvatar from './UserAvatar';
import { useFriendRequests, useRespondToRequest } from '../../hooks/useFriends';

const RequestList = () => {
  const { data: friendRequests = [] } = useFriendRequests();
  const respondMutation = useRespondToRequest();

  const handleRequest = (requestId, status) => {
    respondMutation.mutate({ requestId, status });
  };

  return (
    <div className="py-2">
      <p className="px-4 text-xs font-semibold text-gray-500 mb-2">FRIEND REQUESTS</p>
      {friendRequests.length === 0 && <p className="px-4 text-sm text-gray-400 italic">No pending requests</p>}
      {friendRequests.map((req) => (
        <div key={req.id} className="flex items-center p-3 border-b">
          <UserAvatar user={req.sender} />
          <div className="ml-3 flex-1 min-w-0">
            <p className="text-sm font-medium">{req.sender.username}</p>
          </div>
          <div className="flex space-x-2">
            <button onClick={() => handleRequest(req.id, 'accepted')} className="px-2 py-1 bg-whatsapp-teal text-white text-xs rounded">Accept</button>
            <button onClick={() => handleRequest(req.id, 'declined')} className="px-2 py-1 bg-red-500 text-white text-xs rounded">Decline</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RequestList;
