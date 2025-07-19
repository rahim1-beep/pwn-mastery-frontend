import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/UI/Button';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden">
      {/* Matrix Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="matrix"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center relative z-10"
      >
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-white mb-4 glitch" data-text="404">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-gray-300 mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-400 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            as={Link}
            to="/"
            icon={<Home className="w-4 h-4" />}
            className="inline-flex items-center"
          >
            Go Home
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            icon={<ArrowLeft className="w-4 h-4" />}
            className="inline-flex items-center"
          >
            Go Back
          </Button>
        </div>

        <div className="mt-8 text-xs text-gray-500 font-mono">
          ERROR_CODE: PWN_404_NOT_FOUND
        </div>
      </motion.div>
    </div>
  );
};