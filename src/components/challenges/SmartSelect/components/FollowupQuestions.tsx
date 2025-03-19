import React, { useState } from 'react';
import { BusinessScenario, ModelResponse, ModelType, UserAnalysis } from '../SmartSelectMain';

interface FollowupQuestionsProps {
  scenario: BusinessScenario | null;
  responses: Record<ModelType, ModelResponse | null>;
  followupResponses: Record<ModelType, string | null>;
  userAnalysis: UserAnalysis | null;
  onAskFollowup: (question: string) => void;
  onRestart: () => void;
  isLoading: boolean;
}

export const FollowupQuestions: React.FC<FollowupQuestionsProps> = ({
  scenario,
  responses,
  followupResponses,
  userAnalysis,
  onAskFollowup,
  onRestart,
  isLoading
}) => {
  const [followupQuestion, setFollowupQuestion] = useState('');
  const [hasAskedEthicsQuestion, setHasAskedEthicsQuestion] = useState(false);
  const [hasAskedFutureQuestion, setHasAskedFutureQuestion] = useState(false);
  const [showComparisonRubric, setShowComparisonRubric] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState({
    ethics: false,
    future: false,
    businessValue: false
  });
  
  if (!scenario || !userAnalysis) {
    return <div>Missing scenario or analysis data</div>;
  }
  
  const basicResponse = responses.basic;
  const advancedResponse = responses.advanced;
  
  const handleAskFollowup = () => {
    if (followupQuestion.trim() === '') return;
    
    onAskFollowup(followupQuestion);
    
    // Check if it's an ethics question
    if (
      followupQuestion.toLowerCase().includes('ethics') || 
      followupQuestion.toLowerCase().includes('ethical') ||
      followupQuestion.toLowerCase().includes('risk') ||
      followupQuestion.toLowerCase().includes('bias')
    ) {
      setHasAskedEthicsQuestion(true);
      setCompletedChallenges(prev => ({...prev, ethics: true}));
    }
    
    // Check if it's a future implications question
    if (
      followupQuestion.toLowerCase().includes('future') || 
      followupQuestion.toLowerCase().includes('trend') ||
      followupQuestion.toLowerCase().includes('evolution') ||
      followupQuestion.toLowerCase().includes('next generation')
    ) {
      setHasAskedFutureQuestion(true);
      setCompletedChallenges(prev => ({...prev, future: true}));
    }
    
    // Check if it's a business value question
    if (
      followupQuestion.toLowerCase().includes('roi') || 
      followupQuestion.toLowerCase().includes('cost') ||
      followupQuestion.toLowerCase().includes('benefit') ||
      followupQuestion.toLowerCase().includes('value')
    ) {
      setCompletedChallenges(prev => ({...prev, businessValue: true}));
    }
  };
  
  const handleAskEthicsQuestion = () => {
    const ethicsQuestion = `What are the potential risks or ethical concerns with using AI for business decision-making in this ${scenario.title.toLowerCase()} scenario?`;
    setFollowupQuestion(ethicsQuestion);
    onAskFollowup(ethicsQuestion);
    setHasAskedEthicsQuestion(true);
    setCompletedChallenges(prev => ({...prev, ethics: true}));
  };
  
  const handleAskFutureQuestion = () => {
    const futureQuestion = `How might advancements in AI technology change how we approach this ${scenario.title.toLowerCase()} scenario in the next 3-5 years?`;
    setFollowupQuestion(futureQuestion);
    onAskFollowup(futureQuestion);
    setHasAskedFutureQuestion(true);
    setCompletedChallenges(prev => ({...prev, future: true}));
  };
  
  // Render the analysis summary
  const renderAnalysisSummary = () => {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Your Analysis Summary</h3>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700">Preferred AI Model:</h4>
          <p className="mt-1 text-sm text-gray-900">
            {userAnalysis.selectedModel === 'basic' ? 
              (basicResponse?.modelName || 'Basic AI Model') : 
              (advancedResponse?.modelName || 'Advanced AI Model')}
          </p>
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700">Reason for Selection:</h4>
          <p className="mt-1 text-sm text-gray-900">{userAnalysis.reasonForSelection}</p>
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700">Key Differences Identified:</h4>
          <ul className="mt-1 text-sm text-gray-900 list-disc pl-5 space-y-1">
            {userAnalysis.keyDifferences.map((difference, index) => (
              <li key={index}>{difference}</li>
            ))}
          </ul>
        </div>
        
        {(userAnalysis.notedStrengths.length > 0 && userAnalysis.notedStrengths[0] !== 'None noted') && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700">Noted Strengths:</h4>
            <ul className="mt-1 text-sm text-gray-900 list-disc pl-5 space-y-1">
              {userAnalysis.notedStrengths.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </div>
        )}
        
        {(userAnalysis.notedWeaknesses.length > 0 && userAnalysis.notedWeaknesses[0] !== 'None noted') && (
          <div>
            <h4 className="text-sm font-medium text-gray-700">Areas for Improvement:</h4>
            <ul className="mt-1 text-sm text-gray-900 list-disc pl-5 space-y-1">
              {userAnalysis.notedWeaknesses.map((weakness, index) => (
                <li key={index}>{weakness}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };
  
  // Render the challenge cards
  const renderChallengeCards = () => {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Extra Challenges</h3>
        <p className="text-sm text-gray-600 mb-6">
          Complete these extra challenges to deepen your understanding of AI capabilities and limitations.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Ethics Challenge */}
          <div className={`border rounded-lg overflow-hidden transition-all duration-300 ${completedChallenges.ethics ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}>
            <div className="p-4">
              <div className="flex items-center mb-3">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${completedChallenges.ethics ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="text-base font-medium text-gray-900">AI Ethics & Bias Check</h4>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Ask each AI model about potential ethical concerns or biases in the business scenario. Compare how each model handles these sensitive topics.
              </p>
              
              {completedChallenges.ethics ? (
                <div className="flex items-center text-green-600 text-sm">
                  <svg className="h-5 w-5 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Challenge Completed
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleAskEthicsQuestion}
                  disabled={isLoading}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs leading-4 font-medium rounded shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                >
                  Try This Challenge
                </button>
              )}
            </div>
          </div>
          
          {/* Future Trends Challenge */}
          <div className={`border rounded-lg overflow-hidden transition-all duration-300 ${completedChallenges.future ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}>
            <div className="p-4">
              <div className="flex items-center mb-3">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${completedChallenges.future ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.707.293l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L13.586 9H10a1 1 0 110-2h3.586l-2.293-2.293A1 1 0 0112 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="text-base font-medium text-gray-900">Future Trends Analysis</h4>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Ask each AI model how evolving technology might change approaches to this business scenario in the future. Compare their foresight capabilities.
              </p>
              
              {completedChallenges.future ? (
                <div className="flex items-center text-green-600 text-sm">
                  <svg className="h-5 w-5 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Challenge Completed
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleAskFutureQuestion}
                  disabled={isLoading}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs leading-4 font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Try This Challenge
                </button>
              )}
            </div>
          </div>
          
          {/* Business Value Challenge */}
          <div className={`border rounded-lg overflow-hidden transition-all duration-300 ${completedChallenges.businessValue ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}>
            <div className="p-4">
              <div className="flex items-center mb-3">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${completedChallenges.businessValue ? 'bg-green-100 text-green-600' : 'bg-indigo-100 text-indigo-600'}`}>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="text-base font-medium text-gray-900">ROI Justification</h4>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Ask each AI model to justify the ROI or business value of their recommended approach. Compare how they quantify and explain benefits.
              </p>
              
              {completedChallenges.businessValue ? (
                <div className="flex items-center text-green-600 text-sm">
                  <svg className="h-5 w-5 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Challenge Completed
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    const valueQuestion = `What is the potential ROI or business value of implementing your recommendations for this ${scenario.title.toLowerCase()} scenario?`;
                    setFollowupQuestion(valueQuestion);
                    onAskFollowup(valueQuestion);
                    setCompletedChallenges(prev => ({...prev, businessValue: true}));
                  }}
                  disabled={isLoading}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs leading-4 font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Try This Challenge
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => setShowComparisonRubric(!showComparisonRubric)}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            <svg 
              className={`h-5 w-5 mr-1 transition-transform duration-300 ${showComparisonRubric ? 'transform rotate-90' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            {showComparisonRubric ? 'Hide AI Model Comparison Framework' : 'View AI Model Comparison Framework'}
          </button>
          
          {showComparisonRubric && (
            <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-3">AI Model Comparison Framework</h4>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-blue-100">
                    <tr>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Criteria</th>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Basic AI Models</th>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Advanced AI Models</th>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">When to Choose</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-3 py-2 whitespace-nowrap text-gray-900 font-medium">Response Speed</td>
                      <td className="px-3 py-2 whitespace-nowrap text-gray-600">Typically faster</td>
                      <td className="px-3 py-2 whitespace-nowrap text-gray-600">May be slower due to deeper processing</td>
                      <td className="px-3 py-2 whitespace-nowrap text-gray-600">Basic for time-critical tasks, Advanced for tasks where quality outweighs speed</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 whitespace-nowrap text-gray-900 font-medium">Reasoning Depth</td>
                      <td className="px-3 py-2 whitespace-nowrap text-gray-600">Surface-level analysis, pattern matching</td>
                      <td className="px-3 py-2 whitespace-nowrap text-gray-600">Multi-step reasoning, considers context and implications</td>
                      <td className="px-3 py-2 whitespace-nowrap text-gray-600">Basic for straightforward tasks, Advanced for complex problem solving</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 whitespace-nowrap text-gray-900 font-medium">Nuance & Context</td>
                      <td className="px-3 py-2 whitespace-nowrap text-gray-600">May miss subtle context</td>
                      <td className="px-3 py-2 whitespace-nowrap text-gray-600">Better at capturing nuance and implicit details</td>
                      <td className="px-3 py-2 whitespace-nowrap text-gray-600">Basic for explicit tasks, Advanced when context is critical</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 whitespace-nowrap text-gray-900 font-medium">Ethical Awareness</td>
                      <td className="px-3 py-2 whitespace-nowrap text-gray-600">Basic recognition of potential issues</td>
                      <td className="px-3 py-2 whitespace-nowrap text-gray-600">More comprehensive ethical considerations</td>
                      <td className="px-3 py-2 whitespace-nowrap text-gray-600">Advanced for ethically sensitive or high-impact decisions</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 whitespace-nowrap text-gray-900 font-medium">Cost & Resources</td>
                      <td className="px-3 py-2 whitespace-nowrap text-gray-600">Lower computational requirements</td>
                      <td className="px-3 py-2 whitespace-nowrap text-gray-600">Higher computational requirements</td>
                      <td className="px-3 py-2 whitespace-nowrap text-gray-600">Choose based on value of decision vs. resource constraints</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <p className="mt-4 text-xs text-blue-700">
                Using this framework can help guide your decisions when selecting AI models for different business use cases.
                Consider the specific needs of your task and the relative strengths of each model type.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Render the followup question section
  const renderFollowupQuestion = () => {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-8">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Ask a Follow-up Question</h3>
          <p className="text-sm text-gray-600 mb-4">
            Test the AI models further by asking a follow-up question related to this business scenario.
          </p>
          
          <div className="mb-4">
            <textarea
              rows={3}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
              placeholder="Example: What are the potential risks of implementing these recommendations?"
              value={followupQuestion}
              onChange={(e) => setFollowupQuestion(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <button
              type="button"
              onClick={handleAskFollowup}
              disabled={followupQuestion.trim() === '' || isLoading}
              className={`px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white 
                ${followupQuestion.trim() === '' || isLoading ? 
                  'bg-gray-300 cursor-not-allowed' : 
                  'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
            >
              {isLoading ? 'Processing...' : 'Ask Question'}
            </button>
            
            {!hasAskedEthicsQuestion && (
              <button
                type="button"
                onClick={handleAskEthicsQuestion}
                disabled={isLoading}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Try the Ethics Challenge Question
              </button>
            )}
          </div>
        </div>
        
        {(followupResponses.basic || followupResponses.advanced) && (
          <div className="border-t border-gray-200">
            <div className="bg-gray-50 px-6 py-4">
              <h4 className="text-base font-medium text-gray-900 mb-2">AI Responses to Your Question</h4>
              
              {/* Basic AI Response */}
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h5 className="text-sm font-medium text-gray-900">{basicResponse?.modelName || 'Basic AI Model'}</h5>
                </div>
                
                <div className="pl-8 text-sm text-gray-700 bg-white p-3 rounded border border-gray-200">
                  {isLoading && !followupResponses.basic ? (
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  ) : followupResponses.basic ? (
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap font-sans">{followupResponses.basic}</pre>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">Ask a question to see the response</p>
                  )}
                </div>
              </div>
              
              {/* Advanced AI Response */}
              <div>
                <div className="flex items-center mb-2">
                  <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                  </div>
                  <h5 className="text-sm font-medium text-gray-900">{advancedResponse?.modelName || 'Advanced AI Model'}</h5>
                </div>
                
                <div className="pl-8 text-sm text-gray-700 bg-white p-3 rounded border border-gray-200">
                  {isLoading && !followupResponses.advanced ? (
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  ) : followupResponses.advanced ? (
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap font-sans">{followupResponses.advanced}</pre>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">Ask a question to see the response</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // Render the comparison feedback
  const renderResponseComparison = () => {
    if (!followupResponses.basic || !followupResponses.advanced) return null;
    
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Response Comparison
          </div>
        </h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">What to notice:</h4>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-1.5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span><strong>Depth of analysis:</strong> Compare how thoroughly each model considers multiple factors and implications.</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-1.5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span><strong>Evidence and reasoning:</strong> Note which model better explains the "why" behind its conclusions.</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-1.5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span><strong>Practical usefulness:</strong> Which response provides more actionable insights for business decision-making?</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-1.5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span><strong>Awareness of limitations:</strong> Does the model acknowledge uncertainty or limitations in its response?</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-blue-700 mb-2 flex items-center">
                <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-2">
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 000 16zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                Basic Model Characteristics
              </h4>
              <ul className="space-y-1 text-sm text-gray-600 pl-7 list-disc">
                <li>Faster responses, less computational overhead</li>
                <li>More straightforward, concise answers</li>
                <li>May offer less nuanced understanding</li>
                <li>Better for routine, well-defined tasks</li>
                <li>Can miss contextual subtleties</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-purple-700 mb-2 flex items-center">
                <div className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-2">
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                </div>
                Advanced Model Characteristics
              </h4>
              <ul className="space-y-1 text-sm text-gray-600 pl-7 list-disc">
                <li>More thorough reasoning capabilities</li>
                <li>Better at capturing nuance and implicit details</li>
                <li>Considers multiple perspectives and factors</li>
                <li>More likely to acknowledge limitations</li>
                <li>Better for complex, ambiguous scenarios</li>
              </ul>
            </div>
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
            <h2 className="text-2xl font-bold text-gray-900">Followup Analysis</h2>
            <p className="text-gray-600">
              Test the models further with additional questions to deepen your understanding of their capabilities.
            </p>
          </div>
        </div>
      </div>
      
      {renderAnalysisSummary()}
      {renderChallengeCards()}
      {renderFollowupQuestion()}
      {renderResponseComparison()}
      
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-8 text-center">
        <p className="text-gray-600 mb-4">
          You've completed the AI model comparison challenge!
        </p>
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="mr-2 -ml-1 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Try Another Scenario
        </button>
      </div>
    </div>
  );
}; 