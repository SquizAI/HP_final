import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUserProgress } from '../../utils/userDataManager';
import {
  // Basic action icons
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  Check, 
  Clock,
  Award,
  
  // Media and modality icons
  Mic, 
  Image, 
  MessageSquare, 
  Layers,
  Video,
  
  // Business and strategy icons
  Lightbulb, 
  User, 
  FileText, 
  Globe, 
  Bot, 
  ThumbsUp, 
  Smartphone, 
  ShieldCheck, 
  Presentation, 
  Sparkles, 
  BarChart2, 
  Users
} from 'lucide-react';

// Custom CSS for hiding scrollbars but allowing scrolling
const scrollStyles = `
  .hide-scrollbar {
    -ms-overflow-style: none;  /* Internet Explorer and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  
  .hide-scrollbar::-webkit-scrollbar {
    display: none;  /* Chrome, Safari, Opera */
  }

  /* Mobile optimizations */
  @media (max-width: 640px) {
    .modality-pill {
      padding-left: 0.5rem;
      padding-right: 0.5rem;
      font-size: 0.65rem;
    }
    
    .skill-level-pill {
      font-size: 0.65rem;
      padding: 0.15rem 0.5rem;
    }
    
    .filter-pill {
      padding-left: 0.5rem;
      padding-right: 0.5rem;
      font-size: 0.7rem;
    }
  }
  
  @keyframes animate-text {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  @keyframes gradient-x {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  .animate-text {
    background-size: 200% auto;
    animation: animate-text 4s linear infinite;
  }
  
  .animate-gradient-x {
    background-size: 200% 100%;
    animation: gradient-x 15s ease infinite;
  }
  
  /* Icon color animation */
  @keyframes color-pulse {
    0% { color: currentColor; }
    50% { color: var(--highlight-color); }
    100% { color: currentColor; }
  }
  
  .icon-animate:hover svg {
    animation: color-pulse 1.5s ease infinite;
  }
`;

// Define modality types and their colors with professional icons
const modalityTypes = {
  voice: { name: 'Voice/Audio', color: '#2E7D32', bgColor: '#e8f5e9', icon: <Mic className="h-6 w-6" style={{ color: '#2E7D32' }} /> },
  visual: { name: 'Visual/Image', color: '#673AB7', bgColor: '#f3e5f5', icon: <Image className="h-6 w-6" style={{ color: '#673AB7' }} /> },
  business: { name: 'Business/Strategy', color: '#0097A7', bgColor: '#e0f7fa', icon: <Lightbulb className="h-6 w-6" style={{ color: '#0097A7' }} /> },
  biometrics: { name: 'Biometrics', color: '#607D8B', bgColor: '#eceff1', icon: <User className="h-6 w-6" style={{ color: '#607D8B' }} /> },
  text: { name: 'Text/Image', color: '#00796B', bgColor: '#e0f2f1', icon: <FileText className="h-6 w-6" style={{ color: '#00796B' }} /> },
  language: { name: 'Language/Translation', color: '#3F51B5', bgColor: '#e8eaf6', icon: <Globe className="h-6 w-6" style={{ color: '#3F51B5' }} /> },
  model: { name: 'Model Comparison', color: '#0097A7', bgColor: '#e0f7fa', icon: <Bot className="h-6 w-6" style={{ color: '#0097A7' }} /> },
  sentiment: { name: 'Sentiment/Analysis', color: '#4CAF50', bgColor: '#e8f5e9', icon: <ThumbsUp className="h-6 w-6" style={{ color: '#4CAF50' }} /> },
  marketing: { name: 'Marketing/Strategy', color: '#E91E63', bgColor: '#fce4ec', icon: <Smartphone className="h-6 w-6" style={{ color: '#E91E63' }} /> },
  security: { name: 'Security/Privacy', color: '#E91E63', bgColor: '#fce4ec', icon: <ShieldCheck className="h-6 w-6" style={{ color: '#E91E63' }} /> },
  presentation: { name: 'Presentation/Content', color: '#5CB2CC', bgColor: '#e1f5fe', icon: <Presentation className="h-6 w-6" style={{ color: '#5CB2CC' }} /> },
  generation: { name: 'Visual/Generation', color: '#8E44AD', bgColor: '#f3e5f5', icon: <Sparkles className="h-6 w-6" style={{ color: '#8E44AD' }} /> },
  analytics: { name: 'Analytics/Insights', color: '#6200EA', bgColor: '#ede7f6', icon: <BarChart2 className="h-6 w-6" style={{ color: '#6200EA' }} /> },
  agent: { name: 'Multi-Agent Systems', color: '#6366F1', bgColor: '#e8eaf6', icon: <Users className="h-6 w-6" style={{ color: '#6366F1' }} /> },
  // Additional modality types used in HP challenges
  mixed: { name: 'Mixed/Multi-modal', color: '#0096D6', bgColor: '#e1f5fe', icon: <Layers className="h-6 w-6" style={{ color: '#0096D6' }} /> },
  chatbot: { name: 'Chatbot/Conversation', color: '#FF5722', bgColor: '#fbe9e7', icon: <MessageSquare className="h-6 w-6" style={{ color: '#FF5722' }} /> }
};

// Define skill levels with professional icons
const skillLevels = {
  beginner: { name: 'Beginner', color: '#4CAF50', timeEstimate: '1-3 min', icon: <CheckCircle className="h-3.5 w-3.5" /> },
  intermediate: { name: 'Intermediate', color: '#3F51B5', timeEstimate: '2-4 min', icon: <Award className="h-3.5 w-3.5" /> },
  advanced: { name: 'Advanced', color: '#6200EA', timeEstimate: '4-6 min', icon: <Sparkles className="h-3.5 w-3.5" /> },
  'hp-partner': { name: 'HP Partner', color: '#0096D6', timeEstimate: '3-5 min', icon: <Award className="h-3.5 w-3.5" /> }
};

// Component definition
interface Challenge {
  id: string;
  title: string;
  description: string;
  skillLevel: string;
  icon: string;
  modality: string;
  path: string;
  implementationStatus: string;
  badge?: string;
  partner?: string;
}

