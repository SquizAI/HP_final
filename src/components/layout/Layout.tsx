import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, Lightbulb, User, Settings, Heart, BookOpen, Menu, X, ChevronRight, CheckCircle, ChevronDown, Laptop } from 'lucide-react'

// Import standard challenges data
const standardChallenges = [
  {
    id: 'challenge-1',
    challengeNumber: 1,
    title: 'AI Dictation Wizard',
    path: '/challenge/dictation-wizard'
  },
  {
    id: 'challenge-2',
    challengeNumber: 2,
    title: 'AI Image Classifier',
    path: '/challenge/image-classifier'
  },
  {
    id: 'challenge-3',
    challengeNumber: 3,
    title: 'Facial Recognition System',
    path: '/challenge/face-id-manager'
  },
  {
    id: 'challenge-4',
    challengeNumber: 4,
    title: 'AI OCR Assistant',
    path: '/challenge/ocr-assistant'
  },
  {
    id: 'challenge-5',
    challengeNumber: 5,
    title: 'Creative Vision AI',
    path: '/challenge/creative-vision'
  },
  {
    id: 'challenge-6',
    challengeNumber: 6,
    title: 'AI Privacy Guardian',
    path: '/challenge/privacy-guardian'
  },
  {
    id: 'challenge-7',
    challengeNumber: 7,
    title: 'AI Voice Generator Pro',
    path: '/challenge/voice-generator'
  },
  {
    id: 'challenge-8',
    challengeNumber: 8,
    title: 'AI Global Communicator',
    path: '/challenge/global-communicator'
  },
  {
    id: 'challenge-9',
    challengeNumber: 9,
    title: 'AI Object Detection',
    path: '/challenge/object-detection'
  },
  {
    id: 'challenge-10',
    challengeNumber: 10,
    title: 'AI Emotional Insight',
    path: '/challenge/emotional-insight'
  },
  {
    id: 'challenge-11',
    challengeNumber: 11,
    title: 'AI Smart Select',
    path: '/challenge/smartselect'
  },
  {
    id: 'challenge-12',
    challengeNumber: 12,
    title: 'AI Social Media Strategist',
    path: '/challenge/social-media-strategist'
  },
  {
    id: 'challenge-13',
    challengeNumber: 13,
    title: 'AI Biz Strategist',
    path: '/challenge/bizstrategist'
  },
  {
    id: 'challenge-14',
    challengeNumber: 14,
    title: 'Agent Magic',
    path: '/challenge/agent-magic'
  }
];

