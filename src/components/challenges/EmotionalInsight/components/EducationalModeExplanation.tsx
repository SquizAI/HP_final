import React from 'react';
import { EDUCATIONAL_CONTENT } from './EmotionTypes';

const EducationalModeExplanation: React.FC = () => (
  <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
    <h3 className="text-lg font-semibold text-indigo-800 mb-3">{EDUCATIONAL_CONTENT.intro.title}</h3>
    <p className="text-indigo-700 mb-4">{EDUCATIONAL_CONTENT.intro.description}</p>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      {EDUCATIONAL_CONTENT.steps.map((step, index) => (
        <div key={index} className="bg-white rounded-lg p-3 shadow-sm border border-blue-100">
          <div className="flex items-start">
            <span className="text-2xl mr-2" role="img" aria-label={step.title}>
              {step.icon}
            </span>
            <div>
              <h4 className="font-medium text-indigo-900">{step.title}</h4>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
    
    <h3 className="text-lg font-semibold text-indigo-800 mb-3">Key Facial Features for Emotion Detection</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {EDUCATIONAL_CONTENT.facialFeatures.map((feature, index) => (
        <div key={index} className="flex items-start bg-white bg-opacity-60 p-2 rounded">
          <span className="text-xl mr-2" role="img" aria-label={feature.feature}>
            {feature.icon}
          </span>
          <div>
            <h4 className="font-medium text-gray-800">{feature.feature}</h4>
            <p className="text-xs text-gray-600">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default EducationalModeExplanation; 