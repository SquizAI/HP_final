import React, { useState } from 'react';

interface ResponseAnalysisFormProps {
  onSubmitAnalysis: (analysisData: AnalysisData) => void;
  modelAName: string;
  modelBName: string;
  modelAPrice: number;
  modelBPrice: number;
  completed: boolean;
}

export interface AnalysisData {
  selectedModel: string;
  reasonForSelection: string;
  qualityScore: number;
  relevanceScore: number;
  costEfficiencyScore: number;
  implementationScore: number;
}

export const ResponseAnalysisForm: React.FC<ResponseAnalysisFormProps> = ({
  onSubmitAnalysis,
  modelAName,
  modelBName,
  modelAPrice,
  modelBPrice,
  completed
}) => {
  const [analysisData, setAnalysisData] = useState<AnalysisData>({
    selectedModel: '',
    reasonForSelection: '',
    qualityScore: 3,
    relevanceScore: 3,
    costEfficiencyScore: 3,
    implementationScore: 3
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAnalysisData(prev => ({
      ...prev,
      [name]: name.includes('Score') ? parseInt(value, 10) : value
    }));
  };

  const handleScoreChange = (name: string, value: number) => {
    setAnalysisData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitAnalysis(analysisData);
  };

  const renderScoreOptions = (
    label: string, 
    name: string, 
    value: number, 
    description: { low: string; medium: string; high: string }
  ) => {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="flex flex-col space-y-2">
          <div className="relative">
            <input
              type="range"
              name={name}
              min="1"
              max="5"
              value={value}
              onChange={handleInputChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-600 px-1">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </div>
          <div className="text-sm text-gray-500 italic">
            {value <= 2 ? description.low : value <= 4 ? description.medium : description.high}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Model Selection Analysis</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">Which model would you choose for this scenario?</label>
          <div className="flex space-x-4">
            <div 
              className={`flex-1 border rounded-lg overflow-hidden p-4 cursor-pointer transition-all duration-300 
                ${analysisData.selectedModel === modelAName 
                  ? 'border-emerald-500 bg-emerald-50 shadow-md' 
                  : 'border-gray-200 hover:border-emerald-200'}`}
              onClick={() => setAnalysisData(prev => ({...prev, selectedModel: modelAName}))}
            >
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                  G
                </div>
                <div className="ml-3">
                  <h3 className="text-base font-medium text-gray-900">{modelAName}</h3>
                  <p className="text-sm text-gray-500">${modelAPrice}/1M output tokens</p>
                </div>
                <div className="ml-auto">
                  <div className={`h-5 w-5 rounded-full border-2 transition-all ${
                    analysisData.selectedModel === modelAName 
                      ? 'border-emerald-500 bg-emerald-500' 
                      : 'border-gray-300'
                  }`}>
                    {analysisData.selectedModel === modelAName && (
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div 
              className={`flex-1 border rounded-lg overflow-hidden p-4 cursor-pointer transition-all duration-300
                ${analysisData.selectedModel === modelBName 
                  ? 'border-indigo-500 bg-indigo-50 shadow-md' 
                  : 'border-gray-200 hover:border-indigo-200'}`}
              onClick={() => setAnalysisData(prev => ({...prev, selectedModel: modelBName}))}
            >
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                  G2
                </div>
                <div className="ml-3">
                  <h3 className="text-base font-medium text-gray-900">{modelBName}</h3>
                  <p className="text-sm text-gray-500">${modelBPrice}/1M output tokens</p>
                </div>
                <div className="ml-auto">
                  <div className={`h-5 w-5 rounded-full border-2 transition-all ${
                    analysisData.selectedModel === modelBName 
                      ? 'border-indigo-500 bg-indigo-500' 
                      : 'border-gray-300'
                  }`}>
                    {analysisData.selectedModel === modelBName && (
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {analysisData.selectedModel === '' && (
            <p className="text-sm text-red-500 mt-1">Please select a model</p>
          )}
        </div>

        <div className="mb-5">
          <label htmlFor="reasonForSelection" className="block text-sm font-medium text-gray-700 mb-1">
            Why did you choose this model for this business scenario?
          </label>
          <textarea
            id="reasonForSelection"
            name="reasonForSelection"
            rows={4}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
            placeholder="Explain your reasoning for choosing this model. Consider factors like response quality, business value, and cost efficiency..."
            value={analysisData.reasonForSelection}
            onChange={handleInputChange}
          />
          <p className="text-xs text-gray-500 mt-1">
            {analysisData.reasonForSelection.length}/500 characters
          </p>
          {analysisData.reasonForSelection.length === 0 && (
            <p className="text-sm text-red-500 mt-1">Please provide your reasoning</p>
          )}
        </div>

        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg mb-5">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Rate the selected model's performance</h3>
          
          {renderScoreOptions(
            'Response Quality', 
            'qualityScore', 
            analysisData.qualityScore,
            {
              low: 'Basic responses with limited insights',
              medium: 'Good analysis with useful information',
              high: 'Exceptional insights with comprehensive analysis'
            }
          )}
          
          {renderScoreOptions(
            'Business Relevance', 
            'relevanceScore', 
            analysisData.relevanceScore,
            {
              low: 'Generic responses not specific to the business context',
              medium: 'Addressed key aspects of the business scenario',
              high: 'Deeply understood business implications and provided targeted advice'
            }
          )}
          
          {renderScoreOptions(
            'Cost Efficiency', 
            'costEfficiencyScore', 
            analysisData.costEfficiencyScore,
            {
              low: 'Cost outweighs value for this specific use case',
              medium: 'Reasonable balance between cost and value',
              high: 'Exceptional value for the cost, highly efficient'
            }
          )}
          
          {renderScoreOptions(
            'Implementation Practicality', 
            'implementationScore', 
            analysisData.implementationScore,
            {
              low: 'Suggestions would be difficult to implement in practice',
              medium: 'Reasonable suggestions that could be implemented with some effort',
              high: 'Highly practical advice ready for immediate implementation'
            }
          )}
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-5">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Business Value Insights</h3>
          <p className="text-sm text-blue-700 mb-3">
            Selecting the right AI model for each business task is a critical skill that can:
          </p>
          <ul className="space-y-2 text-sm text-blue-700">
            <li className="flex items-start">
              <svg className="h-4 w-4 text-blue-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Reduce costs by up to 90% by using simpler models for routine tasks</span>
            </li>
            <li className="flex items-start">
              <svg className="h-4 w-4 text-blue-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Improve response times for time-sensitive business operations</span>
            </li>
            <li className="flex items-start">
              <svg className="h-4 w-4 text-blue-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Enhance business decision quality when complex reasoning is required</span>
            </li>
          </ul>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={analysisData.selectedModel === '' || analysisData.reasonForSelection.length === 0 || completed}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white 
              ${(analysisData.selectedModel === '' || analysisData.reasonForSelection.length === 0 || completed) ? 
                'bg-gray-300 cursor-not-allowed' : 
                'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
          >
            {completed ? 'Analysis Submitted' : 'Submit Analysis'}
          </button>
        </div>
      </form>
    </div>
  );
}; 