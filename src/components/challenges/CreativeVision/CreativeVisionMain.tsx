import React, { useState, useEffect, useRef } from 'react';
import { Wand2, Sparkles, Image as ImageIcon, RefreshCw, Check, AlertTriangle, Info, Award, Save, Star, Zap, Lightbulb } from 'lucide-react';
import { useUserProgress, markChallengeAsCompleted } from '../../../utils/userDataManager';
import Confetti from '../../shared/Confetti';
import ChallengeHeader from '../../shared/ChallengeHeader';
import { generateImage, FluxImageGenerationOptions } from '../../../utils/fluxImageGenerator';

// Example style options for image generation
const STYLE_OPTIONS = [
  { id: 'vivid', name: 'Vivid', description: 'Bright, vibrant colors with heightened contrast' },
  { id: 'natural', name: 'Natural', description: 'True-to-life colors and realistic lighting' },
  { id: 'artistic', name: 'Artistic', description: 'Creative interpretation with painterly qualities' },
  { id: 'professional', name: 'Professional', description: 'Clean, corporate-friendly aesthetics' },
  { id: 'cinematic', name: 'Cinematic', description: 'Dramatic lighting with movie-like framing' },
  { id: 'vintage', name: 'Vintage', description: 'Retro aesthetics with nostalgic qualities' }
];

// Image ratio options
const RATIO_OPTIONS = [
  { id: 'square', name: 'Square', description: '1:1 ratio - ideal for social media posts' },
  { id: 'landscape', name: 'Landscape', description: '16:9 ratio - great for presentations and banners' },
  { id: 'portrait', name: 'Portrait', description: '9:16 ratio - perfect for mobile and stories' }
];

// Sample prompts to inspire users
const SAMPLE_PROMPTS = [
  {
    id: 'business1',
    category: 'Business',
    prompt: 'A diverse team of professionals collaborating on a digital project in a modern workspace with holographic displays',
    description: 'Team Collaboration',
    recommendedModel: 'Ideogram' // Visual scene
  },
  {
    id: 'business2',
    category: 'Business',
    prompt: 'Futuristic office space with sustainable design elements, plants integrated with technology, and natural lighting',
    description: 'Modern Workspace',
    recommendedModel: 'Ideogram' // Visual scene
  },
  {
    id: 'marketing1',
    category: 'Marketing',
    prompt: 'Eye-catching product showcase of an innovative smartphone with holographic display in a minimalist setting',
    description: 'Product Showcase',
    recommendedModel: 'Ideogram' // Visual scene
  },
  {
    id: 'typography1',
    category: 'Typography',
    prompt: 'Modern minimalist logo with the text "FLUX CREATIVE" in a clean sans-serif font with subtle gradients',
    description: 'Logo Design',
    recommendedModel: 'Recraft' // Text-focused
  }
];

// Example generation tips
const GENERATION_TIPS = [
  { id: 'specificity', title: 'Be Specific', description: 'Include details about subjects, setting, lighting, perspective, and style' },
  { id: 'atmosphere', title: 'Set the Atmosphere', description: 'Use descriptive words for mood, time of day, and environment' },
  { id: 'technical', title: 'Add Technical Details', description: 'Terms like "8K resolution", "photorealistic", "depth of field" improve quality' },
  { id: 'composition', title: 'Guide Composition', description: 'Mention foreground, background, framing, and focal points' },
  { id: 'revise', title: 'Revise & Refine', description: "If results aren't ideal, try adjusting your prompt with more specificity" }
];

// Function to save generated images (mock implementation)
const saveImage = async (imageUrl: string) => {
  try {
    // In a real app, this would save to a server or download the file
    // For now, we'll just simulate by opening in a new tab
    window.open(imageUrl, '_blank');
    return true;
  } catch (error) {
    console.error('Error saving image:', error);
    return false;
  }
};

