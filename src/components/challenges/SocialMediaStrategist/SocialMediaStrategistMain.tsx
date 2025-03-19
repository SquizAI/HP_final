import React, { useState, useEffect } from 'react';
import BrandProfiling from './BrandProfiling';
import AudienceResearch from './AudienceResearch';
import PlatformSelection from './PlatformSelection';
import { saveChallengeSocialMedia, useUserProgress, markChallengeAsCompleted } from '../../../utils/userDataManager';
import ChallengeHeader from '../../shared/ChallengeHeader';
import { Share2 } from 'lucide-react';
import Confetti from '../../shared/Confetti';

// Interfaces for state management
export interface SocialMediaStrategy {
  brandName: string;
  industry: string;
  description: string;
  brandPersonality: string;
  brandPersonalityTraits: string[];
  goals: string[];
  targetAudience: string[];
  audienceInsights: AudienceInsight[];
  selectedPlatforms: string[];
  platformPriorities: {[key: string]: number};
  contentCalendar: ContentItem[];
  currentStep: number;
  isComplete: boolean;
}

export interface PlatformStrategy {
  platform: string;
  audience: string;
  contentTypes: string[];
  postFrequency: string;
  bestTimes: string[];
  goals: string[];
}

export interface ContentCalendarItem {
  id: string;
  title: string;
  description: string;
  platform: string;
  contentType: string;
  scheduledDate?: string;
  status: 'draft' | 'scheduled' | 'published';
  hashtags: string[];
  mediaType: 'image' | 'video' | 'carousel' | 'text' | 'link';
}

export interface AudienceInsight {
  segment: string;
  demographics: string;
  interests: string[];
  painPoints: string[];
  platforms: string[];
}

export interface ContentItem {
  platform: string;
  contentType: string;
  topic: string;
  timing: string;
  description: string;
}

// Initial state for the Social Media Strategy
const INITIAL_STATE: SocialMediaStrategy = {
  brandName: '',
  industry: '',
  description: '',
  brandPersonality: '',
  brandPersonalityTraits: [],
  goals: [],
  targetAudience: [],
  audienceInsights: [],
  selectedPlatforms: [],
  platformPriorities: {},
  contentCalendar: [],
  currentStep: 0,
  isComplete: false
};


// Fun facts about social media marketing
const SOCIAL_MEDIA_FACTS = [
  "92% of marketers say social media is important to their business",
  "Social media usage has increased by 13.2% since 2020",
  "The average person spends 2 hours and 27 minutes on social media daily",
  "LinkedIn generates 277% more leads than Facebook and Twitter",
  "Instagram users spend an average of 30 minutes per day on the platform",
  "90% of Instagram users follow at least one business account",
  "TikTok was the most downloaded app in 2020 with 850 million installations",
  "Pinterest drives 33% more traffic to shopping sites than Facebook"
];

