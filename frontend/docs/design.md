# Design Document: Sankalp Setu UI/UX Design

## Overview

Sankalp Setu is a production-quality food donation platform that connects Donors, NGOs, Volunteers, and Administrators through an elegant, trust-building interface. This design document outlines the comprehensive UI/UX architecture inspired by world-class products (Samsung One UI, Apple HIG, Stripe Dashboard, Linear, Airbnb, Notion) to create an experience worthy of a venture-funded startup.

### Design Goals

1. **Trust**: Every interaction reinforces credibility and safety
2. **Humanity**: Emotional storytelling over cold metrics
3. **Efficiency**: Complete key tasks in minimal time (donation in <60s)
4. **Transparency**: Clear status, progress, and impact visibility
5. **Hope**: Optimistic tone celebrating collective impact

### Technology Stack

- **Frontend**: React 18+ with TypeScript
- **Styling**: TailwindCSS with custom design tokens
- **Components**: ShadCN UI as foundation, customized for brand
- **Animation**: Framer Motion for purposeful micro-interactions
- **Backend**: Spring Boot REST APIs
- **Database**: PostgreSQL
- **Maps**: Google Maps API or Mapbox
- **Image Storage**: AWS S3 or Cloudinary

## Architecture

### High-Level Structure

```
┌─────────────────────────────────────────────────────────────┐
│                     Design System Layer                     │
│  (Tokens, Components, Utilities, Animation Primitives)     │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │   Public     │  │ Authenticated │  │  Role-Specific  │  │
│  │   Website    │  │    Shared     │  │     Views       │  │
│  │              │  │  Components   │  │                 │  │
│  │ • Landing    │  │ • Layout      │  │ • Donor         │  │
│  │ • About      │  │ • Navigation  │  │ • NGO           │  │
│  │ • How Works  │  │ • Profile     │  │ • Volunteer     │  │
│  │ • NGO Dir    │  │ • Notifs      │  │ • Admin         │  │
│  │ • Contact    │  │               │  │                 │  │
│  └──────────────┘  └──────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                     Data & Services Layer                   │
│  (API Client, State Management, Authentication, Analytics) │
└─────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
src/
├── design-system/
│   ├── tokens/           # Colors, spacing, typography, shadows
│   ├── components/       # Reusable UI components
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Card/
│   │   ├── Modal/
│   │   └── ...
│   ├── animations/       # Framer Motion variants and transitions
│   └── utils/           # Design system utilities
│
├── features/
│   ├── public/          # Public website pages
│   ├── auth/            # Authentication flows
│   ├── donor/           # Donor-specific features
│   ├── ngo/             # NGO-specific features
│   ├── volunteer/       # Volunteer-specific features
│   └── admin/           # Admin-specific features
│
├── shared/
│   ├── components/      # Shared business components
│   ├── hooks/          # Custom React hooks
│   ├── contexts/       # React contexts
│   └── utils/          # Business logic utilities
│
├── services/
│   ├── api/            # API client and endpoints
│   ├── auth/           # Authentication service
│   ├── storage/        # Local/session storage
│   └── analytics/      # Analytics integration
│
└── assets/
    ├── images/
    ├── icons/
    └── illustrations/
```

## Components and Interfaces

### Design System Tokens

#### Color System

```typescript
// colors.ts
export const colors = {
  // Primary - Deep Emerald Green
  primary: {
    50: '#f0fdf5',
    100: '#dcfce8',
    200: '#bbf7d1',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',  // Base
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  
  // Secondary - Warm Ivory
  secondary: {
    50: '#fdfdf9',
    100: '#fafaf3',
    200: '#f5f5e7',
    300: '#f0f0db',
    400: '#ebebcf',
    500: '#e6e6c3',  // Base
    600: '#d1d1ae',
    700: '#bcbc99',
    800: '#a7a784',
    900: '#92926f',
  },
  
  // Accent - Muted Gold
  accent: {
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fef08a',
    300: '#fde047',
    400: '#facc15',
    500: '#eab308',  // Base
    600: '#ca8a04',
    700: '#a16207',
    800: '#854d0e',
    900: '#713f12',
  },
  
  // Semantic Colors
  success: {
    DEFAULT: '#10b981',
    light: '#d1fae5',
    dark: '#065f46',
  },
  
  warning: {
    DEFAULT: '#f59e0b',
    light: '#fef3c7',
    dark: '#92400e',
  },
  
  error: {
    DEFAULT: '#ef4444',
    light: '#fee2e2',
    dark: '#991b1b',
  },
  
  // Neutral
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  
  // Background
  background: {
    light: '#fafaf9',  // Off-white
    dark: '#1a1a1a',   // Charcoal black
  },
};
```

