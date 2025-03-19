import React, { useEffect, useState } from 'react';

interface CompletionScreenProps {
  problemStatement: string;
  selectedCategory: {
    label: string;
    icon: string;
    description: string;
  };
  selectedIdea: {
    title: string;
    description: string;
    pros?: string[];
    cons?: string[];
    tags?: string[];
  };
  implementationPlan: string;
  implementationSteps?: {
    title: string;
    description: string;
    duration: string;
    resources: string[];
    status: 'pending' | 'in-progress' | 'completed';
  }[];
  customNotes?: string;
  selectedPersonality?: string;
  lastUpdated?: Date | null;
  onRestart: () => void;
  onShare?: () => void;
  onSaveAsPDF?: () => void;
}

// Funny achievement titles
const ACHIEVEMENT_TITLES = [
  "Master Idea Wrangler",
  "Certified Problem Obliterator",
  "Distinguished Thought Leader",
  "Professional Light Bulb Moment Generator",
  "Supreme Brainstorm Commander",
  "Elite Innovation Ninja",
  "Grand Wizard of Creative Solutions",
  "Executive Thought Architect"
];

// Humorous implementation tips
const IMPLEMENTATION_TIPS = [
  "Remember to actually implement this idea. Post-it notes on your colleague's forehead can help with this.",
  "For maximum impact, don't mention this was AI-assisted. Just nod mysteriously when asked how you came up with it.",
  "Implementation works best when you don't try to do everything at 4:55pm on a Friday.",
  "Success is 10% inspiration, 90% convincing others it was their idea all along.",
  "The best way to implement your idea is to start before you're ready. The second best way is to start anyway.",
  "Don't forget to update your LinkedIn profile to include 'Innovative Solution Architect' after implementing this.",
  "If someone asks 'But have you considered...' just smile and say 'Of course, it's in phase 2.'",
  "When presenting this idea, use the phrase 'paradigm shift' at least twice for maximum executive approval."
];

// Shareable social media templates
const SOCIAL_TEMPLATES = [
  "Just solved a major challenge using innovative thinking! #ProblemSolved #Innovation",
  "Excited to share my latest solution to a complex problem. Looking forward to implementation! #CreativeSolutions",
  "From challenge to opportunity: Check out my latest problem-solving journey! #BrainstormBuddy #IdeaGeneration",
  "Innovation happens at the intersection of preparation and inspiration. Proud of this solution! #CreativeThinking"
];

