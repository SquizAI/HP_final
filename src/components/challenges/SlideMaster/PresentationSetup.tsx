import React, { useState } from 'react';
import { SlideMasterState, SlideTemplate } from './SlidesMasterMain';
import AIAssistButton from '../../../components/common/AIAssistButton';

interface PresentationSetupProps {
  state: SlideMasterState;
  updateState: (newState: Partial<SlideMasterState>) => void;
  onNext: () => void;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
  error: string | null;
}

// Presentation purposes
const PRESENTATION_PURPOSES = [
  {
    id: 'inform',
    title: 'Inform/Educate',
    description: 'Share knowledge, educate audience on a topic',
    icon: '📚',
    examples: ['Workshop presentation', 'Educational seminar', 'Training materials']
  },
  {
    id: 'persuade',
    title: 'Persuade/Sell',
    description: 'Convince audience to take action or change opinion',
    icon: '🎯',
    examples: ['Sales pitch', 'Investor presentation', 'Proposal defense']
  },
  {
    id: 'inspire',
    title: 'Inspire/Motivate',
    description: 'Energize and inspire audience to feel or act',
    icon: '✨',
    examples: ['Keynote speech', 'Team motivation talk', 'Vision presentation']
  },
  {
    id: 'analyze',
    title: 'Analyze/Report',
    description: 'Present data, findings, or analysis',
    icon: '📊',
    examples: ['Data analysis', 'Research findings', 'Quarterly business review']
  },
  {
    id: 'entertain',
    title: 'Entertain/Engage',
    description: 'Engage audience with interesting content',
    icon: '🎭',
    examples: ['Creative presentation', 'Event introduction', 'Storytelling session']
  }
];

// Audience types
const AUDIENCE_TYPES = [
  {
    id: 'executive',
    title: 'Executive/Leadership',
    description: 'Senior decision makers who need high-level information',
    preferences: 'Clear, concise content with focus on big picture and business impact'
  },
  {
    id: 'technical',
    title: 'Technical Professionals',
    description: 'Specialists with deep domain knowledge',
    preferences: 'Detailed, data-driven content with technical specifics and evidence'
  },
  {
    id: 'general',
    title: 'General Business',
    description: 'Mixed business audience with varying knowledge levels',
    preferences: 'Balanced content with clear explanations and relevant business context'
  },
  {
    id: 'client',
    title: 'Clients/Customers',
    description: 'External stakeholders interested in your offerings',
    preferences: 'Benefits-focused content with clear value propositions and examples'
  },
  {
    id: 'academic',
    title: 'Academic/Research',
    description: 'Scholarly audience looking for rigorous information',
    preferences: 'Research-based content with methodologies, findings and citations'
  },
  {
    id: 'public',
    title: 'General Public',
    description: 'Broad audience with diverse backgrounds',
    preferences: 'Accessible content with plain language and relatable examples'
  }
];

