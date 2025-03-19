import React, { useState, useEffect, useRef } from 'react';
import { useUserProgress, markChallengeAsCompleted } from '../../../utils/userDataManager';
import ChallengeHeader from '../../shared/ChallengeHeader';
import { AlertCircle, CheckCircle, Mic, SparklesIcon, ListIcon, ClipboardListIcon, ShoppingBagIcon, FileTextIcon } from 'lucide-react';
import axios from 'axios';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { TranscriptionComparison } from './components';
import { getApiKey } from '../../../services/openai';
import { getDeepgramConfig } from '../../../services/apiConfig';

// Main component
const DictationWizardMain: React.FC = () => {
  // User progress tracking
  const [userProgress, setUserProgress] = useUserProgress();
  const [completionMessage, setCompletionMessage] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(
    userProgress.completedChallenges.includes('challenge-dictation-wizard')
  );
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  
  // State for managing the dictation flow
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [editableTranscription, setEditableTranscription] = useState<string>('');
  const [analysis, setAnalysis] = useState<string>('');
  const [formattedContent, setFormattedContent] = useState<string>('');
  const [contentType, setContentType] = useState<'default' | 'tasks' | 'grocery' | 'notes'>('default');
  const [error, setError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  
  // Audio visualization
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const microphone = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameId = useRef<number | null>(null);
  
  // Web Speech Recognition setup
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition();
  
  // Update editable transcription as the user speaks
  useEffect(() => {
    if (transcript) {
      setEditableTranscription(transcript);
    }
  }, [transcript]);
  
  // Check if challenge is already completed
  useEffect(() => {
    if (userProgress.completedChallenges.includes('challenge-dictation-wizard')) {
      setIsCompleted(true);
    }
  }, [userProgress]);
  
  // Setup audio visualization when listening starts/stops
  useEffect(() => {
    if (listening) {
      setupAudioVisualization();
    } else {
      stopAudioVisualization();
    }
    
    return () => {
      stopAudioVisualization();
    };
  }, [listening]);
  
  // Add ref for audio stream
  const audioStream = useRef<MediaStream | null>(null);
  
  // State to track if user explicitly stopped recording
  const [userCancelled, setUserCancelled] = useState<boolean>(false);
  
  // Handle starting/stopping dictation
  const toggleListening = () => {
    if (listening) {
      // Stop listening first
      SpeechRecognition.stopListening();
      stopAudioVisualization();
      
      // Add a small delay to ensure everything is stopped
      setTimeout(() => {
        // Reset the cancel flag to avoid analyzing empty content
        setUserCancelled(true);
        
        console.log("Stopped listening and analyzing");
        
        // Only analyze if we have content and user didn't explicitly cancel
        if (transcript.trim() && !userCancelled) {
          analyzeTranscription(transcript);
        }
      }, 100);
    } else {
      // Request permission explicitly before starting
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          // Stop the stream immediately - we just needed the permission
          stream.getTracks().forEach(track => track.stop());
          
          // Now start the recording process
          resetTranscript();
          setAnalysis('');
          setFormattedContent('');
          setContentType('default');
          setUserCancelled(false); // Reset cancellation state
          
          // Start listening
          SpeechRecognition.startListening({ continuous: true });
        })
        .catch(err => {
          console.error("Microphone permission error:", err);
          alert("Please allow microphone access to use the dictation feature.");
        });
    }
  };
  
  // Setup audio visualization with improved frequency band analysis
  const setupAudioVisualization = async () => {
    try {
      // Check if the browser supports the required APIs
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.warn("Media devices API not supported in this browser");
      return;
    }
    
      // Create audio context if it doesn't exist or resume it if suspended
      if (!audioContext.current) {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) {
          console.warn("AudioContext not supported in this browser");
          return;
        }
        audioContext.current = new AudioContext();
      } else if (audioContext.current.state === 'suspended') {
        await audioContext.current.resume();
      }
      
      // Request microphone access with clear constraints
      const constraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      };
      
      console.log("Attempting to access microphone...");
      
      // Force the permission dialog to appear before proceeding
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log("Microphone access granted");
        
        if (audioContext.current) {
          // Clean up any existing audio nodes
          if (microphone.current) {
            microphone.current.disconnect();
            microphone.current = null;
          }
          
          if (analyser.current) {
            analyser.current.disconnect();
            analyser.current = null;
          }
          
          // Create new audio sources and analyzer
          microphone.current = audioContext.current.createMediaStreamSource(stream);
          analyser.current = audioContext.current.createAnalyser();
          analyser.current.fftSize = 256; // Higher resolution for better frequency analysis
          analyser.current.smoothingTimeConstant = 0.4; // Balance between responsiveness and smoothness
          
          microphone.current.connect(analyser.current);
          
          // Store stream for later cleanup
          audioStream.current = stream;
          
          // Initialize the frequency band levels state
          setFrequencyBands({
            low: 0,
            mid: 0,
            high: 0
          });
          
          const updateAudioLevel = () => {
            if (analyser.current && listening) {
              const frequencyData = new Uint8Array(analyser.current.frequencyBinCount);
              analyser.current.getByteFrequencyData(frequencyData);
              
              // Define frequency bands (approximate for human voice)
              // Low: ~85-255Hz (bass/low voice)
              // Mid: ~256-2000Hz (main speech frequencies)
              // High: ~2001-8000Hz (consonants/sibilance)
              
              const binCount = frequencyData.length;
              const sampleRate = audioContext.current?.sampleRate || 44100;
              const binWidth = sampleRate / (analyser.current.fftSize * 2);
              
              // Calculate indices for each frequency band
              const lowBandStart = Math.floor(85 / binWidth);
              const lowBandEnd = Math.floor(255 / binWidth);
              
              const midBandStart = lowBandEnd + 1;
              const midBandEnd = Math.floor(2000 / binWidth);
              
              const highBandStart = midBandEnd + 1;
              const highBandEnd = Math.floor(8000 / binWidth);
              
              // Calculate energy in each band
              let lowSum = 0, midSum = 0, highSum = 0;
              let lowCount = 0, midCount = 0, highCount = 0;
              
              for (let i = 0; i < binCount; i++) {
                const value = frequencyData[i];
                
                if (i >= lowBandStart && i <= lowBandEnd) {
                  // Low frequencies (apply higher weight for balance)
                  lowSum += value * 1.5;
                  lowCount++;
                } else if (i >= midBandStart && i <= midBandEnd) {
                  // Mid frequencies (main speech)
                  midSum += value * 1.2;
                  midCount++;
                } else if (i >= highBandStart && i <= highBandEnd) {
                  // High frequencies
                  highSum += value;
                  highCount++;
                }
              }
              
              // Normalize and apply non-linear scaling for better visualization
              const normalizedLow = Math.pow((lowCount > 0 ? lowSum / (lowCount * 255) : 0), 0.7);
              const normalizedMid = Math.pow((midCount > 0 ? midSum / (midCount * 255) : 0), 0.7);
              const normalizedHigh = Math.pow((highCount > 0 ? highSum / (highCount * 255) : 0), 0.7);
              
              // Smooth transitions for the bands
              setFrequencyBands(prev => ({
                low: prev.low * 0.7 + normalizedLow * 0.3,
                mid: prev.mid * 0.5 + normalizedMid * 0.5, // More responsive for mid-range
                high: prev.high * 0.6 + normalizedHigh * 0.4
              }));
              
              // Overall audio level (weighted combination) for backward compatibility
              const combinedLevel = normalizedLow * 0.2 + normalizedMid * 0.6 + normalizedHigh * 0.2;
              
              setAudioLevel(prevLevel => {
                if (combinedLevel > prevLevel) {
                  return prevLevel * 0.3 + combinedLevel * 0.7; // Fast rise
                } else {
                  return prevLevel * 0.8 + combinedLevel * 0.2; // Slower fall
                }
              });
              
              animationFrameId.current = requestAnimationFrame(updateAudioLevel);
            }
          };
          
          updateAudioLevel();
        }
      } catch (err) {
        console.error('Error setting up audio visualization:', err);
        
        // Give better feedback to the user for common error cases
        if (err instanceof DOMException) {
          if (err.name === 'NotFoundError') {
            alert('No microphone detected. Please connect a microphone and try again.');
          } else if (err.name === 'NotAllowedError') {
            alert('Microphone access denied. Please allow microphone access in your browser settings and try again.');
          } else if (err.name === 'AbortError') {
            console.log('Microphone access request was aborted');
          }
        }
      }
    } catch (err) {
      console.error('General error in audio setup:', err);
    }
  };
  
  // Stop audio visualization - improved cleanup
  const stopAudioVisualization = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    
    if (microphone.current) {
      microphone.current.disconnect();
      microphone.current = null;
    }
    
    if (analyser.current) {
      analyser.current.disconnect();
      analyser.current = null;
    }
    
    // Stop all tracks on the audio stream
    if (audioStream.current) {
      audioStream.current.getTracks().forEach(track => {
        track.stop();
      });
      audioStream.current = null;
    }
    
    setAudioLevel(0);
  };
  
  // Add state for frequency bands
  const [frequencyBands, setFrequencyBands] = useState({
    low: 0,
    mid: 0,
    high: 0
  });
  
  // Generate optimized waveform visualization that responds to different frequency bands
  const generateWaveformVisualization = () => {
    const waveform = [];
    const numBars = 32; // Number of bars
    
    // Define color palettes for each frequency band
    const lowColors = ['#FF3366', '#FF4D94']; // Reds/pinks for bass
    const midColors = ['#33CCFF', '#00BFFF']; // Blues for mids
    const highColors = ['#00CC99', '#00FFCC']; // Greens for highs
    
    for (let i = 0; i < numBars; i++) {
      // Calculate position percentage for this bar (0-1)
      const position = i / numBars;
      
      // Determine which frequency band this bar represents
      // First third for low, middle third for mid, final third for high frequencies
      // With some overlap for smoother visuals
      let bandLevel, colors;
      
      if (position < 0.4) {
        // Low frequency region with overlap
        const mixFactor = position / 0.4; // 0 to 1 within this region
        bandLevel = frequencyBands.low * (1 - mixFactor) + frequencyBands.mid * mixFactor;
        colors = lowColors;
      } else if (position < 0.7) {
        // Mid frequency region with overlap on both sides
        const midPosition = (position - 0.4) / 0.3; // 0 to 1 within this region
        if (midPosition < 0.5) {
          // Transition from low to mid
          const mixFactor = midPosition * 2; // 0 to 1 in first half
          bandLevel = frequencyBands.low * (1 - mixFactor) + frequencyBands.mid * mixFactor;
          colors = midPosition < 0.25 ? lowColors : midColors;
        } else {
          // Transition from mid to high
          const mixFactor = (midPosition - 0.5) * 2; // 0 to 1 in second half
          bandLevel = frequencyBands.mid * (1 - mixFactor) + frequencyBands.high * mixFactor;
          colors = midPosition > 0.75 ? highColors : midColors;
        }
      } else {
        // High frequency region
        bandLevel = frequencyBands.high;
        colors = highColors;
      }
      
      // Calculate height based on the frequency band level
      // Add some base height so bars are always visible
      const minHeight = 15;
      const maxHeight = 100;
      const heightPercentage = minHeight + bandLevel * (maxHeight - minHeight);
      
      // Choose a color from the appropriate palette
      const colorIndex = Math.floor(Math.random() * colors.length);
      const color = colors[colorIndex];
      
      // Dynamic glow effect based on audio level
      const glowSize = 2 + bandLevel * 8;
      
      waveform.push(
        <div
          key={i}
          className="rounded-full"
          style={{
            height: `${heightPercentage}%`,
            width: '2px',
            margin: '0 1px',
            backgroundColor: color,
            opacity: 0.85,
            transition: 'height 0.05s ease-out',
            boxShadow: `0 0 ${glowSize}px ${color}`
          }}
        />
      );
    }
    
    return waveform;
  };
  
  // Import additional icons
  const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
      <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
    </svg>
  );
  
  const StopIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
      <path fillRule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clipRule="evenodd" />
    </svg>
  );
  
  // Analyze the transcription using AI
  const analyzeTranscription = async (text: string) => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Get the API key using the service function
      const apiKey = getApiKey();
      
      if (!apiKey) {
        throw new Error("OpenAI API key is not available. Please check your environment variables.");
      }
      
      // Use GPT-4o-mini for analyzing the text
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are an AI assistant that analyzes dictated text and extracts structured content. 
              First, determine the intent of the dictation - is it a to-do list, a grocery list, general notes, or something else?
              Then, provide:
              1. A summary of the key points
              2. Formatted content based on the detected type
              3. Any suggestions for clarity or improvement
              
              Return your response as a JSON object with the following fields:
              {
                "summary": "Brief summary of the content",
                "type": "tasks" | "grocery" | "notes" | "default",
                "formattedContent": "Either a string with line breaks and bullet points, or a structured object representing the content",
                "suggestions": "Any suggestions for improvement"
              }
              
              For the formattedContent field:
              - For tasks: Use a string with bullet points (e.g., "- Task 1\\n- Task 2")
              - For grocery lists: You can use either a string with bullet points or a structured object with categories
              - For notes: Use a string with appropriate formatting for paragraphs and sections
              - Always ensure string values include proper line breaks (\\n) and formatting where appropriate`
            },
            {
              role: 'user',
              content: text
            }
          ],
          max_tokens: 500,
          temperature: 0.3
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          }
        }
      );
      
      // Parse the analysis result
      try {
        const analysisResult = response.data.choices[0].message.content.trim();
        console.log("Raw analysis:", analysisResult);
        
        // Extract JSON from the response which might contain markdown formatting
        const jsonMatch = analysisResult.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : analysisResult;
        
        const parsedResult = JSON.parse(jsonString);
        
        // Update state with the formatted content and analysis
        setContentType(parsedResult.type || 'default');
        setFormattedContent(parsedResult.formattedContent || '');
        setAnalysis(`${parsedResult.summary}\n\n${parsedResult.suggestions || 'No specific suggestions.'}`);
      } catch (parseError) {
        console.error("Error parsing analysis JSON:", parseError);
        // If parsing fails, just use the raw text
        setAnalysis(response.data.choices[0].message.content.trim());
      }
      
      setIsAnalyzing(false);
    } catch (err) {
      console.error('Error analyzing transcription:', err);
      setError("Failed to analyze transcription. Please check your API key and try again.");
      setIsAnalyzing(false);
      
      // Fall back to mock analysis in development mode
      if (import.meta.env.MODE === 'development') {
        console.log("Development mode: using mock analysis");
        setAnalysis("This is a mock analysis of the text. In a real environment, GPT would analyze the content and provide feedback on clarity, structure, and potential improvements.");
        setFormattedContent("- This would be formatted based on detected content type\n- Such as a task list\n- Or grocery list");
        setContentType('tasks');
        setIsAnalyzing(false);
      }
    }
  };
  
  // Handle completing the challenge
  const handleCompleteChallenge = () => {
    markChallengeAsCompleted('challenge-dictation-wizard');
    setIsCompleted(true);
    setCompletionMessage('Challenge completed! Great job using AI for dictation and analysis!');
    
    // Show confetti
    setShowConfetti(true);
    
    // Hide confetti after 5 seconds
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
  };
  
  // Reset the challenge
  const handleReset = () => {
    resetTranscript();
    setEditableTranscription('');
    setAnalysis('');
    setFormattedContent('');
    setContentType('default');
    setError(null);
    setIsAnalyzing(false);
  };

  // Update analysis with edited transcription
  const handleAnalyzeEdited = () => {
    if (editableTranscription.trim()) {
      analyzeTranscription(editableTranscription);
    }
  };

  // Format helper for rendering different content types
  const renderFormattedContent = () => {
    if (!formattedContent) return null;
    
    // Helper function to render JSON object as formatted HTML
    const renderStructuredContent = (content: any): string => {
      if (typeof content === 'string') {
        return content;
      } else if (Array.isArray(content)) {
        return content.map(item => `• ${item}`).join('<br>');
      } else if (typeof content === 'object') {
        let result = '';
        for (const [key, value] of Object.entries(content)) {
          if (key !== 'Grocery List') { // Skip the top-level key for grocery lists
            result += `<strong>${key}:</strong><br>`;
          }
          result += renderStructuredContent(value) + '<br>';
        }
        return result;
      }
      return String(content);
    };

    // Process content based on type
    const getProcessedContent = () => {
      if (typeof formattedContent === 'string') {
        return formattedContent.replace(/\n/g, '<br>').replace(/- /g, '• ');
      }
      return renderStructuredContent(formattedContent);
    };
    
    switch (contentType) {
      case 'tasks':
    return (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
              <ClipboardListIcon className="w-5 h-5 mr-2" /> Task List
            </h3>
            <div 
              className="text-gray-700"
              dangerouslySetInnerHTML={{ __html: getProcessedContent() }}
            />
          </div>
        );
      case 'grocery':
        return (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
              <ShoppingBagIcon className="w-5 h-5 mr-2" /> Grocery List
            </h3>
            <div 
              className="text-gray-700"
              dangerouslySetInnerHTML={{ __html: getProcessedContent() }}
            />
          </div>
        );
      case 'notes':
        return (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-purple-800 mb-3 flex items-center">
              <FileTextIcon className="w-5 h-5 mr-2" /> Notes
            </h3>
            <div 
              className="text-gray-700"
              dangerouslySetInnerHTML={{ __html: getProcessedContent() }}
            />
          </div>
        );
      default:
        return (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <ListIcon className="w-5 h-5 mr-2" /> Content
            </h3>
            <div 
              className="text-gray-700"
              dangerouslySetInnerHTML={{ __html: getProcessedContent() }}
            />
          </div>
        );
    }
  };
  
  // Show browser not supported message if needed
  if (!browserSupportsSpeechRecognition) {
        return (
      <div className="max-w-4xl mx-auto">
        <ChallengeHeader 
          title="AI Dictation Wizard" 
          icon={<Mic className="h-6 w-6 text-green-600" />}
          challengeId="challenge-dictation-wizard"
          isCompleted={isCompleted}
          setIsCompleted={setIsCompleted}
          showConfetti={showConfetti}
          setShowConfetti={setShowConfetti}
          onCompleteChallenge={handleCompleteChallenge}
        />
        
        <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-800 flex items-center mb-2">
                <AlertCircle className="w-5 h-5 mr-2" /> Browser Not Supported
              </h3>
              <p className="text-yellow-700">
                Your browser doesn't support speech recognition. Please try using Chrome, Edge, or Safari
                for the best experience with this challenge.
              </p>
                </div>
                </div>
              </div>
            </div>
    );
  }
  
  // Show microphone not available message if needed
  if (!isMicrophoneAvailable) {
    return (
      <div className="max-w-4xl mx-auto">
        <ChallengeHeader 
          title="AI Dictation Wizard" 
          icon={<Mic className="h-6 w-6 text-green-600" />}
          challengeId="challenge-dictation-wizard"
          isCompleted={isCompleted}
          setIsCompleted={setIsCompleted}
          showConfetti={showConfetti}
          setShowConfetti={setShowConfetti}
          onCompleteChallenge={handleCompleteChallenge}
        />
        
        <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="text-lg font-semibold text-red-800 flex items-center mb-2">
                <AlertCircle className="w-5 h-5 mr-2" /> Microphone Access Required
              </h3>
              <p className="text-red-700">
                Please allow microphone access to use the dictation feature. You can change this 
                in your browser settings and reload the page.
              </p>
            </div>
          </div>
            </div>
          </div>
        );
    }
  
  // Render the challenge
  return (
    <div className="max-w-4xl mx-auto">
      {/* Challenge Header */}
      <ChallengeHeader
        title="AI Dictation Wizard"
        icon={<Mic className="h-6 w-6 text-green-600" />}
        challengeId="challenge-dictation-wizard"
        isCompleted={isCompleted}
        setIsCompleted={setIsCompleted}
        showConfetti={showConfetti}
        setShowConfetti={setShowConfetti}
        onCompleteChallenge={handleCompleteChallenge}
      />
      
      {/* Main Challenge Content */}
      <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Real-Time Speech to Text
          </h2>
          
          <p className="text-gray-600 mb-6">
            Click the button below to start dictating. Your speech will be transcribed in real-time 
            and AI will automatically format it based on the content type (tasks, grocery lists, notes, etc.).
          </p>
          
          {/* Record Button with Waveform Above */}
          <div className="flex flex-col items-center mb-8">
            {/* Waveform visualization box above button */}
            <div className={`w-64 h-24 mb-4 rounded-xl shadow-md flex items-end justify-center px-3 overflow-hidden ${
              listening ? 'bg-gray-900 opacity-100' : 'bg-gray-900 opacity-80'
            }`}>
              <div className="flex items-end justify-center w-full h-full pb-3">
                {listening ? generateWaveformVisualization() : (
                  <div className="flex items-end justify-center w-full h-full">
                    {/* Static bars when not listening - frequency-colored */}
                    {Array.from({ length: 32 }).map((_, i) => {
                      // Position along the bar chart (0-1)
                      const position = i / 32;
                      
                      // Create a static frequency-based pattern without scrolling
                      let color, height;
                      
                      // Divide into regions for low, mid, and high frequencies
                      if (position < 0.4) {
                        // Low frequency region (red/pink)
                        color = position < 0.2 ? '#FF3366' : '#FF4D94';
                        height = 10 + Math.sin(position * Math.PI * 8) * 10;
                      } else if (position < 0.7) {
                        // Mid frequency region (blue)
                        color = position < 0.55 ? '#33CCFF' : '#00BFFF';
                        height = 10 + Math.sin((position - 0.4) * Math.PI * 10) * 12;
                      } else {
                        // High frequency region (green)
                        color = position < 0.85 ? '#00CC99' : '#00FFCC';
                        height = 10 + Math.sin((position - 0.7) * Math.PI * 12) * 8;
                      }
                      
                      return (
                        <div
                          key={i}
                          className="rounded-full"
                          style={{
                            height: `${height}%`,
                            width: '2px',
                            margin: '0 1px',
                            backgroundColor: color,
                            opacity: 0.5
                          }}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            
            {/* New Miami-style button */}
            <button
              onClick={toggleListening}
              className={`relative w-20 h-20 rounded-xl transition-all duration-300 focus:outline-none shadow-lg
                ${listening ? 'bg-blue-500' : 'bg-blue-600'}`}
              aria-label={listening ? "Stop recording" : "Start recording"}
            >
              {/* Inner button with pink/magenta background */}
              <div className={`absolute inset-0 m-1.5 rounded-lg flex items-center justify-center 
                ${listening ? 'bg-red-500' : 'bg-pink-500'} transition-all duration-300`}>
                <span className="text-white">
                  {listening ? <StopIcon /> : <PlayIcon />}
                </span>
              </div>
            </button>
            
            {/* Button label */}
            <span className="mt-2 text-sm font-medium text-gray-700">
              {listening ? 'Stop & Analyze' : 'Start Dictating'}
            </span>
          </div>
          
          {/* Transcription Text Field - Always visible */}
          <div className="mb-6">
            <label htmlFor="transcription" className="block text-sm font-medium text-gray-700 mb-2">
              Transcription {listening && <span className="text-red-500">(Listening...)</span>}
              {isAnalyzing && <span className="text-green-500">(Analyzing...)</span>}
            </label>
            <textarea
              id="transcription"
              value={editableTranscription}
              onChange={(e) => setEditableTranscription(e.target.value)}
              className={`w-full border rounded-md p-3 h-32 focus:outline-none focus:ring-2 focus:ring-red-500 ${
                listening ? 'border-red-400 bg-red-50' : 
                isAnalyzing ? 'border-green-400 border-b-2' : 
                'border-gray-300'
              }`}
              placeholder="Your transcription will appear here in real-time as you speak..."
              disabled={listening || isAnalyzing}
            />
            
            {/* Re-analyze button when text is edited */}
            {!listening && !isAnalyzing && editableTranscription && (
              <div className="mt-2 flex justify-end">
                <button
                  onClick={handleAnalyzeEdited}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200 transition-colors"
                >
                  Re-analyze
                </button>
              </div>
            )}
          </div>
          
          {/* Loading States */}
          {isAnalyzing && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mr-3"></div>
              <p className="text-green-500 font-medium">Analyzing and formatting your dictation...</p>
            </div>
          )}
          
          {/* Formatted Content Display */}
          {formattedContent && !isAnalyzing && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Formatted Content</h3>
              {renderFormattedContent()}
            </div>
          )}
          
          {/* Analysis Results */}
          {analysis && !isAnalyzing && (
            <div className="mt-8 border border-green-100 rounded-lg p-4 bg-green-50">
              <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" /> Analysis Results
              </h3>
              <div className="text-gray-700 whitespace-pre-line">
                {analysis}
              </div>
            </div>
          )}
          
          {/* Error State */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-red-800 mb-2 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" /> Error
              </h3>
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          {/* Completion Message */}
          {completionMessage && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" /> Success
              </h3>
              <p className="text-green-700">{completionMessage}</p>
            </div>
          )}
          
          {/* Reset Button */}
          {editableTranscription && !listening && !isAnalyzing && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Start New Dictation
              </button>
            </div>
          )}
          
          {/* Tips Box */}
          <div className="mt-8 bg-red-50 p-5 rounded-xl border border-red-100">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Dictation Tips</h3>
            <ul className="list-disc list-inside text-red-700 space-y-1">
              <li>Speak clearly and at a natural pace</li>
              <li>For task lists, start with "I need to" or use phrases like "My to-do list"</li>
              <li>For grocery lists, try "I need to buy" or "Grocery list"</li>
              <li>Use phrases like "note to self" for general notes</li>
              <li>Try making a presentation outline or meeting agenda</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Add ripple animation keyframes */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes ripple {
            0% {
              transform: scale(0.8);
              opacity: 0.4;
            }
            100% {
              transform: scale(2);
              opacity: 0;
            }
          }
          
          @keyframes pulse-slow {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
          
          @keyframes pulse-fast {
            0%, 100% {
              opacity: 0.8;
            }
            50% {
              opacity: 0.4;
            }
          }
          
          .animate-pulse-slow {
            animation: pulse-slow 1.5s ease-in-out infinite;
          }
          
          .animate-pulse-fast {
            animation: pulse-fast 0.8s ease-in-out infinite;
          }
        `
      }} />
      
      {/* Transcription Comparison Section */}
      <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <SparklesIcon className="h-6 w-6 text-purple-600 mr-2" />
            Speech Recognition Comparison
          </h2>
          
          <p className="text-gray-600 mb-6">
            Compare the speed and accuracy of Deepgram API against the browser's built-in Web Speech API.
            This can help you decide which technology is best for your needs.
          </p>
          
          <TranscriptionComparison deepgramApiKey={getDeepgramConfig().apiKey} />
        </div>
      </div>
    </div>
  );
};

export default DictationWizardMain; 