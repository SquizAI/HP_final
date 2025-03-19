import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getApiKey } from '../../../services/openai';
import { useNavigate } from 'react-router-dom';
import './presentation-toast.css';

// Extend Window interface to add our toast functions
declare global {
  interface Window {
    createToastContainer: () => HTMLDivElement;
    showToast: (options: ToastOptions) => void;
    getToastIcon: (status: string) => string;
  }
}

// Toast notification system
interface ToastOptions {
  title: string;
  description: string;
  status: 'info' | 'success' | 'error' | 'warning';
  duration?: number;
  isClosable: boolean;
}

// Add a tooltip interface
interface TooltipState {
  isVisible: boolean;
  content: string;
}

// Theme types
interface PresentationTheme {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  previewImage: string;
}

// Slide types
interface Slide {
  id: string;
  title: string;
  content: string[];
  imagePrompt?: string;
  imageUrl?: string;
  notes?: string;
}

interface Presentation {
  title: string;
  subtitle?: string;
  theme: PresentationTheme;
  slides: Slide[];
}

// Sample themes
const SAMPLE_THEMES: PresentationTheme[] = [
  {
    id: 'modern',
    name: 'Modern',
    primaryColor: '#2563eb',
    secondaryColor: '#dbeafe',
    accentColor: '#60a5fa',
    fontFamily: 'Inter, sans-serif',
    previewImage: '/themes/modern.jpg',
  },
  {
    id: 'gradient',
    name: 'Gradient',
    primaryColor: '#6366f1',
    secondaryColor: '#e0e7ff',
    accentColor: '#818cf8',
    fontFamily: 'Montserrat, sans-serif',
    previewImage: '/themes/gradient.jpg',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    primaryColor: '#18181b',
    secondaryColor: '#f4f4f5',
    accentColor: '#71717a',
    fontFamily: 'DM Sans, sans-serif',
    previewImage: '/themes/minimal.jpg',
  },
  {
    id: 'nature',
    name: 'Nature',
    primaryColor: '#16a34a',
    secondaryColor: '#dcfce7',
    accentColor: '#4ade80',
    fontFamily: 'Poppins, sans-serif',
    previewImage: '/themes/nature.jpg',
  },
  {
    id: 'tech',
    name: 'Tech',
    primaryColor: '#9333ea',
    secondaryColor: '#f3e8ff',
    accentColor: '#c084fc',
    fontFamily: 'Space Grotesk, sans-serif',
    previewImage: '/themes/tech.jpg',
  },
  {
    id: 'corporate',
    name: 'Corporate',
    primaryColor: '#0284c7',
    secondaryColor: '#e0f2fe',
    accentColor: '#38bdf8',
    fontFamily: 'Roboto, sans-serif',
    previewImage: '/themes/corporate.jpg',
  },
];

