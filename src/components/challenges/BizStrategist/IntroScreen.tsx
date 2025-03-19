import React from 'react';

interface IntroScreenProps {
  onNext: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onNext }) => {
  return (
    <div className="p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[#0097A7] mb-2">
          AI Business Strategist Challenge
        </h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Develop a data-driven business strategy using financial analysis and AI insights
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Challenge Description */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-[#0097A7] mb-4">
            About This Challenge
          </h2>
          <p className="text-gray-700 mb-4">
            As a business leader, making strategic decisions requires analyzing financial data, understanding market trends, and evaluating potential risks and opportunities. In this challenge, you'll use AI-powered tools to develop a comprehensive business strategy based on financial data.
          </p>
          <p className="text-gray-700">
            You'll analyze financial trends, identify strategic opportunities, make evidence-based recommendations, and test different scenarios to create a robust strategy for business success.
          </p>
        </div>
        
        {/* AI Tools Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-[#0097A7] mb-4">
            AI Tools You'll Use
          </h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-12 h-12 rounded-full bg-[#E0F7FA] flex items-center justify-center text-[#0097A7] text-xl flex-shrink-0 mr-4">
                📊
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">Financial Data Analyzer</h3>
                <p className="text-gray-600 text-sm">
                  AI-powered analysis of financial metrics, identifying trends, anomalies, and opportunities in your business data.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-12 h-12 rounded-full bg-[#E0F7FA] flex items-center justify-center text-[#0097A7] text-xl flex-shrink-0 mr-4">
                🧠
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">Strategic Recommendation Engine</h3>
                <p className="text-gray-600 text-sm">
                  Generate data-driven strategy recommendations based on financial insights, market analysis, and industry best practices.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-12 h-12 rounded-full bg-[#E0F7FA] flex items-center justify-center text-[#0097A7] text-xl flex-shrink-0 mr-4">
                🧪
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">Scenario Testing Simulator</h3>
                <p className="text-gray-600 text-sm">
                  Test your strategy against different scenarios to identify risks and opportunities under various market conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Challenge Steps */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-[#0097A7] mb-4">
            Challenge Steps
          </h2>
          <ol className="space-y-4">
            <li className="flex">
              <div className="w-8 h-8 rounded-full bg-[#0097A7] text-white flex items-center justify-center font-medium flex-shrink-0 mr-3">
                1
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">Analyze Financial Data</h3>
                <p className="text-gray-600 text-sm">
                  Examine quarterly financial data, identify key trends, and get AI-powered insights to inform your strategic decisions.
                </p>
              </div>
            </li>
            <li className="flex">
              <div className="w-8 h-8 rounded-full bg-[#0097A7] text-white flex items-center justify-center font-medium flex-shrink-0 mr-3">
                2
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">Review Market Analysis</h3>
                <p className="text-gray-600 text-sm">
                  Get AI-generated market insights relevant to your industry and business goals, and select the most important factors for your strategy.
                </p>
              </div>
            </li>
            <li className="flex">
              <div className="w-8 h-8 rounded-full bg-[#0097A7] text-white flex items-center justify-center font-medium flex-shrink-0 mr-3">
                3
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">Develop Your Strategy</h3>
                <p className="text-gray-600 text-sm">
                  Select strategic elements that address your financial goals and market opportunities, creating a comprehensive business strategy.
                </p>
              </div>
            </li>
            <li className="flex">
              <div className="w-8 h-8 rounded-full bg-[#0097A7] text-white flex items-center justify-center font-medium flex-shrink-0 mr-3">
                4
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">Assess Strategy Performance</h3>
                <p className="text-gray-600 text-sm">
                  Receive an AI-generated SWOT analysis and scenario testing results to evaluate the strengths and potential risks of your strategy.
                </p>
              </div>
            </li>
          </ol>
        </div>
        
        {/* Pro Tips */}
        <div className="bg-yellow-50 p-6 rounded-lg">
          <h2 className="flex items-center font-semibold text-yellow-800 mb-3">
            <span className="text-xl mr-2">💡</span> Pro Tip
          </h2>
          <p className="text-yellow-700 mb-2">
            The most successful strategies are grounded in data but enhanced by human judgment. Use the AI tools to identify patterns and opportunities in the financial data, but bring your own expertise to the final decisions.
          </p>
          <p className="text-yellow-700">
            Remember to consider both short-term financial goals and long-term strategic positioning when making your recommendations.
          </p>
        </div>
        
        {/* Extra Challenge Options */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-[#0097A7] mb-4">
            Extra Challenge Options
          </h2>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="text-[#0097A7] mr-2">•</div>
              <div>
                <h3 className="font-medium text-gray-800">Competitive Comparison</h3>
                <p className="text-gray-600 text-sm">
                  Ask the AI to analyze how your strategy compares to typical approaches in your industry, and identify potential competitive advantages.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="text-[#0097A7] mr-2">•</div>
              <div>
                <h3 className="font-medium text-gray-800">Scenario Testing</h3>
                <p className="text-gray-600 text-sm">
                  Use the AI to test how your strategy would perform under specific market conditions, such as economic downturns or rapid growth.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Start Button */}
        <div className="flex justify-center pt-4 pb-8">
          <button 
            className="px-8 py-3 bg-[#0097A7] text-white rounded-md font-medium hover:bg-[#00838F] transition-colors"
            onClick={onNext}
          >
            Start the Challenge
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntroScreen; 