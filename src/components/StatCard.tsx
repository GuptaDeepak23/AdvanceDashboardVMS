import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  isDark?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, change, isPositive, isDark }) => {
  return (
    <div className={`stat-card rounded-lg shadow-sm border p-6 transition-all duration-300 hover:shadow-md hover-lift ${
      isDark 
        ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' 
        : 'bg-white border-gray-100 hover:bg-gray-50'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>{title}</p>
          <p className={`text-2xl font-bold mt-1 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>{value}</p>
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
          isPositive
            ? isDark 
              ? 'bg-green-900/50 text-green-400' 
              : 'bg-green-100 text-green-700'
            : isDark 
              ? 'bg-red-900/50 text-red-400' 
              : 'bg-red-100 text-red-700'
        }`}>
          <span>{isPositive ? '↗' : '↘'}</span>
          <span>{change}</span>
        </div>
      </div>
    </div>
  );
};