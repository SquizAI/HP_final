import React, { useState } from 'react';
import { SocialMediaStrategy } from './SocialMediaStrategistMain';

// Using a simple animation fallback since framer-motion may not be available
const AnimatedDiv: React.FC<{
  children: React.ReactNode;
  className?: string;
  initial?: any;
  animate?: any;
  transition?: any;
}> = ({ children, className = '', initial, animate, transition }) => {
  return (
    <div 
      className={`transition-all duration-500 ${className}`} 
      style={{ opacity: 1, transform: 'none' }}
    >
      {children}
    </div>
  );
};

interface CompletionScreenProps {
  state: SocialMediaStrategy;
  onRestart: () => void;
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({ state, onRestart }) => {
  const [showCertificate, setShowCertificate] = useState(false);
  
  // Calculate completion stats
  const platformCount = state.selectedPlatforms.length;
  const contentItemCount = state.contentCalendar.length;
  const hasAudienceInsights = state.audienceInsights && state.audienceInsights.length > 0;
  const hasDescription = state.description && state.description.trim().length > 0;
  
  // Calculate completion percentage
  const totalSteps = 4; // Brand profile, audience research, platform selection, content planning
  let completedSteps = 0;
  
  if (hasDescription) completedSteps += 1;
  if (hasAudienceInsights) completedSteps += 1;
  if (platformCount > 0) completedSteps += 1;
  if (contentItemCount > 0) completedSteps += 1;
  
  const completionPercentage = Math.min(100, Math.round((completedSteps / totalSteps) * 100));
  
  // Get today's date for certificate
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-lg shadow-lg text-white mb-8">
        <h2 className="text-2xl font-bold mb-2 flex items-center">
          <span className="mr-3 text-yellow-300">🏆</span>
          Social Media Strategy Completed!
        </h2>
        <p className="opacity-90">
          Congratulations! You've successfully developed a comprehensive social media strategy for your brand.
        </p>
      </div>
      
      {/* Certificate Toggle */}
      {!showCertificate && (
        <AnimatedDiv 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="p-8 text-center bg-white rounded-lg shadow-md border-2 border-indigo-100">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Strategy Completed Successfully!</h3>
            <p className="text-gray-600 mb-6">
              You've created a professional social media strategy that's ready to implement!
            </p>
            <button
              onClick={() => setShowCertificate(true)}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:translate-y-[-2px] font-medium"
            >
              View Your Certificate
            </button>
          </div>
        </AnimatedDiv>
      )}
      
      {/* Certificate Display */}
      {showCertificate && (
        <AnimatedDiv 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="p-8 bg-indigo-50 rounded-lg border-2 border-indigo-200 shadow-lg relative">
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setShowCertificate(false)}
                className="text-indigo-500 hover:text-indigo-700 p-2 hover:bg-indigo-100 rounded-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="text-center mb-6">
              <h3 className="text-3xl font-bold text-indigo-800 mb-1">Certificate of Completion</h3>
              <p className="text-indigo-600">Social Media Strategy Expert</p>
            </div>
            
            <div className="text-center mb-6">
              <div className="text-6xl mb-3">🎓</div>
              <p className="text-gray-700">This certifies that</p>
              <p className="text-2xl font-bold text-indigo-900 mb-2">{state.brandName || "Your Brand"}</p>
              <p className="text-gray-700">has successfully completed the</p>
              <p className="text-xl font-semibold text-indigo-800 mb-2">Social Media Strategist Challenge</p>
              <p className="text-gray-700 mb-2">on {formattedDate}</p>
              <div className="w-48 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto my-4"></div>
              <p className="text-sm text-gray-600 italic">Advanced AI-Powered Skills Training</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h4 className="font-semibold text-gray-800 mb-3 text-lg">Strategy Highlights:</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Defined brand personality and positioning</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Created detailed audience insights</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Selected {platformCount} optimal platform{platformCount !== 1 ? 's' : ''} for your audience</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Developed {contentItemCount} content item{contentItemCount !== 1 ? 's' : ''} for your content calendar</span>
                </li>
              </ul>
            </div>
            
            <div className="text-center">
              <button
                onClick={() => window.print()}
                className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm mx-2"
              >
                Print Certificate
              </button>
            </div>
          </div>
        </AnimatedDiv>
      )}
      
