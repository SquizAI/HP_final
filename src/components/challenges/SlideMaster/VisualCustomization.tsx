import React, { useState } from 'react';
import { SlideMasterState, Theme, TransitionType } from './SlidesMasterMain';
import AIAssistButton from '../../../components/common/AIAssistButton';

interface VisualCustomizationProps {
  state: SlideMasterState;
  updateState: (newState: Partial<SlideMasterState>) => void;
  onNext: () => void;
  onBack: () => void;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
  error?: string | null;
}

// Color palettes for themes
const COLOR_PALETTES = [
  {
    name: 'Professional Blue',
    primary: '#1E40AF',
    secondary: '#3B82F6',
    accent: '#93C5FD',
    background: '#EFF6FF',
    text: '#1E293B'
  },
  {
    name: 'Vibrant Purple',
    primary: '#7E22CE',
    secondary: '#A855F7',
    accent: '#D8B4FE',
    background: '#F5F3FF',
    text: '#1E1B4B'
  },
  {
    name: 'Corporate Green',
    primary: '#15803D',
    secondary: '#22C55E',
    accent: '#86EFAC',
    background: '#F0FDF4',
    text: '#1E293B'
  },
  {
    name: 'Bold Red',
    primary: '#BE123C',
    secondary: '#F43F5E',
    accent: '#FDA4AF',
    background: '#FFF1F2',
    text: '#1E293B'
  },
  {
    name: 'Modern Dark',
    primary: '#334155',
    secondary: '#64748B',
    accent: '#94A3B8',
    background: '#F8FAFC',
    text: '#0F172A'
  },
  {
    name: 'Ocean',
    primary: '#0E7490',
    secondary: '#06B6D4',
    accent: '#67E8F9',
    background: '#ECFEFF',
    text: '#164E63'
  },
  {
    name: 'Earthy Tones',
    primary: '#B45309',
    secondary: '#F59E0B',
    accent: '#FCD34D',
    background: '#FFFBEB',
    text: '#422006'
  },
  {
    name: 'Monochrome',
    primary: '#27272A',
    secondary: '#52525B',
    accent: '#A1A1AA',
    background: '#FAFAFA',
    text: '#18181B'
  }
];

// Font combinations for themes
const FONT_COMBINATIONS = [
  {
    name: 'Modern Sans',
    headingFont: 'Inter, system-ui, sans-serif',
    bodyFont: 'Inter, system-ui, sans-serif'
  },
  {
    name: 'Professional Serif',
    headingFont: 'Georgia, serif',
    bodyFont: 'Georgia, serif'
  },
  {
    name: 'Classic Combination',
    headingFont: 'Montserrat, sans-serif',
    bodyFont: 'Source Sans Pro, sans-serif'
  },
  {
    name: 'Technical',
    headingFont: 'Roboto, sans-serif',
    bodyFont: 'Roboto Mono, monospace'
  },
  {
    name: 'Contemporary',
    headingFont: 'Playfair Display, serif',
    bodyFont: 'Raleway, sans-serif'
  }
];

// Transition types descriptions
const TRANSITIONS: { [key in TransitionType]: { name: string; description: string } } = {
  'fade': {
    name: 'Fade',
    description: 'Smooth fade between slides'
  },
  'slide': {
    name: 'Slide',
    description: 'Slides move in from the side'
  },
  'zoom': {
    name: 'Zoom',
    description: 'Zoom in/out transition'
  },
  'flip': {
    name: 'Flip',
    description: '3D flip between slides'
  },
  'none': {
    name: 'None',
    description: 'Instant switch between slides'
  }
};

// Visual element options
const VISUAL_ELEMENTS = [
  {
    id: 'grid',
    name: 'Grid Background',
    description: 'Subtle grid pattern in the background',
    preview: '┼'
  },
  {
    id: 'gradients',
    name: 'Gradient Accents',
    description: 'Soft color gradients for visual interest',
    preview: '▒'
  },
  {
    id: 'shadows',
    name: 'Depth Shadows',
    description: 'Subtle shadows for depth and dimension',
    preview: '▓'
  },
  {
    id: 'icons',
    name: 'Custom Icons',
    description: 'Thematic icons for bullet points and sections',
    preview: '♦'
  },
  {
    id: 'borders',
    name: 'Elegant Borders',
    description: 'Thin borders around content areas',
    preview: '□'
  },
  {
    id: 'roundedCorners',
    name: 'Rounded Corners',
    description: 'Soft rounded corners on elements',
    preview: '◑'
  }
];

