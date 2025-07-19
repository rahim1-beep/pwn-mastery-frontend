import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: 'green' | 'blue' | 'red' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  color = 'green',
  size = 'md',
  showLabel = true,
  label,
  animated = true
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const colorClasses = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500'
  };

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const glowClasses = {
    green: 'shadow-green-500/50',
    blue: 'shadow-blue-500/50',
    red: 'shadow-red-500/50',
    yellow: 'shadow-yellow-500/50'
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-300">
            {label || 'Progress'}
          </span>
          <span className="text-sm font-medium text-gray-300">
            {value}/{max}
          </span>
        </div>
      )}
      <div className={`w-full ${sizeClasses[size]} bg-gray-700 rounded-full overflow-hidden`}>
        <motion.div
          className={`h-full ${colorClasses[color]} shadow-md ${glowClasses[color]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: animated ? 1.5 : 0, ease: "easeOut" }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-center mt-1">
          <span className="text-xs text-gray-400">{percentage.toFixed(0)}%</span>
        </div>
      )}
    </div>
  );
};