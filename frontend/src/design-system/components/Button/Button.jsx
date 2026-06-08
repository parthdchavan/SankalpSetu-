import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { buttonTap, transitions } from '../../animations';

/**
 * Button Component - Production-quality button with all variants and states
 * 
 * Features:
 * - 5 variants: primary, secondary, outline, ghost, destructive
 * - 4 sizes: sm, md, lg, xl
 * - Loading state with spinner
 * - Disabled state
 * - Icon support (left/right)
 * - Full accessibility support
 * - Framer Motion animations
 */

const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  children,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  // Variant styles
  const variantStyles = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-300 shadow-elevation1 hover:shadow-elevation2',
    secondary: 'bg-secondary-500 text-neutral-900 hover:bg-secondary-600 focus:ring-secondary-300 shadow-elevation1 hover:shadow-elevation2',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-300',
    ghost: 'text-primary-600 hover:bg-primary-50 focus:ring-primary-300',
    destructive: 'bg-error text-white hover:bg-error-dark focus:ring-error-light shadow-elevation1 hover:shadow-elevation2',
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  };

  // Icon sizes
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7',
  };

  const isDisabled = disabled || loading;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      whileTap={!isDisabled ? buttonTap : {}}
      transition={transitions.fast}
      className={clsx(
        // Base styles
        'inline-flex items-center justify-center gap-2',
        'font-medium',
        'rounded-button',
        'transition-all duration-150',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        
        // Variant and size
        variantStyles[variant],
        sizeStyles[size],
        
        // States
        {
          'w-full': fullWidth,
          'opacity-60 cursor-not-allowed': isDisabled,
          'cursor-pointer': !isDisabled,
        },
        
        className
      )}
      {...props}
    >
      {loading && (
        <Loader2 className={clsx(iconSizes[size], 'animate-spin')} />
      )}
      
      {!loading && leftIcon && (
        <span className={iconSizes[size]}>{leftIcon}</span>
      )}
      
      {children}
      
      {!loading && rightIcon && (
        <span className={iconSizes[size]}>{rightIcon}</span>
      )}
    </motion.button>
  );
};

export default Button;