// Initialize global toast functions
const initializeToastFunctions = () => {
  // Global toast container reference
  let globalToastContainer: HTMLDivElement | null = null;

  // Toast icon utility
  window.getToastIcon = (status: string): string => {
    switch (status) {
      case 'success':
        return '<svg class="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
      case 'error':
        return '<svg class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
      case 'warning':
        return '<svg class="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>';
      default:
        return '<svg class="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
    }
  };

  // Create a toast container if it doesn't exist
  window.createToastContainer = (): HTMLDivElement => {
    if (globalToastContainer) return globalToastContainer;
    
    let container = document.getElementById('toast-container') as HTMLDivElement;
    
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'fixed top-4 right-4 z-50 flex flex-col gap-3';
      document.body.appendChild(container);
    }
    
    globalToastContainer = container;
    return container;
  };

  // Show a toast notification
  window.showToast = (options: ToastOptions): void => {
    // Ensure container exists
    const toastContainer = window.createToastContainer();
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${options.status} max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden`;
    
    // Add content
    toast.innerHTML = `
      <div class="px-4 py-3 flex items-start">
        <div class="flex-shrink-0 mr-3">
          ${window.getToastIcon(options.status)}
        </div>
        <div class="flex-1">
          <h3 class="font-medium text-gray-900 dark:text-white">${options.title}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">${options.description}</p>
        </div>
        ${options.isClosable ? '<button class="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-500">&times;</button>' : ''}
      </div>
    `;
    
    // Add animation classes
    toast.classList.add('transform', 'transition-all', 'duration-300', 'toast-enter');
    
    // Add close button functionality
    if (options.isClosable) {
      const closeButton = toast.querySelector('button');
      if (closeButton) {
        closeButton.addEventListener('click', () => {
          toast.classList.add('toast-exit');
          setTimeout(() => toast.remove(), 300);
        });
      }
    }
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Auto dismiss
    if (options.duration) {
      setTimeout(() => {
        if (toast.parentElement) {
          toast.classList.add('toast-exit');
          setTimeout(() => toast.remove(), 300);
        }
      }, options.duration);
    }
  };
};

// Initialize toast functions immediately
initializeToastFunctions();

const SimpleAIPresentationGenerator: React.FC = () => {
  const [userInput, setUserInput] = useState('');
  const [audience, setAudience] = useState('');
  const [presentationState, setPresentationState] = useState<'idle' | 'generating' | 'completed' | 'error'>('idle');
  const [editorState, setEditorState] = useState<'input' | 'preview'>('input');
  const [presentationData, setPresentationData] = useState<any>(null);
  // Progress state
  const [generationProgress, setGenerationProgress] = useState(0);
  const progressIntervalRef = useRef<any>(null);

  // Initialize toast container on component mount
  useEffect(() => {
    // Initialize toast container and functions if not already defined
    if (typeof window !== 'undefined') {
      // Create toast container if it doesn't exist
      if (!window.createToastContainer) {
        // Global toast container reference
        let globalToastContainer: HTMLDivElement | null = null;

        window.createToastContainer = (): HTMLDivElement => {
          if (globalToastContainer) return globalToastContainer;
          
          let container = document.getElementById('toast-container') as HTMLDivElement;
          
          if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'fixed top-4 right-4 z-50 flex flex-col gap-3';
            document.body.appendChild(container);
          }
          
          globalToastContainer = container;
          return container;
        };
      }

      // Define toast icon utility if not already defined
      if (!window.getToastIcon) {
        window.getToastIcon = (status: string): string => {
          switch (status) {
            case 'success':
              return '<svg class="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
            case 'error':
              return '<svg class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
            case 'warning':
              return '<svg class="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>';
            default:
              return '<svg class="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
          }
        };
      }

      // Define showToast function if not already defined
      if (!window.showToast) {
        window.showToast = (options: ToastOptions): void => {
          // Ensure container exists
          const toastContainer = window.createToastContainer();
          
          // Create toast element
          const toast = document.createElement('div');
          toast.className = `toast toast-${options.status} max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden`;
          
          // Add content
          toast.innerHTML = `
            <div class="px-4 py-3 flex items-start">
              <div class="flex-shrink-0 mr-3">
                ${window.getToastIcon(options.status)}
              </div>
              <div class="flex-1">
                <h3 class="font-medium text-gray-900 dark:text-white">${options.title}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">${options.description}</p>
              </div>
              ${options.isClosable ? '<button class="ml-3 text-gray-400 hover:text-gray-500">&times;</button>' : ''}
            </div>
          `;
          
          // Add animation
          toast.classList.add('transform', 'transition-all', 'duration-300', 'toast-enter');
          
          // Add close button event listener
          const closeButton = toast.querySelector('button');
          if (closeButton && options.isClosable) {
            closeButton.addEventListener('click', () => {
              toast.classList.add('toast-exit');
              setTimeout(() => toast.remove(), 300);
            });
          }
          
          // Add to container
          toastContainer.appendChild(toast);
          
          // Auto dismiss after duration
          if (options.duration) {
            setTimeout(() => {
              if (toast.parentElement) {
                toast.classList.add('toast-exit');
                setTimeout(() => toast.remove(), 300);
              }
            }, options.duration);
          }
        };
      }
      
      // Initialize the toast container
      window.createToastContainer();
    }
  }, []);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // Generate a presentation using AI
  const generatePresentation = async () => {
    if (!userInput) {
      if (typeof window.showToast === 'function') {
        window.showToast({
          title: 'Missing Input',
          description: 'Please enter a topic for your presentation.',
          status: 'warning',
          duration: 5000,
          isClosable: true
        });
      }
      return;
    }

    setPresentationState('generating');
    setGenerationProgress(0);
    
    // Start progress animation
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    
    progressIntervalRef.current = setInterval(() => {
      setGenerationProgress(prev => Math.min(prev + 1, 95));
    }, 300);
    
    try {
      // Simple sample presentation for demo purposes
      const sampleSlides = [
        {
          id: 'slide-1',
          title: userInput,
          content: ['Welcome to this presentation', 'Created with AI assistance', 'Let\'s explore this topic together']
        },
        {
          id: 'slide-2',
          title: 'Overview',
          content: ['Key point 1', 'Key point 2', 'Key point 3']
        },
        {
          id: 'slide-3',
          title: 'Main Content',
          content: ['Detailed information about the topic', 'Supporting evidence', 'Expert opinions']
        },
        {
          id: 'slide-4',
          title: 'Analysis',
          content: ['Data interpretation', 'Trends and patterns', 'Implications']
        },
        {
          id: 'slide-5',
          title: 'Applications',
          content: ['Practical uses', 'Implementation strategies', 'Success stories']
        },
        {
          id: 'slide-6',
          title: 'Conclusion',
          content: ['Summary of key points', 'Final thoughts', 'Call to action']
        }
      ];
      
      // Wait a moment to simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
        
      // Create new presentation
      const newPresentation: Presentation = {
        title: userInput,
        theme: SAMPLE_THEMES[0],
        slides: sampleSlides.slice(0, 6)
      };
      
      // Update progress to complete
      setGenerationProgress(100);
      
      // Stop the interval
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      
      // Update state
      setPresentationData(newPresentation);
      setPresentationState('completed');
    } catch (error) {
      console.error('Error generating presentation:', error);
      
      // Stop the progress animation
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      
      // Keep error toast as it's important for user feedback
      window.showToast({
        title: 'Generation Failed',
        description: 'There was an error generating your presentation. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      
      setPresentationState('error');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-6 px-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">AI Presentation Generator</h2>
      
      {editorState === 'input' && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="mb-6">
            <label htmlFor="topic" className="block text-gray-700 font-medium mb-2">What's your presentation topic?</label>
            <input
              id="topic"
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your presentation topic or title"
            />
          </div>
          
          <div className="mb-8">
            <label htmlFor="audience" className="block text-gray-700 font-medium mb-2">Who's your audience?</label>
            <input
              id="audience"
              type="text"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Executives, Team members, Clients, Students"
            />
          </div>
          
          <div className="flex justify-center">
            <motion.button
              className="px-8 py-4 rounded-xl font-medium text-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
              onClick={generatePresentation}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              disabled={presentationState === 'generating'}
            >
              <span className="mr-2">✨</span> Generate Professional Presentation
            </motion.button>
          </div>
          
          {/* Generation Process Modal */}
          {presentationState === 'generating' && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Generating Professional Presentation</h3>
                  <p className="text-gray-600">
                    AI is analyzing your topic "{userInput}" and creating an elegant presentation structure with appropriate sections. 
                    This process includes:
                  </p>
                  
                  <ul className="mt-3 space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">1.</span> 
                      <span>Analyzing your topic and determining key points</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">2.</span> 
                      <span>Creating a logical structure and flow for your presentation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">3.</span> 
                      <span>Generating relevant content for each slide</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">4.</span> 
                      <span>Preparing image prompts for each slide</span>
                    </li>
                  </ul>
                  
                  <div className="mt-6">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${generationProgress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-sm text-gray-500">Processing...</span>
                      <span className="text-sm text-gray-500">{generationProgress}%</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 rounded-md">
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">Please wait</span> while the AI works its magic. This usually takes 15-30 seconds to complete.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Rest of your component remains the same */}
    </div>
  );
};

export default SimpleAIPresentationGenerator; 