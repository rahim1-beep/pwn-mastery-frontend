import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  neonBorder?: 'green' | 'blue' | 'red' | 'none';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  glass = false,
  neonBorder = 'none'
}) => {
  const baseClasses = 'rounded-lg p-6 transition-all duration-300';
  const glassClasses = glass ? 'glass' : 'bg-gray-800 border border-gray-700';
  const hoverClasses = hover ? 'hover:transform hover:scale-105 hover:shadow-lg cursor-pointer' : '';
  
  const neonClasses = {
    green: 'neon-border-green',
    blue: 'neon-border-blue',
    red: 'neon-border-red',
    none: ''
  };

  return (
    <motion.div
      className={`${baseClasses} ${glassClasses} ${hoverClasses} ${neonClasses[neonBorder]} ${className}`}
      whileHover={hover ? { scale: 1.02 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};