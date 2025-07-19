import React from 'react';

interface TabFilterProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isDark?: boolean;
}

export const TabFilter: React.FC<TabFilterProps> = ({ activeTab, onTabChange, isDark }) => {
  const tabs = ['Day', 'Week', 'Month'];

  return (
    <div className={`flex space-x-1 p-1 rounded-lg ${
      isDark ? 'bg-gray-700' : 'bg-gray-100'
    }`}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === tab
              ? isDark 
                ? 'bg-gray-800 text-blue-400 shadow-sm' 
                : 'bg-white text-blue-600 shadow-sm'
              : isDark
                ? 'text-gray-300 hover:text-white'
                : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};