const ChallengeHubNew: React.FC = () => {
  // Define interfaces for better type safety
  interface CompletionMessage {
    challengeId: string;
    message: string;
    isCompleted: boolean;
  }

  // User progress state
  const [userProgress, setUserProgress] = useUserProgress();
  const [completionMessage, setCompletionMessage] = useState<CompletionMessage | null>(null);
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  // Standard challenges with new ordering and numbering
  const challenges = [
    {
      id: 'challenge-1',
      title: 'AI Dictation Wizard',
      description: "Transform speech to text, translate to any language, and convert back to voice—all with powerful AI.",
      skillLevel: 'beginner',
      icon: '🎙️',
      modality: 'voice',
      path: '/challenge/dictation-wizard',
      implementationStatus: 'complete'
    },
    {
      id: 'challenge-2',
      title: 'AI Image Classifier',
      description: "Instantly classify images, detect objects, and extract visual insights using AI vision technologies.",
      skillLevel: 'beginner',
      icon: '📸',
      modality: 'visual',
      path: '/challenge/image-classifier',
      implementationStatus: 'complete'
    },
    {
      id: 'challenge-3',
      title: 'Facial Recognition System',
      description: "Experience facial biometric authentication and learn how facial recognition technology works.",
      skillLevel: 'beginner',
      icon: '👤',
      modality: 'biometrics',
      path: '/challenge/face-id-manager',
      implementationStatus: 'complete'
    },
    {
      id: 'challenge-4',
      title: 'AI OCR Assistant',
      description: "Convert printed or handwritten text from images into editable digital text.",
      skillLevel: 'beginner',
      icon: '📝',
      modality: 'text',
      path: '/challenge/ocr-assistant',
      implementationStatus: 'complete'
    },
    {
      id: 'challenge-5',
      title: 'Creative Vision AI',
      description: "Transform your ideas into stunning visuals with AI-powered text-to-image generation.",
      skillLevel: 'beginner',
      icon: '🎨',
      modality: 'visual',
      path: '/challenge/creative-vision',
      implementationStatus: 'complete'
    },
    {
      id: 'challenge-6',
      title: 'AI Privacy Guardian',
      description: "Protect privacy by automatically detecting and blurring faces in images with intelligent face recognition.",
      skillLevel: 'beginner',
      icon: '🔒',
      modality: 'security',
      path: '/challenge/privacy-guardian',
      implementationStatus: 'complete'
    },
    {
      id: 'challenge-7',
      title: 'AI Voice Generator Pro',
      description: "Create professional voiceovers, consistent brand voices, and accessibility features through AI-powered text-to-speech.",
      skillLevel: 'intermediate',
      icon: '🔊',
      modality: 'voice',
      path: '/challenge/voice-generator',
      implementationStatus: 'complete'
    },
    {
      id: 'challenge-8',
      title: 'AI Global Communicator',
      description: "Break language barriers and navigate cross-cultural communication with AI that understands cultural nuances.",
      skillLevel: 'intermediate',
      icon: '🌐',
      modality: 'language',
      path: '/challenge/global-communicator',
      implementationStatus: 'complete'
    },
    {
      id: 'challenge-9',
      title: 'AI Object Detection',
      description: "Detect and locate multiple objects in images with bounding boxes and confidence scores.",
      skillLevel: 'intermediate',
      icon: '🔍',
      modality: 'visual',
      path: '/challenge/object-detection',
      implementationStatus: 'complete'
    },
    {
      id: 'challenge-10',
      title: 'AI Emotional Insight',
      description: "Analyze emotions in content and learn how emotion recognition can transform business interactions.",
      skillLevel: 'intermediate',
      icon: '😊',
      modality: 'sentiment',
      path: '/challenge/emotional-insight',
      implementationStatus: 'complete'
    },
    {
      id: 'challenge-11',
      title: 'AI Smart Select',
      description: "Compare AI models to determine the optimal choice for different business scenarios based on response quality and cost.",
      skillLevel: 'intermediate',
      icon: '🤖',
      modality: 'model',
      path: '/challenge/smartselect',
      implementationStatus: 'complete'
    },
    {
      id: 'challenge-12',
      title: 'AI Social Media Strategist',
      description: "Build a comprehensive social media strategy with AI assistance that would make marketing agencies jealous.",
      skillLevel: 'intermediate',
      icon: '📱',
      modality: 'marketing',
      path: '/challenge/social-media-strategist',
      implementationStatus: 'complete'
    },
    {
      id: 'challenge-13',
      title: 'AI Biz Strategist',
      description: "Leverage AI to develop comprehensive business strategies and competitive analyses.",
      skillLevel: 'advanced',
      icon: '💼',
      modality: 'business',
      path: '/challenge/bizstrategist',
      implementationStatus: 'complete'
    },
    {
      id: 'challenge-14',
      title: 'Agent Magic',
      description: "Create powerful AI agents that can automate complex tasks and workflows.",
      skillLevel: 'advanced',
      icon: '✨',
      modality: 'agent',
      path: '/challenge/agent-magic',
      implementationStatus: 'complete'
    },
    {
      id: 'challenge-15',
      title: 'AI Data Analyst',
      description: "Unlock insights with AI-powered analytics that transform raw data into actionable intelligence.",
      skillLevel: 'advanced',
      icon: '📊',
      modality: 'analytics',
      path: '/challenge/dataanalyst',
      implementationStatus: 'complete'
    },

  ];
  
  // HP partner challenges
  const hpChallenges = [
    {
      id: 'hp-challenge-1',
      title: 'HP PowerBI Integrator',
      description: 'Learn how to integrate AI solutions with HP PowerBI for enhanced business intelligence.',
      skillLevel: 'hp-partner',
      icon: '📊',
      modality: 'analytics',
      path: '/challenge/hp-powerbi',
      badge: 'HP Partner',
      partner: 'HP',
      implementationStatus: 'complete'
    },
    {
      id: 'hp-challenge-2',
      title: 'HP AI Companion',
      description: 'Design a personalized AI assistant specifically for HP device users.',
      skillLevel: 'hp-partner',
      icon: '🤖',
      modality: 'agent',
      path: '/challenge/hp-companion',
      badge: 'HP Expert',
      partner: 'HP',
      implementationStatus: 'complete'
    },
    {
      id: 'hp-challenge-3',
      title: 'HP Amuze',
      description: 'Create engaging multimedia experiences powered by HP and AI technologies.',
      skillLevel: 'hp-partner',
      icon: '🎭',
      modality: 'presentation',
      path: '/challenge/hp-amuze',
      badge: 'HP Expert',
      partner: 'HP',
      implementationStatus: 'complete'
    }
  ];

  // Function to check if a challenge is completed
  const isCompleted = (challengeId: string): boolean => {
    return userProgress?.completedChallenges?.includes(challengeId) || false;
  };

  // Function to check if a challenge is implemented
  const isImplemented = (challengeId: string): boolean => {
    return [
      // Regular challenges
      'challenge-1', 'challenge-2', 'challenge-3', 'challenge-4', 'challenge-5',
      'challenge-6', 'challenge-7', 'challenge-8', 'challenge-9', 'challenge-10',
      'challenge-11', 'challenge-12', 'challenge-13', 'challenge-14', 'challenge-15',
      'challenge-16',
      // Alternative IDs for specific challenges
      'challenge-ocr', 'challenge-creative-vision', 'challenge-object-detection',
      'challenge-privacy-guardian',
      // HP challenges
      'hp-challenge-1', 'hp-challenge-2', 'hp-challenge-3'
    ].includes(challengeId);
  };

  // Handler for marking challenge as complete
  const handleMarkAsCompleted = (challengeId: string, challengeTitle: string): void => {
    if (userProgress) {
      const updatedChallenges = [...(userProgress.completedChallenges || []), challengeId];
      setUserProgress({ ...userProgress, completedChallenges: updatedChallenges });
      setCompletionMessage({
        challengeId, 
        message: `Marked "${challengeTitle}" as completed!`, 
        isCompleted: true
      });
      // Clear message after 3 seconds
      setTimeout(() => setCompletionMessage(null), 3000);
    }
  };

  // Handler for unmarking challenge as complete
  const handleUncheckChallenge = (challengeId: string, challengeTitle: string): void => {
    if (userProgress) {
      const updatedChallenges = (userProgress.completedChallenges || []).filter((id: string) => id !== challengeId);
      setUserProgress({ ...userProgress, completedChallenges: updatedChallenges });
      setCompletionMessage({
        challengeId, 
        message: `"${challengeTitle}" marked as incomplete`, 
        isCompleted: false
      });
      // Clear message after 3 seconds
      setTimeout(() => setCompletionMessage(null), 3000);
    }
  };

  // Calculate completed count when user progress changes
  useEffect(() => {
    if (userProgress?.completedChallenges) {
      setCompletedCount(userProgress.completedChallenges.length);
    } else {
      setCompletedCount(0);
    }
  }, [userProgress]);

  // Add custom styles directly in the head to avoid JSX nesting issues
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      ${scrollStyles}
      
      /* Dynamic crosses animation - More subtle movement */
      @keyframes float {
        0% { transform: translateY(0px) rotate(0deg); }
        25% { transform: translateY(-3px) rotate(1deg); }
        50% { transform: translateY(0px) rotate(0deg); }
        75% { transform: translateY(3px) rotate(-1deg); }
        100% { transform: translateY(0px) rotate(0deg); }
      }
      
      @keyframes pulse {
        0% { opacity: 0.3; }
        50% { opacity: 0.5; }
        100% { opacity: 0.3; }
      }
      
      .cross-pattern {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: -15;
        overflow: hidden;
      }
      
      .cross {
        position: absolute;
        opacity: 0.4;
        transform-origin: center;
      }
      
      .cross-1 { 
        top: 10%; 
        left: 10%; 
        animation: float 8s infinite ease-in-out, pulse 10s infinite ease-in-out;
        animation-delay: 0s;
      }
      
      .cross-2 { 
        top: 20%; 
        right: 15%; 
        animation: float 10s infinite ease-in-out, pulse 8s infinite ease-in-out; 
        animation-delay: 0.5s;
      }
      
      .cross-3 { 
        bottom: 15%; 
        left: 15%; 
        animation: float 7s infinite ease-in-out, pulse 12s infinite ease-in-out; 
        animation-delay: 1s;
      }
      
      .cross-4 { 
        bottom: 25%; 
        right: 10%; 
        animation: float 11s infinite ease-in-out, pulse 9s infinite ease-in-out; 
        animation-delay: 1.5s;
      }
      
      .cross-5 { 
        top: 50%; 
        left: 5%; 
        animation: float 9s infinite ease-in-out, pulse 11s infinite ease-in-out; 
        animation-delay: 2s;
      }
      
      .cross-6 { 
        top: 40%; 
        right: 5%; 
        animation: float 8.5s infinite ease-in-out, pulse 9.5s infinite ease-in-out; 
        animation-delay: 2.5s;
      }
      
      /* Card Hover Animations - More subtle and unified */
      .challenge-card {
        transition: all 0.3s ease-out;
        transform: translateZ(0); /* Force hardware acceleration */
        will-change: transform, box-shadow; /* Optimize for animations */
      }
      
      .challenge-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
      }
      
      /* Filter Pill Hover Animations - Smoother */
      .filter-pill {
        transition: all 0.3s ease-out;
        position: relative;
        overflow: hidden;
        will-change: transform, box-shadow;
      }
      
      .filter-pill:hover:not([aria-pressed="true"]) {
        transform: translateY(-2px);
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
      }
      
      .filter-pill[aria-pressed="true"] {
        transform: scale(1.05);
      }
      
      /* Enhanced Completion Button - Aligned with card animations */
      .completion-button {
        transform: scale(1);
        transition: all 0.3s ease-out;
        will-change: transform;
      }
      
      .completion-button:hover {
        transform: scale(1.08);
      }
      
      .completion-button:active {
        transform: scale(0.98);
      }
      

    `;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // We've moved the challenges array before getUniqueModalityTypes to fix TypeScript errors;
  
  // Get unique modality types for filter pills;
  const uniqueModalityTypes: string[] = React.useMemo(() => {
    return Object.keys(modalityTypes).filter(modalityType =>
      [...challenges, ...hpChallenges].some(challenge => challenge.modality === modalityType)
    );
  }, [challenges, hpChallenges]);

  // Memoize the sorted and filtered challenges for better performance;
  const sortedChallenges: Challenge[] = React.useMemo(() => {
    const difficultyOrder = { 'beginner': 0, 'intermediate': 1, 'advanced': 2 };
    return [...challenges].sort((a, b) => {
      return difficultyOrder[a.skillLevel as keyof typeof difficultyOrder] - 
             difficultyOrder[b.skillLevel as keyof typeof difficultyOrder];
    });
  }, [challenges]);
  
  // Combine regular sorted challenges with HP challenges (HP challenges stay in their original order);
  const allChallenges: Challenge[] = React.useMemo(() => {
    return [...sortedChallenges, ...hpChallenges];
  }, [sortedChallenges, hpChallenges]);
  
  // Filter challenges by modality type;
  const filteredChallenges: Challenge[] = React.useMemo(() => {
    return activeFilter ? 
      allChallenges.filter(challenge => challenge.modality === activeFilter) : 
      allChallenges;
  }, [allChallenges, activeFilter]);
  
  // Group challenges by skill level for better organization;
  const beginnerChallenges: Challenge[] = React.useMemo(() => {
    return filteredChallenges.filter(challenge => challenge.skillLevel === 'beginner' && !challenge.partner);
  }, [filteredChallenges]);
  
  const intermediateChallenges: Challenge[] = React.useMemo(() => {
    return filteredChallenges.filter(challenge => challenge.skillLevel === 'intermediate' && !challenge.partner);
  }, [filteredChallenges]);
  
  const advancedChallenges: Challenge[] = React.useMemo(() => {
    return filteredChallenges.filter(challenge => challenge.skillLevel === 'advanced' && !challenge.partner);
  }, [filteredChallenges]);
  
  const partnerChallenges: Challenge[] = React.useMemo(() => {
    return filteredChallenges.filter(challenge => challenge.partner === 'HP');
  }, [filteredChallenges]);
  


  return (
    <div className="container mx-auto px-4 py-8">
      {/* Render completion message */}
      {completionMessage && (
        <div 
          role="alert"
          aria-live="polite"
          className={`fixed bottom-4 right-4 max-w-sm bg-white rounded-lg shadow-lg border p-4 transition-opacity duration-300 ${completionMessage ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="flex items-start">
            {completionMessage.isCompleted ? (
              <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" aria-hidden="true" />
            ) : (
              <XCircle className="h-5 w-5 text-amber-500 mr-3 mt-0.5" aria-hidden="true" />
            )}
            <p className="text-sm text-gray-700">{completionMessage.message}</p>
          </div>
        </div>
      )}
      
      {/* High-tech Futuristic Hero Section */}
      <div className="relative mb-16 overflow-hidden rounded-2xl shadow-2xl">
        {/* Tech-inspired background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-800 opacity-90"></div>
        
        {/* Circuit board pattern background */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="none">
            <pattern id="circuitPattern" patternUnits="userSpaceOnUse" width="100" height="100">
              <path d="M10 10L90 10M10 30L90 30M10 50L90 50M10 70L90 70M10 90L90 90M10 10L10 90M30 10L30 90M50 10L50 90M70 10L70 90M90 10L90 90" 
                stroke="#00AFFA" strokeWidth="0.5" strokeLinecap="round" fill="none" />
            </pattern>
            <rect width="800" height="400" fill="url(#circuitPattern)" />
            
            {/* Animated nodes */}
            <circle className="animate-ping" cx="100" cy="100" r="3" fill="#0096D6" />
            <circle className="animate-ping" cx="300" cy="200" r="3" fill="#0096D6" style={{animationDelay: '0.3s'}} />
            <circle className="animate-ping" cx="500" cy="150" r="3" fill="#0096D6" style={{animationDelay: '0.7s'}} />
            <circle className="animate-ping" cx="700" cy="300" r="3" fill="#0096D6" style={{animationDelay: '1s'}} />
            <circle className="animate-ping" cx="200" cy="300" r="3" fill="#0096D6" style={{animationDelay: '0.5s'}} />
            <circle className="animate-ping" cx="600" cy="250" r="3" fill="#0096D6" style={{animationDelay: '0.9s'}} />
            
            {/* Connection lines */}
            <path d="M100 100L300 200L500 150L700 300" stroke="#0096D6" strokeWidth="0.5" strokeDasharray="5,5" opacity="0.6" />
            <path d="M200 300L300 200L600 250" stroke="#0096D6" strokeWidth="0.5" strokeDasharray="5,5" opacity="0.6" />
          </svg>
        </div>
        
        {/* Binary code particles */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({length: 30}).map((_, i) => (
            <div key={i} 
              className="absolute text-blue-200 font-mono text-xs"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: 0.3 + Math.random() * 0.7
              }}>
              {Math.random() > 0.5 ? '1' : '0'}
            </div>
          ))}
        </div>
        
        <div className="relative z-10 px-6 py-16 sm:px-10 sm:py-24 flex flex-col items-center justify-center text-center">
          {/* HP branded header */}
          <div className="mb-8 flex items-center justify-center">
            <img src="/1200px-HP_logo_2012.svg.png" alt="HP" className="h-12 mr-3 filter brightness-0 invert" />
            <div className="h-12 w-px bg-blue-400 mx-4 opacity-50"></div>
            <div className="text-xl font-bold text-white tracking-wider">AI LAB</div>
          </div>
          
          {/* Main heading with tech styling */}
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-white leading-tight tracking-tight">
            <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-cyan-200 to-blue-300 animate-text pb-1">
              HP AI Challenge: Compete, Conquer, Win
            </span>
            <div className="inline-flex items-center ml-4">
              <span className="text-sm px-2 py-0.5 bg-blue-500/30 text-blue-100 rounded-md border border-blue-400/30 backdrop-blur-sm">
                BETA
              </span>
            </div>
          </h1>
          
          <p className="text-blue-100 mb-10 max-w-2xl mx-auto text-lg md:text-xl opacity-80">
            Welcome to the HP AI Challenge! Explore AI in a fun, fast-paced competition—complete as many challenges as you can and discover how AI boosts creativity, productivity, and problem-solving. Ready to compete, conquer, and win? Let's go!
          </p>
          
          {/* Tech decorative elements */}
          <div className="absolute top-8 left-8 animate-pulse opacity-70">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="18" stroke="#0096D6" strokeWidth="2" strokeDasharray="5 5" />
              <circle cx="20" cy="20" r="10" fill="#0096D6" fillOpacity="0.2" />
              <circle cx="20" cy="20" r="5" fill="#0096D6" fillOpacity="0.4" />
            </svg>
          </div>
          
          <div className="absolute bottom-8 right-8 animate-pulse opacity-70" style={{animationDelay: '0.3s'}}>
            <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
              <rect x="5" y="5" width="40" height="40" stroke="#0096D6" strokeWidth="2" strokeDasharray="8 4" />
              <rect x="15" y="15" width="20" height="20" fill="#0096D6" fillOpacity="0.2" />
              <rect x="20" y="20" width="10" height="10" fill="#0096D6" fillOpacity="0.4" />
            </svg>
          </div>
          
          {/* Call to action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center font-medium">
              <span>Explore Challenges</span>
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </button>
            <button className="px-6 py-3 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-lg shadow-md hover:bg-white/20 transition-all duration-300">
              Learn About HP AI
            </button>
          </div>
        </div>
      </div>
      
      {/* Animated wave divider */}
      <div className="w-full relative h-16 overflow-hidden mb-12">
        <svg className="absolute -top-12 left-0 w-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path 
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
            className="fill-indigo-50"
          ></path>
        </svg>
      </div>
      
      {/* Main section title */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800">Featured Challenges</h2>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">Choose from our curated selection of AI challenges across multiple domains</p>
        
        {/* Enhanced Completion Status */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-medium mt-8">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl px-5 py-3 flex items-center shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-gray-700">Completed: <span className="font-bold">{completedCount}</span> / {challenges.length + hpChallenges.length}</span>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-xl px-5 py-3 flex items-center shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <Award className="h-5 w-5 text-purple-600 mr-2" />
            <span className="text-gray-700">HP Challenges: <span className="font-bold">{hpChallenges.length}</span></span>
          </div>
        </div>
        
        {/* Challenge Time Legend */}
        <div className="mt-4 flex flex-wrap justify-center gap-3 text-xs">
          <div className="flex items-center bg-gradient-to-r from-green-50 to-emerald-50 p-2 rounded-lg px-4 border border-green-100 shadow-sm hover:shadow-md transition-all duration-300">
            <span>Easy: 1-3 min</span>
          </div>
          <div className="flex items-center bg-gradient-to-r from-blue-50 to-indigo-50 p-2 rounded-lg px-4 border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300">
            <span>Intermediate: 2-4 min</span>
          </div>
          <div className="flex items-center bg-gradient-to-r from-purple-50 to-indigo-50 p-2 rounded-lg px-4 border border-purple-100 shadow-sm hover:shadow-md transition-all duration-300">
            <span>Advanced: 4-6 min</span>
          </div>
        </div>
      </div>
      
      {/* Modality Filter Buttons - Responsive & Multi-row */}
      <div className="mb-8 max-w-4xl mx-auto">
        <h3 className="text-lg font-semibold mb-4 text-center text-gray-700 w-full">
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">Filter by Challenge Type</span>
        </h3>
        <div className="flex flex-wrap justify-center gap-3 max-w-full pb-3 px-4">
          {/* All challenges filter */}
          <button 
            onClick={() => setActiveFilter(null)}
            aria-pressed={!activeFilter}
            aria-label="Show all challenges"
            className={`filter-pill rounded-full px-4 py-2 text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-300 shadow-sm hover:shadow-md ${!activeFilter ? 'bg-[#0096D6] text-white scale-110' : 'bg-[#0096D6]/10 text-[#0096D6] border border-[#0096D6]/30 hover:scale-105 hover:-translate-y-0.5'}`}
          >
            All Challenges
          </button>
          
          {/* Individual modality filters */}
          {uniqueModalityTypes.map(type => (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              aria-pressed={activeFilter === type}
              aria-label={`Filter by ${modalityTypes[type as keyof typeof modalityTypes]?.name || type}`}
              className={`filter-pill rounded-full px-4 py-2 text-xs sm:text-sm font-medium flex items-center whitespace-nowrap transition-all duration-300 shadow-sm hover:shadow-md ${
                activeFilter === type ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white scale-110' : 'bg-gray-50 text-gray-800 hover:bg-gray-100 border border-gray-200 hover:scale-105 hover:-translate-y-0.5'
              }`}
              style={activeFilter === type ? {} : { borderLeft: `3px solid ${modalityTypes[type as keyof typeof modalityTypes]?.color || '#333'}` }}
            >
              <span className="mr-1.5">{modalityTypes[type as keyof typeof modalityTypes]?.icon}</span>
              <span className="truncate max-w-[80px] sm:max-w-full">{modalityTypes[type as keyof typeof modalityTypes]?.name || type}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Completion Message Notification */}
      {completionMessage && (
        <div className={`fixed top-16 right-4 max-w-sm p-4 rounded-lg shadow-lg transition-all transform animate-fade-in z-50 ${
          completionMessage.isCompleted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          <div className="flex items-center">
            {completionMessage.isCompleted ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <XCircle className="h-5 w-5 mr-2" />
            )}
            <p>{completionMessage.message}</p>
          </div>
        </div>
      )}
      
      {/* Beginner Challenges Section */}
      {beginnerChallenges.length > 0 && (
        <div className="mb-12 flex flex-col items-center relative">
          <div className="absolute inset-0 opacity-10 bg-repeat z-0" style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOHY2YzYuNjMgMCAxMiA1LjM3IDEyIDEyaC02YzkuOTQgMCAxOC04LjA2IDE4LTE4eiIgZmlsbD0iI0UwRjJGMSIvPjwvZz48L3N2Zz4=')" }}></div>
          <div className="flex flex-col sm:flex-row items-center justify-center mb-6 w-full text-center relative z-10">
            <div className="flex items-center mb-2 sm:mb-0">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-400 to-green-500 flex items-center justify-center text-white shadow-sm mr-3">
                <CheckCircle className="h-4 w-4" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">Beginner Challenges</h2>
            </div>
            <div className="flex items-center">
              <div className="mx-3 px-3 py-1 text-xs font-medium text-green-800 bg-gradient-to-r from-green-50 to-green-100 rounded-full shadow-sm border border-green-200">
                {beginnerChallenges.length} challenges
              </div>
              <div className="ml-2 text-xs bg-green-50 px-3 py-1 rounded-full border border-green-100 text-green-700 flex items-center">
                <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                {skillLevels.beginner.timeEstimate}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full justify-items-center mx-auto max-w-7xl relative z-10">
            {beginnerChallenges.map(challenge => (
              <div key={challenge.id} className="relative w-full max-w-xs mx-auto">
                <Link to={challenge.path} className="block h-full">
                  <div 
                    className={`challenge-card rounded-xl shadow-sm overflow-hidden w-full h-[300px] flex flex-col border border-gray-100 ${isCompleted(challenge.id) ? 'bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white' : 'bg-white'}`}
                    style={isCompleted(challenge.id) ? {} : {backgroundColor: '#FFFFFF', borderLeft: `4px solid ${modalityTypes[challenge.modality as keyof typeof modalityTypes]?.color || '#4CAF50'}`}}
                  >
                    {/* Card header with modality icon */}
                    <div className="absolute top-3 left-3 z-10">
                      <div className={`flex items-center justify-center h-9 w-9 rounded-full shadow-sm transition-all duration-300 ${
                        isCompleted(challenge.id) ? 'bg-white/20' : 'bg-white'
                      }`}>
                        {modalityTypes[challenge.modality as keyof typeof modalityTypes]?.icon || 
                         <Sparkles className="h-5 w-5" style={{ color: modalityTypes[challenge.modality as keyof typeof modalityTypes]?.color || '#6366F1' }} />}
                      </div>
                    </div>
                    
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-end items-start mb-3">
                        <div className="flex flex-col items-end">
                          {/* Skill level indicator */}
                          <span className={`skill-level-pill inline-flex items-center px-2 py-1 text-xs font-medium rounded-full mb-2 transition-all duration-300 ${
                            isCompleted(challenge.id) ? 'bg-white/20 text-white' : 'bg-green-100 text-green-800'
                          }`}>
                            <span className="mr-1">{skillLevels.beginner.icon}</span>
                            {skillLevels.beginner.name}
                          </span>
                          
                          {/* Modality type indicator */}
                          <span className={`modality-pill inline-flex items-center px-2 py-1 text-xs font-medium rounded-full transition-all duration-300 ${
                            isCompleted(challenge.id) ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800'
                          }`}>
                            <span className="truncate max-w-[100px] sm:max-w-full">{modalityTypes[challenge.modality as keyof typeof modalityTypes]?.name || challenge.modality}</span>
                          </span>
                        </div>
                      </div>
                      
                      <h3 className={`text-lg font-semibold mb-2 ${isCompleted(challenge.id) ? 'text-white' : 'text-gray-800'}`}>
                        {challenge.title}
                      </h3>
                      
                      <p className={`text-sm flex-grow ${isCompleted(challenge.id) ? 'text-white/80' : 'text-gray-600'}`}>
                        {challenge.description}
                      </p>
                      
                      {/* Challenge status indicators */}
                      <div className={`flex justify-between items-center mt-4 pt-2 border-t ${
                        isCompleted(challenge.id) ? 'border-white/20' : 'border-gray-100'
                      }`}>
                        <div className="flex items-center">
                          {isImplemented(challenge.id) ? (
                            <span className={`inline-flex items-center text-xs font-medium transition-all duration-300 group-hover:scale-105 ${
                              isCompleted(challenge.id) ? 'text-white/90' : 'text-green-600'
                            }`}>
                              {isCompleted(challenge.id) ? 'Completed' : ''}
                            </span>
                          ) : (
                            <span className={`inline-flex items-center text-xs font-medium transition-all duration-300 group-hover:scale-105 ${
                              isCompleted(challenge.id) ? 'text-white/70' : 'text-gray-500'
                            }`}>
                              Coming Soon
                            </span>
                          )}
                        </div>
                        

                      </div>
                    </div>
                  </div>
                </Link>
                
                {/* Mark as completed / uncompleted buttons - repositioned to bottom right */}
                {isImplemented(challenge.id) && (
                  <div className="absolute bottom-4 right-4 flex">
                    {isCompleted(challenge.id) ? (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleUncheckChallenge(challenge.id, challenge.title);
                        }}
                        className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 hover:scale-105 transition-all duration-200 border border-gray-200 completion-button"
                        title="Mark as incomplete"
                        aria-label="Mark challenge as incomplete"
                      >
                        <RotateCcw className="h-5 w-5 text-blue-600" />
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleMarkAsCompleted(challenge.id, challenge.title);
                        }}
                        className="p-2 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 hover:scale-105 transition-all duration-200 border border-blue-700 completion-button"
                        title="Mark as completed"
                        aria-label="Mark challenge as completed"
                      >
                        <CheckCircle className="h-5 w-5 text-white" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Intermediate Challenges Section */}
      {intermediateChallenges.length > 0 && (
        <div className="mb-12 flex flex-col items-center relative">
          <div className="absolute inset-0 opacity-10 bg-repeat z-0" style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgZmlsbD0iI0U4RUFGNiIgY3g9IjE1IiBjeT0iMTUiIHI9IjE1Ii8+PHBhdGggZD0iTTMwIDYwTDYwIDMwIDMwIDAgMCAzMHoiIGZpbGw9IiNFMEUwRTAiLz48L2c+PC9zdmc+')" }}></div>
          <div className="flex flex-col sm:flex-row items-center justify-center mb-6 w-full text-center relative z-10">
            <div className="flex items-center mb-2 sm:mb-0">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-sm mr-3">
                <Award className="h-4 w-4" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">Intermediate Challenges</h2>
            </div>
            <div className="flex items-center">
              <div className="mx-3 px-3 py-1 text-xs font-medium text-indigo-800 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-full shadow-sm border border-indigo-200">
                {intermediateChallenges.length} challenges
              </div>
              <div className="ml-2 text-xs bg-blue-50 px-3 py-1 rounded-full border border-blue-100 text-blue-700 flex items-center">
                <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                {skillLevels.intermediate.timeEstimate}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full justify-items-center mx-auto max-w-7xl relative z-10">
            {intermediateChallenges.map(challenge => (
              <div key={challenge.id} className="relative w-full max-w-xs mx-auto">
                <Link to={challenge.path} className="block h-full">
                  <div 
                    className={`challenge-card rounded-xl shadow-sm overflow-hidden w-full h-[300px] flex flex-col border border-gray-100 ${isCompleted(challenge.id) ? 'bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white' : 'bg-white'}`}
                    style={isCompleted(challenge.id) ? {} : {backgroundColor: '#FFFFFF', borderLeft: `4px solid ${modalityTypes[challenge.modality as keyof typeof modalityTypes]?.color || '#4CAF50'}`}}
                  >
                    {/* Card header with modality icon */}
                    <div className="absolute top-3 left-3 z-10">
                      <div className={`flex items-center justify-center h-9 w-9 rounded-full shadow-sm transition-all duration-300 ${
                        isCompleted(challenge.id) ? 'bg-white/20' : 'bg-white'
                      }`}>
                        {modalityTypes[challenge.modality as keyof typeof modalityTypes]?.icon || 
                         <Sparkles className="h-5 w-5" style={{ color: modalityTypes[challenge.modality as keyof typeof modalityTypes]?.color || '#6366F1' }} />}
                      </div>
                    </div>
                    
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-end items-start mb-3">
                        <div className="flex flex-col items-end">
                          {/* Skill level indicator */}
                          <span className={`skill-level-pill inline-flex items-center px-2 py-1 text-xs font-medium rounded-full mb-2 transition-all duration-300 ${
                            isCompleted(challenge.id) ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800'
                          }`}>
                            <span className="mr-1">{skillLevels.intermediate.icon}</span>
                            {skillLevels.intermediate.name}
                          </span>
                          
                          {/* Modality type indicator */}
                          <span className={`modality-pill inline-flex items-center px-2 py-1 text-xs font-medium rounded-full transition-all duration-300 ${
                            isCompleted(challenge.id) ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800'
                          }`}>
                            <span className="truncate max-w-[100px] sm:max-w-full">{modalityTypes[challenge.modality as keyof typeof modalityTypes]?.name || challenge.modality}</span>
                          </span>
                        </div>
                      </div>
                      
                      <h3 className={`text-lg font-semibold mb-2 ${isCompleted(challenge.id) ? 'text-white' : 'text-gray-800'}`}>
                        {challenge.title}
                      </h3>
                      
                      <p className={`text-sm flex-grow ${isCompleted(challenge.id) ? 'text-white/80' : 'text-gray-600'}`}>
                        {challenge.description}
                      </p>
                      
                      {/* Challenge status indicators */}
                      <div className={`flex justify-between items-center mt-4 pt-2 border-t ${
                        isCompleted(challenge.id) ? 'border-white/20' : 'border-gray-100'
                      }`}>
                        <div className="flex items-center">
                          {isImplemented(challenge.id) ? (
                            <span className={`inline-flex items-center text-xs font-medium transition-all duration-300 group-hover:scale-105 ${
                              isCompleted(challenge.id) ? 'text-white/90' : 'text-green-600'
                            }`}>
                              {isCompleted(challenge.id) ? 'Completed' : ''}
                            </span>
                          ) : (
                            <span className={`inline-flex items-center text-xs font-medium transition-all duration-300 group-hover:scale-105 ${
                              isCompleted(challenge.id) ? 'text-white/70' : 'text-gray-500'
                            }`}>
                              Coming Soon
                            </span>
                          )}
                        </div>
                        

                      </div>
                    </div>
                  </div>
                </Link>
                
                {/* Mark as completed / uncompleted buttons - repositioned to bottom right */}
                {isImplemented(challenge.id) && (
                  <div className="absolute bottom-4 right-4 flex">
                    {isCompleted(challenge.id) ? (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleUncheckChallenge(challenge.id, challenge.title);
                        }}
                        className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 hover:scale-105 transition-all duration-200 border border-gray-200 completion-button"
                        title="Mark as incomplete"
                        aria-label="Mark challenge as incomplete"
                      >
                        <RotateCcw className="h-5 w-5 text-blue-600" />
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleMarkAsCompleted(challenge.id, challenge.title);
                        }}
                        className="p-2 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 hover:scale-105 transition-all duration-200 border border-blue-700 completion-button"
                        title="Mark as completed"
                        aria-label="Mark challenge as completed"
                      >
                        <CheckCircle className="h-5 w-5 text-white" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Advanced Challenges Section */}
      {advancedChallenges.length > 0 && (
        <div className="mb-12 flex flex-col items-center relative">
          <div className="absolute inset-0 opacity-10 bg-repeat z-0" style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOHY2YzYuNjMgMCAxMiA1LjM3IDEyIDEyaC02YzkuOTQgMCAxOC04LjA2IDE4LTE4eiIgZmlsbD0iI0JCREVGQiIvPjwvZz48L3N2Zz4=')" }}></div>
          <div className="flex flex-col sm:flex-row items-center justify-center mb-6 w-full text-center relative z-10">
            <div className="flex items-center mb-2 sm:mb-0">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-purple-700 flex items-center justify-center text-white shadow-sm mr-3">
                <Sparkles className="h-4 w-4" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">Advanced Challenges</h2>
            </div>
            <div className="flex items-center">
              <div className="mx-3 px-3 py-1 text-xs font-medium text-purple-800 bg-gradient-to-r from-purple-50 to-purple-100 rounded-full shadow-sm border border-purple-200">
                {advancedChallenges.length} challenges
              </div>
              <div className="ml-2 text-xs bg-purple-50 px-3 py-1 rounded-full border border-purple-100 text-purple-700 flex items-center">
                <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                {skillLevels.advanced.timeEstimate}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full justify-items-center mx-auto max-w-7xl relative z-10">
            {advancedChallenges.map(challenge => (
              <div key={challenge.id} className="relative w-full max-w-xs mx-auto">
                <Link to={challenge.path} className="block h-full">
                  <div 
                    className={`challenge-card rounded-xl shadow-sm overflow-hidden w-full h-[300px] flex flex-col border border-gray-100 ${isCompleted(challenge.id) ? 'bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white' : 'bg-white'}`}
                    style={isCompleted(challenge.id) ? {} : {backgroundColor: '#FFFFFF', borderLeft: `4px solid ${modalityTypes[challenge.modality as keyof typeof modalityTypes]?.color || '#4CAF50'}`}}
                  >
                    {/* Card header with modality icon */}
                    <div className="absolute top-3 left-3 z-10">
                      <div className={`flex items-center justify-center h-9 w-9 rounded-full shadow-sm transition-all duration-300 ${
                        isCompleted(challenge.id) ? 'bg-white/20' : 'bg-white'
                      }`}>
                        {modalityTypes[challenge.modality as keyof typeof modalityTypes]?.icon || 
                         <Sparkles className="h-5 w-5" style={{ color: modalityTypes[challenge.modality as keyof typeof modalityTypes]?.color || '#6366F1' }} />}
                      </div>
                    </div>
                    
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-end items-start mb-3">
                        <div className="flex flex-col items-end">
                          {/* Skill level indicator */}
                          <span className={`skill-level-pill inline-flex items-center px-2 py-1 text-xs font-medium rounded-full mb-2 transition-all duration-300 ${
                            isCompleted(challenge.id) ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-800'
                          }`}>
                            <span className="mr-1">{skillLevels.advanced.icon}</span>
                            {skillLevels.advanced.name}
                          </span>
                          
                          {/* Modality type indicator */}
                          <span className={`modality-pill inline-flex items-center px-2 py-1 text-xs font-medium rounded-full transition-all duration-300 ${
                            isCompleted(challenge.id) ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800'
                          }`}>
                            <span className="truncate max-w-[100px] sm:max-w-full">{modalityTypes[challenge.modality as keyof typeof modalityTypes]?.name || challenge.modality}</span>
                          </span>
                        </div>
                      </div>
                      
                      <h3 className={`text-lg font-semibold mb-2 ${isCompleted(challenge.id) ? 'text-white' : 'text-gray-800'}`}>
                        {challenge.title}
                      </h3>
                      
                      <p className={`text-sm flex-grow ${isCompleted(challenge.id) ? 'text-white/80' : 'text-gray-600'}`}>
                        {challenge.description}
                      </p>
                      
                      {/* Challenge status indicators */}
                      <div className={`flex justify-between items-center mt-4 pt-2 border-t ${
                        isCompleted(challenge.id) ? 'border-white/20' : 'border-gray-100'
                      }`}>
                        <div className="flex items-center">
                          {isImplemented(challenge.id) ? (
                            <span className={`inline-flex items-center text-xs font-medium transition-all duration-300 group-hover:scale-105 ${
                              isCompleted(challenge.id) ? 'text-white/90' : 'text-green-600'
                            }`}>
                              {isCompleted(challenge.id) ? 'Completed' : ''}
                            </span>
                          ) : (
                            <span className={`inline-flex items-center text-xs font-medium transition-all duration-300 group-hover:scale-105 ${
                              isCompleted(challenge.id) ? 'text-white/70' : 'text-gray-500'
                            }`}>
                              Coming Soon
                            </span>
                          )}
                        </div>
                        

                      </div>
                    </div>
                  </div>
                </Link>
                
                {/* Mark as completed / uncompleted buttons - repositioned to bottom right */}
                {isImplemented(challenge.id) && (
                  <div className="absolute bottom-4 right-4 flex">
                    {isCompleted(challenge.id) ? (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleUncheckChallenge(challenge.id, challenge.title);
                        }}
                        className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 hover:scale-105 transition-all duration-200 border border-gray-200 completion-button"
                        title="Mark as incomplete"
                        aria-label="Mark challenge as incomplete"
                      >
                        <RotateCcw className="h-5 w-5 text-blue-600" />
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleMarkAsCompleted(challenge.id, challenge.title);
                        }}
                        className="p-2 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 hover:scale-105 transition-all duration-200 border border-blue-700 completion-button"
                        title="Mark as completed"
                        aria-label="Mark challenge as completed"
                      >
                        <CheckCircle className="h-5 w-5 text-white" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* HP Partner Challenges Section */}
      {partnerChallenges.length > 0 && (
        <div className="mb-12 relative">
          {/* HP branding background with premium effect */}
          <div className="absolute -inset-6 bg-gradient-to-r from-[#0096D6]/10 to-indigo-50 rounded-xl -z-10"></div>
          <div className="absolute -inset-1 border-2 border-dashed border-[#0096D6]/30 rounded-lg -z-5 opacity-50"></div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center pt-4 mb-6 w-full">
            <div className="flex items-center mb-2 sm:mb-0">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#0096D6] to-blue-700 flex items-center justify-center text-white mr-4 shadow-md">
                <Award className="h-5 w-5" />
              </div>
              <div className="flex flex-col items-center sm:items-start">
                <div className="flex items-center">
                  <img src="./hp-logo.svg" alt="HP" className="h-6 mr-2" />
                  <h2 className="text-xl md:text-2xl font-bold text-[#0096D6]">HP Premium Challenges</h2>
                </div>
                <span className="text-xs text-gray-500 mt-1">Exclusive challenges by HP Europe</span>
              </div>
            </div>
            <div className="flex items-center mt-3 sm:mt-0 sm:ml-auto">
              <div className="px-4 py-1.5 text-xs font-medium text-[#0096D6] bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full shadow-sm border border-blue-200 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-3.5 h-3.5 mr-1.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                {partnerChallenges.length} exclusive challenges
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full justify-items-center mx-auto max-w-7xl relative z-10">
            {partnerChallenges.map(challenge => (
              <div key={challenge.id} className="relative overflow-hidden w-full max-w-sm md:max-w-none">
                <Link to={challenge.path} className="block h-full">
                  <div 
                    className={`challenge-card h-full flex flex-col rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden w-full ${
                    isCompleted(challenge.id) 
                      ? 'bg-gradient-to-r from-[#0096D6]/90 to-blue-700/90 text-white border border-blue-400' 
                      : 'bg-[#0096D6]/10 border border-[#0096D6]/30 hover:border-[#0096D6]/70'
                  }`}
                    style={isCompleted(challenge.id) ? {} : {borderColor: '#0096D6', borderWidth: '1px'}}
                  >
                    {/* Card Header with Modality Icon */}
                    <div className={`flex items-center justify-between p-3 transition-all duration-300 ${isCompleted(challenge.id) ? 'from-blue-800/40 to-blue-900/40' : 'bg-[#0096D6]/15'}`}>
                      {/* Modality Icon */}
                      <div className="flex items-center">
                        {modalityTypes[challenge.modality as keyof typeof modalityTypes]?.icon ? (
                          <span className={isCompleted(challenge.id) ? 'text-white' : ''} 
                                style={isCompleted(challenge.id) ? {} : {color: modalityTypes[challenge.modality as keyof typeof modalityTypes]?.color}}>
                            {modalityTypes[challenge.modality as keyof typeof modalityTypes]?.icon}
                          </span>
                        ) : challenge.modality === 'voice' ? (
                          <Mic className={`h-5 w-5 ${isCompleted(challenge.id) ? 'text-white' : ''}`} 
                               style={isCompleted(challenge.id) ? {} : {color: modalityTypes.voice?.color || '#2E7D32'}} />
                        ) : challenge.modality === 'visual' ? (
                          <Image className={`h-5 w-5 ${isCompleted(challenge.id) ? 'text-white' : ''}`} 
                                 style={isCompleted(challenge.id) ? {} : {color: modalityTypes.visual?.color || '#673AB7'}} />
                        ) : challenge.modality === 'mixed' ? (
                          <Layers className={`h-5 w-5 ${isCompleted(challenge.id) ? 'text-white' : ''}`} 
                                  style={isCompleted(challenge.id) ? {} : {color: modalityTypes.mixed?.color || '#0096D6'}} />
                        ) : challenge.modality === 'chatbot' ? (
                          <MessageSquare className={`h-5 w-5 ${isCompleted(challenge.id) ? 'text-white' : ''}`} 
                                        style={isCompleted(challenge.id) ? {} : {color: modalityTypes.chatbot?.color || '#FF5722'}} />
                        ) : null}
                      </div>

                      {/* Partner badge */}
                      <span className={`flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${
                        isCompleted(challenge.id) ? 'bg-white/30 text-white font-bold' : 'bg-[#0096D6]/20 text-[#0096D6] font-bold border border-[#0096D6]/30'
                      }`}>
                        <span className="inline-flex items-center gap-1">
                          <img src="./hp-logo.svg" alt="HP" className="h-3.5" />
                          {challenge.badge || 'Premium'}
                        </span>
                      </span>
                    </div>

                    <div className="p-4 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-3">
                        {/* Skill level indicator */}
                        <span className={`skill-level-pill inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${
                          isCompleted(challenge.id) ? 'bg-white/20 text-white' : 
                          challenge.skillLevel === 'beginner' ? 'bg-green-100 text-green-800 border border-green-200' :
                          challenge.skillLevel === 'intermediate' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                          'bg-purple-100 text-purple-800 border border-purple-200'
                        }`}>
                          {skillLevels[challenge.skillLevel as keyof typeof skillLevels]?.name || challenge.skillLevel}
                          {skillLevels[challenge.skillLevel as keyof typeof skillLevels]?.timeEstimate && 
                            <span className="ml-1 opacity-75">({skillLevels[challenge.skillLevel as keyof typeof skillLevels]?.timeEstimate})</span>
                          }
                        </span>
                      </div>
                      
                      <h3 className={`text-lg font-semibold mb-2 ${isCompleted(challenge.id) ? 'text-white' : 'text-gray-800'}`}>
                        {challenge.title}
                      </h3>
                      
                      <p className={`text-sm mb-4 flex-grow ${isCompleted(challenge.id) ? 'text-white/80' : 'text-gray-600'}`}>
                        {challenge.description}
                      </p>
                      
                      {/* Challenge status indicators */}
                      <div className="flex justify-between items-center mt-auto pt-2">
                        <div className="flex items-center">
                          {isImplemented(challenge.id) ? (
                            <span className={`inline-flex items-center text-xs font-medium ${
                              isCompleted(challenge.id) ? 'text-white/90' : 'text-green-600'
                            }`}>
                              <Check className="h-3.5 w-3.5 mr-1" />
                              Available
                            </span>
                          ) : (
                            <span className={`inline-flex items-center text-xs font-medium ${
                              isCompleted(challenge.id) ? 'text-white/70' : 'text-amber-600'
                            }`}>
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              Coming Soon
                            </span>
                          )}
                        </div>
                        
                        {isCompleted(challenge.id) && (
                          <span className="inline-flex items-center text-xs font-medium text-white/90">
                            <CheckCircle className="h-3.5 w-3.5 mr-1" />
                            Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
                
                {/* Mark as completed / uncompleted buttons */}
                {isImplemented(challenge.id) && (
                  <div className="absolute bottom-3 right-3 flex">
                    {isCompleted(challenge.id) ? (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleUncheckChallenge(challenge.id, challenge.title);
                        }}
                        className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 hover:scale-110 transition-all duration-200 border border-gray-100"
                        title="Mark as incomplete"
                        aria-label="Mark challenge as incomplete"
                      >
                        <RotateCcw className="h-5 w-5 text-amber-600" />
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleMarkAsCompleted(challenge.id, challenge.title);
                        }}
                        className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 hover:scale-105 transition-all duration-200 border border-gray-200"
                        title="Mark as completed"
                        aria-label="Mark challenge as completed"
                      >
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengeHubNew;
