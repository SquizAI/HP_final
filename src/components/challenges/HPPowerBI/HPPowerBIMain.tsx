import React, { useState, useEffect } from 'react';
import { Award, ChevronDown, ChevronUp, CheckCircle, PieChart } from 'lucide-react';
import { useUserProgress, markChallengeAsCompleted } from '../../../utils/userDataManager';
import Confetti from '../../shared/Confetti';
import ChallengeHeader from '../../shared/ChallengeHeader';

const HPPowerBIMain: React.FC = () => {
  // User progress tracking
  const [userProgress, setUserProgress] = useUserProgress();
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
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
    if (userProgress.completedChallenges.includes('challenge-hp-powerbi')) {
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
    markChallengeAsCompleted('challenge-hp-powerbi');
    setIsCompleted(true);
    
    // Show confetti
    setShowConfetti(true);
    
    // Reset confetti after 5 seconds
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
  };

  return (
    <div className="flex flex-col space-y-6 max-w-4xl mx-auto">
      {/* Add standardized challenge header */}
      <ChallengeHeader
        title="Power BI Challenge – AI Data Detective"
        icon={<PieChart className="h-6 w-6 text-[#0096D6]" />}
        challengeId="challenge-hp-powerbi"
        isCompleted={isCompleted}
        setIsCompleted={setIsCompleted}
        showConfetti={showConfetti}
        setShowConfetti={setShowConfetti}
        onCompleteChallenge={handleCompleteChallenge}
      />
    
      <div className="bg-[#0096D6] text-white p-6 rounded-lg">
        <h1 className="text-3xl font-bold">HP Challenge 1: Power BI Challenge – AI Data Detective</h1>
        <p className="mt-2 text-lg">Use AI to instantly uncover insights in business data</p>
      </div>

      {/* Overview Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <button 
          className="flex justify-between items-center w-full p-4 text-left bg-gray-50 hover:bg-gray-100"
          onClick={() => toggleSection('overview')}
        >
          <h2 className="text-xl font-bold text-gray-800">📊 Overview</h2>
          {expandedSections.overview ? <ChevronUp /> : <ChevronDown />}
        </button>
        
        {expandedSections.overview && (
          <div className="p-4">
            <p className="text-gray-700 mb-4">
              Power BI's AI capabilities transform the way businesses analyze data by making advanced analytics accessible to everyone. 
              HP AI laptops are optimized to handle these AI workloads efficiently, enabling you to uncover insights faster and make 
              data-driven decisions without specialized expertise.
            </p>
            
            <h3 className="font-bold text-lg mb-2">🎯 Learning Objectives</h3>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>Understand how Power BI's AI features can accelerate data analysis</li>
              <li>Learn to use natural language queries to explore data</li>
              <li>Discover key influencers and relationships in business data</li>
              <li>Create AI-powered forecasts to predict future trends</li>
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
              <li><strong>Democratized Analytics:</strong> Enables all team members to perform data analysis without advanced training</li>
              <li><strong>Faster Decision Making:</strong> Reduces the time from data to insight by up to 60%</li>
              <li><strong>Improved Accuracy:</strong> AI identifies patterns humans might miss, leading to better business decisions</li>
              <li><strong>Resource Optimization:</strong> Reduces the analytics workload on specialized data science teams</li>
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
                <li>Ensure your HP AI laptop is charged and running optimally</li>
                <li>Navigate to Power BI Desktop on your laptop (pre-installed on HP AI laptops)</li>
                <li>Open the application and sign in with your organizational account</li>
              </ol>
            </div>

            <div className="mb-4">
              <h3 className="font-bold text-lg mb-2">Step 2: Load the Sample Dataset</h3>
              <ol className="list-decimal pl-6 space-y-1 text-gray-700">
                <li>Click <strong>Get Data</strong> in the Home ribbon</li>
                <li>Select <strong>Sample Datasets</strong> from the menu</li>
                <li>Choose the <strong>Retail Analysis Sample</strong> dataset for this exercise</li>
                <li>Click <strong>Load</strong> to import the dataset</li>
              </ol>
            </div>

            <div className="mb-4">
              <h3 className="font-bold text-lg mb-2">Step 3: Explore with Natural Language Q&A</h3>
              <ol className="list-decimal pl-6 space-y-1 text-gray-700">
                <li>In the Visualizations pane, select the <strong>Q&A</strong> visual</li>
                <li>Click the visual to place it on your canvas</li>
                <li>Type natural language questions such as:
                  <ul className="list-disc pl-6 mt-1 italic">
                    <li>"What was total sales by region last year?"</li>
                    <li>"Which products had the highest profit margin?"</li>
                    <li>"Show me monthly sales trends for 2022"</li>
                  </ul>
                </li>
                <li>Observe how Power BI automatically generates the appropriate visualization</li>
                <li>Refine your question if needed to get more precise results</li>
              </ol>
            </div>

            <div className="mb-4">
              <h3 className="font-bold text-lg mb-2">Step 4: Discover Key Influencers</h3>
              <ol className="list-decimal pl-6 space-y-1 text-gray-700">
                <li>From the Visualizations pane, select the <strong>Key Influencers</strong> visual</li>
                <li>Drag it onto your canvas</li>
                <li>For <strong>Analyze</strong>, select a metric of interest (e.g., "Total Sales")</li>
                <li>For <strong>Explain by</strong>, add various dimensions that might influence sales:
                  <ul className="list-disc pl-6 mt-1">
                    <li>Product Category</li>
                    <li>Store Location</li>
                    <li>Season</li>
                    <li>Promotion Type</li>
                    <li>Customer Demographics</li>
                  </ul>
                </li>
                <li>Review the key influencers identified by the AI</li>
                <li>Click on specific influencers to see detailed breakdowns</li>
              </ol>
            </div>

            <div className="mb-4">
              <h3 className="font-bold text-lg mb-2">Step 5: Create an AI-Powered Forecast</h3>
              <ol className="list-decimal pl-6 space-y-1 text-gray-700">
                <li>Create a line chart showing sales over time</li>
                <li>Select the line chart on your canvas</li>
                <li>In the Analytics pane, select <strong>Forecast</strong></li>
                <li>Configure forecast parameters:
                  <ul className="list-disc pl-6 mt-1">
                    <li>Forecast length: 3 months</li>
                    <li>Confidence interval: 95%</li>
                    <li>Seasonality: Auto</li>
                  </ul>
                </li>
                <li>Click <strong>Apply</strong> to add the forecast to your visualization</li>
                <li>Observe the forecast line and confidence intervals</li>
              </ol>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">Step 6: Document Your Insights</h3>
              <ol className="list-decimal pl-6 space-y-1 text-gray-700">
                <li>Identify one surprising insight from your analysis</li>
                <li>Screenshot the relevant visualization</li>
                <li>Write a brief explanation of what you discovered and its business implications</li>
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
              <li><strong>Start Simple:</strong> Begin with straightforward questions before exploring complex relationships</li>
              <li><strong>Refine Iteratively:</strong> If results aren't what you expected, refine your question or analysis</li>
              <li><strong>Consider Context:</strong> Always interpret AI insights in the context of your business knowledge</li>
              <li><strong>Combine Methods:</strong> Use multiple AI tools together for a more comprehensive analysis</li>
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
              <li><strong>Retail:</strong> Identify factors driving product returns and develop strategies to reduce them</li>
              <li><strong>Healthcare:</strong> Analyze patient outcomes to determine most effective treatment protocols</li>
              <li><strong>Finance:</strong> Detect anomalies in spending patterns to identify potential fraud</li>
              <li><strong>Manufacturing:</strong> Forecast inventory needs based on historical patterns and seasonal factors</li>
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
              <li><a href="https://learn.microsoft.com/en-us/power-bi/transform-model/desktop-ai-insights" className="text-blue-600 hover:underline">Power BI AI Features Documentation</a></li>
              <li><a href="https://www.hp.com/us-en/solutions/business-solutions.html" className="text-blue-600 hover:underline">HP Business Insights Center</a></li>
              <li><a href="https://powerbi.microsoft.com/en-us/webinars/" className="text-blue-600 hover:underline">AI-Driven Analytics Webinar Series</a></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default HPPowerBIMain; 