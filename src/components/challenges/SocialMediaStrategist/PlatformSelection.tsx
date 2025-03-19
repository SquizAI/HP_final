import React, { useState, useEffect } from 'react';
import { SocialMediaStrategy } from './SocialMediaStrategistMain';
import { markChallengeAsCompleted } from '../../../utils/userDataManager';

interface PlatformSelectionProps {
  state: SocialMediaStrategy;
  updateState: (newState: Partial<SocialMediaStrategy>) => void;
  onNext: () => void;
  onBack: () => void;
}

// Platform data with detailed information
const PLATFORMS = [
  {
    id: 'instagram',
    name: 'Instagram',
    icon: '📸',
    description: 'Visual platform ideal for lifestyle, fashion, travel, and food brands. Strong for B2C with younger audiences.',
    demographics: 'Core: 18-34 years, slightly more female users',
    contentTypes: ['Photos', 'Stories', 'Reels', 'Carousels', 'IGTV'],
    bestFor: ['Visual storytelling', 'Brand aesthetics', 'Influencer marketing', 'Product showcases'],
    engagementLevel: 'High',
    timeCommitment: 'Medium-High',
    adOptions: ['Feed ads', 'Story ads', 'Reels ads', 'Shopping ads'],
    difficultyLevel: 'Medium'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: '👥',
    description: 'The largest social network with diverse demographics. Great for community building and local businesses.',
    demographics: 'Wide range, strongest in 25-54 years',
    contentTypes: ['Text posts', 'Images', 'Videos', 'Live streams', 'Stories', 'Groups'],
    bestFor: ['Community building', 'Events', 'Customer service', 'Local business promotion'],
    engagementLevel: 'Medium',
    timeCommitment: 'Medium',
    adOptions: ['Feed ads', 'Story ads', 'Marketplace ads', 'Video ads', 'Carousel ads'],
    difficultyLevel: 'Medium'
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: '🐦',
    description: 'Fast-paced platform for news, real-time updates, and trending conversations.',
    demographics: 'Core: 25-49 years, slightly more male users',
    contentTypes: ['Tweets (text)', 'Images', 'Short videos', 'Polls', 'Threads'],
    bestFor: ['Real-time updates', 'Customer service', 'Trending topics', 'Industry news'],
    engagementLevel: 'High',
    timeCommitment: 'High (requires frequent posting)',
    adOptions: ['Promoted tweets', 'Trend takeovers', 'Promoted accounts'],
    difficultyLevel: 'Medium-High'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: '💼',
    description: 'Professional network focused on B2B, recruitment, and thought leadership.',
    demographics: 'Core: 25-55 years, professionals, decision-makers',
    contentTypes: ['Articles', 'Text posts', 'Documents', 'Videos', 'Polls'],
    bestFor: ['B2B marketing', 'Thought leadership', 'Recruitment', 'Professional networking'],
    engagementLevel: 'Medium',
    timeCommitment: 'Low-Medium',
    adOptions: ['Sponsored content', 'Message ads', 'Text ads', 'Dynamic ads'],
    difficultyLevel: 'Low-Medium'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: '🎵',
    description: 'Entertainment-focused short video platform with high organic reach potential.',
    demographics: 'Core: 16-24 years, Gen Z and young Millennials',
    contentTypes: ['Short videos', 'Live streams', 'Duets', 'Stitches'],
    bestFor: ['Trend participation', 'Authentic content', 'Brand personality', 'Creative challenges'],
    engagementLevel: 'Very High',
    timeCommitment: 'High',
    adOptions: ['In-feed ads', 'TopView ads', 'Branded hashtag challenges', 'Brand effects'],
    difficultyLevel: 'Medium-High'
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: '🎥',
    description: 'Video platform ideal for tutorials, long-form content, and educational material.',
    demographics: 'Broad reach across all age groups',
    contentTypes: ['Long videos', 'Short videos', 'Live streams', 'Series', 'Tutorials'],
    bestFor: ['Detailed tutorials', 'Product reviews', 'Behind-the-scenes', 'Educational content'],
    engagementLevel: 'Medium-High',
    timeCommitment: 'High',
    adOptions: ['Display ads', 'Overlay ads', 'Skippable video ads', 'Non-skippable video ads'],
    difficultyLevel: 'High'
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    icon: '📌',
    description: 'Visual discovery platform for ideas, products, and inspiration.',
    demographics: 'Core: 25-44 years, predominantly female users',
    contentTypes: ['Pins (images)', 'Product pins', 'Video pins', 'Story pins'],
    bestFor: ['DIY/crafts', 'Home decor', 'Fashion', 'Food', 'Product discovery'],
    engagementLevel: 'Medium',
    timeCommitment: 'Low-Medium',
    adOptions: ['Standard pins', 'Shopping ads', 'Carousel ads', 'Video ads'],
    difficultyLevel: 'Low-Medium'
  },
  {
    id: 'reddit',
    name: 'Reddit',
    icon: '🤖',
    description: 'Community-driven platform organized by specific interest areas.',
    demographics: 'Core: 18-29 years, predominantly male users',
    contentTypes: ['Text posts', 'Images', 'Videos', 'Polls', 'AMAs'],
    bestFor: ['Niche communities', 'Direct feedback', 'Authentic engagement', 'Technical audiences'],
    engagementLevel: 'High',
    timeCommitment: 'Medium-High',
    adOptions: ['Promoted posts', 'Display ads', 'Trending takeovers'],
    difficultyLevel: 'High'
  }
];

