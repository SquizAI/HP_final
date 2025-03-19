/**
 * Test script for image generation APIs
 * This script tests both OpenAI's DALL-E and fal.ai's Ideogram V2
 * 
 * Run with: node src/test-image-apis.js
 */

// Import required dependencies
import * as dotenv from 'dotenv';
dotenv.config();

// Test prompts
const TEST_PROMPTS = [
  "A modern conference room with a presentation screen showing business analytics",
  "A futuristic technology device with holographic display in a professional setting",
  "A team of diverse professionals collaborating around a whiteboard with project plans",
];

// Basic implementation to test OpenAI's DALL-E API
async function testDallEApi() {
  console.log("\n=== Testing OpenAI DALL-E API ===");
  try {
    const apiKey = process.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OpenAI API key not found in environment variables");
    }
    
    console.log("Calling DALL-E API...");
    const startTime = Date.now();
    
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: TEST_PROMPTS[0],
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        style: 'vivid'
      })
    });
    
    const data = await response.json();
    const duration = Date.now() - startTime;
    
    if (!response.ok) {
      throw new Error(`DALL-E API error: ${data.error?.message || 'Unknown error'}`);
    }
    
    const imageUrl = data.data?.[0]?.url;
    if (!imageUrl) {
      throw new Error("No image URL returned from DALL-E API");
    }
    
    console.log(`✅ DALL-E successfully generated an image in ${duration}ms`);
    console.log(`Image URL: ${imageUrl}`);
    return imageUrl;
  } catch (error) {
    console.error("❌ DALL-E API test failed:", error.message);
    return null;
  }
}

// Basic implementation to test fal.ai's Ideogram V2 API
async function testIdeogramApi() {
  console.log("\n=== Testing fal.ai Ideogram V2 API ===");
  try {
    const apiKey = process.env.VITE_FAL_API_KEY;
    if (!apiKey) {
      throw new Error("Fal.ai API key not found in environment variables");
    }
    
    console.log("Calling Ideogram V2 API...");
    const startTime = Date.now();
    
    // Split the API key into key_id and key_secret
    const [keyId, keySecret] = apiKey.split(':');
    if (!keyId || !keySecret) {
      throw new Error("Invalid Fal.ai API key format. Expected format: 'key_id:key_secret'");
    }
    
    const response = await fetch('https://api.fal.ai/fal-ai/ideogram/v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`
      },
      body: JSON.stringify({
        prompt: TEST_PROMPTS[1],
        style: 'photographic',
        width: 1024,
        height: 1024
      })
    });
    
    const data = await response.json();
    const duration = Date.now() - startTime;
    
    if (!response.ok) {
      throw new Error(`Ideogram V2 API error: ${JSON.stringify(data.error || data)}`);
    }
    
    const imageUrl = data.images?.[0]?.url;
    if (!imageUrl) {
      throw new Error("No image URL returned from Ideogram V2 API");
    }
    
    console.log(`✅ Ideogram V2 successfully generated an image in ${duration}ms`);
    console.log(`Image URL: ${imageUrl}`);
    return imageUrl;
  } catch (error) {
    console.error("❌ Ideogram V2 API test failed:", error.message);
    return null;
  }
}

// Basic implementation to test fal.ai's Recraft API
async function testRecraftApi() {
  console.log("\n=== Testing fal.ai Recraft API ===");
  try {
    const apiKey = process.env.VITE_FAL_API_KEY;
    if (!apiKey) {
      throw new Error("Fal.ai API key not found in environment variables");
    }
    
    console.log("Calling Recraft API...");
    const startTime = Date.now();
    
    // Split the API key into key_id and key_secret
    const [keyId, keySecret] = apiKey.split(':');
    if (!keyId || !keySecret) {
      throw new Error("Invalid Fal.ai API key format. Expected format: 'key_id:key_secret'");
    }
    
    const response = await fetch('https://api.fal.ai/fal-ai/recraft-20b', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`
      },
      body: JSON.stringify({
        prompt: TEST_PROMPTS[2],
        aspect_ratio: '1:1',
        num_images: 1
      })
    });
    
    const data = await response.json();
    const duration = Date.now() - startTime;
    
    if (!response.ok) {
      throw new Error(`Recraft API error: ${JSON.stringify(data.error || data)}`);
    }
    
    const imageUrl = data.images?.[0]?.url;
    if (!imageUrl) {
      throw new Error("No image URL returned from Recraft API");
    }
    
    console.log(`✅ Recraft successfully generated an image in ${duration}ms`);
    console.log(`Image URL: ${imageUrl}`);
    return imageUrl;
  } catch (error) {
    console.error("❌ Recraft API test failed:", error.message);
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