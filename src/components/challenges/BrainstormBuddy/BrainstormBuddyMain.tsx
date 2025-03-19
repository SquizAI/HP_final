import React, { useState, useEffect, useCallback } from 'react';
import ProblemDefinition from './ProblemDefinition';
import IdeaGeneration from './IdeaGeneration';
import ImplementationPlan from './ImplementationPlan';
import CompletionScreen from './CompletionScreen';
import { saveChallengeBrainstorm, useUserProgress, markChallengeAsCompleted } from '../../../utils/userDataManager';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import styles from './BrainstormBuddy.module.css';
import ChallengeHeader from '../../shared/ChallengeHeader';
import { Lightbulb } from 'lucide-react';

// Define the BRAINSTORMING_FACTS array here
const BRAINSTORMING_FACTS = [
  "Brainstorming sessions that start with individual idea generation before group discussion produce 20% more ideas.",
  "The human brain can generate approximately 70,000 thoughts per day.",
  "The term 'brainstorming' was coined in 1953 by advertising executive Alex Osborn.",
  "Studies show that taking a walk can increase creative output by an average of 60%.",
  "The most productive brainstorming sessions last between 15-45 minutes, not hours.",
  "According to NASA, your creative potential is highest within 30 minutes of waking up.",
  "Dimming the lights can help remove inhibitions and improve creative thinking in groups.",
  "The average person has 6 innovative ideas per day, but most are forgotten within minutes.",
  "Blue environments have been shown to enhance creative performance in brainstorming."
];

// Interface for managing the challenge state
export interface BrainstormState {
  problemStatement: string;
  ideaCategory: string;
  ideas: Idea[];
  selectedIdea: Idea | null;
  implementation: string;
  isComplete: boolean;
  aiPersonality: AIPersonality;
  customNotes: string;
  lastUpdated: string;
}

// AI Personality types to make brainstorming more engaging
export type AIPersonality = 'creative' | 'analytical' | 'optimistic' | 'critical' | 'balanced';

// Interface for idea objects
export interface Idea {
  id: string;
  title: string;
  description: string;
  pros: string[];
  cons: string[];
  isSelected: boolean;
  implementation?: string;
  aiRating?: number;
  tags?: string[];
  inspirationSource?: string;
}

// Update the ProblemCategory interface to match what's used in the component
export interface ProblemCategory {
  id: string;
  label: string;
  icon: string;
  description: string;
  examples: string[];
  promptTemplates: string[];
}

// Initial state with empty values
const INITIAL_STATE: BrainstormState = {
  problemStatement: '',
  ideaCategory: '',
  ideas: [],
  selectedIdea: null,
  implementation: '',
  isComplete: false,
  aiPersonality: 'balanced',
  customNotes: '',
  lastUpdated: new Date().toISOString()
};

// Challenge steps
enum STEPS {
  PROBLEM_DEFINITION = 0,
  IDEA_GENERATION = 1,
  IDEA_SELECTION = 2,
  IMPLEMENTATION_PLAN = 3,
  COMPLETION = 4
}

