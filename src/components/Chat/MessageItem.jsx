import React from 'react';
import { format } from 'date-fns';
import { Check, CheckCheck } from 'lucide-react';

const MessageItem = ({ message, isOwn }) => {
  return (
    <div className={`flex w-full mb-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] px-2 py-1.5 rounded-lg shadow-sm relative ${isOwn ? 'bg-whatsapp-bubble rounded-tr-none' : 'bg-white rounded-tl-none'
          }`}
      >
        <p className="text-sm text-gray-800 break-words pb-3 pr-8">{message.content}</p>
        <div className="absolute bottom-1 right-1.5 flex items-center space-x-1">
          <span className="text-[10px] text-gray-500">
            {format(new Date(message.createdAt), 'HH:mm')}
          </span>
          {isOwn && (message.isRead ?
            <CheckCheck size={14} className="text-blue-500" />
            : <CheckCheck size={14} className="text-gray-500" />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
