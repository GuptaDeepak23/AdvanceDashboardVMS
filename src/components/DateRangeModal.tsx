import React, { useState, useEffect } from 'react';

interface DateRangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDateRangeSelect: (startDate: string, endDate: string) => void;
  isDark?: boolean;
  currentStartDate?: string;
  currentEndDate?: string;
}

export const DateRangeModal: React.FC<DateRangeModalProps> = ({
  isOpen,
  onClose,
  onDateRangeSelect,
  isDark,
  currentStartDate,
  currentEndDate
}) => {
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(
    currentStartDate ? new Date(currentStartDate) : null
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(
    currentEndDate ? new Date(currentEndDate) : null
  );
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isSelectingEnd, setIsSelectingEnd] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedStartDate(currentStartDate ? new Date(currentStartDate) : null);
      setSelectedEndDate(currentEndDate ? new Date(currentEndDate) : null);
      setCurrentMonth(new Date());
      setIsSelectingEnd(false);
    }
  }, [isOpen, currentStartDate, currentEndDate]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

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
        // If end date is before start date, swap them
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
      onDateRangeSelect(formatDate(selectedStartDate), formatDate(selectedEndDate));
      onClose();
    }
  };

  const handleCancel = () => {
    setSelectedStartDate(currentStartDate ? new Date(currentStartDate) : null);
    setSelectedEndDate(currentEndDate ? new Date(currentEndDate) : null);
    setIsSelectingEnd(false);
    onClose();
  };

  const handleClose = () => {
    // Reset to current values when closing without applying
    setSelectedStartDate(currentStartDate ? new Date(currentStartDate) : null);
    setSelectedEndDate(currentEndDate ? new Date(currentEndDate) : null);
    setIsSelectingEnd(false);
    onClose();
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const days = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="h-10"></div>);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const isSelected = isStartDate(date) || isEndDate(date);
    const isInSelectedRange = isInRange(date);
    const isCurrentDay = isToday(date);
    
    days.push(
      <button
        key={day}
        onClick={() => handleDateClick(date)}
        className={`h-10 w-10 rounded-full text-sm font-medium transition-all duration-200 relative ${
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
          <div className={`absolute -top-1 -left-1 w-3 h-3 rounded-full ${
            isDark ? 'bg-green-400' : 'bg-green-500'
          }`}></div>
        )}
        {isEndDate(date) && (
          <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
            isDark ? 'bg-red-400' : 'bg-red-500'
          }`}></div>
        )}
      </button>
    );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleClose}>
      <div className={`relative w-full max-w-md mx-4 rounded-xl shadow-2xl ${
        isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Select Date Range
          </h3>
          <button
            onClick={handleClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark 
                ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Calendar */}
        <div className="p-6">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              className={`p-2 rounded-lg transition-colors ${
                isDark 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <h4 className={`text-lg font-semibold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h4>
            
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              className={`p-2 rounded-lg transition-colors ${
                isDark 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Today Button */}
          <button
            onClick={handleTodayClick}
            className={`w-full mb-4 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              isDark
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Today
          </button>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className={`h-8 flex items-center justify-center text-xs font-medium ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {days}
          </div>

          {/* Selection Status */}
          <div className={`mt-4 p-3 rounded-lg ${
            isDark ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <div className={`text-sm ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {selectedStartDate && selectedEndDate ? (
                <div className="space-y-1">
                  <div className="font-medium">Selected Range:</div>
                  <div>From: {selectedStartDate.toLocaleDateString()}</div>
                  <div>To: {selectedEndDate.toLocaleDateString()}</div>
                </div>
              ) : selectedStartDate ? (
                <div className="space-y-1">
                  <div className="font-medium">Start Date Selected:</div>
                  <div>{selectedStartDate.toLocaleDateString()}</div>
                  <div className="text-xs opacity-75">Click to select end date</div>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="font-medium">No dates selected</div>
                  <div className="text-xs opacity-75">Click to select start date</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-end gap-3 p-6 border-t ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <button
            onClick={handleCancel}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
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
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
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
    </div>
  );
}; 