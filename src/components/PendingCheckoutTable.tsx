import React, { useState } from 'react';
import nodataVideo from '../assets/nodata1.webm';
import { Search } from 'lucide-react';

interface PendingCheckout {
  id?: string;
  hostName?: string;
  host_name?: string;
  guestName?: string;
  visitor_name?: string;
  visitorId?: string;
  visitor_id?: string;
  checkInTime?: string;
  checkin_time?: string;
}

interface PendingCheckoutTableProps {
  data: PendingCheckout[];
  isDark?: boolean;
}

export const PendingCheckoutTable: React.FC<PendingCheckoutTableProps> = ({ data, isDark }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter(item => {
    const hostName = item.hostName || item.host_name || '';
    const guestName = item.guestName || item.visitor_name || '';
    const visitorId = item.visitorId || item.visitor_id || '';
    
    return hostName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           visitorId.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="h-full flex flex-col p-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className={`text-base font-semibold ${
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
        <div className="flex-1 flex items-center justify-center py-2 h-[280px] md:h-[300px] overflow-hidden">
          <video 
            src={nodataVideo}
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-contain rounded-lg pointer-events-none select-none bg-transparent"
          />
        </div>
      )}
      
      {filteredData.length > 0 && (
        <div className="relative flex-1">
          <div 
            className="max-h-[360px] overflow-y-auto"
            onWheel={(e) => {
              e.stopPropagation();
            }}
            onTouchMove={(e) => {
              e.stopPropagation();
            }}
          >
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10">
                <tr className={`border-b ${
                  isDark ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-white'
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
                    }`}>{item.hostName || item.host_name || 'N/A'}</td>
                    <td className={`py-3 px-2 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>{item.guestName || item.visitor_name || 'N/A'}</td>
                    <td className={`py-3 px-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>{item.visitorId || item.visitor_id || 'N/A'}</td>
                    <td className={`py-3 px-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>{item.checkInTime || item.checkin_time || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Tooltips positioned outside the table */}
          {filteredData.map((item, index) => (
                          <div
                key={`tooltip-${item.id || index}`}
                className="absolute left-full ml-2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10"
                style={{ top: `${(index + 1) * 60}px` }}
              >
                {(item.guestName || item.visitor_name || 'N/A')} hosted by {(item.hostName || item.host_name || 'N/A')} - Checked in at {(item.checkInTime || item.checkin_time || 'N/A')}
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