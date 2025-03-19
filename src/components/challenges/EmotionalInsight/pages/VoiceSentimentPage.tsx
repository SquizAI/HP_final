import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import VoiceSentimentAnalyzer, { VoiceSentimentResult } from '../components/VoiceSentimentAnalyzer';
import { EMOTION_EMOJIS } from '../components/EmotionTypes';

const VoiceSentimentPage: React.FC = () => {
  const [voiceSentiment, setVoiceSentiment] = useState<VoiceSentimentResult | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  
  // Audio visualization state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // Handle voice sentiment detection
  const handleVoiceSentimentDetected = (sentiment: VoiceSentimentResult) => {
    setVoiceSentiment(sentiment);
  };
  
  // Handle recording state change
  const handleRecordingStateChange = (recording: boolean) => {
    setIsRecording(recording);
    
    if (recording) {
      startAudioVisualization();
    } else {
      stopAudioVisualization();
    }
  };
  
  // Start audio visualization
  const startAudioVisualization = async () => {
    try {
      if (!canvasRef.current) return;
      
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Initialize audio context and analyzer
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = audioCtx;
      
      // Create analyzer node
      const analyzer = audioCtx.createAnalyser();
      analyzer.fftSize = 2048;
      analyzer.smoothingTimeConstant = 0.8;
      analyzerRef.current = analyzer;
      
      // Connect microphone to analyzer
      const micSource = audioCtx.createMediaStreamSource(stream);
      micSource.connect(analyzer);
      micStreamRef.current = micSource;
      
      // Start visualization loop
      visualize();
    } catch (error) {
      console.error('Error starting audio visualization:', error);
    }
  };
  
  // Stop audio visualization
  const stopAudioVisualization = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    // Clean up audio context
    if (micStreamRef.current) {
      micStreamRef.current.disconnect();
      micStreamRef.current = null;
    }
    
    // Clear canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };
  
  // Visualization loop
  const visualize = () => {
    if (!canvasRef.current || !analyzerRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Get frequency data
    const analyzer = analyzerRef.current;
    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyzer.getByteFrequencyData(dataArray);
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw waveform
    const barWidth = (width / bufferLength) * 2.5;
    let x = 0;
    
    // Create gradient for bars
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, '#8B5CF6');  // Purple
    gradient.addColorStop(0.3, '#3B82F6'); // Blue
    gradient.addColorStop(0.6, '#10B981'); // Green
    gradient.addColorStop(1, '#F59E0B');  // Amber
    
    for (let i = 0; i < bufferLength; i++) {
      const barHeight = dataArray[i] / 255 * height;
      
      // Dynamic opacity based on frequency
      const alpha = Math.min(0.2 + (dataArray[i] / 255) * 0.8, 1);
      
      // Draw bar
      ctx.fillStyle = gradient;
      ctx.globalAlpha = alpha;
      ctx.fillRect(x, height - barHeight, barWidth, barHeight);
      
      x += barWidth + 1;
    }
    
    // Draw circular visualization
    ctx.globalAlpha = 1;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 4;
    
    // Calculate average volume for circle pulse effect
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    const average = sum / bufferLength;
    const scaleFactor = 1 + (average / 255) * 0.5;
    
    // Draw circles
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * scaleFactor, 0, 2 * Math.PI);
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw frequency dots around circle
    for (let i = 0; i < bufferLength; i += 10) {
      const angle = (i / bufferLength) * 2 * Math.PI;
      const amplitude = (dataArray[i] / 255) * (radius * 0.8);
      
      const x = centerX + Math.cos(angle) * (radius + amplitude);
      const y = centerY + Math.sin(angle) * (radius + amplitude);
      
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, 2 * Math.PI);
      ctx.fillStyle = `hsl(${(i / bufferLength) * 360}, 100%, 50%)`;
      ctx.fill();
      
      // Connect dots to center
      if (i % 30 === 0) {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = `hsla(${(i / bufferLength) * 360}, 100%, 50%, 0.3)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
    
    // Continue animation loop
    animationFrameRef.current = requestAnimationFrame(visualize);
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopAudioVisualization();
    };
  }, []);
  
  // Render voice sentiment chart
  const renderVoiceSentimentChart = () => {
    if (!voiceSentiment) return null;
    
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg shadow-inner">
        <h3 className="font-medium text-sm text-gray-700 mb-3">Voice Sentiment Analysis:</h3>
        <div className="space-y-3">
          {Object.entries(voiceSentiment.emotions)
            .sort(([, a], [, b]) => b - a)
            .map(([emotion, value]) => {
              const emotionInfo = EMOTION_EMOJIS[emotion] || EMOTION_EMOJIS.neutral;
              return (
                <div key={emotion} className="relative">
                  <div className="flex items-center mb-1">
                    <div className="mr-2 w-6 text-center">{emotionInfo.emoji}</div>
                    <span className="text-sm capitalize">{emotion}</span>
                    <span className="ml-auto text-xs font-medium">{Math.round(value * 100)}%</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ 
                        width: `${Math.round(value * 100)}%`,
                        backgroundColor: emotionInfo.color 
                      }}
                    ></div>
                  </div>
                  <div className="absolute top-0 bottom-0 left-0 h-full" style={{
                    width: `${voiceSentiment.audioFeatures?.volume ? Math.round(voiceSentiment.audioFeatures.volume * 100) : 0}%`,
                    borderRight: '2px dashed rgba(0,0,0,0.3)',
                    pointerEvents: 'none'
                  }}></div>
                </div>
              );
            })}
        </div>
        {voiceSentiment.audioFeatures && (
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="p-2 bg-blue-50 rounded text-center">
              <div className="text-xs text-blue-700 mb-1">Volume</div>
              <div className="font-medium">{Math.round(voiceSentiment.audioFeatures.volume * 100)}%</div>
            </div>
            <div className="p-2 bg-purple-50 rounded text-center">
              <div className="text-xs text-purple-700 mb-1">Pitch</div>
              <div className="font-medium">{Math.round(voiceSentiment.audioFeatures.pitch * 100)}%</div>
            </div>
            <div className="p-2 bg-green-50 rounded text-center">
              <div className="text-xs text-green-700 mb-1">Rate</div>
              <div className="font-medium">{Math.round(voiceSentiment.audioFeatures.speakingRate * 100)}%</div>
            </div>
            <div className="p-2 bg-yellow-50 rounded text-center">
              <div className="text-xs text-yellow-700 mb-1">Pauses</div>
              <div className="font-medium">{voiceSentiment.audioFeatures.pauses}</div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // Render voice spectrum visualization
  const renderVoiceSpectrumVisualization = () => {
    return (
      <div className="mt-6 relative">
        <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded z-10">
          {isRecording ? "Recording audio..." : "Visualization paused"}
        </div>
        <canvas 
          ref={canvasRef} 
          className="w-full h-48 rounded-lg shadow-inner bg-gradient-to-r from-gray-900 to-gray-800"
        ></canvas>
        <div className="flex justify-between text-xs text-gray-500 mt-1 px-2">
          <span>Low Frequency</span>
          <span>High Frequency</span>
        </div>
      </div>
    );
  };
  
  // Render 3D emotion plot
  const render3DEmotionPlot = () => {
    if (!voiceSentiment) return null;
    
    // Calculate positions on 3D plot
    // X-axis: Valence (negative to positive)
    // Y-axis: Arousal (calm to excited)
    // Z-axis: Dominance (submissive to dominant)
    const valence = calculateValence(voiceSentiment.emotions);
    const arousal = calculateArousal(voiceSentiment.emotions);
    
    // Convert to percentage for positioning
    const xPos = ((valence + 1) / 2) * 100; // Convert -1 to 1 range to 0-100%
    const yPos = ((arousal + 1) / 2) * 100; // Convert -1 to 1 range to 0-100%
    
    // Get dominant emotion
    const dominantEmotion = voiceSentiment.dominantEmotion;
    const emotionInfo = EMOTION_EMOJIS[dominantEmotion] || EMOTION_EMOJIS.neutral;
    
    // 3D plot dimensions
    const plotWidth = 300;
    const plotHeight = 300;
    
    return (
      <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-inner">
        <h3 className="font-medium text-sm text-gray-700 mb-4">Emotion Circumplex Model:</h3>
        <div className="relative mx-auto" style={{ width: `${plotWidth}px`, height: `${plotHeight}px` }}>
          {/* Background grid */}
          <div className="absolute inset-0 border border-gray-300 rounded-lg grid grid-cols-4 grid-rows-4">
            {[...Array(16)].map((_, i) => (
              <div key={i} className="border border-gray-200"></div>
            ))}
          </div>
          
          {/* Axis labels */}
          <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 text-xs font-medium text-gray-500 mt-1">Negative</div>
          <div className="absolute left-1/2 top-0 transform -translate-x-1/2 text-xs font-medium text-gray-500 mt-1">Positive</div>
          <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -rotate-90 text-xs font-medium text-gray-500 mt-1">Low Energy</div>
          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 rotate-90 text-xs font-medium text-gray-500 mt-1">High Energy</div>
          
          {/* Emotion marker */}
          <div 
            className="absolute flex items-center justify-center w-12 h-12 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500" 
            style={{ 
              left: `${xPos}%`, 
              top: `${yPos}%`,
              filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.3))'
            }}
          >
            <div className="relative">
              <div className="text-3xl">{emotionInfo.emoji}</div>
              <div 
                className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-center text-xs font-medium bg-white bg-opacity-90 rounded-full px-2 py-0.5 whitespace-nowrap shadow-sm"
                style={{ color: emotionInfo.color }}
              >
                {dominantEmotion}
              </div>
            </div>
          </div>
          
          {/* Quadrant labels */}
          <div className="absolute top-1/4 left-1/4 text-xs text-gray-400">Sad / Depressed</div>
          <div className="absolute top-1/4 right-1/4 text-xs text-gray-400">Excited / Elated</div>
          <div className="absolute bottom-1/4 left-1/4 text-xs text-gray-400">Relaxed / Calm</div>
          <div className="absolute bottom-1/4 right-1/4 text-xs text-gray-400">Frustrated / Angry</div>
          
          {/* Target circle */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-full"></div>
          </div>
        </div>
        <div className="text-xs text-center text-gray-500 mt-4">
          This chart plots emotions along two dimensions: valence (horizontal, positive/negative) and arousal (vertical, high/low energy).
        </div>
      </div>
    );
  };
  
  // Calculate valence (positive/negative) from emotions
  const calculateValence = (emotions: Record<string, number>): number => {
    let positive = (emotions.happy || 0) + (emotions.surprised || 0) * 0.5;
    let negative = (emotions.sad || 0) + (emotions.angry || 0) + (emotions.fearful || 0) + (emotions.disgusted || 0);
    
    // Normalize to -1 to 1 range
    return positive - negative;
  };
  
  // Calculate arousal (calm/excited) from emotions
  const calculateArousal = (emotions: Record<string, number>): number => {
    let highArousal = (emotions.happy || 0) * 0.7 + (emotions.angry || 0) + (emotions.surprised || 0) + (emotions.fearful || 0);
    let lowArousal = (emotions.sad || 0) + (emotions.neutral || 0) * 0.5;
    
    // Normalize to -1 to 1 range
    return highArousal - lowArousal;
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 min-h-screen">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Voice Sentiment Analysis</h1>
          <div className="flex space-x-4">
            <Link to="/challenge/multi-modal-sentiment" className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition">
              Multi-Modal Analysis
            </Link>
          </div>
        </div>
        <p className="mt-4 text-gray-600 max-w-3xl">
          Analyze the emotional content of your voice. This technology examines acoustic features like pitch, volume, 
          speaking rate, and pauses to identify emotional states.
        </p>
      </header>
      
      {/* Controls */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            showExplanation 
              ? 'bg-orange-500 text-white shadow-md' 
              : 'bg-white text-gray-700 border border-gray-300'
          }`}
        >
          {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Voice Sentiment Analysis */}
        <div>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 pb-4 border-b bg-gradient-to-r from-amber-50 to-yellow-50">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <span className="text-2xl mr-2">🔊</span> Voice Sentiment Analysis
              </h2>
              <p className="text-gray-600 mt-1">
                Your voice carries emotional cues through tone, pitch, and rhythm. Record your voice to analyze.
              </p>
            </div>
            
            <div className="p-6">
              <VoiceSentimentAnalyzer 
                onSentimentDetected={handleVoiceSentimentDetected}
                onRecordingStateChange={handleRecordingStateChange}
              />
              
              {/* Audio Spectrum Visualization */}
              {renderVoiceSpectrumVisualization()}
            </div>
          </div>
        </div>
        
        {/* Results & Explanation */}
        <div className="space-y-6">
          {voiceSentiment && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 pb-4 border-b bg-gradient-to-r from-yellow-50 to-orange-50">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <span className="text-2xl mr-2">📊</span> Voice Analysis Results
                </h2>
                <p className="text-gray-600 mt-1">
                  Detailed breakdown of the detected sentiment in your voice.
                </p>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-center mb-6">
                  <div className="text-center">
                    <div className="text-7xl mb-3">
                      {EMOTION_EMOJIS[voiceSentiment.dominantEmotion]?.emoji || EMOTION_EMOJIS.neutral.emoji}
                    </div>
                    <h3 className="text-xl font-semibold capitalize">
                      {voiceSentiment.dominantEmotion}
                    </h3>
                    <p className="text-gray-500 mt-1">
                      {Math.round(voiceSentiment.confidence * 100)}% confidence
                    </p>
                  </div>
                </div>
                
                {/* Emotion Circumplex Model */}
                {render3DEmotionPlot()}
                
                {/* Traditional bar chart */}
                {renderVoiceSentimentChart()}
              </div>
            </div>
          )}
          
          {showExplanation && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 pb-4 border-b bg-gradient-to-r from-orange-50 to-amber-50">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <span className="text-2xl mr-2">🧠</span> How It Works
                </h2>
                <p className="text-gray-600 mt-1">
                  Learn about the technology behind voice sentiment analysis.
                </p>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Voice Sentiment Analysis</h3>
                  <p className="text-gray-700 mb-4">
                    Voice sentiment analysis examines acoustic features of speech to identify emotional states.
                    Unlike text analysis, which focuses on words, voice analysis can detect emotions through
                    tone, pitch, volume, and rhythm patterns.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">🔊</span>
                      <h4 className="font-medium">Volume Analysis</h4>
                    </div>
                    <p className="text-sm text-gray-700">
                      Measures the loudness of speech. Higher volume often correlates with anger, excitement, or happiness,
                      while lower volume may indicate sadness or fear.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">🎵</span>
                      <h4 className="font-medium">Pitch Analysis</h4>
                    </div>
                    <p className="text-sm text-gray-700">
                      Examines the frequency of vocal sounds. Higher pitch might suggest excitement or fear,
                      while lower pitch could indicate calmness or sadness.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">⏱️</span>
                      <h4 className="font-medium">Speaking Rate</h4>
                    </div>
                    <p className="text-sm text-gray-700">
                      Measures how quickly someone speaks. Faster rates may indicate excitement or anxiety,
                      while slower rates could suggest sadness or thoughtfulness.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">⏸️</span>
                      <h4 className="font-medium">Pause Analysis</h4>
                    </div>
                    <p className="text-sm text-gray-700">
                      Examines the frequency and duration of pauses. More pauses might indicate uncertainty or
                      thoughtfulness, while fewer pauses could suggest confidence or excitement.
                    </p>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold mb-2">Applications</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-amber-50 p-3 rounded-lg text-center">
                    <span className="text-2xl block mb-1">🧠</span>
                    <span className="text-sm font-medium">Mental Health Monitoring</span>
                  </div>
                  <div className="bg-amber-50 p-3 rounded-lg text-center">
                    <span className="text-2xl block mb-1">🎯</span>
                    <span className="text-sm font-medium">Customer Service Quality</span>
                  </div>
                  <div className="bg-amber-50 p-3 rounded-lg text-center">
                    <span className="text-2xl block mb-1">🤖</span>
                    <span className="text-sm font-medium">Voice Assistants</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceSentimentPage; 