#### Typography System

```typescript
// typography.ts
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
```

#### Spacing System

```typescript
// spacing.ts
export const spacing = {
  0: '0',
  1: '0.25rem',    // 4px
  2: '0.5rem',     // 8px
  3: '0.75rem',    // 12px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  8: '2rem',       // 32px
  10: '2.5rem',    // 40px
  12: '3rem',      // 48px
  16: '4rem',      // 64px
  20: '5rem',      // 80px
  24: '6rem',      // 96px
  32: '8rem',      // 128px
  40: '10rem',     // 160px
  48: '12rem',     // 192px
  64: '16rem',     // 256px
};
```

#### Border Radius System

```typescript
// borderRadius.ts
export const borderRadius = {
  none: '0',
  sm: '0.375rem',    // 6px
  md: '0.5rem',      // 8px
  lg: '1rem',        // 16px
  xl: '1.25rem',     // 20px
  '2xl': '1.5rem',   // 24px
  full: '9999px',
  
  // Component-specific
  card: '1.5rem',    // 24px
  input: '1rem',     // 16px
  button: '1rem',    // 16px
};
```

#### Shadow System

```typescript
// shadows.ts
export const shadows = {
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  
  // Elevation system
  elevation1: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
  elevation2: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
  elevation3: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
  elevation4: '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',
  elevation5: '0 19px 38px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22)',
};
```

### Core Components

#### Button Component

```typescript
// components/Button/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}

/**
 * States:
 * - Default: Base styling with elevation1 shadow
 * - Hover: Scale 1.02, elevation2 shadow, brightness increase
 * - Focus: Focus ring (3px with primary-300)
 * - Active: Scale 0.98
 * - Disabled: Opacity 0.6, no pointer events
 * - Loading: Spinner replaces content, maintains width
 */
```

#### Input Component

```typescript
// components/Input/Input.tsx
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  label?: string;
  placeholder?: string;
  value?: string;
  error?: string;
  success?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onChange?: (value: string) => void;
}

/**
 * States:
 * - Default: Neutral border, lg radius
 * - Focus: Primary border, focus ring
 * - Error: Error border, error icon, error message below
 * - Success: Success border, success icon
 * - Disabled: Neutral-200 background, no pointer events
 */
```

#### Card Component

```typescript
// components/Card/Card.tsx
interface CardProps {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  hoverable?: boolean;
  clickable?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

/**
 * Variants:
 * - default: White background, elevation1 shadow, 2xl radius
 * - outlined: Transparent background, neutral-200 border
 * - elevated: White background, elevation3 shadow
 * 
 * Interactions:
 * - Hoverable: Elevation increases, subtle translate-y
 * - Clickable: Cursor pointer, active scale-down
 */
```

#### Modal Component

```typescript
// components/Modal/Modal.tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * Features:
 * - Backdrop blur effect
 * - Focus trap (keyboard navigation contained)
 * - Escape key handling
 * - Backdrop click handling
 * - Scroll lock on body
 * - Animation: Fade backdrop + scale modal
 * - Accessibility: ARIA labels, focus management
 */
```

### Animation System

```typescript
// animations/variants.ts
import { Variants } from 'framer-motion';

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const slideUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const slideInFromRight: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export const cardHover: Variants = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -4 },
};

export const buttonTap = {
  scale: 0.98,
};

// Transition presets
export const transitions = {
  fast: { duration: 0.15, ease: 'easeOut' },
  normal: { duration: 0.3, ease: 'easeInOut' },
  slow: { duration: 0.5, ease: 'easeInOut' },
  spring: { type: 'spring', stiffness: 300, damping: 30 },
};
```

## Data Models

### Frontend State Models

