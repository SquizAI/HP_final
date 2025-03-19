import React, { useState } from 'react';
import { SocialMediaStrategy, AudienceInsight } from './SocialMediaStrategistMain';

interface AudienceResearchProps {
  state: SocialMediaStrategy;
  updateState: (newState: Partial<SocialMediaStrategy>) => void;
  onNext: () => void;
  onBack: () => void;
}

// Predefined audience segments
const AUDIENCE_SEGMENTS = [
  {
    id: 'young-professionals',
    name: 'Young Professionals',
    icon: '💼',
    demographics: '25-34 years, college educated, urban, early career',
    interests: ['Career development', 'Networking', 'Work-life balance', 'Technology'],
    painPoints: ['Time constraints', 'Career advancement', 'Stress management'],
    platforms: ['Instagram', 'LinkedIn', 'TikTok']
  },
  {
    id: 'parents',
    name: 'Parents',
    icon: '👪',
    demographics: '30-45 years, mix of education levels, suburban, family-focused',
    interests: ['Parenting tips', 'Family activities', 'Health & wellness'],
    painPoints: ['Time management', 'Work-life balance'],
    platforms: ['Facebook', 'Pinterest', 'Instagram']
  },
  {
    id: 'gen-z',
    name: 'Gen Z',
    icon: '🎮',
    demographics: '18-24 years, digital natives, diverse locations, value-driven',
    interests: ['Social causes', 'Digital trends', 'Entertainment', 'Self-expression'],
    painPoints: ['Mental health', 'Information authenticity'],
    platforms: ['TikTok', 'Instagram', 'YouTube']
  },
  {
    id: 'small-business',
    name: 'Small Business Owners',
    icon: '🏪',
    demographics: '35-55 years, self-employed, entrepreneurial, varied locations',
    interests: ['Business growth', 'Marketing strategies', 'Work-life balance'],
    painPoints: ['Limited resources', 'Customer acquisition'],
    platforms: ['LinkedIn', 'Facebook', 'Instagram']
  }
];