// Update the PROBLEM_CATEGORIES array type annotation
const PROBLEM_CATEGORIES: ProblemCategory[] = [
  {
    id: 'business-growth',
    label: 'Business Growth',
    icon: '📈',
    description: 'Challenges related to scaling your business, entering new markets, or increasing revenue',
    examples: [
      'How can we increase our market share in a saturated industry?',
      'What strategies could help us expand to international markets?',
      'How might we develop new revenue streams for our existing customer base?'
    ],
    promptTemplates: [
      "Our [business type] needs to increase [growth metric] by [target percentage]. How might we achieve this while maintaining [core value]?",
      "We're struggling to expand beyond [current market]. What innovative approaches could help us reach [target market] successfully?"
    ]
  },
  {
    id: 'customer-experience',
    label: 'Customer Experience',
    icon: '🤝',
    description: 'Issues related to improving customer satisfaction, loyalty, and overall experience',
    examples: [
      'How can we reduce customer churn rate?',
      'What can we do to improve our Net Promoter Score?',
      'How might we create a more personalized customer journey?'
    ],
    promptTemplates: [
      "Our customers are experiencing friction when they try to [specific action]. How might we streamline this process?",
      "We've received feedback that our [product/service] feels [negative descriptor]. What solutions could make it more [positive descriptor]?"
    ]
  },
  {
    id: 'innovation',
    label: 'Innovation & Product Development',
    icon: '💡',
    description: 'Challenges around developing new products, features, or business models',
    examples: [
      'How might we incorporate AI into our existing product line?',
      'What new features would add the most value to our core offering?',
      'How can we develop a more sustainable version of our product?'
    ],
    promptTemplates: [
      "Our industry is being disrupted by [new technology/trend]. How might we leverage this to create something innovative?",
      "We need to reinvent our [product/service] to meet changing customer needs around [specific trend]. What approaches should we consider?"
    ]
  },
  {
    id: 'operational-efficiency',
    label: 'Operational Efficiency',
    icon: '⚙️',
    description: 'Problems related to streamlining processes, reducing costs, or improving productivity',
    examples: [
      'How can we reduce our production costs without sacrificing quality?',
      'What processes could be automated to improve efficiency?',
      'How might we optimize our supply chain to reduce delays?'
    ],
    promptTemplates: [
      "Our [specific process] is taking too long and costing us [resource cost]. How might we make it more efficient?",
      "We're experiencing bottlenecks in our [department/process]. What solutions could help us increase throughput by [target percentage]?"
    ]
  },
  {
    id: 'team-collaboration',
    label: 'Team Collaboration',
    icon: '👥',
    description: 'Challenges related to improving teamwork, communication, or company culture',
    examples: [
      'How can we improve communication between remote and in-office teams?',
      'What strategies would help us build a more inclusive workplace?',
      'How might we foster more cross-departmental collaboration?'
    ],
    promptTemplates: [
      "Our [team/department] is struggling with [specific challenge] when trying to collaborate. How might we solve this?",
      "We need to improve [aspect of company culture] while accommodating our [specific work arrangement]. What approaches could work?"
    ]
  },
  {
    id: 'marketing-outreach',
    label: 'Marketing & Outreach',
    icon: '📣',
    description: 'Problems related to reaching new customers, improving brand awareness, or marketing effectiveness',
    examples: [
      'How can we cut through the noise in our highly competitive market?',
      'What channels would be most effective for reaching our target demographic?',
      'How might we create more engaging content for our audience?'
    ],
    promptTemplates: [
      "Our marketing efforts in [channel] aren't resonating with [target audience]. How might we create more compelling messaging?",
      "We need to increase brand awareness among [demographic] without increasing our budget. What creative approaches could work?"
    ]
  },
  {
    id: 'sustainability',
    label: 'Sustainability & Social Impact',
    icon: '🌿',
    description: 'Challenges around environmental sustainability, social responsibility, or ethical business practices',
    examples: [
      'How can we reduce our carbon footprint across operations?',
      'What initiatives would create meaningful social impact aligned with our brand?',
      'How might we redesign our packaging to be more sustainable?'
    ],
    promptTemplates: [
      "We want to reduce [environmental impact] in our [business area] while maintaining [business requirement]. What approaches should we consider?",
      "Our customers increasingly care about [sustainability issue]. How might we address this while still [business objective]?"
    ]
  },
  {
    id: 'custom',
    label: 'Custom Problem',
    icon: '✏️',
    description: 'Define your own unique challenge or problem statement',
    examples: [],
    promptTemplates: []
  }
];

