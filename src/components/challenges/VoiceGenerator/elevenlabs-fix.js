// In your VoiceGeneratorMain.tsx file, find both instances of:

// 'xi-api-key': 'sk_7601838def063efaf8a5f0e72dcb8c41b54f359446e7cc89'

// And replace them with:

// 'xi-api-key': import.meta.env.VITE_ELLEVENLABS_API_KEY

// This will use the environment variable you've added to your .env file
// Make sure to restart your Vite server after making these changes

// The authentication error (401 Unauthorized) indicates that your ElevenLabs API key
// is either incorrect or expired. Double-check that the VITE_ELLEVENLABS_API_KEY 
// in your .env file is correct and valid.
