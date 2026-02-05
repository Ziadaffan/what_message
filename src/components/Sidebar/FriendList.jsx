import React from 'react';
import UserAvatar from './UserAvatar';
import { v4 as uuidv4 } from 'uuid';
import { useFriends } from '../../hooks/useFriends';
import { useConversations } from '../../hooks/useChats';

const FriendList = ({ onSelectChat }) => {
  const { data: friends = [], isLoading, isError, error } = useFriends();
  const { data: conversations = [] } = useConversations();

  const handleFriendClick = (friend) => {
    const friendId = friend.id;
    let chat = conversations.find(c => {
      const chatFriendId = c.friendId || c.friend?.user?.id || c.friend?.id;
      return chatFriendId === friendId;
    });
    if (!chat) {
      chat = { id: uuidv4(), friendId, friend };
    }
    onSelectChat(chat);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-sm text-gray-500">Loading friends...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-sm text-red-500">Error: {error?.message || 'Failed to load friends'}</div>
      </div>
    );
  }

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