// Enhanced creative techniques for idea generation
const CREATIVITY_TECHNIQUES = [
  {
    id: 'reverse-thinking',
    name: 'Reverse Thinking',
    description: 'Approach the problem from the opposite direction. Instead of asking "How do we solve X?", ask "How could we make X worse?" Then reverse those ideas.',
    example: 'For customer retention, first list ways to lose customers, then reverse each point to find solutions.'
  },
  {
    id: 'analogical-thinking',
    name: 'Analogical Thinking',
    description: 'Borrow solutions from unrelated fields or industries and apply them to your problem.',
    example: 'How might healthcare appointment systems be applied to improve restaurant reservations?'
  },
  {
    id: 'scamper',
    name: 'SCAMPER Method',
    description: 'Systematically modify aspects of your problem using prompts: Substitute, Combine, Adapt, Modify, Put to other use, Eliminate, Reverse.',
    example: 'For a product redesign: What materials could we substitute? What features could we combine?'
  },
  {
    id: 'future-backward',
    name: 'Future Backward',
    description: 'Imagine the perfect solution already exists in the future. Work backward to determine what steps would lead there.',
    example: 'Envision your problem solved perfectly 5 years from now, then map what happened each year to reach that point.'
  },
  {
    id: 'provocation',
    name: 'Provocation Technique',
    description: 'Make deliberately unreasonable or impossible statements about your problem, then explore the consequences.',
    example: 'What if customers paid us to view our advertisements? What insights does this impossible scenario reveal?'
  }
];

// Function to save brainstorming data with enhanced error handling
const saveBrainstormData = (data: BrainstormState): void => {
  try {
    // Update the timestamp before saving
    const updatedData = {
      ...data,
      lastUpdated: new Date().toISOString()
    };
    
    // Call the user data manager to save the data
    saveChallengeBrainstorm(
      'brainstorm-buddy',
      updatedData.problemStatement,
      updatedData.ideaCategory,
      updatedData.selectedIdea ? {
        title: updatedData.selectedIdea.title,
        description: updatedData.selectedIdea.description
      } : { title: '', description: '' },
      updatedData.implementation
    );
    
    // Also save to localStorage as a backup
    localStorage.setItem('brainstorm_backup_data', JSON.stringify(updatedData));
    
    console.log('Brainstorm data saved successfully');
  } catch (error) {
    console.error('Error saving brainstorm data:', error);
    // Attempt recovery from backup if primary save fails
    localStorage.setItem('brainstorm_backup_data', JSON.stringify(data));
  }
};

