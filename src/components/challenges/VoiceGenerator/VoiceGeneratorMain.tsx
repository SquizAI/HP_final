import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  Volume2, 
  Play, 
  StopCircle, 
  Download, 
  RefreshCw, 
  Check, 
  Wand2, 
  Globe, 
  ChevronDown, 
  ChevronUp,
  AlertCircle,
  User,
  Square
} from 'lucide-react';
import { useChallengeStatus } from '../../../utils/userDataManager';
import ChallengeHeader from '../../shared/ChallengeHeader';
import Confetti from '../../shared/Confetti';
import { getOpenAIHeaders } from '../../../services/apiConfig';
import axios from 'axios';

// Eleven Labs voices - using real voice IDs
const ELEVEN_LABS_VOICES = [
  // Male Voices
  { id: 'K4mIm9HZLpIcJUypZOl1', name: 'Jaime', description: 'Conversational, friendly professional tone', gender: 'male' },
  { id: '2gPFXx8pN3Avh27Dw5Ma', name: 'Oxley', description: 'Dramatic, villainous character voice', gender: 'male' },
  { id: 'cla3YFxFwdDazSiKsv9U', name: 'Alexander', description: 'Clean, confident, deep masculine voice', gender: 'male' },
  { id: '5Q0t7uMcjvnagumLfvZi', name: 'Paul', description: 'Warm, natural-sounding male voice', gender: 'male' },
  { id: 'yoZ06aMxZJJ28mfd3POQ', name: 'Thomas', description: 'Deep authoritative voice with British accent', gender: 'male' },
  { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni', description: 'Warm male voice with slight accent', gender: 'male' },
  // Female Voices
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sophie', description: 'Friendly, professional female voice', gender: 'female' },
  { id: 'jBpfuIE2acCO8z3wKNLl', name: 'Bella', description: 'Cheerful and energetic female voice', gender: 'female' },
  { id: 'pNInz6obpgDQGcFmaJgB', name: 'Emily', description: 'Clear, articulate female voice with US accent', gender: 'female' },
  { id: 'N2lVS1w4EtoT3dr4JR6Z', name: 'Grace', description: 'Soft-spoken female voice with UK accent', gender: 'female' },
  { id: 'flq6f7yk4E4fJM5XTYuZ', name: 'Rachel', description: 'Warm, conversational female voice', gender: 'female' },
  { id: 'XB0fDUnXU5powFXDhCwa', name: 'Charlotte', description: 'Professional female news presenter style', gender: 'female' }
];

// Language options with only US and UK English plus other languages
const LANGUAGES = [
  // English Variants (Limited to US and UK only)
  { id: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { id: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
  // European Languages
  { id: 'es-ES', name: 'Spanish (Spain)', flag: '🇪🇸' },
  { id: 'es-MX', name: 'Spanish (Mexico)', flag: '🇲🇽' },
  { id: 'fr-FR', name: 'French', flag: '🇫🇷' },
  { id: 'de-DE', name: 'German', flag: '🇩🇪' },
  { id: 'it-IT', name: 'Italian', flag: '🇮🇹' },
  { id: 'pt-PT', name: 'Portuguese (Portugal)', flag: '🇵🇹' },
  { id: 'pt-BR', name: 'Portuguese (Brazil)', flag: '🇧🇷' },
  // Asian Languages
  { id: 'ja-JP', name: 'Japanese', flag: '🇯🇵' },
  { id: 'ko-KR', name: 'Korean', flag: '🇰🇷' },
  { id: 'zh-CN', name: 'Chinese (Mandarin)', flag: '🇨🇳' },
  { id: 'hi-IN', name: 'Hindi', flag: '🇮🇳' }
];

// Voice Generator component
const VoiceGeneratorMain: React.FC = () => {
  // Properly handle challenge completion
  const { isCompleted: challengeCompleted, handleCompleteChallenge: markCompleted } = useChallengeStatus('challenge-7');
  const [completionMessage, setCompletionMessage] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  
  // Main state
  const [script, setScript] = useState<string>("");
  const [scriptPrompt, setScriptPrompt] = useState<string>("");
  const [selectedVoice, setSelectedVoice] = useState<string>(ELEVEN_LABS_VOICES[0].id);
  const [alternativeVoice, setAlternativeVoice] = useState<string>(""); // Add missing state for alternative voice
  const [selectedLanguage, setSelectedLanguage] = useState<string>(LANGUAGES[0].id);
  const [isVoicesOpen, setIsVoicesOpen] = useState<boolean>(false);
  const [isLanguagesOpen, setIsLanguagesOpen] = useState<boolean>(false);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null);
  const [generatedAudioUrlAlt, setGeneratedAudioUrlAlt] = useState<string | null>(null);

  const [isGeneratingScript, setIsGeneratingScript] = useState<boolean>(false);
  const [isGeneratingVoice, setIsGeneratingVoice] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(challengeCompleted);

  // Audio refs
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioRefAlt = useRef<HTMLAudioElement>(null);
  
  // Update local state when challenge status changes
  useEffect(() => {
    setIsCompleted(challengeCompleted);
  }, [challengeCompleted]);

    // Reference to the currently playing audio
  const [currentlyPlayingRef, setCurrentlyPlayingRef] = useState<React.RefObject<HTMLAudioElement> | null>(null);

  // Generate script with GPT-4o-mini using structured outputs and auto-generate voice
  const generateScript = async () => {
    // Validate required inputs
    if (!scriptPrompt.trim()) {
      setError("Please enter a prompt for script generation");
      return;
    }
    
    if (selectedVoice === "default") {
      setError("Please select a voice before generating a script");
      return;
    }
    
    if (selectedLanguage === "english") {
      // Default is fine, but we need to ensure one is selected
    }
    
    setIsGeneratingScript(true);
    setError(null);
    
    try {
      // Call OpenAI API to generate script with structured JSON output
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: "gpt-4o-mini-2024-07-18",
          messages: [
            {
              role: "system",
              content: `You are a helpful AI assistant that creates short, engaging scripts. Create a brief script (2-3 sentences) about the provided topic in the specified language. The script should be conversational and suitable for voice generation. ONLY return the script text itself without any additional commentary, formatting, or markdown.`
            },
            {
              role: "user",
              content: `Create a brief script about: ${scriptPrompt}. Language: ${selectedLanguage}`
            }
          ],
          max_tokens: 150,
          temperature: 0.7,
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "script_content",
              schema: {
                type: "object",
                properties: {
                  script: {
                    type: "string",
                    description: "The generated script text without any formatting or additional commentary"
                  }
                },
                required: ["script"],
                additionalProperties: false
              },
              strict: true
            }
          }
        },
        {
          headers: getOpenAIHeaders()
        }
      );
      
      // Parse the JSON response to extract the clean script content
      const responseContent = JSON.parse(response.data.choices[0].message.content);
      const generatedScript = responseContent.script.trim();
      setScript(generatedScript);
      
      // Automatically generate voice after script generation
      setTimeout(() => {
        generateVoice();
      }, 100);
      
    } catch (err: any) {
      console.error('Error generating script:', err);
      // Provide more specific error messages
      if (err.response?.status === 429) {
        setError("API rate limit exceeded. Please try again later.");
      } else if (err.response?.status === 401) {
        setError("API key is invalid or expired. Please check your OpenAI API key.");
      } else if (err.message.includes('JSON')) {
        setError("Failed to parse the script response. Please try again.");
      } else {
        setError("Failed to generate script. Please try again.");
      }
    } finally {
      setIsGeneratingScript(false);
    }
  };

  // Generate voice with Eleven Labs and auto-play
  const generateVoice = async () => {
    if (!script.trim()) {
      setError("Please generate or enter a script first");
      return;
    }
    
    setIsGeneratingVoice(true);
    setError(null);
    
    try {
      // Check if API key is available
      const apiKey = import.meta.env.VITE_ELLEVENLABS_API_KEY;
      if (!apiKey) {
        throw new Error("Eleven Labs API key is not configured. Please add it to your environment variables.");
      }

      // First, stop any currently playing audio
      if (currentlyPlayingRef && currentlyPlayingRef.current) {
        currentlyPlayingRef.current.pause();
        currentlyPlayingRef.current.currentTime = 0;
        setIsPlaying(false);
        setCurrentlyPlayingRef(null);
      }

      // Call Eleven Labs API to generate voice
      const response = await axios.post(
        `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoice}/stream`,
        {
          text: script,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': apiKey
          },
          responseType: 'blob'
        }
      );
      
      // Create a blob URL for the audio
      const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      setGeneratedAudioUrl(audioUrl);
      
      // Auto-play the generated audio
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.load();
          audioRef.current.play();
          setIsPlaying(true);
          setCurrentlyPlayingRef(audioRef);
          
          // Set up event listener to reset playing state when audio ends
          audioRef.current.onended = () => {
            setIsPlaying(false);
            setCurrentlyPlayingRef(null);
          };
        }
        
        // Mark the challenge as completed and show confetti
        if (!isCompleted) {
          markCompleted();
          setCompletionMessage("🎉 Challenge completed! Great job generating voice with AI!");
          setIsCompleted(true);
          setShowConfetti(true);
          
          // Hide completion message and confetti after 5 seconds
          setTimeout(() => {
            setCompletionMessage(null);
            setShowConfetti(false);
          }, 5000);
        }
      }, 100);
    } catch (err: any) {
      console.error('Error generating voice:', err);
      
      // Provide more detailed error messages based on the error
      if (err.response) {
        if (err.response.status === 400) {
          setError("Invalid request. Please check your input and try again.");
        } else if (err.response.status === 401) {
          setError("Unauthorized. Please check your Eleven Labs API key.");
        } else if (err.response.status === 429) {
          setError("API rate limit exceeded. Please try again later.");
        } else {
          setError(`API error: ${err.response.status}. Please try again later.`);
        }
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Failed to generate voice. Please try again.");
      }
    } finally {
      setIsGeneratingVoice(false);
    }
  };

  // Generate alternative voice
  const generateAlternativeVoice = async () => {
    if (!script.trim()) {
      setError("Please generate or enter a script first");
      return;
    }
    
    setIsGeneratingVoice(true);
    setError(null);
    
    // Select a different voice for the alternative
    // Find a voice with a different gender if possible
    const currentVoice = ELEVEN_LABS_VOICES.find(voice => voice.id === selectedVoice);
    const currentGender = currentVoice?.gender || 'male';
    const oppositeGenderVoices = ELEVEN_LABS_VOICES.filter(voice => 
      voice.id !== selectedVoice && voice.gender !== currentGender
    );
    
    // If there are opposite gender voices available, choose from them, otherwise choose from any other voice
    const alternativeVoices = oppositeGenderVoices.length > 0 
      ? oppositeGenderVoices 
      : ELEVEN_LABS_VOICES.filter(voice => voice.id !== selectedVoice);
    
    const altVoice = alternativeVoices[Math.floor(Math.random() * alternativeVoices.length)];
    setAlternativeVoice(altVoice.id);
    
    try {
      // Check if API key is available
      const apiKey = import.meta.env.VITE_ELLEVENLABS_API_KEY;
      if (!apiKey) {
        throw new Error("Eleven Labs API key is not configured. Please add it to your environment variables.");
      }
      
      // Call Eleven Labs API to generate voice with alternative voice
      const response = await axios.post(
        `https://api.elevenlabs.io/v1/text-to-speech/${alternativeVoice}/stream`,
        {
          text: script,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': apiKey
          },
          responseType: 'blob'
        }
      );
      
      // Create a blob URL for the audio
      const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      setGeneratedAudioUrlAlt(audioUrl);
    } catch (err: any) {
      console.error('Error generating alternative voice:', err);
      
      // Provide more detailed error messages based on the error
      if (err.response) {
        if (err.response.status === 400) {
          setError("Invalid request for alternative voice. Please check your input and try again.");
        } else if (err.response.status === 401) {
          setError("Unauthorized. Please check your Eleven Labs API key.");
        } else if (err.response.status === 429) {
          setError("API rate limit exceeded. Please try again later.");
        } else {
          setError(`API error: ${err.response.status}. Please try again later.`);
        }
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Failed to generate alternative voice. Please try again.");
      }
    } finally {
      setIsGeneratingVoice(false);
    }
  };





  // Stop audio playback
  const stopAudio = () => {
    if (currentlyPlayingRef?.current) {
      currentlyPlayingRef.current.pause();
      currentlyPlayingRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentlyPlayingRef(null);
    }
  };
  
  // Play the generated audio
  const playAudio = (ref: React.RefObject<HTMLAudioElement>) => {
    if (ref.current) {
      // If another audio is playing, stop it
      if (currentlyPlayingRef && currentlyPlayingRef !== ref && currentlyPlayingRef.current) {
        currentlyPlayingRef.current.pause();
        currentlyPlayingRef.current.currentTime = 0;
      }
      
      // If this audio is already playing, pause it
      if (isPlaying && currentlyPlayingRef === ref) {
        ref.current.pause();
        setIsPlaying(false);
        return;
      }
      
      // Play the audio
      ref.current.play();
      setIsPlaying(true);
      setCurrentlyPlayingRef(ref);
      
      // Set up event listener to reset playing state when audio ends
      ref.current.onended = () => {
        setIsPlaying(false);
        setCurrentlyPlayingRef(null);
      };
    }
  };
  
  // Helper function to get language name from ID
  const getLanguageName = (id: string) => {
    const language = LANGUAGES.find(lang => lang.id === id);
    return language ? `${language.flag} ${language.name}` : id;
  };

  // Helper function to get voice name from ID
  const getVoiceName = (id: string) => {
    const voice = ELEVEN_LABS_VOICES.find(voice => voice.id === id);
    return voice ? voice.name : id;
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Show confetti animation when challenge is completed */}
      {showConfetti && <Confetti active={showConfetti} />}
      
      <ChallengeHeader
        title="AI Voice Studio: Transform Text into Speech Instantly!"
        icon={<Mic className="h-6 w-6 text-orange-600" />}
        challengeId="challenge-7"
        isCompleted={isCompleted}
        setIsCompleted={setIsCompleted}
        onCompleteChallenge={markCompleted}
      />
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">AI Voice Generator</h2>
          <p className="text-gray-600 mb-6">
            Transform your text into natural-sounding speech with AI. Choose from different voices and languages to create the perfect audio for your content.
          </p>
          
          {/* Voice & Language Selection Section - First Step */}
          <div className="mb-8 border-b pb-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-indigo-800 flex items-center">
              <span className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-2 text-sm font-bold">1</span>
              Choose Voice & Language
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              {/* Voice Dropdown - Modern Style */}
              <div className="transform transition-all hover:scale-102">
                <label className="block text-sm font-medium text-indigo-700 mb-2">Select Voice</label>
                <div className="relative">
                  <button
                    type="button"
                    className="w-full bg-white border-2 border-indigo-300 rounded-lg py-3 px-4 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    onClick={() => setIsVoicesOpen(!isVoicesOpen)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-800">{getVoiceName(selectedVoice)}</span>
                      {isVoicesOpen ? (
                        <ChevronUp className="h-5 w-5 text-indigo-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-indigo-500" />
                      )}
                    </div>
                  </button>
                  
                  {isVoicesOpen && (
                    <div className="absolute z-[9999] mt-2 w-full bg-white shadow-xl rounded-lg py-2 text-base ring-1 ring-black ring-opacity-5 overflow-auto max-h-60 border border-indigo-100">
                      {ELEVEN_LABS_VOICES.map((voice) => (
                        <div
                          key={voice.id}
                          className={`cursor-pointer select-none relative py-3 pl-4 pr-9 hover:bg-indigo-50 transition-colors duration-150 ${selectedVoice === voice.id ? 'bg-indigo-100' : ''}`}
                          onClick={() => {
                            setSelectedVoice(voice.id);
                            setIsVoicesOpen(false);
                          }}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-800">{voice.name}</span>
                            <span className="text-xs text-gray-500">{voice.description}</span>
                          </div>
                          {selectedVoice === voice.id && (
                            <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                              <Check className="h-5 w-5 text-indigo-600" />
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Language Dropdown - Modern Style */}
              <div className="transform transition-all hover:scale-102">
                <label className="block text-sm font-medium text-indigo-700 mb-2">Select Language</label>
                <div className="relative">
                  <button
                    type="button"
                    className="w-full bg-white border-2 border-indigo-300 rounded-lg py-3 px-4 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    onClick={() => setIsLanguagesOpen(!isLanguagesOpen)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center font-medium text-gray-800">
                        <Globe className="h-4 w-4 mr-2 text-indigo-500" />
                        {getLanguageName(selectedLanguage)}
                      </span>
                      {isLanguagesOpen ? (
                        <ChevronUp className="h-5 w-5 text-indigo-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-indigo-500" />
                      )}
                    </div>
                  </button>
                  
                  {isLanguagesOpen && (
                    <div className="absolute z-[9999] mt-2 w-full bg-white shadow-xl rounded-lg py-2 text-base ring-1 ring-black ring-opacity-5 overflow-auto max-h-60 border border-indigo-100">
                      {LANGUAGES.map((language) => (
                        <div
                          key={language.id}
                          className={`cursor-pointer select-none relative py-3 pl-4 pr-9 hover:bg-indigo-50 transition-colors duration-150 ${selectedLanguage === language.id ? 'bg-indigo-100' : ''}`}
                          onClick={() => {
                            setSelectedLanguage(language.id);
                            setIsLanguagesOpen(false);
                          }}
                        >
                          <span className="font-medium text-gray-800">{language.flag} {language.name}</span>
                          {selectedLanguage === language.id && (
                            <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                              <Check className="h-5 w-5 text-indigo-600" />
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Script Generation Section */}
          <div className="mb-8 border-b pb-8 bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-purple-800 flex items-center">
              <span className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-2 text-sm font-bold">2</span>
              Create or Generate a Script
            </h3>
            <div className="flex flex-col space-y-5">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-grow">
                  <label htmlFor="scriptPrompt" className="block text-sm font-medium text-purple-700 mb-2">What should your script be about?</label>
                  <input
                    type="text"
                    id="scriptPrompt"
                    placeholder="E.g., An introduction to quantum computing in simple terms"
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    value={scriptPrompt}
                    onChange={(e) => setScriptPrompt(e.target.value)}
                  />
                </div>
                <div className="mt-auto">
                  <button
                    className="px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-all w-full lg:w-auto disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 duration-200 shadow-md"
                    onClick={generateScript}
                    disabled={isGeneratingScript || !scriptPrompt.trim() || selectedVoice === "default"}
                  >
                    {isGeneratingScript ? (
                      <>
                        <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-5 w-5 mr-2" />
                        Generate Script
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              <div>
                <label htmlFor="script" className="block text-sm font-medium text-purple-700 mb-2">Script Content</label>
                <textarea
                  id="script"
                  rows={5}
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                  placeholder="Enter your script here or generate one above..."
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                ></textarea>
              </div>
              
              <div className="flex justify-end">
                <button
                  className="px-5 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg flex items-center justify-center hover:from-blue-600 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 duration-200 shadow-md"
                  onClick={generateVoice}
                  disabled={isGeneratingVoice || !script.trim() || selectedVoice === "default"}
                >
                  {isGeneratingVoice ? (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      Generating Voice...
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-5 w-5 mr-2" />
                      Generate Voice
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          

          
          {/* Audio Player Section - Modern Design */}
          <div className="mb-8 border-b pb-8">
            <h3 className="text-xl font-semibold mb-4 text-teal-800 flex items-center">
              <span className="bg-teal-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-2 text-sm font-bold">3</span>
              Listen & Download
            </h3>
            
            {generatedAudioUrl ? (
              <div className="mb-4 p-5 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl shadow-sm border border-teal-100">
                <div className="flex flex-col md:flex-row items-center justify-between mb-3 gap-3">
                  <div className="flex items-center space-x-2 text-sm font-medium text-teal-700 bg-white px-3 py-2 rounded-lg shadow-sm">
                    <User className="h-4 w-4 text-teal-500 mr-1" />
                    <span>{getVoiceName(selectedVoice)}</span>
                    <span>•</span>
                    <Globe className="h-4 w-4 text-teal-500 mx-1" />
                    <span>{getLanguageName(selectedLanguage)}</span>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      className="p-3 bg-white text-teal-600 hover:text-teal-800 rounded-full shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                      onClick={() => playAudio(audioRef)}
                      title="Play/Pause"
                    >
                      {isPlaying && currentlyPlayingRef === audioRef ? (
                        <Square className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5" />
                      )}
                    </button>
                    <button
                      className="p-3 bg-white text-red-600 hover:text-red-800 rounded-full shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                      onClick={() => stopAudio()}
                      title="Stop"
                      disabled={!isPlaying}
                    >
                      <StopCircle className="h-5 w-5" />
                    </button>
                    <a
                      href={generatedAudioUrl}
                      download={`voice_${getVoiceName(selectedVoice).replace(/\s+/g, '_').toLowerCase()}.mp3`}
                      className="p-3 bg-white text-green-600 hover:text-green-800 rounded-full shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                      title="Download"
                    >
                      <Download className="h-5 w-5" />
                    </a>
                  </div>
                </div>
                <div className="w-full bg-white rounded-lg p-3 shadow-inner">
                  <div className="flex items-center justify-center">
                    <div className="w-full max-w-md">
                      <div className="h-3 bg-teal-100 rounded-full overflow-hidden">
                        {isPlaying && currentlyPlayingRef === audioRef && (
                          <div className="h-full bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full animate-pulse"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <audio ref={audioRef} src={generatedAudioUrl} className="hidden" />
                
                <div className="mt-4 pt-4 border-t border-teal-100 flex justify-center">
                  <button
                    className="flex items-center px-4 py-2 bg-white text-teal-600 hover:text-teal-800 border border-teal-200 rounded-lg shadow-sm hover:shadow transition-all"
                    onClick={generateAlternativeVoice}
                    disabled={isGeneratingVoice}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isGeneratingVoice ? 'animate-spin' : ''}`} />
                    Try with a different voice
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                <div className="text-center text-gray-500">
                  <Volume2 className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>Select a voice and generate audio to see it here</p>
                </div>
              </div>
            )}
              
              {generatedAudioUrlAlt && (
                <div className="p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-sm border border-purple-100">
                  <div className="flex flex-col md:flex-row items-center justify-between mb-3 gap-3">
                    <div className="flex items-center space-x-2 text-sm font-medium text-purple-700 bg-white px-3 py-2 rounded-lg shadow-sm">
                      <User className="h-4 w-4 text-purple-500 mr-1" />
                      <span>{getVoiceName(alternativeVoice)}</span>
                      <span className="px-1 py-0.5 text-xs rounded-full bg-purple-100 text-purple-600">Alternative</span>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        className="p-3 bg-white text-purple-600 hover:text-purple-800 rounded-full shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                        onClick={() => playAudio(audioRefAlt)}
                        title="Play/Pause"
                      >
                        {isPlaying && currentlyPlayingRef === audioRefAlt ? (
                          <Square className="h-5 w-5" />
                        ) : (
                          <Play className="h-5 w-5" />
                        )}
                      </button>
                      <button
                        className="p-3 bg-white text-red-600 hover:text-red-800 rounded-full shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                        onClick={() => stopAudio()}
                        title="Stop"
                        disabled={!isPlaying}
                      >
                        <StopCircle className="h-5 w-5" />
                      </button>
                      <a
                        href={generatedAudioUrlAlt}
                        download={`voice_alt_${getVoiceName(alternativeVoice).replace(/\s+/g, '_').toLowerCase()}.mp3`}
                        className="p-3 bg-white text-green-600 hover:text-green-800 rounded-full shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                        title="Download"
                      >
                        <Download className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                  <div className="w-full bg-white rounded-lg p-3 shadow-inner">
                    <div className="flex items-center justify-center">
                      <div className="w-full max-w-md">
                        <div className="h-3 bg-purple-100 rounded-full overflow-hidden">
                          {isPlaying && currentlyPlayingRef === audioRefAlt && (
                            <div className="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-pulse"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <audio ref={audioRefAlt} src={generatedAudioUrlAlt} className="hidden" />
                </div>
              )}
            </div>
          )
          

          
          {/* Error Display */}
          {error && (
            <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {completionMessage && (
        <div className="fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md animate-fade-in">
          {completionMessage}
        </div>
      )}
    </div>
  );
};

export default VoiceGeneratorMain;
