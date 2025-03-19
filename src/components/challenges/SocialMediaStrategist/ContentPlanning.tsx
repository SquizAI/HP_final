import React, { useState, useEffect } from 'react';
import { SocialMediaStrategy, ContentItem } from './SocialMediaStrategistMain';
import AIAssistButton from '../../common/AIAssistButton';

interface ContentPlanningProps {
  state: SocialMediaStrategy;
  updateState: (newState: Partial<SocialMediaStrategy>) => void;
  onNext: () => void;
  onBack: () => void;
}

// Platform data
const SOCIAL_PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: '📸' },
  { id: 'facebook', name: 'Facebook', icon: '👍' },
  { id: 'twitter', name: 'Twitter', icon: '🐦' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵' },
  { id: 'youtube', name: 'YouTube', icon: '🎬' },
  { id: 'pinterest', name: 'Pinterest', icon: '📌' },
  { id: 'reddit', name: 'Reddit', icon: '🤖' }
];

// Content types by platform
const CONTENT_TYPES = {
  instagram: [
    { type: 'Photo Post', icon: '📸' },
    { type: 'Carousel', icon: '🔄' },
    { type: 'Story', icon: '⭐' },
    { type: 'Reel', icon: '🎬' },
    { type: 'IGTV', icon: '📺' },
    { type: 'Guide', icon: '📋' }
  ],
  facebook: [
    { type: 'Text Post', icon: '📝' },
    { type: 'Photo Post', icon: '📸' },
    { type: 'Video Post', icon: '🎬' },
    { type: 'Link Share', icon: '🔗' },
    { type: 'Live Video', icon: '📹' },
    { type: 'Story', icon: '⭐' },
    { type: 'Event', icon: '📅' },
    { type: 'Poll', icon: '📊' }
  ],
  twitter: [
    { type: 'Tweet', icon: '📝' },
    { type: 'Thread', icon: '🧵' },
    { type: 'Poll', icon: '📊' },
    { type: 'Image Tweet', icon: '📸' },
    { type: 'Video Tweet', icon: '🎬' },
    { type: 'Quote Tweet', icon: '💬' }
  ],
  linkedin: [
    { type: 'Text Post', icon: '📝' },
    { type: 'Article', icon: '📰' },
    { type: 'Document', icon: '📄' },
    { type: 'Image Post', icon: '📸' },
    { type: 'Video Post', icon: '🎬' },
    { type: 'Poll', icon: '📊' },
    { type: 'Event', icon: '📅' }
  ],
  tiktok: [
    { type: 'Short Video', icon: '🎬' },
    { type: 'Duet', icon: '🎭' },
    { type: 'Stitch', icon: '🧵' },
    { type: 'Trending Challenge', icon: '🔥' },
    { type: 'Tutorial', icon: '📚' },
    { type: 'LIVE', icon: '📹' }
  ],
  youtube: [
    { type: 'Long-form Video', icon: '🎬' },
    { type: 'Short', icon: '📱' },
    { type: 'Live Stream', icon: '📹' },
    { type: 'Tutorial', icon: '📚' },
    { type: 'Product Review', icon: '⭐' },
    { type: 'Behind-the-Scenes', icon: '🎭' }
  ],
  pinterest: [
    { type: 'Pin', icon: '📌' },
    { type: 'Video Pin', icon: '🎬' },
    { type: 'Story Pin', icon: '📖' },
    { type: 'Product Pin', icon: '🛍️' },
    { type: 'Infographic', icon: '📊' }
  ],
  reddit: [
    { type: 'Text Post', icon: '📝' },
    { type: 'Link Post', icon: '🔗' },
    { type: 'Image Post', icon: '📸' },
    { type: 'Poll', icon: '📊' },
    { type: 'AMA', icon: '❓' }
  ]
};

// Default content types for custom platforms
const DEFAULT_CONTENT_TYPES = [
  { type: 'Text Post', icon: '📝' },
  { type: 'Image Post', icon: '📸' },
  { type: 'Video Post', icon: '🎬' }
];

