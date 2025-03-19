import React, { useState, useEffect } from 'react';
import { Theme } from './SlidesMasterMain';

interface ThemeSelectorProps {
  themes: Theme[];
  selectedTheme: Theme;
  onSelectTheme: (theme: Theme) => void;
  presentationTitle: string;
  onBack: () => void;
}

// Enhanced theme collection with more options and better visuals
const ENHANCED_THEMES: Theme[] = [
  {
    name: 'Modern Minimalist',
    primaryColor: '#2563eb',
    secondaryColor: '#111827',
    accentColor: '#4f46e5',
    fontTitle: 'Montserrat, sans-serif',
    fontBody: 'Inter, sans-serif',
    backgroundStyle: 'solid',
    backgroundColor: '#ffffff'
  },
  {
    name: 'Gradient Blue',
    primaryColor: '#0284c7',
    secondaryColor: '#ffffff',
    accentColor: '#fbbf24',
    fontTitle: 'Poppins, sans-serif',
    fontBody: 'Roboto, sans-serif',
    backgroundStyle: 'gradient',
    backgroundColor: 'linear-gradient(135deg, #3b82f6 0%, #93c5fd 100%)'
  },
  {
    name: 'Dark Elegance',
    primaryColor: '#f9fafb',
    secondaryColor: '#94a3b8',
    accentColor: '#ec4899',
    fontTitle: 'Playfair Display, serif',
    fontBody: 'Source Sans Pro, sans-serif',
    backgroundStyle: 'solid',
    backgroundColor: '#0f172a'
  },
  {
    name: 'Nature Inspired',
    primaryColor: '#064e3b',
    secondaryColor: '#374151',
    accentColor: '#f59e0b',
    fontTitle: 'Merriweather, serif',
    fontBody: 'Lato, sans-serif',
    backgroundStyle: 'solid',
    backgroundColor: '#ecfdf5'
  },
  {
    name: 'Vibrant Coral',
    primaryColor: '#be123c',
    secondaryColor: '#1e293b',
    accentColor: '#06b6d4',
    fontTitle: 'Nunito, sans-serif',
    fontBody: 'Open Sans, sans-serif',
    backgroundStyle: 'gradient',
    backgroundColor: 'linear-gradient(135deg, #fb7185 0%, #fda4af 100%)'
  },
  {
    name: 'Corporate Professional',
    primaryColor: '#334155',
    secondaryColor: '#475569',
    accentColor: '#3b82f6',
    fontTitle: 'Raleway, sans-serif',
    fontBody: 'IBM Plex Sans, sans-serif',
    backgroundStyle: 'solid',
    backgroundColor: '#f8fafc'
  },
  {
    name: 'Bold Creative',
    primaryColor: '#fafafc',
    secondaryColor: '#d4d4d8',
    accentColor: '#22c55e',
    fontTitle: 'Bebas Neue, sans-serif',
    fontBody: 'Cabin, sans-serif',
    backgroundStyle: 'solid',
    backgroundColor: '#18181b'
  },
  {
    name: 'Pastel Dreams',
    primaryColor: '#6d28d9',
    secondaryColor: '#4b5563',
    accentColor: '#f43f5e',
    fontTitle: 'Quicksand, sans-serif',
    fontBody: 'Nunito Sans, sans-serif',
    backgroundStyle: 'gradient',
    backgroundColor: 'linear-gradient(135deg, #fbcfe8 0%, #e9d5ff 100%)'
  }
];

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ 
  themes, 
  selectedTheme, 
  onSelectTheme, 
  presentationTitle,
  onBack 
}) => {
  const [activeTab, setActiveTab] = useState<'preset' | 'custom'>('preset');
  const [customTheme, setCustomTheme] = useState<Theme>({ ...selectedTheme });
  const [previewBackground, setPreviewBackground] = useState(selectedTheme.backgroundColor);
  const [availableThemes, setAvailableThemes] = useState<Theme[]>(themes);
  
  // Use enhanced themes if available, otherwise use the provided themes
  useEffect(() => {
    if (ENHANCED_THEMES.length > 0) {
      setAvailableThemes(ENHANCED_THEMES);
    }
  }, []);
  
  // Apply selected theme
  const applyTheme = (theme: Theme) => {
    onSelectTheme(theme);
  };
  
  // Update custom theme property
  const updateCustomTheme = (property: keyof Theme, value: string) => {
    setCustomTheme(prev => ({
      ...prev,
      [property]: value
    }));
    
    // Update preview background if that's what changed
    if (property === 'backgroundColor' || property === 'backgroundStyle') {
      if (property === 'backgroundStyle' && value === 'gradient') {
        setPreviewBackground(`linear-gradient(135deg, ${customTheme.primaryColor} 0%, ${customTheme.secondaryColor} 100%)`);
      } else if (property === 'backgroundStyle' && value === 'solid') {
        setPreviewBackground(customTheme.backgroundColor);
      } else {
        setPreviewBackground(value);
      }
    }
  };
  
  // Reset custom theme to current theme
  const resetCustomTheme = () => {
    setCustomTheme({ ...selectedTheme });
    setPreviewBackground(selectedTheme.backgroundColor);
  };
  
  // Apply custom theme
  const applyCustomTheme = () => {
    applyTheme(customTheme);
  };

  // Enhanced theme preview component
  const ThemeCard = ({ theme }: { theme: Theme }) => {
    // Determine background style based on theme
    let backgroundStyle = {};
    if (theme.backgroundStyle === 'gradient') {
      // Check if backgroundColor already contains a gradient
      if (theme.backgroundColor.includes('linear-gradient')) {
        backgroundStyle = { background: theme.backgroundColor };
      } else {
        backgroundStyle = { background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)` };
      }
    } else {
      backgroundStyle = { background: theme.backgroundColor };
    }

    // Determine text color based on background brightness
    const textColor = theme.backgroundStyle === 'gradient' || 
                     theme.backgroundColor.includes('#0') || 
                     theme.backgroundColor.includes('#1') ||
                     theme.backgroundColor.includes('#2') || 
                     theme.backgroundColor.includes('#3')
                     ? '#ffffff' : theme.primaryColor;
    
    return (
      <div 
        className={`border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-md transform hover:scale-105 ${
          selectedTheme.name === theme.name ? 'ring-2 ring-blue-500 shadow-lg' : ''
        }`}
        onClick={() => applyTheme(theme)}
      >
        {/* Theme preview with enhanced visuals */}
        <div 
          className="h-40 p-4 flex flex-col justify-between"
          style={backgroundStyle}
        >
          <div 
            className="text-lg font-bold"
            style={{ 
              color: textColor, 
              fontFamily: theme.fontTitle 
            }}
          >
            Presentation Title
          </div>
          <div className="space-y-1 mt-2">
            <div 
              className="text-sm flex items-center"
              style={{ 
                color: textColor, 
                fontFamily: theme.fontBody 
              }}
            >
              <span className="mr-1">•</span> Key point one
            </div>
            <div 
              className="text-sm flex items-center"
              style={{ 
                color: textColor, 
                fontFamily: theme.fontBody 
              }}
            >
              <span className="mr-1">•</span> Key point two
            </div>
          </div>
          <div 
            className="text-xs self-end mt-2"
            style={{ color: theme.accentColor }}
          >
            Accent element
          </div>
        </div>
        
        {/* Theme name with better styling */}
        <div className="bg-white border-t border-gray-200 px-4 py-3">
          <div className="font-medium text-gray-800">{theme.name}</div>
          <div className="flex mt-1 space-x-1">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.primaryColor }}></div>
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.secondaryColor }}></div>
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.accentColor }}></div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <div>
              <h2 className="text-xl font-semibold">Choose a Theme for Your Presentation</h2>
              <p className="text-blue-100 text-sm mt-1">"{presentationTitle}"</p>
            </div>
            <button 
              onClick={onBack}
              className="text-white hover:text-blue-200 transition-colors"
              aria-label="Go Back"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px px-6">
              <button
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'preset'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } transition duration-150 ease-in-out`}
                onClick={() => setActiveTab('preset')}
              >
                Preset Themes
              </button>
              <button
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'custom'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } transition duration-150 ease-in-out`}
                onClick={() => setActiveTab('custom')}
              >
                Custom Theme
              </button>
            </nav>
          </div>
          
          {/* Content */}
          <div className="p-6">
            {activeTab === 'preset' ? (
              <div>
                <p className="text-gray-600 mb-6">
                  Select a theme that best fits your presentation style and audience. Your content will automatically be formatted using the selected theme.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {availableThemes.map((theme, index) => (
                    <ThemeCard key={index} theme={theme} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Custom theme editor */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Primary Color */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Primary Color
                      </label>
                      <div className="flex items-center">
                        <input
                          type="color"
                          value={customTheme.primaryColor}
                          onChange={(e) => updateCustomTheme('primaryColor', e.target.value)}
                          className="w-10 h-10 rounded border border-gray-300 mr-2"
                        />
                        <input
                          type="text"
                          value={customTheme.primaryColor}
                          onChange={(e) => updateCustomTheme('primaryColor', e.target.value)}
                          className="flex-1 rounded-md border border-gray-300 p-2 text-sm"
                        />
                      </div>
                    </div>
                    
                    {/* Secondary Color */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Secondary Color
                      </label>
                      <div className="flex items-center">
                        <input
                          type="color"
                          value={customTheme.secondaryColor}
                          onChange={(e) => updateCustomTheme('secondaryColor', e.target.value)}
                          className="w-10 h-10 rounded border border-gray-300 mr-2"
                        />
                        <input
                          type="text"
                          value={customTheme.secondaryColor}
                          onChange={(e) => updateCustomTheme('secondaryColor', e.target.value)}
                          className="flex-1 rounded-md border border-gray-300 p-2 text-sm"
                        />
                      </div>
                    </div>
                    
                    {/* Accent Color */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Accent Color
                      </label>
                      <div className="flex items-center">
                        <input
                          type="color"
                          value={customTheme.accentColor}
                          onChange={(e) => updateCustomTheme('accentColor', e.target.value)}
                          className="w-10 h-10 rounded border border-gray-300 mr-2"
                        />
                        <input
                          type="text"
                          value={customTheme.accentColor}
                          onChange={(e) => updateCustomTheme('accentColor', e.target.value)}
                          className="flex-1 rounded-md border border-gray-300 p-2 text-sm"
                        />
                      </div>
                    </div>
                    
                    {/* Background Color */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Background Color
                      </label>
                      <div className="flex items-center">
                        <input
                          type="color"
                          value={customTheme.backgroundColor}
                          onChange={(e) => updateCustomTheme('backgroundColor', e.target.value)}
                          className="w-10 h-10 rounded border border-gray-300 mr-2"
                        />
                        <input
                          type="text"
                          value={customTheme.backgroundColor}
                          onChange={(e) => updateCustomTheme('backgroundColor', e.target.value)}
                          className="flex-1 rounded-md border border-gray-300 p-2 text-sm"
                        />
                      </div>
                    </div>
                    
                    {/* Font Family (Title) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title Font
                      </label>
                      <select
                        value={customTheme.fontTitle}
                        onChange={(e) => updateCustomTheme('fontTitle', e.target.value)}
                        className="w-full rounded-md border border-gray-300 p-2 text-sm"
                      >
                        <option value="Arial, sans-serif">Arial</option>
                        <option value="Helvetica, sans-serif">Helvetica</option>
                        <option value="Georgia, serif">Georgia</option>
                        <option value="Times New Roman, serif">Times New Roman</option>
                        <option value="Roboto, sans-serif">Roboto</option>
                        <option value="Montserrat, sans-serif">Montserrat</option>
                        <option value="Open Sans, sans-serif">Open Sans</option>
                        <option value="Lato, sans-serif">Lato</option>
                      </select>
                    </div>
                    
                    {/* Font Family (Body) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Body Font
                      </label>
                      <select
                        value={customTheme.fontBody}
                        onChange={(e) => updateCustomTheme('fontBody', e.target.value)}
                        className="w-full rounded-md border border-gray-300 p-2 text-sm"
                      >
                        <option value="Arial, sans-serif">Arial</option>
                        <option value="Helvetica, sans-serif">Helvetica</option>
                        <option value="Georgia, serif">Georgia</option>
                        <option value="Times New Roman, serif">Times New Roman</option>
                        <option value="Roboto, sans-serif">Roboto</option>
                        <option value="Open Sans, sans-serif">Open Sans</option>
                        <option value="Lato, sans-serif">Lato</option>
                        <option value="Verdana, sans-serif">Verdana</option>
                      </select>
                    </div>
                    
                    {/* Background Style */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Background Style
                      </label>
                      <select
                        value={customTheme.backgroundStyle}
                        onChange={(e) => updateCustomTheme('backgroundStyle', e.target.value as 'solid' | 'gradient' | 'image' | 'pattern')}
                        className="w-full rounded-md border border-gray-300 p-2 text-sm"
                      >
                        <option value="solid">Solid Color</option>
                        <option value="gradient">Gradient</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={resetCustomTheme}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Reset
                    </button>
                    <button
                      onClick={applyCustomTheme}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                    >
                      Apply Custom Theme
                    </button>
                  </div>
                </div>
                
                {/* Preview */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <h3 className="font-medium text-gray-700">Preview</h3>
                  </div>
                  <div 
                    className="h-80 p-6"
                    style={{ 
                      background: customTheme.backgroundStyle === 'gradient'
                        ? `linear-gradient(135deg, ${customTheme.primaryColor} 0%, ${customTheme.secondaryColor} 100%)`
                        : customTheme.backgroundColor
                    }}
                  >
                    <div 
                      className="text-2xl font-bold mb-4"
                      style={{ 
                        color: customTheme.backgroundStyle === 'gradient' ? '#ffffff' : customTheme.primaryColor,
                        fontFamily: customTheme.fontTitle
                      }}
                    >
                      {presentationTitle}
                    </div>
                    <div 
                      className="mb-3"
                      style={{ 
                        color: customTheme.backgroundStyle === 'gradient' ? '#ffffff' : customTheme.secondaryColor,
                        fontFamily: customTheme.fontBody
                      }}
                    >
                      <div className="mb-2">Slide content preview:</div>
                      <ul className="space-y-2">
                        <li>• First key point of your presentation</li>
                        <li>• Important information for your audience</li>
                        <li>• Data-driven insights and analysis</li>
                      </ul>
                    </div>
                    <div 
                      className="text-sm mt-6 text-right"
                      style={{ color: customTheme.accentColor }}
                    >
                      Accent element
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-between">
            <button
              onClick={onBack}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100"
            >
              Back
            </button>
            {activeTab === 'preset' && (
              <div className="text-sm text-gray-500 flex items-center">
                <span>Select a theme and we'll automatically generate images to match</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector; 