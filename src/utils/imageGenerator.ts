// Real implementation for DALL-E image generation
import { getOpenAIKey, shouldUseMockData, getDALLEModel } from './envConfig';

export interface ImageGenerationOptions {
  size?: '1024x1024' | '1792x1024' | '1024x1792' | '512x512' | '256x256';
  style?: 'natural' | 'vivid';
  quality?: 'standard' | 'hd';
  model?: 'dall-e-3' | 'dall-e-2';
  retry?: boolean;
}

// Fallback placeholder images for error conditions
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d', // Tech/laptop
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809', // Abstract
  'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107', // Data/business
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f', // Team/people
];

// Rate limiting parameters
let lastRequestTime = 0;
let requestsThisMinute = 0;
const MAX_REQUESTS_PER_MINUTE = 7; // OpenAI's limit is 7 per minute
const RATE_LIMIT_RESET_INTERVAL = 60 * 1000; // 1 minute in milliseconds
const RATE_LIMIT_DELAY = 1000; // Delay between requests

// Reset the rate limit counter every minute
setInterval(() => {
  requestsThisMinute = 0;
  console.log('Image generation rate limit counter reset');
}, RATE_LIMIT_RESET_INTERVAL);

/**
 * Sleep helper function for rate limiting
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Check if we can make another request, or need to wait
 * Returns the time to wait in milliseconds
 */
async function checkRateLimit(): Promise<number> {
  const now = Date.now();
  
  // If we've reached the limit, calculate time until next request
  if (requestsThisMinute >= MAX_REQUESTS_PER_MINUTE) {
    const timeElapsedSinceFirst = now - lastRequestTime;
    const timeToWait = Math.max(RATE_LIMIT_RESET_INTERVAL - timeElapsedSinceFirst, 0);
    console.log(`Rate limit reached, need to wait ${timeToWait}ms`);
    return timeToWait;
  }
  
  // If not at limit but need to space requests
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < RATE_LIMIT_DELAY && requestsThisMinute > 0) {
    console.log(`Spacing requests, need to wait ${RATE_LIMIT_DELAY - timeSinceLastRequest}ms`);
    return RATE_LIMIT_DELAY - timeSinceLastRequest;
  }
  
  // No need to wait
  return 0;
}

/**
 * Generate an image using OpenAI DALL-E API based on a prompt
 */