// Content frequency suggestions
const FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Daily', description: 'Post every day', icon: '📆' },
  { value: '3-4-week', label: '3-4 times per week', description: 'Post regularly but not daily', icon: '🗓️' },
  { value: '1-2-week', label: '1-2 times per week', description: 'Post weekly', icon: '📅' },
  { value: 'bi-weekly', label: 'Bi-weekly', description: 'Post every other week', icon: '🔄' },
  { value: 'monthly', label: 'Monthly', description: 'Post once a month', icon: '📅' }
];

// Content theme ideas
const CONTENT_THEMES = [
  { theme: 'Educational', examples: ['How-to guides', 'Industry insights', 'Tips and tricks'] },
  { theme: 'Inspirational', examples: ['Success stories', 'Motivational quotes', 'Aspirational imagery'] },
  { theme: 'Entertainment', examples: ['Humor', 'Behind-the-scenes', 'Fun facts'] },
  { theme: 'Promotional', examples: ['Product features', 'Special offers', 'New releases'] },
  { theme: 'User-generated', examples: ['Customer testimonials', 'Reviews', 'User spotlights'] },
  { theme: 'Community-building', examples: ['Questions to followers', 'Polls', 'Contests'] },
  { theme: 'Storytelling', examples: ['Brand story', 'Employee spotlights', 'Case studies'] },
  { theme: 'Trending Topics', examples: ['Industry news', 'Current events', 'Holidays'] }
];

// Add AI generation options for content topics and descriptions
// Define content topic suggestions by platform
const AI_TOPIC_SUGGESTIONS = {
  instagram: [
    "Behind-the-scenes look at our creative process",
    "User-generated content spotlight",
    "Product showcase with styling tips",
    "Day-in-the-life of team members",
    "Customer success stories"
  ],
  facebook: [
    "Company culture and values",
    "Industry news and insights",
    "Customer testimonials",
    "Product tutorials and how-tos",
    "Community engagement questions"
  ],
  twitter: [
    "Industry hot takes and opinions",
    "Quick tips related to your products",
    "Company announcements and news",
    "Trending topic discussions",
    "Q&A sessions with experts"
  ],
  linkedin: [
    "Thought leadership articles",
    "Company milestones and growth",
    "Employee spotlights",
    "Industry research findings",
    "Professional development tips"
  ],
  tiktok: [
    "Trending challenge participation",
    "Quick product demos",
    "Educational content with a twist",
    "Behind-the-scenes fun",
    "Day-in-the-life content"
  ],
  youtube: [
    "In-depth product tutorials",
    "Industry expert interviews",
    "Customer success story documentaries",
    "Product review and comparison videos",
    "Educational series on industry topics"
  ],
  pinterest: [
    "Visual guides and infographics",
    "Inspirational product styling",
    "Step-by-step tutorials",
    "Seasonal inspiration boards",
    "Product collection showcases"
  ],
  reddit: [
    "Ask Me Anything (AMA) sessions",
    "In-depth product explanations",
    "Industry insights and analysis",
    "Community discussion starters",
    "Educational content on complex topics"
  ]
};

// Define description templates
const DESCRIPTION_TEMPLATES = [
  {
    title: "Educational Content",
    template: "Create a {contentType} that teaches our audience about {topic}. We'll focus on sharing {number} key insights that our {audienceType} audience can immediately apply to improve their {benefitArea}. Include real-world examples and actionable tips."
  },
  {
    title: "Product Showcase",
    template: "Develop a {contentType} highlighting our {productName} with emphasis on how it solves {painPoint}. We'll demonstrate {number} key features and include customer testimonials about their experience. End with a clear call-to-action to {desiredAction}."
  },
  {
    title: "Brand Story",
    template: "Share a compelling {contentType} about our brand's {storyElement} - from our founding story to our vision for the future. We'll highlight our core values, especially {coreValue}, and connect emotionally with viewers through authentic storytelling."
  },
  {
    title: "User-Generated Content",
    template: "Curate {contentType} featuring our customers using our {productName} in real-life situations. We'll highlight {number} creative ways our community has incorporated our products into their lives, and encourage others to share their experiences with our branded hashtag."
  },
  {
    title: "Trending Topic",
    template: "Create timely {contentType} about {trendingTopic} that's relevant to our industry. We'll offer our unique perspective while providing valuable insights about how this trend impacts our {audienceType} audience. Include actionable takeaways they can implement."
  }
];

