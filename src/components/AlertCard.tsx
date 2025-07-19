import React from 'react';
import { AlertTriangle, Star, Clock } from 'lucide-react';

interface Alert {
  id: string;
  type: 'vip' | 'overdue' | 'warning';
  message: string;
  time: string;
}

interface AlertCardProps {
  alerts: Alert[];
  isDark?: boolean;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alerts, isDark }) => {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'vip':
        return <Star className={`w-4 h-4 ${isDark ? 'text-yellow-400' : 'text-yellow-500'}`} />;
      case 'overdue':
        return <Clock className={`w-4 h-4 ${isDark ? 'text-red-400' : 'text-red-500'}`} />;
      default:
        return <AlertTriangle className={`w-4 h-4 ${isDark ? 'text-orange-400' : 'text-orange-500'}`} />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'vip':
        return isDark ? 'bg-yellow-900/20 border-yellow-700' : 'bg-yellow-50 border-yellow-200';
      case 'overdue':
        return isDark ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-200';
      default:
        return isDark ? 'bg-orange-900/20 border-orange-700' : 'bg-orange-50 border-orange-200';
    }
  };

  return (
    <div className={`rounded-lg shadow-sm border p-6 ${
      isDark 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-100'
    }`}>
      <h3 className={`text-lg font-semibold mb-4 ${
        isDark ? 'text-white' : 'text-gray-900'
      }`}>Recent Alerts</h3>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-3 rounded-lg border group relative cursor-pointer hover:shadow-sm transition-all duration-200 ${getAlertColor(alert.type)}`}
          >
            <div className="flex items-start gap-3">
              {getAlertIcon(alert.type)}
              <div className="flex-1">
                <p className={`text-sm ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>{alert.message}</p>
                <p className={`text-xs mt-1 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>{alert.time}</p>
              </div>
            </div>
            <div className="absolute left-full ml-2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
              {alert.type.toUpperCase()} Alert: {alert.message}
            </div>
          </div>
        ))}
        {alerts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className={`text-4xl mb-3 ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>
              🔔
            </div>
            <p className={`text-sm font-medium mb-1 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>No Active Alerts</p>
            <p className={`text-xs ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`}>All systems running smoothly</p>
          </div>
        )}
      </div>
    </div>
  );
};