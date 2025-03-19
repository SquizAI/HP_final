// ElevenLabs API configuration
export const getElevenLabsHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'xi-api-key': import.meta.env.VITE_ELLEVENLABS_API_KEY
  };
};
