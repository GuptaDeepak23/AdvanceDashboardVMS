import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface PendingCheckout {
  id: string;
  hostName: string;
  guestName: string;
  visitorId: string;
  checkInTime: string;
}

interface PendingCheckoutTableProps {
  data: PendingCheckout[];
  isDark?: boolean;
}

export const PendingCheckoutTable: React.FC<PendingCheckoutTableProps> = ({ data, isDark }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter(item =>
    item.hostName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.visitorId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`rounded-lg shadow-sm border p-4 ${
      isDark 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-100'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>Pending Checkouts</h3>
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
            isDark ? 'text-gray-500' : 'text-gray-400'
          }`} />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>
      </div>
      
      {filteredData.length === 0 && searchTerm === '' && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className={`text-6xl mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>
            ⏰
          </div>
          <p className={`text-lg font-medium mb-2 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>No Pending Checkouts</p>
          <p className={`text-sm ${
            isDark ? 'text-gray-500' : 'text-gray-400'
          }`}>All visitors have checked out successfully</p>
        </div>
      )}
      
      {filteredData.length > 0 && (
        <div className="overflow-x-hidden relative">
        <table className="w-full text-sm">
          <thead>
            <tr className={`border-b ${
              isDark ? 'border-gray-600' : 'border-gray-200'
            }`}>
              <th className={`text-left py-3 px-2 font-medium ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>Sr. No</th>
              <th className={`text-left py-3 px-2 font-medium ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>Host Name</th>
              <th className={`text-left py-3 px-2 font-medium ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>Guest Name</th>
              <th className={`text-left py-3 px-2 font-medium ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>Visitor ID</th>
              <th className={`text-left py-3 px-2 font-medium ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>Check In Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={item.id} className={`border-b transition-colors duration-150 group relative ${
                isDark 
                  ? 'border-gray-700 hover:bg-gray-700' 
                  : 'border-gray-100 hover:bg-gray-50'
              }`}>
                <td className={`py-3 px-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>{index + 1}</td>
                <td className={`py-3 px-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>{item.hostName}</td>
                <td className={`py-3 px-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>{item.guestName}</td>
                <td className={`py-3 px-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>{item.visitorId}</td>
                <td className={`py-3 px-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>{item.checkInTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
          
          {/* Tooltips positioned outside the table */}
          {filteredData.map((item, index) => (
            <div
              key={`tooltip-${item.id}`}
              className="absolute left-full ml-2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10"
              style={{ top: `${(index + 1) * 60}px` }}
            >
              {item.guestName} hosted by {item.hostName} - Checked in at {item.checkInTime}
            </div>
          ))}
      </div>
      )}
      
      {filteredData.length === 0 && searchTerm !== '' && (
          <div className={`text-center py-8 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            No results found for "{searchTerm}"
          </div>
      )}
    </div>
  );
};