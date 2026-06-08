// Sankalp Setu Design System - Animations Export
// Export all animation variants and utilities

export * from './variants';

// Animation utility function to respect reduced motion preferences
export const getAnimationProps = (variants, transition = {}) => {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return {
      initial: false,
      animate: false,
      exit: false,
      transition: { duration: 0.01 },
    };
  }
  
  return {
    variants,
    initial: 'initial',
    animate: 'animate',
    exit: 'exit',
    transition,
  };
};
