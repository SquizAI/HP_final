import React, { useState, useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Mic, StopCircle, AlertTriangle } from 'lucide-react';

// Create a more robust hook that handles browsers without speech recognition
const useSpeechRecognitionSafe = () => {
  // First try the standard hook
  const hookResult = useSpeechRecognition();
  
  // Create a safe version that won't crash if speech recognition isn't available
  if (!hookResult.browserSupportsSpeechRecognition) {
    return {
      transcript: '',
      listening: false,
      resetTranscript: () => {},
      browserSupportsSpeechRecognition: false,
      isMicrophoneAvailable: false
    };
  }
  
  return hookResult;
};

interface TranscriptionComparisonProps {
  deepgramApiKey: string | undefined;
}

const TranscriptionComparison: React.FC<TranscriptionComparisonProps> = ({ deepgramApiKey }) => {
  // State for tracking recording
  const [isRecording, setIsRecording] = useState<boolean>(false);
  
  // State for tracking results
  const [deepgramTranscript, setDeepgramTranscript] = useState<string>('');
  const [localTranscript, setLocalTranscript] = useState<string>('');
  
  // Timing metrics
  const [deepgramStartTime, setDeepgramStartTime] = useState<number | null>(null);
  const [deepgramEndTime, setDeepgramEndTime] = useState<number | null>(null);
  const [localStartTime, setLocalStartTime] = useState<number | null>(null);
  const [localEndTime, setLocalEndTime] = useState<number | null>(null);
  
  // Media recorder state
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Web Speech API setup - using our safe wrapper
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognitionSafe();

  // Update local transcript when Web Speech API updates
  useEffect(() => {
    if (transcript) {
      setLocalTranscript(transcript);
      
      // Update end time when transcript changes
      if (localStartTime && !localEndTime) {
        setLocalEndTime(Date.now());
      }
    }
  }, [transcript, localStartTime, localEndTime]);
  
  // Effect to monitor recording state changes
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  // Start both recording methods
  const startRecording = async () => {
    // Reset state
    setDeepgramTranscript('');
    setLocalTranscript('');
    setDeepgramStartTime(null);
    setDeepgramEndTime(null);
    setLocalStartTime(null);
    setLocalEndTime(null);
    resetTranscript();
    
    try {
      // First ensure we have microphone access before proceeding
      console.log("Requesting microphone access for transcription comparison...");
      
      // Request with detailed constraints for better device selection
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      // Store stream for later cleanup
      streamRef.current = stream;
      
      // Start Web Speech API (if supported)
      if (browserSupportsSpeechRecognition) {
        console.log("Starting Web Speech API transcription");
        setLocalStartTime(Date.now());
        await SpeechRecognition.startListening({ continuous: true });
      }
      
      // Setup MediaRecorder for Deepgram
      // Check which audio types are supported
      let mimeType = '';
      for (const type of ['audio/webm', 'audio/mp4', 'audio/ogg', 'audio/wav']) {
        if (MediaRecorder.isTypeSupported(type)) {
          mimeType = type;
          break;
        }
      }
      
      const options: MediaRecorderOptions = {
        mimeType: mimeType || '',
        audioBitsPerSecond: 128000
      };
      
      // Reset audio chunks
      audioChunksRef.current = [];
      
      console.log("Creating MediaRecorder for Deepgram comparison with options:", options);
      mediaRecorderRef.current = new MediaRecorder(stream, options);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.start(100);
      setDeepgramStartTime(Date.now());
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      
      // Show a user-friendly error
      alert('Could not access your microphone. Please check your browser permissions and try again.');
    }
  };
  
  // Stop both recording methods
  const stopRecording = async () => {
    // Stop Web Speech API if supported
    if (browserSupportsSpeechRecognition) {
      SpeechRecognition.stopListening();
    }
    
    // Stop MediaRecorder
    if (mediaRecorderRef.current && isRecording) {
      try {
        console.log("Stopping MediaRecorder for Deepgram comparison");
        
        // Give Web Speech API a chance to finish
        setTimeout(async () => {
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            // This forces a dataavailable event to be fired
            mediaRecorderRef.current.requestData();
            
            // Small delay to ensure the data is processed before stopping
            setTimeout(() => {
              if (mediaRecorderRef.current) {
                mediaRecorderRef.current.stop();
                setIsRecording(false);
                
                // Create audio blob and send to Deepgram
                const audioBlob = new Blob(audioChunksRef.current, { 
                  type: mediaRecorderRef.current.mimeType || 'audio/webm' 
                });
                
                // If we have audio data, process it with Deepgram
                if (audioBlob.size > 0) {
                  processWithDeepgram(audioBlob);
                }
              }
            }, 100);
          }
        }, 500);  
      } catch (e) {
        console.error("Error stopping MediaRecorder:", e);
        setIsRecording(false);
      }
    }
  };
  
  // Send audio to Deepgram for processing
  const processWithDeepgram = async (audioBlob: Blob) => {
    try {
      if (!deepgramApiKey) {
        throw new Error("Deepgram API key is missing");
      }
      
      // Create a URL from the blob for debugging
      const audioUrl = URL.createObjectURL(audioBlob);
      console.log("Audio URL created for Deepgram comparison:", audioUrl);
      
      // Using fetch with the Deepgram API
      const response = await fetch('https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&punctuate=true', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${deepgramApiKey}`,
          'Content-Type': audioBlob.type || 'audio/webm'
        },
        body: audioBlob
      });
      
      setDeepgramEndTime(Date.now());
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Deepgram API error:", errorData);
        throw new Error(`Deepgram API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Deepgram comparison response:", data);
      
      // Get transcript from the response
      const transcript = data.results?.channels[0]?.alternatives[0]?.transcript || '';
      
      if (transcript) {
        setDeepgramTranscript(transcript);
      } else {
        throw new Error("No transcription returned from Deepgram");
      }
    } catch (err) {
      console.error('Error transcribing with Deepgram in comparison:', err);
      
      // Fall back to a mock transcription for testing
      if (import.meta.env.MODE === 'development') {
        console.log("Development mode: using mock transcription for Deepgram comparison");
        setDeepgramTranscript("This is a mock Deepgram transcription for testing purposes.");
      }
    }
  };
  
  // Calculate transcription time
  const getTranscriptionTime = (startTime: number | null, endTime: number | null): string => {
    if (!startTime || !endTime) return "N/A";
    return `${(endTime - startTime) / 1000} seconds`;
  };
  
  // Unsupported browser warning content
  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="p-4 border rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Speech Recognition Comparison</h3>
        
        <div className="p-4 bg-yellow-50 rounded-md text-yellow-800 mb-6 flex items-start">
          <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Limited Functionality Available</p>
            <p className="mt-1">
              Your browser doesn't fully support the Web Speech API for comparison testing. 
              You can still test Deepgram transcription, but the side-by-side comparison 
              won't be available.
            </p>
            <p className="mt-2 text-sm">
              For the best experience, try using Google Chrome or Microsoft Edge.
            </p>
          </div>
        </div>
        
        {/* Control buttons - Deepgram only mode */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={startRecording}
            disabled={isRecording}
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
              isRecording
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Mic size={18} /> Start Recording
          </button>
          <button
            onClick={stopRecording}
            disabled={!isRecording}
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
              !isRecording
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            <StopCircle size={18} /> Stop Recording
          </button>
        </div>
        
        {/* Status indicator */}
        <div className="text-center mb-6">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
            isRecording
              ? 'bg-red-100 text-red-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {isRecording ? 'Recording...' : 'Ready'}
          </span>
        </div>
        
        {/* Single result for Deepgram */}
        <div className="border p-4 rounded-md">
          <h4 className="font-medium mb-2 flex justify-between">
            <span>Deepgram API</span>
            <span className="text-sm text-gray-500">
              {getTranscriptionTime(deepgramStartTime, deepgramEndTime)}
            </span>
          </h4>
          <div className="h-40 overflow-y-auto bg-gray-50 p-3 rounded">
            {deepgramTranscript || (
              <span className="text-gray-400 italic">
                Transcription will appear here...
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Standard view with both transcription methods
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Speech Recognition Comparison</h3>
      
      {/* Control buttons */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={startRecording}
          disabled={isRecording || listening}
          className={`flex items-center gap-2 px-4 py-2 rounded-md ${
            isRecording || listening 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <Mic size={18} /> Start Recording
        </button>
        <button
          onClick={stopRecording}
          disabled={!isRecording && !listening}
          className={`flex items-center gap-2 px-4 py-2 rounded-md ${
            !isRecording && !listening
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          <StopCircle size={18} /> Stop Recording
        </button>
      </div>
      
      {/* Status indicator */}
      <div className="text-center mb-6">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
          isRecording || listening 
            ? 'bg-red-100 text-red-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {isRecording || listening ? 'Recording...' : 'Ready'}
        </span>
      </div>
      
      {/* Results comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border p-4 rounded-md">
          <h4 className="font-medium mb-2 flex justify-between">
            <span>Deepgram API</span>
            <span className="text-sm text-gray-500">
              {getTranscriptionTime(deepgramStartTime, deepgramEndTime)}
            </span>
          </h4>
          <div className="h-40 overflow-y-auto bg-gray-50 p-3 rounded">
            {deepgramTranscript || (
              <span className="text-gray-400 italic">
                Transcription will appear here...
              </span>
            )}
          </div>
        </div>
        
        <div className="border p-4 rounded-md">
          <h4 className="font-medium mb-2 flex justify-between">
            <span>Web Speech API (Local)</span>
            <span className="text-sm text-gray-500">
              {getTranscriptionTime(localStartTime, localEndTime)}
            </span>
          </h4>
          <div className="h-40 overflow-y-auto bg-gray-50 p-3 rounded">
            {localTranscript || (
              <span className="text-gray-400 italic">
                Transcription will appear here...
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Accuracy and comparison */}
      {deepgramTranscript && localTranscript && (
        <div className="mt-6">
          <h4 className="font-medium mb-2">Analysis:</h4>
          <div className="bg-gray-50 p-3 rounded">
            <div className="mb-2">
              <strong>Character Count:</strong>
              <ul className="list-disc ml-6">
                <li>Deepgram: {deepgramTranscript.length} characters</li>
                <li>Web Speech API: {localTranscript.length} characters</li>
              </ul>
            </div>
            <div>
              <strong>Speed Comparison:</strong>
              <div className="ml-6">
                {deepgramEndTime && deepgramStartTime && localEndTime && localStartTime ? (
                  <p>
                    {(deepgramEndTime - deepgramStartTime) < (localEndTime - localStartTime) 
                      ? "Deepgram was faster" 
                      : "Web Speech API was faster"}
                  </p>
                ) : (
                  <p className="italic text-gray-500">Complete both transcriptions to compare speed</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-6 text-sm text-gray-500">
        <p>Note: Web Speech API (used by Chrome/Safari) performs processing in the cloud but requires no setup.
        Deepgram requires an API key but offers more accurate results and additional features.</p>
      </div>
    </div>
  );
};

export default TranscriptionComparison; 