// HP Challenges
const hpChallenges = [
  {
    id: 'challenge-hp-powerbi',
    challengeNumber: 1,
    title: 'HP Challenge 1: Power BI Challenge',
    path: '/challenge/hp-powerbi'
  },
  {
    id: 'challenge-hp-companion',
    challengeNumber: 2,
    title: 'HP Challenge 2: HP AI Companion',
    path: '/challenge/hp-companion'
  },
  {
    id: 'challenge-hp-amuze',
    challengeNumber: 3,
    title: 'HP Challenge 3: HP Amuze',
    path: '/challenge/hp-amuze'
  }
];

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [challengesDropdownOpen, setChallengesDropdownOpen] = useState(false);
  const [activeAccordions, setActiveAccordions] = useState<{[key: string]: boolean}>({
    standard: false,
    hp: false
  });
  const location = useLocation();
  const navigate = useNavigate();
  
  // Helper function to check if a link is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  // Check if the current route is a challenge page
  const isChallengePage = location.pathname.includes('/challenge/');
  
  // Handle completing and returning to challenges
  const handleCompleteAndReturn = () => {
    // For mobile navigation, we'll emit a custom event that the challenge components can listen for
    // This allows the challenge-specific completion logic to run
    const completeEvent = new CustomEvent('challenge-complete-mobile', {
      bubbles: true,
      detail: { source: 'mobile-nav' }
    });
    document.dispatchEvent(completeEvent);
    
    // After a short delay, navigate back to the challenges hub
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setChallengesDropdownOpen(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Prevent closing dropdown when clicking inside
  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Toggle accordion sections
  const toggleAccordion = (section: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveAccordions(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Enhanced Header with subtle gradient */}
      <header className="bg-gradient-to-r from-white to-blue-50 shadow-md sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="flex items-center transition-transform hover:scale-105">
                  <img 
                    src="/triveratech-logo.png" 
                    alt="TriveraTech Logo" 
                    className="h-8 w-auto mr-3" 
                  />
                  <div className="flex flex-col">
                    <span className="text-[#5CB2CC] font-bold text-xl tracking-tight">AI Challenge Hub</span>
                    <span className="text-[9px] text-gray-500 font-medium -mt-1">by TriveraTech</span>
                  </div>
                </Link>
              </div>
            </div>
            
            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex space-x-1">
                <Link 
                  to="/" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center relative overflow-hidden ${
                    isActive('/') || isActive('/challenges') 
                      ? 'text-[#5CB2CC] bg-blue-50' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Home size={16} className="mr-2" />
                  Home
                  {(isActive('/') || isActive('/challenges')) && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#5CB2CC]"></span>
                  )}
                </Link>
                
                {/* Challenges dropdown */}
                <div className="relative">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setChallengesDropdownOpen(!challengesDropdownOpen);
                    }}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center relative overflow-hidden ${
                      isChallengePage 
                        ? 'text-[#5CB2CC] bg-blue-50' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <BookOpen size={16} className="mr-2" />
                    Challenges
                    <ChevronDown size={14} className={`ml-1 transition-transform ${challengesDropdownOpen ? 'rotate-180' : ''}`} />
                    {isChallengePage && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#5CB2CC]"></span>
                    )}
                  </button>
                  
                  {challengesDropdownOpen && (
                    <div 
                      className="absolute mt-1 left-0 w-72 bg-white rounded-md shadow-lg z-50 py-1 max-h-[70vh] overflow-y-auto"
                      onClick={handleDropdownClick}
                    >
                      {/* Standard Challenges Accordion */}
                      <div className="border-b border-gray-100 last:border-0">
                        <button 
                          onClick={(e) => toggleAccordion('standard', e)}
                          className="w-full flex justify-between items-center px-4 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50"
                        >
                          <span>Standard Challenges</span>
                          <ChevronDown 
                            size={16} 
                            className={`transition-transform ${activeAccordions.standard ? 'rotate-180' : ''}`}
                          />
                        </button>
                        
                        {activeAccordions.standard && (
                          <div className="border-t border-gray-100 bg-gray-50 py-1">
                            {standardChallenges.map((challenge) => (
                              <Link
                                key={challenge.id}
                                to={challenge.path}
                                className={`block px-6 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                                  location.pathname === challenge.path ? 'bg-blue-50 text-[#5CB2CC]' : ''
                                }`}
                                onClick={() => setChallengesDropdownOpen(false)}
                              >
                                <span className="mr-2 text-xs font-semibold">{challenge.challengeNumber}.</span>
                                {challenge.title}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* HP Challenges Accordion */}
                      <div className="border-b border-gray-100 last:border-0">
                        <button 
                          onClick={(e) => toggleAccordion('hp', e)}
                          className="w-full flex justify-between items-center px-4 py-3 text-sm font-medium text-[#0096D6] hover:bg-gray-50"
                        >
                          <div className="flex items-center">
                            <Laptop size={16} className="mr-2" />
                            <span>HP AI Laptop Challenges</span>
                          </div>
                          <ChevronDown 
                            size={16} 
                            className={`transition-transform ${activeAccordions.hp ? 'rotate-180' : ''}`}
                          />
                        </button>
                        
                        {activeAccordions.hp && (
                          <div className="border-t border-gray-100 bg-blue-50 py-1">
                            {hpChallenges.map((challenge) => (
                              <Link
                                key={challenge.id}
                                to={challenge.path}
                                className={`block px-6 py-2 text-sm text-gray-700 hover:bg-blue-100 ${
                                  location.pathname === challenge.path ? 'bg-blue-100 text-[#0096D6]' : ''
                                }`}
                                onClick={() => setChallengesDropdownOpen(false)}
                              >
                                <span className="mr-2 text-xs font-semibold text-[#0096D6]">{challenge.challengeNumber}.</span>
                                {challenge.title}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <a 
                  href="https://triveratech.com/whychooseus" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center"
                >
                  <Lightbulb size={16} className="mr-2" />
                  About
                </a>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className="p-2 rounded-md text-gray-600 hover:text-[#5CB2CC] focus:outline-none"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200 shadow-lg animate-slideDown max-h-[80vh] overflow-y-auto">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                to="/"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/') || isActive('/challenges') 
                    ? 'text-[#5CB2CC] bg-blue-50' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Home size={18} className="mr-3" /> Home
                  </div>
                  <ChevronRight size={16} />
                </div>
              </Link>
              
              {/* Challenges Accordions in mobile menu */}
              {/* Standard Challenges */}
              <div className="border-b border-gray-100 pb-1 last:border-0">
                <button 
                  onClick={(e) => toggleAccordion('standard', e)}
                  className="w-full flex justify-between items-center px-3 py-2 text-base font-medium text-gray-900 rounded-md hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <BookOpen size={18} className="mr-3" /> Standard Challenges
                  </div>
                  <ChevronDown 
                    size={16} 
                    className={`transition-transform ${activeAccordions.standard ? 'rotate-180' : ''}`}
                  />
                </button>
                
                {activeAccordions.standard && (
                  <div className="ml-6 space-y-1 border-l border-gray-200 pl-3 mt-1">
                    {standardChallenges.map((challenge) => (
                      <Link
                        key={challenge.id}
                        to={challenge.path}
                        className={`block py-2 text-sm ${
                          location.pathname === challenge.path 
                            ? 'text-[#5CB2CC] font-medium' 
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className="mr-1 text-xs font-semibold">{challenge.challengeNumber}.</span>
                        {challenge.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              {/* HP Challenges */}
              <div className="border-b border-gray-100 pb-1 last:border-0">
                <button 
                  onClick={(e) => toggleAccordion('hp', e)}
                  className="w-full flex justify-between items-center px-3 py-2 text-base font-medium text-[#0096D6] rounded-md hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <Laptop size={18} className="mr-3" /> HP AI Laptop Challenges
                  </div>
                  <ChevronDown 
                    size={16} 
                    className={`transition-transform ${activeAccordions.hp ? 'rotate-180' : ''}`}
                  />
                </button>
                
                {activeAccordions.hp && (
                  <div className="ml-6 space-y-1 border-l border-[#0096D6]/30 pl-3 mt-1">
                    {hpChallenges.map((challenge) => (
                      <Link
                        key={challenge.id}
                        to={challenge.path}
                        className={`block py-2 text-sm ${
                          location.pathname === challenge.path 
                            ? 'text-[#0096D6] font-medium' 
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className="mr-1 text-xs font-semibold text-[#0096D6]">{challenge.challengeNumber}.</span>
                        {challenge.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              <a 
                href="https://triveratech.com/about" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Lightbulb size={18} className="mr-3" /> About
                  </div>
                  <ChevronRight size={16} />
                </div>
              </a>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      <div className="h-16 md:hidden">
        {/* Spacer for mobile to prevent content being hidden behind the nav */}
      </div>

      {/* Updated mobile navigation with context-aware buttons */}
      <nav className="bg-white shadow-lg fixed bottom-0 left-0 right-0 border-t border-gray-200 md:hidden z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-around">
            {/* Back button */}
            <Link 
              to="/" 
              className={`py-3 px-4 text-center flex flex-col items-center text-xs font-medium relative ${
                isActive('/') || isActive('/challenges') ? 'text-[#5CB2CC]' : 'text-gray-500 hover:text-[#5CB2CC]'
              }`}
            >
              <Home size={20} className="mb-1" />
              Back
              {(isActive('/') || isActive('/challenges')) && (
                <span className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-[#5CB2CC] rounded-full"></span>
              )}
            </Link>
            
            {/* Complete button - always visible */}
            <button 
              onClick={handleCompleteAndReturn}
              className="py-3 px-4 text-center flex flex-col items-center text-xs font-medium text-gray-500 hover:text-[#5CB2CC]"
            >
              <CheckCircle size={20} className="mb-1" />
              Complete
            </button>
            
            {/* Settings button */}
            <Link 
              to="/settings" 
              className={`py-3 px-4 text-center flex flex-col items-center text-xs font-medium relative ${
                isActive('/settings') ? 'text-[#5CB2CC]' : 'text-gray-500 hover:text-[#5CB2CC]'
              }`}
            >
              <Settings size={20} className="mb-1" />
              Settings
              {isActive('/settings') && (
                <span className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-[#5CB2CC] rounded-full"></span>
              )}
            </Link>
          </div>
        </div>
      </nav>
      
      {/* Updated Mobile footer with better styling */}
      <footer className="bg-white border-t border-gray-200 py-4 block md:hidden text-center text-xs mt-8 mb-20">
        <div className="px-4">
          <div className="flex flex-col items-center">
            <div className="text-gray-500 flex items-center mb-2 flex-wrap justify-center space-y-1">
              <span>© 2025 AI Challenge Hub</span>
              <div className="flex items-center mx-auto my-1">
                Made with <Heart size={12} className="mx-1 text-red-500 animate-pulse" fill="currentColor" /> by 
                <a href="https://triveratech.com/" target="_blank" rel="noopener noreferrer" className="ml-1 text-[#5CB2CC] font-medium">
                  TriveraTech
                </a>
              </div>
            </div>
            <div className="flex space-x-6 mb-2">
              <a href="#" className="text-gray-500 hover:text-[#5CB2CC] transition-colors">Terms</a>
              <a href="#" className="text-gray-500 hover:text-[#5CB2CC] transition-colors">Privacy</a>
              <a href="https://triveratech.com/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#5CB2CC] transition-colors">
                Contact
              </a>
            </div>
            <div className="text-gray-400 italic text-[10px]">
              "NO AI assistants were harmed in this app!"
            </div>
          </div>
        </div>
      </footer>
      
      {/* Updated Desktop footer with better styling */}
      <footer className="bg-gradient-to-r from-white to-blue-50 border-t border-gray-200 py-6 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-500 mb-4 md:mb-0 flex items-center">
              © 2025 AI Challenge Hub. Made with <Heart size={14} className="mx-1 text-red-500 animate-pulse" fill="currentColor" /> by 
              <a href="https://triveratech.com/" target="_blank" rel="noopener noreferrer" className="ml-1 text-[#5CB2CC] font-medium hover:underline transition-colors">
                TriveraTech
              </a>
            </div>
            <div className="flex space-x-8">
              <a href="#" className="text-gray-500 hover:text-[#5CB2CC] transition-colors group relative">
                Terms
                <span className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded-md px-3 py-2 -top-12 left-1/2 transform -translate-x-1/2 w-52 text-center shadow-lg">
                  Rule #1: Don't talk about AI Club. Rule #2: Only use AI responsibly... and for memes.
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></span>
                </span>
              </a>
              <a href="#" className="text-gray-500 hover:text-[#5CB2CC] transition-colors group relative">
                Privacy
                <span className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded-md px-3 py-2 -top-12 left-1/2 transform -translate-x-1/2 w-52 text-center shadow-lg">
                  We respect your privacy so much we don't even know where our servers are located!
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></span>
                </span>
              </a>
              <a href="https://triveratech.com/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#5CB2CC] transition-colors">
                Contact
              </a>
            </div>
          </div>
          <div className="mt-4 text-xs text-center text-gray-500 italic">
            "In a world of AI, the most valuable skill is still knowing which questions to ask."
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout 