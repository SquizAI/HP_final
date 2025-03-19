import React, { useState } from 'react';
import { BusinessScenario, ModelResponse, ModelType, UserAnalysis } from '../SmartSelectMain';

interface ComparisonAnalysisProps {
  scenario: BusinessScenario | null;
  responses: Record<ModelType, ModelResponse | null>;
  onSubmitAnalysis: (analysis: UserAnalysis) => void;
}

export const ComparisonAnalysis: React.FC<ComparisonAnalysisProps> = ({
  scenario,
  responses,
  onSubmitAnalysis
}) => {
  const [selectedModel, setSelectedModel] = useState<ModelType | null>(null);
  const [reasonForSelection, setReasonForSelection] = useState('');
  const [keyDifferences, setKeyDifferences] = useState<string[]>(['', '']);
  const [notedStrengths, setNotedStrengths] = useState<string[]>(['']);
  const [notedWeaknesses, setNotedWeaknesses] = useState<string[]>(['']);
  
  if (!scenario) {
    return <div>No scenario selected</div>;
  }
  
  const basicResponse = responses.basic;
  const advancedResponse = responses.advanced;
  
  // Add or remove difference field
  const handleAddDifference = () => {
    setKeyDifferences([...keyDifferences, '']);
  };
  
  const handleRemoveDifference = (index: number) => {
    setKeyDifferences(keyDifferences.filter((_, i) => i !== index));
  };
  
  // Update difference at index
  const handleUpdateDifference = (index: number, value: string) => {
    const newDifferences = [...keyDifferences];
    newDifferences[index] = value;
    setKeyDifferences(newDifferences);
  };
  
  // Add or remove strength field
  const handleAddStrength = () => {
    setNotedStrengths([...notedStrengths, '']);
  };
  
  const handleRemoveStrength = (index: number) => {
    setNotedStrengths(notedStrengths.filter((_, i) => i !== index));
  };
  
  // Update strength at index
  const handleUpdateStrength = (index: number, value: string) => {
    const newStrengths = [...notedStrengths];
    newStrengths[index] = value;
    setNotedStrengths(newStrengths);
  };
  
  // Add or remove weakness field
  const handleAddWeakness = () => {
    setNotedWeaknesses([...notedWeaknesses, '']);
  };
  
  const handleRemoveWeakness = (index: number) => {
    setNotedWeaknesses(notedWeaknesses.filter((_, i) => i !== index));
  };
  
  // Update weakness at index
  const handleUpdateWeakness = (index: number, value: string) => {
    const newWeaknesses = [...notedWeaknesses];
    newWeaknesses[index] = value;
    setNotedWeaknesses(newWeaknesses);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!selectedModel || !reasonForSelection || keyDifferences.some(d => d.trim() === '')) {
      alert('Please fill out all required fields');
      return;
    }
    
    // Filter out empty inputs
    const filteredStrengths = notedStrengths.filter(s => s.trim() !== '');
    const filteredWeaknesses = notedWeaknesses.filter(w => w.trim() !== '');
    
    // Create analysis object
    const analysis: UserAnalysis = {
      selectedModel,
      reasonForSelection,
      keyDifferences: keyDifferences.filter(d => d.trim() !== ''),
      notedStrengths: filteredStrengths.length > 0 ? filteredStrengths : ['None noted'],
      notedWeaknesses: filteredWeaknesses.length > 0 ? filteredWeaknesses : ['None noted']
    };
    
    onSubmitAnalysis(analysis);
  };
  
  // Render the model selection section
  const renderModelSelection = () => {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
            <svg className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Select the Better AI Model
          </h3>
          <p className="text-gray-600">
            Based on the responses you've compared, which model do you think provided the more useful output for this business scenario?
          </p>
        </div>
        
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic model option */}
            <div 
              className={`border rounded-lg p-4 cursor-pointer transition-all duration-300 
                ${selectedModel === 'basic' 
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                  : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50'
                }
              `}
              onClick={() => setSelectedModel('basic')}
            >
              <div className="flex items-center mb-2">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-base font-medium text-gray-900">{basicResponse?.modelName}</h4>
                  <p className="text-sm text-gray-500">Basic AI Model</p>
                </div>
                <div className="ml-auto">
                  <div className={`h-5 w-5 rounded-full border ${selectedModel === 'basic' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}>
                    {selectedModel === 'basic' && (
                      <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center mb-2">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5"></div>
                <span className="text-xs text-gray-600">Response time: {basicResponse?.responseTime}s</span>
              </div>
              <div className="group relative">
                <span className="text-xs text-gray-500 italic">Best for: speed, conciseness, straightforward answers</span>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-0 mb-2 w-64 hidden group-hover:block z-10">
                  <div className="bg-gray-800 text-white text-xs rounded py-1.5 px-2">
                    Basic models excel at simple tasks and providing quick answers 
                    when detailed analysis isn't required.
                    <svg className="absolute text-gray-800 h-2 w-2 left-3 top-full" x="0px" y="0px" viewBox="0 0 255 255">
                      <polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Advanced model option */}
            <div 
              className={`border rounded-lg p-4 cursor-pointer transition-all duration-300
                ${selectedModel === 'advanced' 
                  ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200' 
                  : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50'
                }
              `}
              onClick={() => setSelectedModel('advanced')}
            >
              <div className="flex items-center mb-2">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                  <svg className="h-5 w-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-base font-medium text-gray-900">{advancedResponse?.modelName}</h4>
                  <p className="text-sm text-gray-500">Advanced AI Model</p>
                </div>
                <div className="ml-auto">
                  <div className={`h-5 w-5 rounded-full border ${selectedModel === 'advanced' ? 'border-purple-600 bg-purple-600' : 'border-gray-300'}`}>
                    {selectedModel === 'advanced' && (
                      <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center mb-2">
                <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-1.5"></div>
                <span className="text-xs text-gray-600">Response time: {advancedResponse?.responseTime}s</span>
              </div>
              <div className="group relative">
                <span className="text-xs text-gray-500 italic">Best for: nuanced analysis, complex scenarios, detailed insights</span>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-0 mb-2 w-64 hidden group-hover:block z-10">
                  <div className="bg-gray-800 text-white text-xs rounded py-1.5 px-2">
                    Advanced models provide more thorough analysis and can handle 
                    complex scenarios with multiple factors to consider.
                    <svg className="absolute text-gray-800 h-2 w-2 left-3 top-full" x="0px" y="0px" viewBox="0 0 255 255">
                      <polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {!selectedModel && (
            <div className="mt-2 text-sm text-amber-600 flex items-center">
              <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Please select one of the models to continue
            </div>
          )}
        </div>
        
        <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-700">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-blue-800">Selection Tip</h4>
              <p className="mt-1">
                Consider which model provided more actionable insights for this specific business scenario. 
                Remember that different models excel in different situations.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render the reason for selection section
  const renderReasonForSelection = () => {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
            <svg className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Explain Your Selection
          </h3>
          <p className="text-gray-600 mb-2">
            Why did you select this model as the more effective one? What aspects of its response stood out to you?
          </p>
          
          <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 text-sm text-yellow-800">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-yellow-800">Reasoning Tip</h4>
                <p className="mt-1">
                  Your reasoning helps you better understand AI capabilities. Think about organization, depth of analysis, 
                  practical recommendations, and how well the model addressed all aspects of the prompt.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <textarea
            className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            rows={5}
            value={reasonForSelection}
            onChange={(e) => setReasonForSelection(e.target.value)}
            placeholder="Example: I selected this model because it provided more comprehensive analysis and actionable recommendations that addressed all aspects of the business problem..."
            aria-label="Reason for selecting this AI model"
          ></textarea>
          
          <div className="absolute bottom-3 right-3">
            <div className="group relative">
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label="View example response"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              
              {/* Example response tooltip */}
              <div className="absolute z-10 bottom-full right-0 transform translate-y-[-8px] w-72 hidden group-hover:block">
                <div className="bg-white text-gray-700 text-sm rounded-lg shadow-lg border border-gray-200 p-3">
                  <h5 className="font-medium text-gray-900 mb-1">Example Response:</h5>
                  <p className="text-sm text-gray-600">
                    "I selected the advanced model because it provided a more nuanced analysis that considered multiple factors like market 
                    conditions, implementation challenges, and ROI considerations. The advanced model's recommendations were more actionable 
                    and backed by specific reasoning."
                  </p>
                  <div className="absolute w-3 h-3 bg-white border-r border-b border-gray-200 transform rotate-45 right-3 -bottom-1.5"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {reasonForSelection.length === 0 && (
          <div className="mt-2 text-sm text-amber-600 flex items-center">
            <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Please provide your reasoning for selecting this model
          </div>
        )}
        
        <div className="mt-3 flex justify-end">
          <div className="text-sm text-gray-500">
            {reasonForSelection.length} / 500 characters
          </div>
        </div>
      </div>
    );
  };
  
  // Render the key differences section
  const renderKeyDifferences = () => {
    return (
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">3. Identify Key Differences</h3>
        <p className="text-sm text-gray-600 mb-4">
          What are the most important differences you noticed between the two AI responses?
        </p>
        
        {keyDifferences.map((difference, index) => (
          <div key={index} className="flex items-start mt-3">
            <div className="w-full">
              <div className="flex items-center mb-1">
                <span className="text-sm font-medium text-gray-700">Difference {index + 1}</span>
                {index > 0 && (
                  <button
                    type="button"
                    className="ml-2 text-xs text-red-600 hover:text-red-800"
                    onClick={() => handleRemoveDifference(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                type="text"
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                placeholder="e.g., The advanced model provides specific implementation steps while the basic model is more general"
                value={difference}
                onChange={(e) => handleUpdateDifference(index, e.target.value)}
              />
            </div>
          </div>
        ))}
        
        <button
          type="button"
          className="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs leading-4 font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={handleAddDifference}
        >
          <svg className="-ml-0.5 mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Another Difference
        </button>
      </div>
    );
  };
  
  // Render the strengths and weaknesses section
  const renderStrengthsWeaknesses = () => {
    return (
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">4. Strengths & Weaknesses (Optional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Strengths of Your Chosen Model</h4>
            {notedStrengths.map((strength, index) => (
              <div key={index} className="flex items-start mt-2">
                <div className="w-full">
                  <div className="flex items-center mb-1">
                    <span className="text-xs text-gray-500">Strength {index + 1}</span>
                    {index > 0 && (
                      <button
                        type="button"
                        className="ml-2 text-xs text-red-600 hover:text-red-800"
                        onClick={() => handleRemoveStrength(index)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                    placeholder="e.g., Clear actionable recommendations"
                    value={strength}
                    onChange={(e) => handleUpdateStrength(index, e.target.value)}
                  />
                </div>
              </div>
            ))}
            
            <button
              type="button"
              className="mt-2 inline-flex items-center px-2 py-1 border border-transparent text-xs leading-4 font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              onClick={handleAddStrength}
            >
              <svg className="-ml-0.5 mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Strength
            </button>
          </div>
          
          {/* Weaknesses */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Areas for Improvement</h4>
            {notedWeaknesses.map((weakness, index) => (
              <div key={index} className="flex items-start mt-2">
                <div className="w-full">
                  <div className="flex items-center mb-1">
                    <span className="text-xs text-gray-500">Weakness {index + 1}</span>
                    {index > 0 && (
                      <button
                        type="button"
                        className="ml-2 text-xs text-red-600 hover:text-red-800"
                        onClick={() => handleRemoveWeakness(index)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                    placeholder="e.g., Missing cost considerations"
                    value={weakness}
                    onChange={(e) => handleUpdateWeakness(index, e.target.value)}
                  />
                </div>
              </div>
            ))}
            
            <button
              type="button"
              className="mt-2 inline-flex items-center px-2 py-1 border border-transparent text-xs leading-4 font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={handleAddWeakness}
            >
              <svg className="-ml-0.5 mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Weakness
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Render the prompt information
  const renderPrompt = () => {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg shadow-sm p-5 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Analysis Instructions</h3>
            <p className="text-gray-600 mb-3">
              In this step, you'll analyze the differences between two AI models that responded to this prompt:
            </p>
            
            <div className="bg-white rounded-md p-3 border border-gray-200 mb-3">
              <p className="text-gray-800 font-medium">{scenario.prompt}</p>
            </div>
            
            <ul className="space-y-2 text-sm text-gray-600 list-disc pl-5 mb-2">
              <li>Select which model provided more valuable insights for this specific business scenario</li>
              <li>Explain your reasoning and identify key differences between the responses</li>
              <li>Note the strengths and weaknesses you observed in the responses</li>
            </ul>
            
            <p className="text-sm text-blue-600 italic">
              This exercise helps you build discernment in selecting the right AI model for different business needs.
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div>
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6 mb-8">
        <div className="flex items-center mb-4">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 shadow-sm">
            <svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Your Analysis</h2>
            <p className="text-gray-600">
              Compare the AI responses and analyze which model provides more valuable business insights.
            </p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-100 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-700">
                <span className="font-medium">Why this matters:</span> In real business scenarios, selecting the right AI model can significantly impact decision quality. Learning to analyze AI responses builds critical skills for effective AI utilization.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {renderPrompt()}
      
      <form onSubmit={handleSubmit}>
        {renderModelSelection()}
        {renderReasonForSelection()}
        {renderKeyDifferences()}
        {renderStrengthsWeaknesses()}
        
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Ready to Submit?</h3>
                <p className="text-sm text-gray-600">Submit your analysis to proceed to the followup questions.</p>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={!selectedModel || reasonForSelection.length === 0}
              className={`
                px-6 py-3 border text-base font-medium rounded-lg shadow-sm 
                ${!selectedModel || reasonForSelection.length === 0 
                  ? 'text-gray-500 bg-gray-100 border-gray-200 cursor-not-allowed' 
                  : 'text-white bg-blue-600 hover:bg-blue-700 border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition hover:scale-105'
                }
              `}
            >
              <div className="flex items-center">
                <span>Submit Analysis</span>
                <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </button>
          </div>
          
          {(!selectedModel || reasonForSelection.length === 0) && (
            <div className="mt-4 bg-amber-50 border border-amber-100 rounded-md p-3 text-sm text-amber-700">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <ul className="space-y-1 list-disc list-inside">
                    {!selectedModel && <li>Please select a model</li>}
                    {reasonForSelection.length === 0 && <li>Please explain your reasoning for selecting the model</li>}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}; 