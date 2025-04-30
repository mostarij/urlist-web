import 'dotenv/config';

function validateEnv() {
  // Add defaults for development
  if (process.env.NODE_ENV !== 'production') {
    process.env.DATABASE_URL ||= 'postgresql://user:password@localhost:5432/urlist';
    process.env.APP_URL ||= 'http://localhost:3000';
    process.env.SESSION_SECRET ||= 'dev-secret-at-least-32-chars-long-here';
  }

  const required = ['DATABASE_URL', 'APP_URL', 'SESSION_SECRET'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('Environment variables missing:', missing);
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return {
    DATABASE_URL: process.env.DATABASE_URL!,
    NODE_ENV: process.env.NODE_ENV || 'development',
    APP_URL: process.env.APP_URL!,
    SESSION_SECRET: process.env.SESSION_SECRET!,
  };
}

export const ENV = validateEnv();
export const APP_NAME = 'UrList';
export const APP_DESCRIPTION = 'Your universal list manager for organizing everything in one place';
export const IS_PROD = ENV.NODE_ENV === 'production';

export const ROUTES = {
  HOME: '/',
  GET_STARTED: '/get-started',
  ABOUT: '/about',
  LISTS: '/lists',
  NEW_LIST: '/lists/new',
  TERMS: '/terms',
  FEATURES: '/features',
  PRIVACY: '/privacy',
} as const;

export const MAX_TITLE_LENGTH = 100;
export const MAX_DESCRIPTION_LENGTH = 500;
export const MAX_LIST_ITEMS = 100;

export const THEME = {
  colors: {
    primary: {
      light: '#60A5FA', // blue-400
      DEFAULT: '#2563EB', // blue-600
      dark: '#1D4ED8', // blue-700
    },
    secondary: {
      light: '#E2E8F0', // gray-200
      DEFAULT: '#64748B', // gray-500
      dark: '#334155', // gray-700
    },
  },
  fontSizes: {
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },
} as const;
