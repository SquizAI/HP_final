import React, { useState, useEffect } from 'react';
import { ModelInfo, ModelResponse } from '../AIModelComparison';
import ReactMarkdown from 'react-markdown';

interface ModelComparisonArenaProps {
  modelInfoGPT: ModelInfo;
  modelInfoGemini: ModelInfo;
  loading: boolean;
  responseGPT: ModelResponse | null;
  responseGemini: ModelResponse | null;
  showDifferences: boolean;
  showMetrics?: boolean;
  onToggleDifferences: () => void;
}

export const ModelComparisonArena: React.FC<ModelComparisonArenaProps> = ({
  modelInfoGPT,
  modelInfoGemini,
  loading,
  responseGPT,
  responseGemini,
  showDifferences, // Used to control UI state for showing differences between models
  showMetrics = true, // Used to control which tab is active by default
  onToggleDifferences // Handler for toggling difference highlighting
}) => {
  const [activeTab, setActiveTab] = useState<'response' | 'metrics'>('response');
  
  // Set activeTab based on showMetrics prop when it changes
  useEffect(() => {
    setActiveTab(showMetrics ? 'metrics' : 'response');
  }, [showMetrics]);

  // Calculate costs
  const calculateGPTCost = (response: ModelResponse | null): string => {
    if (!response) return '0';
    return (
      (response.inputTokens / 1000000) * modelInfoGPT.inputPrice +
      (response.outputTokens / 1000000) * modelInfoGPT.outputPrice
    ).toFixed(6);
  };

  const calculateGeminiCost = (response: ModelResponse | null): string => {
    if (!response) return '0';
    return (
      (response.inputTokens / 1000000) * modelInfoGemini.inputPrice +
      (response.outputTokens / 1000000) * modelInfoGemini.outputPrice
    ).toFixed(6);
  };

  // Loading placeholders
  const renderLoadingPlaceholder = () => (
    <div className="flex items-center justify-center h-64 w-full bg-gray-50 border border-gray-200 rounded-lg animate-pulse">
      <div className="text-center">
        <div className="h-8 w-32 bg-gray-300 rounded mx-auto mb-4"></div>
        <div className="h-4 w-48 bg-gray-300 rounded mx-auto"></div>
      </div>
    </div>
  );

  // Render a model response card
  const renderResponseCard = (
    model: ModelInfo,
    response: ModelResponse | null,
    cost: string
  ) => {
    // Apply highlighting class when differences are shown
    const highlightClass = showDifferences ? 'border-2 border-indigo-300' : '';
    return (
      <div className={`bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden ${highlightClass}`}>
        {/* Model header */}
        <div className={`px-6 py-4 ${model.provider === 'OpenAI' ? 'bg-green-50' : 'bg-blue-50'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{model.name}</h3>
              <p className="text-sm text-gray-500">{model.provider}</p>
            </div>
            <div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                model.provider === 'OpenAI' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                Cost: ${cost}
              </span>
            </div>
          </div>
        </div>

        {/* Model response or loading state */}
        <div className="px-6 py-4">
          {activeTab === 'response' ? (
            <div className="prose prose-sm max-w-none">
              {response ? (
                <ReactMarkdown>{response.text}</ReactMarkdown>
              ) : (
                <div className="text-gray-500 italic">No response yet.</div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Input Tokens</p>
                  <p className="text-2xl font-semibold text-gray-900">{response?.inputTokens || 0}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Output Tokens</p>
                  <p className="text-2xl font-semibold text-gray-900">{response?.outputTokens || 0}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Response Time</p>
                  <p className="text-2xl font-semibold text-gray-900">{response?.responseTime ? response.responseTime.toFixed(2) : '0'}s</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Token Cost</p>
                  <p className="text-2xl font-semibold text-gray-900">${cost}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-500">Context Window</p>
                <p className="text-2xl font-semibold text-gray-900">{model.contextWindow.toLocaleString()} tokens</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-6" data-component-name="ModelComparisonArena">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Model Response Comparison</h2>
        
        {/* Toggle differences button */}
        <button
          onClick={onToggleDifferences}
          className="ml-auto mr-4 px-3 py-1 text-xs font-medium rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
        >
          {showDifferences ? 'Hide Differences' : 'Show Differences'}
        </button>
        
        {/* Tabs - Only show if not controlled externally */}
        {showMetrics === undefined && (
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('response')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'response'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Responses
            </button>
            <button
              onClick={() => setActiveTab('metrics')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'metrics'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Metrics
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <>
            {renderLoadingPlaceholder()}
            {renderLoadingPlaceholder()}
          </>
        ) : (
          <>
            {renderResponseCard(
              modelInfoGPT,
              responseGPT,
              calculateGPTCost(responseGPT)
            )}
            {renderResponseCard(
              modelInfoGemini,
              responseGemini,
              calculateGeminiCost(responseGemini)
            )}
          </>
        )}
      </div>
    </div>
  );
}; 