const CompletionScreen: React.FC<CompletionScreenProps> = ({
  problemStatement,
  selectedCategory,
  selectedIdea,
  implementationPlan,
  implementationSteps = [],
  customNotes = "",
  selectedPersonality,
  lastUpdated,
  onRestart,
  onShare,
  onSaveAsPDF
}) => {
  const [achievementTitle, setAchievementTitle] = useState('');
  const [showConfetti, setShowConfetti] = useState(true);
  const [implementationTip, setImplementationTip] = useState('');
  const [socialTemplate, setSocialTemplate] = useState('');
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState('');
  
  useEffect(() => {
    // Get random achievement title
    const randomTitleIndex = Math.floor(Math.random() * ACHIEVEMENT_TITLES.length);
    setAchievementTitle(ACHIEVEMENT_TITLES[randomTitleIndex]);
    
    // Get random implementation tip
    const randomTipIndex = Math.floor(Math.random() * IMPLEMENTATION_TIPS.length);
    setImplementationTip(IMPLEMENTATION_TIPS[randomTipIndex]);
    
    // Get random social template
    const randomTemplateIndex = Math.floor(Math.random() * SOCIAL_TEMPLATES.length);
    setSocialTemplate(SOCIAL_TEMPLATES[randomTemplateIndex]);
    
    // Show confetti for 5 seconds
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
  }, []);
  
  // Generate a one-paragraph summary of the solution process
  const generateSummary = () => {
    setIsSummarizing(true);
    
    // This would normally call an API but we'll simulate it
    setTimeout(() => {
      const summary = `Starting with the problem "${problemStatement}", I explored ${selectedCategory.label} approaches. 
      After brainstorming multiple solutions, I selected "${selectedIdea.title}" because it offers an optimal 
      balance of feasibility and impact. The implementation plan addresses key challenges and provides a
      clear pathway to success with ${implementationSteps.length} actionable steps.`;
      
      setSummary(summary);
      setIsSummarizing(false);
    }, 1500);
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return 'Not available';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const handleRatingClick = (newRating: number) => {
    setRating(newRating);
  };
  
  const getCompletedSteps = () => {
    return implementationSteps.filter(step => step.status === 'completed').length;
  };
  
  const getProgressPercentage = () => {
    if (implementationSteps.length === 0) return 0;
    return Math.round((getCompletedSteps() / implementationSteps.length) * 100);
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Confetti animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="confetti-container">
            {Array.from({ length: 100 }).map((_, i) => (
              <div 
                key={i}
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`
                }}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Header Section */}
      <div className="mb-8 text-center">
        <div className="inline-block p-3 rounded-full bg-green-100 text-green-600 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Brainstorming Complete!</h1>
        <p className="text-lg text-gray-600 mt-2">
          Congratulations, <span className="text-indigo-600 font-semibold">{achievementTitle}</span>!
        </p>
      </div>
      
      {/* Solution Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Your Solution</h2>
          <div className="flex space-x-2">
            <button 
              onClick={onSaveAsPDF}
              className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Problem</h3>
          <div className="mt-1 p-3 bg-gray-50 rounded-md">
            <div className="flex items-start">
              <span className="text-xl mr-2">{selectedCategory.icon}</span>
              <div>
                <p className="font-medium text-gray-800">{selectedCategory.label}</p>
                <p className="text-gray-700">{problemStatement}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Selected Solution</h3>
          <div className="mt-1 p-3 bg-blue-50 rounded-md">
            <p className="font-bold text-blue-900">{selectedIdea.title}</p>
            <p className="text-blue-800 mt-1">{selectedIdea.description}</p>
            
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-medium text-blue-700">BENEFITS</p>
                <ul className="mt-1 list-disc list-inside text-sm text-blue-800">
                  {selectedIdea.pros?.map((pro, index) => (
                    <li key={index}>{pro}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <p className="text-xs font-medium text-blue-700">CHALLENGES</p>
                <ul className="mt-1 list-disc list-inside text-sm text-blue-800">
                  {selectedIdea.cons?.map((con, index) => (
                    <li key={index}>{con}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            {selectedIdea.tags && selectedIdea.tags.length > 0 && (
              <div className="mt-3">
                <div className="flex flex-wrap gap-1">
                  {selectedIdea.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-200 text-blue-800 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mb-2">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Implementation Plan</h3>
          <div className="mt-1 p-3 bg-green-50 rounded-md">
            <p className="text-green-800">{implementationPlan}</p>
            
            {implementationSteps && implementationSteps.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-medium text-green-700 mb-2">IMPLEMENTATION STEPS</p>
                <div className="space-y-2">
                  {implementationSteps.map((step, index) => (
                    <div key={index} className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-green-200 text-green-800 flex items-center justify-center text-sm font-medium flex-shrink-0 mr-2">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-green-800">{step.title}</p>
                        <p className="text-sm text-green-700">{step.description}</p>
                        <div className="mt-1 flex items-center text-xs text-green-600">
                          <span className="mr-3">🕒 {step.duration}</span>
                          <span>📋 {step.resources.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Implementation Tip */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Implementation Tip</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>{implementationTip}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Generate Solution Summary Button */}
      <div className="mb-8">
        <button
          onClick={generateSummary}
          disabled={isSummarizing}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow transition flex items-center justify-center"
        >
          {isSummarizing ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating summary...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generate solution summary
            </>
          )}
        </button>
        
        {summary && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <h3 className="font-medium text-gray-800 mb-2">Solution Summary</h3>
            <p className="text-gray-700">{summary}</p>
          </div>
        )}
      </div>
      
      {/* Custom Notes (if any) */}
      {customNotes && customNotes.trim() !== '' && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="font-bold text-gray-700 mb-2">Your Notes</h3>
          <div className="p-3 bg-gray-50 rounded-md">
            <p className="text-gray-700 whitespace-pre-line">{customNotes}</p>
          </div>
        </div>
      )}
      
      {/* AI Buddy Info (if applicable) */}
      {selectedPersonality && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="font-bold text-gray-700 mb-2">AI Personality Used</h3>
          <div className="flex items-center">
            <div className="bg-purple-100 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="font-medium text-gray-800 capitalize">{selectedPersonality} Mode</p>
              <p className="text-sm text-gray-600">
                {selectedPersonality === 'creative' && 'Focused on generating innovative, out-of-the-box ideas'}
                {selectedPersonality === 'analytical' && 'Focused on logical, structured problem-solving approaches'}
                {selectedPersonality === 'optimistic' && 'Emphasized positive aspects and opportunities in solutions'}
                {selectedPersonality === 'critical' && 'Provided thorough examination of potential pitfalls and challenges'}
                {selectedPersonality === 'balanced' && 'Offered well-rounded perspectives on problems and solutions'}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="mb-8 text-center">
        <button
          onClick={onRestart}
          className="py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow transition"
        >
          Start a new brainstorm
        </button>
      </div>
      
      {/* Confetti CSS */}
      <style>
        {`
        .confetti-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1000;
        }
        
        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          opacity: 0.7;
          top: -10px;
          animation: confetti-fall 5s linear forwards;
        }
        
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        `}
      </style>
    </div>
  );
};

export default CompletionScreen; 