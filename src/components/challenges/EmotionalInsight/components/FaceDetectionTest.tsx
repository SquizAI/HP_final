import React, { useState } from 'react';
import FaceEmotionDetector from './FaceEmotionDetector';
import EmotionDisplay from './EmotionDisplay';
import DebugPanel from './DebugPanel';

const FaceDetectionTest: React.FC = () => {
  // Face detection state
  const [currentEmotion, setCurrentEmotion] = useState<string>('neutral');
  const [emotionConfidence, setEmotionConfidence] = useState<number>(0);
  const [detectionAttempts, setDetectionAttempts] = useState<number>(0);
  const [lastDetectionTime, setLastDetectionTime] = useState<Date | null>(null);
  
  // Mode toggles
  const [debugMode, setDebugMode] = useState<boolean>(true);
  const [mirrorMode, setMirrorMode] = useState<boolean>(false);
  
  // Video dimensions
  const [videoWidth, setVideoWidth] = useState<number>(0);
  const [videoHeight, setVideoHeight] = useState<number>(0);

  // Handle emotion detection from FaceEmotionDetector
  const handleEmotionDetected = (emotion: string, confidence: number) => {
    setCurrentEmotion(emotion);
    setEmotionConfidence(confidence);
    setLastDetectionTime(new Date());
    if (videoWidth === 0 && videoHeight === 0) {
      const video = document.querySelector('video');
      if (video) {
        setVideoWidth(video.videoWidth);
        setVideoHeight(video.videoHeight);
      }
    }
  };

  // Track detection attempts
  const handleDetectionAttempt = () => {
    setDetectionAttempts(prev => prev + 1);
  };

  // Handle successful detection
  const handleDetectionSuccess = () => {
    console.log(`Detection success: ${currentEmotion}`);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Face Detection Test</h1>
      
      <div className="mb-6 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
        <p className="text-blue-700">
          This is a test component to verify face detection functionality.
          The debug panel is enabled by default to provide detailed information.
        </p>
      </div>
      
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="debug-mode"
            checked={debugMode}
            onChange={() => setDebugMode(!debugMode)}
            className="h-4 w-4 text-blue-600"
          />
          <label htmlFor="debug-mode" className="text-sm text-gray-700">Debug Mode</label>
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="mirror-mode"
            checked={mirrorMode}
            onChange={() => setMirrorMode(!mirrorMode)}
            className="h-4 w-4 text-blue-600"
          />
          <label htmlFor="mirror-mode" className="text-sm text-gray-700">Mirror Mode</label>
        </div>
      </div>
      
      <div className="mb-6">
        <FaceEmotionDetector
          onEmotionDetected={handleEmotionDetected}
          debugMode={debugMode}
          isMirrorMode={mirrorMode}
          onDetectionAttempt={handleDetectionAttempt}
          onDetectionSuccess={handleDetectionSuccess}
        />
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <h2 className="font-semibold mb-2">Current Detection:</h2>
        <p className="mb-1">Emotion: <span className="font-mono">{currentEmotion}</span></p>
        <p className="mb-1">Confidence: <span className="font-mono">{(emotionConfidence * 100).toFixed(1)}%</span></p>
        <p className="mb-1">Attempts: <span className="font-mono">{detectionAttempts}</span></p>
        <p>Last Detection: <span className="font-mono">{lastDetectionTime ? lastDetectionTime.toLocaleTimeString() : 'Never'}</span></p>
      </div>
      
      <EmotionDisplay
        currentEmotion={currentEmotion}
        confidence={emotionConfidence}
        isMirrorMode={mirrorMode}
      />
      
      <DebugPanel
        debugMode={debugMode}
        detectionAttempts={detectionAttempts}
        lastDetectionTime={lastDetectionTime}
        currentEmotion={currentEmotion}
        currentConfidence={emotionConfidence}
        isMirrorMode={mirrorMode}
        isEducationalMode={false}
        videoWidth={videoWidth}
        videoHeight={videoHeight}
      />
    </div>
  );
};

export default FaceDetectionTest; 