import React from 'react';

interface TabFilterProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isDark?: boolean;
  startDate?: string;
  endDate?: string;
  onStartDateChange?: (date: string) => void;
  onEndDateChange?: (date: string) => void;
}

export const TabFilter: React.FC<TabFilterProps> = ({ 
  activeTab, 
  onTabChange, 
  isDark,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange
}) => {
  const tabs = ['Day', 'Week', 'Month', 'Custom Range'];

    return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
      {/* Tab Filter */}
      <div className={`flex flex-wrap lg:flex-nowrap space-x-1 p-1 rounded-lg ${
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

      {/* Custom Range Date Selectors */}
      {activeTab === 'Custom Range' && (
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
          <div className="flex items-center gap-2">
            <label className={`text-sm font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              From:
            </label>
            <input
              type="date"
              value={startDate || ''}
              onChange={(e) => onStartDateChange?.(e.target.value)}
              className={`px-3 py-2 rounded-md text-sm border transition-colors ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400 focus:ring-blue-400' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <label className={`text-sm font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              To:
            </label>
            <input
              type="date"
              value={endDate || ''}
              onChange={(e) => onEndDateChange?.(e.target.value)}
              min={startDate} // Ensure end date is not before start date
              className={`px-3 py-2 rounded-md text-sm border transition-colors ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400 focus:ring-blue-400' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
            />
          </div>
        </div>
      )}
    </div>
  );
};