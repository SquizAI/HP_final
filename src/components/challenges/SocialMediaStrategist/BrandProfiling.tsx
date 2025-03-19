import React, { useState, useEffect } from 'react';
import { SocialMediaStrategy } from './SocialMediaStrategistMain';

interface BrandProfilingProps {
  state: SocialMediaStrategy;
  updateState: (newState: Partial<SocialMediaStrategy>) => void;
  onNext: () => void;
}

// Brand personality types with descriptive traits
const BRAND_PERSONALITIES = [
  {
    id: 'authentic',
    name: 'Authentic & Transparent',
    icon: '🤝',
    description: 'Honest, genuine, and straightforward communication that builds trust',
    traits: ['Honest', 'Genuine', 'Transparent', 'Trustworthy', 'Direct']
  },
  {
    id: 'innovative',
    name: 'Innovative & Forward-Thinking',
    icon: '💡',
    description: 'Cutting-edge, creative, and focused on the future',
    traits: ['Creative', 'Cutting-edge', 'Visionary', 'Pioneering', 'Disruptive']
  },
  {
    id: 'playful',
    name: 'Playful & Humorous',
    icon: '😄',
    description: 'Fun, entertaining, and doesn\'t take itself too seriously',
    traits: ['Humorous', 'Fun', 'Light-hearted', 'Entertaining', 'Casual']
  },
  {
    id: 'prestigious',
    name: 'Prestigious & Luxurious',
    icon: '✨',
    description: 'Premium quality, exclusive, and high-end positioning',
    traits: ['Exclusive', 'High-quality', 'Sophisticated', 'Refined', 'Premium']
  },
  {
    id: 'empathetic',
    name: 'Empathetic & Caring',
    icon: '❤️',
    description: 'Focused on people and their needs, compassionate and supportive',
    traits: ['Caring', 'Supportive', 'Understanding', 'People-focused', 'Nurturing']
  },
  {
    id: 'knowledgeable',
    name: 'Knowledgeable & Authoritative',
    icon: '🧠',
    description: 'Expert, informative, and focused on providing valuable insights',
    traits: ['Expert', 'Informative', 'Authoritative', 'Educational', 'Professional']
  },
  {
    id: 'eco-conscious',
    name: 'Eco-conscious & Sustainable',
    icon: '🌿',
    description: 'Environmentally responsible and committed to sustainability',
    traits: ['Sustainable', 'Ethical', 'Eco-friendly', 'Responsible', 'Conscious']
  },
  {
    id: 'bold',
    name: 'Bold & Daring',
    icon: '🔥',
    description: 'Confident, challenging the status quo, and not afraid to stand out',
    traits: ['Confident', 'Daring', 'Provocative', 'Unapologetic', 'Striking']
  }
];

// Industry options with more comprehensive list
const INDUSTRY_OPTIONS = [
  { value: 'technology', label: 'Technology & Software' },
  { value: 'retail', label: 'Retail & E-commerce' },
  { value: 'healthcare', label: 'Healthcare & Wellness' },
  { value: 'financial', label: 'Financial Services & Fintech' },
  { value: 'education', label: 'Education & E-learning' },
  { value: 'food-beverage', label: 'Food & Beverage' },
  { value: 'travel', label: 'Travel & Hospitality' },
  { value: 'real-estate', label: 'Real Estate & Property' },
  { value: 'professional-services', label: 'Professional Services & Consulting' },
  { value: 'manufacturing', label: 'Manufacturing & Industrial' },
  { value: 'media-entertainment', label: 'Media & Entertainment' },
  { value: 'nonprofit', label: 'Nonprofit & NGO' },
  { value: 'beauty-fashion', label: 'Beauty & Fashion' },
  { value: 'home-decor', label: 'Home Decor & Furnishings' },
  { value: 'fitness', label: 'Fitness & Sports' },
  { value: 'arts-crafts', label: 'Arts & Crafts' },
  { value: 'automotive', label: 'Automotive & Transportation' },
  { value: 'energy', label: 'Energy & Utilities' },
  { value: 'agriculture', label: 'Agriculture & Farming' },
  { value: 'other', label: 'Other' }
];

