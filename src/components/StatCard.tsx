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
  const formatValue = (rawValue: string): string => {
    const numericValue = Number(rawValue);
    if (Number.isNaN(numericValue)) return rawValue;
    const hasDecimals = Math.abs(numericValue % 1) > 0;
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: hasDecimals ? 2 : 0,
      maximumFractionDigits: hasDecimals ? 2 : 0,
    }).format(numericValue);
  };

  return (
    <div
      className={`stat-card h-20 flex flex-col rounded-xl border backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
        isDark
          ? 'bg-gray-800/80 border-gray-700 hover:border-gray-600 hover:bg-gray-800/90'
          : 'bg-white border-gray-200 hover:border-gray-300'
      }`}
    >
      {/* Top section - Icon and Title */}
      <div className="flex-shrink-0 p-2 pb-1 flex items-center gap-1.5">
        {icon && (
          <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
        )}
        <p
          className={`text-xs font-medium tracking-wide leading-tight truncate ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}
        >
          {title}
        </p>
      </div>

      {/* Middle section - Value */}
      <div className="flex-1 flex justify-between items-center gap-2 px-2">
        <p
          className={`text-xl font-bold tracking-tight ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          {formatValue(value)}
        </p>
        <div className="flex-shrink-0 p-2 pt-0">
        {showChange && change ? (
          <div
            className={`inline-flex gap-1 px-1.5 py-0.5 rounded-md text-xs font-medium border ${
              isPositive
                ? isDark
                  ? 'bg-green-500/10 text-green-300 border-green-600'
                  : 'bg-green-50 text-green-700 border-green-200'
                : isDark
                  ? 'bg-red-500/10 text-red-300 border-red-600'
                  : 'bg-red-50 text-red-700 border-red-200'
            }`}
          >
            <span
              className={`text-xs flex-shrink-0 flex gap-1 ${
                isPositive
                  ? isDark
                    ? 'text-green-300'
                    : 'text-green-500'
                  : isDark
                    ? 'text-red-300'
                    : 'text-red-500'
              }`}
            >
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