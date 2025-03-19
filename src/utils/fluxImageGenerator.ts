/**
 * Flux Image Generator
 * Uses the fal.ai API with Ideogram V2 model for high-quality presentation images
 */
import { createFalClient } from '@fal-ai/client';

// Update the isFalDisabled check to always enable FAL
const isFalDisabled = false;

// Mock function to get a placeholder image
const getPlaceholderImage = (seed: string = ''): string => {
  const imageId = Math.abs(seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 1000) || Date.now() % 1000;
  return `https://picsum.photos/seed/${imageId}/800/600`;
};

// Import the centralized API configuration service
import { getFalAIConfig } from '../services/apiConfig';

// Get FAL API key from centralized service
const getFalApiKey = (): string => {
  const { apiKey } = getFalAIConfig();
  if (apiKey && !isFalDisabled) {
    return apiKey;
  }
  // Default value for development only
  console.warn('Warning: FAL.AI API key not found in configuration or FAL is disabled');
  return '';
};

// Create a proxy function that doesn't expose credentials directly
const getFalClient = () => {
  // In production, this should be handled through a secure backend proxy
  // This is a temporary solution for development only
  if (import.meta.env.MODE === 'production') {
    console.warn('For production use, FAL API calls should be proxied through a secure backend');
  }
  
  // SECURITY FIX: Check if we have a proxy URL configured - if so, use that instead of direct credentials
  if (import.meta.env.VITE_FAL_PROXY_URL) {
    return createFalClient({
      proxyUrl: import.meta.env.VITE_FAL_PROXY_URL,
    });
  }
  
  // Only for local development - in production, this should be handled by a secure proxy
  console.log('Using direct FAL API access - not recommended for production.');
  return createFalClient({
    credentials: getFalApiKey(),
  });
};

// Create the client instance
const falClient = getFalClient();

// Model IDs for different image generation services
const IDEOGRAM_MODEL_ID = 'fal-ai/ideogram/v2';
const RECRAFT_MODEL_ID = 'fal-ai/recraft-20b';

// Text content filters - some models have specific words they can't process
const PROHIBITED_WORDS_RECRAFT = [
  'nude', 'naked', 'nsfw', 'porn', 'sex', 'explicit', 
  'obscene', 'blood', 'gore', 'violent', 'death', 'kill', 
  'suicide', 'terrorist', 'torture', 'illegal', 'drug'
];

// Interface for image generation options
export interface FluxImageGenerationOptions {
  size?: 'square' | 'portrait' | 'landscape' | string;
  style?: string;
  quality?: 'standard' | 'hd';
  negative_prompt?: string;
  useIdeogram?: boolean; // Toggle between Ideogram and Recraft
}

// Response type for FAL.ai image generation
interface FalImageResponse {
  images: Array<{
    url: string;
    width?: number;
    height?: number;
  }>;
  // Add other fields as needed
}

// Default fallback images for when generation fails
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d', // Tech/laptop
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809', // Abstract
  'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107', // Data/business
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f', // Team/people
];

// Rate limiting variables
let requestCounter = 0;
let lastRequestTime = Date.now();
const RATE_LIMIT = 10; // Requests per minute - adjust based on your plan
const RATE_RESET_TIME = 60 * 1000; // 1 minute in ms

// Credit system for user limits (2 presentations per user)
// Each presentation generates ~10 images, so 20 credits = 2 presentations
const MAX_USER_CREDITS = 20;
let remainingCredits = MAX_USER_CREDITS;
let hasWarned = false;

/**
 * Get the number of remaining image generation credits
 * For the business rule of 2 presentations per person
 */
export function getRemainingCredits(): number {
  return remainingCredits;
}

/**
 * Reset the user's image generation credits
 * Use this when starting a new session
 */
export function resetCredits(): void {
  remainingCredits = MAX_USER_CREDITS;
  hasWarned = false;
  console.log(`Credits reset. Remaining: ${remainingCredits}`);
}

/**
 * Check if the user has enough credits to generate images
 * @returns boolean indicating if user can generate more images
 */
function hasEnoughCredits(requestCount: number = 1): boolean {
  if (remainingCredits < requestCount) {
    if (!hasWarned) {
      console.warn(`Credits limit reached. User has used their allotted ${MAX_USER_CREDITS} credits. For more credits, please contact support.`);
      hasWarned = true;
    }
    return false;
  }
  return true;
}

