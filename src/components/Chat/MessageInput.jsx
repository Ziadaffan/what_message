import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare } from 'lucide-react';

const MessageInput = ({ onSendMessage, onTyping }) => {
  const [text, setText] = useState('');
  const typingTimeoutRef = useRef(null);

  const handleInputChange = (e) => {
    setText(e.target.value);
    
    onTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = setTimeout(() => {
      onTyping(false);
    }, 2000);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text);
    setText('');
    onTyping(false);
  };

  return (
    <div className="bg-[#f0f2f5] px-4 py-2 flex items-center space-x-3">
      <form onSubmit={handleSend} className="flex-1">
        <input
          type="text"
          value={text}
          onChange={handleInputChange}
          placeholder="Type a message"
          className="w-full bg-white rounded-lg px-4 py-2 focus:outline-none text-sm"
        />
      </form>

      <div className="text-gray-500">
        <button onClick={handleSend} className="bg-whatsapp-teal text-white p-2 rounded-full">
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