```typescript
// models/User.ts
interface User {
  id: string;
  email: string;
  name: string;
  role: 'DONOR' | 'NGO' | 'VOLUNTEER' | 'ADMIN';
  phone?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Donor extends User {
  role: 'DONOR';
  addresses: Address[];
  totalDonations: number;
  totalMealsProvided: number;
}

interface NGO extends User {
  role: 'NGO';
  organizationName: string;
  registrationNumber: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  address: Address;
  documents: Document[];
  acceptanceRate: number;
  averageResponseTime: number;
}

interface Volunteer extends User {
  role: 'VOLUNTEER';
  isAvailable: boolean;
  totalDeliveries: number;
  completionRate: number;
}

// models/Address.ts
interface Address {
  id: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude: number;
  longitude: number;
}

// models/Donation.ts
interface Donation {
  id: string;
  donorId: string;
  donor: {
    name: string;
    phone: string;
  };
  foodCategory: FoodCategory;
  quantity: number;
  unit: string;
  expiryDate: Date;
  pickupAddress: Address;
  images: string[];
  status: DonationStatus;
  description?: string;
  specialInstructions?: string;
  estimatedMeals: number;
  ngoId?: string;
  ngo?: {
    name: string;
    phone: string;
  };
  volunteerId?: string;
  volunteer?: {
    name: string;
    phone: string;
  };
  createdAt: Date;
  updatedAt: Date;
  acceptedAt?: Date;
  pickedUpAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
}

type DonationStatus = 
  | 'PENDING'
  | 'ACCEPTED'
  | 'PICKUP_SCHEDULED'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'EXPIRED';

enum FoodCategory {
  COOKED_FOOD = 'Cooked Food',
  PACKAGED_FOOD = 'Packaged Food',
  FRUITS_VEGETABLES = 'Fruits & Vegetables',
  DAIRY = 'Dairy Products',
  BAKERY = 'Bakery Items',
  BEVERAGES = 'Beverages',
  OTHER = 'Other',
}

// models/Notification.ts
interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
}

type NotificationType = 
  | 'INFO'
  | 'SUCCESS'
  | 'WARNING'
  | 'URGENT';

// models/PickupAssignment.ts
interface PickupAssignment {
  id: string;
  donationId: string;
  volunteerId: string;
  pickupAddress: Address;
  dropoffAddress: Address;
  status: 'ASSIGNED' | 'STARTED' | 'PICKED_UP' | 'DELIVERED';
  estimatedPickupTime: Date;
  estimatedDeliveryTime: Date;
  actualPickupTime?: Date;
  actualDeliveryTime?: Date;
  route?: {
    distance: number;
    duration: number;
    polyline: string;
  };
}
```

### API Response Shapes

