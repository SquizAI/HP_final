import React, { useState, useEffect } from 'react';
import { Award, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import { useUserProgress, markChallengeAsCompleted } from '../../../utils/userDataManager';

const HPAmuzeMain: React.FC = () => {
  // User progress tracking
  const [userProgress, setUserProgress] = useUserProgress();
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    overview: true,
    business: true,
    instructions: true,
    tips: false,
    applications: false,
    resources: false,
  });

  // Check if challenge is already completed
  useEffect(() => {
    if (userProgress.completedChallenges.includes('challenge-hp-amuze')) {
      setIsCompleted(true);
    }
  }, [userProgress]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle challenge completion
  const handleCompleteChallenge = () => {
    markChallengeAsCompleted('challenge-hp-amuze');
    setIsCompleted(true);
  };

  return (
    <div className="flex flex-col space-y-6 max-w-4xl mx-auto">
      <div className="bg-[#0096D6] text-white p-6 rounded-lg">
        <h1 className="text-3xl font-bold">HP Challenge 3: HP Amuze – Creative AI Artist</h1>
        <p className="mt-2 text-lg">Generate professional-quality images and content with AI</p>
      </div>

      {/* Overview Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <button 
          className="flex justify-between items-center w-full p-4 text-left bg-gray-50 hover:bg-gray-100"
          onClick={() => toggleSection('overview')}
        >
          <h2 className="text-xl font-bold text-gray-800">🎨 Overview</h2>
          {expandedSections.overview ? <ChevronUp /> : <ChevronDown />}
        </button>
        
        {expandedSections.overview && (
          <div className="p-4">
            <p className="text-gray-700 mb-4">
              HP Amuze is an advanced creative AI tool built into HP AI laptops that enables users to generate 
              professional-quality images and written content. By combining powerful generative AI models with 
              HP's optimization technology, Amuze allows anyone to create compelling visual and written content 
              without specialized skills in design or copywriting.
            </p>
            
            <h3 className="font-bold text-lg mb-2">🎯 Learning Objectives</h3>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>Master prompt engineering for generating specific images and text</li>
              <li>Learn to refine and iterate on AI-generated content</li>
              <li>Understand how to blend AI-generated elements with existing content</li>
              <li>Create cohesive visual storytelling using AI assistance</li>
              <li>Develop skills to quickly produce professional-quality content for business use</li>
            </ul>
          </div>
        )}
      </div>

      {/* Business Impact Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <button 
          className="flex justify-between items-center w-full p-4 text-left bg-gray-50 hover:bg-gray-100"
          onClick={() => toggleSection('business')}
        >
          <h2 className="text-xl font-bold text-gray-800">🔍 Business Impact</h2>
          {expandedSections.business ? <ChevronUp /> : <ChevronDown />}
        </button>
        
        {expandedSections.business && (
          <div className="p-4">
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Accelerated Content Creation:</strong> Reduces design and copywriting time by up to 80%</li>
              <li><strong>Cost Reduction:</strong> Decreases reliance on external creative agencies and stock photo services</li>
              <li><strong>Brand Consistency:</strong> Enables rapid creation of on-brand materials across various formats</li>
              <li><strong>Increased Engagement:</strong> Produces high-quality visual content that captures audience attention</li>
              <li><strong>Democratized Design:</strong> Allows team members without design skills to create professional materials</li>
            </ul>
          </div>
        )}
      </div>

      {/* Instructions Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <button 
          className="flex justify-between items-center w-full p-4 text-left bg-gray-50 hover:bg-gray-100"
          onClick={() => toggleSection('instructions')}
        >
          <h2 className="text-xl font-bold text-gray-800">🛠️ Step-by-Step Instructions</h2>
          {expandedSections.instructions ? <ChevronUp /> : <ChevronDown />}
        </button>
        
        {expandedSections.instructions && (
          <div className="p-4">
            <div className="mb-4">
              <h3 className="font-bold text-lg mb-2">Step 1: Prepare Your Environment</h3>
              <ol className="list-decimal pl-6 space-y-1 text-gray-700">
                <li>Ensure your HP AI laptop is powered on and connected to the internet</li>
                <li>Open the HP Amuze application from your Start menu or desktop</li>
                <li>Take a moment to familiarize yourself with the user interface:
                  <ul className="list-disc pl-6 mt-1">
                    <li>Image generation panel</li>
                    <li>Text generation panel</li>
                    <li>Template gallery</li>
                    <li>Project workspace</li>
                  </ul>
                </li>
              </ol>
            </div>

            <div className="mb-4">
              <h3 className="font-bold text-lg mb-2">Step 2: Generate Your First Image</h3>
              <ol className="list-decimal pl-6 space-y-1 text-gray-700">
                <li>Select the "Create Image" option from the main menu</li>
                <li>In the prompt field, enter a detailed description of your desired image:
                  <ul className="list-disc pl-6 mt-1 italic">
                    <li>Example: "A professional photograph of a modern open office space with natural lighting, employees collaborating, HP laptops visible on desks, bright and welcoming atmosphere"</li>
                  </ul>
                </li>
                <li>Choose the image style from the dropdown menu (photorealistic, artistic, abstract, etc.)</li>
                <li>Select the desired aspect ratio (16:9, 4:3, 1:1, etc.)</li>
                <li>Click "Generate" and wait for the results (typically 15-30 seconds)</li>
                <li>Review the generated options (HP Amuze provides 4 variations for each prompt)</li>
              </ol>
            </div>

            <div className="mb-4">
              <h3 className="font-bold text-lg mb-2">Step 3: Refine Your Image</h3>
              <ol className="list-decimal pl-6 space-y-1 text-gray-700">
                <li>Select the image variation that best matches your vision</li>
                <li>Click "Refine" to open the image editing interface</li>
                <li>Use the refinement tools to adjust:
                  <ul className="list-disc pl-6 mt-1">
                    <li>Areas to emphasize or de-emphasize</li>
                    <li>Color balance and lighting</li>
                    <li>Adding or removing elements</li>
                  </ul>
                </li>
                <li>Use the text prompt field to add specific instructions:
                  <ul className="list-disc pl-6 mt-1 italic">
                    <li>Example: "Make the lighting brighter and add more plants in the background"</li>
                  </ul>
                </li>
                <li>Click "Regenerate" to see the refined version</li>
                <li>Repeat the refinement process until satisfied with the result</li>
              </ol>
            </div>

            <div className="mb-4">
              <h3 className="font-bold text-lg mb-2">Step 4: Generate Complementary Text</h3>
              <ol className="list-decimal pl-6 space-y-1 text-gray-700">
                <li>With your image selected, click on "Generate Text" from the side panel</li>
                <li>Select the type of text you need:
                  <ul className="list-disc pl-6 mt-1">
                    <li>Headline</li>
                    <li>Product description</li>
                    <li>Social media post</li>
                    <li>Article introduction</li>
                  </ul>
                </li>
                <li>Enter a brief description of what the text should focus on:
                  <ul className="list-disc pl-6 mt-1 italic">
                    <li>Example: "Benefits of a collaborative workspace with HP AI laptops for team productivity"</li>
                  </ul>
                </li>
                <li>Select the desired tone (professional, conversational, enthusiastic, etc.)</li>
                <li>Choose the length (short, medium, or long)</li>
                <li>Click "Generate Text" and review the results</li>
              </ol>
            </div>

            <div className="mb-4">
              <h3 className="font-bold text-lg mb-2">Step 5: Refine Your Text</h3>
              <ol className="list-decimal pl-6 space-y-1 text-gray-700">
                <li>Review the generated text and identify any areas for improvement</li>
                <li>Click "Refine" to open the text refinement interface</li>
                <li>Use the specific instruction field to request changes:
                  <ul className="list-disc pl-6 mt-1 italic">
                    <li>Example: "Make it more concise and add specific statistics about productivity gains"</li>
                  </ul>
                </li>
                <li>Alternatively, use the editing tools to manually adjust the text</li>
                <li>Click "Regenerate" to see the refined version</li>
                <li>Repeat until you are satisfied with the result</li>
              </ol>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">Step 6: Combine and Export Your Creation</h3>
              <ol className="list-decimal pl-6 space-y-1 text-gray-700">
                <li>In the workspace view, arrange your image and text as desired</li>
                <li>Optionally, add additional elements from the template gallery (frames, backgrounds, logos)</li>
                <li>Preview the combined creation to ensure everything looks cohesive</li>
                <li>Click "Export" and select your preferred format:
                  <ul className="list-disc pl-6 mt-1">
                    <li>PNG/JPG (for the image only)</li>
                    <li>PDF (for image and text combined)</li>
                    <li>PPT (as a PowerPoint slide)</li>
                    <li>Social Media (optimized for various platforms)</li>
                  </ul>
                </li>
                <li>Choose the destination (save to device, share directly, or add to content library)</li>
                <li>Finalize the export and review your completed creation</li>
              </ol>
            </div>
          </div>
        )}
      </div>

      {/* Tips Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <button 
          className="flex justify-between items-center w-full p-4 text-left bg-gray-50 hover:bg-gray-100"
          onClick={() => toggleSection('tips')}
        >
          <h2 className="text-xl font-bold text-gray-800">💡 Tips for Success</h2>
          {expandedSections.tips ? <ChevronUp /> : <ChevronDown />}
        </button>
        
        {expandedSections.tips && (
          <div className="p-4">
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Be Specific in Prompts:</strong> The more detailed your prompt, the closer the generated content will match your vision</li>
              <li><strong>Use Brand Elements:</strong> Include your company colors, logo, or product names in prompts for on-brand content</li>
              <li><strong>Iterate Gradually:</strong> Make small, focused changes with each refinement rather than completely changing direction</li>
              <li><strong>Save Successful Prompts:</strong> Create a library of effective prompts for future use</li>
              <li><strong>Combine Human Creativity:</strong> Use AI-generated content as a foundation, then add your unique insights or edits</li>
            </ul>
          </div>
        )}
      </div>

      {/* Applications Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <button 
          className="flex justify-between items-center w-full p-4 text-left bg-gray-50 hover:bg-gray-100"
          onClick={() => toggleSection('applications')}
        >
          <h2 className="text-xl font-bold text-gray-800">🌐 Real-World Applications</h2>
          {expandedSections.applications ? <ChevronUp /> : <ChevronDown />}
        </button>
        
        {expandedSections.applications && (
          <div className="p-4">
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Marketing Materials:</strong> Create social media posts, blog headers, and promotional images</li>
              <li><strong>Product Visualization:</strong> Generate concept images of products in various environments</li>
              <li><strong>Presentation Enhancement:</strong> Develop custom slides with engaging visuals for presentations</li>
              <li><strong>Content Creation:</strong> Produce drafts for articles, product descriptions, and social media copy</li>
              <li><strong>Training Materials:</strong> Create illustrations and scenarios for training documentation</li>
            </ul>
          </div>
        )}
      </div>

      {/* Resources Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <button 
          className="flex justify-between items-center w-full p-4 text-left bg-gray-50 hover:bg-gray-100"
          onClick={() => toggleSection('resources')}
        >
          <h2 className="text-xl font-bold text-gray-800">📚 Additional Resources</h2>
          {expandedSections.resources ? <ChevronUp /> : <ChevronDown />}
        </button>
        
        {expandedSections.resources && (
          <div className="p-4">
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><a href="https://www.hp.com/us-en/ai-pcs.html" className="text-blue-600 hover:underline">HP AI PC Information Hub</a></li>
              <li><a href="https://www.hp.com/us-en/shop/tech-takes" className="text-blue-600 hover:underline">HP Tech Takes: AI Tools Guides</a></li>
              <li><a href="https://developer.hp.com/ai-solutions" className="text-blue-600 hover:underline">HP Developer Portal: AI Resources</a></li>
            </ul>
          </div>
        )}
      </div>

      {/* Challenge Completion Button */}
      {!isCompleted ? (
        <button
          onClick={handleCompleteChallenge}
          className="mt-4 w-full py-3 bg-[#0096D6] text-white rounded-lg hover:bg-[#0074A6] flex items-center justify-center"
        >
          <Award className="w-5 h-5 mr-2" />
          Complete Challenge
        </button>
      ) : (
        <div className="mt-4 p-4 bg-green-50 text-green-800 rounded-lg flex items-center">
          <CheckCircle className="w-5 h-5 mr-2" />
          <span>Challenge completed! Well done!</span>
        </div>
      )}
    </div>
  );
};

export default HPAmuzeMain; 