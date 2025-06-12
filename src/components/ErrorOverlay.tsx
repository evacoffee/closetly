import React, { useState, useEffect } from 'react';
import { OutfitErrorRegulator } from '@/utils/errorHandler';

const ErrorOverlay: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    high: 0,
    medium: 0,
    low: 0,
  });

  useEffect(() => {
    const updateStats = () => {
      const status = OutfitErrorRegulator.getRegulationStatus();
      setStats({
        total: status.totalErrors,
        high: status.severityBreakdown.last24h.high,
        medium: status.severityBreakdown.last24h.medium,
        low: status.severityBreakdown.last24h.low,
      });
    };

    updateStats();
    const interval = setInterval(updateStats, 5000);
    return () => clearInterval(interval);
  }, []);

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors"
        title="Error Monitor"
      >
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          {stats.total > 0 && (
            <span className="absolute -top-2 -right-2 bg-white text-red-500 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {stats.total}
            </span>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-80 bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-gray-800 text-white p-3 flex justify-between items-center">
            <h3 className="font-bold">Error Monitor</h3>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-300">
              ×
            </button>
          </div>
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Errors (24h):</span>
                <span className="font-mono">{stats.total}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500"
                  style={{ width: `${Math.min(100, (stats.total / 50) * 100)}%` }}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-red-100 text-red-800 rounded">
                <div className="text-lg font-bold">{stats.high}</div>
                <div className="text-xs">High</div>
              </div>
              <div className="p-2 bg-yellow-100 text-yellow-800 rounded">
                <div className="text-lg font-bold">{stats.medium}</div>
                <div className="text-xs">Medium</div>
              </div>
              <div className="p-2 bg-blue-100 text-blue-800 rounded">
                <div className="text-lg font-bold">{stats.low}</div>
                <div className="text-xs">Low</div>
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={() => {
                  window.open('/_error-debug', '_blank');
                }}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded text-sm transition-colors"
              >
                View Error Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorOverlay;
