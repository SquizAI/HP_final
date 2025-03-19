import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BizStrategyState } from './BizStrategistMain';

interface CompletionScreenProps {
  state: BizStrategyState;
  restartChallenge: () => void;
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({ state, restartChallenge }) => {
  const navigate = useNavigate();
  
  // Use a simple animation effect instead of confetti
  useEffect(() => {
    // Animation could be added here if needed
  }, []);

  // Get some key strategy elements to highlight
  const highlightElements = state.strategyElements.slice(0, 3);
  
  return (
    <div className="p-6">
      <div className="flex flex-col items-center mb-10 text-center">
        <div className="mb-5">
          <div className="inline-flex p-4 rounded-full bg-[#E0F7FA]">
            <div className="text-[#00838F] text-5xl">🎯</div>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Challenge Complete!</h1>
        <p className="text-xl text-gray-600 max-w-xl">
          You've successfully created a business strategy for {state.businessType} 
          in the {state.industryContext} industry!
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Strategy Summary</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 flex items-center mb-3">
            <span className="text-[#0097A7] mr-2">📋</span> Business Goal
          </h3>
          <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
            {state.businessGoal}
          </p>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 flex items-center mb-3">
            <span className="text-[#0097A7] mr-2">🏢</span> Business Type & Industry
          </h3>
          <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
            {state.businessType} operating in the {state.industryContext} industry
          </p>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 flex items-center mb-3">
            <span className="text-[#0097A7] mr-2">⭐</span> Key Strategic Elements
          </h3>
          <div className="space-y-3">
            {highlightElements.map((element, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 font-medium">{element}</p>
              </div>
            ))}
            {state.strategyElements.length > 3 && (
              <p className="text-gray-500 text-sm">
                And {state.strategyElements.length - 3} more elements...
              </p>
            )}
          </div>
        </div>
        
        {state.analysis && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 flex items-center mb-3">
              <span className="text-[#0097A7] mr-2">📊</span> Strategy Assessment
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-4">
                <div className={`text-xl font-bold mr-2 ${
                  state.analysis.overallScore >= 85 ? 'text-green-600' :
                  state.analysis.overallScore >= 75 ? 'text-blue-600' :
                  state.analysis.overallScore >= 65 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {state.analysis.overallScore}/100
                </div>
                <div className="text-gray-600">Overall Score</div>
              </div>
              <p className="text-gray-700">{state.analysis.summary}</p>
            </div>
          </div>
        )}
        
        {state.assessmentNotes && (
          <div>
            <h3 className="text-lg font-medium text-gray-700 flex items-center mb-3">
              <span className="text-[#0097A7] mr-2">📝</span> Your Strategy Notes
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-line">{state.assessmentNotes}</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-gradient-to-r from-[#E0F7FA] to-[#E0F2F1] p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold text-[#0097A7] mb-3">What You've Learned</h2>
        <ul className="space-y-2">
          <li className="flex items-start text-gray-700">
            <span className="text-[#0097A7] mr-2">✓</span> 
            How to define clear business goals that guide strategy development
          </li>
          <li className="flex items-start text-gray-700">
            <span className="text-[#0097A7] mr-2">✓</span> 
            The importance of selecting strategic elements that work together cohesively
          </li>
          <li className="flex items-start text-gray-700">
            <span className="text-[#0097A7] mr-2">✓</span> 
            How to evaluate the strengths and weaknesses of a business strategy
          </li>
          <li className="flex items-start text-gray-700">
            <span className="text-[#0097A7] mr-2">✓</span> 
            The value of considering alternative approaches and implementation planning
          </li>
          <li className="flex items-start text-gray-700">
            <span className="text-[#0097A7] mr-2">✓</span> 
            Using AI tools to enhance your strategic thinking and planning
          </li>
        </ul>
      </div>
      
      <div className="bg-blue-50 p-6 rounded-lg mb-8">
        <div className="flex items-start">
          <div className="text-blue-500 text-xl mr-3">💡</div>
          <div>
            <h3 className="font-medium text-blue-700 mb-2">Pro Tip</h3>
            <p className="text-blue-800 text-sm">
              The best strategies aren't static documents – they're living frameworks that evolve as conditions change. 
              Consider revisiting your strategy quarterly to ensure it remains relevant and effective.
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
        <button
          className="px-6 py-3 bg-[#0097A7] text-white rounded-md font-medium hover:bg-[#00838F] transition-colors"
          onClick={restartChallenge}
        >
          Try Another Strategy
        </button>
        <button
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          onClick={() => navigate('/challenges')}
        >
          Return to Challenges
        </button>
      </div>
    </div>
  );
};

export default CompletionScreen; 