// Load environment variables
require('dotenv').config();

// Import OpenAI API
const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure this is set in .env file
});

// Test function for DALL-E 3
async function generateImage() {
  try {
    console.log('Attempting to generate image with DALL-E 3...');
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: "A beautiful mountain landscape with a lake at sunset, with detailed reflections in the water",
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    console.log('Image generation successful!');
    console.log('Image URL:', response.data[0].url);
    return response.data[0].url;
  } catch (error) {
    console.error('Error generating image:');
    console.error(error.name);
    console.error(error.message);
    
    // More detailed error information
    if (error.response) {
      console.error('Full error response:', JSON.stringify(error.response, null, 2));
    }
    
    // Fall back to mock image if API key is not properly configured
    console.log('Using mock image instead...');
    return 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop';
  }
}

// Create a mock image generation function for fallback
function getMockImage(prompt) {
  console.log('Generating mock image based on prompt:', prompt);
  
  // List of stock landscape images
  const landscapeImages = [
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1546587348-d12660c30c50?q=80&w=2074&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1476610182048-b716b8518aae?q=80&w=2127&auto=format&fit=crop',
  ];
  
  // Choose a random image from the array
  const randomIndex = Math.floor(Math.random() * landscapeImages.length);
  return landscapeImages[randomIndex];
}

// Execute the test
generateImage()
  .then(url => {
    console.log('Process completed with URL:', url);
  })
  .catch(err => {
    console.error('Unexpected error:', err);
  }); 