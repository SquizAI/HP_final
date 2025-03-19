// Centralized API key management
export const getElevenLabsAPIKey = () => {
  return import.meta.env.VITE_ELLEVENLABS_API_KEY;
};
