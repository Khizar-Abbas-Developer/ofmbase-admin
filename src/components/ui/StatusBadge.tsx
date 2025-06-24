import React from 'react';

type StatusType = 'active' | 'pending' | 'inactive' | 'success' | 'warning' | 'error' | 'info';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  const styles = {
    active: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    inactive: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  const displayLabel = label || status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      <span className={`h-1.5 w-1.5 mr-1.5 rounded-full bg-${status === 'inactive' ? 'gray' : status === 'pending' ? 'yellow' : status === 'active' ? 'green' : status}-400`}></span>
      {displayLabel}
    </span>
  );
};

export default StatusBadge;