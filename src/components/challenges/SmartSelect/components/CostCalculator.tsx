import React from 'react';
import { ModelInfo, ModelResponse } from '../AIModelComparison';

interface CostCalculatorProps {
  modelInfoGPT: ModelInfo;
  modelInfoGemini: ModelInfo;
  responseGPT: ModelResponse | null;
  responseGemini: ModelResponse | null;
  selectedModel: string;
}

export const CostCalculator: React.FC<CostCalculatorProps> = ({
  modelInfoGPT,
  modelInfoGemini,
  responseGPT,
  responseGemini,
  selectedModel
}) => {
  // Calculate token usage and costs
  const calculateCost = (response: ModelResponse | null, modelInfo: ModelInfo) => {
    if (!response) return { inputCost: 0, outputCost: 0, totalCost: 0 };
    
    const inputCost = (response.inputTokens / 1000000) * modelInfo.inputPrice;
    const outputCost = (response.outputTokens / 1000000) * modelInfo.outputPrice;
    
    return {
      inputCost,
      outputCost,
      totalCost: inputCost + outputCost
    };
  };

  const gptCost = calculateCost(responseGPT, modelInfoGPT);
  const geminiCost = calculateCost(responseGemini, modelInfoGemini);
  
  // Calculate savings
  const calculateSavings = () => {
    if (!responseGPT || !responseGemini) return { amount: 0, percentage: 0 };
    
    const higherCost = Math.max(gptCost.totalCost, geminiCost.totalCost);
    const lowerCost = Math.min(gptCost.totalCost, geminiCost.totalCost);
    
    if (higherCost === 0) return { amount: 0, percentage: 0 };
    
    const savingsAmount = higherCost - lowerCost;
    const savingsPercentage = (savingsAmount / higherCost) * 100;
    
    return {
      amount: savingsAmount,
      percentage: savingsPercentage
    };
  };
  
  const savings = calculateSavings();
  
  // Calculate hypothetical 1000 calls cost
  const calculateHypotheticalCost = (monthlyCalls: number) => {
    if (!responseGPT || !responseGemini) return { gpt: 0, gemini: 0 };
    
    return {
      gpt: gptCost.totalCost * monthlyCalls,
      gemini: geminiCost.totalCost * monthlyCalls
    };
  };
  
  const monthlyCost = calculateHypotheticalCost(1000);
  const yearlyCost = calculateHypotheticalCost(12000);
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Cost Analysis</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Request */}
        <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">This Request</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <div className="flex items-center">
                <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs font-bold">
                  G
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700">{modelInfoGPT.name}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  ${gptCost.totalCost.toFixed(6)}
                </div>
                <div className="text-xs text-gray-500">
                  {responseGPT ? `${responseGPT.inputTokens + responseGPT.outputTokens} tokens` : '0 tokens'}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <div className="flex items-center">
                <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">
                  G2
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700">{modelInfoGemini.name}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  ${geminiCost.totalCost.toFixed(6)}
                </div>
                <div className="text-xs text-gray-500">
                  {responseGemini ? `${responseGemini.inputTokens + responseGemini.outputTokens} tokens` : '0 tokens'}
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <div className="text-sm font-medium text-gray-500">Potential Savings:</div>
              <div className="flex items-center">
                <span className="text-lg font-bold text-green-600">${savings.amount.toFixed(6)}</span>
                <span className="ml-2 text-sm text-green-600">({savings.percentage.toFixed(1)}%)</span>
              </div>
              <div className="text-xs text-gray-500">
                By choosing {geminiCost.totalCost < gptCost.totalCost ? modelInfoGemini.name : modelInfoGPT.name} 
                when appropriate
              </div>
            </div>
          </div>
        </div>
        
        {/* Monthly Estimate */}
        <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Monthly Estimate (1,000 calls)</h3>
          
          <div className="space-y-4">
            <div className="relative pt-1">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-medium text-indigo-600">
                  {modelInfoGemini.name}: ${monthlyCost.gemini.toFixed(2)}
                </div>
                <div className="text-xs font-medium text-emerald-600">
                  {modelInfoGPT.name}: ${monthlyCost.gpt.toFixed(2)}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-2 rounded-full" 
                  style={{
                    width: '100%',
                    background: `linear-gradient(to right, #6366f1 ${(monthlyCost.gemini / Math.max(monthlyCost.gemini, monthlyCost.gpt)) * 100}%, #34d399 ${(monthlyCost.gemini / Math.max(monthlyCost.gemini, monthlyCost.gpt)) * 100}%)`
                  }}
                ></div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="text-sm font-medium text-gray-700 mb-2">Optimal Strategy:</div>
              
              {selectedModel ? (
                <div>
                  <div className="flex items-center">
                    <div className={`h-6 w-6 rounded-full ${
                      selectedModel === modelInfoGPT.name ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'
                    } flex items-center justify-center text-xs font-bold`}>
                      {selectedModel === modelInfoGPT.name ? 'G' : 'G2'}
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      You selected: {selectedModel}
                    </span>
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-600">
                    Estimated monthly cost with this selection:
                    <span className="font-medium text-gray-800 ml-1">
                      ${(selectedModel === modelInfoGPT.name ? monthlyCost.gpt : monthlyCost.gemini).toFixed(2)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500 italic">
                  Make your model selection to see your optimal strategy
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Yearly Projection */}
        <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Yearly Projection (12,000 calls)</h3>
          
          <div>
            <div className="mb-3">
              <div className="flex justify-between mb-1">
                <span className="text-xs font-medium text-gray-500">Yearly Costs</span>
                <span className="text-xs font-medium text-green-600">Potential Savings</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`flex-1 h-10 border rounded-md flex items-center px-3 ${
                  yearlyCost.gemini < yearlyCost.gpt ? 'bg-indigo-50 border-indigo-200' : 'bg-emerald-50 border-emerald-200'
                }`}>
                  <div className={`h-5 w-5 rounded-full ${
                    yearlyCost.gemini < yearlyCost.gpt ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'
                  } flex items-center justify-center text-xs font-bold`}>
                    {yearlyCost.gemini < yearlyCost.gpt ? 'G2' : 'G'}
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    ${(Math.min(yearlyCost.gemini, yearlyCost.gpt)).toFixed(2)}
                  </span>
                </div>
                <div className="font-bold text-green-600">
                  ${(Math.max(yearlyCost.gemini, yearlyCost.gpt) - Math.min(yearlyCost.gemini, yearlyCost.gpt)).toFixed(2)}
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-3 mb-3">
              <div className="text-sm font-medium text-gray-700 mb-1">Business Impact:</div>
              <div className="text-sm text-gray-600">
                {yearlyCost.gemini < yearlyCost.gpt ? (
                  <>Using <span className="font-medium">{modelInfoGemini.name}</span> for this type of task could save your business up to <span className="font-medium text-green-600">${(yearlyCost.gpt - yearlyCost.gemini).toFixed(2)}</span> annually.</>
                ) : (
                  <>Using <span className="font-medium">{modelInfoGPT.name}</span> for this type of task could save your business up to <span className="font-medium text-green-600">${(yearlyCost.gemini - yearlyCost.gpt).toFixed(2)}</span> annually.</>
                )}
              </div>
            </div>
            
            <div className="text-xs text-gray-500">
              <strong>Note:</strong> Actual costs may vary based on token usage, response length, and specific implementation details. These calculations are based on the current request as a representative sample.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 