// Enhanced idea generation with more creative parameters
const generateIdeas = (problem: string, category: string, personality: AIPersonality = 'balanced'): Promise<Idea[]> => {
  return new Promise((resolve) => {
    // Simulating API delay
    setTimeout(() => {
      // Personality adjustments to shape idea generation
      const getPersonalityAdjustment = (personality: AIPersonality) => {
        switch (personality) {
          case 'creative':
            return {
              divergence: 'highly diverse and unconventional ideas',
              tone: 'enthusiastic and imaginative',
              emphasis: 'novel approaches that break conventional thinking'
            };
          case 'analytical':
            return {
              divergence: 'methodical and research-backed ideas',
              tone: 'data-driven and logical',
              emphasis: 'proven frameworks and systematic solutions'
            };
          case 'optimistic':
            return {
              divergence: 'opportunity-focused ideas with high potential',
              tone: 'positive and growth-oriented',
              emphasis: 'possibilities and upside scenarios'
            };
          case 'critical':
            return {
              divergence: 'robust ideas that anticipate challenges',
              tone: 'cautious and thorough',
              emphasis: 'risk mitigation and pragmatic solutions'
            };
          default:
            return {
              divergence: 'balanced mix of creative and practical ideas',
              tone: 'objective and constructive',
              emphasis: 'both innovative and implementable solutions'
            };
        }
      };
      
      const personalityStyle = getPersonalityAdjustment(personality);

      // Generate sample ideas with personality influence
      const dummyIdeas: Idea[] = [
        {
          id: `idea-${Date.now()}-1`,
          title: `Enhanced Digital Integration Solution for ${category}`,
          description: `A comprehensive approach that leverages emerging technologies to address the core issues in "${problem}". This solution utilizes ${personalityStyle.emphasis} to create measurable impact with minimal disruption.`,
          pros: [
            'Leverages existing infrastructure with minimal new investment',
            'Provides immediate value while scaling for future needs',
            'Addresses both short-term and long-term objectives'
          ],
          cons: [
            'Requires initial technical training for team members',
            'May need periodic refinement as requirements evolve',
            'Best results come after 2-3 iteration cycles'
          ],
          isSelected: false,
          aiRating: 87,
          tags: ['technology', 'scalable', 'integration'],
          inspirationSource: 'Similar implementation in adjacent industry'
        },
        {
          id: `idea-${Date.now()}-2`,
          title: `Stakeholder-Centric Redesign Model`,
          description: `A radical reimagining of the approach to "${problem}" that puts key stakeholders at the center of the solution design process. This ${personalityStyle.tone} methodology ensures alignment while driving innovation.`,
          pros: [
            'Creates strong buy-in from all participants',
            'Surfaces hidden requirements early in the process',
            'Results in solutions with higher adoption rates'
          ],
          cons: [
            'Requires more initial coordination',
            'Process may take longer in the planning phase',
            'Needs skilled facilitation for best results'
          ],
          isSelected: false,
          aiRating: 91,
          tags: ['collaborative', 'human-centered', 'stakeholder'],
          inspirationSource: 'Design thinking framework with enhancements'
        },
        {
          id: `idea-${Date.now()}-3`,
          title: `Phased Implementation Framework`,
          description: `A structured, incremental approach to solving "${problem}" through clearly defined phases with measurable milestones. This ${personalityStyle.divergence} ensures controlled progress with opportunities for adjustment.`,
          pros: [
            'Reduces risk through smaller, manageable components',
            'Provides early wins and momentum',
            'Allows for course correction between phases'
          ],
          cons: [
            'Requires detailed planning upfront',
            'May extend overall timeline compared to all-at-once approaches',
            'Needs clear handoffs between phases'
          ],
          isSelected: false,
          aiRating: 84,
          tags: ['structured', 'milestone-based', 'phased'],
          inspirationSource: 'Agile methodology adapted to this context'
        },
        {
          id: `idea-${Date.now()}-4`,
          title: `Cross-Functional Innovation Team`,
          description: `Establish a dedicated team with diverse expertise specifically focused on solving "${problem}". This approach brings ${personalityStyle.emphasis} through interdisciplinary collaboration.`,
          pros: [
            'Brings diverse perspectives to complex challenges',
            'Creates ownership of the solution across departments',
            'Develops organizational capabilities for future challenges'
          ],
          cons: [
            'Requires resource allocation from multiple departments',
            'Needs clear leadership and direction',
            'May face initial alignment challenges'
          ],
          isSelected: false,
          aiRating: 89,
          tags: ['team-based', 'collaborative', 'interdisciplinary'],
          inspirationSource: 'Successful innovation labs in leading organizations'
        },
        {
          id: `idea-${Date.now()}-5`,
          title: `Adaptive Community Engagement Platform`,
          description: `A dynamic system that continuously gathers and responds to input related to "${problem}". This ${personalityStyle.tone} solution ensures relevance through ongoing adaptation.`,
          pros: [
            'Creates continuous improvement feedback loop',
            'Builds stronger relationships with key stakeholders',
            'Identifies emerging issues before they become problems'
          ],
          cons: [
            'Requires consistent attention and management',
            'Needs clear processes for incorporating feedback',
            'Benefits may take time to fully realize'
          ],
          isSelected: false,
          aiRating: 82,
          tags: ['engagement', 'feedback-driven', 'adaptive'],
          inspirationSource: 'Community-based innovation platforms'
        }
      ];
      
      resolve(dummyIdeas);
    }, 2000);
  });
};

