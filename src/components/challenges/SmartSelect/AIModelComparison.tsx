import React, { useState, useEffect } from 'react';
import { 
  ScenarioSelector, 
  ModelComparisonArena, 
  ModelCapabilities, 
  OtherLLMs 
} from './components';
import axios from 'axios';
import ChallengeHeader from '../../shared/ChallengeHeader';
import { FileCheck } from 'lucide-react';
import { useUserProgress, markChallengeAsCompleted } from '../../../utils/userDataManager';
import { getApiKey } from '../../../services/openai';
import { getGeminiConfig } from '../../../services/apiConfig';

// Type definitions
export interface BusinessScenario {
  id: string;
  title: string;
  description: string;
  prompt: string;
  category: string;
  complexity: 'low' | 'medium' | 'high';
}

export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  description: string;
  inputPrice: number;
  outputPrice: number;
  contextWindow: number;
  strengths: string[];
  capabilities: string[];
  apiEndpoint: string;
}

export interface ModelResponse {
  text: string;
  inputTokens: number;
  outputTokens: number;
  responseTime: number;
  error?: string;
}

// Tab interface
interface TabData {
  id: string;
  label: string;
}

// API service to handle requests securely
// In a production app, these would be handled by backend services
const ApiService = {
  callGPTAPI: async (prompt: string, modelInfo: ModelInfo): Promise<ModelResponse> => {
    const startTime = Date.now();
    // Use environment variable from .env file
    const apiKey = getApiKey() || '';
    
    try {
      const response = await axios.post(
        modelInfo.apiEndpoint,
        {
          model: modelInfo.id,
          messages: [
            { role: "system", content: "You are a helpful AI assistant specialized in business strategy and analysis." },
            { role: "user", content: prompt }
          ],
          max_tokens: 1000
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const responseTime = (Date.now() - startTime) / 1000;
      return {
        text: response.data.choices[0].message.content,
        inputTokens: response.data.usage.prompt_tokens,
        outputTokens: response.data.usage.completion_tokens,
        responseTime
      };
    } catch (error: any) {
      console.error('GPT API error:', error);
      return {
        text: '',
        inputTokens: 0,
        outputTokens: 0,
        responseTime: (Date.now() - startTime) / 1000,
        error: error.response?.data?.error?.message || 'Failed to connect to OpenAI API'
      };
    }
  },
  
  callGeminiAPI: async (prompt: string, modelInfo: ModelInfo): Promise<ModelResponse> => {
    const startTime = Date.now();
    // Get the API key from environment variables via the apiConfig service
    const { apiKey } = getGeminiConfig();
    
    if (!apiKey) {
      return {
        text: '',
        responseTime: 0,
        inputTokens: 0,
        outputTokens: 0,
        error: 'Gemini API key is not properly configured in environment variables'
      };
    }
    
    try {
      const response = await axios.post(
        `${modelInfo.apiEndpoint}?key=${apiKey}`,
        {
          contents: [{
            parts: [
              { text: prompt }
            ]
          }],
          generationConfig: {
            maxOutputTokens: 1000,
            temperature: 0.7
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const responseTime = (Date.now() - startTime) / 1000;
      
      // Note: Gemini API doesn't provide token counts directly like OpenAI
      // We would need a tokenizer to estimate these values
      const estimatedInputTokens = Math.round(prompt.length / 4);
      const estimatedOutputTokens = Math.round(response.data.candidates[0].content.parts[0].text.length / 4);
      
      return {
        text: response.data.candidates[0].content.parts[0].text,
        inputTokens: estimatedInputTokens,
        outputTokens: estimatedOutputTokens,
        responseTime
      };
    } catch (error: any) {
      console.error('Gemini API error:', error);
      return {
        text: '',
        inputTokens: 0,
        outputTokens: 0,
        responseTime: (Date.now() - startTime) / 1000,
        error: error.response?.data?.error?.message || 'Failed to connect to Gemini API'
      };
    }
  }
};

// Model information
const MODEL_INFO_GPT: ModelInfo = {
  id: 'gpt-4o',
  name: 'GPT-4o',
  provider: 'OpenAI',
  description: 'Advanced multimodal model with vision, audio, and text capabilities',
  inputPrice: 5.00,
  outputPrice: 15.00,
  contextWindow: 128000,
  strengths: [
    'Complex reasoning and analysis',
    'Multimodal understanding',
    'Advanced code generation',
    'Strong at understanding context',
    'Detailed explanations'
  ],
  capabilities: [
    'Text, image, audio, and video input processing',
    'Text output generation',
    'Function calling for API integration',
    'JSON mode for structured outputs',
    'System instructions for behavior control'
  ],
  apiEndpoint: 'https://api.openai.com/v1/chat/completions'
};

const MODEL_INFO_GEMINI: ModelInfo = {
  id: 'gemini-2.0-flash',
  name: 'Gemini 2.0 Flash',
  provider: 'Google',
  description: 'Fast multimodal model optimized for efficiency and agentic tasks',
  inputPrice: 0.50,
  outputPrice: 1.50,
  contextWindow: 1000000,
  strengths: [
    'Fast response times',
    'Cost-effective for routine tasks',
    'Multimodal input processing',
    'Strong at straightforward reasoning',
    'Efficient token usage'
  ],
  capabilities: [
    'Audio, images, video, and text input processing',
    'Text output generation (image generation in preview)',
    'Function calling and code execution',
    'JSON mode and schema support',
    'System instructions'
  ],
  apiEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'
};

// Sample business scenarios
const BUSINESS_SCENARIOS: BusinessScenario[] = [
  {
    id: 'pricing-strategy',
    title: 'Pricing Strategy Analysis',
    description: 'Analyze market conditions and recommend pricing strategies for a new product launch',
    prompt: 'We are launching a premium SaaS product for enterprise project management. Based on the current market, what pricing model would you recommend and why? Consider our target market of mid to large enterprises with 500+ employees. Provide specific pricing tiers and justification.',
    category: 'Strategy',
    complexity: 'high'
  },
  {
    id: 'market-segmentation',
    title: 'Market Segmentation',
    description: 'Identify target customer segments for a new consumer product',
    prompt: 'Our company is launching a new smart home security system. Help us identify the most promising customer segments to target in our initial marketing campaigns. For each segment, provide demographic details, key pain points, and suggested marketing messages.',
    category: 'Marketing',
    complexity: 'medium'
  },
  {
    id: 'supply-chain-optimization',
    title: 'Supply Chain Optimization',
    description: 'Recommend improvements to a global manufacturing supply chain',
    prompt: 'Our manufacturing company is experiencing delays in our global supply chain. We source components from Southeast Asia, assemble in Eastern Europe, and distribute to North America and Western Europe. What specific steps should we take to optimize our supply chain and reduce delays?',
    category: 'Operations',
    complexity: 'high'
  },
  {
    id: 'customer-retention',
    title: 'Customer Retention Strategy',
    description: 'Develop a strategy to improve customer retention rates',
    prompt: 'Our SaaS business is experiencing a 5% monthly customer churn rate, which is above industry average. Based on this limited information, what customer retention strategies would you recommend we implement? Provide at least three specific tactical recommendations.',
    category: 'Customer Success',
    complexity: 'medium'
  }
];

const AIModelComparison: React.FC = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState<string>('comparison');
  const tabs: TabData[] = [
    { id: 'comparison', label: 'Model Comparison' },
    { id: 'capabilities', label: 'Model Capabilities' },
    { id: 'other-llms', label: 'Other LLMs' }
  ];

  // API state
  const [selectedScenario, setSelectedScenario] = useState<BusinessScenario | null>(null);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [responseGPT, setResponseGPT] = useState<ModelResponse | null>(null);
  const [responseGemini, setResponseGemini] = useState<ModelResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showMetrics, setShowMetrics] = useState<boolean>(true);

  // User progress tracking
  const [userProgress, setUserProgress] = useUserProgress();
  const [isCompleted, setIsCompleted] = useState<boolean>(
    userProgress.completedChallenges.includes('challenge-11')
  );
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  // Add event listener for enhanced prompt generation
  useEffect(() => {
    const handleGenerateEvent = (event: CustomEvent) => {
      if (event.detail) {
        handleGenerateResponses(event.detail);
      }
    };

    // Add event listener
    document.addEventListener('generateResponses', handleGenerateEvent as EventListener);
    
    // Clean up
    return () => {
      document.removeEventListener('generateResponses', handleGenerateEvent as EventListener);
    };
  }, []);

  // Handle scenario selection - Use empty id to deselect
  const handleSelectScenario = (scenario: BusinessScenario) => {
    if (scenario.id === '') {
      setSelectedScenario(null);
      setCustomPrompt('');
    } else {
      setSelectedScenario(scenario);
      setCustomPrompt(scenario.prompt);
      
      // Auto-generate responses when scenario is selected
      setTimeout(() => {
        handleGenerateResponses(scenario.prompt);
      }, 100);
    }
    
    setResponseGPT(null);
    setResponseGemini(null);
    setError(null);
  };

  // Update custom prompt
  const handleUpdateCustomPrompt = (prompt: string) => {
    setCustomPrompt(prompt);
  };

  // Handle "Analyze Custom Prompt" button
  const handleEnhancePrompt = () => {
    if (customPrompt.trim()) {
      handleGenerateResponses(customPrompt);
    } else {
      setError('Please enter a prompt or select a scenario');
    }
  };

  // Generate responses from both models
  const handleGenerateResponses = async (promptToUse = customPrompt) => {
    if (!promptToUse || promptToUse.trim() === '') {
      setError('Please enter a prompt or select a scenario');
      return;
    }
    
    setLoading(true);
    setError(null);
    setResponseGPT(null);
    setResponseGemini(null);
    
    try {
      // Call both APIs in parallel
      const [gptResponse, geminiResponse] = await Promise.all([
        ApiService.callGPTAPI(promptToUse, MODEL_INFO_GPT),
        ApiService.callGeminiAPI(promptToUse, MODEL_INFO_GEMINI)
      ]);
      
      setResponseGPT(gptResponse);
      setResponseGemini(geminiResponse);
      
      // Check for errors
      if (gptResponse.error || geminiResponse.error) {
        setError(`API Error: ${gptResponse.error || geminiResponse.error}`);
      } else {
        // Mark challenge as completed if both responses were successful
        markChallengeAsCompleted('challenge-11');
        setIsCompleted(true);
        
        // Show confetti for visual feedback
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    } catch (error: any) {
      setError(`Unexpected error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Reset the application state
  const handleReset = () => {
    setSelectedScenario(null);
    setCustomPrompt('');
    setResponseGPT(null);
    setResponseGemini(null);
    setError(null);
  };

  // Toggle metrics visibility
  const handleToggleMetrics = () => {
    setShowMetrics(!showMetrics);
  };

  // Handle completing the challenge
  const handleCompleteChallenge = () => {
    // Make sure the user has compared at least one model
    if (!responseGPT && !responseGemini) {
      alert('Please compare at least one model before completing the challenge');
      return;
    }
    
    markChallengeAsCompleted('challenge-11');
    setIsCompleted(true);
    
    // Show confetti
    setShowConfetti(true);
    
    // Hide confetti after 5 seconds
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
  };

  // Render the Model Comparison Tab
  const renderComparisonTab = () => {
    return (
      <div className="space-y-8">
        {/* User Guidance Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 shadow-sm border border-blue-100">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">AI Model Selection Challenge</h2>
          <p className="text-gray-700">
            Compare GPT-4o and Gemini 2.0 Flash responses to business prompts to understand when to use each model. 
            This will help you make cost-effective decisions for your organization's AI usage.
          </p>
        </div>
        
        {/* Scenario Selector with Improved UI */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Step 1: Choose or Create a Business Challenge</h3>
          </div>
          <div className="p-6">
            <ScenarioSelector 
              scenarios={BUSINESS_SCENARIOS} 
              selectedScenario={selectedScenario}
              customPrompt={customPrompt}
              onSelectScenario={handleSelectScenario}
              onUpdateCustomPrompt={handleUpdateCustomPrompt}
            />
            
            {/* This button is now handled in the ScenarioSelector component */}
          </div>
        </div>
        
        {/* Error Display with Better Styling */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 rounded-md p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Loading Indicator - Improved & Centered */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-lg font-medium text-gray-700">Analyzing with both models...</p>
            <p className="text-sm text-gray-500 mt-2">This may take up to 20 seconds</p>
          </div>
        )}
        
        {/* Results Section with Prominent Metrics Toggle */}
        {(responseGPT !== null || responseGemini !== null) && !loading && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Step 2: Compare Model Results</h3>
              <div className="flex items-center">
                <span className="mr-2 text-sm text-gray-600 font-medium">
                  {showMetrics ? 'Show Responses' : 'Show Metrics'}
                </span>
                <button 
                  onClick={handleToggleMetrics}
                  className="relative inline-flex items-center h-6 rounded-full w-11 bg-blue-600 transition-colors focus:outline-none"
                  aria-label={showMetrics ? "Switch to responses" : "Switch to metrics"}
                >
                  <span
                    className={`${
                      showMetrics ? 'translate-x-6' : 'translate-x-1'
                    } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                  />
                </button>
              </div>
            </div>
            <div className="p-0">
              <ModelComparisonArena
                modelInfoGPT={MODEL_INFO_GPT}
                modelInfoGemini={MODEL_INFO_GEMINI}
                loading={loading}
                responseGPT={responseGPT}
                responseGemini={responseGemini}
                showDifferences={false}
                showMetrics={showMetrics}
                onToggleDifferences={() => {}}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render the Model Capabilities Tab
  const renderCapabilitiesTab = () => {
    return (
      <ModelCapabilities 
        gptrModel={MODEL_INFO_GPT}
        geminiModel={MODEL_INFO_GEMINI}
      />
    );
  };

  // Render the Other LLMs Tab
  const renderOtherLLMsTab = () => {
    return (
      <OtherLLMs />
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ChallengeHeader
        title="AI Model Comparison Challenge"
        icon={<FileCheck className="h-6 w-6 text-blue-600" />}
        challengeId="challenge-model-comparison"
        isCompleted={isCompleted}
        setIsCompleted={setIsCompleted}
        showConfetti={showConfetti}
        setShowConfetti={setShowConfetti}
        onCompleteChallenge={handleCompleteChallenge}
      />
      
      {/* Tab Navigation - Enhanced with Better Styling */}
      <div className="bg-white rounded-lg shadow-md mb-8">
        <nav className="flex" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-4 px-6 text-center font-medium text-base transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="py-4">
        {activeTab === 'comparison' && renderComparisonTab()}
        {activeTab === 'capabilities' && renderCapabilitiesTab()}
        {activeTab === 'other-llms' && renderOtherLLMsTab()}
      </div>
      
      {/* Reset Button - Only Show When Results Are Present */}
      {(responseGPT || responseGemini) && !loading && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleReset}
            className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-md hover:from-blue-700 hover:to-indigo-700 shadow-sm transition-all hover:shadow"
          >
            Start New Comparison
          </button>
        </div>
      )}
    </div>
  );
};

export default AIModelComparison; 