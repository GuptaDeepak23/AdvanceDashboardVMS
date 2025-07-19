import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  isDark?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, change, isPositive, isDark }) => {
  return (
    <div className={`rounded-lg shadow-sm border p-6 hover:shadow-md transition-all duration-200 group relative cursor-pointer ${
      isDark 
        ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' 
        : 'bg-white border-gray-100'
    }`}>
      <h3 className={`text-sm font-medium mb-2 ${
        isDark ? 'text-gray-400' : 'text-gray-500'
      }`}>{title}</h3>
      <div className="flex items-center justify-between">
        <span className={`text-2xl font-bold ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>{value}</span>
        {change && (
          <div className={`flex items-center gap-1 text-sm ${
            isPositive 
              ? isDark ? 'text-green-400' : 'text-green-600'
              : isDark ? 'text-red-400' : 'text-red-600'
          }`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{change}</span>
          </div>
        )}
      </div>
      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-3 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
        {title}: {value} {change && `(${change} ${isPositive ? 'increase' : 'decrease'})`}
      </div>
    </div>
  );
};