// Enhanced implementation plan generation
const generateImplementation = (idea: Idea, problem: string, personality: AIPersonality = 'balanced'): Promise<string> => {
  return new Promise((resolve) => {
    // Simulating API delay
    setTimeout(() => {
      // Personality adjustments for implementation plans
      const getToneByPersonality = (personality: AIPersonality) => {
        switch (personality) {
          case 'creative':
            return 'innovative and forward-thinking';
          case 'analytical':
            return 'methodical and evidence-based';
          case 'optimistic':
            return 'opportunity-focused and growth-oriented';
          case 'critical':
            return 'thorough and risk-aware';
          default:
            return 'balanced and practical';
        }
      };
      
      const tone = getToneByPersonality(personality);
      
      // Create implementation plan based on idea and problem
      const implementation = `
# Implementation Plan: ${idea.title}

## Executive Summary
This ${tone} implementation plan addresses "${problem}" through a structured approach based on "${idea.description}". 

## Phase 1: Foundation (Weeks 1-4)
- **Week 1-2:** Conduct stakeholder analysis and form a cross-functional implementation team
- **Week 3:** Develop detailed requirements and success metrics
- **Week 4:** Create resource allocation plan and secure necessary approvals

## Phase 2: Development (Weeks 5-12)
- **Weeks 5-6:** Design detailed solution architecture
- **Weeks 7-9:** Develop core components through iterative sprints
- **Weeks 10-12:** Integrate components and conduct initial testing

## Phase 3: Implementation (Weeks 13-16)
- **Week 13:** Conduct user training and prepare support materials
- **Week 14:** Implement pilot with selected users/departments
- **Weeks 15-16:** Gather feedback and make necessary adjustments

## Phase 4: Scaling & Optimization (Weeks 17-24)
- **Weeks 17-18:** Roll out to all users/departments
- **Weeks 19-20:** Monitor performance and address emerging issues
- **Weeks 21-24:** Optimize based on usage data and stakeholder feedback

## Resource Requirements
- **Team:** Project manager, subject matter experts from key departments, technical implementation specialists
- **Budget:** Estimated $XX,XXX (detailed breakdown available in appendix)
- **Tools:** Project management software, collaboration platform, specialized tools for implementation

## Risk Management
| Risk | Impact | Probability | Mitigation Strategy |
|------|--------|------------|---------------------|
| Stakeholder resistance | High | Medium | Early involvement, clear communication of benefits |
| Resource constraints | Medium | Medium | Phased implementation, prioritization of components |
| Technical challenges | Medium | Low | Proof of concept testing, expert consultation |

## Success Metrics
- **Short-term:** Successful completion of all phases within timeline
- **Medium-term:** [Specific metrics related to problem]
- **Long-term:** [Broader organizational benefits]

## Conclusion
This implementation plan provides a structured, ${tone} approach to addressing "${problem}" that balances thoroughness with practicality. The phased approach allows for adjustments as necessary while maintaining momentum toward the solution.
`;
      
      resolve(implementation);
    }, 2000);
  });
};