const AudienceResearch: React.FC<AudienceResearchProps> = ({ state, updateState, onNext, onBack }) => {
  const [selectedSegments, setSelectedSegments] = useState<string[]>(
    state.audienceInsights.map(insight => insight.segment)
  );
  const [customSegment, setCustomSegment] = useState<AudienceInsight>({
    segment: '',
    demographics: '',
    interests: [],
    painPoints: [],
    platforms: []
  });
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customInterestInput, setCustomInterestInput] = useState('');
  const [customPainPointInput, setCustomPainPointInput] = useState('');
  const [customPlatformInput, setCustomPlatformInput] = useState('');
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);
  
  // Toggle selection of a predefined segment
  const toggleSegment = (segmentId: string) => {
    if (selectedSegments.includes(segmentId)) {
      setSelectedSegments(selectedSegments.filter(id => id !== segmentId));
    } else {
      setSelectedSegments([...selectedSegments, segmentId]);
    }
  };
  
  // Handle custom segment field changes
  const handleCustomSegmentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCustomSegment({
      ...customSegment,
      [e.target.name]: e.target.value
    });
  };
  
  // Add custom interest to the list
  const addCustomInterest = () => {
    if (customInterestInput.trim()) {
      setCustomSegment({
        ...customSegment,
        interests: [...customSegment.interests, customInterestInput.trim()]
      });
      setCustomInterestInput('');
    }
  };
  
  // Remove a custom interest
  const removeCustomInterest = (index: number) => {
    setCustomSegment({
      ...customSegment,
      interests: customSegment.interests.filter((_, i) => i !== index)
    });
  };
  
  // Add custom pain point to the list
  const addCustomPainPoint = () => {
    if (customPainPointInput.trim()) {
      setCustomSegment({
        ...customSegment,
        painPoints: [...customSegment.painPoints, customPainPointInput.trim()]
      });
      setCustomPainPointInput('');
    }
  };
  
  // Remove a custom pain point
  const removeCustomPainPoint = (index: number) => {
    setCustomSegment({
      ...customSegment,
      painPoints: customSegment.painPoints.filter((_, i) => i !== index)
    });
  };
  
  // Add custom platform to the list
  const addCustomPlatform = () => {
    if (customPlatformInput.trim()) {
      setCustomSegment({
        ...customSegment,
        platforms: [...customSegment.platforms, customPlatformInput.trim()]
      });
      setCustomPlatformInput('');
    }
  };
  
  // Remove a custom platform
  const removeCustomPlatform = (index: number) => {
    setCustomSegment({
      ...customSegment,
      platforms: customSegment.platforms.filter((_, i) => i !== index)
    });
  };
  
  // Submit custom segment
  const handleAddCustomSegment = () => {
    if (customSegment.segment && customSegment.demographics && 
        customSegment.interests.length > 0 && customSegment.platforms.length > 0) {
      setSelectedSegments([...selectedSegments, customSegment.segment]);
      setIsAddingCustom(false);
      // Reset custom segment form
      setCustomSegment({
        segment: '',
        demographics: '',
        interests: [],
        painPoints: [],
        platforms: []
      });
    }
  };
  
  // Generate AI audience analysis
  const generateAudienceAnalysis = () => {
    setIsGeneratingAnalysis(true);
    
    // Simulate API delay (in a real app, this would call an AI service)
    setTimeout(() => {
      setShowAIAnalysis(true);
      setIsGeneratingAnalysis(false);
    }, 2000);
  };
  
  // Complete audience research and move to next step
  const handleContinue = () => {
    // Build audience insights from selected segments
    const audienceInsights: AudienceInsight[] = selectedSegments.map(segmentId => {
      const predefinedSegment = AUDIENCE_SEGMENTS.find(segment => segment.id === segmentId);
      
      if (predefinedSegment) {
        return {
          segment: predefinedSegment.name,
          demographics: predefinedSegment.demographics,
          interests: predefinedSegment.interests,
          painPoints: predefinedSegment.painPoints,
          platforms: predefinedSegment.platforms
        };
      }
      
      // If it's not a predefined segment, it must be a custom one
      // In a real implementation, you'd store and retrieve custom segments
      return {
        segment: segmentId,
        demographics: 'Custom audience demographics',
        interests: ['Interest 1', 'Interest 2'],
        painPoints: ['Pain point 1', 'Pain point 2'],
        platforms: ['Platform 1', 'Platform 2']
      };
    });
    
    // Update the main state with audience insights
    updateState({
      audienceInsights,
      // Extract platforms from audience segments for later use
      targetAudience: audienceInsights.map(insight => insight.segment)
    });
    
    onNext();
  };
  
  // Handle audience analysis
  const handleGenerateAnalysis = () => {
    generateAudienceAnalysis();
  };
  
  return (
    <div className="relative flex min-h-screen bg-gray-50">
      {/* Side Progress Panel - Only visible on desktop */}
      <div className="hidden lg:block w-64 bg-gradient-to-b from-indigo-800 to-blue-900 text-white p-6 shadow-lg fixed left-0 top-0 h-full">
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-2">Social Media Strategist</h3>
          <p className="text-blue-200 text-sm">Building your strategy...</p>
        </div>
        
        <div className="space-y-4">
          <div className="relative pl-8">
            <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <span className="text-xs font-bold">1</span>
            </div>
            <div className="border-l-2 border-green-500 absolute left-3 top-6 h-12"></div>
            <p className="font-medium">Brand Profiling</p>
            <p className="text-xs text-blue-200 mt-1">Completed</p>
          </div>
          
          <div className="relative pl-8">
            <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-white text-indigo-800 flex items-center justify-center">
              <span className="text-xs font-bold">2</span>
            </div>
            <div className="border-l-2 border-gray-500 absolute left-3 top-6 h-12"></div>
            <p className="font-medium">Audience Research</p>
            <p className="text-xs text-white mt-1">In progress</p>
          </div>
          
          <div className="relative pl-8">
            <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center opacity-70">
              <span className="text-xs font-bold">3</span>
            </div>
            <div className="border-l-2 border-gray-500 absolute left-3 top-6 h-12"></div>
            <p className="font-medium text-gray-300">Platform Selection</p>
            <p className="text-xs text-gray-400 mt-1">Not started</p>
          </div>
          
          <div className="relative pl-8">
            <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center opacity-70">
              <span className="text-xs font-bold">4</span>
            </div>
            <p className="font-medium text-gray-300">Content Calendar</p>
            <p className="text-xs text-gray-400 mt-1">Not started</p>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-0 right-0 px-6">
          <div className="bg-blue-700 rounded-lg p-4">
            <h4 className="font-medium mb-2">Need Help?</h4>
            <p className="text-sm text-blue-200 mb-3">Our AI assistant can guide you through each step.</p>
            <button className="w-full bg-white text-blue-800 rounded-md py-2 text-sm font-medium hover:bg-blue-50">Get AI Tips</button>
          </div>
        </div>
      </div>
      
      <div className="w-full lg:ml-64 p-6 max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-xl mb-8 shadow-lg text-white">
        <h2 className="text-2xl font-bold mb-3 flex items-center">
          <span className="bg-white text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 shadow-md">2</span>
          Identify Your Target Audience
        </h2>
        <p className="text-blue-100 text-lg">
          Understanding who you're trying to reach is critical to creating relevant content and selecting the right platforms.
        </p>
      </div>
      
      {/* Brand Context Reminder */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 mb-8">
        <h3 className="font-medium text-gray-800 mb-3 flex items-center">
          <span className="text-blue-500 mr-2">🏢</span>
          Your Brand Context
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Brand Name:</p>
            <p className="font-medium text-gray-700">{state.brandName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Industry:</p>
            <p className="font-medium text-gray-700">{state.industry}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Brand Personality:</p>
            <p className="font-medium text-gray-700">{state.brandPersonality}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Primary Goals:</p>
            <div className="flex flex-wrap gap-2">
              {state.goals.map((goalId) => (
                <span key={goalId} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {goalId}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Audience Segments Selection */}
      {!isAddingCustom && (
        <div className="mb-10">
          <div className="flex items-center mb-3">
            <div className="mr-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
            <h3 className="text-xl font-semibold text-gray-800">
              Select Your Target Audience
            </h3>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600">Choose your primary audience segments (select 1-2)</p>
            <button
              onClick={() => setIsAddingCustom(true)}
              className="px-4 py-2 text-sm font-medium text-indigo-600 border-2 border-indigo-200 rounded-lg hover:bg-indigo-50 transition-all shadow-sm hover:shadow-md"
            >
              + Add Custom Segment
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {AUDIENCE_SEGMENTS.map((segment) => (
              <div
                key={segment.id}
                className={`p-5 border-2 rounded-xl cursor-pointer transition-all ${
                  selectedSegments.includes(segment.id) 
                    ? 'border-indigo-500 bg-indigo-50 shadow-lg transform -translate-y-1' 
                    : 'border-gray-200 hover:border-indigo-300 hover:shadow-md'
                }`}
                onClick={() => toggleSegment(segment.id)}
              >
                <div className="flex items-center mb-3">
                  <span className="text-4xl mr-4">{segment.icon}</span>
                  <h3 className="text-lg font-medium text-gray-800">{segment.name}</h3>
                </div>
                <p className="text-md text-gray-600 mb-4 border-b pb-3">
                  <span className="font-medium">Demographics:</span> {segment.demographics}
                </p>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Key Interests:</p>
                    <div className="flex flex-wrap gap-1">
                      {segment.interests.slice(0, 3).map((interest, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {interest}
                        </span>
                      ))}
                      {segment.interests.length > 3 && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          +{segment.interests.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700 mb-2">Top Platforms:</p>
                    <div className="flex flex-wrap gap-2">
                      {segment.platforms.map((platform, index) => (
                        <span key={index} className="px-3 py-1.5 bg-blue-100 text-blue-800 text-sm rounded-full shadow-sm">
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Custom Audience Form */}
      {isAddingCustom && (
        <div className="mb-8 bg-white p-6 rounded-lg border border-blue-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-blue-800">
              Define Custom Audience Segment
            </h3>
            <button
              onClick={() => setIsAddingCustom(false)}
              className="px-2 py-1 text-gray-500 hover:text-gray-700"
            >
              ← Back to Predefined Segments
            </button>
          </div>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Segment Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="segment"
                value={customSegment.segment}
                onChange={handleCustomSegmentChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Tech-savvy Millennials"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Demographics <span className="text-red-500">*</span>
              </label>
              <textarea
                name="demographics"
                value={customSegment.demographics}
                onChange={handleCustomSegmentChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-20"
                placeholder="Describe age range, education, location, income level, etc."
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interests <span className="text-red-500">*</span>
              </label>
              <div className="flex mb-2">
                <input
                  type="text"
                  value={customInterestInput}
                  onChange={(e) => setCustomInterestInput(e.target.value)}
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Sustainable living"
                />
                <button
                  onClick={addCustomInterest}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                  disabled={!customInterestInput.trim()}
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {customSegment.interests.map((interest, index) => (
                  <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full flex items-center">
                    {interest}
                    <button
                      onClick={() => removeCustomInterest(index)}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              {customSegment.interests.length === 0 && (
                <p className="text-xs text-gray-500">Add at least one interest</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pain Points
              </label>
              <div className="flex mb-2">
                <input
                  type="text"
                  value={customPainPointInput}
                  onChange={(e) => setCustomPainPointInput(e.target.value)}
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Lack of time"
                />
                <button
                  onClick={addCustomPainPoint}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                  disabled={!customPainPointInput.trim()}
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {customSegment.painPoints.map((painPoint, index) => (
                  <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full flex items-center">
                    {painPoint}
                    <button
                      onClick={() => removeCustomPainPoint(index)}
                      className="ml-2 text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Platforms <span className="text-red-500">*</span>
              </label>
              <div className="flex mb-2">
                <input
                  type="text"
                  value={customPlatformInput}
                  onChange={(e) => setCustomPlatformInput(e.target.value)}
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Instagram"
                />
                <button
                  onClick={addCustomPlatform}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                  disabled={!customPlatformInput.trim()}
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {customSegment.platforms.map((platform, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center">
                    {platform}
                    <button
                      onClick={() => removeCustomPlatform(index)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              {customSegment.platforms.length === 0 && (
                <p className="text-xs text-gray-500">Add at least one platform</p>
              )}
            </div>
            
            <div className="flex justify-end mt-4">
              <button
                onClick={handleAddCustomSegment}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                disabled={
                  !customSegment.segment ||
                  !customSegment.demographics ||
                  customSegment.interests.length === 0 ||
                  customSegment.platforms.length === 0
                }
              >
                Add Custom Segment
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Selected Segments Summary */}
      {selectedSegments.length > 0 && !isAddingCustom && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800">
              Your Selected Audience Segments
            </h3>
            <button
              onClick={generateAudienceAnalysis}
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors flex items-center"
              disabled={isGeneratingAnalysis}
            >
              {isGeneratingAnalysis ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>Get AI Audience Analysis</>
              )}
            </button>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
            <ul className="divide-y divide-gray-100">
              {selectedSegments.map((segmentId) => {
                const segment = AUDIENCE_SEGMENTS.find(s => s.id === segmentId);
                return segment ? (
                  <li key={segmentId} className="py-3 flex items-start">
                    <span className="text-2xl mr-3">{segment.icon}</span>
                    <div>
                      <h4 className="font-medium text-gray-800">{segment.name}</h4>
                      <p className="text-sm text-gray-600">{segment.demographics}</p>
                    </div>
                    <button
                      onClick={() => toggleSegment(segmentId)}
                      className="ml-auto text-gray-400 hover:text-red-500"
                    >
                      ×
                    </button>
                  </li>
                ) : null;
              })}
            </ul>
          </div>
        </div>
      )}
      
      {/* AI Audience Analysis */}
      {showAIAnalysis && selectedSegments.length > 0 && (
        <div className="mb-8 bg-indigo-50 p-6 rounded-lg border border-indigo-200">
          <h3 className="text-lg font-medium text-indigo-800 mb-4 flex items-center">
            <span className="mr-2">🧠</span>
            AI Audience Analysis
          </h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-indigo-700 mb-2">Cross-Segment Insights</h4>
              <p className="text-gray-700 mb-2">
                Based on your selected audience segments, here are key patterns and opportunities:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Your audiences primarily use <span className="font-medium">Instagram, LinkedIn, and Facebook</span>, making these platforms essential to your strategy.</li>
                <li>Common interests across segments include <span className="font-medium">technology, lifestyle content, and professional development</span>.</li>
                <li>Primary pain points to address include <span className="font-medium">time constraints, information overload, and balancing priorities</span>.</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-indigo-700 mb-2">Content Recommendations</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Create visual tutorials and guides that solve specific pain points</li>
                <li>Develop concise, actionable content that respects your audience's time constraints</li>
                <li>Focus on authentic storytelling that aligns with your brand personality</li>
                <li>Use a mix of educational and entertaining content to engage different segments</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-indigo-700 mb-2">Engagement Opportunities</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Morning (7-9am) and evening (7-10pm) appear to be optimal posting times</li>
                <li>Interactive content like polls and questions will resonate across segments</li>
                <li>Highlight customer stories and testimonials to build trust</li>
                <li>Create segment-specific campaigns for targeted reach</li>
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {/* Pro Tips */}
      <div className="bg-blue-50 p-5 rounded-lg border border-blue-100 mb-8">
        <h3 className="font-medium text-blue-800 mb-2 flex items-center">
          <span className="mr-2">💡</span>
          Pro Tips
        </h3>
        <ul className="space-y-1 text-blue-800">
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            Select 2-3 audience segments to keep your strategy focused and manageable.
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            Understanding audience pain points helps create content that solves real problems.
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            Different segments may require different content approaches and posting schedules.
          </li>
        </ul>
      </div>
      
      {/* Navigation buttons section */}
      <div className="mb-12 bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-100 shadow-md">
        <div className="text-center md:text-left mb-4">
          <h3 className="text-lg font-medium text-indigo-700 mb-2">Step 2: Audience Research</h3>
          <p className="text-gray-600">Select your target audience segments to continue</p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="w-full md:w-auto px-6 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center"
          >
            <span className="mr-2">←</span> Back to Brand Profile
          </button>
          
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
            <button
              onClick={handleGenerateAnalysis}
              className="w-full px-5 py-4 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-xl hover:from-purple-600 hover:to-purple-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center font-medium"
              disabled={selectedSegments.length === 0 || isGeneratingAnalysis}
              style={{
                animation: selectedSegments.length > 0 && !isGeneratingAnalysis ? 'pulse-shadow 2s infinite' : 'none',
              }}
            >
              {isGeneratingAnalysis ? (
                <>
                  <svg className="animate-spin mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                <><span className="mr-2">🔍</span> Get AI Audience Analysis</>
              )}
            </button>
            
            <button
              onClick={handleContinue}
              className="w-full px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center font-semibold text-lg"
              disabled={selectedSegments.length === 0}
              style={{
                animation: selectedSegments.length > 0 ? 'pulse-shadow 2s infinite' : 'none',
              }}
            >
              Continue <span className="ml-3 text-xl">→</span>
            </button>
          </div>
        </div>
        
        {/* Show message when buttons are disabled */}
        {selectedSegments.length === 0 && (
          <div className="mt-4 text-center text-orange-600 bg-orange-50 p-3 rounded-lg border border-orange-100">
            <span className="font-medium">Please select at least one audience segment to continue</span>
          </div>
        )}
      </div>
    </div>
  </div>
  );
};

export default AudienceResearch; 