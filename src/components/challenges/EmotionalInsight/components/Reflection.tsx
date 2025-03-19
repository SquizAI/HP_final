import React, { useState } from 'react';

type EmotionType = 'joy' | 'sadness' | 'anger' | 'fear' | 'surprise' | 'disgust' | 'neutral' | 'contempt';

interface EmotionAnalysis {
  primaryEmotion: EmotionType;
  confidence: number;
  secondaryEmotions: Array<{
    emotion: EmotionType;
    confidence: number;
  }>;
  timestamp: string;
}

interface ReflectionProps {
  analysis: EmotionAnalysis;
  onSubmit: (accuracy: 'high' | 'medium' | 'low', reasons: string, businessApplication: string) => void;
  onBack: () => void;
}

const Reflection: React.FC<ReflectionProps> = ({
  analysis,
  onSubmit,
  onBack
}) => {
  const [accuracy, setAccuracy] = useState<'high' | 'medium' | 'low' | null>(null);
  const [reasons, setReasons] = useState('');
  const [businessApplication, setBusinessApplication] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accuracy) {
      alert('Please select an accuracy level');
      return;
    }
    
    onSubmit(accuracy, reasons, businessApplication);
  };
  
  // Get color based on accuracy
  const getAccuracyColor = (value: 'high' | 'medium' | 'low') => {
    switch (value) {
      case 'high':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Reflect on the Analysis</h2>
      
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-8">
        <p className="text-gray-700 mb-6">
          Now that you've seen the AI's analysis, reflect on how accurate and useful it would be in a real business context.
          This helps develop critical thinking about the capabilities and limitations of emotional AI.
        </p>
        
        <form onSubmit={handleSubmit}>
          {/* Accuracy assessment */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              How accurate do you think the AI's emotion detection was?
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(['high', 'medium', 'low'] as const).map((value) => (
                <div
                  key={value}
                  onClick={() => setAccuracy(value)}
                  className={`
                    border rounded-lg p-4 cursor-pointer text-center
                    ${accuracy === value ? `${getAccuracyColor(value)} ring-2 ring-offset-2` : 'border-gray-200 hover:border-blue-300'}
                  `}
                >
                  <div className="font-medium">
                    {value === 'high' && 'High Accuracy'}
                    {value === 'medium' && 'Medium Accuracy'}
                    {value === 'low' && 'Low Accuracy'}
                  </div>
                  <p className="text-sm mt-1">
                    {value === 'high' && 'The analysis aligned very well with the content'}
                    {value === 'medium' && 'The analysis was somewhat accurate'}
                    {value === 'low' && 'The analysis missed the mark'}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Reasoning */}
          <div className="mb-6">
            <label htmlFor="reasons" className="block text-sm font-medium text-gray-700 mb-2">
              Why do you think the AI was accurate or inaccurate? What might have influenced the results?
            </label>
            <textarea
              id="reasons"
              rows={4}
              value={reasons}
              onChange={(e) => setReasons(e.target.value)}
              placeholder="Consider factors like lighting, voice tone, word choice, context, or potential biases..."
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>
          
          {/* Business application */}
          <div className="mb-6">
            <label htmlFor="business-application" className="block text-sm font-medium text-gray-700 mb-2">
              Describe a specific business scenario where this emotional analysis would be valuable
            </label>
            <textarea
              id="business-application"
              rows={4}
              value={businessApplication}
              onChange={(e) => setBusinessApplication(e.target.value)}
              placeholder="Example: Using emotion detection in customer service calls to prioritize frustrated customers for immediate follow-up..."
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>
          
          {/* Ethical considerations box */}
          <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4 mb-6">
            <h3 className="text-yellow-800 text-sm font-medium flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Ethical Considerations
            </h3>
            <p className="text-sm text-yellow-700 mb-2">
              When implementing emotional AI in business contexts, consider these important ethical factors:
            </p>
            <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
              <li>Obtain clear consent before analyzing people's emotional expressions</li>
              <li>Be transparent about how emotional data will be used</li>
              <li>Ensure privacy and secure storage of sensitive emotional data</li>
              <li>Consider cultural differences in how emotions are expressed</li>
              <li>Avoid making high-stakes decisions based solely on AI emotion detection</li>
            </ul>
          </div>
          
          {/* Submit and back buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Analysis
            </button>
            
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Continue to Applications
              <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Reflection; 