const ContentPlanning: React.FC<ContentPlanningProps> = ({ state, updateState, onNext, onBack }) => {
  const [contentItems, setContentItems] = useState<ContentItem[]>(state.contentCalendar || []);
  const [isEditingItem, setIsEditingItem] = useState<boolean>(false);
  const [currentItemIndex, setCurrentItemIndex] = useState<number>(-1);
  const [showAIRecommendations, setShowAIRecommendations] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<ContentItem>({
    platform: '',
    contentType: '',
    topic: '',
    timing: '',
    description: ''
  });
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [showTopicGenerator, setShowTopicGenerator] = useState(true);
  const [showDescriptionGenerator, setShowDescriptionGenerator] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [templateFields, setTemplateFields] = useState<{[key: string]: string}>({});
  
  // Effect to check if we have content items for each selected platform
  useEffect(() => {
    if (state.selectedPlatforms && state.selectedPlatforms.length > 0 && !selectedPlatform) {
      setSelectedPlatform(state.selectedPlatforms[0]);
    }
  }, [state.selectedPlatforms, selectedPlatform]);
  
  // Get content types for a specific platform
  const getContentTypesForPlatform = (platformId: string) => {
    if (platformId.startsWith('custom-')) {
      return DEFAULT_CONTENT_TYPES;
    }
    
    // @ts-ignore - We know the key might not exist
    return CONTENT_TYPES[platformId] || DEFAULT_CONTENT_TYPES;
  };
  
  // Get platform name from ID
  const getPlatformName = (platformId: string) => {
    if (platformId.startsWith('custom-')) {
      return platformId.replace('custom-', '').replace(/-/g, ' ');
    }
    
    const platformNames: {[key: string]: string} = {
      instagram: 'Instagram',
      facebook: 'Facebook',
      twitter: 'Twitter',
      linkedin: 'LinkedIn',
      tiktok: 'TikTok',
      youtube: 'YouTube',
      pinterest: 'Pinterest',
      reddit: 'Reddit'
    };
    
    return platformNames[platformId] || platformId;
  };
  
  // Function to get platform icon
  const getPlatformIcon = (platformId: string): string => {
    const platform = SOCIAL_PLATFORMS.find(p => p.id === platformId);
    return platform ? platform.icon : '📱';
  };
  
  // Start creating/editing a content item
  const handleAddItem = (platformId: string = selectedPlatform) => {
    setEditForm({
      platform: platformId,
      contentType: '',
      topic: '',
      timing: '',
      description: ''
    });
    setIsEditingItem(true);
    setCurrentItemIndex(-1);
  };
  
  // Edit an existing content item
  const handleEditItem = (index: number) => {
    setEditForm(contentItems[index]);
    setIsEditingItem(true);
    setCurrentItemIndex(index);
  };
  
  // Delete a content item
  const handleDeleteItem = (index: number) => {
    const newItems = [...contentItems];
    newItems.splice(index, 1);
    setContentItems(newItems);
  };
  
  // Handle changes to form fields
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };
  
  // Save the current content item
  const handleSaveItem = () => {
    if (currentItemIndex >= 0) {
      // Update existing item
      const newItems = [...contentItems];
      newItems[currentItemIndex] = editForm;
      setContentItems(newItems);
    } else {
      // Add new item
      setContentItems([...contentItems, editForm]);
    }
    
    setIsEditingItem(false);
    setEditForm({
      platform: '',
      contentType: '',
      topic: '',
      timing: '',
      description: ''
    });
    setCurrentItemIndex(-1);
  };
  
  // Generate AI content recommendations
  const generateRecommendations = () => {
    setIsGenerating(true);
    
    // Simulate API delay
    setTimeout(() => {
      setShowAIRecommendations(true);
      setIsGenerating(false);
    }, 2000);
  };
  
  // Add a recommended content item to the plan
  const addRecommendation = (recommendation: any) => {
    const newItem: ContentItem = {
      platform: recommendation.platform,
      contentType: recommendation.contentType,
      topic: recommendation.topic,
      timing: recommendation.timing,
      description: recommendation.description
    };
    
    setContentItems([...contentItems, newItem]);
  };
  
  // Complete content planning and move to the next step
  const handleComplete = () => {
    updateState({
      contentCalendar: contentItems,
      isComplete: true
    });
    
    onNext();
  };
  
  // Check if we have at least one content item for each selected platform
  const hasContentForAllPlatforms = () => {
    if (!state.selectedPlatforms || state.selectedPlatforms.length === 0) {
      return false;
    }
    
    return state.selectedPlatforms.every(platformId => 
      contentItems.some(item => item.platform === platformId)
    );
  };
  
  // Gets items for the currently selected platform
  const getPlatformItems = () => {
    return contentItems.filter(item => item.platform === selectedPlatform);
  };
  
  // Generate AI topic suggestion based on selected platform
  const generateTopicSuggestion = () => {
    const platform = editForm.platform;
    let suggestions = AI_TOPIC_SUGGESTIONS.instagram; // Default
    
    if (platform in AI_TOPIC_SUGGESTIONS) {
      suggestions = AI_TOPIC_SUGGESTIONS[platform as keyof typeof AI_TOPIC_SUGGESTIONS];
    }
    
    const randomIndex = Math.floor(Math.random() * suggestions.length);
    return suggestions[randomIndex];
  };
  
  // Apply selected topic to form
  const applyTopicSuggestion = () => {
    const suggestion = generateTopicSuggestion();
    setEditForm({...editForm, topic: suggestion});
    setShowTopicGenerator(false);
  };
  
  // Parse template and extract field placeholders
  const parseTemplate = (template: string): string[] => {
    const regex = /{([^}]+)}/g;
    const matches = template.match(regex);
    
    if (!matches) return [];
    
    return matches.map(match => match.slice(1, -1));
  };
  
  // Select a description template
  const selectDescriptionTemplate = (template: string) => {
    setSelectedTemplate(template);
    
    // Extract fields from template
    const fields = parseTemplate(template);
    const initialFields: {[key: string]: string} = {};
    
    fields.forEach(field => {
      initialFields[field] = '';
    });
    
    setTemplateFields(initialFields);
  };
  
  // Generate description from template
  const generateDescriptionFromTemplate = () => {
    let description = selectedTemplate;
    
    Object.entries(templateFields).forEach(([field, value]) => {
      description = description.replace(`{${field}}`, value);
    });
    
    setEditForm({...editForm, description});
    setShowDescriptionGenerator(false);
    setSelectedTemplate('');
    setTemplateFields({});
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-lg shadow-lg text-white mb-8">
        <h2 className="text-2xl font-bold mb-2 flex items-center">
          <span className="mr-3 text-yellow-300">📅</span>
          Content Planning
        </h2>
        <p className="opacity-90">
          Develop a strategic content plan for each platform to engage your audience and achieve your goals.
        </p>
      </div>
      
      {/* Platforms selection with enhanced styling */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 bg-gray-50 p-3 rounded-lg border-l-4 border-purple-500 text-gray-800 flex items-center">
          <span className="mr-2 text-purple-500">📱</span>
          Select Platform to Plan Content
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
          {state.selectedPlatforms.map(platform => {
            const isSelected = platform === selectedPlatform;
            const platformName = getPlatformName(platform);
            
            // Count content items for this platform
            const itemCount = state.contentCalendar.filter(item => item.platform === platform).length;
            
            // Check if platform has content
            const hasContent = itemCount > 0;
            
            return (
              <div
                key={platform}
                onClick={() => setSelectedPlatform(platform)}
                className={`
                  relative rounded-lg p-4 cursor-pointer transition-all duration-200 transform border-2
                  ${isSelected 
                    ? 'border-purple-500 bg-purple-50 shadow-md scale-105' 
                    : 'border-gray-200 hover:border-purple-300 hover:shadow'
                  }
                `}
              >
                <div className="flex flex-col items-center text-center">
                  <span className="text-3xl mb-2">{getPlatformIcon(platform)}</span>
                  <span className="font-medium text-gray-800">{platformName}</span>
                  
                  {hasContent && (
                    <span className="mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {itemCount} items
                    </span>
                  )}
                  
                  {!hasContent && (
                    <span className="mt-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                      Needs content
                    </span>
                  )}
                </div>
                
                {isSelected && (
                  <div className="absolute -right-1 -top-1 bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Content Action Buttons with more pronounced styling */}
      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={() => handleAddItem()}
          className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:translate-y-[-2px] font-medium flex items-center justify-center"
        >
          <span className="mr-2">➕</span>
          Add Content Item
        </button>
        
        <button
          onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}
          className="px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center font-medium"
        >
          <span className="mr-2">{viewMode === 'list' ? '📅' : '📋'}</span>
          {viewMode === 'list' ? 'Calendar View' : 'List View'}
        </button>
        
        <div className="flex-1 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3 flex justify-between items-center border border-indigo-100">
          <span className="text-gray-700">
            <span className="font-medium">{state.contentCalendar.length}</span> content items planned
          </span>
          <button
            onClick={generateRecommendations}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center shadow-sm"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <span className="mr-2 text-yellow-300">✨</span>
                AI Recommendations
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Enhanced Content Creation/Editing Form */}
      {isEditingItem && (
        <div className="bg-white p-6 rounded-lg border-2 border-purple-200 shadow-lg mb-6">
          <h3 className="font-bold text-purple-800 mb-4 text-xl flex items-center">
            <span className="mr-2 text-purple-500">✏️</span>
            {currentItemIndex >= 0 ? 'Edit Content Item' : 'Create New Content Item'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Type <span className="text-red-500">*</span>
              </label>
              <select
                name="contentType"
                value={editForm.contentType}
                onChange={handleFormChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 shadow-sm"
                required
              >
                <option value="">Select a content type...</option>
                {getContentTypesForPlatform(editForm.platform).map((type) => (
                  <option key={type.type} value={type.type}>
                    {type.icon} {type.type}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Posting Frequency <span className="text-red-500">*</span>
              </label>
              <select
                name="timing"
                value={editForm.timing}
                onChange={handleFormChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 shadow-sm"
                required
              >
                <option value="">Select frequency...</option>
                {FREQUENCY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label} - {option.description}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content Topic/Theme <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="topic"
                value={editForm.topic}
                onChange={handleFormChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 shadow-sm"
                placeholder="e.g., Product showcases, Industry tips, Behind-the-scenes"
                required
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <AIAssistButton
                  onClick={() => setShowTopicGenerator(!showTopicGenerator)}
                  tooltip="Get AI topic suggestions"
                  buttonStyle="minimal"
                />
              </div>
            </div>
            
            {/* AI Topic Generator - Expanded by default */}
            {showTopicGenerator && (
              <div className="mt-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-indigo-800">AI Topic Generator</h4>
                  <button 
                    type="button" 
                    onClick={() => setShowTopicGenerator(false)}
                    className="text-indigo-500 hover:text-indigo-700 p-1 hover:bg-indigo-100 rounded-full"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <p className="text-indigo-700 mb-3">
                  Generate topic ideas optimized for {getPlatformName(editForm.platform)} based on your brand profile.
                </p>
                <div className="flex justify-between">
                  <AIAssistButton
                    onClick={applyTopicSuggestion}
                    label="Generate Topic"
                    buttonStyle="prominent"
                  />
                </div>
              </div>
            )}
            
            <div className="mt-2">
              <p className="text-xs text-gray-500 mb-1">Suggested themes:</p>
              <div className="flex flex-wrap gap-2">
                {CONTENT_THEMES.slice(0, 6).map((theme) => (
                  <button
                    key={theme.theme}
                    type="button"
                    className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full hover:bg-purple-200 transition-colors"
                    onClick={() => setEditForm({...editForm, topic: theme.theme})}
                  >
                    {theme.theme}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <textarea
                name="description"
                value={editForm.description}
                onChange={handleFormChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 h-32 shadow-sm"
                placeholder="Describe the content you'll create and how it aligns with your goals..."
                required
              />
              <div className="absolute right-2 top-2">
                <AIAssistButton
                  onClick={() => setShowDescriptionGenerator(!showDescriptionGenerator)}
                  tooltip="Get AI description help"
                  buttonStyle="minimal"
                />
              </div>
            </div>
            
            {/* AI Description Generator - Expanded by default */}
            {showDescriptionGenerator && (
              <div className="mt-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-indigo-800">AI Description Generator</h4>
                  <button 
                    type="button" 
                    onClick={() => setShowDescriptionGenerator(false)}
                    className="text-indigo-500 hover:text-indigo-700 p-1 hover:bg-indigo-100 rounded-full"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                {!selectedTemplate ? (
                  <>
                    <p className="text-indigo-700 mb-3">
                      Choose a template to create a structured content description:
                    </p>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {DESCRIPTION_TEMPLATES.map((template, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => selectDescriptionTemplate(template.template)}
                          className="w-full text-left p-3 text-sm bg-white border border-indigo-100 rounded-lg hover:bg-indigo-50 transition-colors"
                        >
                          <span className="font-medium">{template.title}:</span> {template.template}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-indigo-700 mb-3">
                      Fill in the details to customize your description:
                    </p>
                    <div className="space-y-3 mb-3">
                      {Object.keys(templateFields).map((field) => (
                        <div key={field} className="flex flex-col">
                          <label className="text-sm text-indigo-800 font-medium">{field}:</label>
                          <input
                            type="text"
                            value={templateFields[field]}
                            onChange={(e) => setTemplateFields({...templateFields, [field]: e.target.value})}
                            className="mt-1 p-2 border border-indigo-200 rounded-lg shadow-sm"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTemplate('');
                          setTemplateFields({});
                        }}
                        className="px-3 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                      >
                        Back to Templates
                      </button>
                      <AIAssistButton
                        onClick={generateDescriptionFromTemplate}
                        label="Generate Description"
                        buttonStyle="prominent"
                        className="text-sm"
                        disabled={Object.values(templateFields).some(v => !v)}
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsEditingItem(false)}
              className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveItem}
              className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 shadow-sm hover:shadow-md transition-all font-medium"
              disabled={!editForm.contentType || !editForm.topic || !editForm.timing || !editForm.description}
            >
              {currentItemIndex >= 0 ? 'Update Item' : 'Add to Plan'}
            </button>
          </div>
        </div>
      )}
      
      {/* Platform-specific Content Planning */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-800">
            {getPlatformName(selectedPlatform)} Content Plan
          </h3>
          <div className="flex space-x-3">
            <button
              onClick={() => handleAddItem()}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              + Add Content
            </button>
            <button
              onClick={generateRecommendations}
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors flex items-center"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>AI Recommendations</>
              )}
            </button>
          </div>
        </div>
        
        {/* List View of Content Items */}
        {viewMode === 'list' && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {getPlatformItems().length > 0 ? (
              <div className="divide-y divide-gray-100">
                {getPlatformItems().map((item, index) => (
                  <div key={index} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        {getContentTypesForPlatform(item.platform).find(t => t.type === item.contentType)?.icon || '📄'}
                        <h4 className="font-medium text-gray-800 ml-2">{item.contentType}</h4>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditItem(contentItems.findIndex(i => i === item))}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteItem(contentItems.findIndex(i => i === item))}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 mb-1">Topic/Theme:</p>
                        <p className="text-gray-800">{item.topic}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Posting Schedule:</p>
                        <p className="text-gray-800">
                          {FREQUENCY_OPTIONS.find(f => f.value === item.timing)?.label || item.timing}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-sm">
                      <p className="text-gray-500 mb-1">Description:</p>
                      <p className="text-gray-800">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500 mb-4">No content items added yet for {getPlatformName(selectedPlatform)}</p>
                <button
                  onClick={() => handleAddItem()}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Add Your First Content Item
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="grid grid-cols-7 gap-2 mb-3">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} className="text-center font-medium text-gray-700 p-2 bg-gray-50 rounded">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-2 h-64">
              {Array.from({ length: 28 }).map((_, i) => {
                // For demo purposes, just populate a few days
                const hasContent = i === 1 || i === 8 || i === 15 || i === 22;
                
                return (
                  <div 
                    key={i}
                    className={`border rounded-md p-1 min-h-16 ${
                      hasContent ? 'border-purple-200 bg-purple-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="text-xs text-gray-500 text-right mb-1">{i + 1}</div>
                    
                    {hasContent && (
                      <div className="text-xs p-1 bg-purple-100 rounded text-purple-800 mb-1">
                        {i === 1 && 'Photo Post'}
                        {i === 8 && 'Story'}
                        {i === 15 && 'Carousel'}
                        {i === 22 && 'Video Post'}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <p className="text-center text-xs text-gray-500 mt-3">
              This is a simplified calendar view for planning purposes.
              For full calendar scheduling, consider using a dedicated content calendar tool.
            </p>
          </div>
        )}
      </div>
      
      {/* AI Recommendations */}
      {showAIRecommendations && (
        <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200 mb-8">
          <h3 className="text-lg font-medium text-indigo-800 mb-4 flex items-center">
            <span className="mr-2">🧠</span>
            AI Content Recommendations
          </h3>
          
          <p className="text-gray-700 mb-4">
            Based on your brand personality ({state.brandPersonality}) and target audience,
            here are some content ideas for {getPlatformName(selectedPlatform)}:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {[
              {
                contentType: getContentTypesForPlatform(selectedPlatform)[0]?.type || 'Post',
                topic: 'Behind-the-Scenes',
                timing: '1-2-week',
                description: 'Show your audience how your products are made or services are delivered. This adds authenticity and builds trust with your audience.',
                platform: selectedPlatform
              },
              {
                contentType: getContentTypesForPlatform(selectedPlatform)[1]?.type || 'Post',
                topic: 'User-Generated Content',
                timing: '1-2-week',
                description: 'Feature content created by your customers or community. This increases engagement and provides social proof for your brand.',
                platform: selectedPlatform
              },
              {
                contentType: getContentTypesForPlatform(selectedPlatform)[2]?.type || 'Post',
                topic: 'Industry Tips',
                timing: '1-2-week',
                description: 'Share valuable tips related to your industry. This positions your brand as a thought leader and provides value to your audience.',
                platform: selectedPlatform
              },
              {
                contentType: getContentTypesForPlatform(selectedPlatform)[0]?.type || 'Post',
                topic: 'Success Stories',
                timing: 'bi-weekly',
                description: 'Highlight success stories from customers who have benefited from your products or services. This demonstrates value and builds credibility.',
                platform: selectedPlatform
              }
            ].map((recommendation, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-indigo-100">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-indigo-800">{recommendation.topic}</h4>
                  <button
                    onClick={() => addRecommendation(recommendation)}
                    className="text-sm px-3 py-1 bg-indigo-100 text-indigo-800 rounded hover:bg-indigo-200"
                  >
                    Add to Plan
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Content Type:</span> {recommendation.contentType}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Frequency:</span> {FREQUENCY_OPTIONS.find(f => f.value === recommendation.timing)?.label}
                </p>
                <p className="text-sm text-gray-600">
                  {recommendation.description}
                </p>
              </div>
            ))}
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-indigo-100">
            <h4 className="font-medium text-indigo-800 mb-2">Content Mix Recommendation</h4>
            <p className="text-sm text-gray-700 mb-3">
              For optimal engagement on {getPlatformName(selectedPlatform)}, we recommend this content mix:
            </p>
            
            <div className="flex flex-wrap gap-2">
              <div className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full flex items-center">
                <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                40% Educational
              </div>
              <div className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full flex items-center">
                <span className="w-4 h-4 bg-blue-500 rounded-full mr-2"></span>
                30% Entertaining
              </div>
              <div className="px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-full flex items-center">
                <span className="w-4 h-4 bg-purple-500 rounded-full mr-2"></span>
                20% Inspirational
              </div>
              <div className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-full flex items-center">
                <span className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></span>
                10% Promotional
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Content Strategy Tips */}
      <div className="bg-purple-50 p-5 rounded-lg border border-purple-100 mb-8">
        <h3 className="font-medium text-purple-800 mb-2 flex items-center">
          <span className="mr-2">💡</span>
          Content Strategy Tips
        </h3>
        <ul className="space-y-1 text-purple-800">
          <li className="flex items-start">
            <span className="text-purple-500 mr-2">•</span>
            Follow the 80/20 rule: 80% value-adding content, 20% promotional content.
          </li>
          <li className="flex items-start">
            <span className="text-purple-500 mr-2">•</span>
            Repurpose content across platforms to maximize efficiency.
          </li>
          <li className="flex items-start">
            <span className="text-purple-500 mr-2">•</span>
            Be consistent with your posting schedule to build audience expectations.
          </li>
          <li className="flex items-start">
            <span className="text-purple-500 mr-2">•</span>
            Track engagement to understand what content resonates with your audience.
          </li>
        </ul>
      </div>
      
      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleComplete}
          className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          disabled={!hasContentForAllPlatforms()}
        >
          Complete Strategy
        </button>
      </div>
    </div>
  );
};

export default ContentPlanning; 