      {/* Strategy Summary */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 bg-gray-50 p-3 rounded-lg border-l-4 border-purple-500 text-gray-800 flex items-center">
          <span className="mr-2 text-purple-500">📊</span>
          Your Strategy Summary
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Brand Summary */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
              <span className="mr-2 text-purple-500">🏢</span>
              Brand Profile
            </h4>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Brand Name</p>
              <p className="font-medium text-gray-800">{state.brandName || "Not specified"}</p>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Industry</p>
              <p className="font-medium text-gray-800">{state.industry || "Not specified"}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-1">Brand Personality</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {state.brandPersonalityTraits?.map((trait, index) => (
                  <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                    {trait}
                  </span>
                ))}
                {(!state.brandPersonalityTraits || state.brandPersonalityTraits.length === 0) && (
                  <p className="text-gray-400 italic">No personality traits selected</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Audience Summary */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
              <span className="mr-2 text-purple-500">👥</span>
              Audience Profile
            </h4>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Target Audience</p>
              {state.targetAudience && state.targetAudience.length > 0 ? (
                <p className="font-medium text-gray-800">
                  {state.targetAudience.join(', ')}
                </p>
              ) : (
                <p className="text-gray-400 italic">No target audience defined</p>
              )}
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-1">Social Media Goals</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {state.goals?.map((goal, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {goal}
                  </span>
                ))}
                {(!state.goals || state.goals.length === 0) && (
                  <p className="text-gray-400 italic">No goals specified</p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Content Planning Summary */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
          <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2 text-purple-500">📱</span>
            Platform Strategy
          </h4>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {state.selectedPlatforms.map((platform) => {
              // Count content items for this platform
              const itemCount = state.contentCalendar.filter(item => item.platform === platform).length;
              const platformName = platform.startsWith('custom-') 
                ? platform.replace('custom-', '').replace(/-/g, ' ')
                : platform.charAt(0).toUpperCase() + platform.slice(1);
                
              return (
                <div key={platform} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="text-center">
                    <div className="text-3xl mb-2">
                      {platform === 'instagram' && '📸'}
                      {platform === 'facebook' && '👍'}
                      {platform === 'twitter' && '🐦'}
                      {platform === 'linkedin' && '💼'}
                      {platform === 'tiktok' && '🎵'}
                      {platform === 'youtube' && '🎬'}
                      {platform === 'pinterest' && '📌'}
                      {platform === 'reddit' && '🤖'}
                      {platform.startsWith('custom-') && '🌐'}
                    </div>
                    <p className="font-medium text-gray-800">{platformName}</p>
                    <div className="mt-2 text-sm">
                      <span className={`px-2 py-1 rounded-full ${
                        itemCount > 0 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {itemCount} content item{itemCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {state.selectedPlatforms.length === 0 && (
              <div className="col-span-full text-center p-4">
                <p className="text-gray-400 italic">No platforms selected</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Content Calendar Summary */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-800 flex items-center">
              <span className="mr-2 text-purple-500">📅</span>
              Content Calendar Overview
            </h4>
            <div className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
              {contentItemCount} Total Items
            </div>
          </div>
          
          {contentItemCount > 0 ? (
            <div className="max-h-80 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Topic</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {state.contentCalendar.map((item, index) => {
                    const platformName = item.platform.startsWith('custom-') 
                      ? item.platform.replace('custom-', '').replace(/-/g, ' ')
                      : item.platform.charAt(0).toUpperCase() + item.platform.slice(1);
                      
                    return (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{platformName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.contentType}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{
                          item.topic.length > 40 ? item.topic.substring(0, 40) + "..." : item.topic
                        }</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.timing}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center p-4">
              <p className="text-gray-400 italic">No content items created</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
        <div className="flex-1 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100 shadow-sm text-center md:text-left">
          <h3 className="font-bold text-indigo-800 mb-2 text-lg">Ready to implement your strategy?</h3>
          <p className="text-indigo-700 mb-4">
            Your social media strategy is ready for implementation. Start executing your plan step by step.
          </p>
          <div className="progress-bar w-full bg-gray-200 rounded-full h-2.5 mb-3">
            <div 
              className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2.5 rounded-full" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">{completionPercentage}% strategy completion</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onRestart}
            className="px-6 py-3 border-2 border-purple-600 text-purple-700 rounded-lg hover:bg-purple-50 transition-all duration-200 flex items-center justify-center font-medium"
          >
            <span className="mr-2">🔄</span>
            Start New Strategy
          </button>
          
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center font-medium"
          >
            <span className="mr-2">📄</span>
            Export Strategy
          </button>
        </div>
      </div>
      
      {/* Additional Resources */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
        <h3 className="font-semibold text-gray-800 mb-4 text-lg flex items-center">
          <span className="mr-2 text-purple-500">📚</span>
          Additional Resources
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-sm transition-all">
            <div className="text-2xl mb-2">📊</div>
            <h4 className="font-medium text-gray-800 mb-1">Analytics Tracking Guide</h4>
            <p className="text-sm text-gray-600">Learn how to measure the success of your social media strategy</p>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-sm transition-all">
            <div className="text-2xl mb-2">🎨</div>
            <h4 className="font-medium text-gray-800 mb-1">Content Creation Tools</h4>
            <p className="text-sm text-gray-600">Discover tools to create engaging visual content for your platforms</p>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-sm transition-all">
            <div className="text-2xl mb-2">⏱️</div>
            <h4 className="font-medium text-gray-800 mb-1">Scheduling Best Practices</h4>
            <p className="text-sm text-gray-600">Tips for scheduling content to maximize engagement and reach</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletionScreen; 