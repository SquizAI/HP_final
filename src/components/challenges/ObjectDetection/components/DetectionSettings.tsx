import React from 'react';
import { Sliders } from 'lucide-react';

interface DetectionSettingsProps {
  confidenceThreshold: number;
  onConfidenceChange: (value: number) => void;
}

const DetectionSettings: React.FC<DetectionSettingsProps> = ({ 
  confidenceThreshold, 
  onConfidenceChange 
}) => {
  return (
    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
      <h4 className="text-sm font-medium text-gray-700 flex items-center mb-3">
        <Sliders size={14} className="mr-1" />
        Detection Settings
      </h4>
      
      <div className="space-y-3">
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="confidence-threshold" className="text-xs text-gray-600">
              Confidence Threshold: {Math.round(confidenceThreshold * 100)}%
            </label>
            <span className="text-xs text-indigo-600">
              {confidenceThreshold < 0.3 ? 'More Objects (Lower Accuracy)' : 
               confidenceThreshold > 0.7 ? 'Fewer Objects (Higher Accuracy)' : 
               'Balanced'}
            </span>
          </div>
          <input
            id="confidence-threshold"
            type="range"
            min="0.1"
            max="0.9"
            step="0.05"
            value={confidenceThreshold}
            onChange={(e) => onConfidenceChange(parseFloat(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>10%</span>
            <span>50%</span>
            <span>90%</span>
          </div>
        </div>
        
        <div className="text-xs text-gray-600 bg-indigo-50 p-2 rounded">
          <p className="flex items-start">
            <span className="font-bold mr-1">Tip:</span>
            Lowering the threshold finds more objects but may include false positives. 
            Raising it shows only high-confidence detections.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DetectionSettings; 