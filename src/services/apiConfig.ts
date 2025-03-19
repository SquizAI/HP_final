/**
 * Centralized API configuration service
 * This service provides secure access to API keys from environment variables
 * Never store or expose API keys directly in frontend code
 */

// Helper function to safely access environment variables
const getEnvVariable = (key: string): string => {
  const value = import.meta.env[key];
  if (!value) {
    console.error(`Environment variable ${key} is not defined`);
    return '';
  }
  return value;
};

// OpenAI API configuration
export const getOpenAIConfig = () => {
  return {
    apiKey: getEnvVariable('VITE_OPENAI_API_KEY'),
    baseUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4-turbo',
  };
};

// Fal.ai API configuration
export const getFalAIConfig = () => {
  return {
    apiKey: getEnvVariable('VITE_FAL_API_KEY'),
    baseUrl: 'https://api.fal.ai',
  };
};

// Deepgram API configuration
export const getDeepgramConfig = () => {
  return {
    apiKey: getEnvVariable('VITE_DEEPGRAM_API_KEY'),
    baseUrl: 'https://api.deepgram.com/v1',
  };
};

// Helper function to get authorization headers for OpenAI
export const getOpenAIHeaders = () => {
  const { apiKey } = getOpenAIConfig();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  };
};

// Helper function to get authorization headers for Fal.ai
export const getFalAIHeaders = () => {
  const { apiKey } = getFalAIConfig();
  
  // Split the API key into key_id and key_secret if in the format 'key_id:key_secret'
  if (apiKey.includes(':')) {
    const [key_id, key_secret] = apiKey.split(':');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${btoa(`${key_id}:${key_secret}`)}`
    };
  }
  
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  };
};

// Gemini API configuration
export const getGeminiConfig = () => {
  return {
    apiKey: getEnvVariable('VITE_GEMINI_API_KEY'),
    baseUrl: 'https://generativelanguage.googleapis.com',
  };
};

// Helper function to get headers for Gemini API
export const getGeminiHeaders = () => {
  const { apiKey } = getGeminiConfig();
  return {
    'Content-Type': 'application/json',
    'x-goog-api-key': apiKey
  };
};

// Helper function to get authorization headers for Deepgram
export const getDeepgramHeaders = () => {
  const { apiKey } = getDeepgramConfig();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Token ${apiKey}`
  };
};