const SocialMediaStrategistMain: React.FC = () => {
  const [strategy, setStrategy] = useState<SocialMediaStrategy>(INITIAL_STATE);
  const [randomFact, setRandomFact] = useState<string>(() => {
    const randomIndex = Math.floor(Math.random() * SOCIAL_MEDIA_FACTS.length);
    return SOCIAL_MEDIA_FACTS[randomIndex];
  });
  
  // Add state for challenge completion and confetti
  const [userProgress, setUserProgress] = useUserProgress();
  const [isCompleted, setIsCompleted] = useState<boolean>(
    userProgress.completedChallenges.includes('challenge-12')
  );
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  
  // Check if challenge is already completed on mount
  useEffect(() => {
    if (userProgress.completedChallenges.includes('challenge-12')) {
      setIsCompleted(true);
    }
    
    // Add keyframe animation for button glow effect
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes pulse-shadow-purple {
        0%, 100% { box-shadow: 0 0 0 0 rgba(126, 34, 206, 0.4); }
        50% { box-shadow: 0 0 0 15px rgba(126, 34, 206, 0); }
      }
      
      @keyframes gentle-float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-6px); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, [userProgress]);
  
  // Update strategy state with new values
  const updateStrategy = (newValues: Partial<SocialMediaStrategy>) => {
    const updatedStrategy = { ...strategy, ...newValues };
    setStrategy(updatedStrategy);
    saveChallengeSocialMedia(updatedStrategy);
  };
  
  // Navigate to the next step
  const handleNext = () => {
    // Simplified to only go up to step 3 (which is now the completion screen)
    if (strategy.currentStep < 3) {
      updateStrategy({ 
        currentStep: strategy.currentStep + 1 
      });
      
      // Show a new random fact
      const randomIndex = Math.floor(Math.random() * SOCIAL_MEDIA_FACTS.length);
      setRandomFact(SOCIAL_MEDIA_FACTS[randomIndex]);
    }
  };
  
  // Navigate to the previous step
  const handleBack = () => {
    if (strategy.currentStep > 0) {
      updateStrategy({ 
        currentStep: strategy.currentStep - 1 
      });
    }
  };
  
  // Restart the challenge
  const handleRestart = () => {
    setStrategy(INITIAL_STATE);
    setIsCompleted(false);
    
    // Show a new random fact
    const randomIndex = Math.floor(Math.random() * SOCIAL_MEDIA_FACTS.length);
    setRandomFact(SOCIAL_MEDIA_FACTS[randomIndex]);
  };
  
  // Handle completing the challenge - simplified to complete after platform selection
  const handleCompleteChallenge = () => {
    // Make sure brand name is filled out and at least one platform is selected
    if (!strategy.brandName || strategy.selectedPlatforms.length < 1) {
      alert('Please complete your brand profile and select at least one social media platform before completing the challenge.');
      return;
    }
    
    // Mark challenge as completed
    markChallengeAsCompleted('challenge-12');
    setIsCompleted(true);
    
    // Set strategy as complete and update in state
    updateStrategy({ 
      isComplete: true,
      currentStep: 3  // Keep the user on the platform selection step
    });
    
    // Show confetti
    setShowConfetti(true);
    
    // Hide confetti after 5 seconds
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
    
    // Show completion confirmation
    alert('Challenge Completed! You have successfully created an AI-powered social media strategy.');
  };
  

  
  // Render the current step component - simplified steps
  const renderCurrentStep = () => {
    switch (strategy.currentStep) {
      case 0:
        return (
          <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Brand Profile</h2>
            <BrandProfiling 
              state={strategy} 
              updateState={updateStrategy} 
              onNext={handleNext} 
            />
          </div>
        );
      case 1:
        return (
          <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Target Audience</h2>
            <AudienceResearch 
              state={strategy} 
              updateState={updateStrategy} 
              onNext={handleNext} 
              onBack={handleBack} 
            />
          </div>
        );
      case 2:
        return (
          <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">AI Analysis</h2>
            <div className="mb-6">
              <p className="text-gray-700">AI will analyze your brand profile and target audience to recommend the most effective platforms for your campaign.</p>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleBack}
                className="px-5 py-2 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="px-5 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                View Recommendations
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Platform Selection</h2>
            <div className="mb-4">
              <p className="text-gray-700">Select the platforms for your social media campaign based on AI recommendations.</p>
            </div>
            <PlatformSelection 
              state={strategy} 
              updateState={updateStrategy} 
              onNext={handleCompleteChallenge} 
              onBack={handleBack} 
            />
          </div>
        );
      default:
        return <div>Unknown step</div>;
    }
  };
  
  return (
    <div className="max-w-5xl mx-auto p-4 bg-gray-50 min-h-screen">
      {/* Show confetti animation when challenge is completed */}
      {showConfetti && <Confetti active={showConfetti} />}
      
      <ChallengeHeader
        title="Social Campaign Builder"
        icon={<Share2 className="h-6 w-6 text-purple-600" />}
        challengeId="challenge-12"
        isCompleted={isCompleted}
        setIsCompleted={setIsCompleted}
        showConfetti={showConfetti}
        setShowConfetti={setShowConfetti}
        onCompleteChallenge={handleCompleteChallenge}
      />
      
      <div className="flex mb-10">
        <div className="w-3/4 pr-8">
          {/* How AI Works for You section - simplified */}
          <div className="mb-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-3 text-gray-800">About This Challenge</h2>
            <p className="text-gray-700 mb-3 leading-relaxed">
              Create an AI-driven social media strategy for your brand in just 4 steps. Define your brand, analyze your audience, 
              and choose the most effective platforms for your campaign.  
            </p>
          </div>
          
          {/* Challenge progress - only shown when in progress */}
          {strategy.currentStep > 0 && (
            <div className="mb-6 flex bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              {[1, 2, 3, 4].map((step) => (
                <div 
                  key={step} 
                  className={`flex-1 p-3 ${strategy.currentStep >= step - 1 ? 'bg-purple-50' : 'bg-gray-50'} 
                  ${strategy.currentStep === step - 1 ? 'border-b-2 border-purple-600' : ''}`}
                >
                  <div className="flex items-center justify-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 
                      ${strategy.currentStep >= step - 1 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                      {step}
                    </div>
                    <span className={`text-sm ${strategy.currentStep >= step - 1 ? 'text-gray-800' : 'text-gray-500'}`}>
                      {step === 1 ? 'Brand Profile' : 
                       step === 2 ? 'Audience' : 
                       step === 3 ? 'AI Analysis' : 'Platform Selection'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Completed challenge panel */}
        {isCompleted && (
          <div className="w-1/4 bg-green-50 p-6 rounded-lg shadow-sm border border-green-100 self-start">
            <h3 className="text-lg font-semibold mb-2 text-green-800">Challenge Complete!</h3>
            <p className="text-sm text-gray-700 mb-4">You've successfully created a social media strategy.</p>
            <button
              onClick={handleRestart}
              className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Start Over
            </button>
          </div>
        )}
      </div>
      
      {/* Confetti for challenge completion */}
      {showConfetti && <Confetti active={showConfetti} />}
      
      {/* Restart button for completed challenge */}
      {isCompleted && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleRestart}
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Start Over
          </button>
        </div>
      )}
      
      {/* Challenge Steps Quick View */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Challenge Steps Quick View</h2>
        <p className="text-gray-700 mb-4">There are 5 steps required to complete the Challenge.</p>
        
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li className="font-medium">Step 1: Define Your Brand Basics, Choose Your Brand Personality & Define Your Social Media Goals then Continue to Audience Research. AI will begin putting your plan together.</li>
          <li className="font-medium">Step 2: Select Your Target Audience. Then click Get AI Audience Analysis button to review the audience details.</li>
          <li className="font-medium">Step 3: Click Continue Platform Selection to see what AI recommends.</li>
          <li className="font-medium">Step 4: Review the AI-recommended platforms based on your brand input. Select the Social Media Platforms you would like to include in your campaign. Don't forget to Prioritize them as well. After your socials are selected, click Continue to Content Planning.</li>
          <li className="font-medium">Step 5: Challenge Completed!</li>
        </ul>
      </div>
      
      {/* Start Button - Only show when not in progress and not completed */}
      {!isCompleted && strategy.currentStep === 0 && (
        <button 
          onClick={() => updateStrategy({ currentStep: 0 })}
          className="w-full md:w-auto px-10 py-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all font-bold text-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 active:translate-y-0 mx-auto block"
          style={{
            animation: 'pulse-shadow-purple 2s infinite, gentle-float 4s ease-in-out infinite',
          }}
        >
          <span className="flex items-center justify-center">
            <span className="mr-2">✨</span> Let's Begin! <span className="ml-2">✨</span>
          </span>
        </button>
      )}
      
      <div className="bg-white shadow-md rounded-lg p-6">
        {renderCurrentStep()}
      </div>
    </div>
  );
};

export default SocialMediaStrategistMain; 