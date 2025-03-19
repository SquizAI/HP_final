/**
 * Environment Configuration Utility
 * 
 * This utility provides a safe way to access environment variables in browser context
 * It handles fallbacks and provides type safety for configuration values
 */

// Extend Window interface to include ENV property
declare global {
  interface Window {
    ENV?: {
      OPENAI_API_KEY?: string;
      OPENAI_MODEL?: string;
      DALLE_MODEL?: string;
      API_ENDPOINT?: string;
      USE_MOCK_DATA?: boolean;
    };
  }
}

interface EnvConfig {
  OPENAI_API_KEY: string;
  OPENAI_MODEL: string;
  DALLE_MODEL: string;
  API_ENDPOINT: string;
  USE_MOCK_DATA: boolean;
}

// For development, we can use a global ENV object
if (typeof window !== 'undefined' && !window.ENV) {
  window.ENV = {
    OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY || '',
    OPENAI_MODEL: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-2024-08-06',
    DALLE_MODEL: import.meta.env.VITE_DALLE_MODEL || 'dall-e-3',
    API_ENDPOINT: import.meta.env.VITE_API_ENDPOINT || 'https://api.openai.com/v1',
    USE_MOCK_DATA: import.meta.env.VITE_USE_MOCK_DATA === 'true' || false
  };
}

/**
 * Gets a configuration value from the appropriate source based on environment
 * Checks window.ENV first (for runtime injection), then import.meta.env (for build-time)
 * Falls back to defaults for development
 */
export function getConfig(): EnvConfig {
  // For security in production, these values should be properly injected at runtime 
  // or proxied through your backend service
  
  const defaultConfig: EnvConfig = {
    OPENAI_API_KEY: 'not-a-real-key',
    OPENAI_MODEL: 'gpt-4o-2024-08-06',
    DALLE_MODEL: 'dall-e-3',
    API_ENDPOINT: 'https://api.openai.com/v1',
    USE_MOCK_DATA: false  // Changed from true to false to use real data by default
  };

  // Check for window.ENV (runtime injection)
  // @ts-ignore - window.ENV might not exist in all contexts
  const windowEnv = typeof window !== 'undefined' && window.ENV ? window.ENV : {};
  
  // Check for import.meta.env (build-time injection)
  const buildEnv = {
    OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
    OPENAI_MODEL: import.meta.env.VITE_OPENAI_MODEL,
    DALLE_MODEL: import.meta.env.VITE_DALLE_MODEL,
    API_ENDPOINT: import.meta.env.VITE_API_ENDPOINT,
    USE_MOCK_DATA: import.meta.env.VITE_USE_MOCK_DATA === 'true',
  };
  
  // Combine sources with precedence: window.ENV > import.meta.env > defaults
  return {
    OPENAI_API_KEY: windowEnv.OPENAI_API_KEY || buildEnv.OPENAI_API_KEY || defaultConfig.OPENAI_API_KEY,
    OPENAI_MODEL: windowEnv.OPENAI_MODEL || buildEnv.OPENAI_MODEL || defaultConfig.OPENAI_MODEL,
    DALLE_MODEL: windowEnv.DALLE_MODEL || buildEnv.DALLE_MODEL || defaultConfig.DALLE_MODEL,
    API_ENDPOINT: windowEnv.API_ENDPOINT || buildEnv.API_ENDPOINT || defaultConfig.API_ENDPOINT,
    USE_MOCK_DATA: windowEnv.USE_MOCK_DATA !== undefined 
      ? windowEnv.USE_MOCK_DATA 
      : (buildEnv.USE_MOCK_DATA !== undefined ? buildEnv.USE_MOCK_DATA : defaultConfig.USE_MOCK_DATA)
  };
}

/**
 * Helper to safely access the OpenAI API key
 * In production, this should be handled through a backend proxy
 */
export function getOpenAIKey(): string {
  try {
    const config = getConfig();
    return config.OPENAI_API_KEY;
  } catch (error) {
    console.warn('Failed to retrieve OpenAI API key:', error);
    return '';
  }
}

/**
 * Helper to determine if mock data should be used
 */
export function shouldUseMockData(): boolean {
  try {
    const config = getConfig();
    
    // Only use mock data if no valid API key is available
    // Explicit setting of USE_MOCK_DATA is no longer the primary factor
    if (!config.OPENAI_API_KEY || 
        config.OPENAI_API_KEY === 'not-a-real-key' || 
        config.OPENAI_API_KEY === '%REACT_APP_OPENAI_API_KEY%' || 
        config.OPENAI_API_KEY === 'your-openai-api-key-here') {
      console.warn('Using mock data due to missing/invalid API key');
      return true;
    }
    
    // Override any mock data settings with the window.ENV setting
    // This allows runtime control (e.g., from the UI)
    if (typeof window !== 'undefined' && window.ENV && window.ENV.USE_MOCK_DATA === false) {
      console.log('Explicitly using real AI data for generation (set by runtime)');
      return false;
    }
    
    // Otherwise respect the config setting, but prefer real data
    const useMock = config.USE_MOCK_DATA === true;
    if (useMock) {
      console.log('Using mock data (explicitly set in config)');
    } else {
      console.log('Using real AI data for generation');
    }
    
    return useMock;
  } catch (error) {
    console.warn('Error checking mock data flag:', error);
    return false; // Default to real data on error, changed from true
  }
}

/**
 * Get the configured OpenAI model
 */
export function getOpenAIModel(): string {
  try {
    return getConfig().OPENAI_MODEL;
  } catch (error) {
    console.warn('Error getting OpenAI model:', error);
    return 'gpt-4-turbo';
  }
}

/**
 * Get the configured DALL-E model
 */
export function getDALLEModel(): string {
  try {
    return getConfig().DALLE_MODEL;
  } catch (error) {
    console.warn('Error getting DALL-E model:', error);
    return 'dall-e-3';
  }
}

export default {
  getConfig,
  getOpenAIKey,
  shouldUseMockData,
  getOpenAIModel,
  getDALLEModel
}; 