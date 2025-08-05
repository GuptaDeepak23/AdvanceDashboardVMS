import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  isDark?: boolean;
  showChange?: boolean;
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  isPositive = true, 
  isDark,
  showChange = true,
  icon
}) => {
  return (
    <div className={`stat-card h-20 flex flex-col rounded-lg shadow-lg border transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
      isDark 
        ? 'bg-white border-gray-200' 
        : 'bg-white border-gray-200'
    }`}>
      {/* Top section - Icon and Title */}
      <div className="flex-shrink-0 p-2 pb-1 flex items-center gap-1.5">
        {icon && (
          <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
        )}
        <p className={`text-xs font-medium tracking-wide leading-tight truncate ${
          isDark ? 'text-gray-600' : 'text-gray-600'
        }`}>{title}</p>
      </div>

      {/* Middle section - Value */}
      <div className="flex-1 flex justify-between items-center gap-2 px-2">
        <p className={`text-xl font-bold tracking-tight ${
          isDark ? 'text-gray-800' : 'text-gray-800'
        }`}>{Number(value).toFixed(2)}</p>
        <div className="flex-shrink-0 p-2 pt-0">
        {showChange && change ? (
          <div className={`inline-flex    gap-1 px-1 py-0.5 rounded-md text-xs font-medium ${
            isPositive 
            ? 'bg-green-50 text-green-600 border border-green-200'
            : 'bg-red-50 text-red-600 border border-red-200'
          }`}>
            <span className={`text-xs flex-shrink-0 flex gap-1  ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? '↗' : '↘'}
              <span className="text-xs truncate">{change}</span>
            </span>
           
          </div>
        ) : (
          <div className="h-4"></div>
        )}
      </div>
      </div>

      {/* Bottom section - Change indicator */}
      
    </div>
  );
};