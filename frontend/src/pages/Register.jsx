import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Mail, Lock, User, Building2, HandHeart, ArrowRight } from 'lucide-react';
import { Button } from '../design-system/components/Button';
import { Input } from '../design-system/components/Input';
import { fadeIn, slideUp, slideInFromRight } from '../design-system/animations';
import { authService } from '../services/authService';
import { useAuth } from '../context/useAuth';

/**
 * Register Page - Production-quality signup with role selection
 * 
 * Features:
 * - Multi-step registration (role selection → form)
 * - Role-specific onboarding (Donor, NGO, Volunteer)
 * - Form validation
 * - Custom illustrations per role
 * - Smooth animations
 * - Mobile responsive
 */

const roles = [
  {
    id: 'donor',
    name: 'Donor',
    icon: Heart,
    description: 'I have surplus food to donate',
    color: 'primary',
  },
  {
    id: 'ngo',
    name: 'NGO',
    icon: Building2,
    description: 'I represent an organization accepting donations',
    color: 'accent',
  },
  {
    id: 'volunteer',
    name: 'Volunteer',
    icon: HandHeart,
    description: 'I want to help with food pickup and delivery',
    color: 'success',
  },
];

export default function Register() {
  const navigate = useNavigate();
  const { login, getDashboardRoute } = useAuth();
  const [searchParams] = useSearchParams();
  const roleFromUrl = searchParams.get('role');
  
  const [step, setStep] = useState(roleFromUrl ? 'form' : 'role');
  const [selectedRole, setSelectedRole] = useState(roleFromUrl || '');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    organizationName: '', // For NGO only
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setStep('form');
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (selectedRole === 'ngo' && !formData.organizationName.trim()) {
      newErrors.organizationName = 'Organization name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsLoading(true);

    try {
      const [firstName, ...rest] = formData.name.trim().split(' ');
      const lastName = rest.join(' ');

      const data = await authService.register({
        firstName,
        lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: selectedRole.toUpperCase(),
      });

      login({ email: data.email, role: data.role, firstName: data.firstName }, data.token);
      navigate(getDashboardRoute(data.role));
    } catch (error) {
      setErrors({ api: error.message || 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedRoleData = roles.find(r => r.id === selectedRole);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <motion.div
        initial="initial"
        animate="animate"
        variants={fadeIn}
        className="w-full max-w-4xl"
      >
        {/* Logo and Header */}
        <motion.div variants={slideUp} className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 transition mb-6">
            <Heart className="w-10 h-10 fill-current" />
            <span className="text-2xl font-bold">Sankalp Setu</span>
          </Link>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Join Our Community</h1>
          <p className="text-neutral-600">
            {step === 'role' 
              ? 'Choose how you want to make an impact' 
              : 'Create your account to get started'}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Step 1: Role Selection */}
          {step === 'role' && (
            <motion.div
              key="role"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={fadeIn}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {roles.map((role, index) => {
                const Icon = role.icon;
                return (
                  <motion.button
                    key={role.id}
                    variants={slideUp}
                    custom={index}
                    onClick={() => handleRoleSelect(role.id)}
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`bg-white rounded-card shadow-elevation2 p-8 text-center hover:shadow-elevation3 transition-all border-2 border-transparent hover:border-${role.color}-200`}
                  >
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-${role.color}-100 flex items-center justify-center`}>
                      <Icon className={`w-8 h-8 text-${role.color}-600`} />
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">{role.name}</h3>
                    <p className="text-sm text-neutral-600">{role.description}</p>
                  </motion.button>
                );
              })}
            </motion.div>
          )}

          {/* Step 2: Registration Form */}
          {step === 'form' && (
            <motion.div
              key="form"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={slideInFromRight}
              className="bg-white rounded-card shadow-elevation2 p-8 max-w-2xl mx-auto"
            >
              {/* Role Badge */}
              {selectedRoleData && (
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-neutral-200">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full bg-${selectedRoleData.color}-100 flex items-center justify-center`}>
                      <selectedRoleData.icon className={`w-6 h-6 text-${selectedRoleData.color}-600`} />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600">Signing up as</p>
                      <p className="font-semibold text-neutral-900">{selectedRoleData.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setStep('role')}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Change
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <Input
                  type="text"
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(value) => handleChange('name', value)}
                  error={errors.name}
                  leftIcon={<User className="w-5 h-5" />}
                  required
                  disabled={isLoading}
                />

                {/* Organization Name (NGO only) */}
                {selectedRole === 'ngo' && (
                  <Input
                    type="text"
                    label="Organization Name"
                    placeholder="Enter your organization name"
                    value={formData.organizationName}
                    onChange={(value) => handleChange('organizationName', value)}
                    error={errors.organizationName}
                    leftIcon={<Building2 className="w-5 h-5" />}
                    required
                    disabled={isLoading}
                  />
                )}

                {/* Email */}
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

                {/* Phone */}
                <Input
                  type="tel"
                  label="Phone Number"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(value) => handleChange('phone', value)}
                  error={errors.phone}
                  hint="We'll use this to contact you about donations"
                  required
                  disabled={isLoading}
                />

                {/* Password */}
                <Input
                  type="password"
                  label="Password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(value) => handleChange('password', value)}
                  error={errors.password}
                  leftIcon={<Lock className="w-5 h-5" />}
                  hint="At least 8 characters"
                  required
                  disabled={isLoading}
                />

                {/* Confirm Password */}
                <Input
                  type="password"
                  label="Confirm Password"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={(value) => handleChange('confirmPassword', value)}
                  error={errors.confirmPassword}
                  leftIcon={<Lock className="w-5 h-5" />}
                  required
                  disabled={isLoading}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={isLoading}
                  disabled={isLoading}
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  {isLoading ? 'Creating account...' : 'Create account'}
                </Button>
              </form>

              {/* Login Link */}
              <p className="text-center text-sm text-neutral-600 mt-6">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-primary-600 hover:text-primary-700 font-semibold transition"
                >
                  Sign in
                </Link>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Text */}
        {step === 'form' && (
          <motion.p
            variants={slideUp}
            className="text-center text-sm text-neutral-500 mt-8"
          >
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="text-primary-600 hover:underline">Terms</Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
