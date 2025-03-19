import React, { useState } from 'react';
import { AIPersonality } from './BrainstormBuddyMain';
import AIAssistButton from '../../common/AIAssistButton';

// Problem category interface with updated fields
interface ProblemCategory {
  id: string;
  label: string;
  icon: string;
  description: string;
  examples: string[];
  promptTemplates: string[];
}

// Component props with simplified direct props instead of state
interface ProblemDefinitionProps {
  problemStatement: string;
  selectedCategory: string;
  onProblemChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onCategorySelect: (categoryId: string) => void;
  onPersonalitySelect: (personality: AIPersonality) => void;
  selectedPersonality: AIPersonality;
  onGenerateIdeas: () => void;
  isGenerating: boolean;
  categories: ProblemCategory[];
  error?: string;
}

// Personality descriptions
const PERSONALITY_DESCRIPTIONS = {
  creative: {
    title: "Creative Mode",
    description: "Generates highly diverse and unconventional ideas that break traditional thinking patterns.",
    icon: "🎨"
  },
  analytical: {
    title: "Analytical Mode",
    description: "Produces methodical, research-backed ideas with logical frameworks and systematic approaches.",
    icon: "📊"
  },
  optimistic: {
    title: "Optimistic Mode",
    description: "Focuses on opportunity-oriented ideas with high-potential outcomes and growth possibilities.",
    icon: "🌟"
  },
  critical: {
    title: "Critical Mode",
    description: "Develops robust ideas that anticipate challenges and focus on risk mitigation.",
    icon: "🔍"
  },
  balanced: {
    title: "Balanced Mode",
    description: "Creates a mix of creative and practical ideas, balancing innovation with implementation.",
    icon: "⚖️"
  }
};

// Humorous AI tips for problem formulation
const AI_TIPS = [
  "Remember, if your problem statement sounds like a fortune cookie, it's too vague!",
  "Good problems are like good jokes - specific, relatable, and make people go 'Ah, I get it!'",
  "If aliens landed tomorrow and read your problem statement, would they understand it? No? Make it clearer!",
  "Describing your problem is like telling someone where it hurts. 'Everywhere' isn't helpful to the doctor—or the AI!",
  "A vague problem statement is like ordering 'food' at a restaurant. Be specific unless you enjoy surprise liver casserole!",
  "Remember: 'Make more money' is not a problem statement. 'How to monetize our cat video archive' is getting somewhere!"
];

// Add sample problem statements for auto-generation
const SAMPLE_PROBLEM_STATEMENTS = {
  'business-growth': [
    "How might we increase our market share in the competitive tech landscape without significantly increasing our marketing budget?",
    "What strategies can we implement to expand into international markets while maintaining our core brand values?",
    "How can we develop new revenue streams from our existing customer base without overwhelming our current operations team?",
    "What innovative pricing models could help us attract more enterprise clients while retaining our small business customers?"
  ],
  'customer-experience': [
    "How might we reduce customer churn rate by 15% in the next quarter while improving overall satisfaction?",
    "What strategies can we implement to create more personalized customer journeys without being intrusive?",
    "How can we streamline our customer onboarding process to reduce time-to-value while maintaining quality?",
    "What innovative approaches could help us turn customer service interactions into opportunities for upselling?"
  ],
  'innovation': [
    "How might we incorporate AI capabilities into our product line in ways that deliver genuine value to users?",
    "What strategies can we use to develop more sustainable product packaging without increasing costs significantly?",
    "How can we create an innovation pipeline that balances quick wins with longer-term transformative ideas?",
    "What methodologies could help us test new product concepts faster while gathering more meaningful user feedback?"
  ],
  'operational-efficiency': [
    "How might we reduce production costs by 10% without compromising product quality or employee satisfaction?",
    "What processes can we automate to free up our team for more strategic, high-value work?",
    "How can we optimize our supply chain to reduce delays while maintaining inventory flexibility?",
    "What strategies could help us decrease our energy consumption while maintaining or improving productivity?"
  ],
  'team-collaboration': [
    "How might we improve communication between remote and in-office team members to create a more cohesive culture?",
    "What collaborative tools or processes could help us decrease meeting time while increasing project clarity?",
    "How can we foster more cross-departmental collaboration without creating additional bureaucracy?",
    "What strategies could help us build a more inclusive workplace that values diverse perspectives?"
  ],
  'marketing-outreach': [
    "How might we cut through the noise in our competitive market to better highlight our unique value proposition?",
    "What channels or approaches would be most effective for reaching our target demographic without increasing spend?",
    "How can we create more engaging content that resonates with our audience while driving conversions?",
    "What data-driven strategies could help us personalize our marketing without violating privacy concerns?"
  ],
  'sustainability': [
    "How might we reduce our carbon footprint across operations while maintaining or improving profitability?",
    "What initiatives could create meaningful social impact that aligns authentically with our brand values?",
    "How can we redesign our packaging to be more sustainable while enhancing the customer experience?",
    "What strategies could help us engage employees in sustainability efforts across the organization?"
  ],
  'custom': [
    "How might we solve [specific problem] for [target audience] in a way that [desired outcome]?",
    "What innovative approaches could address the challenge of [problem area] while considering [important constraints]?",
    "How can we improve [current situation] to achieve [specific goal] without [negative consequence]?",
    "What strategies would help us overcome [obstacle] to achieve [vision] for our [stakeholders]?"
  ]
};