const PresentationSetup: React.FC<PresentationSetupProps> = ({
  state,
  updateState,
  onNext,
  isGenerating,
  setIsGenerating,
  error
}) => {
  const [showPurposeInfo, setShowPurposeInfo] = useState(false);
  const [showAudienceInfo, setShowAudienceInfo] = useState(false);
  const [showTemplateInfo, setShowTemplateInfo] = useState(false);
  const [showAITitleGenerator, setShowAITitleGenerator] = useState(false);
  const [showAIPurposeGenerator, setShowAIPurposeGenerator] = useState(false);
  const [showAIAudienceGenerator, setShowAIAudienceGenerator] = useState(false);
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateState({ [name]: value });
  };
  
  // Handle presentation template selection
  const handleTemplateSelect = (templateId: string) => {
    updateState({ selectedTemplate: templateId });
  };
  
  // Generate presentation title using AI
  const generatePresentationTitle = async () => {
    if (!state.purpose || !state.targetAudience) {
      alert('Please fill in the presentation purpose and target audience first to generate a title.');
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate AI generation (In a real app, this would call an API)
    setTimeout(() => {
      const generatedTitles = [
        `The Future of ${state.purpose}: A Strategic Roadmap`,
        `Transforming ${state.purpose}: Insights and Opportunities`,
        `Unlocking Potential: ${state.purpose} Redefined`,
        `${state.purpose} Excellence: Strategies for Success`,
        `Revolutionizing ${state.purpose}: The Next Generation Approach`
      ];
      
      const randomTitle = generatedTitles[Math.floor(Math.random() * generatedTitles.length)];
      updateState({ title: randomTitle });
      setIsGenerating(false);
      setShowAITitleGenerator(false);
    }, 1500);
  };
  
  // Generate presentation purpose using AI
  const generatePresentationPurpose = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation (In a real app, this would call an API)
    setTimeout(() => {
      const generatedPurposes = [
        "To provide actionable insights on market trends and competitive positioning, enabling stakeholders to make informed strategic decisions.",
        "To showcase our innovative solution and demonstrate how it addresses critical pain points in a way that creates measurable value for our audience.",
        "To educate our audience about emerging technologies and methodologies, providing a clear framework for implementation and best practices.",
        "To analyze recent performance data and extract meaningful patterns that can guide future initiatives and resource allocation.",
        "To inspire change by highlighting opportunities for growth and presenting a compelling vision for the future."
      ];
      
      const randomPurpose = generatedPurposes[Math.floor(Math.random() * generatedPurposes.length)];
      updateState({ purpose: randomPurpose });
      setIsGenerating(false);
      setShowAIPurposeGenerator(false);
    }, 1500);
  };
  
  // Generate audience description using AI
  const generateAudienceDescription = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation (In a real app, this would call an API)
    setTimeout(() => {
      const generatedDescriptions = [
        "Senior executives and decision-makers who are focused on strategic outcomes and business impact. They value concise information and clear recommendations.",
        "Technical professionals with deep domain expertise who appreciate detailed analysis and evidence-based recommendations supported by data.",
        "Cross-functional team members with varying levels of technical knowledge who need both strategic context and practical implementation guidance.",
        "External stakeholders including clients and partners who are interested in understanding how your offerings can address their specific needs and challenges.",
        "Industry specialists seeking in-depth understanding of emerging trends and methodologies with real-world applications and case studies."
      ];
      
      const randomDescription = generatedDescriptions[Math.floor(Math.random() * generatedDescriptions.length)];
      updateState({ targetAudience: randomDescription });
      setIsGenerating(false);
      setShowAIAudienceGenerator(false);
    }, 1500);
  };
  
  // Check if required fields are filled
  const canProceed = state.title && state.purpose && state.targetAudience && state.selectedTemplate;
  
  return (
    <div className="p-6">
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Presentation Basics</h3>
        <p className="text-gray-600 mb-6">
          Define the core elements of your presentation to help AI generate the most relevant content.
        </p>
        
        <div className="space-y-6">
          {/* Presentation Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Presentation Title <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="title"
                value={state.title}
                onChange={handleInputChange}
                placeholder="Enter a compelling title for your presentation"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <AIAssistButton
                  onClick={() => setShowAITitleGenerator(!showAITitleGenerator)}
                  tooltip="Generate title with AI"
                  buttonStyle="minimal"
                />
              </div>
            </div>
            
            {/* AI Title Generator */}
            {showAITitleGenerator && (
              <div className="mt-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-blue-800">AI Title Generator</h4>
                  <button 
                    onClick={() => setShowAITitleGenerator(false)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                <p className="text-sm text-blue-700 mb-3">
                  Generate an impactful title based on your presentation purpose and audience.
                </p>
                
                <AIAssistButton
                  onClick={generatePresentationTitle}
                  label={isGenerating ? "Generating..." : "Generate Title"}
                  buttonStyle="prominent"
                  disabled={isGenerating || !state.purpose || !state.targetAudience}
                />
                
                {(!state.purpose || !state.targetAudience) && (
                  <p className="text-xs text-orange-600 mt-2">
                    Fill in purpose and target audience first to generate relevant titles.
                  </p>
                )}
              </div>
            )}
          </div>
          
          {/* Presentation Purpose */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Presentation Purpose <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowPurposeInfo(!showPurposeInfo)}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                {showPurposeInfo ? 'Hide Info' : 'Show Info'}
              </button>
            </div>
            
            {showPurposeInfo && (
              <div className="mb-3 p-3 bg-blue-50 rounded-md text-sm">
                <p className="text-blue-800 mb-2">
                  Your presentation's purpose defines its core objective and helps AI generate relevant content.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {PRESENTATION_PURPOSES.map(purpose => (
                    <div key={purpose.id} className="flex items-start">
                      <span className="mr-2">{purpose.icon}</span>
                      <div>
                        <p className="font-medium text-blue-900">{purpose.title}</p>
                        <p className="text-xs text-blue-700">{purpose.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="relative">
              <textarea
                name="purpose"
                value={state.purpose}
                onChange={handleInputChange}
                placeholder="Describe the main purpose and goals of your presentation"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute right-2 top-6">
                <AIAssistButton
                  onClick={() => setShowAIPurposeGenerator(!showAIPurposeGenerator)}
                  tooltip="Generate purpose with AI"
                  buttonStyle="minimal"
                />
              </div>
            </div>
            
            {/* AI Purpose Generator */}
            {showAIPurposeGenerator && (
              <div className="mt-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-blue-800">AI Purpose Generator</h4>
                  <button 
                    onClick={() => setShowAIPurposeGenerator(false)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                <p className="text-sm text-blue-700 mb-3">
                  Generate a clear purpose statement to guide your presentation.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                  {PRESENTATION_PURPOSES.map(purpose => (
                    <button
                      key={purpose.id}
                      onClick={() => {
                        updateState({ presentationStyle: purpose.id });
                        generatePresentationPurpose();
                      }}
                      className={`p-2 rounded-md text-left hover:bg-blue-100 transition ${
                        state.presentationStyle === purpose.id ? 'bg-blue-100 border border-blue-300' : 'bg-white border border-gray-200'
                      }`}
                      disabled={isGenerating}
                    >
                      <div className="flex items-center">
                        <span className="text-xl mr-2">{purpose.icon}</span>
                        <span className="font-medium">{purpose.title}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{purpose.description}</p>
                    </button>
                  ))}
                </div>
                
                <AIAssistButton
                  onClick={generatePresentationPurpose}
                  label={isGenerating ? "Generating..." : "Generate Custom Purpose"}
                  buttonStyle="standard"
                  disabled={isGenerating}
                />
              </div>
            )}
          </div>
          
          {/* Target Audience */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Target Audience <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowAudienceInfo(!showAudienceInfo)}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                {showAudienceInfo ? 'Hide Info' : 'Show Info'}
              </button>
            </div>
            
            {showAudienceInfo && (
              <div className="mb-3 p-3 bg-blue-50 rounded-md text-sm">
                <p className="text-blue-800 mb-2">
                  Understanding your audience helps tailor content to their knowledge level and interests.
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {AUDIENCE_TYPES.slice(0, 3).map(audience => (
                    <div key={audience.id} className="flex items-start">
                      <div>
                        <p className="font-medium text-blue-900">{audience.title}</p>
                        <p className="text-xs text-blue-700">{audience.preferences}</p>
                      </div>
                    </div>
                  ))}
                  {showAudienceInfo && AUDIENCE_TYPES.length > 3 && (
                    <p className="text-xs text-blue-600">Plus {AUDIENCE_TYPES.length - 3} more audience types...</p>
                  )}
                </div>
              </div>
            )}
            
            <div className="relative">
              <textarea
                name="targetAudience"
                value={state.targetAudience}
                onChange={handleInputChange}
                placeholder="Describe who will be attending your presentation and their needs"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute right-2 top-6">
                <AIAssistButton
                  onClick={() => setShowAIAudienceGenerator(!showAIAudienceGenerator)}
                  tooltip="Generate audience profile with AI"
                  buttonStyle="minimal"
                />
              </div>
            </div>
            
            {/* AI Audience Generator */}
            {showAIAudienceGenerator && (
              <div className="mt-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-blue-800">AI Audience Profile Generator</h4>
                  <button 
                    onClick={() => setShowAIAudienceGenerator(false)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                <p className="text-sm text-blue-700 mb-3">
                  Define your audience to create content that resonates with them.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                  {AUDIENCE_TYPES.map(audience => (
                    <button
                      key={audience.id}
                      onClick={() => {
                        updateState({ presentationStyle: audience.id });
                        generateAudienceDescription();
                      }}
                      className="p-2 rounded-md text-left hover:bg-blue-100 transition bg-white border border-gray-200"
                      disabled={isGenerating}
                    >
                      <div className="font-medium">{audience.title}</div>
                      <p className="text-xs text-gray-600 mt-1">{audience.description}</p>
                    </button>
                  ))}
                </div>
                
                <AIAssistButton
                  onClick={generateAudienceDescription}
                  label={isGenerating ? "Generating..." : "Generate Custom Audience"}
                  buttonStyle="standard"
                  disabled={isGenerating}
                />
              </div>
            )}
          </div>
          
          {/* Presentation Length */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Presentation Length
            </label>
            <div className="flex items-center">
              <input
                type="number"
                name="lengthMinutes"
                value={state.lengthMinutes}
                onChange={handleInputChange}
                min="5"
                max="120"
                className="w-24 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="ml-2 text-gray-600">minutes</span>
              <div className="ml-4 text-sm text-gray-500">
                (Recommended: ~1-2 slides per minute)
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Presentation Templates */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Presentation Template <span className="text-red-500">*</span>
          </h3>
          <button
            type="button"
            onClick={() => setShowTemplateInfo(!showTemplateInfo)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {showTemplateInfo ? 'Hide Info' : 'Show Info'}
          </button>
        </div>
        
        {showTemplateInfo && (
          <div className="mb-4 p-3 bg-blue-50 rounded-md text-sm">
            <p className="text-blue-800 mb-2">
              Templates determine the overall structure and slide types in your presentation.
            </p>
            <p className="text-blue-700">
              You'll be able to customize individual slides and add/remove slides in the next steps.
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {state.slideTemplates.map((template: SlideTemplate) => (
            <div
              key={template.id}
              onClick={() => handleTemplateSelect(template.id)}
              className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
                state.selectedTemplate === template.id
                  ? 'border-blue-500 ring-2 ring-blue-200 transform scale-[1.02]'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                <div className="text-center p-4">
                  <div className="text-4xl mb-2">📊</div>
                  <div className="font-medium text-lg text-gray-800">{template.name}</div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                <div className="flex flex-wrap gap-1">
                  {template.slideTypes.slice(0, 3).map((type, index) => (
                    <span
                      key={`${template.id}-${type}-${index}`}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {type}
                    </span>
                  ))}
                  {template.slideTypes.length > 3 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      +{template.slideTypes.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation */}
      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`px-6 py-2 rounded-md font-medium ${
            canProceed
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isGenerating ? 'Please wait...' : 'Continue to Content Creation'}
        </button>
      </div>
      
      {!canProceed && (
        <p className="text-sm text-orange-600 mt-2 text-right">
          Please fill in all required fields marked with * to continue.
        </p>
      )}
    </div>
  );
};

export default PresentationSetup; 