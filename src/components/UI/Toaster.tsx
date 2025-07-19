import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

const ToastComponent: React.FC<ToastProps> = ({ toast, onClose }) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
  };

  const bgColors = {
    success: 'bg-green-900/20 border-green-500/30',
    error: 'bg-red-900/20 border-red-500/30',
    warning: 'bg-yellow-900/20 border-yellow-500/30',
    info: 'bg-blue-900/20 border-blue-500/30'
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`flex items-center p-4 mb-4 rounded-lg border ${bgColors[toast.type]} backdrop-blur-sm`}
    >
      <div className="flex-shrink-0 mr-3">
        {icons[toast.type]}
      </div>
      <div className="flex-1 text-white">
        {toast.message}
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="ml-3 text-gray-400 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export const Toaster: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Global toast function
  React.useEffect(() => {
    window.showToast = addToast;
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <AnimatePresence>
        {toasts.map(toast => (
          <ToastComponent
            key={toast.id}
            toast={toast}
            onClose={removeToast}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Global toast function type
declare global {
  interface Window {
    showToast: (toast: Omit<Toast, 'id'>) => void;
  }
}