const CreativeVisionMain: React.FC = () => {
  // User progress tracking
  const [userProgress, setUserProgress] = useUserProgress();
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  
  // Image generation state
  const [prompt, setPrompt] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Generation options
  const [selectedStyle, setSelectedStyle] = useState<string>('vivid');
  const [selectedRatio, setSelectedRatio] = useState<string>('square');
  const [useIdeogram, setUseIdeogram] = useState<boolean>(true);
  const [creativeMode, setCreativeMode] = useState<boolean>(false);
  
  // Gallery of generated images
  const [generatedGallery, setGeneratedGallery] = useState<Array<{id: string, prompt: string, imageUrl: string}>>([]);
  
  // Refs
  const promptInputRef = useRef<HTMLTextAreaElement>(null);
  
  // Check if challenge is already completed
  useEffect(() => {
    if (userProgress.completedChallenges.includes('challenge-creative-vision')) {
      setIsCompleted(true);
    }
  }, [userProgress]);
  
  // Function to suggest the best model based on prompt content
  const suggestBestModel = (promptText: string): 'Ideogram' | 'Recraft' => {
    const textLower = promptText.toLowerCase();
    
    // Keywords that suggest text-focused content (better for Recraft)
    const textKeywords = [
      'text', 'typography', 'font', 'logo', 'lettering', 'title', 'heading',
      'quote', 'slogan', 'word', 'letter', 'typeface', 'caption', 'serif'
    ];
    
    // Check if any text keywords are present
    const hasTextKeywords = textKeywords.some(keyword => textLower.includes(keyword));
    
    // If text keywords are present or the prompt is short (likely text-focused), suggest Recraft
    if (hasTextKeywords || promptText.length < 40) {
      return 'Recraft';
    }
    
    // Default to Ideogram for most visual content
    return 'Ideogram';
  };
  
  // Handle using sample prompts
  const handleUseSamplePrompt = (samplePrompt: string, recommendedModel: string) => {
    setPrompt(samplePrompt);
    setUseIdeogram(recommendedModel === 'Ideogram');
    // Scroll to prompt input
    promptInputRef.current?.focus();
  };
  
  // Generate image based on prompt
  const handleGenerateImage = async () => {
    // Validate prompt
    if (!prompt.trim()) {
      setError('Please enter a prompt to generate an image');
      promptInputRef.current?.focus();
      return;
    }
    
    // Clear previous states
    setError(null);
    setIsGenerating(true);
    setGeneratedImage(null);
    
    try {
      // Prepare generation options
      const options: FluxImageGenerationOptions = {
        useIdeogram: useIdeogram,
        style: selectedStyle,
        size: selectedRatio === '1:1' ? 'square' : 
              selectedRatio === '16:9' ? 'landscape' : 
              selectedRatio === '9:16' ? 'portrait' : 'square'
      };
      
      // Generate image
      const imageUrl = await generateImage(prompt, options);
      
      // Handle success
      if (imageUrl) {
        setGeneratedImage(imageUrl);
        
        // Add to gallery
        const newImageItem = {
          id: Date.now().toString(),
          prompt,
          imageUrl
        };
        
        setGeneratedGallery(prev => [newImageItem, ...prev]);
        
        // Mark challenge as completed if first generation
        if (!isCompleted && generatedGallery.length === 0) {
          const success = await markChallengeAsCompleted('challenge-creative-vision');
          if (success) {
            setIsCompleted(true);
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000);
          }
        }
      } else {
        setError('Failed to generate image. Please try again with a different prompt.');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      setError('An error occurred while generating the image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Handle saving an image
  const handleSaveImage = async () => {
    if (!generatedImage) return;
    
    const success = await saveImage(generatedImage);
    if (success) {
      setSuccessMessage('Image opened in a new tab');
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      setError('Failed to save the image');
      setTimeout(() => setError(null), 3000);
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Challenge Header */}
      <ChallengeHeader 
        title="Creative Vision Challenge" 
        icon={<span className="text-2xl">🎨</span>}
        challengeId="challenge-creative-vision"
        isCompleted={isCompleted}
        setIsCompleted={setIsCompleted}
        showConfetti={showConfetti}
        setShowConfetti={setShowConfetti}
      />
      
      {/* Show confetti when challenge is completed */}
      {showConfetti && <Confetti active={showConfetti} />}
      
      {/* Main content area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column: Input area */}
        <div className="space-y-4 bg-white rounded-lg p-5 shadow-sm">
          {/* Prompt input */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Create Your Image</h2>
            <div className="mb-4">
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
                Enter your prompt
              </label>
              <textarea
                id="prompt"
                ref={promptInputRef}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y min-h-[100px]"
                placeholder="Describe the image you want to generate..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
          </div>
          
          {/* Model selection */}
          <div className="mb-4">
            <h3 className="text-md font-medium mb-2">Select Model</h3>
            <div className="flex gap-2">
              <button 
                className={`px-4 py-2 rounded-md ${useIdeogram ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setUseIdeogram(true)}
              >
                Ideogram (Artistic)
              </button>
              <button 
                className={`px-4 py-2 rounded-md ${!useIdeogram ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setUseIdeogram(false)}
              >
                Recraft (Realistic)
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {useIdeogram 
                ? 'Ideogram is better for artistic, illustrative, and abstract images.' 
                : 'Recraft is better for photorealistic images and images with text.'}
            </p>
          </div>
          
          {/* Style selection */}
          <div className="mb-4">
            <h3 className="text-md font-medium mb-2">Image Style</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {STYLE_OPTIONS.map((style) => (
                <button
                  key={style.id}
                  className={`px-3 py-2 rounded-md text-sm ${selectedStyle === style.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => setSelectedStyle(style.id)}
                >
                  {style.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Aspect ratio selection */}
          <div className="mb-4">
            <h3 className="text-md font-medium mb-2">Aspect Ratio</h3>
            <div className="flex gap-2">
              {RATIO_OPTIONS.map((ratio) => (
                <button
                  key={ratio.id}
                  className={`px-4 py-2 rounded-md ${selectedRatio === ratio.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => setSelectedRatio(ratio.id)}
                >
                  {ratio.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Creative mode toggle */}
          <div className="mb-4">
            <label className="inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={creativeMode}
                onChange={(e) => setCreativeMode(e.target.checked)}
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ms-3 text-sm font-medium">Creative Mode</span>
            </label>
            <p className="text-xs text-gray-500 mt-1">Enables more creative and diverse outputs</p>
          </div>
          
          {/* Generate button */}
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            onClick={handleGenerateImage}
            disabled={isGenerating || !prompt.trim()}
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : 'Generate Image'}
          </button>
          
          {/* Error message */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-4" role="alert">
              <p>{error}</p>
            </div>
          )}
          
          {/* Success message */}
          {successMessage && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mt-4" role="alert">
              <p>{successMessage}</p>
            </div>
          )}
        </div>
        
        {/* Right column: Generated image and sample prompts */}
        <div className="space-y-4">
          {/* Generated image */}
          {generatedImage ? (
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <h2 className="text-xl font-semibold mb-2">Your Generated Image</h2>
              <div className="relative aspect-square md:aspect-auto md:h-80 overflow-hidden rounded-md bg-gray-100 mb-3">
                <img 
                  src={generatedImage} 
                  alt={prompt} 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex justify-between">
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md flex items-center justify-center transition-colors"
                  onClick={() => setPrompt('')}
                >
                  New Image
                </button>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center transition-colors"
                  onClick={handleSaveImage}
                >
                  Save Image
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <h2 className="text-xl font-semibold mb-2">Sample Prompts</h2>
              <div className="space-y-2">
                {SAMPLE_PROMPTS.map((sample, index) => (
                  <div key={index} className="border border-gray-200 rounded-md p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleUseSamplePrompt(sample.prompt, sample.recommendedModel)}
                  >
                    <p className="text-sm font-medium">{sample.prompt}</p>
                    <p className="text-xs text-gray-500 mt-1">Recommended: {sample.recommendedModel}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Generation tips */}
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Generation Tips</h2>
            <ul className="space-y-2 text-sm">
              {GENERATION_TIPS.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span><strong>{tip.title}</strong>: {tip.description}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Gallery of generated images */}
      {generatedGallery.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Your Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {generatedGallery.map((item) => (
              <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-sm">
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={item.imageUrl} 
                    alt={item.prompt} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-3">
                  <p className="text-sm text-gray-700 line-clamp-2">{item.prompt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreativeVisionMain;