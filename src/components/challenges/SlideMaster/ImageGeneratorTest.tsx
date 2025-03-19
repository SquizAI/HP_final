import React, { useState, useEffect } from 'react';
import { 
  generateImage, 
  generateMultipleImages, 
  getRemainingCredits, 
  resetCredits 
} from '../../../utils/fluxImageGenerator';

/**
 * Test component for the Flux Image Generator
 * This component allows testing the image generation functionality
 * with different prompts and options.
 */
const ImageGeneratorTest: React.FC = () => {
  const [prompt, setPrompt] = useState('A professional business presentation slide about innovation');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useIdeogram, setUseIdeogram] = useState(true);
  const [size, setSize] = useState<'square' | 'portrait' | 'landscape'>('landscape');
  const [style, setStyle] = useState<string>('realistic');
  const [credits, setCredits] = useState(getRemainingCredits());

  // Update credits whenever they change
  useEffect(() => {
    const updateCredits = () => {
      setCredits(getRemainingCredits());
    };
    
    // Update initially
    updateCredits();
    
    // Set up an interval to check credits regularly
    const intervalId = setInterval(updateCredits, 2000);
    
    // Cleanup
    return () => clearInterval(intervalId);
  }, []);

  // Generate a single image
  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const url = await generateImage(prompt, {
        useIdeogram,
        size,
        style,
        negative_prompt: 'blurry, distorted, low quality, text, watermark'
      });
      
      setImageUrl(url);
      // Update credits after generation
      setCredits(getRemainingCredits());
    } catch (err) {
      console.error('Error generating image:', err);
      setError('Failed to generate image. See console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate multiple test images
  const handleGenerateMultiple = async () => {
    setIsLoading(true);
    setError(null);
    
    const testPrompts = [
      'A business graph showing growth',
      'A team collaborating on a project',
      'Innovation and technology concept',
      'Data visualization dashboard'
    ];
    
    try {
      const urls = await generateMultipleImages(testPrompts, {
        useIdeogram,
        size,
        style
      });
      
      // Just display the first image
      if (urls.length > 0) {
        setImageUrl(urls[0]);
      }
      
      console.log('Generated multiple images:', urls);
      // Update credits after generation
      setCredits(getRemainingCredits());
    } catch (err) {
      console.error('Error generating multiple images:', err);
      setError('Failed to generate multiple images. See console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resetting credits
  const handleResetCredits = () => {
    resetCredits();
    setCredits(getRemainingCredits());
  };

  // Helper function to get available style options based on the selected model
  const getStyleOptions = () => {
    if (useIdeogram) {
      // Valid styles for Ideogram V2
      return [
        { value: 'auto', label: 'Auto' },
        { value: 'general', label: 'General' },
        { value: 'realistic', label: 'Realistic' },
        { value: 'design', label: 'Design' },
        { value: 'render_3D', label: '3D Render' },
        { value: 'anime', label: 'Anime' }
      ];
    } else {
      // Recraft doesn't have specific style options in the same way
      return [
        { value: 'default', label: 'Default' }
      ];
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Image Generator Test</h1>
      
      {/* Credits display */}
      <div 
        style={{ 
          marginBottom: '20px', 
          padding: '10px', 
          backgroundColor: credits > 5 ? '#e8f5e9' : '#fff3e0', 
          borderRadius: '4px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div>
          <strong>Remaining Credits:</strong> {credits} / {20}
          <div style={{ fontSize: '0.9em', color: '#666' }}>
            Each user is limited to 20 image generations (approximately 2 presentations).
          </div>
        </div>
        <button
          onClick={handleResetCredits}
          style={{
            padding: '8px 12px',
            backgroundColor: '#f5f5f5',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reset Credits
        </button>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px' }}>
          Prompt:
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '8px', 
              borderRadius: '4px',
              border: '1px solid #ccc',
              minHeight: '80px'
            }}
          />
        </label>
      </div>
      
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <div>
          <label style={{ marginRight: '10px' }}>
            <input
              type="checkbox"
              checked={useIdeogram}
              onChange={(e) => {
                setUseIdeogram(e.target.checked);
                // Reset style to a valid option for the selected model
                setStyle(e.target.checked ? 'realistic' : 'default');
              }}
            />
            Use Ideogram V2 (uncheck for Recraft)
          </label>
        </div>
        
        <div>
          <label>
            Size:
            <select 
              value={size}
              onChange={(e) => setSize(e.target.value as any)}
              style={{ marginLeft: '5px', padding: '4px' }}
            >
              <option value="square">Square</option>
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </label>
        </div>
        
        <div>
          <label>
            Style:
            <select 
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              style={{ marginLeft: '5px', padding: '4px' }}
            >
              {getStyleOptions().map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button
          onClick={handleGenerateImage}
          disabled={isLoading || credits <= 0}
          style={{
            padding: '8px 16px',
            backgroundColor: credits > 0 ? '#4CAF50' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: credits > 0 && !isLoading ? 'pointer' : 'not-allowed',
            opacity: isLoading ? 0.7 : 1
          }}
        >
          {isLoading ? 'Generating...' : 'Generate Image'}
        </button>
        
        <button
          onClick={handleGenerateMultiple}
          disabled={isLoading || credits < 4}
          style={{
            padding: '8px 16px',
            backgroundColor: credits >= 4 ? '#2196F3' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: credits >= 4 && !isLoading ? 'pointer' : 'not-allowed',
            opacity: isLoading ? 0.7 : 1
          }}
        >
          Test Multiple Images
        </button>
      </div>
      
      {error && (
        <div style={{ 
          marginBottom: '20px', 
          padding: '10px', 
          backgroundColor: '#ffebee', 
          color: '#c62828',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}
      
      {credits <= 0 && (
        <div style={{ 
          marginBottom: '20px', 
          padding: '10px', 
          backgroundColor: '#fff3e0', 
          color: '#e65100',
          borderRadius: '4px'
        }}>
          <strong>Credit limit reached.</strong> Each user is limited to 20 image generations. 
          For more credits, please contact support for custom solutions.
        </div>
      )}
      
      {imageUrl && (
        <div style={{ marginTop: '20px' }}>
          <h2>Generated Image:</h2>
          <img 
            src={imageUrl} 
            alt="Generated from prompt" 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '500px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }} 
          />
          <p style={{ marginTop: '10px', wordBreak: 'break-all' }}>
            <strong>Image URL:</strong> {imageUrl}
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageGeneratorTest; 