// Simple test script to directly test the fal.ai API without using our wrapper
import * as dotenv from 'dotenv';
import { createFalClient } from '@fal-ai/client';

// Load environment variables
dotenv.config();

// Get the API key from environment variables
const getFalApiKey = () => {
  if (process.env.VITE_FAL_API_KEY) {
    return process.env.VITE_FAL_API_KEY;
  }
  console.warn('⚠️ No FAL_API_KEY found in environment variables');
  return '';
};

// Create the fal.ai client
const falClient = createFalClient({
  credentials: getFalApiKey()
});

// Test the Ideogram V2 API
async function testIdeogramApi() {
  console.log('🧪 Testing Ideogram V2 API...');
  const startTime = Date.now();
  
  try {
    // Call the API with correct parameters - updated with all available valid parameters
    const result = await falClient.subscribe('fal-ai/ideogram/v2', {
      input: {
        prompt: 'A professional business presentation about innovation and technology',
        negative_prompt: 'blurry, distorted, low quality, text, watermark, logo',
        style: 'realistic', // Valid values: auto, general, realistic, design, render_3D, anime
        aspect_ratio: '16:9', // Valid values: 10:16, 16:10, 9:16, 16:9, 4:3, 3:4, 1:1, 1:3, 3:1, 3:2, 2:3
        expand_prompt: true // This helps the model enhance the prompt
      },
      logs: true,
      onQueueUpdate: (update) => {
        console.log(`Queue status: ${update.status}`);
        if (update.status === "IN_PROGRESS" && update.logs) {
          update.logs.forEach(log => console.log(`   ${log.message}`));
        } else if (update.status === "FAILED") {
          console.error("Queue update failed:", update);
        }
      }
    });
    
    const duration = Date.now() - startTime;
    console.log(`✅ Ideogram V2 API successful in ${duration}ms!`);
    
    // Log the image URL
    if (result.data && result.data.images && result.data.images.length > 0) {
      console.log(`🖼️ Image URL: ${result.data.images[0].url}`);
    } else {
      console.log('⚠️ No image URL found in response');
      console.log('Response:', JSON.stringify(result, null, 2));
    }
    
    return result;
  } catch (error) {
    console.error(`❌ Ideogram V2 API failed: ${error.message}`);
    
    // Print detailed validation errors if available
    if (error.body && error.body.detail) {
      console.error('Validation errors:', JSON.stringify(error.body.detail, null, 2));
    }
    
    console.error(error);
    return null;
  }
}

// Test the Recraft API
async function testRecraftApi() {
  console.log('🧪 Testing Recraft API...');
  const startTime = Date.now();
  
  try {
    // Call the API with updated parameters
    const result = await falClient.subscribe('fal-ai/recraft-20b', {
      input: {
        prompt: 'A professional business graph showing growth trends', // No prohibited words
        negative_prompt: 'blurry, distorted, low quality, text, watermark',
        aspect_ratio: '4:3', // Valid values for aspect ratio
        num_images: 1,
        seed: Math.floor(Math.random() * 1000000)
      },
      logs: true,
      onQueueUpdate: (update) => {
        console.log(`Queue status: ${update.status}`);
        if (update.status === "IN_PROGRESS" && update.logs) {
          update.logs.forEach(log => console.log(`   ${log.message}`));
        } else if (update.status === "FAILED") {
          console.error("Queue update failed:", update);
        }
      }
    });
    
    const duration = Date.now() - startTime;
    console.log(`✅ Recraft API successful in ${duration}ms!`);
    
    // Log the image URL
    if (result.data && result.data.images && result.data.images.length > 0) {
      console.log(`🖼️ Image URL: ${result.data.images[0].url}`);
    } else {
      console.log('⚠️ No image URL found in response');
      console.log('Response:', JSON.stringify(result, null, 2));
    }
    
    return result;
  } catch (error) {
    console.error(`❌ Recraft API failed: ${error.message}`);
    
    // Print detailed validation errors if available
    if (error.body && error.body.detail) {
      console.error('Validation errors:', JSON.stringify(error.body.detail, null, 2));
    }
    
    console.error(error);
    return null;
  }
}

// Run the tests
async function runTests() {
  console.log('🚀 Starting fal.ai API tests...');
  console.log(`🔑 Using API key: ${getFalApiKey().substring(0, 8)}...`);
  
  // Test Ideogram V2
  await testIdeogramApi();
  
  console.log('\n'); // Add space between tests
  
  // Test Recraft
  await testRecraftApi();
  
  console.log('\n🏁 All tests completed!');
}

// Run the tests
runTests().catch(console.error); 