const ProblemDefinition: React.FC<ProblemDefinitionProps> = ({
  problemStatement,
  selectedCategory,
  onProblemChange,
  onCategorySelect,
  onPersonalitySelect,
  selectedPersonality,
  onGenerateIdeas,
  isGenerating,
  categories,
  error
}) => {
  const [showTip, setShowTip] = useState(true);
  const [tipIndex, setTipIndex] = useState(Math.floor(Math.random() * AI_TIPS.length));
  const [hasFocus, setHasFocus] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  
  // Rotate through AI tips
  const getNewTip = () => {
    const newIndex = (tipIndex + 1) % AI_TIPS.length;
    setTipIndex(newIndex);
  };

  // Auto-generate a problem statement based on the selected category
  const generateProblemStatement = () => {
    // If no category is selected or custom is selected, use the custom problem statements
    const categoryKey = selectedCategory && selectedCategory !== 'custom' 
      ? selectedCategory 
      : 'custom';
    
    // Get statements for the selected category or fallback to custom if not found
    const statements = SAMPLE_PROBLEM_STATEMENTS[categoryKey as keyof typeof SAMPLE_PROBLEM_STATEMENTS] 
      || SAMPLE_PROBLEM_STATEMENTS.custom;
    
    const randomIndex = Math.floor(Math.random() * statements.length);
    
    // Create a synthetic event to simulate user input
    const syntheticEvent = {
      target: {
        value: statements[randomIndex]
      }
    } as React.ChangeEvent<HTMLTextAreaElement>;
    
    onProblemChange(syntheticEvent);
  };

  return (
    <div>
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-lg mb-8 shadow-md text-white">
        <h2 className="text-2xl font-bold flex items-center">
          <span className="mr-3 text-yellow-300">🧠</span>
          Define Your Challenge
        </h2>
        <p className="mt-2 opacity-90">
          Clear problem definition is the foundation of effective brainstorming. Be specific about what you're trying to solve.
        </p>
      </div>
      
      {error && (
        <div className="mb-4 bg-red-50 p-4 rounded-lg text-red-800 animate-pulse border-l-4 border-red-500 shadow-sm">
          <div className="flex">
            <span className="text-xl mr-2">🚨</span>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}
      
      <div className="mb-8 relative">
        <label htmlFor="problem-statement" className="block text-lg font-medium text-gray-700 mb-2 flex items-center">
          <span className="mr-2 text-indigo-600">🤔</span>
          What problem are you trying to solve?
          <button 
            type="button"
            onClick={() => {
              setShowTip(!showTip);
              if (!showTip) getNewTip();
            }}
            className="ml-2 text-blue-500 hover:text-blue-600 focus:outline-none flex items-center text-sm"
            aria-label="Show AI tip"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            {showTip ? 'Hide Tip' : 'Show Tip'}
          </button>
        </label>
        
        {showTip && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-5 rounded-lg mb-4 shadow-md transform transition-all animate-fadeIn relative border-l-4 border-indigo-400">
            <div className="absolute top-2 right-2">
              <button 
                onClick={() => setShowTip(false)}
                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full"
                aria-label="Close tip"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="flex items-start">
              <div className="text-3xl mr-4 text-indigo-500">✨</div>
              <div>
                <h4 className="font-bold text-purple-800 mb-2 text-lg">AI Brainstorm Tip</h4>
                <p className="text-purple-700 text-md">{AI_TIPS[tipIndex]}</p>
                <button 
                  onClick={getNewTip}
                  className="mt-3 text-sm bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-1 rounded-full flex items-center w-auto inline-flex transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  Another tip, please!
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="relative">
          <textarea
            id="problem-statement"
            className="w-full border-2 border-indigo-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm focus:shadow-md transition-all duration-300 min-h-[150px] bg-white text-lg"
            placeholder="e.g., How might we reduce meeting fatigue while maintaining team collaboration? Or maybe: How can we make accounting fun without breaking any laws?"
            value={problemStatement}
            onChange={onProblemChange}
            onFocus={() => setHasFocus(true)}
            onBlur={() => setHasFocus(false)}
          />
          
          <div className="absolute bottom-3 right-3 flex items-center">
            <AIAssistButton
              onClick={() => setShowAIGenerator(!showAIGenerator)}
              tooltip="Generate a problem statement with AI"
              buttonStyle="standard"
              label="Generate Problem"
            />
            
            <span className={`ml-3 text-sm text-gray-400 transition-opacity ${problemStatement.length > 10 ? 'opacity-100' : 'opacity-0'}`}>
              {problemStatement.length} characters
              {problemStatement.length < 20 && " (more detail helps!)"}
              {problemStatement.length > 100 && " (looking good!)"}
            </span>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center bg-gray-50 p-3 rounded-lg border-l-4 border-indigo-400">
          <span className="text-2xl mr-3 text-indigo-500">🧠</span>
          Select AI Thinking Mode
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {(Object.keys(PERSONALITY_DESCRIPTIONS) as AIPersonality[]).map((personality) => {
            const details = PERSONALITY_DESCRIPTIONS[personality];
            return (
              <div
                key={personality}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all transform hover:scale-105 ${
                  selectedPersonality === personality 
                    ? 'border-indigo-500 bg-indigo-50 shadow-md' 
                    : 'border-gray-200 hover:border-indigo-300 hover:shadow-sm'
                }`}
                onClick={() => onPersonalitySelect(personality)}
              >
                <div className="flex flex-col items-center text-center">
                  <span className="text-3xl mb-3">{details.icon}</span>
                  <h4 className="font-medium text-gray-800">{details.title}</h4>
                  <p className="text-xs text-gray-600 mt-2">{details.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center bg-gray-50 p-3 rounded-lg border-l-4 border-indigo-400">
          <span className="text-2xl mr-3 text-indigo-500">🎯</span>
          Select Problem Category
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {categories.map(category => (
            <div
              key={category.id}
              className={`p-5 rounded-lg border-2 cursor-pointer transition-all transform hover:translate-y-[-5px] hover:shadow-xl ${
                selectedCategory === category.id 
                  ? 'border-indigo-500 bg-indigo-50 shadow-lg' 
                  : 'border-gray-200 hover:border-indigo-300 hover:shadow-md'
              }`}
              onClick={() => onCategorySelect(category.id)}
            >
              <div className="flex flex-col items-center mb-3 text-center">
                <span className="text-4xl mb-4">{category.icon}</span>
                <h4 className="font-bold text-gray-800 text-lg">{category.label}</h4>
                <p className="text-sm text-gray-600 mt-2">{category.description}</p>
              </div>
              
              {selectedCategory === category.id && category.examples && category.examples.length > 0 && (
                <div className="mt-4 border-t border-gray-200 pt-3">
                  <p className="text-xs font-medium text-gray-700 mb-2">Examples:</p>
                  <ul className="text-xs text-gray-600 space-y-2">
                    {category.examples.slice(0, 3).map((example, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-indigo-500 mr-1">•</span>
                        {example}
                      </li>
                    ))}
                    {category.examples.length > 3 && (
                      <li className="text-indigo-500 cursor-pointer hover:underline">
                        +{category.examples.length - 3} more examples
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-lg border border-indigo-100 shadow-md">
          <div className="flex items-start">
            <div className="text-indigo-500 text-3xl mr-4">🔍</div>
            <div>
              <h4 className="font-bold text-indigo-700 mb-2 text-lg">Pro Tip</h4>
              <p className="text-indigo-800">
                The best problem statements are specific, actionable, and focused on outcomes rather than solutions. 
                Different AI thinking modes will generate different types of ideas - experiment to find the best fit for your challenge!
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          className={`px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg font-bold
            transition-all hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed
            disabled:hover:scale-100 disabled:hover:shadow-none flex items-center text-lg`}
          onClick={onGenerateIdeas}
          disabled={isGenerating || !problemStatement || !selectedCategory}
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <span className="mr-2 text-yellow-300">✨</span>
              Generate Ideas
            </>
          )}
        </button>
      </div>
      
      {showAIGenerator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full transform animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-indigo-800 text-xl flex items-center">
                <span className="mr-2 text-yellow-400">✨</span>
                AI Problem Generator
              </h4>
              <button 
                onClick={() => setShowAIGenerator(false)}
                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <p className="text-gray-700 mb-6">
              Let AI suggest a problem statement based on your selected category. This will help jumpstart your brainstorming process.
            </p>
            <div className="flex justify-between">
              <AIAssistButton
                onClick={() => {
                  generateProblemStatement();
                  setShowAIGenerator(false);
                }}
                label="Generate Problem"
                buttonStyle="prominent"
              />
              <button 
                onClick={() => setShowAIGenerator(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemDefinition; 