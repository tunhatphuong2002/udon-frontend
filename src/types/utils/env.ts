/**
 * Environment utility for safely accessing environment variables
 */

export type Environment = 'development' | 'production';

// Safely access environment variables with defaults
export const getEnv = (key: string, defaultValue: string = ''): string => {
  if (typeof window !== 'undefined') {
    // Client-side: only access NEXT_PUBLIC_ variables
    if (!key.startsWith('NEXT_PUBLIC_')) {
      console.warn(`Trying to access non-public env var '${key}' on the client side`);
      return defaultValue;
    }
  }

  return process.env[key] || defaultValue;
};

// Current environment
export const getCurrentEnvironment = (): Environment => {
  const env = getEnv('NEXT_PUBLIC_ENV', 'development') as Environment;
  return env;
};

// API configuration
export const API_URL = getEnv('NEXT_PUBLIC_API_URL', 'http://localhost:3001/api');

// Authentication configuration
export const AUTH_DOMAIN = getEnv('NEXT_PUBLIC_AUTH_DOMAIN', 'auth.example.com');
export const CLIENT_ID = getEnv('NEXT_PUBLIC_CLIENT_ID', 'default_client_id');

// Feature flags
export const isFeatureXEnabled = getEnv('NEXT_PUBLIC_ENABLE_FEATURE_X', 'false') === 'true';
export const isAnalyticsEnabled = getEnv('NEXT_PUBLIC_ENABLE_ANALYTICS', 'false') === 'true';

// App information
export const APP_NAME = getEnv('NEXT_PUBLIC_APP_NAME', 'Udon Frontend');

// SEO configuration
export const SITE_URL = getEnv('NEXT_PUBLIC_SITE_URL', 'http://localhost:3000');

// Environment specific checks
export const isDevelopment = getCurrentEnvironment() === 'development';
export const isProduction = getCurrentEnvironment() === 'production';
