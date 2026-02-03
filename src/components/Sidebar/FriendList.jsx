import React from 'react';
import UserAvatar from './UserAvatar';
import { v4 as uuidv4 } from 'uuid';
import { useFriends } from '../../hooks/useFriends';
import { useConversations } from '../../hooks/useChats';

const FriendList = ({ onSelectChat }) => {
  const { data: friends = [] } = useFriends();
  const { data: conversations = [] } = useConversations();

  const handleFriendClick = (friend) => {
    let chat = conversations.find(c => c.friend?.user?.id === friend.id);
    if (!chat) {
      chat = { id: uuidv4(), friend: { user: friend, id: uuidv4() } };
      // Note: This temporary chat won't be in the conversations query cache 
      // until a message is sent or we manually update the cache.
      // For now, we pass it up to be set as selected.
    }
    onSelectChat(chat);
  };

  return (
    <div className="py-2">
      <p className="px-4 text-xs font-semibold text-gray-500 mb-2">FRIENDS</p>
      {friends.length === 0 && <p className="px-4 text-sm text-gray-400 italic">No friends</p>}
      {friends.map((friend) => (
        <div
          key={friend.id}
          className="flex items-center p-3 border-b cursor-pointer hover:bg-gray-100"
          onClick={() => handleFriendClick(friend)}
        >
          <UserAvatar user={friend} />
          <div className="ml-3 flex-1 min-w-0">
            <p className="text-sm font-medium">{friend.username}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FriendList;