export async function generateImage(
  prompt: string, 
  options: ImageGenerationOptions = {}
): Promise<string> {
  console.log(`Generating image with prompt: "${prompt}"`);
  
  try {
    // Get the API key - if not available, use mock images
    const apiKey = getOpenAIKey();
    if (!apiKey || apiKey === 'not-a-real-key' || apiKey === '%REACT_APP_OPENAI_API_KEY%' || shouldUseMockData()) {
      console.log('Using mock image because API key is not properly configured');
      return getMockImage(prompt);
    }

    // Handle rate limiting - wait if necessary
    const timeToWait = await checkRateLimit();
    if (timeToWait > 0) {
      if (options.retry !== false) {
        console.log(`Waiting ${timeToWait}ms due to rate limiting before generating image`);
        await sleep(timeToWait);
        // Try again after waiting
        return generateImage(prompt, { ...options, retry: false });
      } else {
        // If this is already a retry, use a mock image instead of waiting again
        console.log('Using mock image due to rate limiting');
        return getMockImage(prompt);
      }
    }
    
    // Increment rate limit counters
    requestsThisMinute++;
    lastRequestTime = Date.now();

    // Enhance the prompt to get better results
    const enhancedPrompt = enhanceImagePrompt(prompt);
    
    // Prepare API call - optimize for high volume
    // Use DALL-E 2 with smaller sizes when possible for faster generation and lower cost
    const useHighVolumeSetting = options.model === 'dall-e-2' || options.size === '512x512' || options.size === '256x256';
    const model = options.model || (useHighVolumeSetting ? 'dall-e-2' : getDALLEModel() || 'dall-e-3');
    const size = options.size || (useHighVolumeSetting ? '512x512' : '1024x1024');
    const style = model === 'dall-e-3' ? (options.style || 'vivid') : undefined;
    const quality = model === 'dall-e-3' ? (options.quality || 'standard') : undefined;
    
    // Log what we're using
    console.log(`Making DALL-E API call with model: ${model}, size: ${size}`);
    
    const url = 'https://api.openai.com/v1/images/generations';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };
    
    // Request body with all proper parameters
    const body: any = {
      model: model,
      prompt: enhancedPrompt,
      n: 1,
      size: size,
      response_format: "url"
    };
    
    // Only add style and quality for DALL-E 3
    if (model === 'dall-e-3') {
      body.style = style;
      body.quality = quality;
    }
    
    // Make the request
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    });
    
    // Handle response
    if (!response.ok) {
      const errorData = await response.json();
      console.error('DALL-E API error:', errorData);
      
      // Special handling for rate limit errors
      if (response.status === 429 && options.retry !== false) {
        console.log('Rate limit exceeded, trying again with backoff...');
        requestsThisMinute = MAX_REQUESTS_PER_MINUTE; // Force waiting
        await sleep(10000); // 10 second backoff
        return generateImage(prompt, { ...options, retry: false });
      }
      
      throw new Error(`DALL-E API error: ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    
    console.log('DALL-E API response received successfully');
    
    // Return the image URL
    if (data.data && data.data.length > 0 && data.data[0].url) {
      return data.data[0].url;
    } else {
      throw new Error('No image URL returned from DALL-E API');
    }
  } catch (error) {
    console.error('Error generating image:', error);
    // Fall back to mock images on error
    return getMockImage(prompt);
  }
}

/**
 * Generate multiple images based on an array of prompts with rate limiting
 */
export async function generateMultipleImages(prompts: string[]): Promise<string[]> {
  try {
    console.log(`Generating ${prompts.length} images with rate limiting`);
    
    // For high volume, use smaller images and DALL-E 2 as options
    const options: ImageGenerationOptions = {
      model: prompts.length > 5 ? 'dall-e-2' : 'dall-e-3',
      size: prompts.length > 5 ? '512x512' : '1024x1024'
    };
    
    // Process images sequentially with rate limiting
    const results: string[] = [];
    for (const prompt of prompts) {
      const imageUrl = await generateImage(prompt, options);
      results.push(imageUrl);
    }
    
    return results;
  } catch (error) {
    console.error('Error generating multiple images:', error);
    // Return mock images
    return prompts.map(prompt => getMockImage(prompt));
  }
}

/**
 * Generate batches of images for high-volume scenarios
 * This processes a batch of prompts with a delay between batches
 */
export async function generateImageBatches(allPrompts: string[], batchSize = 5): Promise<string[]> {
  const results: string[] = [];
  const batches: string[][] = [];
  
  // Split into batches
  for (let i = 0; i < allPrompts.length; i += batchSize) {
    batches.push(allPrompts.slice(i, i + batchSize));
  }
  
  console.log(`Processing ${batches.length} batches of images`);
  
  // Process each batch with a delay between batches
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(`Processing batch ${i+1} of ${batches.length}`);
    
    // Generate this batch
    const batchResults = await generateMultipleImages(batch);
    results.push(...batchResults);
    
    // Add delay between batches if not the last batch
    if (i < batches.length - 1) {
      console.log('Waiting between batches...');
      await sleep(5000); // 5 second delay between batches
    }
  }
  
  return results;
}

/**
 * Generate an image prompt based on slide content
 */
export function generateImagePromptFromSlide(slideTitle: string, slideContent: string = ''): string {
  // Create a better prompt by focusing on the most important content
  let contentSample = '';
  
  // Extract core content from slide content
  if (slideContent) {
    // Remove any image tags or notes
    const cleanContent = slideContent
      .replace(/\[IMAGE:.*?\]/g, '')
      .replace(/\[NOTES:.*?\]/g, '')
      .trim();
      
    // Use first few words only to keep it focused
    contentSample = cleanContent.split(' ').slice(0, 15).join(' ');
  }
  
  const basePrompt = `${slideTitle} ${contentSample}`.trim();
  return enhanceImagePrompt(basePrompt);
}

/**
 * Enhance an image prompt with additional details to get better results
 */
function enhanceImagePrompt(prompt: string): string {
  // High-quality image prompting techniques for DALL-E 3
  // This helps ensure better image quality and adherence to prompts
  
  // Check if the prompt is already detailed
  if (prompt.length > 100) return prompt;
  
  // Basic improvement for short prompts
  let enhancedPrompt = prompt;
  
  // Add style specification if not present
  if (!prompt.toLowerCase().includes("style") && !prompt.toLowerCase().includes("design")) {
    enhancedPrompt += ", in a modern professional presentation style";
  }
  
  // Add quality indicators
  if (!prompt.toLowerCase().includes("high quality") && !prompt.toLowerCase().includes("detailed")) {
    enhancedPrompt += ", high-quality image with clear details";
  }
  
  // Add lighting/composition guidance
  if (!prompt.toLowerCase().includes("lighting") && !prompt.toLowerCase().includes("composition")) {
    enhancedPrompt += ", well-composed with balanced lighting";
  }
  
  return enhancedPrompt;
}

/**
 * Get a mock image URL based on the prompt
 */
function getMockImage(prompt: string): string {
  // List of high-quality stock placeholder images that look professional
  const placeholderImages = [
    'https://images.unsplash.com/photo-1661956602926-db6b25f75947?q=80&w=870&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1579567761406-4684ee0c75b6?q=80&w=387&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1496065187959-7f07b8353c55?q=80&w=870&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=870&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=870&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?q=80&w=870&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=388&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522152302542-71a8e5172aa1?q=80&w=829&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=870&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=870&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?q=80&w=1470&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1613963931023-5dc59437c8a6?q=80&w=1469&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=1470&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=1470&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1470&auto=format&fit=crop'
  ];
  
  // Deterministic-ish selection based on the prompt
  const hash = prompt.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = hash % placeholderImages.length;
  
  return placeholderImages[index];
}

export default {
  generateImage,
  generateMultipleImages,
  generateImageBatches,
  generateImagePromptFromSlide
}; 