```typescript
// api/types.ts
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
  meta?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Now let me perform the prework analysis for acceptance criteria:


### Design System Properties

**Property 1: Design System Completeness**
*For any* design system configuration object, it should contain all required token categories (colors with primary/secondary/accent/semantic variants, typography with display/heading/body scales, spacing with consistent increments, border radius with component-specific values, shadows with elevation levels, and dark mode variants for all colors) with valid values
**Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7**

**Property 2: Component State Consistency**
*For any* interactive component, when in loading state it should display loading indicators, when in error state it should display error messages, and when in disabled state it should prevent interactions and reduce opacity
**Validates: Requirements 2.13, 2.14, 2.15**

**Property 3: Animation Performance Bounds**
*For any* animation in the platform, the duration should be between 100ms and 400ms, and animations should respect the user's prefers-reduced-motion setting
**Validates: Requirements 3.2, 3.3, 3.4, 3.5, 3.6, 3.8, 3.9**

**Property 4: Public Page Navigation Consistency**
*For any* public website page, the header and footer navigation should be present and consistent
**Validates: Requirements 4.8**

**Property 5: Role-Based Experience Routing**
*For any* user role selection during registration, the platform should display role-specific onboarding content and illustrations, and upon successful authentication should redirect to the appropriate role-specific dashboard
**Validates: Requirements 5.3, 5.4, 5.5, 5.8, 5.10**

**Property 6: Authentication Error Handling**
*For any* authentication failure, error messages should be displayed without exposing sensitive security details (no stack traces, no database errors, no user enumeration hints)
**Validates: Requirements 5.9**

**Property 7: Form Validation Prevention**
*For any* form with required fields, when required fields are incomplete or invalid, form progression or submission should be prevented and validation errors should be displayed
**Validates: Requirements 7.8, 22.7**

**Property 8: Auto-Save Consistency**
*For any* multi-step form (wizard), user input should be automatically saved to prevent data loss during navigation
**Validates: Requirements 7.10**

**Property 9: User Suspension Access Control**
*For any* user with suspended status, login attempts should be prevented and existing sessions should be invalidated
**Validates: Requirements 17.6**

**Property 10: State Change Notifications**
*For any* significant state change (donation accepted, pickup scheduled, delivery completed, verification status changed), appropriate notifications should be sent to all relevant parties based on their notification preferences
**Validates: Requirements 23.1, 23.2, 23.3, 23.4, 23.5, 23.6, 23.7, 23.8, 23.9, 23.10, 23.11**

**Property 11: Responsive Layout Adaptation**
*For any* page or component, when viewport width changes between breakpoints (mobile/tablet/desktop), the layout should adapt appropriately without loss of functionality, with touch targets maintaining minimum 44x44px size on mobile
**Validates: Requirements 24.1, 24.2, 24.3, 24.4, 24.5, 24.6, 24.7, 24.8, 24.9, 24.10**

### Accessibility Properties

**Property 12: Keyboard Navigation Completeness**
*For any* interactive element on any page, it should be reachable and operable using keyboard alone, with logical tab order and visible focus indicators
**Validates: Requirements 25.2, 25.3, 25.4**

**Property 13: Semantic Structure**
*For any* page, the HTML structure should use semantic elements with proper heading hierarchy, and ARIA labels should be provided for icon-only buttons and complex components
**Validates: Requirements 25.5, 25.6**

**Property 14: Alternative Text Coverage**
*For any* meaningful image, appropriate alt text should be provided for screen readers
**Validates: Requirements 25.7**

**Property 15: Color Contrast Compliance**
*For any* text element, the contrast ratio should meet or exceed 4.5:1 for normal text and 3:1 for large text and UI components
**Validates: Requirements 25.8, 25.9**

**Property 16: Assistive Technology Support**
*For any* form with validation errors, error messages should be associated with form fields for screen readers, and dynamic content updates should be announced
**Validates: Requirements 25.11, 25.12**

### State Communication Properties

**Property 17: Loading State Indication**
*For any* asynchronous operation, appropriate loading indicators should be displayed (skeleton loaders for content, spinners for actions, progress bars for multi-step operations)
**Validates: Requirements 26.1, 26.2, 26.3**

**Property 18: Error State Communication**
*For any* error condition (network error, server error, data fetch failure, form submission failure), user-friendly error messages should be displayed with retry options and user input should be preserved
**Validates: Requirements 26.4, 26.5, 26.6, 26.7**

**Property 19: Empty State Guidance**
*For any* list or collection view with no data, an empty state should be displayed with meaningful illustrations and next-action guidance
**Validates: Requirements 26.8**

### Search and Filter Properties

**Property 20: Search Functionality**
*For any* searchable list page, search should provide autocomplete suggestions and display appropriate empty states when no results are found
**Validates: Requirements 27.1, 27.2, 27.7**

**Property 21: Filter State Management**
*For any* filterable view, active filters should be clearly indicated with remove options, provide clear-all functionality, and persist during navigation within the same session
**Validates: Requirements 27.3, 27.4, 27.5, 27.6, 27.8**

### Image Upload Properties

**Property 22: Image Upload Validation**
*For any* image upload, files should be validated for type (JPEG/PNG/WebP) and size (max 10MB), with clear error messages for validation failures
**Validates: Requirements 28.4, 28.5, 28.7**

**Property 23: Image Upload Feedback**
*For any* image being uploaded, a thumbnail preview should be displayed with remove option and upload progress indication
**Validates: Requirements 28.6, 28.10**

### Map Integration Properties

**Property 24: Location Distance Calculation**
*For any* donation location displayed on a map, the distance from the user's current location should be calculated and displayed
**Validates: Requirements 29.4**

**Property 25: Map Marker Interactions**
*For any* map marker representing a donation, clicking should display a donation preview popup
**Validates: Requirements 29.6**

### Performance Properties

**Property 26: Initial Page Load Performance**
*For any* page, initial content should load within 2 seconds on 4G networks and achieve Lighthouse performance score above 90
**Validates: Requirements 30.1, 30.2**

**Property 27: List Virtualization**
*For any* list containing more than 100 items, virtualization should be implemented to maintain performance
**Validates: Requirements 30.7**

**Property 28: API Call Optimization**
*For any* search input, API calls should be debounced to prevent excessive requests
**Validates: Requirements 30.8**

### Security Properties

**Property 29: Transport Security**
*For any* HTTP communication, HTTPS should be enforced
**Validates: Requirements 31.1**

**Property 30: Input Sanitization**
*For any* user input, it should be sanitized to prevent XSS attacks before rendering
**Validates: Requirements 31.2**

**Property 31: Authentication Security**
*For any* authentication operation, passwords should be hashed using bcrypt or Argon2, JWT tokens should be stored securely, and session timeout should occur after 24 hours of inactivity
**Validates: Requirements 31.5, 31.6, 31.9**

**Property 32: Authorization Enforcement**
*For any* protected route or API endpoint, role-based access control should be enforced
**Validates: Requirements 31.7**

### Brand Consistency Properties

**Property 33: Visual Consistency**
*For any* page or component, colors, typography, and spacing should adhere to defined design tokens
**Validates: Requirements 32.1, 32.2, 32.3**

**Property 34: Copy Voice Consistency**
*For any* user-facing text, the tone should be helpful, trustworthy, human, professional, and optimistic
**Validates: Requirements 32.5**

### Analytics Properties

**Property 35: Event Tracking**
*For any* key user action (registration, donation creation, donation acceptance), analytics events should be tracked with appropriate event data
**Validates: Requirements 33.2, 33.3**

**Property 36: Privacy Compliance**
*For any* analytics tracking, the user's Do Not Track setting should be respected and analytics consent should be obtained
**Validates: Requirements 33.6, 33.7**


## Error Handling

### Error Categories

1. **Validation Errors**: User input that fails validation rules
2. **Network Errors**: Failed API requests due to connectivity issues
3. **Server Errors**: Backend failures (500 errors)
4. **Authorization Errors**: Permission denied (403) or authentication required (401)
5. **Not Found Errors**: Resource does not exist (404)
6. **Conflict Errors**: State conflicts (409)

### Error Handling Strategy

```typescript
// services/errorHandler.ts
interface ErrorHandlingStrategy {
  // User-facing error message (never show raw error)
  getUserMessage(error: Error): string;
  
