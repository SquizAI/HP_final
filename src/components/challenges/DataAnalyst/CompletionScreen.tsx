import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DataAnalystState } from './DataAnalystMain';

interface CompletionScreenProps {
  state: DataAnalystState;
  onRestart: () => void;
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({ state, onRestart }) => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="flex flex-col items-center mb-10 text-center">
        <div className="mb-5">
          <div className="inline-flex p-4 rounded-full bg-purple-100">
            <div className="text-purple-800 text-5xl">🎉</div>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Analysis Complete!</h1>
        <p className="text-xl text-gray-600 max-w-xl">
          You've successfully analyzed the {state.datasetName} dataset and answered your business question.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Analysis Summary</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 flex items-center mb-3">
            <span className="text-purple-600 mr-2">📊</span> Business Question
          </h3>
          <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
            {state.businessQuestion}
          </p>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 flex items-center mb-3">
            <span className="text-purple-600 mr-2">📈</span> Key Metrics Tracked
          </h3>
          <div className="space-y-2">
            {state.keyMetrics.map((metric, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-700">{metric}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 flex items-center mb-3">
            <span className="text-purple-600 mr-2">🧩</span> Key Insights
          </h3>
          <div className="space-y-3">
            {state.insights.map((insight, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-1">{insight.title}</h4>
                <p className="text-gray-700">{insight.description}</p>
                <div className="mt-2 flex items-center">
                  <span className={`text-xs px-2 py-1 rounded-full mr-2 ${
                    insight.importance === 'high' ? 'bg-red-100 text-red-800' :
                    insight.importance === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    Importance: {insight.importance}
                  </span>
                  <span className="text-xs text-gray-500">Confidence: {insight.confidence}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 flex items-center mb-3">
            <span className="text-purple-600 mr-2">⚡</span> Recommended Actions
          </h3>
          <div className="space-y-2">
            {state.actionItems.map((action, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <p className="text-gray-700">{action}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold text-purple-800 mb-3">What You've Learned</h2>
        <ul className="space-y-2">
          <li className="flex items-start text-gray-700">
            <span className="text-purple-600 mr-2">✓</span> 
            How to explore and understand complex datasets
          </li>
          <li className="flex items-start text-gray-700">
            <span className="text-purple-600 mr-2">✓</span> 
            Identifying key metrics that drive business value
          </li>
          <li className="flex items-start text-gray-700">
            <span className="text-purple-600 mr-2">✓</span> 
            Creating effective visualizations to communicate data insights
          </li>
          <li className="flex items-start text-gray-700">
            <span className="text-purple-600 mr-2">✓</span> 
            Generating actionable insights from data analysis
          </li>
          <li className="flex items-start text-gray-700">
            <span className="text-purple-600 mr-2">✓</span> 
            Using AI tools to enhance your data analysis capabilities
          </li>
        </ul>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
        <button
          className="px-6 py-3 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700 transition-colors"
          onClick={onRestart}
        >
          Analyze Another Dataset
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