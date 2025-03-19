import React, { useRef, useState, useEffect } from 'react';
import { Mic } from 'lucide-react';

interface SimpleRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
}

/**
 * Circular Audio Visualizer component that displays sound waves in a circle around the mic button
 */
const CircularVisualizer: React.FC<{ isActive: boolean, stream: MediaStream | null }> = ({ 
  isActive, 
  stream 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  useEffect(() => {
    if (!isActive || !stream || !window.AudioContext) return;
    
    try {
      // Setup audio context and analyser
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      analyserRef.current = audioContext.createAnalyser();
      analyserRef.current.fftSize = 128;
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);
      
      // Connect the provided stream to the analyser
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      // Important: Do not connect the analyzer to the destination
      // This would cause audio feedback and potentially affect recording
      
      // Start visualization
      startVisualization();
    } catch (err) {
      console.error("Error setting up circular visualizer:", err);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(err => {
          console.error("Error closing audio context:", err);
        });
      }
    };
  }, [isActive, stream]);
  
  const startVisualization = () => {
    if (!canvasRef.current || !analyserRef.current || !dataArrayRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const draw = () => {
      if (!isActive) return;
      
      // Get canvas dimensions
      const WIDTH = canvas.width;
      const HEIGHT = canvas.height;
      const centerX = WIDTH / 2;
      const centerY = HEIGHT / 2;
      const radius = Math.min(WIDTH, HEIGHT) / 2 - 5;
      
      // Clear canvas
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      
      // Get frequency data
      analyserRef.current!.getByteFrequencyData(dataArrayRef.current!);
      
      // Draw circular visualization
      const barCount = dataArrayRef.current!.length;
      const barWidth = (2 * Math.PI) / barCount;
      
      // Draw transparent circle background
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.fill();
      
      for (let i = 0; i < barCount; i++) {
        const amplitude = dataArrayRef.current![i] / 256;
        const barHeight = radius * amplitude * 0.7 + 5; // Increased multiplier for more visible bars
        
        const angle = i * barWidth;
        const x1 = centerX + Math.cos(angle) * (radius - 20); // Inner circle is smaller
        const y1 = centerY + Math.sin(angle) * (radius - 20);
        const x2 = centerX + Math.cos(angle) * (radius - 20 + barHeight);
        const y2 = centerY + Math.sin(angle) * (radius - 20 + barHeight);
        
        // Create gradient line
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, 'rgba(239, 68, 68, 0.2)'); // Faded red at start
        gradient.addColorStop(1, 'rgba(248, 113, 113, 0.9)'); // Brighter red at end
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.strokeStyle = gradient;
        ctx.stroke();
      }
      
      // Draw pulse circle
      const pulseRadius = radius - 10 + Math.sin(Date.now() * 0.005) * 5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseRadius, 0, 2 * Math.PI, false);
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.2)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      animationRef.current = requestAnimationFrame(draw);
    };
    
    draw();
  };
  
  if (!isActive) return null;
  
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
      <canvas 
        ref={canvasRef} 
        width={300}
        height={300}
        className="w-full h-full"
      />
    </div>
  );
};

/**
 * Audio Waveform component that visualizes microphone input
 */
