import React, { useState, useEffect, useRef } from 'react';

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
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(
    startDate ? new Date(startDate) : null
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(
    endDate ? new Date(endDate) : null
  );
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isSelectingEnd, setIsSelectingEnd] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close calendar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    };

    if (isCalendarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isCalendarOpen]);

  const tabs = ['Day', 'Week', 'Month', 'Custom Range'];

  const handleCustomRangeClick = () => {
    onTabChange('Custom Range');
    setIsCalendarOpen(!isCalendarOpen);
  };

  const handleDateRangeSelect = (startDate: string, endDate: string) => {
    onStartDateChange?.(startDate);
    onEndDateChange?.(endDate);
    setIsCalendarOpen(false);
  };

  const formatDateRange = () => {
    if (startDate && endDate) {
      const start = new Date(startDate).toLocaleDateString();
      const end = new Date(endDate).toLocaleDateString();
      return `${start} - ${end}`;
    }
    return 'Select dates';
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isInRange = (date: Date) => {
    if (!selectedStartDate || !selectedEndDate) return false;
    return date >= selectedStartDate && date <= selectedEndDate;
  };

  const isStartDate = (date: Date) => {
    return selectedStartDate && date.toDateString() === selectedStartDate.toDateString();
  };

  const isEndDate = (date: Date) => {
    return selectedEndDate && date.toDateString() === selectedEndDate.toDateString();
  };

  const handleDateClick = (date: Date) => {
    if (!isSelectingEnd) {
      setSelectedStartDate(date);
      setSelectedEndDate(null);
      setIsSelectingEnd(true);
    } else {
      if (date >= selectedStartDate!) {
        setSelectedEndDate(date);
        setIsSelectingEnd(false);
      } else {
        setSelectedEndDate(selectedStartDate);
        setSelectedStartDate(date);
        setIsSelectingEnd(false);
      }
    }
  };

  const handleTodayClick = () => {
    const today = new Date();
    setSelectedStartDate(today);
    setSelectedEndDate(today);
    setIsSelectingEnd(false);
  };

  const handleApply = () => {
    if (selectedStartDate && selectedEndDate) {
      handleDateRangeSelect(formatDate(selectedStartDate), formatDate(selectedEndDate));
    }
  };

  const handleCancel = () => {
    setSelectedStartDate(startDate ? new Date(startDate) : null);
    setSelectedEndDate(endDate ? new Date(endDate) : null);
    setIsSelectingEnd(false);
    setIsCalendarOpen(false);
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const days = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="h-6"></div>);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const isSelected = isStartDate(date) || isEndDate(date);
    const isInSelectedRange = isInRange(date);
    const isCurrentDay = isToday(date);
    
    days.push(
      <button
        key={`${currentMonth.getFullYear()}-${currentMonth.getMonth()}-${day}`}
        onClick={() => handleDateClick(date)}
        className={`h-6 w-6 rounded-full text-xs font-medium transition-all duration-200 relative ${
          isSelected
            ? isDark
              ? 'bg-blue-500 text-white'
              : 'bg-blue-600 text-white'
            : isInSelectedRange
            ? isDark
              ? 'bg-blue-500/20 text-blue-300'
              : 'bg-blue-100 text-blue-700'
            : isCurrentDay
            ? isDark
              ? 'bg-gray-600 text-white border-2 border-blue-400'
              : 'bg-gray-200 text-gray-900 border-2 border-blue-500'
            : isDark
            ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
        }`}
      >
        {day}
        {isStartDate(date) && (
          <div className={`absolute -top-0.5 -left-0.5 w-1.5 h-1.5 rounded-full ${
            isDark ? 'bg-green-400' : 'bg-green-500'
          }`}></div>
        )}
        {isEndDate(date) && (
          <div className={`absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ${
            isDark ? 'bg-red-400' : 'bg-red-500'
          }`}></div>
        )}
      </button>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
      {/* Tab Filter */}
      <div className={`flex flex-wrap lg:flex-nowrap space-x-1 p-1 rounded-lg ${
        isDark ? 'bg-gray-700' : 'bg-gray-100'
      }`}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={tab === 'Custom Range' ? handleCustomRangeClick : () => onTabChange(tab)}
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

      {/* Custom Range Display and Calendar */}
      {activeTab === 'Custom Range' && (
        <div className="relative">
          <button
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white' 
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDateRange()}
            </div>
          </button>

          {/* Inline Calendar */}
          {isCalendarOpen && (
            <div className={`absolute top-full left-0 mt-2 w-64 rounded-lg shadow-xl border z-50 transform -translate-x-14 ${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`} ref={calendarRef}>
              {/* Calendar Header */}
              <div className={`p-3 border-b ${
                isDark ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                    className={`p-1 rounded transition-colors ${
                      isDark 
                        ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <h4 className={`text-sm font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h4>
                  
                  <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                    className={`p-1 rounded transition-colors ${
                      isDark 
                        ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Today Button */}
                <button
                  onClick={handleTodayClick}
                  className={`w-full py-1.5 px-3 rounded text-xs font-medium transition-colors ${
                    isDark
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  Today
                </button>
              </div>

              {/* Calendar Body */}
              <div className="p-3">
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-0.5 mb-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                    <div key={`header-${index}`} className={`h-5 flex items-center justify-center text-xs font-medium ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-0.5">
                  {days}
                </div>

                {/* Selection Status */}
                <div className={`mt-2 p-2 rounded text-xs ${
                  isDark ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <div className={`${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {selectedStartDate && selectedEndDate ? (
                      <div>Selected: {selectedStartDate.toLocaleDateString()} - {selectedEndDate.toLocaleDateString()}</div>
                    ) : selectedStartDate ? (
                      <div>Start: {selectedStartDate.toLocaleDateString()} • Click for end date</div>
                    ) : (
                      <div>Click to select start date</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Calendar Footer */}
              <div className={`flex items-center justify-end gap-2 p-3 border-t ${
                isDark ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <button
                  onClick={handleCancel}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                    isDark
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  disabled={!selectedStartDate || !selectedEndDate}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                    selectedStartDate && selectedEndDate
                      ? isDark
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                      : isDark
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};