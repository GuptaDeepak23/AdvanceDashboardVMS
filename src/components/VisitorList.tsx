import React from 'react';
import { User, Clock } from 'lucide-react';

interface Visitor {
  id: string;
  name: string;
  company: string;
  purpose: string;
  time: string;
  status: 'pending' | 'expected';
}

interface VisitorListProps {
  title: string;
  visitors: Visitor[];
  type: 'pending' | 'expected';
}

export const VisitorList: React.FC<VisitorListProps> = ({ title, visitors, type }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {visitors.map((visitor) => (
          <div key={visitor.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-150">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-500" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">{visitor.name}</div>
              <div className="text-sm text-gray-500">{visitor.company}</div>
              <div className="text-xs text-gray-400">{visitor.purpose}</div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                {visitor.time}
              </div>
              <div className={`text-xs px-2 py-1 rounded-full ${
                type === 'pending' 
                  ? 'bg-orange-100 text-orange-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {type === 'pending' ? 'Pending' : 'Expected'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};