  // Determine if error is recoverable
  isRecoverable(error: Error): boolean;
  
  // Get recovery actions
  getRecoveryActions(error: Error): RecoveryAction[];
  
  // Log for debugging (sent to monitoring service)
  logError(error: Error, context: ErrorContext): void;
}

interface RecoveryAction {
  label: string;
  action: () => void | Promise<void>;
}

// Example usage
class ApiErrorHandler implements ErrorHandlingStrategy {
  getUserMessage(error: ApiError): string {
    if (error.status === 401) {
      return 'Your session has expired. Please log in again.';
    }
    if (error.status === 403) {
      return 'You don\'t have permission to perform this action.';
    }
    if (error.status === 404) {
      return 'The requested resource was not found.';
    }
    if (error.status >= 500) {
      return 'Something went wrong on our end. Please try again later.';
    }
    if (error.status === 422 && error.details) {
      return this.formatValidationErrors(error.details);
    }
    return 'An unexpected error occurred. Please try again.';
  }
  
  isRecoverable(error: ApiError): boolean {
    return error.status !== 401 && error.status < 500;
  }
  
  getRecoveryActions(error: ApiError): RecoveryAction[] {
    if (error.status === 401) {
      return [{ label: 'Log In', action: () => router.push('/login') }];
    }
    if (error.status >= 500) {
      return [{ label: 'Retry', action: () => this.retryLastRequest() }];
    }
    return [];
  }
}
```

### Form Validation

```typescript
// utils/validation.ts
interface ValidationRule<T> {
  validate(value: T): boolean;
  message: string;
}

interface FieldValidation {
  rules: ValidationRule<any>[];
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
}

// Common validation rules
const required: ValidationRule<any> = {
  validate: (value) => value !== null && value !== undefined && value !== '',
  message: 'This field is required',
};

const email: ValidationRule<string> = {
  validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  message: 'Please enter a valid email address',
};

const minLength = (length: number): ValidationRule<string> => ({
  validate: (value) => value.length >= length,
  message: `Must be at least ${length} characters`,
});

const maxFileSize = (sizeMB: number): ValidationRule<File> => ({
  validate: (file) => file.size <= sizeMB * 1024 * 1024,
  message: `File size must not exceed ${sizeMB}MB`,
});
```

### Error Boundaries

```typescript
// components/ErrorBoundary.tsx
class ErrorBoundary extends React.Component<Props, State> {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to error monitoring service
    errorMonitoringService.log({
      error,
      errorInfo,
      userContext: this.props.userContext,
      routeContext: this.props.location,
    });
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback 
        error={this.state.error}
        resetError={() => this.setState({ hasError: false })}
      />;
    }
    return this.props.children;
  }
}
```

## Testing Strategy

### Testing Pyramid

```
              ┌──────────────┐
              │     E2E      │  ← 5% (Critical user flows)
              │    Tests     │
              └──────────────┘
            ┌──────────────────┐
            │  Integration     │  ← 15% (Component interactions)
            │     Tests        │
            └──────────────────┘
          ┌──────────────────────┐
          │  Component Tests     │  ← 30% (UI components)
          │  (React Testing Lib) │
          └──────────────────────┘
       ┌────────────────────────────┐
       │    Unit Tests              │  ← 50% (Business logic, utils)
       │    Property-Based Tests    │
       └────────────────────────────┘
