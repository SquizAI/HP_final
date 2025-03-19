import React, { useState, useEffect } from 'react';
import { DataAnalystState, DataInsight } from './DataAnalystMain';

interface InsightGenerationProps {
  state: DataAnalystState;
  updateState: (newState: Partial<DataAnalystState>) => void;
  onNext: () => void;
  onBack: () => void;
}

// The output structure is now described directly in the UI for better user experience

// Mock function to generate insights based on visualizations and data
const generateInsights = (
  datasetType: string,
  businessQuestion: string,
  keyMetrics: string[],
  anomalies: string[],
  visualizations: any[]
): Promise<{ insights: DataInsight[], actionItems: string[] }> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Generate different insights based on the dataset type and business question
      let insights: DataInsight[] = [];
      let actionItems: string[] = [];
      
      // Use keyMetrics to tailor insights to the specific metrics the user is interested in
      const metricFocus = keyMetrics.length > 0 ? keyMetrics[0] : 'revenue';
      
      // Modify the title of the first insight to incorporate the business question
      const enhancedTitle = `Analysis of ${metricFocus} in relation to ${businessQuestion}`;
      
      switch (datasetType) {
        case 'Sales Data':
          insights = [
            {
              title: enhancedTitle,
              description: 'While Electronics contributes 45% of total revenue, Hardware products have a 37% profit margin, making them more profitable overall despite lower volume. This suggests an opportunity to optimize product mix.',
              importance: 'high',
              confidence: 92
            },
            {
              title: 'Seasonal sales patterns require inventory planning',
              description: 'Q4 sales are 2.8x higher than Q2 sales, with seasonal products showing 3x higher variance than staple products. This requires careful inventory planning to avoid stockouts or overstock situations.',
              importance: 'medium',
              confidence: 88
            },
            {
              title: 'Corporate clients represent highest growth opportunity',
              description: 'Corporate clients generate 2.5x higher revenue per order than consumers and have grown 18% YoY compared to 7% for consumers. Targeting this segment could accelerate growth.',
              importance: 'high',
              confidence: 85
            }
          ];
          
          actionItems = [
            'Develop a specialized sales strategy for the corporate segment with bundled offerings',
            'Implement seasonal inventory forecasting to optimize stock levels',
            'Consider expanding the Hardware product line given its strong profit margins',
            'Create cross-selling programs between Electronics and Hardware categories'
          ];
          break;
          
        case 'Marketing Data':
          insights = [
            {
              title: 'Email marketing provides highest ROI but limited scale',
              description: 'Email campaigns consistently deliver the highest ROI at 320%, but reach only 28% of the target audience. This suggests an opportunity to expand email subscriber base.',
              importance: 'high',
              confidence: 94
            },
            {
              title: 'Social media efficiency has declined significantly',
              description: 'Social media campaign efficiency has declined 32% year-over-year, with rising costs and declining engagement rates. Current CAC is now 1.8x higher than email.',
              importance: 'high',
              confidence: 89
            },
            {
              title: 'Search marketing performance varies by segment',
              description: 'Search marketing performs 42% better for B2B segments than B2C, with a lower cost per acquisition and higher conversion rate. Resource allocation should reflect this disparity.',
              importance: 'medium',
              confidence: 82
            }
          ];
          
          actionItems = [
            'Launch email list growth initiative with a goal of +40% subscribers',
            'Reallocate 25% of social media budget to better performing channels',
            'Segment search marketing budgets to favor B2B campaigns',
            'Test new creative approaches for social media to improve engagement'
          ];
          break;
          
        case 'Customer Data':
          insights = [
            {
              title: 'Satisfaction threshold drives repeat purchase behavior',
              description: 'Customers with satisfaction scores of 7+ have a 68% repeat purchase rate, versus only 23% for those below 7. This represents a clear threshold effect that can guide strategy.',
              importance: 'high',
              confidence: 95
            },
            {
              title: 'Demographics significantly impact satisfaction drivers',
              description: '25-34 age demographic values product quality and innovation, while 55+ prioritizes customer service and reliability. Tailoring experience by segment could improve overall satisfaction.',
              importance: 'medium',
              confidence: 87
            },
            {
              title: 'Feature satisfaction correlates with recommendation rate',
              description: 'Satisfaction with product feature set is the strongest predictor of NPS score (r=0.76), outweighing price satisfaction (r=0.42) and service satisfaction (r=0.58).',
              importance: 'high',
              confidence: 91
            }
          ];
          
          actionItems = [
            'Implement an early warning system for customers with satisfaction below 7',
            'Develop segment-specific communication and service strategies',
            'Prioritize feature development in product roadmap',
            'Create targeted win-back campaigns for customers with low satisfaction scores'
          ];
          break;
          
        default:
          // Generate generic insights for other dataset types
          insights = [
            {
              title: 'Primary metrics show strong positive correlation',
              description: 'Analysis reveals a strong positive correlation (r=0.82) between the primary metrics, indicating a systemic relationship that can be leveraged for performance improvement.',
              importance: 'high',
              confidence: 85
            },
            {
              title: 'Significant seasonal variation detected',
              description: 'Performance metrics show consistent seasonal patterns with Q4 performance exceeding Q2 by 34%. This suggests an opportunity for seasonal strategy optimization.',
              importance: 'medium',
              confidence: 78
            },
            {
              title: 'Key segments show divergent performance',
              description: 'Segment analysis reveals a 2.1x difference in performance between the top and bottom segments, highlighting an opportunity for targeted improvement initiatives.',
              importance: 'high',
              confidence: 88
            }
          ];
          
          actionItems = [
            'Develop a targeted strategy for underperforming segments',
            'Implement seasonal planning to capitalize on high-performance periods',
            'Create a dashboard to track correlation between primary metrics',
            'Conduct deeper analysis on factors driving performance differences'
          ];
      }
      
      // Add insights based on anomalies if available
      if (anomalies.length > 0) {
        insights.push({
          title: `Anomaly detected: ${anomalies[0]}`,
          description: `Further investigation required regarding ${anomalies[0].toLowerCase()}. This represents a significant deviation from expected patterns and may indicate an opportunity or threat.`,
          importance: 'high',
          confidence: 75
        });
        
        actionItems.push(`Investigate root causes of anomaly: ${anomalies[0]}`);
      }
      
      // Add insights based on visualizations if available
      if (visualizations.length > 0 && visualizations[0].insights && visualizations[0].insights.length > 0) {
        insights.push({
          title: `Visualization insight: ${visualizations[0].insights[0]}`,
          description: `Based on the ${visualizations[0].title} visualization, we can see that ${visualizations[0].insights[0].toLowerCase()}. This presents an actionable opportunity.`,
          importance: 'medium',
          confidence: 82
        });
        
        actionItems.push(`Act on visualization insight: ${visualizations[0].insights[0]}`);
      }
      
      resolve({
        insights,
        actionItems
      });
    }, 2000);
  });
};

