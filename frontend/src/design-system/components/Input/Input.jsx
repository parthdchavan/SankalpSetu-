import { useId, useState } from 'react';
import { AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { clsx } from 'clsx';

/**
 * Input Component - Production-quality input with validation states
 * 
 * Features:
 * - Multiple input types (text, email, password, number, tel, url)
 * - Validation states (default, focus, error, success, disabled)
 * - Label, placeholder, hint, error message support
 * - Icon support (left/right)
 * - Password visibility toggle
 * - Full accessibility support
 */

const Input = ({
  type = 'text',
  label,
  placeholder,
  value,
  error,
  success,
  hint,
  disabled = false,
  required = false,
  leftIcon,
  rightIcon,
  onChange,
  className = '',
  id,
  name,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || name || `input-${useId().replace(/:/g, '')}`;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const isPassword = type === 'password';
  const actualType = isPassword && showPassword ? 'text' : type;

  // Determine input state
  const hasError = Boolean(error);
  const hasSuccess = Boolean(success) && !hasError;

  // Border styles based on state
  const borderStyles = clsx({
    'border-neutral-300 focus:border-primary-600 focus:ring-primary-300': !hasError && !hasSuccess,
    'border-error focus:border-error focus:ring-error-light': hasError,
    'border-success focus:border-success focus:ring-success-light': hasSuccess,
  });

  return (
    <div className={clsx('w-full', className)}>
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-neutral-700 mb-1.5"
        >
          {label}
          {required && <span className="text-error ml-1" aria-label="required">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            {leftIcon}
          </div>
        )}

        {/* Input Field */}
        <input
          id={inputId}
          name={name}
          type={actualType}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          onChange={handleChange}
          className={clsx(
            // Base styles
            'w-full px-4 py-2.5',
            'text-base text-neutral-900 placeholder:text-neutral-400',
            'bg-white',
            'border-2 rounded-input',
            'transition-all duration-150',
            'focus:outline-none focus:ring-2',
            
            // Border and ring styles
            borderStyles,
            
            // Padding adjustments for icons
            {
              'pl-10': leftIcon,
              'pr-10': rightIcon || isPassword || hasError || hasSuccess,
            },
            
            // Disabled state
            {
              'bg-neutral-100 cursor-not-allowed opacity-60': disabled,
            }
          )}
          aria-invalid={hasError}
          aria-describedby={clsx({
            [errorId]: hasError,
            [hintId]: hint && !hasError,
          })}
          {...props}
        />

        {/* Right Icons/Indicators */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {/* Error Icon */}
          {hasError && (
            <AlertCircle className="w-5 h-5 text-error" aria-hidden="true" />
          )}
          
          {/* Success Icon */}
          {hasSuccess && (
            <CheckCircle2 className="w-5 h-5 text-success" aria-hidden="true" />
          )}
          
          {/* Password Toggle */}
          {isPassword && !hasError && !hasSuccess && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-neutral-400 hover:text-neutral-600 focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}
          
          {/* Custom Right Icon */}
          {rightIcon && !hasError && !hasSuccess && !isPassword && (
            <div className="text-neutral-400">
              {rightIcon}
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {hasError && (
        <p id={errorId} className="mt-1.5 text-sm text-error" role="alert">
          {error}
        </p>
      )}

      {/* Success Message */}
      {hasSuccess && (
        <p className="mt-1.5 text-sm text-success">
          {success}
        </p>
      )}

      {/* Hint Text */}
      {hint && !hasError && (
        <p id={hintId} className="mt-1.5 text-sm text-neutral-500">
          {hint}
        </p>
      )}
    </div>
  );
};

export default Input;
