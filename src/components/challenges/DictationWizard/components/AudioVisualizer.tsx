import React, { useEffect, useRef, useState } from 'react';

interface AudioVisualizerProps {
  isListening: boolean;
  onError?: (error: Error) => void;
}

// Frequency bands for visualization
const BANDS = {
  low: { min: 80, max: 300 },
  mid: { min: 300, max: 1200 },
  high: { min: 1200, max: 3000 }
};

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ 
  isListening,
  onError 
}) => {
  // Audio state
  const [audioLevels, setAudioLevels] = useState<number[]>(Array(30).fill(0));
  const [lowFreqLevels, setLowFreqLevels] = useState<number[]>(Array(10).fill(0));
  const [midFreqLevels, setMidFreqLevels] = useState<number[]>(Array(10).fill(0));
  const [highFreqLevels, setHighFreqLevels] = useState<number[]>(Array(10).fill(0));
  const [hasError, setHasError] = useState<boolean>(false);
  
  // Refs for audio processing
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const setupAttemptedRef = useRef<boolean>(false);
  
  // Check browser type
  const isChromeRef = useRef<boolean>(
    typeof window !== 'undefined' && 
    (navigator.userAgent.indexOf("Chrome") > -1 || navigator.userAgent.indexOf("Chromium") > -1)
  );
  
  // Clean up audio resources
  const cleanupAudio = () => {
    // Cancel any pending animation frame
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    // Clear any timeouts
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        try {
          track.stop();
        } catch (e) {
          console.error("Error stopping track:", e);
        }
      });
      streamRef.current = null;
    }
    
    if (audioContextRef.current) {
      try {
        if (audioContextRef.current.state !== 'closed') {
          audioContextRef.current.close();
        }
      } catch (e) {
        console.error("Error closing audio context:", e);
      }
      audioContextRef.current = null;
    }
    
    analyzerRef.current = null;
    dataArrayRef.current = null;
  };
  
  // Set up audio context and analyzer - in Chrome this will be called 
  // after permission is granted by the user interaction in the parent component
  const setupAudio = async () => {
    try {
      if (setupAttemptedRef.current && hasError) {
        console.log("Skipping audio visualization setup due to previous error");
        createStaticVisualization();
        return;
      }
      
      setupAttemptedRef.current = true;
      
      // Check if browser supports getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support audio visualization');
      }
      
      // Request microphone access - in Chrome this should only happen after
      // the parent component has already requested permission
      console.log("AudioVisualizer: Requesting microphone access");
      
      // Using basic constraints to avoid issues in Chrome - being less specific for incognito mode
      const constraints: MediaStreamConstraints = {
        audio: {
          // Use ideal constraints rather than required - more likely to work in incognito
          echoCancellation: { ideal: true },
          noiseSuppression: { ideal: true },
          autoGainControl: { ideal: true }
        }
      };
      
      // Use a timeout to detect hanging permission dialogs
      const timeoutPromise = new Promise<MediaStream>((_, reject) => {
        setTimeout(() => reject(new Error('Visualization permission request timed out')), 5000);
      });
      
      // Request the stream with timeout protection
      let stream: MediaStream;
      try {
        stream = await Promise.race([
          navigator.mediaDevices.getUserMedia(constraints),
          timeoutPromise
        ]) as MediaStream;
      } catch (e) {
        if (e instanceof Error && e.message.includes('timed out')) {
          console.log("Permission dialog timed out - using static visualization instead");
          createStaticVisualization();
          return;
        }
        throw e;
      }
      
      streamRef.current = stream;
      
      // Create audio context
      console.log("AudioVisualizer: Creating audio context");
      
      // We need to create a new AudioContext on each attempt in Chrome
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
        } catch (e) {
          console.error("Error closing existing audio context:", e);
        }
      }
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      // Create analyzer with higher sensitivity
      const analyzer = audioContext.createAnalyser();
      analyzer.fftSize = 2048; // Higher resolution
      analyzer.smoothingTimeConstant = 0.6; // Less smoothing for more dynamic visualization
      analyzerRef.current = analyzer;
      
      // Connect stream to analyzer
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyzer);
      
      // Create data array for frequency data
      dataArrayRef.current = new Uint8Array(analyzer.frequencyBinCount);
      
      // Reset error state if we got this far
      setHasError(false);
      
      // Start animation
      updateVisualization();
    } catch (err) {
      console.error('AudioVisualizer: Error setting up audio:', err);
      setHasError(true);
      
      // We won't propagate the error if we're in Chrome and the parent already
      // handles permission errors 
      if (err instanceof Error && onError && (!isChromeRef.current || err.name !== 'NotAllowedError')) {
        onError(err);
      }
      
      cleanupAudio();
      
      // Create static visualization
      createStaticVisualization();
    }
  };
  
  // Update visualization with audio data
  const updateVisualization = () => {
    if (!analyzerRef.current || !dataArrayRef.current) {
      // If we don't have an analyzer, use static visualization
      createStaticVisualization();
      return;
    }
    
    try {
      analyzerRef.current.getByteFrequencyData(dataArrayRef.current);
      const frequencyData = dataArrayRef.current;
      
      // Calculate frequency band levels
      const lowFreq = processFrequencyBand(frequencyData, BANDS.low.min, BANDS.low.max);
      const midFreq = processFrequencyBand(frequencyData, BANDS.mid.min, BANDS.mid.max);
      const highFreq = processFrequencyBand(frequencyData, BANDS.high.min, BANDS.high.max);
      
      // Apply amplification to make visualization more pronounced when active
      const amplifyFactor = isListening ? 1.5 : 1.0;
      
      // Update state with new levels
      setLowFreqLevels(lowFreq.map(v => Math.min(1, v * amplifyFactor)));
      setMidFreqLevels(midFreq.map(v => Math.min(1, v * amplifyFactor)));
      setHighFreqLevels(highFreq.map(v => Math.min(1, v * amplifyFactor)));
      
      // Combine all levels for overall audio visualization
      const combinedLevels = [
        ...lowFreq.map(v => Math.min(1, v * amplifyFactor)), 
        ...midFreq.map(v => Math.min(1, v * amplifyFactor)), 
        ...highFreq.map(v => Math.min(1, v * amplifyFactor))
      ];
      setAudioLevels(combinedLevels);
      
      // Continue animation if still listening
      if (isListening) {
        animationFrameRef.current = requestAnimationFrame(updateVisualization);
      }
    } catch (err) {
      console.error('Error updating visualization:', err);
      createStaticVisualization();
    }
  };
  
  // Process frequency band data with enhanced sensitivity
  const processFrequencyBand = (
    frequencyData: Uint8Array, 
    minFreq: number, 
    maxFreq: number
  ): number[] => {
    try {
      const nyquist = (audioContextRef.current?.sampleRate || 48000) / 2;
      const lowIndex = Math.floor((minFreq / nyquist) * frequencyData.length);
      const highIndex = Math.floor((maxFreq / nyquist) * frequencyData.length);
      
      const bandValues: number[] = [];
      const segments = 10;
      const segmentSize = Math.max(1, Math.floor((highIndex - lowIndex) / segments));
      
      for (let i = 0; i < segments; i++) {
        const startIdx = Math.min(frequencyData.length - 1, Math.max(0, lowIndex + (i * segmentSize)));
        const endIdx = Math.min(frequencyData.length - 1, startIdx + segmentSize);
        
        let sum = 0;
        let count = 0;
        for (let j = startIdx; j <= endIdx; j++) {
          // Apply a non-linear curve to emphasize peaks
          const value = frequencyData[j];
          sum += Math.pow(value / 255, 0.8) * 255;
          count++;
        }
        
        // Normalize to 0-1 range with enhanced low end sensitivity
        const average = count > 0 ? (sum / count / 255) : 0;
        // Add a small base value to ensure bars are always visible
        const enhancedValue = 0.05 + average * 0.95;
        bandValues.push(enhancedValue);
      }
      
      return bandValues;
    } catch (e) {
      console.error("Error processing frequency band:", e);
      return Array(10).fill(0).map(() => 0.05 + Math.random() * 0.2);
    }
  };
  
  // Create static visualization when not listening
  const createStaticVisualization = () => {
    // Create slower, calming wave-like pattern
    const baseAmplitude = 0.12;
    const pulseSpeed = 0.02; // Reduced speed for calmer animation
    
    // Different patterns for each frequency band with slower oscillation
    const lowPattern = Array(10).fill(0).map((_, i) => {
      return baseAmplitude + Math.sin(Date.now() * pulseSpeed * 0.3 + i * 0.2) * 0.08;
    });
    
    const midPattern = Array(10).fill(0).map((_, i) => {
      return baseAmplitude + Math.sin(Date.now() * pulseSpeed * 0.4 + i * 0.25) * 0.06;
    });
    
    const highPattern = Array(10).fill(0).map((_, i) => {
      return baseAmplitude + Math.sin(Date.now() * pulseSpeed * 0.5 + i * 0.3) * 0.04;
    });
    
    // Update state with static pattern
    setLowFreqLevels(lowPattern);
    setMidFreqLevels(midPattern);
    setHighFreqLevels(highPattern);
    
    // Combine all patterns
    const combinedPattern = [...lowPattern, ...midPattern, ...highPattern];
    setAudioLevels(combinedPattern);
    
    // Continue animation at a slower frame rate when not listening
    // This reduces CPU usage and makes the animation less distracting
    timeoutRef.current = setTimeout(() => {
      animationFrameRef.current = requestAnimationFrame(createStaticVisualization);
    }, 100); // Add delay between frames for slower animation
  };
  
  // Set up and clean up audio processing - only when isListening changes
  useEffect(() => {
    // When listening is enabled and we don't have a previous error
    if (isListening && !hasError) {
      setupAudio();
    } else {
      // Make sure we clean up any existing audio resources
      cleanupAudio();
      // Show a nice static visualization
      createStaticVisualization();
    }
    
    // Clean up on unmount or when isListening changes
    return () => {
      cleanupAudio();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isListening]);
  
  // Render visualization bars
  return (
    <div className="audio-visualizer flex justify-center items-center h-24 bg-gray-100 rounded-xl px-2">
      <div className="flex h-full w-full items-end justify-center gap-1 py-2">
        {/* Low frequency bars */}
        {lowFreqLevels.map((level, index) => (
          <div
            key={`low-${index}`}
            className="w-2 bg-red-500 rounded-t"
            style={{
              height: `${Math.max(8, level * 120)}%`,
              opacity: 0.85 + level * 0.15,
              boxShadow: isListening ? `0 0 5px rgba(239, 68, 68, ${level * 0.8})` : 'none',
              transition: 'height 0.08s ease-out'
            }}
          />
        ))}
        
        {/* Mid frequency bars */}
        {midFreqLevels.map((level, index) => (
          <div
            key={`mid-${index}`}
            className="w-2 bg-purple-500 rounded-t"
            style={{
              height: `${Math.max(8, level * 120)}%`,
              opacity: 0.85 + level * 0.15,
              boxShadow: isListening ? `0 0 5px rgba(168, 85, 247, ${level * 0.8})` : 'none',
              transition: 'height 0.08s ease-out'
            }}
          />
        ))}
        
        {/* High frequency bars */}
        {highFreqLevels.map((level, index) => (
          <div
            key={`high-${index}`}
            className="w-2 bg-blue-500 rounded-t"
            style={{
              height: `${Math.max(8, level * 120)}%`,
              opacity: 0.85 + level * 0.15,
              boxShadow: isListening ? `0 0 5px rgba(59, 130, 246, ${level * 0.8})` : 'none',
              transition: 'height 0.08s ease-out'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AudioVisualizer; 