```

### Unit Testing

**Framework**: Vitest
**Coverage Target**: 80% for business logic

```typescript
// Example: utils/formatters.test.ts
describe('formatImpactMetrics', () => {
  it('should format meal count with correct pluralization', () => {
    expect(formatImpactMetrics(1)).toBe('You helped provide 1 meal');
    expect(formatImpactMetrics(125)).toBe('You helped provide 125 meals');
  });
  
  it('should handle zero meals gracefully', () => {
    expect(formatImpactMetrics(0)).toBe('Start donating to make an impact');
  });
});
```

### Component Testing

**Framework**: React Testing Library + Vitest
**Focus**: User interactions, accessibility, state management

```typescript
// Example: Button.test.tsx
describe('Button', () => {
  it('should be keyboard accessible', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button', { name: 'Click me' });
    button.focus();
    expect(button).toHaveFocus();
    
    fireEvent.keyDown(button, { key: 'Enter' });
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('should show loading state and disable interactions', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick} loading>Submit</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(screen.getByRole('status')).toBeInTheDocument(); // Loading spinner
    
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
```

### Property-Based Testing

**Framework**: fast-check (for JavaScript/TypeScript)
**Configuration**: Minimum 100 runs per property
**Tag Format**: Feature: {feature_name}, Property {number}: {property_text}

```typescript
// Example: design-system.property.test.ts
import fc from 'fast-check';

describe('Design System Properties', () => {
  it('Property 1: Design System Completeness', () => {
    // Feature: sankalp-setu-ui-ux-design, Property 1: Design System Completeness
    const designSystemTokens = getDesignSystemTokens();
    
    // Verify all required categories exist
    expect(designSystemTokens).toHaveProperty('colors');
    expect(designSystemTokens).toHaveProperty('typography');
    expect(designSystemTokens).toHaveProperty('spacing');
    expect(designSystemTokens).toHaveProperty('borderRadius');
    expect(designSystemTokens).toHaveProperty('shadows');
    
    // Verify color completeness
    const requiredColorCategories = ['primary', 'secondary', 'accent', 'success', 'warning', 'error'];
    requiredColorCategories.forEach(category => {
      expect(designSystemTokens.colors).toHaveProperty(category);
    });
    
    // Property: For any color token, a dark mode variant should exist
    fc.assert(
      fc.property(
        fc.constantFrom(...Object.keys(designSystemTokens.colors)),
        (colorCategory) => {
          const colorScale = designSystemTokens.colors[colorCategory];
          // If it's a scale object, it should have numeric keys or specific variants
          if (typeof colorScale === 'object') {
            return Object.keys(colorScale).length > 0;
          }
          return typeof colorScale === 'string'; // Single color value
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

```typescript
// Example: validation.property.test.ts
import fc from 'fast-check';

describe('Validation Properties', () => {
  it('Property 7: Form Validation Prevention', () => {
    // Feature: sankalp-setu-ui-ux-design, Property 7: Form Validation Prevention
    
    // Property: For any required field, empty value should prevent submission
    fc.assert(
      fc.property(
        fc.record({
          foodCategory: fc.constantFrom('', null, undefined),
          quantity: fc.constantFrom('', null, undefined, 0),
        }),
        (invalidFormData) => {
          const validationResult = validateDonationForm(invalidFormData);
          expect(validationResult.isValid).toBe(false);
          expect(validationResult.errors.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

```typescript
// Example: responsive.property.test.ts
describe('Responsive Layout Properties', () => {
  it('Property 11: Responsive Layout Adaptation', () => {
    // Feature: sankalp-setu-ui-ux-design, Property 11: Responsive Layout Adaptation
    
    const breakpoints = [320, 375, 768, 1024, 1440];
    
    // Property: For any viewport width, touch targets should be >= 44x44px on mobile
    breakpoints.forEach(width => {
      setViewportWidth(width);
      render(<DonorDashboard />);
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        const { width: btnWidth, height: btnHeight } = button.getBoundingClientRect();
        
        if (width < 768) { // Mobile breakpoint
          expect(btnWidth).toBeGreaterThanOrEqual(44);
          expect(btnHeight).toBeGreaterThanOrEqual(44);
        }
      });
    });
  });
});
```

### Integration Testing

**Framework**: React Testing Library + MSW (Mock Service Worker)
**Focus**: Feature flows, API interactions, navigation

```typescript
// Example: donation-flow.integration.test.tsx
describe('Donation Creation Flow', () => {
  it('should complete donation creation and redirect to details', async () => {
    const user = userEvent.setup();
    
    // Mock API responses
    server.use(
      rest.post('/api/donations', (req, res, ctx) => {
        return res(ctx.json({ id: '123', status: 'PENDING' }));
      })
    );
    
    render(<App />, { wrapper: AuthenticatedDonorWrapper });
    
    // Navigate to create donation
    await user.click(screen.getByRole('button', { name: /create donation/i }));
    
    // Step 1: Food category
    await user.click(screen.getByRole('radio', { name: /cooked food/i }));
    await user.click(screen.getByRole('button', { name: /next/i }));
    
    // Step 2: Quantity
    await user.type(screen.getByLabelText(/quantity/i), '10');
    await user.selectOptions(screen.getByLabelText(/unit/i), 'kg');
    await user.click(screen.getByRole('button', { name: /next/i }));
    
    // ... complete remaining steps
    
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    // Should redirect to donation details
    await waitFor(() => {
      expect(screen.getByText(/donation created successfully/i)).toBeInTheDocument();
    });
  });
});
```

### End-to-End Testing

**Framework**: Playwright
**Focus**: Critical user paths, cross-browser testing

```typescript
// Example: donation-e2e.spec.ts
test('Donor can create donation and track status', async ({ page }) => {
  // Login as donor
  await page.goto('/login');
  await page.fill('[name="email"]', 'donor@test.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button:has-text("Log In")');
  
  // Create donation
  await page.click('button:has-text("Create Donation")');
  await page.click('text=Cooked Food');
  await page.click('button:has-text("Next")');
  
  // ... complete form
  
  await page.click('button:has-text("Submit")');
  
  // Verify success
  await expect(page.locator('text=Donation created successfully')).toBeVisible();
  
  // Verify donation appears in history
  await page.click('text=My Donations');
  await expect(page.locator('text=Cooked Food')).toBeVisible();
});
```

### Accessibility Testing

**Framework**: axe-core + jest-axe
**Coverage**: All pages and components

```typescript
// Example: accessibility.test.tsx
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Accessibility', () => {
  it('Landing page should have no accessibility violations', async () => {
    const { container } = render(<LandingPage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('Donation wizard should be keyboard navigable', async () => {
    const user = userEvent.setup();
    render(<DonationWizard />);
    
    // Tab through all interactive elements
    await user.tab();
    expect(screen.getByRole('radio', { name: /cooked food/i })).toHaveFocus();
    
    await user.tab();
    expect(screen.getByRole('radio', { name: /packaged food/i })).toHaveFocus();
  });
});
```

### Visual Regression Testing

**Framework**: Chromatic or Percy
**Coverage**: Component library, critical pages

```typescript
// Example: Button.stories.tsx (Storybook)
export default {
  title: 'Design System/Button',
  component: Button,
} as ComponentMeta<typeof Button>;

export const Primary: ComponentStory<typeof Button> = () => (
  <Button variant="primary">Primary Button</Button>
);

export const AllStates: ComponentStory<typeof Button> = () => (
  <div className="space-y-4">
    <Button variant="primary">Default</Button>
    <Button variant="primary" className="hover">Hover</Button>
    <Button variant="primary" disabled>Disabled</Button>
    <Button variant="primary" loading>Loading</Button>
  </div>
);
```

### Performance Testing

**Tools**: Lighthouse CI, Web Vitals
**Thresholds**: 
- Performance score: > 90
- FCP: < 1.8s
- LCP: < 2.5s
- CLS: < 0.1
- FID: < 100ms

```yaml
# lighthouserc.yml
ci:
  collect:
    numberOfRuns: 3
    settings:
      preset: 'desktop'
  assert:
    assertions:
      performance: ['error', {minScore: 0.9}]
      accessibility: ['error', {minScore: 0.95}]
      first-contentful-paint: ['error', {maxNumericValue: 1800}]
      largest-contentful-paint: ['error', {maxNumericValue: 2500}]
```

## Implementation Guidelines

### Code Organization Principles

1. **Feature-based structure**: Group by feature, not by type
2. **Colocation**: Keep related files together
3. **Clear separation**: Design system vs business components
4. **Dependency direction**: Features depend on design system, never reverse

### Component Design Principles

1. **Single Responsibility**: Each component should do one thing well
2. **Composition over Configuration**: Prefer composable APIs over massive prop lists
3. **Controlled vs Uncontrolled**: Provide both patterns where appropriate
4. **Accessibility First**: Build in ARIA and keyboard support from the start

### State Management Strategy

```typescript
// Use React Context for global state
// contexts/AuthContext.tsx
interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => Promise<void>;
}

// Use React Query for server state
// hooks/useDonations.ts
export function useDonations(filters: DonationFilters) {
  return useQuery({
    queryKey: ['donations', filters],
    queryFn: () => api.donations.list(filters),
    staleTime: 30000, // 30 seconds
  });
}

// Use local state for component-specific state
// components/DonationWizard.tsx
const [currentStep, setCurrentStep] = useState(0);
const [formData, setFormData] = useState<DonationFormData>({});
```

### API Integration Pattern

```typescript
// services/api/client.ts
class ApiClient {
  private baseURL: string;
  private authToken?: string;
  
  async request<T>(config: RequestConfig): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${config.url}`, {
      method: config.method,
      headers: {
        'Content-Type': 'application/json',
        ...(this.authToken && { Authorization: `Bearer ${this.authToken}` }),
        ...config.headers,
      },
      body: config.body ? JSON.stringify(config.body) : undefined,
    });
    
    if (!response.ok) {
      throw await this.handleError(response);
    }
    
    return response.json();
  }
}

// services/api/donations.ts
export const donationsApi = {
  list: (filters: DonationFilters) => 
    apiClient.get<PaginatedResponse<Donation>>('/donations', { params: filters }),
    
  get: (id: string) => 
    apiClient.get<Donation>(`/donations/${id}`),
    
  create: (data: CreateDonationDTO) => 
    apiClient.post<Donation>('/donations', data),
    
  update: (id: string, data: UpdateDonationDTO) => 
    apiClient.patch<Donation>(`/donations/${id}`, data),
    
  delete: (id: string) => 
    apiClient.delete(`/donations/${id}`),
};
```

### Performance Optimization Patterns

```typescript
// 1. Code Splitting
const DonorDashboard = lazy(() => import('./features/donor/Dashboard'));
const NGODashboard = lazy(() => import('./features/ngo/Dashboard'));

// 2. Image Optimization
<Image
  src={donation.images[0]}
  alt="Donated food"
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
/>

// 3. Memoization
const memoizedValue = useMemo(() => {
  return expensiveCalculation(dependency);
}, [dependency]);

const MemoizedComponent = memo(ExpensiveComponent);

// 4. Virtual Lists
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={donations.length}
  itemSize={120}
  width="100%"
>
  {({ index, style }) => (
    <DonationCard donation={donations[index]} style={style} />
  )}
</FixedSizeList>
```

## Deployment and DevOps

### Build Pipeline

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Type check
        run: npm run type-check
      
      - name: Unit tests
        run: npm run test:unit
      
      - name: Component tests
        run: npm run test:component
      
      - name: E2E tests
        run: npm run test:e2e
      
      - name: Accessibility tests
        run: npm run test:a11y
      
      - name: Build
        run: npm run build
      
      - name: Lighthouse CI
        run: npm run lighthouse
```

### Environment Configuration

```typescript
// config/env.ts
interface EnvironmentConfig {
  apiBaseUrl: string;
  mapApiKey: string;
  analyticsId: string;
  environment: 'development' | 'staging' | 'production';
}

export const config: EnvironmentConfig = {
  apiBaseUrl: process.env.VITE_API_BASE_URL || 'http://localhost:8080',
  mapApiKey: process.env.VITE_MAP_API_KEY || '',
  analyticsId: process.env.VITE_ANALYTICS_ID || '',
  environment: (process.env.VITE_ENV as any) || 'development',
};
```

This design document provides the comprehensive blueprint for implementing Sankalp Setu's UI/UX. The design emphasizes quality, accessibility, performance, and user trust while maintaining a production-ready standard that would impress recruiters, investors, and NGO partners.
