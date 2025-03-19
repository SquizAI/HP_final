import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { 
  getChallengeData, 
  saveChallengeData,
  useUserProgress,
  markChallengeAsCompleted
} from '../../../utils/userDataManager';
import { Tooltip } from 'react-tooltip';
import { getOpenAIKey, shouldUseMockData } from '../../../utils/envConfig';
import ChallengeHeader from '../../shared/ChallengeHeader';
import { Globe, Mic } from 'lucide-react';

// Add these type declarations at the top of the file or near other interface declarations
declare global {
  interface Window {
    webkitSpeechRecognition?: new () => SpeechRecognition;
    SpeechRecognition?: new () => SpeechRecognition;
    recognitionInstance?: SpeechRecognition;
    recordingInterval?: ReturnType<typeof setInterval>;
  }
}

// SpeechRecognition interface for TypeScript
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (event: Event) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: (event: Event) => void;
  start: () => void;
  stop: () => void;
}

// For the speech recognition result event
interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

// Main component for the AI Global Communicator challenge
const GlobalCommunicatorMain: React.FC<{ mode?: 'create' | 'view' }> = ({ mode = 'create' }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  
  // State for user progress
  const [userProgress, setUserProgress] = useUserProgress();
  const [isCompleted, setIsCompleted] = useState<boolean>(
    userProgress.completedChallenges.includes('challenge-5')
  );
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  
  // Status message for user feedback
  const [status, setStatus] = useState('');
  
  // Step state management
  const [currentStep, setCurrentStep] = useState<string>('language');
  const steps = ['language', 'input', 'translation', 'refinement', 'completion'];
  const stepTitles = ['Target Language', 'Message Creation', 'Translation', 'Refinement', 'Completion'];
  
  // Input method options
  const [inputMethod, setInputMethod] = useState<'text' | 'voice' | 'file'>('text');
  
  // User input states
  const [message, setMessage] = useState<string>('');
  const [context, setContext] = useState<string>('business-email');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [transcribedText, setTranscribedText] = useState<string>('');
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const [targetLanguage, setTargetLanguage] = useState<string>('Japanese');
  const [businessRegion, setBusinessRegion] = useState<string>('Asia-Pacific');
  const [formalityLevel, setFormalityLevel] = useState<string>('formal');
  const [preserveIdioms, setPreserveIdioms] = useState<boolean>(false);
  const [culturalNotes, setCulturalNotes] = useState<string>('');
  
  // Result states
  const [translation, setTranslation] = useState<string>('');
  const [adaptations, setAdaptations] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Animation and visual states
  const [showAITooltip, setShowAITooltip] = useState<boolean>(false);
  const [animateTranslation, setAnimateTranslation] = useState<boolean>(false);
  
  // ID for the current session
  const [sessionId] = useState<string>(uuidv4());
  
  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);
  
  // Fun messages for different steps
  const funMessages = {
    recording: [
      "Listening with AI ears that never need Q-tips!",
      "Voice recognition activated! No weird accents, please...",
      "AI microphone: Now with 50% less 'Excuse me, what?'",
      "Your words are being digitized faster than you can say 'digitize'!",
      "Converting sound waves to text... just like magic, but with math!"
    ],
    translating: [
      "Teaching our AI to speak Japanese without the awkward tourist accent...",
      "Converting your words into cultural masterpieces...",
      "Our AI is channeling its inner polyglot...",
      "Translating faster than your colleague who 'lived abroad for a semester'",
      "Cultural nuances being added with digital chopsticks..."
    ],
    refining: [
      "Making your message smoother than a jazz saxophone solo...",
      "Adding cultural polish that would make an ambassador jealous...",
      "Our AI is now wearing a digital bow tie for extra formality...",
      "Adjusting tone like a diplomatic DJ...",
      "Making your words fit in better than a tourist with a phrase book..."
    ]
  };
  
  // Get random fun message
  const getRandomFunMessage = (category: keyof typeof funMessages) => {
    const messages = funMessages[category];
    return messages[Math.floor(Math.random() * messages.length)];
  };
  
  // Mock language options - would be expanded in a full implementation
  const languageOptions = [
    'Japanese', 'Chinese (Simplified)', 'Chinese (Traditional)', 'Korean', 
    'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian',
    'Arabic', 'Hindi', 'Thai', 'Vietnamese', 'Dutch'
  ];
  
  // Mock business region options
  const regionOptions = [
    'North America', 'Europe', 'Asia-Pacific', 'Latin America', 
    'Middle East', 'Africa', 'South Asia', 'Australia/New Zealand'
  ];
  
  // Mock context options with fun descriptions
  const contextOptions = [
    { value: 'meeting-invitation', label: 'Meeting Invitation', description: 'Get people to actually show up, cross-culturally!' },
    { value: 'product-announcement', label: 'Product Announcement', description: 'Make your product sound amazing in any language' },
    { value: 'negotiation', label: 'Negotiation', description: "Haggle with cultural sensitivity (and without accidentally insulting anyone's ancestors)" },
    { value: 'customer-service', label: 'Customer Service', description: "Say \"we're sorry\" in ways that actually sound sincere globally" },
    { value: 'technical-documentation', label: 'Technical Documentation', description: 'Make technical jargon confusing in multiple languages!' }
  ];
  
  // Format recording time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Handle timer for recording
  useEffect(() => {
    if (isRecording) {
      recordingInterval.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
    }
    
    return () => {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
    };
  }, [isRecording]);
  
  // Tooltip animation timer
  useEffect(() => {
    const tooltipTimer = setTimeout(() => {
      setShowAITooltip(true);
    }, 1000);
    
    return () => clearTimeout(tooltipTimer);
  }, []);
  
  // Handle speech-to-text conversion
  const handleRecording = () => {
    // Toggle recording state
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      setRecordingTime(0);
      setTranscribedText('');
      
      // Use the browser's Speech Recognition API
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US'; // Default to English, this could be configurable
        
        recognition.onstart = () => {
          setIsRecording(true);
          // Start recording time counter
          const interval = setInterval(() => {
            setRecordingTime(prev => prev + 1);
          }, 1000);
          
          // Store interval ID for cleanup
          window.recordingInterval = interval;
        };
        
        recognition.onresult = (event) => {
          let interimTranscript = '';
          let finalTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' ';
            } else {
              interimTranscript += transcript;
            }
          }
          
          // Update with both final and interim results
          setTranscribedText(finalTranscript + interimTranscript);
          
          // Also update the main message state with the final transcript
          if (finalTranscript) {
            setMessage(finalTranscript);
          }
        };
        
        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setError(`Speech recognition failed: ${event.error}`);
          stopRecording(recognition);
        };
        
        recognition.onend = () => {
          stopRecording(recognition);
        };
        
        // Start recognition
        try {
          if (recognition) {
            recognition.start();
            // Store the recognition instance for stopping later
            window.recognitionInstance = recognition;
          }
        } catch (err) {
          console.error('Failed to start speech recognition:', err);
          setError('Failed to start speech recognition. Please try again or use text input.');
          setIsRecording(false);
        }
      } else {
        // Fallback for browsers without speech recognition support
        setError('Speech recognition is not supported in your browser. Please use text input instead.');
        setIsRecording(false);
      }
    } else {
      // Stop recording if it's already active
      if (window.recognitionInstance) {
        stopRecording(window.recognitionInstance);
      }
    }
  };
  
  // Helper function to stop recording
  const stopRecording = (recognition: SpeechRecognition | undefined) => {
    if (recognition) {
      recognition.stop();
    }
    
    // Clear the interval tracking recording time
    if (window.recordingInterval) {
      clearInterval(window.recordingInterval);
    }
    
    setIsRecording(false);
    setIsTranscribing(false);
  };
  
  // Handle file import for translation
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setLoading(true);
      
      // Simulate file processing with a delay
      setTimeout(() => {
        setMessage("This is imported text from a file that contains a business communication that needs to be translated. We're excited to explore potential partnership opportunities with your company.");
        setLoading(false);
      }, 1200);
    }
  };
  
  // Process translation with cultural adaptation
  const handleTranslation = async () => {
    if (!message.trim()) {
      setError('Please enter a message to translate');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Reset animation state
      setAnimateTranslation(false);
      
      // Check if we should use mock data
      if (shouldUseMockData()) {
        // Mock translation responses based on selected language
        if (targetLanguage === 'Japanese') {
          setTranslation('新プロジェクトのスケジュールについて話し合うため、来週会議を設定したいと思います。できるだけ早くご都合を教えていただければ幸いです。');
          setAdaptations([
            'Changed "as soon as possible" to a more polite Japanese expression',
            'Added honorific language appropriate for business context',
            'Removed direct request and used a more indirect approach',
            'Used formal grammatical structures common in Japanese business communication'
          ]);
        } else if (targetLanguage === 'French') {
          setTranslation('Nous aimerions organiser une réunion la semaine prochaine pour discuter du nouveau calendrier du projet. Je vous prie de bien vouloir me faire part de vos disponibilités dans les meilleurs délais.');
          setAdaptations([
            'Used more formal "vous" form instead of "tu"',
            'Added politeness phrases typical in French business context',
            'Adjusted tone to be more formal',
            'Changed direct request to a more elegant expression'
          ]);
        } else {
          // Default mock translation
          setTranslation(`This is a mock translation to ${targetLanguage} with cultural adaptations applied.`);
          setAdaptations([
            'Adjusted formality level to match target culture',
            'Modified direct speech patterns to suit cultural expectations',
            'Adapted time-sensitivity language to cultural norms',
            'Incorporated appropriate business etiquette phrases'
          ]);
        }
      } else {
        // Use real OpenAI API
        const apiKey = getOpenAIKey();
        
        if (!apiKey) {
          throw new Error('OpenAI API key not found. Please check your environment settings.');
        }
        
        // Prepare the prompt
        const prompt = `
Please translate the following ${context} from English to ${targetLanguage}.
Business region: ${businessRegion}
Formality level: ${formalityLevel}
Preserve idioms: ${preserveIdioms ? 'Yes' : 'No'}
Cultural notes: ${culturalNotes || 'None provided'}

Original text:
"${message}"

Please provide the translation and a list of cultural adaptations made.
`;

        // Call OpenAI API
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-2024-08-06',
            messages: [
              {
                role: 'system',
                content: `You are an expert translator specializing in business communications. You understand the cultural nuances and business etiquette of different regions.`
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.3,
            max_tokens: 1000
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`API error: ${errorData.error?.message || response.statusText}`);
        }
        
        const data = await response.json();
        const content = data.choices[0]?.message?.content;
        
        if (!content) {
          throw new Error('No content returned from API');
        }
        
        // Parse the response to extract translation and adaptations
        const translationMatch = content.match(/(?:Translation|Translated text):(.*?)(?:\n\n|\n[A-Z]|$)/si);
        const adaptationsMatch = content.match(/(?:Cultural adaptations|Adaptations):(.*?)(?:$)/si);
        
        if (translationMatch && translationMatch[1]) {
          setTranslation(translationMatch[1].trim());
        } else {
          // Fallback - use the whole response
          setTranslation(content.trim());
        }
        
        // Extract adaptations as array
        if (adaptationsMatch && adaptationsMatch[1]) {
          const adaptationText = adaptationsMatch[1].trim();
          const adaptationItems = adaptationText
            .split(/\n-|\n•|\n\d+\.|\n\*/)
            .map(item => item.trim())
            .filter(item => item.length > 0);
          
          setAdaptations(adaptationItems.length > 0 ? adaptationItems : [adaptationText]);
        } else {
          setAdaptations(['Translation completed successfully']);
        }
      }
      
      // Trigger animation for the translation appearing
      setTimeout(() => {
        setAnimateTranslation(true);
      }, 300);
      
      // Move to next step
      setCurrentStep('translation');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Error processing translation: ${errorMessage}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle refinement request
  const handleRefinement = async (refinementType: string) => {
    setLoading(true);
    
    try {
      // Check if we should use mock data
      if (shouldUseMockData()) {
        // Mock refinement logic
        if (refinementType === 'more-formal') {
          if (targetLanguage === 'Japanese') {
            setTranslation('新プロジェクトのスケジュールに関しまして協議させていただくため、来週会議の設定をご検討いただけますでしょうか。ご多忙中誠に恐縮ではございますが、ご都合をお知らせいただけますと大変ありがたく存じます。');
            setAdaptations([...adaptations, 'Increased level of formality with more honorific expressions']);
          } else {
            setTranslation(`[Refined for formality] ${translation}`);
            setAdaptations([...adaptations, 'Increased level of formality']);
          }
        } else if (refinementType === 'more-direct') {
          if (targetLanguage === 'Japanese') {
            setTranslation('来週、新プロジェクトスケジュールの会議を行います。できるだけ早く、あなたの都合の良い時間を教えてください。');
            setAdaptations([...adaptations, 'Made communication more direct with fewer honorific expressions']);
          } else {
            setTranslation(`[Refined for directness] ${translation}`);
            setAdaptations([...adaptations, 'Made communication more direct']);
          }
        } else if (refinementType === 'simpler') {
          if (targetLanguage === 'Japanese') {
            setTranslation('来週、プロジェクトについて話し合いたいです。いつが良いですか？');
            setAdaptations([...adaptations, 'Simplified language for easier understanding']);
          } else {
            setTranslation(`[Refined for simplicity] ${translation}`);
            setAdaptations([...adaptations, 'Simplified language for easier understanding']);
          }
        }
      } else {
        // Use real OpenAI API for refinement
        const apiKey = getOpenAIKey();
        
        if (!apiKey) {
          throw new Error('OpenAI API key not found. Please check your environment settings.');
        }
        
        // Determine refinement instruction based on type
        let refinementInstruction = '';
        
        switch (refinementType) {
          case 'more-formal':
            refinementInstruction = 'Make the translation more formal and polite, appropriate for high-level business communication.';
            break;
          case 'more-direct':
            refinementInstruction = 'Make the translation more direct and straightforward, while maintaining cultural appropriateness.';
            break;
          case 'simpler':
            refinementInstruction = 'Simplify the language used in the translation to make it easier to understand, while preserving the core message.';
            break;
          default:
            refinementInstruction = 'Refine the translation to improve quality and cultural appropriateness.';
        }
        
        // Prepare the prompt
        const prompt = `
Original message in English:
"${message}"

Current translation in ${targetLanguage}:
"${translation}"

Refinement needed: ${refinementInstruction}

Business region: ${businessRegion}
Formality level: ${refinementType === 'more-formal' ? 'very formal' : 
                  refinementType === 'more-direct' ? 'direct' : 
                  refinementType === 'simpler' ? 'simple' : formalityLevel}
Cultural notes: ${culturalNotes || 'None provided'}

Please provide the refined translation and explain what changes were made.
`;

        // Call OpenAI API
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-2024-08-06',
            messages: [
              {
                role: 'system',
                content: `You are an expert translator specializing in business communications and cultural adaptations. Your task is to refine the provided translation according to specific requirements.`
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.3,
            max_tokens: 1000
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`API error: ${errorData.error?.message || response.statusText}`);
        }
        
        const data = await response.json();
        const content = data.choices[0]?.message?.content;
        
        if (!content) {
          throw new Error('No content returned from API');
        }
        
        // Parse the response to extract refined translation and changes
        const translationMatch = content.match(/(?:Refined translation|Translation):(.*?)(?:\n\n|\n[A-Z]|$)/si);
        const changesMatch = content.match(/(?:Changes made|Explanation|What changed):(.*?)(?:$)/si);
        
        if (translationMatch && translationMatch[1]) {
          setTranslation(translationMatch[1].trim());
        } else {
          // Fallback - use the whole response
          setTranslation(content.trim());
        }
        
        // Extract explanation as adaptation
        if (changesMatch && changesMatch[1]) {
          const changesText = changesMatch[1].trim();
          setAdaptations([...adaptations, changesText]);
        } else {
          setAdaptations([...adaptations, `Refined for ${refinementType.replace('-', ' ')}`]);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Error refining translation: ${errorMessage}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Play translated audio
  const handlePlayAudio = () => {
    if (!translation.trim()) {
      setError('No translation to play');
      return;
    }
    
    // Use the browser's Speech Synthesis API
    if ('speechSynthesis' in window) {
      // Show visual feedback
      const audioFeedback = document.getElementById('audio-feedback');
      if (audioFeedback) {
        audioFeedback.classList.add('playing');
      }
      
      const utterance = new SpeechSynthesisUtterance(translation);
      
      // Set language based on target language
      switch (targetLanguage) {
        case 'Japanese':
          utterance.lang = 'ja-JP';
          break;
        case 'French':
          utterance.lang = 'fr-FR';
          break;
        case 'Spanish':
          utterance.lang = 'es-ES';
          break;
        case 'German':
          utterance.lang = 'de-DE';
          break;
        case 'Chinese':
          utterance.lang = 'zh-CN';
          break;
        default:
          utterance.lang = 'en-US';
      }
      
      // Set voice if available (this is more advanced and may need adjustment)
      window.speechSynthesis.onvoiceschanged = () => {
        const voices = window.speechSynthesis.getVoices();
        const voice = voices.find(v => v.lang.startsWith(utterance.lang));
        if (voice) {
          utterance.voice = voice;
        }
      };
      
      // Handle events
      utterance.onend = () => {
        if (audioFeedback) {
          audioFeedback.classList.remove('playing');
        }
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setError('Failed to play audio. Please try again.');
        if (audioFeedback) {
          audioFeedback.classList.remove('playing');
        }
      };
      
      // Speak the translation
      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback for browsers without speech synthesis
      setError('Text-to-speech is not supported in your browser.');
    }
  };
  
  // Function to save translation to local storage
  const saveTranslation = async () => {
    try {
      const translationData = {
        id: id || uuidv4(),
        date: new Date().toISOString(),
        message,
        translation,
        sourceLanguage: 'English', // Default source language
        targetLanguage,
        context,
        formality: formalityLevel,
        adaptations
      };
      
      // Get existing data
      const existingData = await getChallengeData('global-communicator') || {};
      const translations = existingData.translations || [];
      
      // Add or update translation
      const existingIndex = translations.findIndex((t: any) => t.id === translationData.id);
      if (existingIndex >= 0) {
        translations[existingIndex] = translationData;
      } else {
        translations.push(translationData);
      }
      
      // Save back to storage
      await saveChallengeData('global-communicator', {
        ...existingData,
        translations
      });
      
      // Set success message
      setStatus('Translation saved successfully!');
      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      console.error('Error saving translation:', error);
      setError('Failed to save translation.');
    }
  };

  // Function to load translation from local storage
  const loadTranslation = async (translationId: string) => {
    try {
      const data = await getChallengeData('global-communicator');
      if (data && data.translations) {
        const translation = data.translations.find((t: any) => t.id === translationId);
        if (translation) {
          setMessage(translation.message);
          setTranslation(translation.translation);
          setTargetLanguage(translation.targetLanguage);
          setContext(translation.context);
          setFormalityLevel(translation.formality);
          setAdaptations(translation.adaptations);
          setCurrentStep('completion'); // Jump to the completion screen
        } else {
          setError('Translation not found.');
          navigate('/challenge/global-communicator/library');
        }
      }
    } catch (error) {
      console.error('Error loading translation:', error);
      setError('Failed to load translation.');
    }
  };
  
  // Load translation if in view mode
  useEffect(() => {
    if (mode === 'view' && id) {
      loadTranslation(id);
    }
  }, [mode, id]);
  
  // Function to go to the library
  const goToLibrary = () => {
    navigate('/challenge/global-communicator/library');
  };
  
  // Modify handleCompletionStep to save translation
  const handleCompletionStep = () => {
    saveTranslation();
    setCurrentStep('completion');
  };
  
  // Modify handleLanguageSelected to save the state
  const handleLanguageSelected = () => {
    if (!targetLanguage) {
      setError('Please select a target language.');
      return;
    }
    setError('');
    setCurrentStep('language');
    handleTranslation();
  };
  
  // Render message input section (Step 1)
  const renderMessageInput = () => (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <span className="bg-indigo-100 text-indigo-800 p-2 rounded-full mr-3">1</span>
        Create Your Business Message
        <span 
          className="ml-2 cursor-help text-gray-400 hover:text-indigo-500"
          data-tooltip-id="message-tooltip"
          data-tooltip-content="First step: create or import your message. You can type, speak, or upload a file."
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
          </svg>
        </span>
      </h2>
      
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-700">Select Input Method</label>
          <div className="flex flex-wrap gap-3">
            <button
              className={`px-4 py-2 rounded-lg flex items-center ${
                inputMethod === 'text' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setInputMethod('text')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              Type Text
            </button>
            <button
              className={`px-4 py-2 rounded-lg flex items-center ${
                inputMethod === 'voice' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setInputMethod('voice')}
              data-tooltip-id="voice-tooltip"
              data-tooltip-content="Our AI uses DeepGram's advanced speech recognition to transcribe your speech instantly."
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
              </svg>
              Voice Input
              <div className="ml-1 text-yellow-300">✨</div>
            </button>
            <button
              className={`px-4 py-2 rounded-lg flex items-center ${
                inputMethod === 'file' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setInputMethod('file')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              Import File
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-700">Business Context</label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={context}
            onChange={(e) => setContext(e.target.value)}
          >
            {contextOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          {/* Show fun description for selected context */}
          {contextOptions.find(opt => opt.value === context)?.description && (
            <p className="mt-2 text-sm italic text-gray-600">
              {contextOptions.find(opt => opt.value === context)?.description}
            </p>
          )}
        </div>
        
        {inputMethod === 'text' && (
          <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-700">Enter Your Business Message</label>
            <textarea
              className="w-full p-4 border border-gray-300 rounded-lg h-40 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your business message here... Be as formal or casual as needed for your context."
            />
          </div>
        )}
        
        {inputMethod === 'voice' && (
          <div className="mb-6">
            <div className="text-center bg-gray-50 p-6 rounded-lg border border-gray-100">
              <div 
                className={`mx-auto mb-4 p-4 rounded-full cursor-pointer shadow-md transition-all ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse scale-110' 
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
                style={{ width: '80px', height: '80px' }}
                onClick={handleRecording}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-full h-full">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                </svg>
              </div>
              
              <p className="text-lg font-medium">
                {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
              </p>
              
              {isRecording && (
                <div className="mt-2 text-sm text-red-500 font-mono">
                  Recording: {formatTime(recordingTime)}
                </div>
              )}
              
              {isRecording && (
                <div className="mt-3 text-sm text-gray-600 italic animate-pulse">
                  {getRandomFunMessage('recording')}
                </div>
              )}
              
              {isTranscribing && (
                <div className="mt-6">
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <div className="w-4 h-4 rounded-full bg-indigo-600 animate-pulse"></div>
                    <div className="w-4 h-4 rounded-full bg-indigo-600 animate-pulse delay-300"></div>
                    <div className="w-4 h-4 rounded-full bg-indigo-600 animate-pulse delay-600"></div>
                  </div>
                  <p className="text-sm text-gray-700 font-medium">Transcribing with DeepGram AI...</p>
                </div>
              )}
              
              {/* Live transcription display */}
              {transcribedText && (
                <div className="mt-6 text-left">
                  <p className="font-medium text-gray-700 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-indigo-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                    </svg>
                    Transcribed Text:
                  </p>
                  <div className="p-4 bg-white border border-indigo-100 rounded-lg shadow-sm">
                    <p className="text-gray-800">{transcribedText}<span className="animate-pulse">|</span></p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {inputMethod === 'file' && (
          <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-700">Import File</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-gray-400 mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              
              <input
                type="file"
                className="hidden"
                accept=".txt,.doc,.docx,.pdf"
                onChange={handleFileImport}
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="mt-2 block font-medium text-indigo-600">Click to upload</span>
                <span className="mt-1 block text-sm text-gray-500">
                  or drag and drop
                </span>
                <span className="mt-1 block text-xs text-gray-500">
                  TXT, DOC, DOCX, PDF up to 10MB
                </span>
              </label>
            </div>
            
            {loading && (
              <div className="mt-4 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-600 animate-pulse"></div>
                  <div className="w-3 h-3 rounded-full bg-indigo-600 animate-pulse delay-300"></div>
                  <div className="w-3 h-3 rounded-full bg-indigo-600 animate-pulse delay-600"></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">Reading file content...</p>
              </div>
            )}
            
            {message && (
              <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="font-medium text-gray-700 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-indigo-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  Imported Text:
                </p>
                <p className="text-gray-700">{message}</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="flex justify-between">
        <div className="text-sm text-gray-500 italic pt-2">
          💡 Tip: The clearer your original message, the better the translation will be!
        </div>
        <button
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors flex items-center space-x-2"
          onClick={() => {
            if (message.trim()) {
              setCurrentStep('language');
            } else {
              setError('Please enter a message to translate');
            }
          }}
        >
          <span>Next: Select Target Language</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </div>
      
      {/* Tooltips */}
      <Tooltip id="message-tooltip" place="top" className="tooltip" />
      <Tooltip id="voice-tooltip" place="top" className="tooltip" />
    </div>
  );
  
  // Render language selection section (Step 2)
  const renderLanguageSelection = () => (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <span className="bg-indigo-100 text-indigo-800 p-2 rounded-full mr-3">2</span>
        Select Target Language & Culture
        <span 
          className="ml-2 cursor-help text-gray-400 hover:text-indigo-500"
          data-tooltip-id="language-tooltip"
          data-tooltip-content="Choose the language and cultural context for translation."
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
          </svg>
        </span>
      </h2>
      
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-700">Target Language</label>
            <div className="relative">
              <select
                className="w-full p-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pl-10"
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                data-tooltip-id="ai-translation-tooltip"
                data-tooltip-content="Our AI model supports 100+ languages with native-level fluency"
              >
                {languageOptions.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-xl">🌐</span>
              </div>
            </div>
            
            <div className="mt-2 text-sm text-indigo-600 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1">
                <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.75.75v1.506a49.38 49.38 0 015.343.371.75.75 0 11-.186 1.489c-.66-.083-1.323-.151-1.99-.206a18.67 18.67 0 01-2.969 6.323c.317.384.65.753.998 1.107a.75.75 0 11-1.07 1.052A18.902 18.902 0 019 13.687a18.823 18.823 0 01-5.656 4.482.75.75 0 11-.688-1.333 17.323 17.323 0 005.396-4.353A18.72 18.72 0 015.89 8.598a.75.75 0 011.388-.568A17.21 17.21 0 009 11.224a17.17 17.17 0 002.391-5.165 48.038 48.038 0 00-8.298.307.75.75 0 01-.186-1.489 49.159 49.159 0 015.343-.371V3A.75.75 0 019 2.25zM15.75 9a.75.75 0 01.68.433l5.25 11.25a.75.75 0 01-1.36.634l-1.198-2.567h-6.744l-1.198 2.567a.75.75 0 01-1.36-.634l5.25-11.25A.75.75 0 0115.75 9zm-2.672 8.25h5.344l-2.672-5.726-2.672 5.726z" clipRule="evenodd" />
              </svg>
              GPT-4o optimized for {targetLanguage}
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-700">Business Region</label>
            <div className="relative">
              <select
                className="w-full p-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pl-10"
                value={businessRegion}
                onChange={(e) => setBusinessRegion(e.target.value)}
              >
                {regionOptions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-xl">🏢</span>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500 italic">
              Business customs and language vary widely within regions
            </p>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-700">Formality Level</label>
          <div className="flex flex-wrap gap-3">
            <button
              className={`px-4 py-2 rounded-lg flex items-center ${
                formalityLevel === 'formal' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setFormalityLevel('formal')}
              data-tooltip-id="formal-tooltip"
              data-tooltip-content="Highly respectful language suitable for important business communications"
            >
              <span className="mr-2">🎩</span>
              Formal
            </button>
            <button
              className={`px-4 py-2 rounded-lg flex items-center ${
                formalityLevel === 'semi-formal' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setFormalityLevel('semi-formal')}
            >
              <span className="mr-2">👔</span>
              Semi-Formal
            </button>
            <button
              className={`px-4 py-2 rounded-lg flex items-center ${
                formalityLevel === 'casual' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setFormalityLevel('casual')}
            >
              <span className="mr-2">👕</span>
              Casual
            </button>
          </div>
          
          <div className="mt-4 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
            <p className="text-sm text-yellow-800 flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 flex-shrink-0 text-yellow-600">
                <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
              </svg>
              <span>
                <strong>Cultural Tip:</strong> In {targetLanguage}, business communication tends to be more {
                  targetLanguage === 'Japanese' || targetLanguage === 'Korean' ? 'formal and hierarchical' :
                  targetLanguage.includes('Chinese') ? 'relationship-focused and status-conscious' :
                  targetLanguage === 'German' ? 'direct and structured' :
                  targetLanguage === 'French' ? 'formal with implicit communication' :
                  'varied based on specific cultural norms'
                } than in English.
              </span>
            </p>
          </div>
        </div>
        
        <div className="mb-8">
          <label className="flex items-center justify-between">
            <span className="font-medium text-gray-700">Advanced Settings</span>
            <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
              AI-Powered
            </span>
          </label>
          <div className="p-4 bg-gray-50 rounded-md mt-2 border border-gray-200">
            <div className="mb-4">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out rounded"
                  checked={preserveIdioms}
                  onChange={(e) => setPreserveIdioms(e.target.checked)}
                />
                <span className="ml-2 text-gray-700">Preserve idioms where possible</span>
              </label>
              <p className="ml-7 text-xs text-gray-500 italic">When checked, our AI will attempt to find equivalent expressions in the target language</p>
            </div>
            
            <div>
              <label className="block mb-2 text-gray-700">Cultural Adaptation Notes (Optional)</label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md h-24 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={culturalNotes}
                onChange={(e) => setCulturalNotes(e.target.value)}
                placeholder="Add any specific cultural context or notes for the AI to consider..."
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
          onClick={() => setCurrentStep('input')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back
        </button>
        <button
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors flex items-center"
          onClick={handleTranslation}
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="mr-2 animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>Translate & Adapt</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </>
          )}
        </button>
      </div>
      
      {/* Tooltips */}
      <Tooltip id="language-tooltip" place="top" className="tooltip z-50 max-w-sm" />
      <Tooltip id="ai-translation-tooltip" place="top" className="tooltip z-50 max-w-sm" />
      <Tooltip id="formal-tooltip" place="top" className="tooltip z-50 max-w-sm" />
    </div>
  );
  
  // Render translation results (Step 3)
  const renderTranslationResults = () => (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <span className="bg-indigo-100 text-indigo-800 p-2 rounded-full mr-3">3</span>
        Translation & Cultural Adaptation
        <span 
          className="ml-2 cursor-help text-gray-400 hover:text-indigo-500"
          data-tooltip-id="translation-tooltip"
          data-tooltip-content="Review your AI-powered translation with cultural adaptations."
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
          </svg>
        </span>
      </h2>
      
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
        <div className="mb-4 text-center">
          <div className="inline-block px-3 py-1 text-sm bg-indigo-50 text-indigo-700 rounded-full">
            Powered by GPT-4o
          </div>
          <p className="mt-2 text-gray-500 text-sm italic">{getRandomFunMessage('translating')}</p>
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-gray-600">
                <path fillRule="evenodd" d="M9 2.25a.75.75 0 01.75.75v1.506a49.38 49.38 0 015.343.371.75.75 0 11-.186 1.489c-.66-.083-1.323-.151-1.99-.206a18.67 18.67 0 01-2.969 6.323c.317.384.65.753.998 1.107a.75.75 0 11-1.07 1.052A18.902 18.902 0 019 13.687a18.823 18.823 0 01-5.656 4.482.75.75 0 11-.688-1.333 17.323 17.323 0 005.396-4.353A18.72 18.72 0 015.89 8.598a.75.75 0 011.388-.568A17.21 17.21 0 009 11.224a17.17 17.17 0 002.391-5.165 48.038 48.038 0 00-8.298.307.75.75 0 01-.186-1.489 49.159 49.159 0 015.343-.371V3A.75.75 0 019 2.25zM15.75 9a.75.75 0 01.68.433l5.25 11.25a.75.75 0 01-1.36.634l-1.198-2.567h-6.744l-1.198 2.567a.75.75 0 01-1.36-.634l5.25-11.25A.75.75 0 0115.75 9zm-2.672 8.25h5.344l-2.672-5.726-2.672 5.726z" clipRule="evenodd" />
              </svg>
              Original Message (English)
            </h3>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-inner min-h-32">
              <p className="text-gray-800 whitespace-pre-wrap">{message}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-indigo-600">
                <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625z" />
                <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
              </svg>
              {targetLanguage} Translation
              <button
                onClick={handlePlayAudio}
                className="ml-2 text-indigo-600 bg-indigo-50 p-1 rounded-full hover:bg-indigo-100 transition-colors"
                title="Listen to translation"
                data-tooltip-id="audio-tooltip"
                data-tooltip-content="Listen to a native-quality pronunciation"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
                </svg>
              </button>
            </h3>
            <div 
              className={`p-4 bg-indigo-50 rounded-lg border border-indigo-100 shadow-inner min-h-32 transition-opacity duration-500 ${
                animateTranslation ? 'opacity-100' : 'opacity-0'
              }`}
              id="audio-feedback"
            >
              <p className="text-gray-800 whitespace-pre-wrap">{translation}</p>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-amber-600">
              <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5z" clipRule="evenodd" />
            </svg>
            Cultural Adaptations
            <span 
              className="ml-2 cursor-help text-gray-400 hover:text-amber-500"
              data-tooltip-id="cultural-tooltip"
              data-tooltip-content="These are the cultural adaptations our AI made to ensure your message is appropriate for the target culture."
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
            </span>
          </h3>
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
            <ul className="space-y-2">
              {adaptations.map((adaptation, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2 text-amber-600 mt-0.5">✓</span>
                  <span className="text-gray-800">{adaptation}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-blue-600 flex-shrink-0 mt-0.5">
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-blue-800">
            <strong>Did you know?</strong> {
              targetLanguage === 'Japanese' ? "Japanese business culture highly values indirect communication and honorifics. Direct requests are often seen as impolite." :
              targetLanguage === 'French' ? "French business communication typically uses more formal language than English, with careful attention to grammar and politeness markers." :
              targetLanguage.includes('Chinese') ? "Chinese business communication emphasizes respect, hierarchy and saving face. Building relationships (关系, guānxi) is essential." :
              "Cultural norms significantly impact how your message is received. Our AI adapts your content for maximum effectiveness."
            }
          </p>
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
          onClick={() => setCurrentStep('input')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back
        </button>
        <button
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors flex items-center"
          onClick={() => setCurrentStep('refinement')}
        >
          <span>Refine Translation</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </div>
      
      {/* Tooltips */}
      <Tooltip id="translation-tooltip" place="top" className="tooltip z-50" />
      <Tooltip id="audio-tooltip" place="top" className="tooltip z-50" />
      <Tooltip id="cultural-tooltip" place="top" className="tooltip z-50" />
    </div>
  );
  
  // Render refinement options (Step 4)
  const renderRefinementOptions = () => (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Refine Your Translation</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Original Message</h3>
          <div className="p-4 bg-gray-50 rounded-md min-h-32">
            {message}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">
            {targetLanguage} Translation
            <button
              onClick={handlePlayAudio}
              className="ml-2 text-blue-600 text-sm"
              title="Listen to translation"
            >
              🔊 Listen
            </button>
          </h3>
          <div className="p-4 bg-blue-50 rounded-md min-h-32">
            {translation}
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Refinement Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            className="p-4 border rounded-md hover:bg-blue-50"
            onClick={() => handleRefinement('more-formal')}
            disabled={loading}
          >
            <div className="text-xl mb-2">🧐</div>
            <h4 className="font-medium mb-1">More Formal</h4>
            <p className="text-sm text-gray-600">Increase politeness and formality level</p>
          </button>
          
          <button
            className="p-4 border rounded-md hover:bg-blue-50"
            onClick={() => handleRefinement('more-direct')}
            disabled={loading}
          >
            <div className="text-xl mb-2">⚡️</div>
            <h4 className="font-medium mb-1">More Direct</h4>
            <p className="text-sm text-gray-600">Make the message more straightforward</p>
          </button>
          
          <button
            className="p-4 border rounded-md hover:bg-blue-50"
            onClick={() => handleRefinement('simpler')}
            disabled={loading}
          >
            <div className="text-xl mb-2">🔄</div>
            <h4 className="font-medium mb-1">Simplify</h4>
            <p className="text-sm text-gray-600">Use simpler language for clarity</p>
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Cultural Adaptations</h3>
        <div className="p-4 bg-yellow-50 rounded-md">
          <ul className="list-disc pl-5">
            {adaptations.map((adaptation, index) => (
              <li key={index} className="mb-1">{adaptation}</li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="flex justify-between mt-8">
        <button
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700"
          onClick={() => setCurrentStep('translation')}
        >
          Back
        </button>
        
        <button
          className="px-6 py-2 bg-green-600 text-white rounded-md"
          onClick={handleCompletionStep}
          disabled={loading}
        >
          Complete Translation
        </button>
      </div>
    </div>
  );
  
  // Render completion screen (Step 5)
  const renderCompletionScreen = () => (
    <div className="mb-8">
      <div className="mb-8 text-center">
        <div className="inline-flex flex-col items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4 animate-bounce-short">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
              <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">Translation Complete!</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Your culturally-adapted message is ready to use. You've crossed language barriers like a digital diplomat!
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 max-w-4xl mx-auto border border-gray-100">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800">Translation Summary</h3>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
              Powered by AI
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              Saved ✓
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <div className="flex items-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-gray-600">
                <path fillRule="evenodd" d="M9 2.25a.75.75 0 01.75.75v1.506a49.38 49.38 0 015.343.371.75.75 0 11-.186 1.489c-.66-.083-1.323-.151-1.99-.206a18.67 18.67 0 01-2.969 6.323c.317.384.65.753.998 1.107a.75.75 0 11-1.07 1.052A18.902 18.902 0 019 13.687a18.823 18.823 0 01-5.656 4.482.75.75 0 11-.688-1.333 17.323 17.323 0 005.396-4.353A18.72 18.72 0 015.89 8.598a.75.75 0 011.388-.568A17.21 17.21 0 009 11.224a17.17 17.17 0 002.391-5.165 48.038 48.038 0 00-8.298.307.75.75 0 01-.186-1.489 49.159 49.159 0 015.343-.371V3A.75.75 0 019 2.25zM15.75 9a.75.75 0 01.68.433l5.25 11.25a.75.75 0 01-1.36.634l-1.198-2.567h-6.744l-1.198 2.567a.75.75 0 01-1.36-.634l5.25-11.25A.75.75 0 0115.75 9zm-2.672 8.25h5.344l-2.672-5.726-2.672 5.726z" clipRule="evenodd" />
              </svg>
              <h4 className="font-semibold text-lg">Source</h4>
            </div>
            
            <div className="pl-7 space-y-4">
              <div>
                <p className="text-sm text-gray-500">Language:</p>
                <p className="font-medium">English</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Business Context:</p>
                <p className="font-medium">{contextOptions.find(opt => opt.value === context)?.label || context}</p>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-indigo-600">
                <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625z" />
                <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
              </svg>
              <h4 className="font-semibold text-lg">Target</h4>
            </div>
            
            <div className="pl-7 space-y-4">
              <div>
                <p className="text-sm text-gray-500">Language:</p>
                <p className="font-medium">{targetLanguage}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Formality Level:</p>
                <p className="font-medium capitalize">{formalityLevel}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h4 className="font-medium text-gray-700 mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
              Original Message:
            </h4>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 min-h-32">
              <p className="text-gray-800 text-sm whitespace-pre-wrap">{message}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
              </svg>
              Translation:
              <button
                onClick={handlePlayAudio}
                className="ml-2 text-indigo-600 bg-indigo-50 p-1 rounded-full hover:bg-indigo-100 transition-colors"
                title="Listen to translation"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
                </svg>
              </button>
            </h4>
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200 min-h-32">
              <p className="text-gray-800 text-sm whitespace-pre-wrap">{translation}</p>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-700 mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-amber-600">
              <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5z" clipRule="evenodd" />
            </svg>
            Cultural Adaptations:
          </h4>
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
            <div className="flex flex-wrap gap-2">
              {adaptations.map((adaptation, index) => (
                <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-amber-100 text-amber-800">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1">
                    <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                  {adaptation}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4">
        <button
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors flex items-center justify-center"
          onClick={() => navigate('/challenge/global-communicator/new')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Create New Translation
        </button>
        
        <button
          className="px-6 py-3 bg-white border border-indigo-300 text-indigo-600 rounded-lg shadow-sm hover:bg-indigo-50 transition-colors flex items-center justify-center"
          onClick={goToLibrary}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
          View Your Translations
        </button>
      </div>
      
      <div className="text-center">
        <button
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg shadow-md hover:from-green-600 hover:to-teal-600 transition-colors flex items-center justify-center mx-auto"
          onClick={() => navigate('/')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
          </svg>
          Try Other AI Challenges
        </button>
      </div>
    </div>
  );
  
  // Render step navigation
  const renderStepNavigation = () => (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className={`flex flex-col items-center ${index + 1 <= steps.indexOf(currentStep) ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                index + 1 === steps.indexOf(currentStep) 
                  ? 'bg-blue-600 text-white' 
                  : index + 1 < steps.indexOf(currentStep) 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-200 text-gray-400'
              }`}
            >
              {index + 1 < steps.indexOf(currentStep) ? '✓' : index + 1}
            </div>
            <span className="text-sm hidden md:block">{stepTitles[index]}</span>
          </div>
        ))}
      </div>
      <div className="relative mt-2">
        <div className="absolute top-0 left-4 right-4 h-1 bg-gray-200"></div>
        <div 
          className="absolute top-0 left-4 h-1 bg-blue-600" 
          style={{ width: `${((steps.indexOf(currentStep) - 1) / (steps.length - 1)) * 100}%` }}
        ></div>
      </div>
    </div>
  );
  
  // Check if challenge is already completed on mount
  useEffect(() => {
    if (userProgress.completedChallenges.includes('challenge-5')) {
      setIsCompleted(true);
    }
  }, [userProgress]);
  
  // Handle completing the challenge
  const handleCompleteChallenge = () => {
    if (!translatedText || translatedText.length < 10) {
      alert('Please complete a translation before finishing the challenge.');
      return;
    }
    
    markChallengeAsCompleted('challenge-5');
    setIsCompleted(true);
    
    // Show confetti
    setShowConfetti(true);
    
    // Hide confetti after 5 seconds
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
    
    // Save translation if not saved already
    if (!savedState) {
      saveTranslation();
    }
  };
  
  return (
    <div className="container mx-auto px-4 pb-16 max-w-5xl">
      <ChallengeHeader
        title="Global Communicator Challenge"
        icon={<Globe className="h-6 w-6 text-blue-600" />}
        challengeId="challenge-5"
        isCompleted={isCompleted}
        setIsCompleted={setIsCompleted}
        showConfetti={showConfetti}
        setShowConfetti={setShowConfetti}
        onCompleteChallenge={handleCompleteChallenge}
        isHPChallenge={true}
      />
      
      {/* Main content */}
      <div className="bg-white shadow-md rounded-lg p-6">
        {currentStep === 'language' && renderLanguageSelection()}
        {currentStep === 'input' && renderMessageInput()}
        {currentStep === 'translation' && renderTranslationResults()}
        {currentStep === 'refinement' && renderRefinementOptions()}
        {currentStep === 'completion' && renderCompletionScreen()}
        
        {/* Step Navigation */}
        {renderStepNavigation()}
      </div>
      
      {/* Tooltips */}
      <Tooltip id="global-tooltip" className="z-50" />
    </div>
  );
};

export default GlobalCommunicatorMain; 