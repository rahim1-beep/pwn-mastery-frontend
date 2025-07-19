import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/UI/Button';
import { Shield, Eye, EyeOff } from 'lucide-react';

interface LoginFormData {
  username: string;
  password: string;
}

export const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data);
      navigate('/');
      window.showToast?.({
        type: 'success',
        message: 'Welcome back! Login successful.'
      });
    } catch (error: any) {
      setError('root', {
        message: error.response?.data?.error || 'Login failed. Please try again.'
      });
      window.showToast?.({
        type: 'error',
        message: error.response?.data?.error || 'Login failed'
      });
    } finally {
      setIsLoading(false);
    }
  };

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
        className="w-full max-w-md px-6 py-8 bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-green-500 mr-2" />
            <h1 className="text-3xl font-bold text-white glitch" data-text="PwnMastery">
              PwnMastery
            </h1>
          </div>
          <p className="text-gray-300 text-sm">
            Access your binary exploitation learning platform
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Username Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Username or Email
            </label>
            <input
              {...register('username', {
                required: 'Username or email is required',
                minLength: {
                  value: 3,
                  message: 'Username must be at least 3 characters'
                }
              })}
              type="text"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
              placeholder="Enter your username or email"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-400">{errors.username.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                type={showPassword ? 'text' : 'password'}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all pr-12"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
            )}
          </div>

          {/* Global Error */}
          {errors.root && (
            <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
              <p className="text-sm text-red-400">{errors.root.message}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-green-400 hover:text-green-300 font-medium transition-colors"
            >
              Register here
            </Link>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="mt-4 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
          <p className="text-xs text-gray-400 text-center">
            Demo: admin / password123
          </p>
        </div>
      </motion.div>
    </div>
  );
};