const VisualCustomization: React.FC<VisualCustomizationProps> = ({
  state,
  updateState,
  onNext,
  onBack,
  isGenerating,
  setIsGenerating,
  error
}) => {
  // Local state for the component
  const [showThemePreview, setShowThemePreview] = useState(false);
  const [previewTheme, setPreviewTheme] = useState<Theme | null>(null);
  const [visualElements, setVisualElements] = useState<string[]>(state.visualElements || []);
  
  // Generate a custom theme with AI
  const generateCustomTheme = () => {
    setIsGenerating(true);
    
    // In a real app, this would call an AI API to generate a unique theme based on presentation topic
    setTimeout(() => {
      // Generate random colors for demo
      const hue = Math.floor(Math.random() * 360);
      const customTheme: Theme = {
        id: `custom-${Date.now()}`,
        name: `Custom Theme: ${state.title.split(':')[0]}`,
        description: `A unique theme created for "${state.title}" presentation`,
        colors: {
          primary: `hsl(${hue}, 70%, 40%)`,
          secondary: `hsl(${hue + 20}, 60%, 50%)`,
          accent: `hsl(${hue + 40}, 90%, 80%)`,
          background: `hsl(${hue + 10}, 30%, 98%)`,
          text: '#1E293B'
        },
        fonts: {
          headingFont: FONT_COMBINATIONS[Math.floor(Math.random() * FONT_COMBINATIONS.length)].headingFont,
          bodyFont: FONT_COMBINATIONS[Math.floor(Math.random() * FONT_COMBINATIONS.length)].bodyFont
        }
      };
      
      updateState({ theme: customTheme });
      setIsGenerating(false);
    }, 2000);
  };
  
  // Apply a predefined theme
  const applyTheme = (colorPalette: typeof COLOR_PALETTES[0], fontCombo: typeof FONT_COMBINATIONS[0]) => {
    const newTheme: Theme = {
      id: `theme-${Date.now()}`,
      name: `${colorPalette.name} with ${fontCombo.name}`,
      description: `A theme combining ${colorPalette.name} colors with ${fontCombo.name} typography`,
      colors: {
        primary: colorPalette.primary,
        secondary: colorPalette.secondary,
        accent: colorPalette.accent,
        background: colorPalette.background,
        text: colorPalette.text
      },
      fonts: {
        headingFont: fontCombo.headingFont,
        bodyFont: fontCombo.bodyFont
      }
    };
    
    updateState({ theme: newTheme });
  };
  
  // Set the transition type
  const setTransitionType = (type: TransitionType) => {
    updateState({ transition: type });
  };
  
  // Toggle a visual element
  const toggleVisualElement = (elementId: string) => {
    const updatedElements = visualElements.includes(elementId)
      ? visualElements.filter(id => id !== elementId)
      : [...visualElements, elementId];
    
    setVisualElements(updatedElements);
    updateState({ visualElements: updatedElements });
  };
  
  // Preview a theme
  const handleThemePreview = (theme: Theme) => {
    setPreviewTheme(theme);
    setShowThemePreview(true);
  };
  
  // Get the current theme or default
  const currentTheme = state.theme || {
    id: 'default',
    name: 'Default Theme',
    description: 'Basic professional theme',
    primaryColor: '#1E40AF',
    secondaryColor: '#3B82F6',
    accentColor: '#93C5FD',
    backgroundColor: '#EFF6FF',
    fontTitle: 'Inter, system-ui, sans-serif',
    fontBody: 'Inter, system-ui, sans-serif',
    backgroundStyle: 'solid' as const
  };
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-1">Visual Customization</h3>
        <p className="text-sm text-gray-600">
          Customize how your presentation looks and feels to engage your audience.
        </p>
      </div>
      
      {/* Current theme preview */}
      <div className="mb-8">
        <h4 className="font-medium text-gray-700 mb-3">Current Theme: {currentTheme.name}</h4>
        <div className="border rounded-lg overflow-hidden">
          <div 
            style={{ backgroundColor: currentTheme.backgroundColor }}
            className="p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <div
                style={{ 
                  color: currentTheme.primaryColor,
                  fontFamily: currentTheme.fontTitle,
                }}
                className="text-xl font-bold"
              >
                {state.title || "Presentation Title"}
              </div>
              <div
                style={{ backgroundColor: currentTheme.primaryColor }}
                className="h-2 w-16 rounded"
              ></div>
            </div>
            
            <div 
              style={{ 
                backgroundColor: '#FFFFFF',
                boxShadow: (state.visualElements || []).includes('shadows') ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
                borderRadius: (state.visualElements || []).includes('roundedCorners') ? '0.5rem' : '0',
                border: (state.visualElements || []).includes('borders') ? `1px solid ${currentTheme.accentColor}` : 'none'
              }}
              className="p-4 mb-4"
            >
              <div
                style={{ 
                  color: currentTheme.secondaryColor,
                  fontFamily: currentTheme.fontTitle
                }}
                className="text-lg font-semibold mb-2"
              >
                Sample Slide Title
              </div>
              <div
                style={{ 
                  color: '#1E293B',
                  fontFamily: currentTheme.fontBody
                }}
                className="text-sm"
              >
                <p className="mb-3">This is how your content will appear using this theme.</p>
                <ul className="space-y-1">
                  <li className="flex items-start">
                    <span 
                      style={{ color: currentTheme.primaryColor }}
                      className="mr-2"
                    >
                      {state.visualElements?.includes('icons') ? '♦' : '•'}
                    </span>
                    <span>First bullet point example</span>
                  </li>
                  <li className="flex items-start">
                    <span 
                      style={{ color: currentTheme.primaryColor }}
                      className="mr-2"
                    >
                      {state.visualElements?.includes('icons') ? '♦' : '•'}
                    </span>
                    <span>Second bullet point with more text</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div
              style={{ 
                backgroundColor: currentTheme.accentColor,
                opacity: 0.2,
                borderRadius: (state.visualElements || []).includes('roundedCorners') ? '0.5rem' : '0'
              }}
              className="h-20 mb-3"
            >
              {state.visualElements?.includes('gradients') && (
                <div className="h-full w-full bg-gradient-to-r from-transparent to-white opacity-50"></div>
              )}
              {state.visualElements?.includes('grid') && (
                <div className="h-full w-full" 
                  style={{ 
                    backgroundImage: `linear-gradient(to right, ${currentTheme.primaryColor}10 1px, transparent 1px), 
                                   linear-gradient(to bottom, ${currentTheme.primaryColor}10 1px, transparent 1px)`,
                    backgroundSize: '20px 20px'
                  }}
                ></div>
              )}
            </div>
            
            <div className="flex justify-end">
              <div 
                style={{ 
                  backgroundColor: currentTheme.primaryColor,
                  color: '#FFFFFF',
                  fontFamily: currentTheme.fontBody
                }}
                className="px-4 py-1 text-sm font-medium rounded"
              >
                Next Slide
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Color Palettes */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-medium text-gray-700">Color Palette</h4>
          <AIAssistButton
            onClick={generateCustomTheme}
            tooltip="Generate a custom theme with AI"
            buttonStyle="minimal"
            disabled={isGenerating}
          />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {COLOR_PALETTES.map((palette) => (
            <button
              key={palette.name}
              onClick={() => {
                const currentFonts = currentTheme.fonts;
                applyTheme(palette, { name: 'Keep Current', headingFont: currentFonts.headingFont, bodyFont: currentFonts.bodyFont });
              }}
              className={`border p-3 rounded-md text-left hover:bg-gray-50 transition ${
                currentTheme.colors.primary === palette.primary ? 'ring-2 ring-blue-300' : ''
              }`}
            >
              <div className="text-sm font-medium mb-2">{palette.name}</div>
              <div className="flex space-x-1 mb-2">
                <div style={{ backgroundColor: palette.primary }} className="w-6 h-6 rounded"></div>
                <div style={{ backgroundColor: palette.secondary }} className="w-6 h-6 rounded"></div>
                <div style={{ backgroundColor: palette.accent }} className="w-6 h-6 rounded"></div>
              </div>
              <div className="text-xs text-gray-500">
                {currentTheme.colors.primary === palette.primary ? 'Currently Selected' : 'Click to Apply'}
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Typography */}
      <div className="mb-8">
        <h4 className="font-medium text-gray-700 mb-3">Typography</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {FONT_COMBINATIONS.map((combo) => (
            <button
              key={combo.name}
              onClick={() => {
                const currentColors = currentTheme.colors;
                applyTheme({ name: 'Keep Current', ...currentColors }, combo);
              }}
              className={`border p-3 rounded-md text-left hover:bg-gray-50 transition ${
                currentTheme.fonts.headingFont === combo.headingFont ? 'ring-2 ring-blue-300' : ''
              }`}
            >
              <div className="font-medium mb-1" style={{ fontFamily: combo.headingFont }}>{combo.name}</div>
              <p className="text-sm mb-2" style={{ fontFamily: combo.bodyFont }}>
                This is how your text will look.
              </p>
              <div className="text-xs text-gray-500">
                {currentTheme.fonts.headingFont === combo.headingFont ? 'Currently Selected' : 'Click to Apply'}
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Transitions */}
      <div className="mb-8">
        <h4 className="font-medium text-gray-700 mb-3">Slide Transitions</h4>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {Object.entries(TRANSITIONS).map(([type, details]) => (
            <button
              key={type}
              onClick={() => setTransitionType(type as TransitionType)}
              className={`border p-3 rounded-md text-center hover:bg-gray-50 transition ${
                state.transition === type ? 'ring-2 ring-blue-300 bg-blue-50' : ''
              }`}
            >
              <div className="font-medium mb-1">{details.name}</div>
              <p className="text-xs text-gray-600 mb-2">{details.description}</p>
              <div className="text-xs text-gray-500">
                {state.transition === type ? 'Selected' : 'Click to Select'}
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Visual Elements */}
      <div className="mb-8">
        <h4 className="font-medium text-gray-700 mb-3">Visual Elements</h4>
        <p className="text-sm text-gray-600 mb-3">
          Select additional visual elements to enhance your presentation.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {VISUAL_ELEMENTS.map((element) => (
            <button
              key={element.id}
              onClick={() => toggleVisualElement(element.id)}
              className={`border p-3 rounded-md text-left hover:bg-gray-50 transition ${
                visualElements.includes(element.id) ? 'ring-2 ring-blue-300 bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center mb-1">
                <span className="text-xl mr-2" style={{ color: currentTheme.colors.primary }}>{element.preview}</span>
                <span className="font-medium">{element.name}</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">{element.description}</p>
              <div className="text-xs text-gray-500">
                {visualElements.includes(element.id) ? 'Selected' : 'Click to Add'}
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* AI Theme Generator */}
      <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
        <div className="flex items-center mb-2">
          <div className="flex-shrink-0 h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
            <span className="text-lg">AI</span>
          </div>
          <div className="ml-3">
            <h4 className="font-bold text-blue-800">AI Theme Generator</h4>
            <p className="text-sm text-blue-700">
              Let AI create a custom theme based on your presentation topic.
            </p>
          </div>
        </div>
        
        <p className="text-sm text-blue-700 mb-3">
          The AI will analyze your presentation topic "{state.title}" and design a theme that visually reinforces your message and appeals to your target audience of {state.audience || "professionals"}.
        </p>
        
        <AIAssistButton
          onClick={generateCustomTheme}
          label={isGenerating ? "Generating Theme..." : "Generate Custom Theme"}
          buttonStyle="prominent"
          disabled={isGenerating}
        />
        
        <p className="text-xs text-blue-600 mt-2">
          The generated theme will include complementary colors, fonts, and visual elements that match your presentation's purpose.
        </p>
      </div>
      
      {/* Navigation buttons */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
        >
          Back
        </button>
        
        <button
          onClick={onNext}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Continue to Preview
        </button>
      </div>
      
      {/* Theme Preview Modal */}
      {showThemePreview && previewTheme && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">{previewTheme.name}</h3>
                <button 
                  onClick={() => setShowThemePreview(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-600">{previewTheme.description}</p>
            </div>
            
            <div 
              style={{ backgroundColor: previewTheme.colors.background }}
              className="p-6"
            >
              {/* Sample slide content with the preview theme */}
              <div
                style={{ 
                  color: previewTheme.colors.primary,
                  fontFamily: previewTheme.fonts.headingFont,
                }}
                className="text-xl font-bold mb-4"
              >
                Sample Presentation Title
              </div>
              
              <div 
                style={{ 
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}
                className="p-4 mb-4 rounded"
              >
                <div
                  style={{ 
                    color: previewTheme.colors.secondary,
                    fontFamily: previewTheme.fonts.headingFont
                  }}
                  className="text-lg font-semibold mb-2"
                >
                  Key Points
                </div>
                <div
                  style={{ 
                    color: previewTheme.colors.text,
                    fontFamily: previewTheme.fonts.bodyFont
                  }}
                  className="text-sm"
                >
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span 
                        style={{ color: previewTheme.colors.primary }}
                        className="mr-2"
                      >
                        •
                      </span>
                      <span>First key point about the presentation topic</span>
                    </li>
                    <li className="flex items-start">
                      <span 
                        style={{ color: previewTheme.colors.primary }}
                        className="mr-2"
                      >
                        •
                      </span>
                      <span>Second important concept to remember</span>
                    </li>
                    <li className="flex items-start">
                      <span 
                        style={{ color: previewTheme.colors.primary }}
                        className="mr-2"
                      >
                        •
                      </span>
                      <span>Final summary of the main idea</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div
                style={{ 
                  backgroundColor: previewTheme.colors.accent,
                  opacity: 0.2,
                  borderRadius: '0.5rem'
                }}
                className="h-32 mb-4"
              >
              </div>
            </div>
            
            <div className="p-4 border-t flex justify-end">
              <button
                onClick={() => {
                  updateState({ theme: previewTheme });
                  setShowThemePreview(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition mr-2"
              >
                Apply This Theme
              </button>
              <button
                onClick={() => setShowThemePreview(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
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

export default VisualCustomization; 