// Social media goals with descriptions
const SOCIAL_MEDIA_GOALS = [
  {
    id: 'brand-awareness',
    name: 'Increase Brand Awareness',
    icon: '👁️',
    description: 'Get more people to recognize and remember your brand'
  },
  {
    id: 'engagement',
    name: 'Boost Engagement',
    icon: '💬',
    description: 'Increase interactions with your content (likes, comments, shares)'
  },
  {
    id: 'lead-generation',
    name: 'Generate Leads',
    icon: '🎯',
    description: 'Capture potential customer information for your sales funnel'
  },
  {
    id: 'community-building',
    name: 'Build Community',
    icon: '👥',
    description: 'Create a loyal following and strengthen customer relationships'
  },
  {
    id: 'customer-service',
    name: 'Provide Customer Support',
    icon: '🛠️',
    description: 'Assist customers and address their questions or concerns'
  },
  {
    id: 'sales',
    name: 'Drive Sales & Conversions',
    icon: '💰',
    description: 'Directly increase revenue through social media channels'
  },
  {
    id: 'website-traffic',
    name: 'Increase Website Traffic',
    icon: '🔄',
    description: 'Direct more visitors to your website or landing pages'
  },
  {
    id: 'thought-leadership',
    name: 'Establish Thought Leadership',
    icon: '🏆',
    description: 'Position your brand as an authority in your industry'
  },
  {
    id: 'product-launch',
    name: 'Support Product Launches',
    icon: '🚀',
    description: 'Create buzz and momentum around new offerings'
  },
  {
    id: 'recruiting',
    name: 'Talent Recruitment',
    icon: '👔',
    description: 'Attract potential employees and showcase company culture'
  }
];

// Brand description templates for inspiration
const BRAND_DESCRIPTION_TEMPLATES = [
  {
    title: "The Problem-Solver",
    template: "[Brand] helps [target audience] overcome [specific challenge] through [unique solution/approach]. Unlike competitors who [competitor limitation], we focus on [key differentiator] to deliver [main benefit]."
  },
  {
    title: "The Industry Innovator",
    template: "As pioneers in [industry], [Brand] is revolutionizing how [target audience] experience [product/service category]. Our [key innovation] approach combines [feature 1] and [feature 2] to create unparalleled [main benefit]."
  },
  {
    title: "The Value-Driven Brand",
    template: "At [Brand], we believe that [core value/belief]. This drives us to provide [target audience] with [product/service] that delivers [key benefit] while ensuring [secondary benefit]. Every decision we make upholds our commitment to [brand mission]."
  },
  {
    title: "The Heritage Story",
    template: "Since [founding year], [Brand] has been dedicated to [core purpose]. What began as [origin story] has evolved into [current offering], serving [target audience] who value [key brand attributes]. Throughout our journey, we've maintained our commitment to [enduring value proposition]."
  },
  {
    title: "The Lifestyle Enhancer",
    template: "[Brand] creates [products/services] for [target audience] who aspire to [lifestyle goal]. We understand that [customer pain point], which is why we've designed [offering] to provide [key benefit] without [common compromise]."
  }
];