const AudioWaveform: React.FC<{ isActive: boolean, stream: MediaStream | null }> = ({ 
  isActive, 
  stream 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  useEffect(() => {
    if (!isActive || !stream || !window.AudioContext) return;
    
    try {
      // Setup audio context and analyser
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      analyserRef.current = audioContext.createAnalyser();
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);
      
      // Connect the provided stream to the analyser
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      // Important: Do not connect the analyzer to the destination
      // This would cause audio feedback and potentially affect recording
      
      // Start visualization
      startVisualization();
    } catch (err) {
      console.error("Error setting up waveform visualizer:", err);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(err => {
          console.error("Error closing audio context:", err);
        });
      }
    };
  }, [isActive, stream]);
  
  const startVisualization = () => {
    if (!canvasRef.current || !analyserRef.current || !dataArrayRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const draw = () => {
      if (!isActive) return;
      
      // Get canvas dimensions
      const WIDTH = canvas.width;
      const HEIGHT = canvas.height;
      
      // Clear canvas
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      
      // Get frequency data
      analyserRef.current!.getByteFrequencyData(dataArrayRef.current!);
      
      // Set bar width based on canvas size and buffer length
      const barWidth = (WIDTH / dataArrayRef.current!.length) * 2.5;
      let barHeight;
      let x = 0;
      
      // Draw bars
      for (let i = 0; i < dataArrayRef.current!.length; i++) {
        barHeight = dataArrayRef.current![i] / 2;
        
        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
        gradient.addColorStop(0, '#ef4444'); // Red at top (matching recording button)
        gradient.addColorStop(1, '#fca5a5'); // Lighter red at bottom
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
        
        x += barWidth + 1;
      }
      
      animationRef.current = requestAnimationFrame(draw);
    };
    
    draw();
  };
  
  if (!isActive) return null;
  
  return (
    <div className="w-full h-24 mt-2 mb-4 overflow-hidden rounded-lg bg-gray-100 border border-red-200">
      <canvas 
        ref={canvasRef} 
        width={300} 
        height={96}
        className="w-full h-full"
      />
    </div>
  );
};

/**
 * A simple press-to-record button component that records audio while pressed
 * and stops recording when released
 */
