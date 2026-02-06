import React, { useState } from 'react';
import UserAvatar from './UserAvatar';
import { useFriendRequests, useRespondToRequest } from '../../hooks/useFriends';

const RequestList = () => {
  const { data: friendRequests = [], isLoading, isError, error } = useFriendRequests();
  const { mutate: respondToRequest } = useRespondToRequest();
  const [processingRequest, setProcessingRequest] = useState(null);
  const [actionType, setActionType] = useState(null);

  const handleAccept = (requestId, status) => {
    setProcessingRequest(requestId);
    setActionType('accepting');
    respondToRequest(
      { requestId, status },
      {
        onSettled: () => {
          setProcessingRequest(null);
          setActionType(null);
        }
      }
    );
  };

  const handleDecline = (requestId, status) => {
    setProcessingRequest(requestId);
    setActionType('declining');
    respondToRequest(
      { requestId, status },
      {
        onSettled: () => {
          setProcessingRequest(null);
          setActionType(null);
        }
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-sm text-gray-500">Loading requests...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-sm text-red-500">Error: {error?.message || 'Failed to load requests'}</div>
      </div>
    );
  }

  return (
    <div className="py-2">
      <p className="px-4 text-xs font-semibold text-gray-500 mb-2">FRIEND REQUESTS</p>
      {friendRequests.length === 0 && <p className="px-4 text-sm text-gray-400 italic">No pending requests</p>}
      {friendRequests.map((req) => {
        const isProcessing = processingRequest === req.id;
        const isAccepting = isProcessing && actionType === 'accepting';
        const isDeclining = isProcessing && actionType === 'declining';

        return (
          <div key={req.id} className="flex items-center p-3 border-b">
            <UserAvatar user={req.sender} />
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium">{req.sender.username}</p>
            </div>
            <div className="flex space-x-2">
              <button 
                disabled={isProcessing} 
                onClick={() => handleAccept(req.id, 'accepted')} 
                className="px-2 py-1 bg-whatsapp-teal text-white text-xs rounded disabled:opacity-50"
              >
                {isAccepting ? 'Accepting...' : 'Accept'}
              </button>
              <button 
                disabled={isProcessing} 
                onClick={() => handleDecline(req.id, 'declined')} 
                className="px-2 py-1 bg-red-500 text-white text-xs rounded disabled:opacity-50"
              >
                {isDeclining ? 'Declining...' : 'Decline'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RequestList;