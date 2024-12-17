import React from 'react';
import { cn } from '../../utils/cn';

interface SecurityStatusCardProps {
  title: string;
  icon: React.ReactNode;
  status: 'Active' | 'Inactive' | 'Warning';
  details: string;
}

export const SecurityStatusCard: React.FC<SecurityStatusCardProps> = ({
  title,
  icon,
  status,
  details,
}) => {
  const statusColors = {
    Active: 'bg-green-100 text-green-800',
    Inactive: 'bg-red-100 text-red-800',
    Warning: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon}
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <span className={cn(
          'px-3 py-1 rounded-full text-sm font-medium',
          statusColors[status]
        )}>
          {status}
        </span>
      </div>
      <p className="text-gray-600">{details}</p>
    </div>
  );
}; 