const BrandProfiling: React.FC<BrandProfilingProps> = ({ state, updateState, onNext }) => {
  const [showAITips, setShowAITips] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  
  // Add keyframe animation to the stylesheet
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes pulse-shadow {
        0%, 100% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.4); }
        50% { box-shadow: 0 0 0 15px rgba(79, 70, 229, 0); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  // Toggle a goal selection
  const toggleGoal = (goalId: string) => {
    if (state.goals.includes(goalId)) {
      updateState({
        goals: state.goals.filter(id => id !== goalId)
      });
    } else {
      updateState({
        goals: [...state.goals, goalId]
      });
    }
  };
  
  // Toggle a personality trait selection
  const togglePersonalityTrait = (trait: string) => {
    if (state.brandPersonalityTraits.includes(trait)) {
      updateState({
        brandPersonalityTraits: state.brandPersonalityTraits.filter(t => t !== trait)
      });
    } else {
      updateState({
        brandPersonalityTraits: [...state.brandPersonalityTraits, trait]
      });
    }
  };
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateState({ [name]: value });
  };
  
  // Apply a template to the description field
  const applyTemplate = (template: string) => {
    setSelectedTemplate(template);
    
    // Only replace if the description is empty or if the user confirms
    if (!state.description || confirm('This will replace your current description. Continue?')) {
      updateState({ description: template });
    }
  };
  
  // Select a brand personality
  const selectPersonality = (personalityId: string) => {
    const personality = BRAND_PERSONALITIES.find(p => p.id === personalityId);
    if (personality) {
      updateState({
        brandPersonality: personality.name,
        // Optional: also select some traits
        brandPersonalityTraits: personality.traits.slice(0, 3)
      });
    }
  };
  
  // Continue to next step if required fields are filled
  const handleNext = () => {
    // Check required fields
    if (!state.brandName || !state.industry || !state.description || 
        !state.brandPersonality || state.goals.length === 0) {
      alert('Please complete all required fields before continuing.');
      return;
    }
    
    onNext();
  };
  
  // Toggle AI tips visibility
  const toggleAITips = () => {
    setShowAITips(!showAITips);
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-blue-800 mb-2">
              Define Your Brand Identity
            </h2>
            <p className="text-gray-700">
              Create a clear brand profile to guide your social media strategy and ensure consistent messaging.
            </p>
          </div>
          <button
            onClick={toggleAITips}
            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-sm hover:bg-blue-200 transition-colors flex items-center"
          >
            <span className="mr-1">🧠</span>
            {showAITips ? 'Hide AI Tips' : 'Show AI Tips'}
          </button>
        </div>
      </div>
      
      {/* AI Tips Panel */}
      {showAITips && (
        <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-lg mb-8">
          <h3 className="font-medium text-indigo-800 mb-3 flex items-center">
            <span className="mr-2">🧠</span>
            AI Brand Strategy Tips
          </h3>
          <div className="space-y-4 text-indigo-800">
            <div>
              <h4 className="font-medium">Consistency is Key</h4>
              <p className="text-sm">The most successful brands maintain consistent personality and messaging across all platforms. Your social media presence should feel like a natural extension of your overall brand.</p>
            </div>
            <div>
              <h4 className="font-medium">Focus Your Goals</h4>
              <p className="text-sm">While it's tempting to pursue multiple objectives, the most effective social strategies prioritize 2-3 core goals. This focus allows for clearer messaging and more accurate performance measurement.</p>
            </div>
            <div>
              <h4 className="font-medium">Know Your Differentiators</h4>
              <p className="text-sm">Your brand description should clearly articulate what makes you different from competitors. This unique selling proposition should inform the content you create and share.</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-6">Brand Basics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Brand Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="brandName"
              value={state.brandName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Acme Solutions"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Industry <span className="text-red-500">*</span>
            </label>
            <select
              name="industry"
              value={state.industry}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select your industry</option>
              {INDUSTRY_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Brand Description <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <div
                className="text-xs text-blue-600 flex items-center hover:text-blue-800 cursor-pointer relative"
              >
                <span className="mr-1">✨</span> Try a template
                <div className="absolute z-10 top-full right-0 mt-1 w-72 bg-white shadow-lg rounded-md border border-gray-200 p-3 hidden group-hover:block">
                  <h4 className="font-medium text-gray-700 mb-2 text-sm">Select a template</h4>
                  <div className="space-y-2">
                    {BRAND_DESCRIPTION_TEMPLATES.map(template => (
                      <button
                        key={template.title}
                        type="button"
                        className="block w-full text-left text-xs p-2 hover:bg-blue-50 rounded-md"
                        onClick={() => applyTemplate(template.template)}
                      >
                        <span className="font-medium">{template.title}:</span>
                        <br />
                        <span className="text-gray-600">{template.template.substring(0, 60)}...</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <textarea
            name="description"
            value={state.description}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-28"
            placeholder="Describe your brand, what you offer, your target audience, and what makes you unique..."
            required
          />
          
          {selectedTemplate && (
            <div className="mt-2 text-xs text-gray-500">
              <p>Template tip: Replace the [bracketed text] with your specific information.</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-6">Brand Personality</h3>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select a primary brand personality <span className="text-red-500">*</span>
          </label>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BRAND_PERSONALITIES.map(personality => (
              <div
                key={personality.id}
                className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                  state.brandPersonality === personality.name 
                    ? 'border-blue-500 bg-blue-50 shadow-lg transform -translate-y-1' 
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                }`}
                onClick={() => selectPersonality(personality.id)}
              >
                <div className="text-center mb-4">
                  <span className="text-5xl">{personality.icon}</span>
                </div>
                <h3 className="text-lg font-medium text-center text-gray-800 mb-2">{personality.name}</h3>
                <p className="text-sm text-gray-600 text-center">{personality.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select specific brand traits (choose 3-5)
          </label>
          
          <div className="flex flex-wrap gap-2">
            {BRAND_PERSONALITIES.flatMap(personality => 
              personality.traits.map(trait => (
                <button
                  key={trait}
                  type="button"
                  className={`px-3 py-1 rounded-full text-sm ${
                    state.brandPersonalityTraits.includes(trait)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => togglePersonalityTrait(trait)}
                >
                  {trait}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-6">Social Media Goals</h3>
        
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            What do you want to achieve? (Select 2-4 primary goals) <span className="text-red-500">*</span>
          </label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SOCIAL_MEDIA_GOALS.slice(0, 4).map(goal => (
              <div
                key={goal.id}
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  state.goals.includes(goal.id) 
                    ? 'border-green-500 bg-green-50 shadow-lg transform -translate-y-1' 
                    : 'border-gray-200 hover:border-green-300 hover:shadow-md'
                }`}
                onClick={() => toggleGoal(goal.id)}
              >
                <div className="flex items-start">
                  <span className="text-3xl mr-3">{goal.icon}</span>
                  <div>
                    <h3 className="text-md font-medium text-gray-800 mb-1">{goal.name}</h3>
                    <p className="text-sm text-gray-600">{goal.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mb-12">
        <div className="flex items-center mb-4">
          <div className="mr-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
          <h3 className="text-xl font-medium text-gray-800">Pro Tips</h3>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 shadow-md">
          <h3 className="font-medium text-blue-800 mb-4 flex items-center text-lg">
            <span className="mr-2">💡</span>
            Brand Strategy Tips
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start bg-white p-3 rounded-lg shadow-sm border border-blue-50">
              <span className="text-blue-500 mr-3 text-xl">•</span>
              <span>Your brand identity should be consistent across all platforms while adapting to each platform's unique format.</span>
            </li>
            <li className="flex items-start bg-white p-3 rounded-lg shadow-sm border border-blue-50">
              <span className="text-blue-500 mr-3 text-xl">•</span>
              <span>The most engaging brands have a distinctive voice that reflects their personality in every post.</span>
            </li>
            <li className="flex items-start bg-white p-3 rounded-lg shadow-sm border border-blue-50">
              <span className="text-blue-500 mr-3 text-xl">•</span>
              <span>Your social media goals should align with your overall business objectives.</span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Navigation button section */}
      <div className="mt-12 mb-12 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 shadow-md">
        <div className="flex flex-col md:flex-row items-center justify-between py-3">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <div className="text-lg font-medium text-indigo-700 mb-2">Step 1: Brand Profiling</div>
            <p className="text-gray-600">Complete your brand profile to continue</p>
          </div>
          <button
            onClick={handleNext}
            className="w-full md:w-auto px-8 py-5 md:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center text-lg font-semibold"
            disabled={!state.brandName || !state.industry || !state.description || !state.brandPersonality || state.goals.length === 0}
            style={{
              animation: 'pulse-shadow 2s infinite',
            }}
          >
            <span className="mr-2 text-xl hidden md:inline">✨</span> Continue to Audience Research <span className="ml-3 text-xl">→</span>
          </button>
        </div>
        {/* Show message when button is disabled */}
        {(!state.brandName || !state.industry || !state.description || !state.brandPersonality || state.goals.length === 0) && (
          <div className="mt-4 text-center text-orange-600 bg-orange-50 p-3 rounded-lg border border-orange-100">
            <span className="font-medium">Please complete all required fields marked with </span>
            <span className="text-red-500">*</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandProfiling; 