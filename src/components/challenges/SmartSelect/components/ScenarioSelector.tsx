import React, { useState } from 'react';
import { BusinessScenario } from '../AIModelComparison';

interface ScenarioSelectorProps {
  scenarios: BusinessScenario[];
  selectedScenario: BusinessScenario | null;
  customPrompt: string;
  onSelectScenario: (scenario: BusinessScenario) => void;
  onUpdateCustomPrompt: (prompt: string) => void;
}

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  scenarios,
  selectedScenario,
  customPrompt,
  onSelectScenario,
  onUpdateCustomPrompt
}) => {
  const [showPromptTip, setShowPromptTip] = useState<boolean>(false);
  const [enhancedPrompt, setEnhancedPrompt] = useState<string>('');
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [activeModeTab, setActiveModeTab] = useState<'predefined' | 'custom'>(
    selectedScenario ? 'predefined' : 'custom'
  );

  // Update active tab when scenario selection changes
  React.useEffect(() => {
    if (selectedScenario) {
      setActiveModeTab('predefined');
    }
  }, [selectedScenario]);

  // Function to simulate AI prompt enhancement
  const enhancePrompt = () => {
    if (!customPrompt.trim() || customPrompt.length < 10) {
      return;
    }
    
    setIsEnhancing(true);
    
    // Simulate API call to enhance prompt
    setTimeout(() => {
      const enhancements = [
        "Add specific metrics or KPIs you want to achieve",
        "Specify your target audience demographics",
        "Include any budget constraints or timeline considerations",
        "Mention any previous approaches you've tried",
        "Ask for pros and cons of each recommendation",
        "Request implementation steps or a roadmap",
        "Ask for evidence or case studies supporting the recommendations"
      ];
      
      // Select 2-3 random enhancements
      const shuffled = [...enhancements].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, Math.floor(Math.random() * 2) + 2);
      
      // Create enhanced version of the prompt
      let enhanced = customPrompt;
      
      // Add structure if not present
      if (!enhanced.includes("context:") && !enhanced.includes("Context:")) {
        enhanced = "Context: " + enhanced + "\n\n";
      } else {
        enhanced += "\n\n";
      }
      
      // Add the enhancements as specific requests
      enhanced += "Please consider the following in your response:\n";
      selected.forEach(item => {
        enhanced += "- " + item + "\n";
      });
      
      // Add a closing request for structured output
      enhanced += "\nProvide your response in a clear, structured format with specific, actionable recommendations.";
      
      setEnhancedPrompt(enhanced);
      setShowPromptTip(true);
      setIsEnhancing(false);
    }, 1500);
  };

  // Function to apply the enhanced prompt
  const applyEnhancedPrompt = () => {
    onUpdateCustomPrompt(enhancedPrompt);
    setShowPromptTip(false);
    // Tell the parent component to generate responses immediately
    setTimeout(() => {
      document.dispatchEvent(new CustomEvent('generateResponses', { detail: enhancedPrompt }));
    }, 100);
  };

  // Check if prompt is long enough to offer enhancement
  const canEnhancePrompt = customPrompt.trim().length >= 10;

  return (
    <div>
      {/* Tabbed Mode Selection */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex -mb-px">
          <button
            className={`py-3 px-6 font-medium text-sm border-b-2 focus:outline-none transition-colors ${
              activeModeTab === 'predefined'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveModeTab('predefined')}
          >
            <div className="flex items-center">
              <svg 
                className="mr-2 h-5 w-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
                />
              </svg>
              Pre-defined Scenarios
            </div>
          </button>
          <button
            className={`py-3 px-6 font-medium text-sm border-b-2 focus:outline-none transition-colors ${
              activeModeTab === 'custom'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveModeTab('custom')}
          >
            <div className="flex items-center">
              <svg 
                className="mr-2 h-5 w-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                />
              </svg>
              Custom Prompt
            </div>
          </button>
        </div>
      </div>
      
      {/* User Guidance - Different based on active tab */}
      <div className="mb-6 bg-blue-50 rounded-lg p-4 border border-blue-100">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              {activeModeTab === 'predefined' 
                ? "Select a Pre-defined Business Scenario" 
                : "Create Your Custom Business Prompt"}
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              {activeModeTab === 'predefined' ? (
                <p>Choose one of our expertly crafted business scenarios below. The system will automatically generate and compare responses from both models.</p>
              ) : (
                <p>Write your own business challenge or question. For better results, try using our <span className="font-semibold">AI Prompt Enhancement</span> tool to structure and optimize your prompt.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Pre-defined Scenarios Section - Only show when that tab is active */}
      {activeModeTab === 'predefined' && (
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scenarios.map(scenario => (
              <div 
                key={scenario.id}
                className={`border rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedScenario?.id === scenario.id 
                  ? 'ring-2 ring-blue-500 shadow-md border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50' 
                  : 'border-gray-200 hover:border-blue-200 shadow-sm'
                }`}
                onClick={() => onSelectScenario(scenario)}
              >
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <div className="flex-shrink-0">
                      {/* Category-specific icon with improved styling */}
                      {scenario.category === 'Marketing' && (
                        <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                          </svg>
                        </div>
                      )}
                      {scenario.category === 'Strategy' && (
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                          </svg>
                        </div>
                      )}
                      {scenario.category === 'Operations' && (
                        <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-600">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                      {scenario.category === 'Customer Success' && (
                        <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                      {scenario.category === 'Product' && (
                        <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <h3 className="text-base font-semibold text-gray-900">{scenario.title}</h3>
                      <div className="flex items-center mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {scenario.category}
                        </span>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${scenario.complexity === 'low' ? 'bg-green-100 text-green-800' :
                            scenario.complexity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'}`}
                        >
                          {scenario.complexity.charAt(0).toUpperCase() + scenario.complexity.slice(1)} Complexity
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-700">{scenario.description}</p>
                </div>
                {selectedScenario?.id === scenario.id && (
                  <div className="bg-blue-500 text-white text-center py-2 text-sm font-medium">
                    Selected
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Show prompt preview for selected scenario */}
          {selectedScenario && (
            <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Prompt:</h3>
              <p className="text-sm text-gray-600 whitespace-pre-line">{selectedScenario.prompt}</p>
            </div>
          )}
          
          {/* Clear Selection button when a scenario is selected */}
          {selectedScenario && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  onSelectScenario({ ...selectedScenario, id: '' }); // Trick to deselect
                  onUpdateCustomPrompt('');
                  setActiveModeTab('custom');
                }}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear & Create Custom Prompt
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Custom Prompt Section - Always show in custom tab */}
      {activeModeTab === 'custom' && (
        <div>
          {/* Idea Starters */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Prompt Starters (Click to use):</h3>
            <div className="flex flex-wrap gap-2">
              {[
                "How can we reduce customer churn by 15%?",
                "What's the best pricing strategy for our new SaaS product?",
                "How should we approach a market expansion to Europe?",
                "What are the key metrics for our marketing dashboard?"
              ].map((starter, index) => (
                <button
                  key={index}
                  onClick={() => onUpdateCustomPrompt(starter)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50"
                >
                  {starter}
                </button>
              ))}
            </div>
          </div>
          
          {/* Custom Prompt Input */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-700">Enter Your Business Challenge</h3>
              {canEnhancePrompt && !showPromptTip && !isEnhancing && (
                <div className="flex items-center">
                  <span className="animate-pulse flex h-2.5 w-2.5 mr-2 rounded-full bg-indigo-500"></span>
                  <span className="text-xs text-indigo-600 font-medium">AI enhancement available</span>
                </div>
              )}
            </div>
            <textarea
              rows={6}
              className="w-full block p-4 text-gray-900 focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-0"
              placeholder="Describe your business challenge or question here. For example: 'We are experiencing a 20% customer churn rate. What strategies should we implement to reduce this?'"
              value={customPrompt}
              onChange={(e) => onUpdateCustomPrompt(e.target.value)}
            />
            
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              {/* Character count */}
              <div className="text-xs text-gray-500">
                {canEnhancePrompt ? (
                  <span className="text-green-600 font-medium">{customPrompt.length} characters - ready for AI enhancement</span>
                ) : (
                  <span>
                    {customPrompt.length}/10 characters 
                    {customPrompt.length > 0 && !canEnhancePrompt && ' needed for enhancement'}
                  </span>
                )}
              </div>
              
              {/* Enhance prompt button */}
              {canEnhancePrompt && !showPromptTip && (
                <button
                  onClick={enhancePrompt}
                  disabled={isEnhancing}
                  className={`inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    isEnhancing ? 'opacity-70 cursor-not-allowed' : 'animate-pulse transition-transform hover:scale-105'
                  }`}
                >
                  {isEnhancing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enhancing...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Enhance with AI
                    </>
                  )}
                </button>
              )}
              
              {/* Direct generate button when no enhancement needed */}
              {customPrompt.trim().length > 0 && !showPromptTip && !canEnhancePrompt && (
                <button
                  onClick={() => {
                    document.dispatchEvent(new CustomEvent('generateResponses', { detail: customPrompt }));
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Generate Responses
                </button>
              )}
            </div>
          </div>
          
          {/* AI Enhanced Prompt Tooltip */}
          {showPromptTip && (
            <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-indigo-900">AI-Enhanced Prompt</h3>
                    <div className="mt-1 text-sm text-indigo-700">
                      <p>Our AI has enhanced your prompt to help you get more detailed, structured responses. The enhanced version includes:</p>
                      <ul className="mt-2 ml-4 list-disc space-y-1">
                        <li>Better context framing</li>
                        <li>Specific metrics or KPIs requests</li>
                        <li>Structure for actionable recommendations</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowPromptTip(false)}
                  className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <div className="mt-4">
                <div className="bg-white border border-indigo-200 rounded-lg p-4 text-sm text-gray-800 whitespace-pre-line">
                  {enhancedPrompt}
                </div>
                
                <div className="bg-gray-50 mt-4 p-4 rounded-lg border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Why this matters:</h4>
                  <p className="text-sm text-gray-600">
                    Effective prompts lead to better AI responses. Our enhancement adds structure and specificity to guide the models toward more actionable business insights.
                  </p>
                </div>
                
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={applyEnhancedPrompt}
                    className="w-full px-5 py-3 text-base font-medium rounded-lg shadow-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-105"
                  >
                    Use Enhanced Prompt & Generate Responses
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Helper component for category icons
const CategoryIcon: React.FC<{ category: string }> = ({ category }) => {
  switch (category.toLowerCase()) {
    case 'strategy':
      return (
        <svg className="h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
        </svg>
      );
    case 'marketing':
      return (
        <svg className="h-4 w-4 text-purple-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
          <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
        </svg>
      );
    case 'operations':
      return (
        <svg className="h-4 w-4 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      );
    case 'human resources':
      return (
        <svg className="h-4 w-4 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
      );
    case 'customer success':
      return (
        <svg className="h-4 w-4 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
        </svg>
      );
    default:
      return (
        <svg className="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      );
  }
}; 