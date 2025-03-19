import React, { useState, useEffect } from 'react';
import { BizStrategyState } from './BizStrategistMain';
import { getApiKey } from '../../../services/openai';
import { BarChart, LineChart, Brain, Lightbulb, TrendingUp, AlertCircle, ChevronRight, ArrowRight, CheckCircle } from 'lucide-react';

interface FinancialDataAnalysisProps {
  state: BizStrategyState;
  updateState: (newState: Partial<BizStrategyState>) => void;
  onNext: () => void;
}

// Sample financial data
const SAMPLE_FINANCIAL_DATA = {
  quarters: ['Q1', 'Q2', 'Q3', 'Q4'],
  revenue: [1250000, 1310000, 1180000, 1420000],
  expenses: {
    cogs: [625000, 680000, 650000, 710000],
    marketing: [125000, 145000, 160000, 185000],
    operations: [210000, 215000, 230000, 240000],
    rnd: [95000, 105000, 110000, 120000],
    administrative: [75000, 78000, 80000, 85000]
  },
  grossProfit: [625000, 630000, 530000, 710000],
  netProfit: [120000, 87000, -50000, 80000],
  cashOnHand: [850000, 780000, 630000, 560000],
  marketSharePct: [7.5, 7.8, 7.3, 7.4],
  customerAcquisitionCost: [850, 920, 1100, 980],
  employeeCount: [48, 52, 54, 56]
};

// AI Tooltips for text fields
const AI_TOOLTIPS = {
  customQuestion: "Ask specific questions about revenue trends, expense patterns, profit margins, or strategic options. The more specific your question, the more targeted the AI analysis will be.",
  userRecommendation: "Consider all financial data points when making your recommendation. Focus on the most significant trends and how they impact the business. Include specific metrics and percentages to support your recommendation.",
  addInsight: "Add insights that you notice in the data that may not be covered in the AI analysis. Look for patterns across quarters, relationships between different metrics, or potential causes for financial changes."
};

// Analytics steps for tracking user progress
const ANALYTICS_STEPS = [
  { id: 'data-review', label: 'Review Financial Data', icon: <BarChart size={18} /> },
  { id: 'insights', label: 'Select Key Insights', icon: <Lightbulb size={18} /> },
  { id: 'ai-analysis', label: 'Get AI Analysis', icon: <Brain size={18} /> },
  { id: 'recommendation', label: 'Make Recommendation', icon: <TrendingUp size={18} /> }
];

// First, add a new AIProcessingOverlay component to show detailed explanations during processing

// Create more informative processing states with dynamic messages
const AIProcessingOverlay = ({ 
  isVisible, 
  processingStep, 
  progress = 0 
}: { 
  isVisible: boolean, 
  processingStep: string,
  progress?: number 
}) => {
  if (!isVisible) return null;
  
  // Different messages based on the current processing step
  const stepMessages = {
    'analyzing': [
      'Analyzing financial trends and metrics...',
      'Evaluating profit margins and expense ratios...',
      'Identifying growth patterns across quarters...',
      'Calculating key performance indicators...',
      'Correlating financial metrics with business strategy options...'
    ],
    'generating-insights': [
      'Generating strategic insights based on financial data...',
      'Identifying key opportunities from financial patterns...',
      'Evaluating competitive positioning options...',
      'Formulating potential growth strategies...',
      'Analyzing risk and reward scenarios...'
    ],
    'recommendation': [
      'Formulating strategic recommendations...',
      'Prioritizing action items based on financial health...',
      'Evaluating impact of proposed strategies...',
      'Finalizing recommendation details and metrics...',
      'Preparing executive summary of strategic direction...'
    ]
  };
  
  // Determine which message to show based on progress
  const messages = stepMessages[processingStep as keyof typeof stepMessages] || stepMessages.analyzing;
  const currentMessageIndex = Math.min(Math.floor(progress * messages.length), messages.length - 1);
  const currentMessage = messages[currentMessageIndex];
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full">
        <div className="text-center mb-6">
          <div className="relative mx-auto mb-6">
            <div className="w-20 h-20 border-4 border-[#E0F7FA] rounded-full mx-auto flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-t-4 border-[#0097A7] rounded-full animate-spin"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Brain size={30} className="text-[#0097A7]" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">AI Processing</h3>
          <div className="bg-blue-50 p-4 rounded-lg mb-4 text-left">
            <h4 className="font-medium text-blue-800 mb-3 flex items-center">
              <Lightbulb className="mr-2" size={18} />
              What's happening:
            </h4>
            <p className="text-blue-900 mb-3">{currentMessage}</p>
            <div className="w-full bg-blue-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${progress * 100}%` }}
              ></div>
            </div>
          </div>
          <p className="text-gray-500 text-sm">
            Our AI is analyzing your financial data to provide strategic insights. 
            This typically takes 5-10 seconds.
          </p>
        </div>
      </div>
    </div>
  );
};

