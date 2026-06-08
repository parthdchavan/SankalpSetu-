// Sankalp Setu Design System - Typography Tokens
// Samsung One UI inspired - Large titles, comfortable spacing

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    display: ['Cal Sans', 'Inter', 'sans-serif'],
  },
  
  fontSize: {
    // Display sizes
    'display-2xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
    'display-xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
    'display-lg': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
    
    // Heading sizes
    'heading-xl': ['2.25rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
    'heading-lg': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.005em' }],
    'heading-md': ['1.5rem', { lineHeight: '1.4', letterSpacing: '0' }],
    'heading-sm': ['1.25rem', { lineHeight: '1.4', letterSpacing: '0' }],
    'heading-xs': ['1.125rem', { lineHeight: '1.5', letterSpacing: '0' }],
    
    // Body sizes
    'body-xl': ['1.25rem', { lineHeight: '1.7', letterSpacing: '0' }],
    'body-lg': ['1.125rem', { lineHeight: '1.7', letterSpacing: '0' }],
    'body-md': ['1rem', { lineHeight: '1.6', letterSpacing: '0' }],
    'body-sm': ['0.875rem', { lineHeight: '1.6', letterSpacing: '0' }],
    'body-xs': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0' }],
  },
  
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};