// Reset the rate limit counter every minute
setInterval(() => {
  requestCounter = 0;
  console.log('Flux API rate limit counter reset');
}, RATE_RESET_TIME);

/**
 * Sleep helper function for rate limiting
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Filter a prompt to remove prohibited words for sensitive models
 */
function filterPrompt(prompt: string, useIdeogram: boolean): string {
  // Ideogram V2 can handle most content, so we only filter for Recraft
  if (!useIdeogram) {
    let filteredPrompt = prompt;
    PROHIBITED_WORDS_RECRAFT.forEach(word => {
      // Use a regex to match the word as a whole word, not as part of other words
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      filteredPrompt = filteredPrompt.replace(regex, '');
    });
    return filteredPrompt.trim();
  }
  return prompt;
}

/**
 * Modify enhanceImagePrompt to handle both string and object prompts
 */
function enhanceImagePrompt(promptInput: string | { prompt: string; useIdeogram: boolean }, useIdeogramParam: boolean = true): string {
  // Extract the prompt and useIdeogram flag from the input
  let prompt: string;
  let useIdeogram: boolean;
  
  if (typeof promptInput === 'string') {
    prompt = promptInput;
    useIdeogram = useIdeogramParam;
  } else if (promptInput && typeof promptInput === 'object' && 'prompt' in promptInput) {
    prompt = promptInput.prompt;
    useIdeogram = promptInput.useIdeogram !== undefined ? promptInput.useIdeogram : useIdeogramParam;
  } else {
    // Default empty prompt if input is invalid
    console.warn('Invalid prompt input:', promptInput);
    return '';
  }
  
  // Skip enhancement for very short prompts or empty prompts
  if (!prompt || prompt.length < 150) {
    return prompt;
  }

  // Rest of the function remains the same, using the extracted prompt
  const promptLower = prompt.toLowerCase();
  
  // Check if the prompt already contains specific elements
  const hasStyle = /style|aesthetic|look|visual|design/.test(promptLower);
  const hasVisualizationType = /chart|diagram|graph|illustration|infographic|visualization/.test(promptLower);
  const hasQualityIndicators = /high[ -]quality|detailed|professional|crisp|clear|sharp/.test(promptLower);
  const hasPresentationContext = /slide|presentation|deck|keynote|powerpoint/.test(promptLower);
  const hasLighting = /lighting|light|shadow|bright|dim/.test(promptLower);
  
  // Apply model-specific enhancements
  if (useIdeogram) {
    // Ideogram V2 is good at typography and illustrations
    if (!hasStyle) {
      prompt += ", clean vector style, minimalist illustration";
    }
    if (!hasQualityIndicators) {
      prompt += ", high-quality presentation graphic";
    }
    if (!hasPresentationContext) {
      prompt += ", perfect for business presentation";
    }
  } else {
    // Recraft is better at realistic styles
    if (!hasStyle) {
      prompt += ", professional realistic style";
    }
    if (!hasQualityIndicators) {
      prompt += ", highly detailed, 4K resolution";
    }
    if (!hasLighting) {
      prompt += ", well-lit environment";
    }
  }

  return prompt;
}

/**
 * Update generateImage to handle object prompts
 */
