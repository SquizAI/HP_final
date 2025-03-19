/**
 * Test script for image generation APIs
 * This script tests both OpenAI's DALL-E and fal.ai's Ideogram V2
 * 
 * Run with: npx ts-node src/test-image-apis.ts
 */

// Import the DALL-E image generator
import { generateImage as generateDallEImage } from './utils/imageGenerator';

// Import the fal.ai image generator
import { generateImage as generateFalImage } from './utils/fluxImageGenerator';

// Test prompts
const TEST_PROMPTS = [
  "A modern conference room with a presentation screen showing business analytics",
  "A futuristic technology device with holographic display in a professional setting",
  "A team of diverse professionals collaborating around a whiteboard with project plans",
];

// Test the OpenAI DALL-E API
async function testDallEApi() {
  console.log("\n=== Testing OpenAI DALL-E API ===");
  try {
    const startTime = Date.now();
    const imageUrl = await generateDallEImage(TEST_PROMPTS[0], {
      size: '1024x1024',
      style: 'vivid'
    });
    const duration = Date.now() - startTime;
    
    console.log(`✅ DALL-E successfully generated an image in ${duration}ms`);
    console.log(`Image URL: ${imageUrl}`);
    return imageUrl;
  } catch (error) {
    console.error("❌ DALL-E API test failed:", error);
    return null;
  }
}

// Test the fal.ai Ideogram V2 API
async function testIdeogramApi() {
  console.log("\n=== Testing fal.ai Ideogram V2 API ===");
  try {
    const startTime = Date.now();
    const imageUrl = await generateFalImage(TEST_PROMPTS[1], {
      size: 'square',
      useIdeogram: true
    });
    const duration = Date.now() - startTime;
    
    console.log(`✅ Ideogram V2 successfully generated an image in ${duration}ms`);
    console.log(`Image URL: ${imageUrl}`);
    return imageUrl;
  } catch (error) {
    console.error("❌ Ideogram V2 API test failed:", error);
    return null;
  }
}

// Test the fal.ai Recraft API
async function testRecraftApi() {
  console.log("\n=== Testing fal.ai Recraft API ===");
  try {
    const startTime = Date.now();
    const imageUrl = await generateFalImage(TEST_PROMPTS[2], {
      size: 'square',
      useIdeogram: false
    });
    const duration = Date.now() - startTime;
    
    console.log(`✅ Recraft successfully generated an image in ${duration}ms`);
    console.log(`Image URL: ${imageUrl}`);
    return imageUrl;
  } catch (error) {
    console.error("❌ Recraft API test failed:", error);
    return null;
  }
}

// Run the tests
async function runTests() {
  console.log("Starting image API tests...");
  
  // Test DALL-E
  const dalleResult = await testDallEApi();
  
  // Test Ideogram V2
  const ideogramResult = await testIdeogramApi();
  
  // Test Recraft
  const recraftResult = await testRecraftApi();
  
  // Summary
  console.log("\n=== Test Summary ===");
  console.log(`DALL-E: ${dalleResult ? '✅ Success' : '❌ Failed'}`);
  console.log(`Ideogram V2: ${ideogramResult ? '✅ Success' : '❌ Failed'}`);
  console.log(`Recraft: ${recraftResult ? '✅ Success' : '❌ Failed'}`);
}

// Run the tests
runTests().catch(error => {
  console.error("Error running tests:", error);
}); 