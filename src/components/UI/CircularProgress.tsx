import React from 'react';
import { motion } from 'framer-motion';

interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: 'green' | 'blue' | 'red' | 'yellow';
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  color = 'green',
  showLabel = true,
  label,
  animated = true
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const colorClasses = {
    green: '#00ff41',
    blue: '#0066cc',
    red: '#ff6b6b',
    yellow: '#ffd93d'
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#374151"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colorClasses[color]}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animated ? circumference : offset}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: animated ? 1.5 : 0, ease: "easeOut" }}
          style={{
            filter: `drop-shadow(0 0 8px ${colorClasses[color]}50)`
          }}
        />
      </svg>
      
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {percentage.toFixed(0)}%
            </div>
            {label && (
              <div className="text-xs text-gray-400 mt-1">
                {label}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};