import React from 'react';

interface DataPoint {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DataPoint[];
  title?: string;
  size?: number;
  className?: string;
}

const DonutChart: React.FC<DonutChartProps> = ({
  data,
  title,
  size = 200,
  className = '',
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate the segments
  let startAngle = 0;
  const segments = data.map((item, index) => {
    const percentage = item.value / total;
    const dashOffset = circumference * (1 - percentage);
    const rotate = startAngle * 360;
    startAngle += percentage;
    
    return {
      ...item,
      percentage,
      dashArray: circumference,
      dashOffset,
      rotate,
    };
  });

  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      {title && <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>}
      <div className="flex flex-col items-center">
        <div style={{ width: `${size}px`, height: `${size}px` }} className="relative">
          <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            className="transform -rotate-90"
          >
            {segments.map((segment, i) => (
              <circle
                key={i}
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke={segment.color}
                strokeWidth="15"
                strokeDasharray={segment.dashArray}
                strokeDashoffset={segment.dashOffset}
                style={{
                  transform: `rotate(${segment.rotate}deg)`,
                  transformOrigin: 'center',
                }}
              />
            ))}
            <circle
              cx="50"
              cy="50"
              r="30"
              fill="white"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-800">{total}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4">
          {segments.map((segment, i) => (
            <div key={i} className="flex items-center">
              <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: segment.color }}></span>
              <span className="text-sm text-gray-700">{segment.label}</span>
              <span className="ml-1 text-sm font-medium text-gray-900">
                ({Math.round(segment.percentage * 100)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DonutChart;