import React, { useState } from 'react';
import { BusinessScenario, ModelResponse, ModelType } from '../SmartSelectMain';

interface ModelResponsesProps {
  scenario: BusinessScenario | null;
  responses: Record<ModelType, ModelResponse | null>;
  modelDescriptions: Record<ModelType, {
    name: string;
    description: string;
    strengths: string[];
    limitations: string[];
  }>;
  onContinue: () => void;
  isLoading: boolean;
}

export const ModelResponses: React.FC<ModelResponsesProps> = ({
  scenario,
  responses,
  modelDescriptions,
  onContinue,
  isLoading
}) => {
  const [activeTab, setActiveTab] = useState<'side-by-side' | 'diff'>('side-by-side');
  const [viewMode, setViewMode] = useState<'full' | 'condensed'>('condensed');
  
  if (!scenario) {
    return <div>No scenario selected</div>;
  }
  
  const basicResponse = responses.basic;
  const advancedResponse = responses.advanced;
  const expertResponse = responses.expert;
  
  // Calculate key differences
  const getKeyDifferences = () => {
    if (!basicResponse || !advancedResponse) return [];
    
    return [
      {
        title: "Response Structure & Organization",
        basic: "Bullet-point list with brief explanations",
        advanced: "Structured sections with headers and detailed sub-points"
      },
      {
        title: "Depth of Analysis",
        basic: "High-level overview of common factors",
        advanced: "In-depth analysis with specific examples and nuanced considerations"
      },
      {
        title: "Specificity of Recommendations",
        basic: "General best practices applicable to most situations",
        advanced: "Tailored recommendations with implementation details and rationales"
      },
      {
        title: "Contextual Awareness",
        basic: "Limited acknowledgment of scenario constraints",
        advanced: "Addresses scenario-specific challenges and business context"
      },
      {
        title: "Measurement & Follow-up",
        basic: "Generic success metrics",
        advanced: "Specific KPIs and measurement approaches for each recommendation"
      }
    ];
  };
  
  const renderResponseCards = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic AI Response */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">{modelDescriptions.basic.name}</h3>
                  <p className="text-sm text-gray-500">Basic Pattern-Matching Model</p>
                </div>
              </div>
              {basicResponse && (
                <div className="text-xs text-gray-500">
                  {basicResponse.responseTime.toFixed(1)}s
                </div>
              )}
            </div>
          </div>
          
          <div className="p-4 bg-white">
            <div className="mb-3">
              <h4 className="text-sm font-medium text-gray-700 mb-1">About this model:</h4>
              <p className="text-sm text-gray-600">{modelDescriptions.basic.description}</p>
            </div>
            
            <div className="mb-4">
              <div className="flex space-x-2 text-xs mb-2">
                {modelDescriptions.basic.strengths.slice(0, 3).map((strength, index) => (
                  <span key={index} className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                    {strength}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-3 mt-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Response:</h4>
              {isLoading && !basicResponse ? (
                <div className="animate-pulse flex space-x-4">
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              ) : basicResponse ? (
                <div className={`prose max-w-none text-sm ${viewMode === 'condensed' ? 'max-h-60 overflow-y-auto' : ''}`}>
                  <pre className="whitespace-pre-wrap font-sans">{basicResponse.response}</pre>
                </div>
              ) : (
                <p className="text-gray-500 italic">No response available</p>
              )}
            </div>
            
            {basicResponse && viewMode === 'condensed' && (
              <button
                onClick={() => setViewMode('full')}
                className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Show Full Response
              </button>
            )}
          </div>
        </div>
        
        {/* Advanced AI Response */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">{modelDescriptions.advanced.name}</h3>
                  <p className="text-sm text-gray-500">Advanced Reasoning Model</p>
                </div>
              </div>
              {advancedResponse && (
                <div className="text-xs text-gray-500">
                  {advancedResponse.responseTime.toFixed(1)}s
                </div>
              )}
            </div>
          </div>
          
          <div className="p-4 bg-white">
            <div className="mb-3">
              <h4 className="text-sm font-medium text-gray-700 mb-1">About this model:</h4>
              <p className="text-sm text-gray-600">{modelDescriptions.advanced.description}</p>
            </div>
            
            <div className="mb-4">
              <div className="flex space-x-2 text-xs mb-2">
                {modelDescriptions.advanced.strengths.slice(0, 3).map((strength, index) => (
                  <span key={index} className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                    {strength}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-3 mt-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Response:</h4>
              {isLoading && !advancedResponse ? (
                <div className="animate-pulse flex space-x-4">
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              ) : advancedResponse ? (
                <div className={`prose max-w-none text-sm ${viewMode === 'condensed' ? 'max-h-60 overflow-y-auto' : ''}`}>
                  <pre className="whitespace-pre-wrap font-sans">{advancedResponse.response}</pre>
                </div>
              ) : (
                <p className="text-gray-500 italic">No response available</p>
              )}
            </div>
            
            {advancedResponse && viewMode === 'condensed' && (
              <button
                onClick={() => setViewMode('full')}
                className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Show Full Response
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  const renderDifferenceTable = () => {
    const differences = getKeyDifferences();
    
    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aspect
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {modelDescriptions.basic.name}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {modelDescriptions.advanced.name}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {differences.map((diff, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {diff.title}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {diff.basic}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {diff.advanced}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  const renderPrompt = () => {
    return (
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Business Scenario Prompt:</h3>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-700 text-sm">
          {scenario.prompt}
        </div>
      </div>
    );
  };
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">AI Model Comparison</h2>
        <p className="text-gray-600">
          Compare how different AI models respond to the same business scenario.
          Notice the differences in depth, structure, and approach between models.
        </p>
      </div>
      
      {renderPrompt()}
      
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('side-by-side')}
              className={`${
                activeTab === 'side-by-side'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm`}
            >
              Side-by-Side Comparison
            </button>
            <button
              onClick={() => setActiveTab('diff')}
              className={`${
                activeTab === 'diff'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm`}
            >
              Key Differences
            </button>
          </nav>
        </div>
      </div>
      
      <div className="mb-8">
        {activeTab === 'side-by-side' ? renderResponseCards() : renderDifferenceTable()}
      </div>
      
      {viewMode === 'full' && (
        <div className="mb-6">
          <button
            onClick={() => setViewMode('condensed')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Collapse Responses
          </button>
        </div>
      )}
      
      <div className="flex justify-end mt-8">
        <button
          onClick={onContinue}
          disabled={isLoading || !basicResponse || !advancedResponse}
          className={`px-6 py-2 rounded-md ${
            isLoading || !basicResponse || !advancedResponse
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          }`}
        >
          Continue to Analysis
        </button>
      </div>
    </div>
  );
}; 