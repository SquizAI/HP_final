import React, { useState, useEffect, useRef } from 'react';
import { useUserProgress } from '../../../utils/userDataManager';

// Define state interface
export interface ContentTransformerState {
  // Content metadata
  title: string;
  contentType: string;
  targetAudience: string;
  goalType: string;
  
  // Content data
  originalContent: string;
  transformedContent: string;
  contentBlocks: ContentBlock[];
  
  // Transformation settings
  transformationOptions: TransformationOptions;
  selectedTransformations: string[];
  
  // AI suggestions and assistance
  aiSuggestions: AISuggestion[];
  aiAssistanceLevel: 'minimal' | 'moderate' | 'extensive';
  
  // Progress tracking
  currentStep: number;
  isComplete: boolean;
  lastUpdated: string;
}

// Content block interface
export interface ContentBlock {
  id: string;
  type: 'text' | 'image' | 'video' | 'interactive' | 'quiz' | 'infographic' | 'chart';
  content: string;
  metadata?: {
    title?: string;
    description?: string;
    imageUrl?: string;
    quizOptions?: string[];
    quizAnswer?: number;
    chartData?: any;
    sourceCredits?: string;
    aiGenerated?: boolean;
  };
}

// AI Suggestion interface
export interface AISuggestion {
  id: string;
  type: 'content' | 'structure' | 'style' | 'engagement' | 'visual';
  suggestion: string;
  explanation: string;
  example?: string;
  applied: boolean;
}

// Transformation options interface
export interface TransformationOptions {
  toneOptions: string[];
  formatOptions: string[];
  interactivityOptions: string[];
  visualOptions: string[];
}

// Step definitions
const STEPS = {
  SETUP: 0,
  CONTENT_INPUT: 1,
  TRANSFORMATION: 2,
  PREVIEW: 3,
  EXPORT: 4
};

// Enhanced transformation options with explanations
const defaultTransformationOptions: TransformationOptions = {
  toneOptions: [
    'Professional',
    'Conversational', 
    'Educational',
    'Persuasive',
    'Inspirational',
    'Technical',
    'Humorous'
  ],
  formatOptions: [
    'Article',
    'Tutorial',
    'Slide Deck',
    'Interactive Guide',
    'FAQ',
    'Checklist',
    'Story'
  ],
  interactivityOptions: [
    'Quizzes',
    'Interactive Elements',
    'Decision Points',
    'Expandable Sections',
    'Progress Tracking',
    'User Input Fields'
  ],
  visualOptions: [
    'Illustrations',
    'Infographics',
    'Charts and Graphs',
    'Icons',
    'Photographs',
    'Animations'
  ]
};

// Explanations for transformation options (for tooltips)
const optionExplanations = {
  toneOptions: {
    'Professional': 'Formal language suitable for business and academic contexts',
    'Conversational': 'Friendly, approachable language that feels like a dialog',
    'Educational': 'Clear explanations with emphasis on knowledge transfer',
    'Persuasive': 'Content designed to convince and drive action',
    'Inspirational': 'Motivational content that evokes emotion and encourages change',
    'Technical': 'Precise language with appropriate terminology for specialized audiences',
    'Humorous': 'Light-hearted content that uses wit and humor to engage'
  },
  formatOptions: {
    'Article': 'Traditional text-based content with headings and paragraphs',
    'Tutorial': 'Step-by-step instructions for learning a skill or process',
    'Slide Deck': 'Visual presentation with key points and graphics',
    'Interactive Guide': 'Content with interactive elements that respond to user input',
    'FAQ': 'Question and answer format addressing common inquiries',
    'Checklist': 'Actionable list of items to complete or verify',
    'Story': 'Narrative format that engages through storytelling techniques'
  },
  interactivityOptions: {
    'Quizzes': 'Test comprehension with interactive questions',
    'Interactive Elements': 'Clickable components that reveal additional information',
    'Decision Points': 'Choose-your-own-path navigation based on user preferences',
    'Expandable Sections': 'Collapsible content that users can expand for more detail',
    'Progress Tracking': 'Visual indicators showing completion status',
    'User Input Fields': 'Forms and fields for capturing user responses'
  },
  visualOptions: {
    'Illustrations': 'Hand-drawn or digital artwork that visualizes concepts',
    'Infographics': 'Visual representations of information and data',
    'Charts and Graphs': 'Data visualizations showing trends and comparisons',
    'Icons': 'Simple visual symbols representing ideas or actions',
    'Photographs': 'Real-world imagery to illustrate concepts',
    'Animations': 'Moving graphics that demonstrate processes or add visual interest'
  }
};