// Simplified Platform Selection Component
const PlatformSelection: React.FC<PlatformSelectionProps> = ({ state, updateState, onNext, onBack }) => {
  // Initialize state with existing values or defaults
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(state.selectedPlatforms || []);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [customPlatformName, setCustomPlatformName] = useState('');
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [platformPriorities, setPlatformPriorities] = useState<{[key: string]: number}>(state.platformPriorities || {});
  
  // Initial recommendation based on brand info and audience
  useEffect(() => {
    // This would normally be an API call to an AI service
    // For demo purposes, we're using a simple algorithm to recommend platforms
    const recommendPlatforms = () => {
      let recommendedPlatforms: string[] = [];
      
      // Check industry type
      if (state.industry) {
        const industry = state.industry.toLowerCase();
        
        if (industry.includes('fashion') || industry.includes('beauty') || industry.includes('food') || industry.includes('travel')) {
          recommendedPlatforms.push('instagram', 'pinterest');
        }
        
        if (industry.includes('tech') || industry.includes('software') || industry.includes('b2b')) {
          recommendedPlatforms.push('linkedin', 'twitter');
        }
        
        if (industry.includes('education') || industry.includes('tutorial')) {
          recommendedPlatforms.push('youtube');
        }
        
        if (industry.includes('entertainment') || industry.includes('music') || industry.includes('creative')) {
          recommendedPlatforms.push('tiktok', 'instagram');
        }
      }
      
      // Check audience demographics
      const targetAudiences = state.targetAudience || [];
      
      if (targetAudiences.some(a => a.toLowerCase().includes('young') || a.toLowerCase().includes('gen z'))) {
        if (!recommendedPlatforms.includes('tiktok')) recommendedPlatforms.push('tiktok');
        if (!recommendedPlatforms.includes('instagram')) recommendedPlatforms.push('instagram');
      }
      
      if (targetAudiences.some(a => a.toLowerCase().includes('professional') || a.toLowerCase().includes('business'))) {
        if (!recommendedPlatforms.includes('linkedin')) recommendedPlatforms.push('linkedin');
      }
      
      if (targetAudiences.some(a => a.toLowerCase().includes('parent') || a.toLowerCase().includes('family'))) {
        if (!recommendedPlatforms.includes('facebook')) recommendedPlatforms.push('facebook');
        if (!recommendedPlatforms.includes('pinterest')) recommendedPlatforms.push('pinterest');
      }
      
      // If no specific recommendations, suggest general platforms
      if (recommendedPlatforms.length === 0) {
        recommendedPlatforms = ['instagram', 'facebook'];
      }
      
      // Limit to top 3
      return recommendedPlatforms.slice(0, 3);
    };
    
    setRecommendations(recommendPlatforms());
  }, [state.industry, state.targetAudience]);
  
  // Toggle platform selection
  const togglePlatform = (platformId: string) => {
    if (selectedPlatforms.includes(platformId)) {
      setSelectedPlatforms(selectedPlatforms.filter(id => id !== platformId));
      
      // Also remove from priorities
      const newPriorities = {...platformPriorities};
      delete newPriorities[platformId];
      setPlatformPriorities(newPriorities);
    } else {
      setSelectedPlatforms([...selectedPlatforms, platformId]);
      
      // Set default priority
      setPlatformPriorities({
        ...platformPriorities,
        [platformId]: selectedPlatforms.length + 1
      });
    }
  };
  
  // Handle priority change
  const handlePriorityChange = (platformId: string, priority: number) => {
    setPlatformPriorities({
      ...platformPriorities,
      [platformId]: priority
    });
  };
  
  // Generate AI recommendations
  const generateRecommendations = () => {
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      setShowAnalysis(true);
      setIsLoading(false);
    }, 2000);
  };
  
  // Add custom platform
  const handleAddCustomPlatform = () => {
    if (customPlatformName.trim()) {
      const customId = 'custom-' + customPlatformName.toLowerCase().replace(/\s+/g, '-');
      togglePlatform(customId);
      setCustomPlatformName('');
      setIsAddingCustom(false);
    }
  };
  
  // Complete the challenge
  const handleContinue = () => {
    if (selectedPlatforms.length === 0) {
      alert('Please select at least one platform before completing the challenge.');
      return;
    }
    
    // Disable button to prevent double clicks
    const btnElement = document.querySelector('button[data-complete-button="true"]');
    if (btnElement) {
      (btnElement as HTMLButtonElement).disabled = true;
    }
    
    // Sort platforms by priority
    const prioritizedPlatforms = [...selectedPlatforms].sort((a, b) => 
      (platformPriorities[a] || 999) - (platformPriorities[b] || 999)
    );
    
    // Update state with the selected platforms
    updateState({
      selectedPlatforms: prioritizedPlatforms,
      platformPriorities: platformPriorities
    });
    
    // Mark challenge as completed using the standardized approach
    markChallengeAsCompleted('challenge-12');
    
    // Proceed to the next step
    onNext();
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold text-indigo-800 mb-2">
          Select Your Social Media Platforms
        </h2>
        <p className="text-gray-700">
          Choose the platforms that align with your brand personality, goals, and where your audience is most active.
        </p>
      </div>
      
      {/* Audience and Brand Reminder */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 mb-8">
        <h3 className="font-medium text-gray-800 mb-3">Your Strategy Context</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Brand Personality:</p>
            <p className="font-medium text-gray-700">{state.brandPersonality || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Target Audience:</p>
            <div className="flex flex-wrap gap-2">
              {state.targetAudience && state.targetAudience.length > 0 ? (
                state.targetAudience.map((audience, index) => (
                  <span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                    {audience}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No audience segments selected</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Step 3: Platform Recommendations with Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="mr-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
          <h3 className="text-xl font-medium text-gray-800">
            Platform Recommendations
          </h3>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-600">View AI recommendations based on your brand inputs</p>
          <button
            onClick={generateRecommendations}
            className="px-5 py-3 text-base bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              <>Get AI Platform Analysis</>  
            )}
          </button>
        </div>
        
        {/* Recommended platforms with 3D buttons */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-100 mb-6 shadow-md">
          <div className="flex items-center mb-3">
            <span className="text-indigo-600 mr-2">✓</span>
            <p className="text-gray-700 font-medium">
              AI-Recommended platforms for your brand:
            </p>
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            {recommendations.map(platformId => {
              const platform = PLATFORMS.find(p => p.id === platformId);
              return platform ? (
                <button 
                  key={platform.id}
                  className={`flex items-center justify-center px-6 py-3 rounded-lg cursor-pointer transition-all duration-300 shadow-md hover:shadow-xl ${  
                    selectedPlatforms.includes(platform.id)
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white transform scale-105'
                      : 'bg-white border-2 border-indigo-200 text-indigo-800 hover:border-indigo-400 hover:-translate-y-1 active:translate-y-0'
                  }`}
                  onClick={() => togglePlatform(platform.id)}
                >
                  <span className="text-xl mr-2">{platform.icon}</span>
                  <span className="font-medium">{platform.name}</span>
                  {selectedPlatforms.includes(platform.id) && 
                    <span className="ml-2 bg-white bg-opacity-20 rounded-full w-5 h-5 flex items-center justify-center text-xs">✓</span>
                  }
                </button>
              ) : null;
            })}
          </div>
        </div>
        
        {/* Detailed AI analysis */}
        {showAnalysis && (
          <div className="bg-white p-6 rounded-lg border border-indigo-200 mb-6 shadow-md">
            <h3 className="font-medium text-indigo-800 mb-4 flex items-center text-lg">
              <span className="mr-2">🧠</span>
              AI-Powered Platform Analysis
            </h3>
            
            <div className="space-y-5">
              <div>
                <h4 className="font-medium text-indigo-700 mb-2">Primary Recommendation</h4>
                <p className="text-gray-700 mb-3">
                  Based on your brand attributes and audience demographics, we recommend:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 mb-3">
                  {recommendations.map(platformId => {
                    const platform = PLATFORMS.find(p => p.id === platformId);
                    return platform ? (
                      <li key={platform.id}>
                        <span className="font-medium">{platform.icon} {platform.name}</span>: {platform.bestFor.slice(0, 2).join(', ')}
                      </li>
                    ) : null;
                  })}
                </ul>
                <p className="text-gray-600 text-sm italic">
                  We suggest focusing on 2-3 platforms for an effective strategy, rather than spreading resources too thin.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-indigo-700 mb-1">Content Alignment</h4>
                <p className="text-gray-700 mb-1">
                  Your brand traits align well with these content types:
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">Visual storytelling</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">Behind-the-scenes</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">Educational content</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">Community engagement</span>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-indigo-700 mb-1">Platform Comparison</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-indigo-50">
                        <th className="px-4 py-2 text-left">Platform</th>
                        <th className="px-4 py-2 text-left">Time Required</th>
                        <th className="px-4 py-2 text-left">Difficulty</th>
                        <th className="px-4 py-2 text-left">Audience Match</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {recommendations.map(platformId => {
                        const platform = PLATFORMS.find(p => p.id === platformId);
                        return platform ? (
                          <tr key={platform.id}>
                            <td className="px-4 py-3">{platform.icon} {platform.name}</td>
                            <td className="px-4 py-3">{platform.timeCommitment}</td>
                            <td className="px-4 py-3">{platform.difficultyLevel}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-green-500 h-2 rounded-full" 
                                    style={{ width: (platformId === recommendations[0] ? '90%' : platformId === recommendations[1] ? '75%' : '60%') }}
                                  ></div>
                                </div>
                                <span className="ml-2 text-xs text-gray-600">
                                  {platformId === recommendations[0] ? 'High' : platformId === recommendations[1] ? 'Medium' : 'Fair'}
                                </span>
                              </div>
                            </td>
                          </tr>
                        ) : null;
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Step 4: Platform Selection */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="mr-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">4</div>
          <h3 className="text-xl font-medium text-gray-800">
            Choose Your Platforms
          </h3>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-600">Select the platforms you want to include in your social media strategy</p>
          <button
            onClick={() => setIsAddingCustom(true)}
            className="px-4 py-2 text-sm bg-white border-2 border-indigo-300 text-indigo-700 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1 active:translate-y-0 flex items-center"
          >
            <span className="text-xl mr-1">+</span> Add Custom Platform
          </button>
        </div>
        
        {isAddingCustom && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-100 mb-6 shadow-lg">
            <h4 className="font-medium text-indigo-800 mb-4 flex items-center">
              <span className="text-indigo-600 mr-2">✨</span>
              Add Your Custom Platform
            </h4>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customPlatformName}
                onChange={(e) => setCustomPlatformName(e.target.value)}
                className="flex-grow px-4 py-3 border-2 border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-inner transition-all"
                placeholder="e.g., Threads, Bluesky, etc."
              />
              <button
                onClick={handleAddCustomPlatform}
                className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                disabled={!customPlatformName.trim()}
              >
                Add Platform
              </button>
              <button
                onClick={() => setIsAddingCustom(false)}
                className="px-4 py-3 bg-white border-2 border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-md"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PLATFORMS.map(platform => (
            <div
              key={platform.id}
              className={`p-6 border-2 rounded-xl transition-all duration-300 cursor-pointer shadow-md relative overflow-hidden ${  
                selectedPlatforms.includes(platform.id)
                  ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 transform scale-[1.02] shadow-lg'
                  : 'border-gray-200 hover:border-indigo-300 hover:shadow-lg hover:-translate-y-1'
              }`}
              onClick={() => togglePlatform(platform.id)}
            >
              {/* Background effect for selected platforms */}
              {selectedPlatforms.includes(platform.id) && (
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute -right-10 -top-10 bg-indigo-300 rounded-full w-24 h-24 blur-2xl"></div>
                  <div className="absolute -left-10 -bottom-10 bg-purple-300 rounded-full w-24 h-24 blur-2xl"></div>
                </div>
              )}
              
              {/* Pulse effect for recommended platforms */}
              {recommendations.includes(platform.id) && !selectedPlatforms.includes(platform.id) && (
                <div className="absolute top-2 right-2 flex items-center justify-center">
                  <div className="absolute w-5 h-5 rounded-full bg-indigo-400 animate-ping opacity-50"></div>
                  <div className="relative w-3 h-3 rounded-full bg-indigo-600"></div>
                </div>
              )}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="text-2xl mr-3 bg-gradient-to-r from-indigo-100 to-purple-100 p-2 rounded-lg">{platform.icon}</div>
                  <h3 className="font-semibold text-gray-800 text-lg">{platform.name}</h3>
                </div>
                {selectedPlatforms.includes(platform.id) && (
                  <div className="flex items-center bg-white rounded-lg p-1 shadow-md border border-indigo-100">
                    <label className="text-sm text-indigo-700 mx-2 font-medium">Priority</label>
                    <select
                      value={platformPriorities[platform.id] || 999}
                      onChange={(e) => handlePriorityChange(platform.id, Number(e.target.value))}
                      onClick={(e) => e.stopPropagation()} // Prevent toggling when clicking on select
                      className="px-3 py-1 text-sm border border-indigo-200 rounded-lg bg-white shadow-inner focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300"
                    >
                      {selectedPlatforms.map((_, index) => (
                        <option key={index} value={index + 1}>
                          {index + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <p className="text-gray-700 mb-4">
                {platform.description}
              </p>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-indigo-700 mb-2">Best For:</p>
                  <div className="flex flex-wrap gap-2">
                    {platform.bestFor.slice(0, 3).map((use, index) => (
                      <span key={index} className="px-3 py-1 bg-gradient-to-r from-purple-100 to-indigo-100 text-indigo-800 text-sm rounded-full shadow-sm">
                        {use}
                      </span>
                    ))}
                    {platform.bestFor.length > 3 && (
                      <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-indigo-100 text-indigo-800 text-sm rounded-full shadow-sm">
                        +{platform.bestFor.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-indigo-700 mb-1">Target Audience:</p>
                  <p className="text-gray-700">{platform.demographics}</p>
                </div>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-700">
                  <span className="flex items-center"><span className="text-indigo-500 mr-1">⏱️</span> Time: {platform.timeCommitment}</span>
                  <span className="flex items-center"><span className="text-indigo-500 mr-1">💬</span> Engagement: {platform.engagementLevel}</span>
                  <span className="flex items-center"><span className="text-indigo-500 mr-1">📊</span> Difficulty: {platform.difficultyLevel}</span>
                </div>
                {selectedPlatforms.includes(platform.id) && (
                  <div className="mt-2 flex justify-end">
                    <span className="text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full flex items-center text-sm">
                      <span className="mr-1">✓</span> Selected
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Custom platforms */}
          {selectedPlatforms
            .filter(id => id.startsWith('custom-'))
            .map(platformId => (
              <div
                key={platformId}
                className="p-6 border-2 border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl transition-all duration-300 cursor-pointer shadow-lg transform scale-[1.02]"
                onClick={() => togglePlatform(platformId)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="text-2xl mr-3 bg-gradient-to-r from-indigo-100 to-purple-100 p-2 rounded-lg">🌐</div>
                    <h3 className="font-semibold text-gray-800 text-lg capitalize">
                      {platformId.replace('custom-', '').replace(/-/g, ' ')}
                    </h3>
                  </div>
                  <div className="flex items-center bg-white rounded-lg p-1 shadow-md border border-indigo-100">
                    <label className="text-sm text-indigo-700 mx-2 font-medium">Priority</label>
                    <select
                      value={platformPriorities[platformId] || 999}
                      onChange={(e) => handlePriorityChange(platformId, Number(e.target.value))}
                      onClick={(e) => e.stopPropagation()} // Prevent toggling when clicking on select
                      className="px-3 py-1 text-sm border border-indigo-200 rounded-lg bg-white shadow-inner focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300"
                    >
                      {selectedPlatforms.map((_, index) => (
                        <option key={index} value={index + 1}>
                          {index + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Custom platform added by user
                </p>
              </div>
            ))}
        </div>
      </div>
      
      {/* Summary of Selected Platforms */}
      {selectedPlatforms.length > 0 && (
        <div className="mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 p-5 rounded-lg border-2 border-indigo-200 shadow-md hover:shadow-lg transition-all duration-300">
          <h3 className="font-medium text-indigo-800 mb-4 flex items-center">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-xs font-bold">{selectedPlatforms.length}</span>
            Your Selected Platforms
          </h3>
          
          <div className="space-y-3">
            {[...selectedPlatforms]
              .sort((a, b) => (platformPriorities[a] || 999) - (platformPriorities[b] || 999))
              .map(platformId => {
                const platform = PLATFORMS.find(p => p.id === platformId);
                const isCustom = platformId.startsWith('custom-');
                
                return (
                  <div 
                    key={platformId} 
                    className="flex items-center justify-between p-3 rounded-lg bg-white border border-indigo-100 shadow-sm hover:shadow-md hover:border-indigo-200 transform hover:-translate-y-1 transition-all duration-300 mb-2"
                  >
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 shadow-sm mr-3 border border-indigo-200">
                        {platformPriorities[platformId] || '?'}
                      </div>
                      {isCustom ? (
                        <span className="font-medium text-gray-800">
                          {platformId.replace('custom-', '').replace(/-/g, ' ')}
                        </span>
                      ) : platform ? (
                        <span className="font-medium text-gray-800 flex items-center">
                          <span className="mr-2 transform transition-transform duration-300 hover:scale-110">{platform.icon}</span> {platform.name}
                        </span>
                      ) : null}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlatform(platformId);
                      }}
                      className="px-2 py-1 text-white bg-gradient-to-r from-red-400 to-red-500 rounded-md hover:from-red-500 hover:to-red-600 transition-all duration-300 transform hover:scale-105 text-xs font-medium shadow-sm"
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
          </div>
          
          <div className="mt-4 bg-white p-3 rounded-lg border border-indigo-100 shadow-inner text-sm text-gray-600">
            <p className="flex items-center">
              <span className="text-indigo-500 mr-2">💡</span>
              Tip: The order of platforms determines their priority in your strategy
            </p>
          </div>
        </div>
      )}
      
      {/* Pro Tips - Step 5 */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="mr-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">5</div>
          <h3 className="text-xl font-medium text-gray-800">Pro Tips</h3>
        </div>
        
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100 shadow-md">
          <h3 className="font-medium text-indigo-800 mb-4 flex items-center text-lg">
            <span className="mr-2">💡</span>
            Expert Social Media Advice
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start bg-white p-3 rounded-lg shadow-sm border border-indigo-50">
              <span className="text-indigo-500 mr-3 text-xl">•</span>
              <span>Focus on 2-3 platforms maximum for a more focused and effective strategy.</span>
            </li>
            <li className="flex items-start bg-white p-3 rounded-lg shadow-sm border border-indigo-50">
              <span className="text-indigo-500 mr-3 text-xl">•</span>
              <span>Prioritize platforms where your target audience is most active and engaged.</span>
            </li>
            <li className="flex items-start bg-white p-3 rounded-lg shadow-sm border border-indigo-50">
              <span className="text-indigo-500 mr-3 text-xl">•</span>
              <span>Consider your content creation capacity and available time when selecting platforms.</span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Navigation buttons section */}
      <div className="mb-12 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100 shadow-md">
        <div className="text-center md:text-left mb-4">
          <h3 className="text-lg font-medium text-indigo-700 mb-2">Step 3: Platform Selection</h3>
          <p className="text-gray-600">
            {selectedPlatforms.length === 0 ? 
              "Select at least one platform to continue" : 
              `You have selected ${selectedPlatforms.length} platform${selectedPlatforms.length > 1 ? 's' : ''}`}
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="w-full md:w-auto px-6 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center"
          >
            <span className="mr-2">←</span> Back to Audience Research
          </button>
          
          <button
            onClick={handleContinue}
            className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center font-semibold text-lg"
            disabled={selectedPlatforms.length === 0}
            data-complete-button="true"
            style={{
              animation: selectedPlatforms.length > 0 ? 'pulse-shadow 2s infinite' : 'none',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <span className="relative z-10 flex items-center">
              Complete Challenge <span className="ml-3 text-xl">✓</span>
            </span>
            <span 
              className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 hover:opacity-40 transition-opacity duration-300"
              style={{ 
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
              }}
            ></span>
          </button>
        </div>
        
        {/* Show message when button is disabled */}
        {selectedPlatforms.length === 0 && (
          <div className="mt-4 text-center text-orange-600 bg-orange-50 p-3 rounded-lg border border-orange-100">
            <span className="font-medium">Please select at least one platform to complete the challenge</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlatformSelection; 