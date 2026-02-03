import React, { useState } from 'react';
import { LogOut, MessageSquare, UserPlus, User } from 'lucide-react';
import UserAvatar from './UserAvatar';
import ChatList from './ChatList';
import RequestList from './RequestList';
import FriendList from './FriendList';
import UserSearch from './UserSearch';

const Sidebar = ({ user, logout, selectedChat, onSelectChat }) => {
  const [activeTab, setActiveTab] = useState('chats');

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
        // If we are searching (handled inside UserSearch? No, UserSearch was the search input)
        // Wait, original code had search input always visible?
        // No, original code: Search Bar was always visible. If search term > 0, show results.
        // Else check activeTab.
        // My UserSearch component included the input AND the results.
        // So maybe I should render UserSearch always?
        // Or render UserSearch logic separate?
        
        // Let's adopt a slightly different UI or stick to original?
        // Original: Search bar always at top.
        // If typing in search bar -> show search results.
        // If not typing -> show active tab content.
        
        // To support "Multu component" and "Every component use its own data":
        // I'll make the SearchBar a component. If it has a value, it drives a "SearchResults" component.
        // But `UserSearch` component I created handles input + results.
        
        // Let's put UserSearch as a tab? No, usually search is always there.
        // Re-reading original Dashboard:
        // Search bar is distinct from tabs. Tabs were: Chats (MessageSquare), Requests (UserPlus), Friends (User).
        // Search input filtered users to add? "Search users to add..." -> This sounds like "New Chat" or "Global Search".
        // It says "Search users to add...". And results allow "sendFriendRequest".
        // So this is "Search for new friends".
        
        // I will keep the tabs. 
        // But `UserSearch` component I made includes the input. I should render it.
        // A cleaner UI: Tabs for: Chats, Friends, Requests, Find Users.
        // Let's add 'search' as a tab triggered by the sidebar?
        // Or keep the Search Input fixed at top?
        
        // If I use the `UserSearch` component I made, it has the input.
        // I will render it when a specific tab is active, OR I will modify `Sidebar` to match the original layout better.
        // Original layout: 
        // Header
        // Search Bar (Global?)
        // Content (Search Results OR Tab Content)
        
        // To reuse `UserSearch.jsx` easily:
        // I'll treat "Find People" as a mode.
        // Let's just put `UserSearch` in the 'search' tab?
        // I'll add a Search icon to the header to toggle 'search' tab.
        return <ChatList selectedChat={selectedChat} onSelectChat={onSelectChat} />;
    }
  };

  // Wait, I strictly followed the previous files.
  // UserSearch.jsx has the input.
  // So if I use `UserSearch` as a tab, the input is inside it. That works.
  // But the original had the input *above* the list always?
  // Actually, line 191 in original: Search Bar is below header, above Content.
  // And line 206: If searchTerm.length > 0, show results. Else show tab content.
  
  // So, proper refactoring:
  // Use `UserSearch` component for the "Search users to add" feature.
  // Maybe I can treat it as a separate tab "search" ?
  // Or I can keep the original behavior: The Search Input is always visible and overrides content?
  // If I do that, the Search Input needs to be hoisted or shared.
  
  // Let's simplify: Add a 'search' tab (Search Icon) to the sidebar header which renders the UserSearch component.
  // This separates concerns better than "typing overrides everything".
  
  return (
    <div className="w-1/3 min-w-[300px] max-w-[450px] border-r border-gray-200 flex flex-col">
      {/* Sidebar Header */}
      <div className="h-16 bg-[#f0f2f5] border-b border-gray-200 px-4 flex items-center justify-between">
            <UserAvatar user={user} />
            <div className="flex items-center space-x-4 text-gray-500">
              <LogOut size={20} className="cursor-pointer" onClick={logout} title="Logout" />
              <div className="flex space-x-3 border-l pl-3 border-gray-300">
                <UserPlus size={20} className={`cursor-pointer ${activeTab === 'requests' ? 'text-whatsapp-teal' : ''}`} onClick={() => setActiveTab('requests')} title="Friend Requests" />
                <MessageSquare size={20} className={`cursor-pointer ${activeTab === 'chats' ? 'text-whatsapp-teal' : ''}`} onClick={() => setActiveTab('chats')} title="Chats" />
                <User size={20} className={`cursor-pointer ${activeTab === 'friends' ? 'text-whatsapp-teal' : ''}`} onClick={() => setActiveTab('friends')} title="Friends" />
                <div className="relative">
                    <span className="cursor-pointer" onClick={() => setActiveTab('search')} title="Search Users">
                        🔍
                    </span>
                </div>
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