export async function generateImage(
  promptInput: string | { prompt: string; useIdeogram: boolean },
  options: FluxImageGenerationOptions = {}
): Promise<string> {
  // Check if we have enough credits
  if (!hasEnoughCredits()) {
    console.warn('Credit limit reached, using mock image instead');
    return getMockImage(promptInput);
  }

  // Extract the prompt and useIdeogram flag
  let promptText: string;
  let useIdeogram: boolean = options.useIdeogram !== false; // Default to true
  
  if (typeof promptInput === 'string') {
    promptText = promptInput;
  } else {
    promptText = promptInput.prompt;
    useIdeogram = promptInput.useIdeogram;
  }

  // Apply content filtering
  promptText = filterPrompt(promptText, useIdeogram);

  // Apply prompt enhancements
  const enhancedPrompt = enhanceImagePrompt(promptText, useIdeogram);

  // For very short or empty prompts, return a placeholder image
  if (!enhancedPrompt || enhancedPrompt.length < 10) {
    console.warn('Prompt too short, using mock image');
    return getMockImage(promptText);
  }

  // Default to Ideogram V2 for high-quality images
  const modelId = useIdeogram ? IDEOGRAM_MODEL_ID : RECRAFT_MODEL_ID;
  
  console.log(`Generating image with Fal.ai ${useIdeogram ? 'Ideogram V2' : 'Recraft'}: "${promptText}"`);
  
  // Rate limiting check
  if (requestCounter >= RATE_LIMIT) {
    const waitTime = RATE_RESET_TIME - (Date.now() - lastRequestTime);
    if (waitTime > 0) {
      console.log(`Rate limit reached, waiting ${waitTime}ms`);
      await sleep(waitTime);
    }
    requestCounter = 0;
  }
  
  // Prepare the request parameters based on the model
  let input: any;
  
  if (useIdeogram) {
    // Ideogram V2 parameters with correct schema
    let aspectRatio = '1:1'; // default to square
    
    // Map size options to aspect ratios
    if (options.size) {
      if (options.size === 'portrait') {
        aspectRatio = '9:16';
      } else if (options.size === 'landscape') {
        aspectRatio = '16:9';
      } else if (typeof options.size === 'string' && options.size.includes('x')) {
        // Custom dimensions like '512x512' - convert to closest aspect ratio
        const [width, height] = options.size.split('x').map(Number);
        if (width && height) {
          if (width > height) {
            aspectRatio = width/height >= 1.6 ? '16:9' : '4:3';
          } else if (height > width) {
            aspectRatio = height/width >= 1.6 ? '9:16' : '3:4';
          } else {
            aspectRatio = '1:1';
          }
        }
      }
    }
    
    // Ensure we use valid values for Ideogram V2
    // Valid styles: 'auto', 'general', 'realistic', 'design', 'render_3D', 'anime'
    const validStyles = ['auto', 'general', 'realistic', 'design', 'render_3D', 'anime'];
    const style = options.style && validStyles.includes(options.style) 
      ? options.style 
      : 'realistic'; // default to 'realistic' if invalid or not provided
    
    input = {
      prompt: enhancedPrompt,
      negative_prompt: options.negative_prompt || 'blurry, distorted, low quality, text, watermark, logo',
      style,
      aspect_ratio: aspectRatio,
      expand_prompt: true // Allow the model to enhance the prompt
    };
  } else {
    // Recraft parameters
    const aspectRatio = options.size === 'portrait' ? '3:4' : 
                       options.size === 'landscape' ? '4:3' : 
                       '1:1'; // default to square
    
    input = {
      prompt: enhancedPrompt,
      negative_prompt: options.negative_prompt || 'blurry, distorted, low quality, disfigured, text, watermark',
      aspect_ratio: aspectRatio,
      num_images: 1,
      seed: Math.floor(Math.random() * 1000000) // Random seed for variety
    };
  }
  
  // Increment the request counter and update last request time
  requestCounter++;
  lastRequestTime = Date.now();
  
  try {
    // Instead of direct client.subscribe, use a try-catch block to handle credential errors
    const result = await falClient.subscribe(modelId, {
      input: input,
      logs: true,
      onQueueUpdate: (update: any) => {
        if (update.status === "IN_PROGRESS" && update.logs) {
          update.logs.forEach((log: any) => console.log(log.message));
        } else if (update.status === "FAILED") {
          console.error("Queue update failed:", update);
        }
      }
    }).catch(error => {
      console.error('Authentication error with Fal.ai. Using mock image instead.');
      return { data: null };
    });
    
    console.log('Fal.ai API response received successfully');
    
    // Extract the image URL from the response
    if (result && result.data) {
      const responseData = result.data as FalImageResponse;
      if (responseData.images && responseData.images.length > 0 && responseData.images[0].url) {
        // Successful generation, decrement credits
        remainingCredits = Math.max(0, remainingCredits - 1);
        console.log(`Image generated successfully. Remaining credits: ${remainingCredits}`);
        return responseData.images[0].url;
      }
    }
    
    throw new Error('No image URL in Fal.ai API response');
  } catch (error: any) {
    console.error('Error from fal.ai API:', error);
    
    // Log detailed validation errors if available
    if (error.body && error.body.detail) {
      console.error('Validation errors:', JSON.stringify(error.body.detail, null, 2));
    }
    
    // Fall back to mock images on error
    return getMockImage(promptText);
  }
}