// Content insights and tips
const CONTENT_INSIGHTS = [
  {
    title: "Chunking Information",
    tip: "Break complex ideas into digestible sections to improve understanding",
    explanation: "Cognitive load theory shows that humans process information better when it's divided into manageable chunks.",
    example: "Instead of one long paragraph about a complex concept, create 3-4 smaller sections with descriptive subheadings."
  },
  {
    title: "Visual Processing",
    tip: "Use visuals to complement your text and enhance engagement",
    explanation: "The brain processes visual information 60,000 times faster than text, making visuals powerful for conveying complex ideas quickly.",
    example: "Add a diagram showing the relationship between concepts rather than just describing them in text."
  },
  {
    title: "Active Learning",
    tip: "Add interactive elements like quizzes to increase retention",
    explanation: "When learners actively engage with content rather than passively consuming it, retention increases by up to 75%.",
    example: "After explaining an important concept, add a quick 2-3 question quiz to reinforce key points."
  },
  {
    title: "Knowledge Scaffolding",
    tip: "Consider your audience's prior knowledge when presenting information",
    explanation: "Learning builds on existing knowledge. Effective content connects new information to what your audience already knows.",
    example: "Begin with a brief review of foundational concepts before introducing more advanced topics."
  },
  {
    title: "Narrative Structure",
    tip: "Create a logical flow of ideas from introduction to conclusion",
    explanation: "Our brains are wired for stories. Using a clear narrative structure improves comprehension and retention.",
    example: "Start with a problem, explain challenges, present solutions, and conclude with outcomes or next steps."
  },
  {
    title: "Concrete Examples",
    tip: "Use examples and case studies to illustrate abstract concepts",
    explanation: "Abstract concepts become more understandable when illustrated with real-world examples.",
    example: "After explaining a theoretical framework, include a case study showing how it applies in practice."
  },
  {
    title: "Cognitive Breathing Room",
    tip: "Incorporate white space and visual breaks to prevent information overload",
    explanation: "Visually dense content can overwhelm learners. Strategic use of white space gives the brain time to process information.",
    example: "Use larger margins, paragraph breaks, and section dividers to create visual rhythm in your content."
  }
];

// AI assistance levels explanation
const AI_ASSISTANCE_LEVELS = {
  minimal: "AI will suggest basic improvements to your content structure and readability",
  moderate: "AI will provide content suggestions, enhancements, and generate simple visual elements",
  extensive: "AI will completely transform your content with rich interactive elements, visuals, and structural improvements"
};

// Helper function to create initial state
const createInitialState = (): ContentTransformerState => {
  return {
    title: '',
    contentType: '',
    targetAudience: '',
    goalType: '',
    originalContent: '',
    transformedContent: '',
    contentBlocks: [],
    transformationOptions: defaultTransformationOptions,
    selectedTransformations: [],
    aiSuggestions: [],
    aiAssistanceLevel: 'moderate',
    currentStep: STEPS.SETUP,
    isComplete: false,
    lastUpdated: new Date().toISOString()
  };
};

// Helper to generate AI suggestions based on content
const generateAISuggestions = (content: string, audience: string, goal: string): AISuggestion[] => {
  // In a real app, this would call an AI API
  // For demo purposes, we'll generate some sample suggestions
  const suggestions: AISuggestion[] = [
    {
      id: `suggestion-${Date.now()}-1`,
      type: 'structure',
      suggestion: 'Add clear section headings to organize your content',
      explanation: 'Breaking your content into clearly labeled sections helps users find information quickly and improves overall readability.',
      example: '## Understanding Machine Learning\n\nThis section explains the basics...',
      applied: false
    },
    {
      id: `suggestion-${Date.now()}-2`,
      type: 'engagement',
      suggestion: 'Add a real-world example to illustrate key concepts',
      explanation: 'Concrete examples help users understand abstract concepts by relating them to familiar scenarios.',
      example: 'For example, a retail company used this approach to increase customer engagement by 45%...',
      applied: false
    },
    {
      id: `suggestion-${Date.now()}-3`,
      type: 'visual',
      suggestion: 'Convert the numerical data into a chart or graph',
      explanation: 'Visual representation of data makes patterns and comparisons easier to understand at a glance.',
      applied: false
    }
  ];
  
  return suggestions;
};

