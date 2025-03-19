import React from 'react';

interface DebugPanelProps {
  debugMode: boolean;
  detectionAttempts: number;
  lastDetectionTime: Date | null;
  currentEmotion: string;
  currentConfidence: number;
  isMirrorMode: boolean;
  isEducationalMode: boolean;
  videoWidth: number;
  videoHeight: number;
}

const DebugPanel: React.FC<DebugPanelProps> = ({
  debugMode,
  detectionAttempts,
  lastDetectionTime,
  currentEmotion,
  currentConfidence,
  isMirrorMode,
  isEducationalMode,
  videoWidth,
  videoHeight
}) => {
  if (!debugMode) return null;
  
  return (
    <div className="mt-4 p-3 bg-gray-900 text-white text-xs font-mono rounded overflow-x-auto">
      <h3 className="text-green-400 font-bold pb-1 border-b border-gray-700 mb-2">Debug Information</h3>
      <div className="grid grid-cols-1 gap-1">
        <p>Current Emotion: <span className="text-yellow-300">{currentEmotion} ({(currentConfidence * 100).toFixed(1)}%)</span></p>
        <p>Detection Attempts: <span className="text-yellow-300">{detectionAttempts}</span></p>
        <p>Last Detection: <span className="text-yellow-300">{lastDetectionTime ? lastDetectionTime.toLocaleTimeString() : 'Never'}</span></p>
        <p>Mirror Mode: <span className="text-yellow-300">{isMirrorMode ? 'Active' : 'Inactive'}</span></p>
        <p>Educational Mode: <span className="text-yellow-300">{isEducationalMode ? 'Active' : 'Inactive'}</span></p>
        <p>Video Dimensions: <span className="text-yellow-300">{videoWidth} x {videoHeight}</span></p>
      </div>
      <div className="mt-2 pt-2 border-t border-gray-700">
        <p className="text-orange-400">If no face is detected, try:</p>
        <ul className="list-disc list-inside text-gray-400 mt-1">
          <li>Improving lighting conditions</li>
          <li>Positioning your face clearly in frame</li>
          <li>Reducing background distractions</li>
          <li>Moving closer to the camera</li>
        </ul>
      </div>
    </div>
  );
};

export default DebugPanel; 