const InsightGeneration: React.FC<InsightGenerationProps> = ({ state, updateState, onNext, onBack }) => {
  const [insights, setInsights] = useState<DataInsight[]>(state.insights || []);
  const [actionItems, setActionItems] = useState<string[]>(state.actionItems || []);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showAiHelper, setShowAiHelper] = useState<boolean>(false);
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [customInsightTitle, setCustomInsightTitle] = useState<string>('');
  const [customInsightDescription, setCustomInsightDescription] = useState<string>('');
  const [customInsightImportance, setCustomInsightImportance] = useState<'low' | 'medium' | 'high'>('medium');
  const [customInsightConfidence, setCustomInsightConfidence] = useState<number>(75);
  const [customActionItem, setCustomActionItem] = useState<string>('');
  
  // Generate insights when component mounts if none exist
  useEffect(() => {
    if (state.insights.length === 0 && state.visualizations.length > 0) {
      generateDataInsights();
    }
  }, []);
  
  // Generate insights based on data and visualizations
  const generateDataInsights = async () => {
    setIsGenerating(true);
    
    try {
      const result = await generateInsights(
        state.datasetType,
        state.businessQuestion,
        state.keyMetrics,
        state.anomalies,
        state.visualizations
      );
      
      setInsights(result.insights);
      setActionItems(result.actionItems);
      setIsGenerating(false);
    } catch (error) {
      console.error('Error generating insights:', error);
      setIsGenerating(false);
    }
  };
  
  // Handle AI prompt input
  const handleAiPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAiPrompt(e.target.value);
  };
  
  // Generate insights from AI prompt
  const generateFromPrompt = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    
    // In a real implementation, this would call an OpenAI API with function calling
    // for structured output
    setTimeout(() => {
      const newInsight: DataInsight = {
        title: 'Custom insight based on your prompt',
        description: `Analysis related to "${aiPrompt}" shows significant patterns in your data that suggest actionable opportunities for improvement.`,
        importance: 'medium',
        confidence: 80
      };
      
      const newActionItem = `Address the findings related to ${aiPrompt}`;
      
      setInsights(prev => [...prev, newInsight]);
      setActionItems(prev => [...prev, newActionItem]);
      setIsGenerating(false);
      setShowAiHelper(false);
      setAiPrompt('');
    }, 2000);
  };
  
  // Add custom insight
  const addCustomInsight = () => {
    if (customInsightTitle && customInsightDescription) {
      const newInsight: DataInsight = {
        title: customInsightTitle,
        description: customInsightDescription,
        importance: customInsightImportance,
        confidence: customInsightConfidence
      };
      
      setInsights(prev => [...prev, newInsight]);
      setCustomInsightTitle('');
      setCustomInsightDescription('');
      setCustomInsightImportance('medium');
      setCustomInsightConfidence(75);
    }
  };
  
  // Add custom action item
  const addCustomActionItem = () => {
    if (customActionItem) {
      setActionItems(prev => [...prev, customActionItem]);
      setCustomActionItem('');
    }
  };
  
  // Remove an insight
  const removeInsight = (index: number) => {
    setInsights(prev => prev.filter((_, i) => i !== index));
  };
  
  // Remove an action item
  const removeActionItem = (index: number) => {
    setActionItems(prev => prev.filter((_, i) => i !== index));
  };
  
  // Save insights and continue
  const handleContinue = () => {
    updateState({
      insights: insights,
      actionItems: actionItems
    });
    onNext();
  };
  
  // Get color based on importance
  const getImportanceColor = (importance: string): string => {
    switch (importance) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get color based on confidence score
  const getConfidenceColor = (score: number): string => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6">
      <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold text-purple-800">
          Step 4: Generate Insights
        </h2>
        <p className="text-gray-700 mt-2">
          Transform your data analysis into actionable insights and recommendations.
        </p>
      </div>
      
      {/* Analysis context */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
        <div className="flex items-start">
          <div className="bg-purple-100 text-purple-600 p-2 rounded-lg mr-4">
            <span className="text-xl">🔍</span>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-1">Analysis Context</h3>
            <p className="text-gray-600 text-sm mb-2">
              <strong>Business Question:</strong> {state.businessQuestion}
            </p>
            <p className="text-gray-600 text-sm mb-2">
              <strong>Visualizations:</strong> {state.visualizations.length} created
            </p>
          </div>
        </div>
      </div>
      
      {/* AI Helper Toggle */}
      <div className="mb-8">
        <button
          className="flex items-center bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          onClick={() => setShowAiHelper(!showAiHelper)}
        >
          <span className="mr-2">✨</span>
          {showAiHelper ? 'Hide AI Helper' : 'Show AI Helper'}
        </button>
        
        {showAiHelper && (
          <div className="mt-4 bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h3 className="text-lg font-medium text-purple-800 mb-3">AI Insight Helper</h3>
            <p className="text-gray-600 mb-4">
              Tell the AI what kind of insights you're looking for, and it will generate structured insights based on your data analysis.
            </p>
            
            <div className="mb-4">
              <textarea
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[120px]"
                placeholder="Describe what you want to learn from your data. For example: 'Help me understand the key drivers of customer satisfaction based on demographic segments.'"
                value={aiPrompt}
                onChange={handleAiPromptChange}
              ></textarea>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <div className="flex items-start">
                <div className="text-blue-500 text-xl mr-3">💡</div>
                <div>
                  <h4 className="font-medium text-blue-700 mb-1">AI Helper Tips</h4>
                  <p className="text-blue-800 text-sm">
                    For best results, specify:
                  </p>
                  <ul className="text-blue-800 text-sm list-disc pl-5 mt-1">
                    <li>What specific aspects of your data you want to analyze</li>
                    <li>Any specific business outcomes you're trying to improve</li>
                    <li>Whether you want strategic or tactical insights</li>
                    <li>If you're interested in trends, comparisons, or correlations</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-gray-500 text-sm mb-3">
                <strong>Output Structure:</strong> All insights will be generated with a consistent structure including:
              </p>
              <ul className="text-gray-600 text-sm list-disc pl-5">
                <li><strong>Title:</strong> Clear, concise label for each insight</li>
                <li><strong>Description:</strong> Detailed explanation with supporting data</li>
                <li><strong>Importance Level:</strong> Low, Medium, or High - indicating business impact</li>
                <li><strong>Confidence Score:</strong> 0-100 rating of statistical confidence</li>
                <li><strong>Action Items:</strong> Recommended next steps based on these insights</li>
              </ul>
            </div>
            
            <button
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700 transition-colors flex items-center"
              onClick={generateFromPrompt}
              disabled={isGenerating || !aiPrompt.trim()}
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>Generate Insights</>
              )}
            </button>
          </div>
        )}
      </div>
      
      {/* Generate Insights Button */}
      <div className="flex mb-8">
        <button
          className="px-4 py-2 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700 transition-colors flex items-center"
          onClick={generateDataInsights}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Insights...
            </>
          ) : (
            <>Generate AI Insights</>
          )}
        </button>
      </div>
      
      {/* Insights Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-800">Key Insights</h3>
          <button
            className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md text-sm hover:bg-purple-200 transition-colors flex items-center"
            data-bs-toggle="collapse"
            data-bs-target="#customInsightForm"
            onClick={() => document.getElementById('customInsightForm')?.classList.toggle('hidden')}
          >
            <span className="mr-1">+</span> Add Custom Insight
          </button>
        </div>
        
        {/* Custom insight form */}
        <div id="customInsightForm" className="bg-white p-4 rounded-lg border border-gray-200 mb-4 hidden">
          <h4 className="font-medium text-gray-800 mb-3">Add Custom Insight</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Insight Title
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter a clear, concise title for your insight"
                value={customInsightTitle}
                onChange={(e) => setCustomInsightTitle(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[80px]"
                placeholder="Provide a detailed explanation of your insight"
                value={customInsightDescription}
                onChange={(e) => setCustomInsightDescription(e.target.value)}
              ></textarea>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Importance
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={customInsightImportance}
                  onChange={(e) => setCustomInsightImportance(e.target.value as any)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confidence (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={customInsightConfidence}
                  onChange={(e) => setCustomInsightConfidence(parseInt(e.target.value))}
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={addCustomInsight}
                disabled={!customInsightTitle || !customInsightDescription}
              >
                Add Insight
              </button>
            </div>
          </div>
        </div>
        
        {/* Insights list */}
        {insights.length > 0 ? (
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className="bg-white p-5 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium text-gray-800 pr-6">{insight.title}</h4>
                  <button
                    className="text-gray-400 hover:text-red-500"
                    onClick={() => removeInsight(index)}
                  >
                    ×
                  </button>
                </div>
                <p className="text-gray-600 mb-4">{insight.description}</p>
                <div className="flex items-center text-sm">
                  <span className={`px-2 py-1 rounded-full mr-4 ${getImportanceColor(insight.importance)}`}>
                    {insight.importance.charAt(0).toUpperCase() + insight.importance.slice(1)} Importance
                  </span>
                  <span className={`${getConfidenceColor(insight.confidence)} font-medium`}>
                    {insight.confidence}% Confidence
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <p className="text-gray-500">No insights generated yet. Click "Generate AI Insights" to analyze your data.</p>
          </div>
        )}
      </div>
      
      {/* Action Items Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-800">Recommended Actions</h3>
          <div className="flex space-x-2">
            <input
              type="text"
              className="border border-gray-300 rounded-l-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
              placeholder="Add a recommended action..."
              value={customActionItem}
              onChange={(e) => setCustomActionItem(e.target.value)}
            />
            <button
              className="px-3 py-1 bg-purple-600 text-white rounded-r-md hover:bg-purple-700 transition-colors"
              onClick={addCustomActionItem}
              disabled={!customActionItem}
            >
              Add
            </button>
          </div>
        </div>
        
        {/* Action items list */}
        {actionItems.length > 0 ? (
          <div className="bg-blue-50 p-5 rounded-lg">
            <h4 className="font-medium text-blue-700 mb-3">Action Plan</h4>
            <ul className="space-y-3">
              {actionItems.map((item, index) => (
                <li key={index} className="flex items-start bg-white p-3 rounded-md border border-blue-100">
                  <span className="text-blue-500 mr-2">•</span>
                  <span className="text-gray-700 flex-grow">{item}</span>
                  <button
                    className="text-gray-400 hover:text-red-500 ml-2"
                    onClick={() => removeActionItem(index)}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <p className="text-gray-500">No action items generated yet. These will be created based on your insights.</p>
          </div>
        )}
      </div>
      
      {/* Pro Tip */}
      <div className="bg-blue-50 p-4 rounded-lg mb-8">
        <div className="flex items-start">
          <div className="text-blue-500 text-xl mr-3">💡</div>
          <div>
            <h4 className="font-medium text-blue-700 mb-1">Pro Tip</h4>
            <p className="text-blue-800 text-sm">
              The most valuable insights connect data observations to specific business outcomes and actionable recommendations. 
              For each insight, ask yourself: "So what? What should we do differently based on this information?"
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between mt-8">
        <button
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          onClick={onBack}
        >
          Back
        </button>
        <button
          className="px-6 py-2 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleContinue}
          disabled={isGenerating || insights.length === 0}
        >
          Complete Analysis
        </button>
      </div>
    </div>
  );
};

export default InsightGeneration; 