const ContentTransformerMain: React.FC = () => {
  // Get user progress
  const [userProgress, setUserProgress] = useUserProgress();
  
  // Component state
  const [state, setState] = useState<ContentTransformerState>(createInitialState());
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentInsight, setCurrentInsight] = useState(CONTENT_INSIGHTS[0]);
  const [tooltipVisible, setTooltipVisible] = useState<string | null>(null);
  
  // Refs for tooltip positioning
  const tooltipRefs = useRef<Record<string, HTMLElement | null>>({});
  
  // Load saved state from local storage on initial mount
  useEffect(() => {
    const savedState = localStorage.getItem('contentTransformerState');
    if (savedState) {
      try {
        setState(JSON.parse(savedState));
      } catch (err) {
        console.error('Error loading saved state:', err);
      }
    }
  }, []);
  
  // Save state to local storage on state changes
  useEffect(() => {
    localStorage.setItem('contentTransformerState', JSON.stringify(state));
  }, [state]);
  
  // Update state
  const updateState = (newState: Partial<ContentTransformerState>) => {
    setState(prevState => ({
      ...prevState,
      ...newState,
      lastUpdated: new Date().toISOString()
    }));
  };
  
  // Navigate to next step
  const handleNext = () => {
    // If moving to transformation step, generate AI suggestions
    if (state.currentStep === STEPS.CONTENT_INPUT) {
      updateState({ 
        aiSuggestions: generateAISuggestions(
          state.originalContent, 
          state.targetAudience, 
          state.goalType
        ),
        currentStep: state.currentStep + 1 
      });
    } else {
      updateState({ currentStep: state.currentStep + 1 });
    }
  };
  
  // Navigate to previous step
  const handleBack = () => {
    updateState({ currentStep: state.currentStep - 1 });
  };
  
  // Mark challenge as complete
  const handleComplete = () => {
    // In a real app, this would save completion data to the server
    const updatedProgress = { ...userProgress };
    if (!updatedProgress.completedChallenges.includes('content-transformer')) {
      updatedProgress.completedChallenges.push('content-transformer');
    }
    updatedProgress.lastActive = new Date().toISOString();
    setUserProgress(updatedProgress);
    
    updateState({ isComplete: true });
  };
  
  // Restart challenge
  const handleRestart = () => {
    setState(createInitialState());
  };
  
  // Get a new content insight
  const getNewInsight = () => {
    const currentIndex = CONTENT_INSIGHTS.findIndex(insight => insight.title === currentInsight.title);
    const nextIndex = (currentIndex + 1) % CONTENT_INSIGHTS.length;
    setCurrentInsight(CONTENT_INSIGHTS[nextIndex]);
  };
  
  // Show tooltip
  const showTooltip = (id: string) => {
    setTooltipVisible(id);
  };
  
  // Hide tooltip
  const hideTooltip = () => {
    setTooltipVisible(null);
  };
  
  // Apply AI suggestion
  const applyAISuggestion = (suggestionId: string) => {
    updateState({
      aiSuggestions: state.aiSuggestions.map(suggestion => 
        suggestion.id === suggestionId 
          ? { ...suggestion, applied: true } 
          : suggestion
      )
    });
    
    // In a real app, this would modify the content based on the suggestion
  };
  
  // Transform content with AI
  const transformContent = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // In a real app, this would make an API call to an AI service
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create sample content blocks based on original content
      const contentSample = state.originalContent.trim();
      if (!contentSample) {
        throw new Error("Please provide some content to transform");
      }
      
      // Generate paragraphs from content
      const paragraphs = contentSample.split('\n\n').filter(p => p.trim());
      
      // Create content blocks based on selected transformations and AI assistance level
      let contentBlocks: ContentBlock[] = [];
      
      // Different transformation based on AI assistance level
      if (state.aiAssistanceLevel === 'extensive') {
        // Create rich, varied content with multiple block types
        contentBlocks = paragraphs.map((paragraph, index) => {
          const blockType = getContentBlockType(index, state.selectedTransformations);
          return createContentBlock(blockType, paragraph, index);
        });
      } else if (state.aiAssistanceLevel === 'moderate') {
        // Create a mix of text and some visual elements
        contentBlocks = paragraphs.map((paragraph, index) => {
          // Every third paragraph, add a visual if appropriate transformation is selected
          if (index % 3 === 1 && 
              (state.selectedTransformations.includes('Illustrations') || 
               state.selectedTransformations.includes('Infographics'))) {
            return createContentBlock('image', paragraph, index);
          } else if (index % 4 === 2 && state.selectedTransformations.includes('Quizzes')) {
            return createContentBlock('quiz', paragraph, index);
          } else {
            return createContentBlock('text', paragraph, index);
          }
        });
      } else {
        // Minimal - mostly text with basic enhancements
        contentBlocks = paragraphs.map((paragraph, index) => {
          return createContentBlock('text', paragraph, index);
        });
      }
      
      // Update state with transformed content
      updateState({ 
        contentBlocks,
        transformedContent: contentSample
      });
    } catch (err) {
      console.error('Error transforming content:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Helper to determine content block type based on index and selections
  const getContentBlockType = (index: number, selections: string[]): ContentBlock['type'] => {
    // This would be more sophisticated in a real app
    if (index % 5 === 0 && selections.includes('Charts and Graphs')) {
      return 'chart';
    } else if (index % 4 === 1 && selections.includes('Infographics')) {
      return 'infographic';
    } else if (index % 3 === 1 && selections.includes('Illustrations')) {
      return 'image';
    } else if (index % 6 === 2 && selections.includes('Quizzes')) {
      return 'quiz';
    } else if (index % 7 === 3 && selections.includes('Interactive Elements')) {
      return 'interactive';
    } else {
      return 'text';
    }
  };
  
  // Helper to create a content block
  const createContentBlock = (type: ContentBlock['type'], content: string, index: number): ContentBlock => {
    switch (type) {
      case 'image':
        return {
          id: `block-${Date.now()}-${index}`,
          type: 'image',
          content,
          metadata: {
            title: `Visual ${index + 1}`,
            description: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
            imageUrl: 'https://via.placeholder.com/600x400?text=AI+Generated+Image',
            aiGenerated: true
          }
        };
      case 'chart':
        return {
          id: `block-${Date.now()}-${index}`,
          type: 'chart',
          content,
          metadata: {
            title: `Data Visualization ${index + 1}`,
            description: 'AI-generated chart based on numerical data in your content',
            imageUrl: 'https://via.placeholder.com/600x400?text=AI+Generated+Chart',
            aiGenerated: true
          }
        };
      case 'infographic':
        return {
          id: `block-${Date.now()}-${index}`,
          type: 'infographic',
          content,
          metadata: {
            title: `Infographic ${index + 1}`,
            description: 'Visual representation of key concepts from your content',
            imageUrl: 'https://via.placeholder.com/600x400?text=AI+Generated+Infographic',
            aiGenerated: true
          }
        };
      case 'quiz':
        return {
          id: `block-${Date.now()}-${index}`,
          type: 'quiz',
          content,
          metadata: {
            title: `Knowledge Check ${index + 1}`,
            description: 'Test your understanding of the key concepts',
            quizOptions: [
              'Option A: First possible answer',
              'Option B: Second possible answer',
              'Option C: Third possible answer',
              'Option D: Fourth possible answer'
            ],
            quizAnswer: 2,
            aiGenerated: true
          }
        };
      case 'interactive':
        return {
          id: `block-${Date.now()}-${index}`,
          type: 'interactive',
          content,
          metadata: {
            title: `Interactive Element ${index + 1}`,
            description: 'Engage with this content through interaction',
            aiGenerated: true
          }
        };
      default:
        return {
          id: `block-${Date.now()}-${index}`,
          type: 'text',
          content
        };
    }
  };
  
  // Get step label
  const getStepLabel = (step: number): string => {
    switch (step) {
      case STEPS.SETUP:
        return 'Setup';
      case STEPS.CONTENT_INPUT:
        return 'Content Input';
      case STEPS.TRANSFORMATION:
        return 'Transformation';
      case STEPS.PREVIEW:
        return 'Preview';
      case STEPS.EXPORT:
        return 'Export';
      default:
        return `Step ${step + 1}`;
    }
  };
  
  // Render current step
  const renderCurrentStep = () => {
    switch (state.currentStep) {
      case STEPS.SETUP:
        return (
          <div className="p-6 bg-white rounded-xl shadow-sm">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2 text-gray-800">Content Transformer Setup</h2>
              <p className="text-gray-600">
                Let's set up your content transformation project. Fill in the details below to get started.
              </p>
            </div>
            
            {/* AI Insight Card */}
            <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-start">
                <div className="flex-shrink-0 p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3 flex-grow">
                  <h3 className="text-sm font-medium text-blue-800">{currentInsight.title}</h3>
                  <p className="mt-1 text-sm text-blue-700">{currentInsight.tip}</p>
                  <div className="mt-2 text-xs text-blue-600">
                    <p>{currentInsight.explanation}</p>
                    <p className="mt-1 italic">{currentInsight.example}</p>
                  </div>
                  <button 
                    onClick={getNewInsight}
                    className="mt-3 text-xs text-blue-700 hover:text-blue-900 inline-flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Show Another Insight
                  </button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={state.title}
                      onChange={(e) => updateState({ title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                      placeholder="Enter a title for your project"
                    />
                    <div 
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      ref={el => tooltipRefs.current['title'] = el}
                      onMouseEnter={() => showTooltip('title')}
                      onMouseLeave={hideTooltip}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    {tooltipVisible === 'title' && (
                      <div className="absolute z-10 right-0 mt-2 w-64 bg-gray-800 text-white text-sm rounded shadow-lg p-3">
                        <p>Give your project a clear name that describes the content you'll be transforming.</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
                  <div className="relative">
                    <select
                      value={state.contentType}
                      onChange={(e) => updateState({ contentType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 shadow-sm appearance-none"
                    >
                      <option value="">Select content type</option>
                      <option value="article">Article</option>
                      <option value="blog">Blog Post</option>
                      <option value="documentation">Documentation</option>
                      <option value="educational">Educational Content</option>
                      <option value="marketing">Marketing Material</option>
                      <option value="technical">Technical Content</option>
                    </select>
                    <div 
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      ref={el => tooltipRefs.current['contentType'] = el}
                      onMouseEnter={() => showTooltip('contentType')}
                      onMouseLeave={hideTooltip}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    {tooltipVisible === 'contentType' && (
                      <div className="absolute z-10 right-0 mt-2 w-64 bg-gray-800 text-white text-sm rounded shadow-lg p-3">
                        <p>The format of your original content helps the AI understand its structure and purpose.</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                  <div className="relative">
                    <select
                      value={state.targetAudience}
                      onChange={(e) => updateState({ targetAudience: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 shadow-sm appearance-none"
                    >
                      <option value="">Select target audience</option>
                      <option value="general">General Audience</option>
                      <option value="technical">Technical Professionals</option>
                      <option value="executives">Business Executives</option>
                      <option value="beginners">Beginners/Novices</option>
                      <option value="students">Students</option>
                      <option value="developers">Developers</option>
                      <option value="marketers">Marketers</option>
                    </select>
                    <div 
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      ref={el => tooltipRefs.current['audience'] = el}
                      onMouseEnter={() => showTooltip('audience')}
                      onMouseLeave={hideTooltip}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    {tooltipVisible === 'audience' && (
                      <div className="absolute z-10 right-0 mt-2 w-64 bg-gray-800 text-white text-sm rounded shadow-lg p-3">
                        <p>The AI will adjust complexity, terminology, and examples based on your audience selection.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transformation Goal</label>
                  <div className="relative">
                    <select
                      value={state.goalType}
                      onChange={(e) => updateState({ goalType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 shadow-sm appearance-none"
                    >
                      <option value="">Select transformation goal</option>
                      <option value="educate">Educate & Inform</option>
                      <option value="engage">Engage & Entertain</option>
                      <option value="persuade">Persuade & Convert</option>
                      <option value="simplify">Simplify & Clarify</option>
                      <option value="visualize">Visualize Data</option>
                      <option value="interactive">Make Interactive</option>
                    </select>
                    <div 
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      ref={el => tooltipRefs.current['goal'] = el}
                      onMouseEnter={() => showTooltip('goal')}
                      onMouseLeave={hideTooltip}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    {tooltipVisible === 'goal' && (
                      <div className="absolute z-10 right-0 mt-2 w-64 bg-gray-800 text-white text-sm rounded shadow-lg p-3">
                        <p>Your goal determines what transformations the AI will prioritize to make your content effective.</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">AI Assistance Level</label>
                  <div className="space-y-2">
                    {Object.entries(AI_ASSISTANCE_LEVELS).map(([level, description]) => (
                      <div key={level} className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id={`ai-level-${level}`}
                            name="ai-assistance-level"
                            type="radio"
                            checked={state.aiAssistanceLevel === level}
                            onChange={() => updateState({ aiAssistanceLevel: level as any })}
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor={`ai-level-${level}`} className="font-medium text-gray-700 capitalize">{level}</label>
                          <p className="text-gray-500">{description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleNext}
                disabled={!state.title || !state.contentType || !state.targetAudience || !state.goalType}
                className={`
                  flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                  ${(!state.title || !state.contentType || !state.targetAudience || !state.goalType)
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  }
                `}
              >
                Continue to Content Input
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        );
        
      case STEPS.CONTENT_INPUT:
        return (
          <div className="p-6 bg-white rounded-xl shadow-sm">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2 text-gray-800">Enter Your Content</h2>
              <p className="text-gray-600">
                Paste or write the content you want to transform. AI will analyze your content and prepare it for transformation.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Your Content</label>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          // Simulate analyzing content with AI
                          if (state.originalContent.trim()) {
                            setIsGenerating(true);
                            setTimeout(() => {
                              setIsGenerating(false);
                              // Show an analysis notification that would come from real AI
                              setTooltipVisible('contentAnalysis');
                              setTimeout(() => setTooltipVisible(null), 5000);
                            }, 1500);
                          }
                        }}
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        disabled={isGenerating || !state.originalContent.trim()}
                      >
                        {isGenerating ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            Analyze with AI
                          </>
                        )}
                      </button>
                      
                      <label
                        htmlFor="file-upload"
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 cursor-pointer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        Import File
                      </label>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        onChange={(e) => {
                          // Handle file upload - in a real app this would parse the file
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              if (event.target?.result) {
                                updateState({ originalContent: event.target.result.toString() });
                              }
                            };
                            reader.readAsText(file);
                          }
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="relative">
                    <textarea
                      value={state.originalContent}
                      onChange={(e) => updateState({ originalContent: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                      placeholder="Paste or write your content here..."
                      rows={12}
                    />
                    
                    {tooltipVisible === 'contentAnalysis' && (
                      <div className="absolute right-4 top-4 z-10 w-72 bg-indigo-700 text-white text-sm rounded-lg shadow-lg p-4 animate-fade-in-down">
                        <div className="flex items-start mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          <div>
                            <h3 className="font-medium">AI Content Analysis</h3>
                            <p className="text-indigo-100 text-xs mt-1">
                              Based on your content, AI recommends these transformations:
                            </p>
                          </div>
                        </div>
                        <ul className="text-xs space-y-1 pl-7 list-disc text-indigo-100">
                          <li>Add section headings to improve structure</li>
                          <li>Include visual elements to illustrate key concepts</li>
                          <li>Add a summary at the beginning for quick understanding</li>
                        </ul>
                        <div className="text-xs text-right mt-2 text-indigo-200">
                          These will be applied in the next step
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-2 flex justify-between text-xs text-gray-500">
                    <div>
                      {state.originalContent ? `${state.originalContent.length} characters` : 'No content yet'}
                    </div>
                    <div>
                      {state.originalContent ? 
                        `~${Math.ceil(state.originalContent.split(/\s+/).length / 200)} min read` : 
                        '0 min read'}
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="font-medium text-gray-700 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Content Tips
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Keep paragraphs short (3-5 sentences) for better readability
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Use blank lines between paragraphs to create natural breaks
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Include numerical data if you want charts and visualizations
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-gradient-to-b from-indigo-50 to-white rounded-xl p-5 border border-indigo-100">
                <h3 className="text-lg font-medium text-indigo-800 mb-3">AI Transformation Preview</h3>
                <p className="text-sm text-indigo-700 mb-4">
                  Based on your settings, AI will transform your content with:
                </p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-indigo-700 mb-1">Content Type</h4>
                    <div className="flex items-center bg-white px-3 py-2 rounded-md border border-indigo-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-gray-800">
                        {state.contentType ? state.contentType.charAt(0).toUpperCase() + state.contentType.slice(1) : 'Not selected'}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-indigo-700 mb-1">Target Audience</h4>
                    <div className="flex items-center bg-white px-3 py-2 rounded-md border border-indigo-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span className="text-gray-800">
                        {state.targetAudience ? state.targetAudience.charAt(0).toUpperCase() + state.targetAudience.slice(1) : 'Not selected'}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-indigo-700 mb-1">Transformation Goal</h4>
                    <div className="flex items-center bg-white px-3 py-2 rounded-md border border-indigo-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span className="text-gray-800">
                        {state.goalType ? state.goalType.charAt(0).toUpperCase() + state.goalType.slice(1) : 'Not selected'}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-indigo-700 mb-1">AI Assistance Level</h4>
                    <div className="flex items-center bg-white px-3 py-2 rounded-md border border-indigo-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <span className="text-gray-800 capitalize">
                        {state.aiAssistanceLevel}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => {
                      // Generate sample content for demonstration
                      if (!state.originalContent) {
                        updateState({
                          originalContent: `# Introduction to Machine Learning\n\nMachine learning is a branch of artificial intelligence that focuses on developing systems that learn from and make decisions based on data. Unlike traditional programming, where rules are explicitly coded, machine learning algorithms build models from sample data to make predictions or decisions without being specifically programmed to perform the task.\n\n## Types of Machine Learning\n\nThere are three main types of machine learning:\n\n1. **Supervised Learning**: The algorithm is trained on labeled data, learning to map inputs to known outputs.\n2. **Unsupervised Learning**: The algorithm works with unlabeled data, identifying patterns and relationships on its own.\n3. **Reinforcement Learning**: The algorithm learns through trial and error, receiving rewards for actions that achieve desired outcomes.\n\n## Applications in Business\n\nMachine learning has numerous applications across industries:\n\n- Customer segmentation and personalization\n- Predictive maintenance for equipment\n- Fraud detection in financial transactions\n- Supply chain optimization\n- Natural language processing for customer service\n\n## Implementation Challenges\n\nDespite its benefits, implementing machine learning comes with challenges:\n\n- Data quality and quantity requirements\n- Need for specialized expertise\n- Ethical considerations around bias and fairness\n- Integration with existing systems\n- Ongoing maintenance and monitoring`
                        });
                      }
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                    </svg>
                    Sample Content
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-between">
              <button
                onClick={handleBack}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Setup
              </button>
              <button
                onClick={handleNext}
                disabled={!state.originalContent.trim()}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white 
                  ${!state.originalContent.trim() 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  }`}
              >
                Continue to Transformation
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        );
        
      case STEPS.TRANSFORMATION:
        return (
          <div className="p-6 bg-white rounded-xl shadow-sm">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2 text-gray-800">Choose Transformation Options</h2>
              <p className="text-gray-600">
                Select how you want to transform your content to achieve your goal of "{state.goalType}" for your "{state.targetAudience}" audience.
                {state.aiSuggestions.length > 0 && " AI has already analyzed your content and provided suggestions."}
              </p>
            </div>
            
            {/* AI Suggestions Section */}
            {state.aiSuggestions.length > 0 && (
              <div className="mb-8 border border-indigo-200 rounded-lg overflow-hidden">
                <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-200">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <h3 className="font-medium text-indigo-800">AI-Recommended Transformations</h3>
                  </div>
                </div>
                
                <div className="divide-y divide-indigo-100">
                  {state.aiSuggestions.map(suggestion => (
                    <div key={suggestion.id} className="p-4 hover:bg-indigo-50 transition-colors">
                      <div className="flex">
                        <div className={`mt-0.5 rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 ${suggestion.applied ? 'bg-green-100 text-green-600' : 'bg-indigo-100 text-indigo-600'}`}>
                          {suggestion.applied ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <span className="text-xs font-bold">AI</span>
                          )}
                        </div>
                        <div className="ml-3 flex-grow">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-gray-800 font-medium">{suggestion.suggestion}</p>
                              <p className="text-sm text-gray-600 mt-1">{suggestion.explanation}</p>
                              {suggestion.example && (
                                <div className="mt-2 p-2 bg-white border border-gray-200 rounded text-sm text-gray-700 font-mono">
                                  {suggestion.example}
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => applyAISuggestion(suggestion.id)}
                              disabled={suggestion.applied}
                              className={`ml-4 flex-shrink-0 px-3 py-1 rounded text-sm font-medium ${
                                suggestion.applied 
                                  ? 'bg-green-100 text-green-700 cursor-default' 
                                  : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                              }`}
                            >
                              {suggestion.applied ? 'Applied' : 'Apply'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3 text-gray-800">Content Style & Tone</h3>
                <div className="space-y-4">
                  {/* Tone Selection Section */}
                  <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                    <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                      Tone Options
                    </h4>
                    <div className="space-y-2">
                      {state.transformationOptions.toneOptions.map(option => (
                        <div 
                          key={`tone-${option}`} 
                          className={`relative rounded-md border p-3 cursor-pointer transition-colors ${
                            state.selectedTransformations.includes(option)
                              ? 'bg-indigo-50 border-indigo-300'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                          onClick={() => {
                            const newSelected = state.selectedTransformations.includes(option)
                              ? state.selectedTransformations.filter(item => item !== option)
                              : [...state.selectedTransformations, option];
                            updateState({ selectedTransformations: newSelected });
                          }}
                        >
                          <div className="flex items-center">
                            <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                              state.selectedTransformations.includes(option)
                                ? 'bg-indigo-600 border-indigo-600'
                                : 'border-gray-300'
                            }`}>
                              {state.selectedTransformations.includes(option) && (
                                <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                                  <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                                </svg>
                              )}
                            </div>
                            <span className="ml-3 font-medium text-gray-700">{option}</span>
                            <div 
                              className="ml-auto text-gray-500"
                              onMouseEnter={() => showTooltip(`tone-${option}`)}
                              onMouseLeave={hideTooltip}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {tooltipVisible === `tone-${option}` && (
                                <div className="absolute z-10 right-0 mt-2 w-64 bg-gray-800 text-white text-sm rounded shadow-lg p-3">
                                  <p>{optionExplanations.toneOptions[option]}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Format Selection Section */}
                  <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                    <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Format Options
                    </h4>
                    <div className="space-y-2">
                      {state.transformationOptions.formatOptions.map(option => (
                        <div 
                          key={`format-${option}`} 
                          className={`relative rounded-md border p-3 cursor-pointer transition-colors ${
                            state.selectedTransformations.includes(option)
                              ? 'bg-indigo-50 border-indigo-300'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                          onClick={() => {
                            const newSelected = state.selectedTransformations.includes(option)
                              ? state.selectedTransformations.filter(item => item !== option)
                              : [...state.selectedTransformations, option];
                            updateState({ selectedTransformations: newSelected });
                          }}
                        >
                          <div className="flex items-center">
                            <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                              state.selectedTransformations.includes(option)
                                ? 'bg-indigo-600 border-indigo-600'
                                : 'border-gray-300'
                            }`}>
                              {state.selectedTransformations.includes(option) && (
                                <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                                  <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                                </svg>
                              )}
                            </div>
                            <span className="ml-3 font-medium text-gray-700">{option}</span>
                            <div 
                              className="ml-auto text-gray-500"
                              onMouseEnter={() => showTooltip(`format-${option}`)}
                              onMouseLeave={hideTooltip}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {tooltipVisible === `format-${option}` && (
                                <div className="absolute z-10 right-0 mt-2 w-64 bg-gray-800 text-white text-sm rounded shadow-lg p-3">
                                  <p>{optionExplanations.formatOptions[option]}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3 text-gray-800">Engagement & Visual Elements</h3>
                <div className="space-y-4">
                  {/* Interactivity Selection Section */}
                  <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                    <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                      </svg>
                      Interactivity Options
                    </h4>
                    <div className="space-y-2">
                      {state.transformationOptions.interactivityOptions.map(option => (
                        <div 
                          key={`interactive-${option}`} 
                          className={`relative rounded-md border p-3 cursor-pointer transition-colors ${
                            state.selectedTransformations.includes(option)
                              ? 'bg-indigo-50 border-indigo-300'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                          onClick={() => {
                            const newSelected = state.selectedTransformations.includes(option)
                              ? state.selectedTransformations.filter(item => item !== option)
                              : [...state.selectedTransformations, option];
                            updateState({ selectedTransformations: newSelected });
                          }}
                        >
                          <div className="flex items-center">
                            <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                              state.selectedTransformations.includes(option)
                                ? 'bg-indigo-600 border-indigo-600'
                                : 'border-gray-300'
                            }`}>
                              {state.selectedTransformations.includes(option) && (
                                <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                                  <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                                </svg>
                              )}
                            </div>
                            <span className="ml-3 font-medium text-gray-700">{option}</span>
                            <div 
                              className="ml-auto text-gray-500"
                              onMouseEnter={() => showTooltip(`interactive-${option}`)}
                              onMouseLeave={hideTooltip}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {tooltipVisible === `interactive-${option}` && (
                                <div className="absolute z-10 right-0 mt-2 w-64 bg-gray-800 text-white text-sm rounded shadow-lg p-3">
                                  <p>{optionExplanations.interactivityOptions[option]}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Visual Selection Section */}
                  <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                    <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Visual Options
                    </h4>
                    <div className="space-y-2">
                      {state.transformationOptions.visualOptions.map(option => (
                        <div 
                          key={`visual-${option}`} 
                          className={`relative rounded-md border p-3 cursor-pointer transition-colors ${
                            state.selectedTransformations.includes(option)
                              ? 'bg-indigo-50 border-indigo-300'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                          onClick={() => {
                            const newSelected = state.selectedTransformations.includes(option)
                              ? state.selectedTransformations.filter(item => item !== option)
                              : [...state.selectedTransformations, option];
                            updateState({ selectedTransformations: newSelected });
                          }}
                        >
                          <div className="flex items-center">
                            <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                              state.selectedTransformations.includes(option)
                                ? 'bg-indigo-600 border-indigo-600'
                                : 'border-gray-300'
                            }`}>
                              {state.selectedTransformations.includes(option) && (
                                <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                                  <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                                </svg>
                              )}
                            </div>
                            <span className="ml-3 font-medium text-gray-700">{option}</span>
                            <div 
                              className="ml-auto text-gray-500"
                              onMouseEnter={() => showTooltip(`visual-${option}`)}
                              onMouseLeave={hideTooltip}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {tooltipVisible === `visual-${option}` && (
                                <div className="absolute z-10 right-0 mt-2 w-64 bg-gray-800 text-white text-sm rounded shadow-lg p-3">
                                  <p>{optionExplanations.visualOptions[option]}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* AI Transformation Summary */}
            <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-5 border border-indigo-100">
              <h3 className="text-lg font-medium text-indigo-800 mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                AI Transformation Summary
              </h3>
              <p className="text-indigo-700 mb-3">
                {state.selectedTransformations.length === 0 
                  ? "Select transformation options to see what the AI will create." 
                  : `AI will transform your ${state.contentType} with the following elements:`}
              </p>
              
              {state.selectedTransformations.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {state.selectedTransformations.map(option => (
                    <div key={option} className="bg-white rounded-md px-3 py-2 text-sm border border-indigo-200 text-indigo-800 font-medium">
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="mt-8 flex justify-between">
              <button
                onClick={handleBack}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Content Input
              </button>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => updateState({ selectedTransformations: [] })}
                  disabled={state.selectedTransformations.length === 0}
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md 
                    ${state.selectedTransformations.length === 0
                      ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                      : 'text-gray-700 bg-white border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                    }
                  `}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Clear Selections
                </button>
                
                <button
                  onClick={() => {
                    transformContent();
                    handleNext();
                  }}
                  disabled={isGenerating || state.selectedTransformations.length === 0}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white 
                    ${isGenerating || state.selectedTransformations.length === 0
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                    }
                  `}
                >
                  {isGenerating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate & Preview
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        );
        
      case STEPS.PREVIEW:
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Preview Transformed Content</h2>
            <p className="mb-6 text-gray-600">
              Review your transformed content below. You can go back to make changes if needed.
            </p>
            
            <div className="mb-8 bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                <h3 className="text-lg font-medium text-gray-800">{state.title}</h3>
                <p className="text-sm text-gray-500">
                  {state.contentType} for {state.targetAudience} audience
                </p>
              </div>
              
              <div className="p-6">
                {state.contentBlocks.length > 0 ? (
                  <div className="space-y-6">
                    {state.contentBlocks.map((block) => (
                      <div key={block.id} className="border rounded-lg overflow-hidden">
                        {block.type === 'text' && (
                          <div className="p-4">
                            <p className="text-gray-800">{block.content}</p>
                          </div>
                        )}
                        
                        {block.type === 'image' && (
                          <div>
                            <div className="bg-gray-50 border-b border-gray-200 px-3 py-2">
                              <h4 className="text-sm font-medium text-gray-700">{block.metadata?.title || 'Image'}</h4>
                            </div>
                            <div className="p-4">
                              <img 
                                src={block.metadata?.imageUrl || 'https://via.placeholder.com/600x400?text=Image'} 
                                alt={block.metadata?.description || 'Content image'} 
                                className="w-full h-auto rounded-md mb-2"
                              />
                              {block.metadata?.description && (
                                <p className="text-sm text-gray-500 italic">{block.metadata.description}</p>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {block.type === 'quiz' && (
                          <div>
                            <div className="bg-indigo-50 border-b border-indigo-100 px-3 py-2">
                              <h4 className="text-sm font-medium text-indigo-700">{block.metadata?.title || 'Quick Quiz'}</h4>
                            </div>
                            <div className="p-4">
                              <p className="text-gray-800 mb-3">{block.content}</p>
                              <div className="space-y-2">
                                {block.metadata?.quizOptions?.map((option, index) => (
                                  <label key={`option-${index}`} className="flex items-start p-2 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
                                    <input
                                      type="radio"
                                      name={`quiz-${block.id}`}
                                      value={index}
                                      className="h-4 w-4 mt-1 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                    />
                                    <span className="ml-2 text-gray-700">{option}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <p>No content blocks available. Go back to transform your content.</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Continue to Export
              </button>
            </div>
          </div>
        );
        
      case STEPS.EXPORT:
        return (
          <div className="p-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 rounded-lg shadow-lg text-center mb-8">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold mb-2">Congratulations!</h3>
              <p className="text-xl">
                You've successfully transformed your content
              </p>
              <div className="text-3xl font-bold mt-4 mb-6">
                "{state.title}"
              </div>
              <p className="text-lg opacity-90 max-w-2xl mx-auto">
                Your content is now ready to engage your audience with a more interactive and visually appealing experience.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Transformation Summary</h4>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {state.selectedTransformations.map(option => (
                  <div key={option} className="bg-white rounded-md px-3 py-2 text-sm border border-indigo-200 text-indigo-800 font-medium">
                    {option}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <button
                onClick={() => {
                  // In a real app, this would download a file
                  alert('Content exported as HTML (this would download a file in a real app)');
                }}
                className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l1.414 1.414A2 2 0 0119 13h-3v3zM2 11a3 3 0 013-3h3v3H2z" />
                </svg>
                Export as HTML
              </button>
              
              <button
                onClick={() => {
                  // In a real app, this would share the content
                  alert('Content shared (this would open sharing options in a real app)');
                }}
                className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Share Content
              </button>
              
              <button
                onClick={handleComplete}
                className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Complete Challenge
              </button>
            </div>
            
            <div className="text-center">
              <button
                onClick={handleRestart}
                className="px-6 py-3 bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-lg font-medium transition inline-flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Start a New Transformation
              </button>
            </div>
          </div>
        );
        
      default:
        return <div>Unknown step</div>;
    }
  };
  
  // Progress step indicators
  const renderProgressSteps = () => {
    const steps = Object.values(STEPS);
    
    return (
      <div className="mb-8">
        <div className="flex items-center">
          {steps.map((step, index) => (
            <React.Fragment key={step}>
              {/* Step circle */}
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  state.currentStep >= step
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {state.currentStep > step ? (
                  <span>{step + 1}</span>
                ) : (
                  <span>{step + 1}</span>
                )}
              </div>
              
              {/* Step label */}
              <div className="ml-3 text-gray-700">{step}</div>
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-2">AI Content Transformer</h1>
      <p className="text-center text-gray-600 mb-8">
        Transform your plain content into engaging, interactive experiences
      </p>
      
      {renderProgressSteps()}
      {renderCurrentStep()}
    </div>
  );
};

export default ContentTransformerMain; 