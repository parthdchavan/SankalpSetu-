import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Mail, Lock, AlertCircle } from 'lucide-react';
import { Button } from '../design-system/components/Button';
import { Input } from '../design-system/components/Input';
import { fadeIn, slideUp } from '../design-system/animations';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';

/**
 * Login Page - Production-quality authentication
 * 
 * Features:
 * - Clean, modern design
 * - Form validation
 * - Error handling
 * - Loading states
 * - Smooth animations
 * - Mobile responsive
 */

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, getDashboardRoute } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    setApiError('');
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsLoading(true);
    setApiError('');

    try {
      const data = await authService.login(formData);
      login({ email: data.email, role: data.role, firstName: data.firstName }, data.token);
      const from = location.state?.from?.pathname || getDashboardRoute(data.role);
      navigate(from, { replace: true });
    } catch (error) {
      setApiError(error.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <motion.div
        initial="initial"
        animate="animate"
        variants={fadeIn}
        className="w-full max-w-md"
      >
        {/* Logo and Header */}
        <motion.div variants={slideUp} className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 transition mb-6">
            <Heart className="w-10 h-10 fill-current" />
            <span className="text-2xl font-bold">Sankalp Setu</span>
          </Link>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Welcome back</h1>
          <p className="text-neutral-600">Sign in to continue making a difference</p>
        </motion.div>

        {/* Login Form Card */}
        <motion.div
          variants={slideUp}
          className="bg-white rounded-card shadow-elevation2 p-8"
        >
          {/* API Error Alert */}
          {apiError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-error-light border border-error rounded-lg flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
              <p className="text-sm text-error-dark">{apiError}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <Input
              type="email"
              label="Email Address"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(value) => handleChange('email', value)}
              error={errors.email}
              leftIcon={<Mail className="w-5 h-5" />}
              required
              disabled={isLoading}
            />

            {/* Password Input */}
            <Input
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(value) => handleChange('password', value)}
              error={errors.password}
              leftIcon={<Lock className="w-5 h-5" />}
              required
              disabled={isLoading}
            />

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium transition"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 border-t border-neutral-200"></div>
            <span className="text-sm text-neutral-500">or</span>
            <div className="flex-1 border-t border-neutral-200"></div>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-neutral-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-primary-600 hover:text-primary-700 font-semibold transition"
            >
              Create account
            </Link>
          </p>
        </motion.div>

        {/* Footer Text */}
        <motion.p
          variants={slideUp}
          className="text-center text-sm text-neutral-500 mt-8"
        >
          By signing in, you agree to our{' '}
          <Link to="/terms" className="text-primary-600 hover:underline">Terms</Link>
          {' '}and{' '}
          <Link to="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