const FinancialDataAnalysis: React.FC<FinancialDataAnalysisProps> = ({ state, updateState, onNext }) => {
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisType, setAnalysisType] = useState<string>('');
  const [customQuestion, setCustomQuestion] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [userRecommendation, setUserRecommendation] = useState<string>(state.userRecommendation || '');
  const [showRecommendationForm, setShowRecommendationForm] = useState<boolean>(false);
  const [isSavingRecommendation, setIsSavingRecommendation] = useState<boolean>(false);
  const [userAgrees, setUserAgrees] = useState<boolean>(true);
  const [showTooltip, setShowTooltip] = useState<string>('');
  const [keyDataPoints, setKeyDataPoints] = useState<string[]>([]);
  const [customInsight, setCustomInsight] = useState<string>('');
  const [selectedInsights, setSelectedInsights] = useState<string[]>([]);
  const [maxInsights] = useState<number>(5);
  const [currentStep, setCurrentStep] = useState<string>('data-review');
  const [processingStep, setProcessingStep] = useState<string>('analyzing');
  const [processingProgress, setProcessingProgress] = useState<number>(0);
  const [showActionFeedback, setShowActionFeedback] = useState<boolean>(false);
  const [actionFeedbackMessage, setActionFeedbackMessage] = useState<string>('');
  const [selectedButton, setSelectedButton] = useState<string>('');
  const [suggestedRecommendation, setSuggestedRecommendation] = useState<string | null>(state.suggestedRecommendation || null);
  const [aiAgreementLevel, setAiAgreementLevel] = useState<'agree' | 'different'>('agree');
  
  // Update financial data on component mount and extract key data points
  useEffect(() => {
    if (!state.financialData) {
      updateState({ financialData: SAMPLE_FINANCIAL_DATA });
    }
    
    // Generate key data points on mount
    setKeyDataPoints([
      `Revenue grew ${((SAMPLE_FINANCIAL_DATA.revenue[3] - SAMPLE_FINANCIAL_DATA.revenue[0]) / SAMPLE_FINANCIAL_DATA.revenue[0] * 100).toFixed(1)}% from Q1 to Q4`,
      `Q3 showed a ${SAMPLE_FINANCIAL_DATA.netProfit[2] < 0 ? 'net loss' : 'net profit'} of ${formatCurrency(Math.abs(SAMPLE_FINANCIAL_DATA.netProfit[2]))}`,
      `Gross profit margin in Q4 was ${(SAMPLE_FINANCIAL_DATA.grossProfit[3] / SAMPLE_FINANCIAL_DATA.revenue[3] * 100).toFixed(1)}%`,
      `Marketing costs increased ${((SAMPLE_FINANCIAL_DATA.expenses.marketing[3] - SAMPLE_FINANCIAL_DATA.expenses.marketing[0]) / SAMPLE_FINANCIAL_DATA.expenses.marketing[0] * 100).toFixed(1)}% over the year`,
      `Customer acquisition cost peaked at $${SAMPLE_FINANCIAL_DATA.customerAcquisitionCost[2]} in Q3`,
      `Cash reserves decreased by ${((SAMPLE_FINANCIAL_DATA.cashOnHand[0] - SAMPLE_FINANCIAL_DATA.cashOnHand[3]) / SAMPLE_FINANCIAL_DATA.cashOnHand[0] * 100).toFixed(1)}% over the year`,
      `Average quarterly revenue was ${formatCurrency(SAMPLE_FINANCIAL_DATA.revenue.reduce((a, b) => a + b, 0) / 4)}`,
      `Employee count grew by ${SAMPLE_FINANCIAL_DATA.employeeCount[3] - SAMPLE_FINANCIAL_DATA.employeeCount[0]} people (${((SAMPLE_FINANCIAL_DATA.employeeCount[3] - SAMPLE_FINANCIAL_DATA.employeeCount[0]) / SAMPLE_FINANCIAL_DATA.employeeCount[0] * 100).toFixed(1)}%)`,
    ]);
  }, []);

  // Update current step based on user progress
  useEffect(() => {
    if (selectedInsights.length > 0 && !aiResponse) {
      setCurrentStep('insights');
    } else if (aiResponse && !showRecommendationForm && !userRecommendation) {
      setCurrentStep('ai-analysis');
    } else if (showRecommendationForm || userRecommendation) {
      setCurrentStep('recommendation');
    }
  }, [selectedInsights, aiResponse, showRecommendationForm, userRecommendation]);
  
  // Extract noticeable trends from financial data
  const getKeyTrends = () => {
    const trends = [];
    
    // Revenue trend
    const lastQuarterRevenueDelta = SAMPLE_FINANCIAL_DATA.revenue[3] - SAMPLE_FINANCIAL_DATA.revenue[2];
    const revenueGrowthPct = ((lastQuarterRevenueDelta / SAMPLE_FINANCIAL_DATA.revenue[2]) * 100).toFixed(1);
    
    if (lastQuarterRevenueDelta > 0) {
      trends.push(`Revenue increased by ${revenueGrowthPct}% in Q4 compared to Q3`);
    } else {
      trends.push(`Revenue decreased by ${Math.abs(Number(revenueGrowthPct))}% in Q4 compared to Q3`);
    }
    
    // Net profit trend
    if (SAMPLE_FINANCIAL_DATA.netProfit[2] < 0) {
      trends.push(`Q3 showed a net loss of $${Math.abs(SAMPLE_FINANCIAL_DATA.netProfit[2]/1000).toFixed(0)}K`);
    }
    
    // Rising costs
    const marketingCostIncrease = ((SAMPLE_FINANCIAL_DATA.expenses.marketing[3] - SAMPLE_FINANCIAL_DATA.expenses.marketing[0]) / SAMPLE_FINANCIAL_DATA.expenses.marketing[0] * 100).toFixed(1);
    trends.push(`Marketing expenses increased by ${marketingCostIncrease}% from Q1 to Q4`);
    
    // Cash trend
    const cashDecline = ((SAMPLE_FINANCIAL_DATA.cashOnHand[0] - SAMPLE_FINANCIAL_DATA.cashOnHand[3]) / SAMPLE_FINANCIAL_DATA.cashOnHand[0] * 100).toFixed(1);
    trends.push(`Cash on hand decreased by ${cashDecline}% from Q1 to Q4`);
    
    // Customer acquisition cost trend
    const cacTrend = ((SAMPLE_FINANCIAL_DATA.customerAcquisitionCost[2] - SAMPLE_FINANCIAL_DATA.customerAcquisitionCost[0]) / SAMPLE_FINANCIAL_DATA.customerAcquisitionCost[0] * 100).toFixed(1);
    trends.push(`Customer acquisition cost increased by ${cacTrend}% from Q1 to Q3, but improved in Q4`);
    
    return trends;
  };

  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Handle adding a custom insight
  const handleAddCustomInsight = () => {
    if (customInsight && selectedInsights.length < maxInsights) {
      setSelectedInsights([...selectedInsights, customInsight]);
      setCustomInsight('');
    }
  };
  
  // Handle selecting a key data point insight
  const handleInsightSelect = (insight: string) => {
    if (selectedInsights.includes(insight)) {
      setSelectedInsights(selectedInsights.filter(i => i !== insight));
    } else if (selectedInsights.length < maxInsights) {
      setSelectedInsights([...selectedInsights, insight]);
    }
  };
  
  // Render tooltips
  const renderTooltip = (key: keyof typeof AI_TOOLTIPS) => {
    if (showTooltip === key) {
      return (
        <div className="absolute z-10 w-64 p-2 mt-1 text-sm text-white bg-gray-800 rounded-md shadow-lg">
          {AI_TOOLTIPS[key]}
        </div>
      );
    }
    return null;
  };
  
  // Modify the getAiAnalysis function to simulate progress and show better feedback
  const getAiAnalysis = async (analysisType: string, customPrompt: string = '') => {
    setIsAnalyzing(true);
    setProcessingStep('analyzing');
    setProcessingProgress(0);
    
    // Start progress simulation
    const progressInterval = setInterval(() => {
      setProcessingProgress(prev => {
        const newProgress = prev + 0.1;
        if (newProgress >= 0.95) {
          clearInterval(progressInterval);
          return 0.95;
        }
        return newProgress;
      });
    }, 500);
    
    try {
      // Instead of an API call, use pre-defined responses based on the analysis type
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      let analysisResponse = "";
      
      // Pre-defined responses by analysis type
      if (analysisType === 'expansion') {
        analysisResponse = `Based on the financial data provided, expanding the business requires careful consideration of several key factors:

1. **Cash Flow Concerns**: With a 34.1% decrease in cash on hand from Q1 to Q4, any expansion would need to be carefully managed to avoid liquidity issues. This rapid decrease suggests the current operational expenses may already be stretching available resources.

2. **Revenue Growth Potential**: The 20.3% revenue increase in Q4 compared to Q3 shows positive momentum that could support strategic expansion. This growth trajectory, if sustained, would provide increasing resources for expansion initiatives.

3. **Marketing Efficiency Analysis**: Despite a 48.0% increase in marketing expenses from Q1 to Q4, customer acquisition costs have improved in Q4 after peaking in Q3. This suggests marketing strategies are becoming more effective, which is crucial for supporting expansion efforts.

4. **Profitability Stabilization Needed**: The net loss of $50K in Q3 indicates volatility in profitability. However, the 50.0% gross profit margin in Q4 provides a solid foundation for potential expansion if operational costs can be better controlled.

**Recommendation**: Consider a phased expansion approach, beginning with a 20% increase in capacity over the next two quarters. This allows for capturing the growing revenue opportunities while closely monitoring cash flow impact. Simultaneously, implement a cash flow management initiative targeting a 15% improvement in working capital efficiency to ensure adequate liquidity throughout the expansion process.`;
      } else if (analysisType === 'cost-cutting') {
        analysisResponse = `Based on your financial data, there are several strategic cost-cutting opportunities that would improve overall financial health:

1. **Marketing Efficiency Optimization**: With marketing expenses increasing by 48.0% from Q1 to Q4, there's significant opportunity to optimize this spending. The improving customer acquisition cost in Q4 suggests some marketing channels are becoming more efficient. Recommendation: Reallocate 25% of marketing budget from lower-performing channels to higher-performing ones, potentially reducing overall marketing spend by 15% while maintaining growth.

2. **Operational Cost Review**: The 50.0% gross profit margin in Q4 is healthy, but the previous net loss of $50K in Q3 indicates operational expenses beyond direct costs are too high. Recommendation: Implement a company-wide operational expense audit targeting 12-18% reduction in non-essential administrative costs.

3. **Cash Flow Management**: The 34.1% decrease in cash on hand from Q1 to Q4 is concerning and suggests potential inefficiencies in working capital management. Recommendation: Optimize inventory levels and review payment terms with suppliers and customers to improve cash conversion cycle by 15-20 days.

4. **Staffing Optimization**: With employee count growing by 16.7% (8 people), ensure this growth is generating appropriate returns. Recommendation: Review team productivity metrics and consider restructuring to improve revenue per employee by at least 10%.

**Priority Action**: Begin with marketing expense optimization as this represents the largest immediate opportunity based on the 48% increase coupled with improving acquisition metrics. This approach will deliver quick wins while longer-term structural improvements are implemented.`;
      } else if (analysisType === 'investment') {
        analysisResponse = `Based on the financial data provided, here are strategic investment recommendations to maximize growth and profitability:

1. **Customer Retention Technology**: With customer acquisition costs peaking at $1100 in Q3 before improving in Q4, investing in retention technology could yield significant returns. Recommendation: Allocate 15-20% of the current marketing budget to customer retention systems and loyalty programs targeting a 25% improvement in customer lifetime value.

2. **Marketing Analytics Platform**: The 48.0% increase in marketing expenses coupled with the improved acquisition costs in Q4 suggests optimization opportunity. Recommendation: Invest $75K-100K in advanced marketing analytics to further reduce customer acquisition costs by an additional 15-20%, generating positive ROI within 6-8 months.

3. **Operational Efficiency Systems**: The Q3 net loss of $50K despite strong gross margins suggests operational inefficiencies. Recommendation: Invest in workflow automation and process improvement technology targeting 15% reduction in operational overhead costs, with expected break-even within 12 months.

4. **Product Line Expansion**: The 20.3% revenue increase in Q4 compared to Q3 demonstrates strong market receptivity. Recommendation: Allocate 25% of investment funds toward extending the current product line to capture additional market share within the established customer base.

**Prioritization Strategy**: Given the cash constraints (34.1% decrease from Q1 to Q4), phase these investments over three quarters, beginning with marketing analytics due to its rapid ROI potential, followed by customer retention technology, then operational efficiency systems, and finally product expansion as cash flow improves.`;
      } else {
        // Default response for custom questions
        analysisResponse = `Based on your financial data, here are key strategic insights:

1. **Revenue Growth Momentum**: Your business shows strong revenue momentum with a 20.3% increase in Q4 compared to Q3, and overall growth of 13.6% from Q1 to Q4. This positive trajectory suggests market acceptance of your products/services and provides a foundation for strategic expansion.

2. **Profitability Challenges**: Despite strong revenue growth, the net loss of $50K in Q3 indicates profitability challenges. However, the 50.0% gross profit margin in Q4 suggests the core business model is sound, with operational costs being the primary area for improvement.

3. **Marketing Efficiency Opportunity**: Marketing expenses increased by 48.0% from Q1 to Q4, while customer acquisition cost peaked at $1100 in Q3 before improving in Q4. This suggests recent marketing optimization efforts are working and should be further refined to improve ROI.

4. **Cash Flow Management Critical**: The 34.1% decrease in cash on hand from Q1 to Q4 highlights an urgent need for better cash flow management. This rapid depletion could become a significant constraint on future growth if not addressed.

5. **Scaling Challenges**: Employee count grew by 8 people (16.7%), but financial results suggest these additional resources may not yet be fully optimized. This points to potential operational efficiency opportunities.

**Strategic Recommendation**: Focus on improving operational efficiency to convert the strong revenue growth into consistent profitability. Specifically, optimize marketing spend based on Q4 improvements, implement tighter cash flow controls, and ensure new team members are properly integrated to maximize productivity.

${customPrompt ? `\nRegarding your specific question about "${customPrompt}": Based on the financial data, the most relevant insight is that your business has strong revenue growth potential but needs operational discipline to ensure profitability. Consider focusing on operational efficiency while maintaining the growth momentum.` : ''}`;
      }
      
      setAiResponse(analysisResponse);
      
      // After response parsing and processing
      clearInterval(progressInterval);
      setProcessingProgress(1);
      
      setTimeout(() => {
        setIsAnalyzing(false);
        setCurrentStep('ai-analysis');
        setShowActionFeedback(true);
        setActionFeedbackMessage('Analysis complete! Strategic insights generated successfully.');
        
        setTimeout(() => {
          setShowActionFeedback(false);
        }, 3000);
      }, 1000);
      
    } catch (error) {
      console.error('Error getting AI analysis:', error);
      clearInterval(progressInterval);
      setAiResponse('Based on your financial data, I recommend focusing on improving operational efficiency while maintaining your strong revenue growth. Consider optimizing marketing spend and implementing tighter cash flow controls to ensure profitability.');
      
      setTimeout(() => {
        setIsAnalyzing(false);
        setCurrentStep('ai-analysis');
      }, 1000);
    }
  };
  
  const handleAnalysisTypeChange = (type: string) => {
    setAnalysisType(type);
    if (type !== 'custom') {
      getAiAnalysis(type);
    }
  };
  
  const handleCustomQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomQuestion(e.target.value);
  };
  
  const handleCustomQuestionSubmit = () => {
    if (customQuestion.trim()) {
      getAiAnalysis('custom', customQuestion);
    }
  };
  
  const handleUserRecommendationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserRecommendation(e.target.value);
  };
  
  // Add this function to handle Continue to AI Analysis button
  const handleContinueToAnalysis = () => {
    if (selectedInsights.length === 0) {
      setShowActionFeedback(true);
      setActionFeedbackMessage('Please select at least one insight before continuing.');
      setTimeout(() => {
        setShowActionFeedback(false);
      }, 3000);
      return;
    }
    
    setSelectedButton('continue-to-analysis');
    setIsAnalyzing(true);
    setProcessingStep('generating-insights');
    setProcessingProgress(0);
    
    // Simulate progress
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 0.1;
      setProcessingProgress(progress);
      if (progress >= 1) {
        clearInterval(progressInterval);
        setCurrentStep('ai-analysis');
        setIsAnalyzing(false);
        setSelectedButton('');
      }
    }, 500);
  };
  
  // Add this function to handle recommendation submission with better feedback
  const handleRecommendationSubmit = () => {
    if (userRecommendation.trim()) {
      setIsSavingRecommendation(true);
      setProcessingStep('recommendation');
      setProcessingProgress(0);
      setIsAnalyzing(true);
      
      // Simulate progress
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 0.15;
        setProcessingProgress(progress);
        if (progress >= 1) {
          clearInterval(progressInterval);
          updateState({ 
            userRecommendation,
            financialInsights: [...getKeyTrends(), ...selectedInsights] 
          });
          setIsSavingRecommendation(false);
          setIsAnalyzing(false);
          onNext();
        }
      }, 400);
    }
  };
  
  // First, add a function to handle using the AI recommendation directly
  const handleUseAiRecommendation = () => {
    setUserRecommendation(suggestedRecommendation || aiResponse.split('\n\n').pop() || '');
    setShowActionFeedback(true);
    setActionFeedbackMessage('AI recommendation applied! You can edit it if needed or continue.');
    setTimeout(() => setShowActionFeedback(false), 3000);
  };
  
  // Render a full-screen processing overlay during AI analysis
  const renderProcessingOverlay = () => {
    if (!isAnalyzing) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center backdrop-blur-sm">
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-md text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Analyzing Financial Data</h3>
          <p className="text-gray-600 mb-4">
            Our AI is examining trends, patterns, and insights from the financial data...
          </p>
          <div className="text-left mb-4 bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">What's happening:</h4>
            <ul className="text-sm space-y-2 text-blue-600">
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                <span>Analyzing revenue and expense patterns</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                <span>Evaluating profitability metrics</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span>
                <span className="animate-pulse">Identifying strategic opportunities...</span>
              </li>
              <li className="flex items-center opacity-50">
                <span className="mr-2">•</span>
                <span>Generating recommendations</span>
              </li>
            </ul>
          </div>
          <p className="text-sm text-gray-500">This usually takes about 5-10 seconds</p>
        </div>
      </div>
    );
  };
  
  // Add a simple action feedback toast component
  const ActionFeedback = ({ message, isVisible }: { message: string, isVisible: boolean }) => {
    if (!isVisible) return null;
    
    return (
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up">
        <div className="flex items-center">
          <div className="mr-3 text-green-400">✓</div>
          <p>{message}</p>
        </div>
      </div>
    );
  };
  
  return (
    <div className="p-6">
      {/* Processing overlay that appears during AI analysis */}
      {renderProcessingOverlay()}
      
      {/* Add the AI processing overlay */}
      <AIProcessingOverlay 
        isVisible={isAnalyzing} 
        processingStep={processingStep}
        progress={processingProgress}
      />
      
      {/* Add the action feedback toast */}
      <ActionFeedback 
        message={actionFeedbackMessage}
        isVisible={showActionFeedback}
      />
      
      {/* Improved header with progress indicator */}
      <div className="bg-gradient-to-r from-[#E0F7FA] to-[#E0F2F1] p-6 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <h2 className="text-2xl font-bold text-[#0097A7] mb-2">
              AI Biz Strategist
            </h2>
            <p className="text-gray-700 text-sm">Making smart financial decisions for business success</p>
          </div>
          <div className="md:col-span-3">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              {ANALYTICS_STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center mb-2 sm:mb-0">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full mr-2 ${
                    currentStep === step.id 
                      ? 'bg-[#0097A7] text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-sm font-medium ${
                      currentStep === step.id ? 'text-[#0097A7]' : 'text-gray-500'
                    }`}>
                      Step {index + 1}
                    </span>
                    <span className={`text-xs ${
                      currentStep === step.id ? 'text-gray-800' : 'text-gray-500'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                  {index < ANALYTICS_STEPS.length - 1 && (
                    <div className="mx-2 w-4 h-0.5 bg-gray-300 hidden sm:block"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Challenge introduction */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-start">
          <div className="bg-yellow-100 p-2 rounded-full mr-4">
            <AlertCircle size={24} className="text-yellow-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Challenge: Financial Decision-Making</h3>
            <p className="text-gray-600 mb-4">
              You're tasked with analyzing company financial data and making a strategic recommendation. 
              Should the company expand operations, cut costs, or pivot its strategy? Use AI to help analyze 
              the data and formulate your recommendation.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-1">Step 1</h4>
                <p className="text-blue-700">Review the financial data and identify key trends</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-1">Step 2</h4>
                <p className="text-blue-700">Get AI-powered insights about strategic options</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-1">Step 3</h4>
                <p className="text-blue-700">Make your recommendation based on data and insights</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial Data Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-bold text-blue-800 mb-4">Step 1: Review the Company Financial Data, Key Financial Metrics and Notable Trends data below.</h3>
            
            {/* Revenue & Profit Chart - Improved version */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h4 className="font-medium text-gray-700 mb-3">Quarterly Revenue & Profit (in $'000s)</h4>
              <div className="h-72 relative">
                {/* Improved chart with better styling and positioning */}
                <div className="absolute bottom-0 left-0 right-0 h-64 flex items-end justify-between px-4">
                  {SAMPLE_FINANCIAL_DATA.quarters.map((quarter, index) => (
                    <div key={quarter} className="flex flex-col items-center relative w-1/5">
                      {/* Revenue bar with gradient and rounded top */}
                      <div className="relative w-16 flex items-center justify-center">
                        <div 
                          className="w-16 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg shadow-md" 
                          style={{ height: `${(SAMPLE_FINANCIAL_DATA.revenue[index] / 1500000) * 250}px` }}
                        >
                          <span className="absolute -top-7 left-0 right-0 text-center text-xs font-medium text-gray-700">
                            {formatCurrency(SAMPLE_FINANCIAL_DATA.revenue[index])}
                          </span>
                        </div>
                        
                        {/* Net profit indicator */}
                        <div 
                          className={`absolute w-8 h-2 border border-gray-300 shadow-sm ${
                            SAMPLE_FINANCIAL_DATA.netProfit[index] >= 0 
                              ? 'bg-green-500' 
                              : 'bg-red-500'
                          }`}
                          style={{ 
                            bottom: `${(Math.abs(SAMPLE_FINANCIAL_DATA.netProfit[index]) / 150000) * 30}px`,
                            transform: SAMPLE_FINANCIAL_DATA.netProfit[index] < 0 ? 'translateY(100%)' : 'none',
                          }}
                        >
                          <span className={`absolute ${
                            SAMPLE_FINANCIAL_DATA.netProfit[index] >= 0 
                              ? 'bottom-4' 
                              : 'top-4'
                          } left-0 right-0 text-center text-xs font-medium text-gray-700`}>
                            {formatCurrency(SAMPLE_FINANCIAL_DATA.netProfit[index])}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-xs font-medium mt-4 bg-blue-100 w-full text-center py-1 rounded-md">
                        {quarter}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Horizontal grid lines */}
                {[0, 500000, 1000000, 1500000].map((value, index) => (
                  <div 
                    key={index}
                    className="absolute left-0 w-full border-t border-dashed border-gray-300 text-xs text-gray-500 pl-1"
                    style={{ bottom: `${(value / 1500000) * 250}px` }}
                  >
                    {formatCurrency(value)}
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-4 text-sm">
                <div className="flex items-center mr-6 px-3 py-1 bg-gray-100 rounded-full">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                  <span className="font-medium">Revenue</span>
                </div>
                <div className="flex items-center px-3 py-1 bg-gray-100 rounded-full">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                  <span className="font-medium">Net Profit</span>
                </div>
              </div>
            </div>
            
            {/* Key Financial Metrics Table */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-3">Key Financial Metrics</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Metric</th>
                      {SAMPLE_FINANCIAL_DATA.quarters.map(quarter => (
                        <th key={quarter} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">{quarter}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-800 font-medium">Revenue</td>
                      {SAMPLE_FINANCIAL_DATA.revenue.map((value, index) => (
                        <td key={index} className="px-4 py-3 text-sm text-gray-600">{formatCurrency(value)}</td>
                      ))}
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-800 font-medium">Gross Profit</td>
                      {SAMPLE_FINANCIAL_DATA.grossProfit.map((value, index) => (
                        <td key={index} className="px-4 py-3 text-sm text-gray-600">{formatCurrency(value)}</td>
                      ))}
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-800 font-medium">Net Profit</td>
                      {SAMPLE_FINANCIAL_DATA.netProfit.map((value, index) => (
                        <td key={index} className={`px-4 py-3 text-sm ${value < 0 ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                          {formatCurrency(value)}
                        </td>
                      ))}
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-800 font-medium">Marketing Expense</td>
                      {SAMPLE_FINANCIAL_DATA.expenses.marketing.map((value, index) => (
                        <td key={index} className="px-4 py-3 text-sm text-gray-600">{formatCurrency(value)}</td>
                      ))}
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-800 font-medium">R&D Expense</td>
                      {SAMPLE_FINANCIAL_DATA.expenses.rnd.map((value, index) => (
                        <td key={index} className="px-4 py-3 text-sm text-gray-600">{formatCurrency(value)}</td>
                      ))}
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-800 font-medium">Cash on Hand</td>
                      {SAMPLE_FINANCIAL_DATA.cashOnHand.map((value, index) => (
                        <td key={index} className="px-4 py-3 text-sm text-gray-600">{formatCurrency(value)}</td>
                      ))}
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-800 font-medium">Market Share</td>
                      {SAMPLE_FINANCIAL_DATA.marketSharePct.map((value, index) => (
                        <td key={index} className="px-4 py-3 text-sm text-gray-600">{value}%</td>
                      ))}
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-800 font-medium">Customer Acquisition Cost</td>
                      {SAMPLE_FINANCIAL_DATA.customerAcquisitionCost.map((value, index) => (
                        <td key={index} className="px-4 py-3 text-sm text-gray-600">${value}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Notable Trends */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-3">Notable Trends</h4>
              <ul className="space-y-2">
                {getKeyTrends().map((trend, index) => (
                  <li key={index} className="flex items-start p-2 bg-gray-50 rounded-lg">
                    <span className="text-blue-500 mr-2">•</span>
                    <span className="text-gray-700">{trend}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Key Data Points & Insights Selection */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-blue-800 flex items-center">
                  <Lightbulb size={18} className="mr-2 text-amber-500" />
                  Step 2: Choose a few Key Financial Insights
                </h4>
                <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                  <span className={selectedInsights.length === maxInsights ? 'text-amber-600 font-medium' : 'text-gray-600'}>
                    {selectedInsights.length}/{maxInsights}
                  </span> selected
                </span>
              </div>
              
              <div className="flex items-center p-3 mb-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <div className="text-blue-700 mr-2 text-lg">💡</div>
                <p className="text-sm text-blue-800">
                  Choose up to {maxInsights} key insights that you believe are most 
                  important for developing your business strategy. These will form the foundation of your recommendation.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {keyDataPoints.map((dataPoint, index) => (
                  <div 
                    key={index}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedInsights.includes(dataPoint) 
                        ? 'border-[#0097A7] bg-[#E0F7FA] shadow-md transform scale-[1.02]' 
                        : 'border-gray-200 hover:border-[#B2EBF2] hover:bg-[#F5FCFD]'
                    }`}
                    onClick={() => handleInsightSelect(dataPoint)}
                  >
                    <div className="flex items-start">
                      <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mr-3 ${
                        selectedInsights.includes(dataPoint) 
                          ? 'bg-[#0097A7] text-white' 
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {selectedInsights.includes(dataPoint) ? '✓' : (selectedInsights.length < maxInsights ? '+' : '')}
                      </div>
                      <p className={`${selectedInsights.includes(dataPoint) ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
                        {dataPoint}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Add Your Own Insight - Hidden as per requirements */}
              
              {/* Selected Insights */}
              {selectedInsights.length > 0 && (
                <div className="mt-4 bg-[#E0F7FA] p-4 rounded-lg">
                  <h5 className="font-medium text-gray-800 mb-3 flex items-center">
                    <TrendingUp size={16} className="mr-2 text-[#0097A7]" /> 
                    Your Selected Insights
                  </h5>
                  <div className="space-y-2">
                    {selectedInsights.map((insight, index) => (
                      <div key={index} className="flex items-start p-3 bg-white rounded-lg border border-[#B2EBF2] shadow-sm">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0097A7] text-white flex items-center justify-center mr-3 text-sm font-medium">
                          {index + 1}
                        </span>
                        <span className="flex-grow text-gray-800">{insight}</span>
                        <button
                          className="text-gray-400 hover:text-red-500 ml-2 p-1 hover:bg-gray-100 rounded-full"
                          onClick={() => handleInsightSelect(insight)}
                          aria-label="Remove insight"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-[#B2EBF2] flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                      These insights will guide your business strategy recommendation
                    </p>
                    {selectedInsights.length > 0 && !aiResponse && (
                      <button 
                        className={`px-5 py-3 rounded-lg font-medium transition-all flex items-center justify-center shadow-md ${
                          selectedButton === 'continue-to-analysis'
                            ? 'bg-[#00838F] text-white scale-95' 
                            : 'bg-[#0097A7] text-white hover:bg-[#00838F] hover:shadow-lg'
                        }`}
                        onClick={handleContinueToAnalysis}
                      >
                        <Brain size={18} className="mr-2" />
                        Continue to AI Analysis <span className="ml-1">→</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
            

          </div>
          
          {/* AI Analysis Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center">
              <Brain className="mr-2 text-[#0097A7]" size={20} />
              Step 3: Select Your Analysis to Get AI-Powered Strategic Insights and check out the results!
            </h3>
            
            <div className="mb-4">
              <ul className="text-gray-700 mb-4 space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Select an Analysis Type from below.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Watch AI work its magic while it analyzes the data based on your requested insight.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Review the AI-driven results.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Want to see another Insight? Click on another analysis type to regenerate results.</span>
                </li>
              </ul>
              
              <p className="text-gray-600 mb-3">
                Select an analysis type. You can click through several types to see what AI initially recommends for your business based on the financial data.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                {[
                  { id: 'expansion', label: 'Expansion Analysis', icon: '🚀', color: '#4CAF50' },
                  { id: 'cost-cutting', label: 'Cost Cutting', icon: '✂️', color: '#F44336' },
                  { id: 'investment', label: 'Investment Recommendations', icon: '💰', color: '#2196F3' },
                  { id: 'competitor', label: 'Competitor Perspective', icon: '🔄', color: '#9C27B0' },
                  { id: 'scenario', label: 'Growth Scenario Testing', icon: '🧪', color: '#FF9800' },
                  { id: 'custom', label: 'Ask Your Own Question', icon: '❓', color: '#607D8B' }
                ].map(option => (
                  <button
                    key={option.id}
                    className={`p-4 rounded-lg transition-all shadow-sm flex flex-col items-center text-center ${
                      analysisType === option.id 
                        ? 'bg-opacity-90 text-white scale-105' 
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow'
                    }`}
                    style={{ 
                      backgroundColor: analysisType === option.id ? option.color : '',
                      borderLeft: `4px solid ${option.color}`
                    }}
                    onClick={() => handleAnalysisTypeChange(option.id)}
                  >
                    <span className="text-2xl mb-2">{option.icon}</span>
                    <span className={`text-sm ${analysisType === option.id ? 'font-medium' : ''}`}>{option.label}</span>
                  </button>
                ))}
              </div>
              
              {analysisType === 'custom' && (
                <div className="mb-4 relative bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <label className="block font-medium text-gray-700 mb-2">Your Question:</label>
                  <div className="flex">
                    <input
                      type="text"
                      className="flex-grow border border-gray-300 rounded-l-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0097A7] text-base"
                      value={customQuestion}
                      onChange={handleCustomQuestionChange}
                      placeholder="e.g., What are the risks if we increase marketing spend by 20%?"
                    />
                    <button
                      className="bg-[#0097A7] text-white px-6 py-3 rounded-r-md hover:bg-[#00838F] transition-colors relative font-medium flex items-center"
                      onClick={handleCustomQuestionSubmit}
                      disabled={!customQuestion.trim() || isAnalyzing}
                    >
                      <Brain size={18} className="mr-2" />
                      Ask AI
                    </button>
                  </div>
                  {renderTooltip('customQuestion')}
                  <div className="mt-3 bg-white p-3 rounded-lg border border-gray-100">
                    <h4 className="text-sm font-medium text-gray-800 mb-2 flex items-center">
                      <Lightbulb size={16} className="mr-1 text-amber-500" />
                      Tips for effective questions:
                    </h4>
                    <ul className="text-xs text-gray-600 space-y-1 ml-5 list-disc">
                      <li>Be specific about what you want to know</li>
                      <li>Include metrics like percentages or time periods</li>
                      <li>Ask about relationships between different data points</li>
                      <li>Request specific scenarios or strategic options</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
            
            {/* AI Response */}
            {isAnalyzing ? (
              <div className="bg-gray-50 p-6 rounded-lg flex items-center justify-center min-h-[200px]">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#0097A7] border-t-transparent mr-3"></div>
                <p className="text-gray-600">Analyzing financial data...</p>
              </div>
            ) : aiResponse ? (
              <div className="bg-gray-50 p-6 rounded-lg mb-4">
                <div className="flex items-start">
                  <div className="bg-[#E0F7FA] p-2 rounded-full text-[#0097A7] mr-4 flex-shrink-0">
                    <Brain size={24} />
                  </div>
                  <div className="w-full">
                    <h4 className="font-medium text-gray-800 mb-3 text-lg">AI Analysis Results</h4>
                    <div className="text-gray-700 whitespace-pre-line prose prose-sm max-w-none">
                      {aiResponse.split('---')[0]}
                    </div>
                    
                    {aiResponse.includes('---') && (
                      <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500 italic">
                        {aiResponse.split('---')[1]}
                      </div>
                    )}

                    {/* Add prominent button to use the AI analysis */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => {
                          setSuggestedRecommendation(aiResponse.split('\n\n').pop() || '');
                          setShowRecommendationForm(true);
                          setShowActionFeedback(true);
                          setActionFeedbackMessage('AI analysis added to recommendation form!');
                          setTimeout(() => setShowActionFeedback(false), 3000);
                        }}
                        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all flex items-center justify-center shadow-md"
                      >
                        <CheckCircle size={18} className="mr-2" />
                        Use This Analysis for Your Recommendation
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
            
            {/* User recommendation section */}
            {aiResponse && !showRecommendationForm ? (
              <div className="mt-6 text-center">
                <button
                  className="py-3 px-6 bg-[#0097A7] text-white rounded-lg font-medium hover:bg-[#00838F] transition-all shadow-md hover:shadow-lg flex items-center mx-auto"
                  onClick={() => setShowRecommendationForm(true)}
                >
                  <TrendingUp size={18} className="mr-2" />
                  Make Your Business Recommendation
                </button>
                <p className="text-sm text-gray-500 mt-2">
                  Based on the analysis, provide your strategic recommendation
                </p>
              </div>
            ) : null}
            
            {showRecommendationForm && (
              <div className="bg-white p-6 rounded-lg shadow-md mb-6 border-l-4 border-[#0097A7]">
                <h3 className="text-xl font-bold mb-4 flex items-center text-[#0097A7]">
                  <TrendingUp className="mr-2" size={22} />
                  Your Strategic Recommendation
                </h3>
                
                <div className="mb-6 bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-700 mb-4">
                    Based on the financial data, AI analysis, and your selected insights, provide your business 
                    recommendation in one concise paragraph. Include specific metrics and actionable steps.
                  </p>
                  
                  {suggestedRecommendation && (
                    <div className="mb-6 bg-white p-4 rounded-lg border border-blue-200">
                      <div className="flex items-start mb-3">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <Brain size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-blue-800 mb-2">AI-Suggested Recommendation:</h4>
                          <p className="text-gray-700">{suggestedRecommendation}</p>
                        </div>
                      </div>
                      <button 
                        onClick={handleUseAiRecommendation}
                        className="w-full mt-3 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
                      >
                        <CheckCircle size={18} className="mr-2" />
                        Use this recommendation
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="mb-6">
                  <label className="block font-medium text-gray-800 mb-2">Your Recommendation:</label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#0097A7] min-h-[120px]"
                    value={userRecommendation}
                    onChange={handleUserRecommendationChange}
                    placeholder="Type your recommendation here, or use the AI suggestion above..."
                  />
                  <div className="flex justify-between mt-2 text-sm">
                    <span className="text-gray-500">{userRecommendation.length} characters</span>
                    <span className="text-gray-500">Recommended: 100-500 characters</span>
                  </div>
                </div>
                
                <div className="mb-2">
                  <h4 className="font-medium text-gray-700 mb-2">Do you agree with the AI's analysis?</h4>
                  <div className="space-y-3">
                    <label className="flex items-start p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50">
                      <input
                        type="radio"
                        name="agreementLevel"
                        className="mt-1 mr-3"
                        checked={aiAgreementLevel === 'agree'}
                        onChange={() => setAiAgreementLevel('agree')}
                      />
                      <div>
                        <span className="font-medium text-gray-800 block mb-1">I agree with the AI's analysis</span>
                        <span className="text-sm text-gray-600">I've incorporated some or all of the AI's insights into my recommendation</span>
                      </div>
                    </label>
                    
                    <label className="flex items-start p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50">
                      <input
                        type="radio"
                        name="agreementLevel"
                        className="mt-1 mr-3"
                        checked={aiAgreementLevel === 'different'}
                        onChange={() => setAiAgreementLevel('different')}
                      />
                      <div>
                        <span className="font-medium text-gray-800 block mb-1">I have a different perspective</span>
                        <span className="text-sm text-gray-600">I've developed an alternative recommendation based on my own analysis</span>
                      </div>
                    </label>
                  </div>
                </div>
                
                {/* Submit button - larger and more prominent */}
                <div className="mt-6 flex justify-end">
                  <button
                    className="px-6 py-3 bg-[#0097A7] text-white rounded-lg font-medium transition-all flex items-center shadow-md hover:shadow-lg hover:bg-[#00838F]"
                    onClick={handleRecommendationSubmit}
                    disabled={!userRecommendation.trim() || isSavingRecommendation}
                  >
                    {isSavingRecommendation ? (
                      <span className="flex items-center justify-center">
                        <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
                        Processing...
                      </span>
                    ) : (
                      <>
                        <TrendingUp size={18} className="mr-2" />
                        Submit and Continue <span className="ml-1">→</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Tips & Help Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Tips & Help</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">What to Look For</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Trends in revenue and profitability over quarters</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Changes in expense categories relative to revenue</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Cash flow patterns and available liquidity</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Market share changes and competitive position</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Using AI Effectively</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Ask specific questions about the financial data</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Request risk-benefit analysis for potential strategies</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Test different scenarios ("What if...?")</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Compare multiple strategic options</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <div className="text-yellow-600 text-xl mr-3">💡</div>
                  <div>
                    <h4 className="font-medium text-yellow-800 mb-1">Pro Tip</h4>
                    <p className="text-yellow-700 text-sm">
                      When making recommendations, consider both short-term fixes and long-term strategic changes. The best financial strategies balance immediate needs with future growth.
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Sample Questions to Ask AI</h4>
                <ul className="space-y-1 text-sm text-blue-600">
                  <li className="hover:underline cursor-pointer p-1 rounded hover:bg-blue-50" onClick={() => {
                    setCustomQuestion("What's one risk and one benefit if we try to expand next quarter?");
                    setAnalysisType('custom');
                  }}>
                    What's one risk and one benefit if we try to expand next quarter?
                  </li>
                  <li className="hover:underline cursor-pointer p-1 rounded hover:bg-blue-50" onClick={() => {
                    setCustomQuestion("Where should we focus our cost-cutting efforts based on these financials?");
                    setAnalysisType('custom');
                  }}>
                    Where should we focus our cost-cutting efforts based on these financials?
                  </li>
                  <li className="hover:underline cursor-pointer p-1 rounded hover:bg-blue-50" onClick={() => {
                    setCustomQuestion("How would these financial trends change if raw material costs increase by 15%?");
                    setAnalysisType('custom');
                  }}>
                    How would these financial trends change if raw material costs increase by 15%?
                  </li>
                  <li className="hover:underline cursor-pointer p-1 rounded hover:bg-blue-50" onClick={() => {
                    setCustomQuestion("Should we prioritize growth or profitability next quarter?");
                    setAnalysisType('custom');
                  }}>
                    Should we prioritize growth or profitability next quarter?
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Continue button at bottom of sidebar */}
            {selectedInsights.length > 0 && userRecommendation && !showRecommendationForm && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  className="w-full py-3 bg-[#0097A7] text-white rounded-lg font-medium hover:bg-[#00838F] transition-all shadow-md hover:shadow-lg flex items-center justify-center"
                  onClick={handleRecommendationSubmit}
                >
                  <TrendingUp size={18} className="mr-2" />
                  Continue to Next Step <span className="ml-1">→</span>
                </button>
                <p className="text-xs text-center text-gray-500 mt-2">
                  Your recommendation will be analyzed and processed
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialDataAnalysis; // Cache buster Wed Mar 12 11:25:49 EDT 2025
