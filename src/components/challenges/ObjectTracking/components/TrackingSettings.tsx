import React from 'react';
import { Sliders, Target, Eye, Award } from 'lucide-react';

interface TrackingSettingsProps {
  confidenceThreshold: number;
  setConfidenceThreshold: (value: number) => void;
  showPaths: boolean;
  setShowPaths: (show: boolean) => void;
  showLabels: boolean;
  setShowLabels: (show: boolean) => void;
  businessCase: string;
  setBusinessCase: (value: string) => void;
  isCompleted: boolean;
  handleCompleteChallenge: () => void;
}

const TrackingSettings: React.FC<TrackingSettingsProps> = ({
  confidenceThreshold,
  setConfidenceThreshold,
  showPaths,
  setShowPaths,
  showLabels,
  setShowLabels,
  businessCase,
  setBusinessCase,
  isCompleted,
  handleCompleteChallenge
}) => {
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="mb-4 flex items-center">
        <Target className="w-5 h-5 text-indigo-600 mr-2" />
        <h3 className="text-lg font-medium">Tracking Settings & Challenge Completion</h3>
      </div>
      
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="text-md font-medium text-gray-800 mb-3">Detection Settings</h4>
          
          {/* Confidence Threshold */}
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <label htmlFor="confidence" className="text-sm font-medium text-gray-700">
                Confidence Threshold: {confidenceThreshold.toFixed(2)}
              </label>
            </div>
            <input
              id="confidence"
              type="range"
              min="0.1"
              max="0.9"
              step="0.05"
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Low Confidence</span>
              <span>High Confidence</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Adjust to filter out low-confidence detections. Higher values mean fewer but more accurate detections.
            </p>
          </div>
          
          {/* Show Paths */}
          <div className="flex items-center justify-between mb-3">
            <label htmlFor="paths-toggle" className="text-sm font-medium text-gray-700">
              Show Tracking Paths
            </label>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                id="paths-toggle"
                checked={showPaths}
                onChange={(e) => setShowPaths(e.target.checked)}
                className="absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer right-0 z-[1] border-gray-300 transition-all duration-300 checked:right-0 checked:border-indigo-600"
              />
              <label
                htmlFor="paths-toggle"
                className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-all duration-300 ${
                  showPaths ? 'bg-indigo-500' : 'bg-gray-300'
                }`}
              ></label>
            </div>
          </div>
          
          {/* Show Labels */}
          <div className="flex items-center justify-between">
            <label htmlFor="labels-toggle" className="text-sm font-medium text-gray-700">
              Show Labels
            </label>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                id="labels-toggle"
                checked={showLabels}
                onChange={(e) => setShowLabels(e.target.checked)}
                className="absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer right-0 z-[1] border-gray-300 transition-all duration-300 checked:right-0 checked:border-indigo-600"
              />
              <label
                htmlFor="labels-toggle"
                className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-all duration-300 ${
                  showLabels ? 'bg-indigo-500' : 'bg-gray-300'
                }`}
              ></label>
            </div>
          </div>
        </div>
        
        {/* Business application input */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="text-md font-medium text-gray-800 mb-3">Business Application</h4>
          <p className="text-sm text-gray-600 mb-3">
            Describe how this tracking technology could be applied in a business context:
          </p>
          <textarea
            value={businessCase}
            onChange={(e) => setBusinessCase(e.target.value)}
            placeholder="Example: Retail stores could track customer movement patterns to optimize product placement and store layout."
            className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            disabled={isCompleted}
          />
          
          {/* Challenge completion button */}
          {!isCompleted ? (
            <button
              onClick={handleCompleteChallenge}
              className="mt-4 w-full py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
              disabled={businessCase.trim().length === 0}
            >
              <Award className="w-5 h-5 mr-2" />
              Complete Challenge
            </button>
          ) : (
            <div className="mt-4 p-3 bg-green-50 text-green-800 rounded-lg flex items-center">
              <Award className="w-5 h-5 mr-2 text-green-600" />
              <span>Challenge completed! Well done!</span>
            </div>
          )}
        </div>
        
        {/* Tech explainer */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h4 className="text-md font-medium text-blue-800 mb-2">How Object Tracking Works</h4>
          <p className="text-sm text-blue-700 mb-2">
            Object tracking extends simple detection by following objects across multiple frames:
          </p>
          <ol className="list-decimal pl-5 text-sm text-blue-700 space-y-1">
            <li>Each frame is analyzed by a neural network to detect objects</li>
            <li>Detected objects are matched across frames using position and appearance</li>
            <li>Objects are assigned unique IDs and movement paths are recorded</li>
            <li>The system handles occlusions and temporary disappearances</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TrackingSettings; 