/**
 * Update generateMultipleImages to handle object prompts
 */
export async function generateMultipleImages(
  prompts: (string | { prompt: string; useIdeogram: boolean })[], 
  options: FluxImageGenerationOptions = {}
): Promise<string[]> {
  // Limit to 6 prompts maximum
  const limitedPrompts = prompts.slice(0, 6);
  
  try {
    // Process prompts in parallel with rate limiting
    const promises = limitedPrompts.map(async (promptInput, index) => {
      // Add delay between requests to avoid rate limiting
      if (index > 0) {
        await sleep(1500); // 1.5 second between requests
      }
      return generateImage(promptInput, options);
    });
    
    return await Promise.all(promises);
  } catch (error) {
    console.error('Error generating multiple images:', error);
    // Fallback to mock images
    return limitedPrompts.map(prompt => getMockImage(prompt));
  }
}

/**
 * Update generateImageBatches to respect the 6-image limit
 */
export async function generateImageBatches(
  allPrompts: (string | { prompt: string; useIdeogram: boolean })[], 
  batchSize = 5,
  options: FluxImageGenerationOptions = {}
): Promise<string[]> {
  // Limit to 6 prompts maximum
  const limitedPrompts = allPrompts.slice(0, 6);
  
  const results: string[] = [];
  const batches: (string | { prompt: string; useIdeogram: boolean })[][] = [];
  
  // Split into batches
  for (let i = 0; i < limitedPrompts.length; i += batchSize) {
    batches.push(limitedPrompts.slice(i, i + batchSize));
  }
  
  console.log(`Processing ${batches.length} batches of images`);
  
  // Process each batch
  for (let i = 0; i < batches.length; i++) {
    console.log(`Processing batch ${i + 1} of ${batches.length}`);
    const batchResults = await generateMultipleImages(batches[i], options);
    results.push(...batchResults);
  }
  
  return results;
}

/**
 * Generate an image prompt based on slide content
 * This now intelligently selects the appropriate model based on slide content
 */
export function generateImagePromptFromSlide(slideTitle: string, slideContent: string = '', slideType?: string): { prompt: string; useIdeogram: boolean } {
  // Create a better prompt by focusing on the most important content
  let contentSample = '';
  let detectedSlideType = slideType || '';
  
  // Determine if this slide needs text rendering (for Ideogram V2) or just images (for Recraft)
  let requiresText = false;
  
  // Detect slide type from the title to customize the prompt
  const titleLower = slideTitle.toLowerCase();
  if (titleLower.includes('introduction') || titleLower.includes('overview')) {
    detectedSlideType = 'introduction';
  } else if (titleLower.includes('conclusion') || titleLower.includes('summary')) {
    detectedSlideType = 'conclusion';
  } else if (titleLower.includes('data') || titleLower.includes('statistics') || titleLower.includes('numbers')) {
    detectedSlideType = 'data';
    requiresText = true; // Data slides often need labels and numbers
  } else if (titleLower.includes('timeline') || titleLower.includes('history')) {
    detectedSlideType = 'timeline';
    requiresText = true; // Timelines typically have dates/text
  } else if (titleLower.includes('comparison') || titleLower.includes('versus') || titleLower.includes('vs')) {
    detectedSlideType = 'comparison';
    requiresText = true; // Comparisons often have labels
  } else if (titleLower.includes('team') || titleLower.includes('people') || titleLower.includes('staff')) {
    detectedSlideType = 'team';
  } else if (titleLower.includes('process') || titleLower.includes('workflow') || titleLower.includes('steps')) {
    detectedSlideType = 'process';
    requiresText = true; // Process flows typically have step labels
  } else if (titleLower.includes('quote') || titleLower.includes('testimonial')) {
    detectedSlideType = 'quote';
    requiresText = true; // Quotes are text-heavy
  } else if (titleLower.includes('chart') || titleLower.includes('graph')) {
    detectedSlideType = 'chart';
    requiresText = true; // Charts need axis labels
  } else if (titleLower.includes('agenda') || titleLower.includes('outline')) {
    detectedSlideType = 'agenda';
    requiresText = true; // Agendas are text-heavy
  }
  
  // Extract core content from slide content
  if (slideContent) {
    // Remove any image tags or notes
    const cleanContent = slideContent
      .replace(/\[IMAGE:.*?\]/g, '')
      .replace(/\[NOTES:.*?\]/g, '')
      .trim();
    
    // Get key phrases or terms (up to 20 words, but keep important context)
    const words = cleanContent.split(' ');
    contentSample = words.slice(0, Math.min(20, words.length)).join(' ');
    
    // Look for key indicators in content
    if (contentSample.match(/\d{4}/)) {
      // Contains years, might be historical or timeline
      if (!detectedSlideType) detectedSlideType = 'timeline';
      requiresText = true; // Dates are text
    }
    
    if (contentSample.match(/\d+%/) || contentSample.match(/\$\d+/)) {
      // Contains percentages or dollar amounts, likely data
      if (!detectedSlideType) detectedSlideType = 'data';
      requiresText = true; // Numbers are text
    }
    
    // Check for quotation marks which indicate quotes
    if (contentSample.includes('"') || contentSample.includes('"') || contentSample.includes('"')) {
      if (!detectedSlideType) detectedSlideType = 'quote';
      requiresText = true; // Quotes are text
    }
    
    // Check if this might be a list/bullets slide
    if (contentSample.includes('\n- ') || contentSample.includes('\n• ') || contentSample.includes('\n* ')) {
      requiresText = true; // Bulleted lists need text
    }
  }
  
  // Create a base prompt combining title and content
  let basePrompt = `${slideTitle} ${contentSample}`.trim();
  
  // Add slide type specific enhancements
  if (detectedSlideType) {
    switch (detectedSlideType) {
      case 'introduction':
        basePrompt = `Professional concept visualization of ${basePrompt}, welcoming and engaging`;
        break;
      case 'data':
        basePrompt = `Visual representation of data: ${basePrompt}, data visualization, infographic style`;
        requiresText = true;
        break;
      case 'timeline':
        basePrompt = `Timeline visual showing progression of ${basePrompt}, chronological, flow`;
        requiresText = true;
        break;
      case 'comparison':
        basePrompt = `Side-by-side comparison visualization of ${basePrompt}, contrasting elements`;
        requiresText = true;
        break;
      case 'team':
        basePrompt = `Professional team collaboration image related to ${basePrompt}, diverse business setting`;
        break;
      case 'process':
        basePrompt = `Step-by-step process visualization of ${basePrompt}, flow diagram concept`;
        requiresText = true;
        break;
      case 'conclusion':
        basePrompt = `Conclusive visual summarizing ${basePrompt}, forward-looking, professional`;
        break;
      case 'quote':
        basePrompt = `Visual backdrop for quote: ${basePrompt}, inspirational, elegant`;
        requiresText = true;
        break;
      case 'chart':
        basePrompt = `Business chart visualization for ${basePrompt}, professional data presentation`;
        requiresText = true;
        break;
      case 'agenda':
        basePrompt = `Visual backdrop for agenda: ${basePrompt}, organized, professional`;
        requiresText = true;
        break;
      default:
        basePrompt = `Professional concept visualization of ${basePrompt}`;
    }
  }
  
  // For title slides, always use Ideogram as they typically have text
  if (titleLower.includes('title') || titleLower.includes('cover')) {
    requiresText = true;
  }
  
  // Use different enhancement based on model choice
  const enhancedPrompt = enhanceImagePrompt(basePrompt, requiresText);
  
  return {
    prompt: enhancedPrompt,
    useIdeogram: requiresText // Use Ideogram V2 for text-heavy slides, Recraft for pure image slides
  };
}

/**
 * Presentation style defintiions
 */
const STYLE_PROMPTS = {
  corporate: {
    prompt: "professional, clean corporate style, business environment, muted blue and gray tones",
    negative: "cartoon, vibrant, surreal, unprofessional",
    preferredModel: "ideogram"
  },
  creative: {
    prompt: "vibrant colors, artistic, creative, expressive, imaginative design",
    negative: "boring, plain, monochrome, corporate",
    preferredModel: "recraft" 
  },
  technical: {
    prompt: "technical, precise, detailed, scientific, schematic diagrams, technical illustrations",
    negative: "messy, artistic, abstract, imprecise",
    preferredModel: "ideogram"
  },
  nature: {
    prompt: "natural elements, organic, earth tones, environmental, sustainable",
    negative: "urban, industrial, artificial, synthetic",
    preferredModel: "recraft"
  },
  modern: {
    prompt: "contemporary, sleek, minimalist, innovative, cutting-edge design",
    negative: "vintage, retro, ornate, traditional",
    preferredModel: "ideogram"
  },
  vintage: {
    prompt: "retro, classic, nostalgic, aged texture, heritage feel, historical",
    negative: "modern, futuristic, sleek, contemporary",
    preferredModel: "recraft"
  }
};

/**
 * Generate images for all slides in a presentation, optimized by selected style
 */
export async function generateImagesForSlides(slides: any[], selectedStyle: string = 'corporate'): Promise<string[]> {
  try {
    // Ensure we have enough credits
    if (!hasEnoughCredits(slides.length)) {
      console.warn('Not enough credits to generate images for all slides');
      return slides.map(() => getMockImage('insufficient_credits'));
    }
    
    const imagePrompts = slides.map(slide => {
      // If slide has an explicit image prompt, use it
      if (slide.imagePrompt) {
        return {
          prompt: slide.imagePrompt,
          useIdeogram: slide.type === 'title' || slide.type === 'quote' || 
                       slide.type === 'data' || slide.type === 'chart' || 
                       slide.type === 'agenda'
        };
      }
      
      // Otherwise generate a prompt based on slide content
      let content = '';
      if (slide.content && slide.content.bullets && slide.content.bullets.length > 0) {
        content = slide.content.bullets.join(' ');
      } else if (slide.content && slide.content.mainText) {
        content = slide.content.mainText;
      }
      
      return generateImagePromptFromSlide(slide.title, content, slide.type);
    });
    
    // Get style preferences
    const stylePreference = STYLE_PROMPTS[selectedStyle as keyof typeof STYLE_PROMPTS] || STYLE_PROMPTS.corporate;
    
    // Prepare parameters for each slide
    const results: string[] = [];
    for (let i = 0; i < imagePrompts.length; i++) {
      const promptData = imagePrompts[i];
      let prompt = '';
      let useIdeogram = false;
      
      // Handle different prompt formats - fix type compatibility
      if (typeof promptData === 'string') {
        prompt = promptData;
        useIdeogram = stylePreference.preferredModel === 'ideogram';
      } else {
        prompt = promptData.prompt;
        useIdeogram = promptData.useIdeogram;
        
        // For specific slide types, override with style preference
        if (slides[i].type === 'image' || slides[i].type === 'photo') {
          useIdeogram = stylePreference.preferredModel === 'ideogram';
        }
      }
      
      // Enhance prompt with style
      const enhancedPrompt = `${prompt}, ${stylePreference.prompt}`;
      
      // Generate the image
      try {
        const imageUrl = await generateImage(
          enhancedPrompt, 
          {
            useIdeogram,
            size: 'landscape', // Default for presentations
            negative_prompt: stylePreference.negative
          }
        );
        
        results.push(imageUrl);
      } catch (error) {
        console.error('Error generating image:', error);
        results.push(getMockImage('error'));
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error generating images for slides:', error);
    return slides.map(() => getMockImage('fallback'));
  }
}

/**
 * Update getMockImage to handle object prompts safely
 */
function getMockImage(promptInput: string | { prompt: string; useIdeogram: boolean }): string {
  let promptText: string;
  
  if (typeof promptInput === 'string') {
    promptText = promptInput;
  } else if (promptInput && typeof promptInput === 'object' && 'prompt' in promptInput) {
    promptText = promptInput.prompt;
  } else {
    // Use a default value if the input is invalid
    console.warn('Invalid prompt input for mock image:', promptInput);
    promptText = 'default_placeholder';
  }
  
  // Generate a random placeholder image based on the prompt
  try {
    const words = promptText.split(' ');
    const seed = words.length > 0 ? words[0].length * 123456789 : Date.now();
    const placeholderId = Math.abs(seed % 1000);
    
    // Return a placeholder image URL
    return `https://picsum.photos/seed/${placeholderId}/800/600`;
  } catch (error) {
    console.error('Error generating mock image:', error);
    return 'https://picsum.photos/800/600'; // Fallback URL
  }
}

export default {
  generateImage,
  generateMultipleImages,
  generateImageBatches,
  generateImagePromptFromSlide,
  generateImagesForSlides
}; 