import React from 'react';

// This is a placeholder for a real chart library like Chart.js or Recharts
// In a real implementation, you'd use one of those libraries

interface DataPoint {
  label: string;
  value: number;
}

interface AreaChartProps {
  data: DataPoint[];
  title?: string;
  height?: number;
  className?: string;
}

const AreaChart: React.FC<AreaChartProps> = ({
  data,
  title,
  height = 200,
  className = '',
}) => {
  // Generate points for the SVG path
  const maxValue = Math.max(...data.map(d => d.value));
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - (d.value / maxValue) * 90; // Leave some space at the top
    return `${x},${y}`;
  });

  // Create the path for the area
  const areaPath = `
    M${points[0]} 
    ${points.slice(1).map(p => `L${p}`).join(' ')} 
    L100,100 
    L0,100 
    Z
  `;

  // Create the path for the line
  const linePath = `
    M${points[0]} 
    ${points.slice(1).map(p => `L${p}`).join(' ')}
  `;

  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      {title && <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>}
      <div style={{ height: `${height}px` }} className="relative">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          {/* Grid lines */}
          <line x1="0" y1="25" x2="100" y2="25" stroke="#f3f4f6" strokeWidth="0.5" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="#f3f4f6" strokeWidth="0.5" />
          <line x1="0" y1="75" x2="100" y2="75" stroke="#f3f4f6" strokeWidth="0.5" />

          {/* Area */}
          <path
            d={areaPath}
            fill="url(#gradient)"
            opacity="0.2"
          />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#4f46e5"
            strokeWidth="0.5"
          />

          {/* Data points */}
          {points.map((point, i) => {
            const [x, y] = point.split(',');
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="0.7"
                fill="#4f46e5"
              />
            );
          })}

          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="flex justify-between mt-4 px-2 text-xs text-gray-500">
        {data.map((point, i) => (
          <div key={i} className={i === 0 || i === data.length - 1 ? '' : 'hidden sm:block'}>
            {point.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AreaChart;