const BrainstormBuddyMain: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<STEPS>(STEPS.PROBLEM_DEFINITION);
  const [state, setState] = useState<BrainstormState>(INITIAL_STATE);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [funFact, setFunFact] = useState<string>('');
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  
  // For challenge completion
  const [userProgress, setUserProgress] = useUserProgress();
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  
  // Check if challenge is already completed
  useEffect(() => {
    if (userProgress.completedChallenges.includes('challenge-5')) {
      setIsCompleted(true);
    }
  }, [userProgress]);
  
  // Enhanced brainstorming facts
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * BRAINSTORMING_FACTS.length);
    setFunFact(BRAINSTORMING_FACTS[randomIndex]);
  }, []);
  
  // Check for saved work
  useEffect(() => {
    const userProgress = JSON.parse(localStorage.getItem('ai_hub_user_progress') || '{}');
    const savedState = userProgress?.challengeData?.['challenge-5']?.brainstorm;
    
    if (savedState) {
      setState(prevState => ({
        ...prevState,
        ...savedState
      }));
      
      // If there's a selected idea and implementation, move to the appropriate step
      if (savedState.implementation) {
        setCurrentStep(STEPS.IMPLEMENTATION_PLAN);
      } else if (savedState.selectedIdea) {
        setCurrentStep(STEPS.IDEA_SELECTION);
      } else if (savedState.ideas && savedState.ideas.length > 0) {
        setCurrentStep(STEPS.IDEA_GENERATION);
      } else if (savedState.problemStatement) {
        setCurrentStep(STEPS.PROBLEM_DEFINITION);
      }
    }
  }, []);
  
  // Update the state
  const updateState = (updates: Partial<BrainstormState>) => {
    setState(prev => {
      const newState = {
        ...prev,
        ...updates,
        lastUpdated: new Date().toISOString()
      };
      
      // Save to user progress
      saveChallengeBrainstorm('challenge-5', newState);
      
      return newState;
    });
  };
  
  // Handle problem change
  const handleProblemChange = (problemStatement: string, category: string) => {
    updateState({
      problemStatement,
      ideaCategory: category
    });
  };
  
  // Set the selected idea
  const handleIdeaSelection = (idea: Idea) => {
    updateState({
      selectedIdea: idea
    });
  };
  
  // Set the AI personality
  const handlePersonalityChange = (personality: AIPersonality) => {
    updateState({
      aiPersonality: personality
    });
  };
  
  // Add a new idea
  const handleAddIdea = (idea: Idea) => {
    updateState({
      ideas: [...state.ideas, idea]
    });
  };
  
  // Set the implementation plan
  const handleImplementationChange = (implementation: string) => {
    updateState({
      implementation
    });
  };
  
  // Update custom notes
  const handleNotesChange = (notes: string) => {
    updateState({
      customNotes: notes
    });
  };
  
  // Move to the next step
  const handleNext = () => {
    if (currentStep < STEPS.COMPLETION) {
      setCurrentStep(currentStep + 1 as STEPS);
    }
  };
  
  // Go back a step
  const handleBack = () => {
    if (currentStep > STEPS.PROBLEM_DEFINITION) {
      setCurrentStep(currentStep - 1 as STEPS);
    }
  };
  
  // Navigate directly to a specific step
  const goToStep = (step: STEPS) => {
    setCurrentStep(step);
  };
  
  // Restart the challenge
  const handleRestart = () => {
    setState(INITIAL_STATE);
    setCurrentStep(STEPS.PROBLEM_DEFINITION);
  };

  return (
    <div className="container mx-auto max-w-5xl">
      <ChallengeHeader
        title="BrainstormBuddy Challenge"
        icon={<Lightbulb className="h-6 w-6 text-yellow-500" />}
        challengeId="challenge-5"
        isCompleted={isCompleted}
        setIsCompleted={setIsCompleted}
        showConfetti={showConfetti}
        setShowConfetti={setShowConfetti}
        onCompleteChallenge={handleCompleteChallenge}
      />
      
      {/* Main content */}
      <div className="p-4">
        {currentStep === STEPS.PROBLEM_DEFINITION && (
          <ProblemDefinition
            state={state}
            problemCategories={PROBLEM_CATEGORIES}
            onProblemChange={handleProblemChange}
            onNext={handleNext}
          />
        )}
        
        {currentStep === STEPS.IDEA_GENERATION && (
          <IdeaGeneration
            state={state}
            onAddIdea={handleAddIdea}
            onNext={handleNext}
            onBack={handleBack}
            onPersonalityChange={handlePersonalityChange}
          />
        )}
        
        {currentStep === STEPS.IDEA_SELECTION && (
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Select Your Best Idea</h2>
            <p className="mb-4 text-gray-600">
              Review the ideas you've generated and select the one you'd like to develop further.
            </p>
            
            <div className="space-y-3 mb-6">
              {state.ideas.map((idea, index) => (
                <div
                  key={index}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    state.selectedIdea === idea
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => handleIdeaSelection(idea)}
                >
                  {idea.title}
                </div>
              ))}
            </div>
            
            <div className="flex justify-between mt-8">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={handleBack}
              >
                Back
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                onClick={handleNext}
                disabled={!state.selectedIdea}
              >
                Continue
              </button>
            </div>
          </div>
        )}
        
        {currentStep === STEPS.IMPLEMENTATION_PLAN && (
          <ImplementationPlan
            state={state}
            onImplementationChange={handleImplementationChange}
            onNext={handleCompleteChallenge}
            onBack={handleBack}
          />
        )}
        
        {currentStep === STEPS.COMPLETION && (
          <CompletionScreen
            problemStatement={state.problemStatement}
            selectedIdea={state.selectedIdea}
            implementationPlan={state.implementation}
            onComplete={handleCompleteChallenge}
            onBack={handleBack}
            onUpdateNotes={handleNotesChange}
          />
        )}
      </div>
    </div>
  );
};

export default BrainstormBuddyMain; 