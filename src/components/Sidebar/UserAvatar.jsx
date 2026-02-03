import React from 'react';

const UserAvatar = ({ user, size = 'md' }) => {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-xl'
  };

  const getInitials = (name) => {
    return name?.slice(0, 2).toUpperCase() || '??';
  };

  return (
    <div className={`${sizes[size]} rounded-full bg-gray-300 flex items-center justify-center font-semibold text-gray-700 overflow-hidden flex-shrink-0`}>
      {user?.avatar ? (
        <img src={user.avatar} alt={user.username} className="h-full w-full object-cover" />
      ) : (
        <span>{getInitials(user?.username)}</span>
      )}
    </div>
  );
};

export default UserAvatar;
