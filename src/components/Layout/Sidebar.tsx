import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  BookOpen,
  Target,
  FolderOpen,
  Calendar,
  BarChart3,
  Library,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield
} from 'lucide-react';

const menuItems = [
  { icon: Home, label: 'Dashboard', path: '/' },
  { icon: BookOpen, label: 'Curriculum', path: '/curriculum' },
  { icon: Target, label: 'Challenges', path: '/challenges' },
  { icon: FolderOpen, label: 'Projects', path: '/projects' },
  { icon: Calendar, label: 'Planner', path: '/planner' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Library, label: 'Resources', path: '/resources' },
  { icon: FileText, label: 'Notes', path: '/notes' },
  { icon: Settings, label: 'Profile', path: '/profile' },
];

export const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <motion.div
      className={`bg-gray-800 border-r border-gray-700 flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-gray-700 relative">
        <div className="flex items-center">
          <Shield className="w-8 h-8 text-green-500 mr-2" />
          {!isCollapsed && (
            <span className="text-xl font-bold text-white glitch" data-text="PwnMastery">
              PwnMastery
            </span>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-gray-700 hover:bg-gray-600 text-white p-1 rounded-full transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-green-600 text-white cyber-glow'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
              {!isCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
              {isActive && !isCollapsed && (
                <motion.div
                  className="ml-auto w-1 h-1 bg-green-400 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-gray-700">
        <div className={`text-center text-xs text-gray-400 ${isCollapsed ? 'hidden' : 'block'}`}>
          <div className="font-mono">v1.0.0</div>
          <div className="mt-1">Binary Exploitation</div>
          <div>Learning Platform</div>
        </div>
      </div>
    </motion.div>
  );
};