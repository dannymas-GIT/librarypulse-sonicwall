import React from 'react';
import { SecurityLog } from '../../types/security';

interface SecurityLogTableProps {
  logs: SecurityLog[];
}

export const SecurityLogTable: React.FC<SecurityLogTableProps> = ({ logs }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Severity</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {logs.map((log) => (
            <tr key={log.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(log.timestamp).toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {log.severity}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {log.category}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {log.message}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {log.source}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 