const SimpleRecorder: React.FC<SimpleRecorderProps> = ({
  onRecordingComplete,
  isRecording,
  setIsRecording
}) => {
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [pulseSize, setPulseSize] = useState<number>(1);
  const [visualizerType, setVisualizerType] = useState<'circular' | 'waveform'>('circular');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<number | null>(null);
  const pulseRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Format recording time
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      
      if (pulseRef.current) {
        window.clearInterval(pulseRef.current);
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  // Start pulse animation when recording
  useEffect(() => {
    if (isRecording) {
      // Create pulsing effect
      pulseRef.current = window.setInterval(() => {
        setPulseSize(size => size === 1 ? 1.1 : 1);
      }, 500);
    } else {
      if (pulseRef.current) {
        window.clearInterval(pulseRef.current);
        setPulseSize(1);
      }
    }
    
    return () => {
      if (pulseRef.current) {
        window.clearInterval(pulseRef.current);
      }
    };
  }, [isRecording]);
  
  // Request microphone access and set up the recorder
  const setupRecorder = async () => {
    try {
      // Clear any previous state
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      // Get fresh stream
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1, // Mono audio works better for speech recognition
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000 // Deepgram works well with 16kHz audio
        } 
      });
      
      // Store stream for visualizations
      streamRef.current = stream;
      
      // Check which audio types are supported
      const mimeTypes = [
        'audio/webm',
        'audio/mp4',
        'audio/ogg',
        'audio/wav'
      ];
      
      let mimeType = '';
      for (const type of mimeTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          mimeType = type;
          break;
        }
      }
      
      if (!mimeType) {
        console.warn("No supported MIME types found, using default");
      }
      
      const options: MediaRecorderOptions = {
        mimeType: mimeType || '',
        audioBitsPerSecond: 128000
      };
      
      // Reset audio chunks 
      audioChunksRef.current = [];
      
      console.log("Creating MediaRecorder with options:", options);
      mediaRecorderRef.current = new MediaRecorder(stream, options);
      
      // Set up data handlers before starting recording
      mediaRecorderRef.current.ondataavailable = (event) => {
        console.log("Data available event, size:", event.data.size);
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        console.log("MediaRecorder stopped, chunks:", audioChunksRef.current.length);
        
        // Add a small delay to ensure all data is collected before creating the blob
        setTimeout(() => {
          const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorderRef.current?.mimeType || 'audio/webm' });
          console.log("Audio blob created:", audioBlob.size, "bytes, type:", audioBlob.type);
          
          // Only process if we actually have recorded audio
          if (audioBlob.size > 0) {
            onRecordingComplete(audioBlob);
          } else {
            setError("No audio data was recorded. Please try again.");
          }
          
          // Reset the timer
          if (timerRef.current) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
          }
        }, 100); // Small delay to ensure all data is collected
      };
      
      return true;
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError("Could not access your microphone. Please ensure you've granted permission.");
      return false;
    }
  };
  
  // Start recording when button is pressed
  const startRecording = async () => {
    if (await setupRecorder()) {
      // Reset timer
      setRecordingTime(0);
      
      // Start recording
      if (mediaRecorderRef.current) {
        try {
          // Clear previous chunks
          audioChunksRef.current = [];
          
          // Use a short timeslice to get more frequent ondataavailable events
          mediaRecorderRef.current.start(100);
          console.log("MediaRecorder started");
          setIsRecording(true);
          
          // Start timer
          timerRef.current = window.setInterval(() => {
            setRecordingTime(prev => prev + 1);
          }, 1000);
        } catch (e) {
          console.error("Error starting MediaRecorder:", e);
          setError("Error starting recording. Please try again.");
        }
      }
    }
  };
  
  // Stop recording when button is released
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      try {
        console.log("Stopping MediaRecorder");
        
        // Manually request a final dataavailable event before stopping
        if (mediaRecorderRef.current.state === 'recording') {
          // This forces a dataavailable event to be fired
          mediaRecorderRef.current.requestData();
          
          // Small delay to ensure the data is processed before stopping
          setTimeout(() => {
            mediaRecorderRef.current?.stop();
            setIsRecording(false);
          }, 50);
        } else {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
        }
      } catch (e) {
        console.error("Error stopping MediaRecorder:", e);
        setError("Error stopping recording. Please try again.");
        
        // Clean up stream on error
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      }
    }
  };
  
  return (
    <div className="flex flex-col items-center">
      {/* Error message */}
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}
      
      {/* Visualizer Type Toggle */}
      {isRecording && (
        <div className="mb-4">
          <button
            onClick={() => setVisualizerType(visualizerType === 'circular' ? 'waveform' : 'circular')}
            className="text-xs text-gray-500 underline"
          >
            Switch to {visualizerType === 'circular' ? 'Waveform' : 'Circular'} Visualizer
          </button>
        </div>
      )}
      
      {/* Audio Waveform Visualization - only show if selected */}
      {isRecording && visualizerType === 'waveform' && (
        <AudioWaveform isActive={isRecording} stream={streamRef.current} />
      )}
      
      {/* Press-to-record button with circular visualization */}
      <div className="relative w-40 h-40 flex items-center justify-center">
        {isRecording && visualizerType === 'circular' && (
          <CircularVisualizer isActive={isRecording} stream={streamRef.current} />
        )}
        <button
          className={`flex flex-col items-center justify-center w-32 h-32 rounded-full transition-all focus:outline-none focus:ring-4 focus:ring-blue-300 z-10`}
          style={{
            background: isRecording ? '#ef4444' : '#2563eb',
            color: 'white',
            transform: `scale(${isRecording ? pulseSize : 1})`,
            boxShadow: isRecording ? '0 0 15px rgba(239, 68, 68, 0.7)' : 'none',
          }}
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onMouseLeave={isRecording ? stopRecording : undefined}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
        >
          <Mic size={40} className={isRecording ? 'animate-pulse' : ''} />
          {isRecording ? (
            <span className="mt-2 font-medium">{formatTime(recordingTime)}</span>
          ) : (
            <span className="mt-2 font-medium">Press & Hold</span>
          )}
        </button>
      </div>
      
      <p className="mt-4 text-sm text-gray-500 text-center">
        {isRecording 
          ? 'Release to stop recording and transcribe' 
          : 'Press and hold the button to start recording'}
      </p>
    </div>
  );
};

export default SimpleRecorder; 