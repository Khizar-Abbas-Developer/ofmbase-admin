import React from 'react';

interface StatProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatProps> = ({
  title,
  value,
  icon,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
        {icon && (
          <div className="h-12 w-12 bg-primary-50 rounded-lg flex items-center justify-center text-primary-500">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

interface StatsRowProps {
  children: React.ReactNode;
}

export const StatsRow: React.FC<StatsRowProps> = ({ children }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {children}
    </div>
  );
};