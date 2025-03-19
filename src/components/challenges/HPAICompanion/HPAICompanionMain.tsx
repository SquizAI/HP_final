import React, { useState, useEffect } from 'react';
import { Award, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import { useUserProgress, markChallengeAsCompleted } from '../../../utils/userDataManager';

const HPAICompanionMain: React.FC = () => {
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
    if (userProgress.completedChallenges.includes('challenge-hp-companion')) {
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
    markChallengeAsCompleted('challenge-hp-companion');
    setIsCompleted(true);
  };

  return (
    <div className="flex flex-col space-y-6 max-w-4xl mx-auto">
      <div className="bg-[#0096D6] text-white p-6 rounded-lg">
        <h1 className="text-3xl font-bold">HP Challenge 2: HP AI Companion – Instant Summarizer</h1>
        <p className="mt-2 text-lg">Transform lengthy documents into quick, actionable insights</p>
      </div>

      {/* Overview Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <button 
          className="flex justify-between items-center w-full p-4 text-left bg-gray-50 hover:bg-gray-100"
          onClick={() => toggleSection('overview')}
        >
          <h2 className="text-xl font-bold text-gray-800">📋 Overview</h2>
          {expandedSections.overview ? <ChevronUp /> : <ChevronDown />}
        </button>
        
        {expandedSections.overview && (
          <div className="p-4">
            <p className="text-gray-700 mb-4">
              HP AI Companion is an integrated AI assistant that helps you quickly summarize and extract key information from documents, emails, 
              and presentations. By leveraging advanced large language models, the HP AI Companion can reduce hours of reading to minutes, 
              identifying the most important points and action items without missing critical details.
            </p>
            
            <h3 className="font-bold text-lg mb-2">🎯 Learning Objectives</h3>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>Master using AI for rapid document summarization</li>
              <li>Learn to extract action items from lengthy documents</li>
              <li>Understand how to customize the level of detail in AI-generated summaries</li>
              <li>Gain efficiency in processing business communications</li>
              <li>Apply AI summarization to different document types</li>
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
              <li><strong>Time Efficiency:</strong> Reduces document review time by up to 75%</li>
              <li><strong>Enhanced Comprehension:</strong> Improves understanding and retention of key information</li>
              <li><strong>Meeting Preparation:</strong> Enables quick preparation for meetings by summarizing background materials</li>
              <li><strong>Decision Support:</strong> Accelerates the decision-making process by highlighting critical information</li>
              <li><strong>Information Management:</strong> Helps professionals handle increasing volumes of business documentation</li>
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
                <li>Log in to your system with your credentials</li>
                <li>Locate the HP AI Companion icon in your taskbar or Start menu</li>
                <li>Prepare a document for summarization (you can use a business report, research paper, or lengthy email)</li>
              </ol>
            </div>

            <div className="mb-4">
              <h3 className="font-bold text-lg mb-2">Step 2: Access the HP AI Companion</h3>
              <ol className="list-decimal pl-6 space-y-1 text-gray-700">
                <li>Launch the HP AI Companion by clicking its icon</li>
                <li>When prompted, select the "Summarize Document" option from the menu</li>
                <li>You'll see options for document input:
                  <ul className="list-disc pl-6 mt-1">
                    <li>Upload a document</li>
                    <li>Paste text</li>
                    <li>Select from recent documents</li>
                  </ul>
                </li>
              </ol>
            </div>

            <div className="mb-4">
              <h3 className="font-bold text-lg mb-2">Step 3: Generate a Basic Summary</h3>
              <ol className="list-decimal pl-6 space-y-1 text-gray-700">
                <li>Select or upload your document</li>
                <li>Choose the "Standard Summary" option</li>
                <li>Click "Generate"</li>
                <li>Review the initial summary provided by the AI Companion</li>
                <li>Note the key points that were extracted and how they relate to the original document</li>
              </ol>
            </div>

            <div className="mb-4">
              <h3 className="font-bold text-lg mb-2">Step 4: Customize Your Summary</h3>
              <ol className="list-decimal pl-6 space-y-1 text-gray-700">
                <li>After receiving the initial summary, click on "Customize"</li>
                <li>Adjust the summary parameters:
                  <ul className="list-disc pl-6 mt-1">
                    <li>Summary length (brief, standard, detailed)</li>
                    <li>Focus area (general, technical, financial, marketing)</li>
                    <li>Output format (bullet points, paragraphs, executive summary)</li>
                  </ul>
                </li>
                <li>Click "Regenerate" to see the customized summary</li>
                <li>Compare the new summary with the original to see how the customization affects the output</li>
              </ol>
            </div>

            <div className="mb-4">
              <h3 className="font-bold text-lg mb-2">Step 5: Extract Action Items</h3>
              <ol className="list-decimal pl-6 space-y-1 text-gray-700">
                <li>From the summary screen, select the "Extract Action Items" option</li>
                <li>Review the list of action items generated by the AI</li>
                <li>For each action item, the AI will indicate:
                  <ul className="list-disc pl-6 mt-1">
                    <li>The specific task or action required</li>
                    <li>Any mentioned deadlines or timeframes</li>
                    <li>The responsible parties (if specified in the document)</li>
                    <li>Priority level (if determinable from context)</li>
                  </ul>
                </li>
              </ol>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">Step 6: Save and Share Your Results</h3>
              <ol className="list-decimal pl-6 space-y-1 text-gray-700">
                <li>Once satisfied with the summary and action items, click "Save"</li>
                <li>Choose your preferred format (PDF, Word document, plain text)</li>
                <li>Select the option to include:
                  <ul className="list-disc pl-6 mt-1">
                    <li>Summary only</li>
                    <li>Action items only</li>
                    <li>Complete package (summary and action items)</li>
                  </ul>
                </li>
                <li>Save the document to your preferred location</li>
                <li>Use the "Share" button to directly email the summary or copy it to your clipboard</li>
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
              <li><strong>Choose the Right Level of Detail:</strong> For lengthy technical documents, start with a detailed summary; for quick overviews, use the brief option</li>
              <li><strong>Verify Critical Information:</strong> While AI summaries are highly accurate, always double-check critical figures and decisions against the source document</li>
              <li><strong>Use Multiple Focus Areas:</strong> For complex documents, generate summaries with different focus areas to get a comprehensive understanding</li>
              <li><strong>Combine with Note-Taking:</strong> Use the AI summary as a foundation and add your own insights for the most effective document processing</li>
              <li><strong>Try Different Formats:</strong> Experiment with bullet points for quick scanning and paragraphs for more context</li>
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
              <li><strong>Executive Briefings:</strong> Quickly prepare for board meetings by summarizing lengthy reports</li>
              <li><strong>Legal Document Review:</strong> Accelerate contract review by extracting key terms and obligations</li>
              <li><strong>Research Synthesis:</strong> Summarize multiple research papers to identify common findings and gaps</li>
              <li><strong>Customer Communication Analysis:</strong> Extract themes and sentiments from customer feedback</li>
              <li><strong>Meeting Follow-up:</strong> Summarize meeting notes and distribute action items to team members</li>
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
              <li><a href="https://www.hp.com/us-en/shop/tech-takes/hp-ai-laptop-companion" className="text-blue-600 hover:underline">HP AI Companion Documentation</a></li>
              <li><a href="https://www.hp.com/us-en/ai-pcs.html" className="text-blue-600 hover:underline">HP AI PCs Resources</a></li>
              <li><a href="https://support.hp.com/document-library" className="text-blue-600 hover:underline">HP Document Library: AI Features Guides</a></li>
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

export default HPAICompanionMain; 