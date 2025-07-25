import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  isDark?: boolean;
  showChange?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  isPositive = true, 
  isDark,
  showChange = true 
}) => {
  return (
    <div className={`stat-card h-28 flex flex-col rounded-lg shadow-md border transition-all duration-300 hover:shadow-lg hover:scale-[1.01] ${
      isDark 
        ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-gray-600' 
        : 'bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-gray-300'
    }`}>
      {/* Top section - Title */}
      <div className="flex-shrink-0 p-3 pb-1">
        <p className={`text-xs font-semibold tracking-wide uppercase leading-tight [@media(max-width:769px)]:truncate [@media(max-width:1024px)]:truncate  ${
          isDark ? 'text-gray-400' : 'text-gray-500'
        }`}>{title}</p>
      </div>

      {/* Middle section - Value */}
      <div className="flex-1 flex items-center px-3">
        <p className={`text-lg font-bold tracking-tight ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>{value}</p>
      </div>

      {/* Bottom section - Change indicator */}
      <div className="flex-shrink-0 p-3 pt-1">
        {showChange && change ? (
          <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium max-w-full lg:max-w-[80px] ${
            isPositive 
            ? isDark 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-green-100 text-green-700 border border-green-200'
            : isDark 
              ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            <span className={`text-xs flex-shrink-0 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? '↗' : '↘'}
            </span>
            <span className="text-xs ">{change}</span>
          </div>
        ) : (
          <div className="h-6"></div>
        )}
      </div>
    </div>
  );
};