import React, { useState, useEffect } from 'react';
import { BizStrategyState } from './BizStrategistMain';
import { getApiKey } from '../../../services/openai';

interface StrategyAssessmentProps {
  state: BizStrategyState;
  onBack: () => void;
}

const StrategyAssessment: React.FC<StrategyAssessmentProps> = ({ state, onBack }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [strengths, setStrengths] = useState<string[]>(state.strengths || []);
  const [weaknesses, setWeaknesses] = useState<string[]>(state.weaknesses || []);
  const [opportunities, setOpportunities] = useState<string[]>(state.opportunities || []);
  const [threats, setThreats] = useState<string[]>(state.threats || []);
  const [scenarioResults, setScenarioResults] = useState<any>(state.scenarioResults);

  // Generate SWOT analysis when component mounts
  useEffect(() => {
    if (!strengths.length && !weaknesses.length && state.selectedStrategies.length > 0) {
      generateSWOTAnalysis();
    } else {
      setIsLoading(false);
    }
  }, []);

  const generateSWOTAnalysis = async () => {
    setIsLoading(true);
    
    try {
      const apiKey = getApiKey();
      if (!apiKey) {
        throw new Error('OpenAI API key not found');
      }
      
      // Build a comprehensive prompt based on all state information
      let contextPrompt = `As a strategic business consultant, provide a SWOT analysis for a ${state.businessType} in the ${state.industry} industry with a primary goal of ${state.businessGoal}.`;
      
      // Add financial insights
      if (state.financialInsights && state.financialInsights.length > 0) {
        contextPrompt += `\n\nFinancial insights:\n`;
        state.financialInsights.forEach(insight => {
          contextPrompt += `- ${insight}\n`;
        });
      }
      
      // Add market insights
      if (state.marketInsights && state.marketInsights.length > 0) {
        contextPrompt += `\n\nMarket insights:\n`;
        state.marketInsights.forEach(insight => {
          contextPrompt += `- ${insight}\n`;
        });
      }
      
      // Add user's financial recommendation
      if (state.userRecommendation) {
        contextPrompt += `\n\nThe business leader's financial recommendation:\n"${state.userRecommendation}"\n`;
      }
      
      // Add selected strategies
      contextPrompt += `\n\nSelected strategy elements:\n`;
      state.selectedStrategies.forEach(strategy => {
        contextPrompt += `- ${strategy}\n`;
      });
      
      const prompt = `${contextPrompt}

Based on this information, provide a comprehensive SWOT analysis with:
1. 3-4 key Strengths of the strategy
2. 3-4 key Weaknesses of the strategy
3. 3-4 key Opportunities the strategy can capitalize on
4. 3-4 key Threats that might impact the strategy

Additionally, provide a brief scenario analysis for one best-case and one worst-case scenario related to the strategy implementation.

Format your response in JSON with the following structure:
{
  "strengths": ["strength1", "strength2", ...],
  "weaknesses": ["weakness1", "weakness2", ...],
  "opportunities": ["opportunity1", "opportunity2", ...],
  "threats": ["threat1", "threat2", ...],
  "scenarios": {
    "bestCase": {
      "description": "description of best case scenario",
      "impact": "potential business impact",
      "probability": "low/medium/high"
    },
    "worstCase": {
      "description": "description of worst case scenario",
      "impact": "potential business impact",
      "probability": "low/medium/high"
    }
  }
}`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a strategic business consultant specializing in strategy assessment. You provide clear, data-driven SWOT analyses and scenario evaluations.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          response_format: { type: "json_object" }
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
      }
      
      const data = await response.json();
      const analysisText = data.choices[0].message.content;
      const analysis = JSON.parse(analysisText);
      
      setStrengths(analysis.strengths || []);
      setWeaknesses(analysis.weaknesses || []);
      setOpportunities(analysis.opportunities || []);
      setThreats(analysis.threats || []);
      setScenarioResults(analysis.scenarios || null);
      
    } catch (error) {
      console.error('Error generating SWOT analysis:', error);
      setStrengths(['Failed to generate strengths']);
      setWeaknesses(['Failed to generate weaknesses']);
      setOpportunities(['Failed to generate opportunities']);
      setThreats(['Failed to generate threats']);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="bg-gradient-to-r from-[#E0F7FA] to-[#E0F2F1] p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold text-[#0097A7]">
          Strategy Assessment
        </h2>
        <p className="text-gray-700 mt-2">
          Review the AI-generated assessment of your business strategy, including a SWOT analysis 
          and scenario testing to evaluate potential outcomes.
        </p>
      </div>
      
      {isLoading ? (
        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#0097A7] border-t-transparent mr-3"></div>
          <p className="text-gray-600">Analyzing your strategy...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Selected Strategy Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Your Strategy</h3>
            
            <div className="space-y-6">
                <div>
                <h4 className="font-medium text-gray-700 mb-2">Business Goal</h4>
                <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{state.businessGoal}</p>
                      </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Selected Strategy Elements</h4>
                <div className="space-y-2">
                  {state.selectedStrategies.map((strategy, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-start">
                        <span className="text-[#0097A7] font-bold mr-2">{index + 1}.</span>
                        <span className="text-gray-800">{strategy}</span>
                      </div>
                    </div>
                  ))}
                    </div>
                  </div>
              
              {state.userRecommendation && (
                      <div>
                  <h4 className="font-medium text-gray-700 mb-2">Your Financial Recommendation</h4>
                  <p className="text-gray-800 bg-gray-50 p-3 rounded-lg italic">"{state.userRecommendation}"</p>
                </div>
              )}
            </div>
          </div>
          
          {/* SWOT Analysis */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-6">SWOT Analysis</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 mb-3 flex items-center">
                  <span className="text-xl mr-2">💪</span> Strengths
                </h4>
                <ul className="space-y-2">
                  {strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span className="text-gray-800">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Weaknesses */}
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-medium text-red-800 mb-3 flex items-center">
                  <span className="text-xl mr-2">⚠️</span> Weaknesses
                </h4>
                <ul className="space-y-2">
                  {weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-600 mr-2">•</span>
                      <span className="text-gray-800">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Opportunities */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-3 flex items-center">
                  <span className="text-xl mr-2">🚀</span> Opportunities
                    </h4>
                <ul className="space-y-2">
                  {opportunities.map((opportunity, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span className="text-gray-800">{opportunity}</span>
                    </li>
                  ))}
                </ul>
                        </div>
              
              {/* Threats */}
              <div className="bg-amber-50 p-4 rounded-lg">
                <h4 className="font-medium text-amber-800 mb-3 flex items-center">
                  <span className="text-xl mr-2">🛡️</span> Threats
                </h4>
                <ul className="space-y-2">
                  {threats.map((threat, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-amber-600 mr-2">•</span>
                      <span className="text-gray-800">{threat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          {/* Scenario Analysis */}
          {scenarioResults && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-6">Scenario Analysis</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Best Case Scenario */}
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <h4 className="font-medium text-emerald-800 mb-2 flex items-center">
                    <span className="text-xl mr-2">📈</span> Best Case Scenario
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700">Description:</h5>
                      <p className="text-gray-800">{scenarioResults.bestCase.description}</p>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-700">Potential Impact:</h5>
                      <p className="text-gray-800">{scenarioResults.bestCase.impact}</p>
                  </div>
                  <div>
                      <h5 className="text-sm font-medium text-gray-700">Probability:</h5>
                      <div className="flex items-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          scenarioResults.bestCase.probability === 'high' 
                            ? 'bg-green-200 text-green-800' 
                            : scenarioResults.bestCase.probability === 'medium'
                            ? 'bg-yellow-200 text-yellow-800'
                            : 'bg-red-200 text-red-800'
                        }`}>
                          {scenarioResults.bestCase.probability.toUpperCase()}
                        </span>
                        </div>
                    </div>
                  </div>
                </div>
                
                {/* Worst Case Scenario */}
                <div className="bg-rose-50 p-4 rounded-lg">
                  <h4 className="font-medium text-rose-800 mb-2 flex items-center">
                    <span className="text-xl mr-2">📉</span> Worst Case Scenario
                  </h4>
                  <div className="space-y-3">
                <div>
                      <h5 className="text-sm font-medium text-gray-700">Description:</h5>
                      <p className="text-gray-800">{scenarioResults.worstCase.description}</p>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-700">Potential Impact:</h5>
                      <p className="text-gray-800">{scenarioResults.worstCase.impact}</p>
                  </div>
                  <div>
                      <h5 className="text-sm font-medium text-gray-700">Probability:</h5>
                      <div className="flex items-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          scenarioResults.worstCase.probability === 'high' 
                            ? 'bg-red-200 text-red-800' 
                            : scenarioResults.worstCase.probability === 'medium'
                            ? 'bg-yellow-200 text-yellow-800'
                            : 'bg-green-200 text-green-800'
                        }`}>
                          {scenarioResults.worstCase.probability.toUpperCase()}
                              </span>
                            </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start">
                  <div className="text-blue-600 text-xl mr-3">💡</div>
                <div>
                    <h4 className="font-medium text-blue-800 mb-1">Strategic Flexibility</h4>
                    <p className="text-blue-700 text-sm">
                      The best strategies maintain flexibility to adapt as conditions change. 
                      Consider how your strategy might need to evolve in response to different scenarios, 
                      and what early warning indicators you might monitor.
                    </p>
                  </div>
                </div>
                  </div>
                </div>
              )}
          
          {/* Next Steps */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Implementation Recommendations</h3>
            
            <div className="space-y-4">
              <p className="text-gray-700">
                Based on your strategy and the SWOT analysis, consider these implementation steps:
              </p>
              
              <ol className="space-y-3 ml-6 list-decimal">
                <li className="text-gray-800">
                  <span className="font-medium">Prioritize key initiatives</span> - Focus on the strategies that address your most critical financial needs first
                </li>
                <li className="text-gray-800">
                  <span className="font-medium">Create an implementation timeline</span> - Establish clear milestones and deadlines for each strategic element
                </li>
                <li className="text-gray-800">
                  <span className="font-medium">Allocate resources appropriately</span> - Ensure each strategy has the necessary budget, staff, and tools
                </li>
                <li className="text-gray-800">
                  <span className="font-medium">Develop KPIs for measurement</span> - Establish clear metrics to track progress and success
                </li>
                <li className="text-gray-800">
                  <span className="font-medium">Plan for contingencies</span> - Prepare response plans for the identified threats and worst-case scenarios
                </li>
              </ol>
              
              <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <div className="text-yellow-600 text-xl mr-3">⚠️</div>
                <div>
                    <h4 className="font-medium text-yellow-800 mb-1">Common Implementation Pitfalls</h4>
                    <ul className="space-y-1 text-sm text-yellow-700">
                      <li>• Trying to implement too many strategies simultaneously</li>
                      <li>• Failing to communicate the strategy effectively to stakeholders</li>
                      <li>• Not adjusting course when early indicators suggest issues</li>
                      <li>• Underestimating resource requirements</li>
                      <li>• Lack of clear ownership and accountability</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Challenge Complete */}
          <div className="bg-gradient-to-r from-[#E0F7FA] to-[#B2EBF2] p-6 rounded-lg text-center">
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="text-xl font-semibold text-[#0097A7] mb-2">
              Challenge Complete!
            </h3>
            <p className="text-gray-700 mb-6">
              You've successfully developed a comprehensive business strategy using AI-powered financial analysis and market insights.
            </p>
            <div className="flex flex-col md:flex-row justify-center items-center space-y-3 md:space-y-0 md:space-x-4">
              <button
                className="w-full md:w-auto px-6 py-2 border border-[#0097A7] text-[#0097A7] rounded-md hover:bg-[#E0F7FA] transition-colors"
                onClick={onBack}
              >
                Revise Strategy
              </button>
                <button
                className="w-full md:w-auto px-6 py-2 bg-[#0097A7] text-white rounded-md font-medium hover:bg-[#00838F] transition-colors"
                onClick={() => window.location.href = '/challenges'}
                >
                Complete Task
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StrategyAssessment; 