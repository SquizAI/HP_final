import React, { useState, useRef, useEffect } from 'react';
import { EMOTION_EMOJIS } from './EmotionTypes';

// Define the shapes of our voice sentiment data
export interface VoiceSentimentResult {
  dominantEmotion: string;
  confidence: number;
  emotions: {
    neutral: number;
    happy: number;
    sad: number;
    angry: number;
    fearful: number;
    disgusted: number;
    surprised: number;
  };
  audioFeatures?: {
    pitch: number;
    volume: number;
    speakingRate: number;
    pauses: number;
  };
}

interface VoiceSentimentAnalyzerProps {
  onSentimentDetected: (sentiment: VoiceSentimentResult) => void;
  isRecording?: boolean;
  onRecordingComplete?: (audioBlob: Blob) => void;
  onRecordingStateChange?: (recording: boolean) => void;
}

const VoiceSentimentAnalyzer: React.FC<VoiceSentimentAnalyzerProps> = ({
  onSentimentDetected,
  isRecording: externalIsRecording,
  onRecordingComplete,
  onRecordingStateChange
}) => {
  // State for recording
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioFeatures, setAudioFeatures] = useState<{
    volume: number;
    pitch: number;
    speakingRate: number;
    pauses: number;
  }>({
    volume: 0,
    pitch: 0,
    speakingRate: 0,
    pauses: 0
  });
  
  // Real-time emotion state
  const [realtimeEmotion, setRealtimeEmotion] = useState<string>('neutral');
  const [emotionConfidence, setEmotionConfidence] = useState<number>(0);
  
  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioDataRef = useRef<Uint8Array | null>(null);
  const emotionUpdateRef = useRef<NodeJS.Timeout | null>(null);
  
  // Handle external recording control
  useEffect(() => {
    if (externalIsRecording !== undefined) {
      if (externalIsRecording && !isRecording) {
        startRecording();
      } else if (!externalIsRecording && isRecording) {
        stopRecording();
      }
    }
  }, [externalIsRecording]);
  
  // Notify parent component when recording state changes
  useEffect(() => {
    if (onRecordingStateChange) {
      onRecordingStateChange(isRecording);
    }
  }, [isRecording, onRecordingStateChange]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (emotionUpdateRef.current) {
        clearInterval(emotionUpdateRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]);
  
  // Start recording function
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Set up audio context for analysis
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;
      
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      
      // Set up data array for analysis
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      audioDataRef.current = dataArray;
      
      // Start analyzing audio
      analyzeAudio();
      
      // Set up media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        audioChunksRef.current = [];
        
        // Analyze the recorded audio
        analyzeSentiment();
        
        // Callback with the audio blob
        if (onRecordingComplete) {
          onRecordingComplete(audioBlob);
        }
      };
      
      // Start recording
      audioChunksRef.current = [];
      mediaRecorder.start();
      setIsRecording(true);
      setRealtimeEmotion('neutral');
      setEmotionConfidence(0);
      
      // Start timer
      let seconds = 0;
      timerRef.current = setInterval(() => {
        seconds++;
        setRecordingTime(seconds);
        
        // Auto-stop after 30 seconds
        if (seconds >= 30) {
          stopRecording();
        }
      }, 1000);
      
      // Start real-time emotion updates
      emotionUpdateRef.current = setInterval(() => {
        updateRealtimeEmotion();
      }, 500);
      
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };
  
  // Stop recording function
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (emotionUpdateRef.current) {
        clearInterval(emotionUpdateRef.current);
      }
    }
  };
  
  // Update real-time emotion based on audio features
  const updateRealtimeEmotion = () => {
    if (!isRecording) return;
    
    // We'll use the volume to determine the emotion in real-time
    // In a real app, we'd use more sophisticated audio processing
    const volume = audioFeatures.volume;
    
    let emotion = 'neutral';
    let confidence = 0.5;
    
    if (volume > 0.8) {
      // Very loud - likely angry or surprised
      emotion = Math.random() > 0.5 ? 'angry' : 'surprised';
      confidence = 0.7 + (Math.random() * 0.3);
    } else if (volume > 0.6) {
      // Loud - likely happy or excited
      emotion = 'happy';
      confidence = 0.6 + (Math.random() * 0.3);
    } else if (volume < 0.2 && volume > 0) {
      // Very quiet - likely sad or fearful
      emotion = Math.random() > 0.5 ? 'sad' : 'fearful';
      confidence = 0.6 + (Math.random() * 0.2);
    } else if (volume > 0) {
      // Random emotion for demo purposes with low confidence
      const emotions = ['neutral', 'happy', 'sad', 'angry', 'fearful', 'disgusted', 'surprised'];
      emotion = emotions[Math.floor(Math.random() * emotions.length)];
      confidence = 0.3 + (Math.random() * 0.3);
    }
    
    setRealtimeEmotion(emotion);
    setEmotionConfidence(confidence);
  };
  
  // Analyze audio in real-time
  const analyzeAudio = () => {
    if (!analyserRef.current || !audioDataRef.current) return;
    
    const analyzeFrame = () => {
      if (!analyserRef.current || !audioDataRef.current || !isRecording) return;
      
      // Get frequency data
      analyserRef.current.getByteFrequencyData(audioDataRef.current);
      
      // Calculate volume (average amplitude)
      const average = audioDataRef.current.reduce((sum, value) => sum + value, 0) / audioDataRef.current.length;
      const normalizedVolume = average / 255; // Normalize to 0-1
      
      // Update audio features
      setAudioFeatures(prev => ({
        ...prev,
        volume: normalizedVolume
      }));
      
      // Continue analyzing
      requestAnimationFrame(analyzeFrame);
    };
    
    analyzeFrame();
  };
  
  // Analyze sentiment from audio features
  const analyzeSentiment = () => {
    setIsAnalyzing(true);
    
    // In a real application, we would use a proper audio analysis library
    // For this demo, we'll simulate sentiment analysis based on audio features
    
    // Simulate processing delay
    setTimeout(() => {
      // Generate simulated emotions based on audio features
      // In a real app, this would use ML models trained on audio emotional content
      
      const volume = audioFeatures.volume;
      
      // Simple heuristic: 
      // - Higher volume often correlates with anger, happiness, or surprise
      // - Lower volume often correlates with sadness, fear, or neutral
      
      const emotions = {
        neutral: 0.2,
        happy: 0.1,
        sad: 0.1,
        angry: 0.1,
        fearful: 0.1,
        disgusted: 0.1,
        surprised: 0.1
      };
      
      // Adjust based on volume
      if (volume > 0.7) {
        // Loud speech - likely angry, happy, or surprised
        emotions.angry += 0.3;
        emotions.happy += 0.2;
        emotions.surprised += 0.2;
        emotions.neutral -= 0.1;
        emotions.sad -= 0.1;
      } else if (volume < 0.3) {
        // Quiet speech - likely sad, fearful, or neutral
        emotions.sad += 0.3;
        emotions.fearful += 0.2;
        emotions.neutral += 0.1;
        emotions.angry -= 0.1;
        emotions.happy -= 0.1;
      } else {
        // Medium volume - boost neutral and happy
        emotions.neutral += 0.2;
        emotions.happy += 0.2;
      }
      
      // Normalize to ensure sum is 1
      const total = Object.values(emotions).reduce((sum, val) => sum + val, 0);
      const normalizedEmotions = Object.entries(emotions).reduce((acc, [key, value]) => {
        acc[key as keyof typeof emotions] = value / total;
        return acc;
      }, { ...emotions });
      
      // Find dominant emotion
      let dominantEmotion = 'neutral';
      let highestScore = 0;
      
      Object.entries(normalizedEmotions).forEach(([emotion, score]) => {
        if (score > highestScore) {
          highestScore = score;
          dominantEmotion = emotion;
        }
      });
      
      // Create result
      const result: VoiceSentimentResult = {
        dominantEmotion,
        confidence: highestScore,
        emotions: normalizedEmotions,
        audioFeatures: {
          volume,
          pitch: Math.random(), // Simulated in this demo
          speakingRate: Math.random() * 0.5 + 0.5, // Simulated
          pauses: Math.floor(Math.random() * 5) // Simulated
        }
      };
      
      // Send result to parent
      onSentimentDetected(result);
      setIsAnalyzing(false);
    }, 1500);
  };
  
  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Render real-time emotion indicator
  const renderEmotionIndicator = () => {
    if (!isRecording || !realtimeEmotion) return null;
    
    const emotionInfo = EMOTION_EMOJIS[realtimeEmotion] || EMOTION_EMOJIS.neutral;
    
    return (
      <div className="absolute top-0 right-0 m-2 p-2 rounded-full flex items-center justify-center" 
        style={{ backgroundColor: `${emotionInfo.color}30`, border: `2px solid ${emotionInfo.color}` }}>
        <div className="text-center">
          <div className="text-3xl animate-pulse">{emotionInfo.emoji}</div>
          <div className="text-xs font-medium mt-1 capitalize bg-white bg-opacity-80 rounded-full px-2 py-0.5">
            {realtimeEmotion} {Math.round(emotionConfidence * 100)}%
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-3">Voice Sentiment Analysis</h3>
      
      <div className="flex flex-col items-center mb-4">
        <div className="w-full flex justify-center mb-4">
          <div className="relative">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`px-4 py-2 rounded-full flex items-center justify-center shadow-lg transition-all ${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600 text-white scale-110' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
              style={{ width: '64px', height: '64px' }}
            >
              {isRecording ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <rect x="6" y="6" width="12" height="12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {isRecording && (
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2 animate-pulse"></div>
            <span className="text-sm font-medium">Recording: {formatTime(recordingTime)}</span>
          </div>
        )}
        
        {audioURL && (
          <div className="w-full mt-4">
            <audio src={audioURL} controls className="w-full" />
          </div>
        )}
      </div>
      
      {isAnalyzing ? (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Analyzing voice sentiment...</span>
        </div>
      ) : audioURL && (
        <div className="mt-4">
          <h4 className="font-medium text-sm text-gray-700 mb-2">Voice Analysis Result:</h4>
          <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
            <div className="flex items-center justify-center mb-3">
              {audioFeatures && (
                <div className="grid grid-cols-2 gap-3 w-full">
                  <div className="p-2 bg-blue-50 rounded text-center">
                    <div className="text-xs text-blue-700 mb-1">Volume</div>
                    <div className="font-medium">{Math.round(audioFeatures.volume * 100)}%</div>
                  </div>
                  <div className="p-2 bg-purple-50 rounded text-center">
                    <div className="text-xs text-purple-700 mb-1">Pitch</div>
                    <div className="font-medium">{Math.round(audioFeatures.pitch * 100)}%</div>
                  </div>
                  <div className="p-2 bg-green-50 rounded text-center">
                    <div className="text-xs text-green-700 mb-1">Rate</div>
                    <div className="font-medium">{Math.round(audioFeatures.speakingRate * 100)}%</div>
                  </div>
                  <div className="p-2 bg-yellow-50 rounded text-center">
                    <div className="text-xs text-yellow-700 mb-1">Pauses</div>
                    <div className="font-medium">{audioFeatures.pauses}</div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Emotion distribution chart is still shown as it's a key part of the analysis */}
            <h4 className="font-medium text-sm text-gray-700 mb-2">Emotion Distribution:</h4>
            <div className="space-y-3">
              {Object.entries(EMOTION_EMOJIS).map(([emotion, { emoji, color }]) => (
                <div key={emotion} className="relative">
                  <div className="flex items-center mb-1">
                    <div className="mr-2 w-6 text-center">{emoji}</div>
                    <span className="text-sm capitalize">{emotion}</span>
                    <span className="ml-auto text-xs font-medium">{Math.round((audioFeatures?.volume || 0) * 100)}%</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ 
                        width: `${Math.round((audioFeatures?.volume || 0) * 100)}%`,
                        backgroundColor: color 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {!isRecording && !audioURL && (
        <div className="text-center py-6 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
          <p>Click the microphone button to start recording</p>
          <p className="text-sm mt-1">Speak clearly to analyze your voice sentiment</p>
        </div>
      )}
    </div>
  );
};

export default VoiceSentimentAnalyzer; 