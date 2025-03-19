import React, { useState } from 'react';
import { DataAnalystState, DataVisualization as VisualizationType } from './DataAnalystMain';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, ScatterChart, Scatter, XAxis, YAxis, 
         CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface DataVisualizationProps {
  state: DataAnalystState;
  updateState: (newState: Partial<DataAnalystState>) => void;
  onNext: () => void;
  onBack: () => void;
}

// Chart type definitions with properties
const CHART_TYPES = [
  {
    id: 'bar',
    name: 'Bar Chart',
    icon: '📊',
    description: 'Great for comparing values across categories',
    bestFor: ['Comparing categories', 'Showing distributions', 'Ranking data']
  },
  {
    id: 'line',
    name: 'Line Chart',
    icon: '📈',
    description: 'Perfect for showing trends over time',
    bestFor: ['Time series', 'Trend analysis', 'Continuous data']
  },
  {
    id: 'pie',
    name: 'Pie Chart',
    icon: '🍩',
    description: 'Shows parts of a whole as percentages',
    bestFor: ['Composition data', 'Proportions', 'Small number of categories']
  },
  {
    id: 'scatter',
    name: 'Scatter Plot',
    icon: '✨',
    description: 'Visualizes relationships between two variables',
    bestFor: ['Correlation analysis', 'Distribution patterns', 'Outlier detection']
  },
];

// The output structure is now described directly in the UI
// for better user experience

// Sample data generator for visualizations
const generateSampleData = (chartType: string, categories: string[] = []): any[] => {
  // If no categories provided, generate some
  const defaultCategories = ['Category A', 'Category B', 'Category C', 'Category D', 'Category E'];
  const useCategories = categories.length > 0 ? categories : defaultCategories;
  
  switch(chartType) {
    case 'bar':
      return useCategories.map(category => ({
        name: category,
        value: Math.floor(Math.random() * 1000) + 100,
      }));
    
    case 'line':
      return Array.from({ length: 12 }, (_, i) => ({
        name: `Month ${i + 1}`,
        value: Math.floor(Math.random() * 1000) + 100,
      }));
    
    case 'pie':
      return useCategories.map(category => ({
        name: category,
        value: Math.floor(Math.random() * 100) + 20,
      }));
      
    case 'scatter':
      return Array.from({ length: 20 }, (_, i) => ({
        x: Math.floor(Math.random() * 100),
        y: Math.floor(Math.random() * 100),
        z: Math.floor(Math.random() * 40) + 5, // Size value
        name: `Point ${i + 1}`,
      }));
      
    default:
      return useCategories.map(category => ({
        name: category,
        value: Math.floor(Math.random() * 1000) + 100,
      }));
  }
};

// CHART_COLORS for consistent styling
const CHART_COLORS = ['#6200EA', '#B388FF', '#651FFF', '#7C4DFF', '#3D5AFE', '#536DFE'];

// Real data for different dataset types
const getRealDataForVisualization = (datasetType: string, chartType: string): any[] => {
  // Generate data based on dataset type
  switch(datasetType) {
    case 'Sales Data':
      if (chartType === 'bar') {
        // Product categories by revenue
        return [
          { name: 'Electronics', value: 38510 },
          { name: 'Hardware', value: 9570 },
          { name: 'Household', value: 940 }
        ];
      } else if (chartType === 'line') {
        // Monthly sales trends
        return [
          { name: 'Jan', value: 21010 },
          { name: 'Feb', value: 11750 },
          { name: 'Mar', value: 15600 }
        ];
      } else if (chartType === 'pie') {
        // Revenue distribution by product
        return [
          { name: 'Widget Pro', value: 35550 },
          { name: 'SuperTool', value: 9570 },
          { name: 'Widget Basic', value: 3240 },
          { name: 'EcoClean', value: 940 }
        ];
      } else if (chartType === 'scatter') {
        return Array.from({ length: 10 }, () => ({
          x: 20 + Math.floor(Math.random() * 30), // Price
          y: 10 + Math.floor(Math.random() * 90), // Units sold
          name: 'Product'
        }));
      }
      break;
    
    case 'Marketing Data':
      if (chartType === 'bar') {
        // ROI by channel
        return [
          { name: 'Email', value: 5.1 },
          { name: 'Social', value: 2.85 },
          { name: 'Search', value: 4.1 },
          { name: 'Display', value: 1.2 }
        ];
      } else if (chartType === 'line') {
        // Conversion trend for campaigns
        return [
          { name: 'Campaign 1', value: 250 },
          { name: 'Campaign 2', value: 480 },
          { name: 'Campaign 3', value: 315 },
          { name: 'Campaign 4', value: 95 },
          { name: 'Campaign 5', value: 185 },
          { name: 'Campaign 6', value: 320 }
        ];
      } else if (chartType === 'pie') {
        // Impressions by channel
        return [
          { name: 'Email', value: 153000 },
          { name: 'Social', value: 595000 },
          { name: 'Search', value: 45000 },
          { name: 'Display', value: 450000 }
        ];
      } else if (chartType === 'scatter') {
        return Array.from({ length: 10 }, () => ({
          x: 1000 + Math.floor(Math.random() * 9000), // Ad spend
          y: 0.01 + Math.random() * 0.09, // Conversion rate
          name: 'Campaign'
        }));
      }
      break;

    case 'Financial Data':
      if (chartType === 'bar') {
        // Profit by business unit (Q1)
        return [
          { name: 'Retail', value: 150000 },
          { name: 'Enterprise', value: 510000 },
          { name: 'Digital', value: 280000 }
        ];
      } else if (chartType === 'line') {
        // Profit margin over time
        return [
          { name: 'Q1 Retail', value: 0.12 },
          { name: 'Q2 Retail', value: 0.13 },
          { name: 'Q1 Enterprise', value: 0.28 },
          { name: 'Q2 Enterprise', value: 0.28 },
          { name: 'Q1 Digital', value: 0.29 },
          { name: 'Q2 Digital', value: 0.30 }
        ];
      } else if (chartType === 'pie') {
        // Revenue distribution by business unit (Q2)
        return [
          { name: 'Retail', value: 1320000 },
          { name: 'Enterprise', value: 1920000 },
          { name: 'Digital', value: 1050000 }
        ];
      } else if (chartType === 'scatter') {
        return Array.from({ length: 10 }, () => ({
          x: 500000 + Math.floor(Math.random() * 1500000), // Revenue
          y: 0.1 + Math.random() * 0.3, // Profit margin
          name: 'Business Unit'
        }));
      }
      break;
      
    default:
      // Fallback to sample data if dataset type not found
      return generateSampleData(chartType);
  }
  
  // Fallback if specific chart type not found for dataset
  return generateSampleData(chartType);
};

// Chart Renderer Component - Update to show axis labels based on data type
const ChartRenderer: React.FC<{ 
  type: string, 
  height?: number, 
  data?: any[],
  datasetType?: string 
}> = ({ 
  type, 
  height = 300,
  data = [],
  datasetType = ''
}) => {
  // Generate data if none provided
  const chartData = data.length > 0 ? data : 
    (datasetType ? getRealDataForVisualization(datasetType, type) : generateSampleData(type));
  
  // Determine appropriate axis labels based on dataset type and chart type
  let xAxisLabel = 'Category';
  let yAxisLabel = 'Value';
  
  if (datasetType === 'Sales Data') {
    if (type === 'bar') {
      xAxisLabel = 'Product Category';
      yAxisLabel = 'Revenue ($)';
    } else if (type === 'line') {
      xAxisLabel = 'Month';
      yAxisLabel = 'Revenue ($)';
    } else if (type === 'scatter') {
      xAxisLabel = 'Price ($)';
      yAxisLabel = 'Units Sold';
    }
  } else if (datasetType === 'Marketing Data') {
    if (type === 'bar') {
      xAxisLabel = 'Channel';
      yAxisLabel = 'ROI';
    } else if (type === 'line') {
      xAxisLabel = 'Campaign';
      yAxisLabel = 'Conversions';
    } else if (type === 'scatter') {
      xAxisLabel = 'Ad Spend ($)';
      yAxisLabel = 'Conversion Rate';
    }
  } else if (datasetType === 'Financial Data') {
    if (type === 'bar') {
      xAxisLabel = 'Business Unit';
      yAxisLabel = 'Profit ($)';
    } else if (type === 'line') {
      xAxisLabel = 'Quarter';
      yAxisLabel = 'Profit Margin';
    } else if (type === 'scatter') {
      xAxisLabel = 'Revenue ($)';
      yAxisLabel = 'Profit Margin';
    }
  }
  // Add more dataset type conditions as needed
  
  switch(type) {
    case 'bar':
      return (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" label={{ value: xAxisLabel, position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#6200EA" name="Value" />
          </BarChart>
        </ResponsiveContainer>
      );
      
    case 'line':
      return (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" label={{ value: xAxisLabel, position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#6200EA" activeDot={{ r: 8 }} name="Value" />
          </LineChart>
        </ResponsiveContainer>
      );
      
    case 'pie':
      return (
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
      
    case 'scatter':
      return (
        <ResponsiveContainer width="100%" height={height}>
          <ScatterChart>
            <CartesianGrid />
            <XAxis type="number" dataKey="x" name="X Value" />
            <YAxis type="number" dataKey="y" name="Y Value" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Legend />
            <Scatter name="Data Points" data={chartData} fill="#6200EA" />
          </ScatterChart>
        </ResponsiveContainer>
      );
      
    default:
      return <div className="flex justify-center items-center h-64 bg-gray-100 rounded-lg">No chart data available</div>;
  }
};

// Update the generateVisualization function to use real data 
const generateVisualization = (
  datasetType: string, 
  businessQuestion: string, 
  metrics: string[], 
  anomalies: string[]
): Promise<VisualizationType> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Select appropriate chart type based on business question and dataset
      let chartType = 'bar';
      
      // Determine chart type based on business question content
      if (businessQuestion.toLowerCase().includes('trend') || 
          businessQuestion.toLowerCase().includes('over time') ||
          businessQuestion.toLowerCase().includes('growth')) {
        chartType = 'line';
      } else if (businessQuestion.toLowerCase().includes('proportion') || 
                businessQuestion.toLowerCase().includes('composition') ||
                businessQuestion.toLowerCase().includes('distribution')) {
        chartType = 'pie';
      } else if (businessQuestion.toLowerCase().includes('correlation') || 
                businessQuestion.toLowerCase().includes('relationship') ||
                businessQuestion.toLowerCase().includes('compare')) {
        chartType = 'scatter';
      }
      
      // Generate title based on dataset type and business question
      let title = `Analysis of ${datasetType}`;
      let description = `This visualization shows key metrics from your ${datasetType} dataset.`;
      
      // Generate insights based on chart type and business question
      const insights = [];
      
      // Add specific insights based on dataset type
      if (datasetType === 'Sales Data') {
        if (chartType === 'bar') {
          title = 'Revenue by Product Category';
          description = 'Comparative analysis of revenue across different product categories';
          insights.push('Electronics is the highest performing category, representing 35% of total revenue');
          insights.push('Home Goods shows potential for growth with competitive margins');
        } else if (chartType === 'line') {
          title = 'Monthly Revenue Trend';
          description = 'Analysis of revenue performance throughout the year';
          insights.push('Q4 shows significant revenue growth with a 41% increase from Q3');
          insights.push('There is a clear seasonal pattern with peaks during holiday months');
        }
      } else if (datasetType === 'Marketing Data') {
        if (chartType === 'bar') {
          title = 'Return on Ad Spend (ROAS) by Channel';
          description = 'Comparative analysis of marketing efficiency across channels';
          insights.push('Email marketing shows the highest ROAS at 4.2x, making it the most efficient channel');
          insights.push('PPC has the lowest return but offers scale advantages not shown in this chart');
        }
      }
      
      // Add generic insights if needed to reach at least 3
      if (insights.length < 3) {
        insights.push(`Key insight related to ${businessQuestion}`);
        insights.push(`Notable pattern in the ${metrics[0] || 'primary metric'}`);
      }
      
      // Add anomaly if available
      if (anomalies.length > 0) {
        insights.push(`Anomaly detected: ${anomalies[0]}`);
      }
      
      const visualization: VisualizationType = {
        title: title,
        type: chartType as any,
        description: description,
        insights: insights,
        // Add real data for the chart
        data: getRealDataForVisualization(datasetType, chartType)
      };
      
      resolve(visualization);
    }, 2000);
  });
};

// Update the DataVisualization interface
interface VisualizationProps extends VisualizationType {
  data?: any[];
}

const DataVisualization: React.FC<DataVisualizationProps> = ({ state, updateState, onNext, onBack }) => {
  const [visualizations, setVisualizations] = useState<VisualizationProps[]>(state.visualizations || []);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentViz, setCurrentViz] = useState<VisualizationProps | null>(null);
  const [selectedChartType, setSelectedChartType] = useState<string>('');
  const [showAiHelper, setShowAiHelper] = useState<boolean>(false);
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customDescription, setCustomDescription] = useState<string>('');
  const [aiPrompt, setAiPrompt] = useState<string>('');
  
  // Generate a visualization based on the dataset and metrics
  const generateViz = async () => {
    setIsGenerating(true);
    
    try {
      const newViz = await generateVisualization(
        state.datasetType,
        state.businessQuestion,
        state.keyMetrics,
        state.anomalies
      );
      
      setCurrentViz(newViz);
      setIsGenerating(false);
    } catch (error) {
      console.error('Error generating visualization:', error);
      setIsGenerating(false);
    }
  };
  
  // Add the current visualization to the list
  const addVisualization = () => {
    if (currentViz) {
      setVisualizations(prev => [...prev, currentViz]);
      setCurrentViz(null);
      setSelectedChartType('');
      setCustomTitle('');
      setCustomDescription('');
    }
  };
  
  // Add a custom visualization
  const addCustomVisualization = () => {
    if (customTitle && customDescription && selectedChartType) {
      const newViz: VisualizationProps = {
        title: customTitle,
        type: selectedChartType as any,
        description: customDescription,
        insights: [],
        data: generateSampleData(selectedChartType)
      };
      
      setVisualizations(prev => [...prev, newViz]);
      setSelectedChartType('');
      setCustomTitle('');
      setCustomDescription('');
    }
  };
  
  // Remove a visualization from the list
  const removeVisualization = (index: number) => {
    setVisualizations(prev => prev.filter((_, i) => i !== index));
  };
  
  // Handle chart type selection
  const handleChartTypeSelect = (chartId: string) => {
    setSelectedChartType(chartId);
  };
  
  // Handle AI prompt input
  const handleAiPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAiPrompt(e.target.value);
  };
  
  // Generate a visualization from AI prompt
  const generateFromPrompt = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    
    // In a real implementation, this would call an OpenAI API with function calling
    // to generate structured visualization data
    setTimeout(() => {
      // Use the user's selected chart type if available, otherwise randomly select one
      let chartType;
      
      if (selectedChartType) {
        // User has already selected a chart type, use it
        chartType = selectedChartType;
      } else {
        // No chart selected yet, check if the prompt mentions a specific chart type
        const promptLower = aiPrompt.toLowerCase();
        if (promptLower.includes('bar chart') || promptLower.includes('bar graph')) {
          chartType = 'bar';
        } else if (promptLower.includes('line chart') || promptLower.includes('trend')) {
          chartType = 'line';
        } else if (promptLower.includes('pie chart') || promptLower.includes('proportion')) {
          chartType = 'pie';
        } else if (promptLower.includes('scatter plot') || promptLower.includes('correlation')) {
          chartType = 'scatter';
        } else {
          // If no specific chart mentioned, select one based on data type
          // This would normally be determined by AI analysis of the data
          const chartTypes = ['bar', 'line', 'pie', 'scatter'];
          const randomTypeIndex = Math.floor(Math.random() * chartTypes.length);
          chartType = chartTypes[randomTypeIndex];
        }
      }
      
      // Set the selected chart type to match what will be generated
      setSelectedChartType(chartType);
      
      const newViz: VisualizationProps = {
        title: `Analysis of ${state.datasetType} for ${state.businessQuestion}`,
        type: chartType as any,
        description: 'Custom visualization generated from your prompt.',
        insights: [
          'Custom insight based on your prompt.',
          'Additional insight derived from data analysis.',
          'Key observation related to your business question.'
        ],
        data: generateSampleData(chartType)
      };
      
      setCurrentViz(newViz);
      setIsGenerating(false);
      setShowAiHelper(false);
    }, 2000);
  };
  
  // Save visualizations and continue
  const handleContinue = () => {
    updateState({
      visualizations: visualizations.map(viz => ({
        title: viz.title,
        type: viz.type,
        description: viz.description,
        insights: viz.insights,
        data: viz.data || []
      }))
    });
    onNext();
  };

  return (
    <div className="p-6">
      <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold text-purple-800">
          Step 3: Create Visualizations
        </h2>
        <p className="text-gray-700 mt-2">
          Create meaningful visualizations to help understand patterns and trends in your data.
        </p>
      </div>
      
      {/* Dataset and metrics context */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
        <div className="flex items-start">
          <div className="bg-purple-100 text-purple-600 p-2 rounded-lg mr-4">
            <span className="text-xl">📊</span>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-1">Analysis Context</h3>
            <p className="text-gray-600 text-sm mb-2">
              <strong>Dataset:</strong> {state.datasetName}
            </p>
            <p className="text-gray-600 text-sm mb-2">
              <strong>Key Metrics:</strong> {state.keyMetrics.join(', ')}
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
            <h3 className="text-lg font-medium text-purple-800 mb-3">AI Visualization Helper</h3>
            <p className="text-gray-600 mb-4">
              Tell the AI what you want to visualize, and it will generate a structured visualization for you.
            </p>
            
            <div className="mb-4">
              <textarea
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[120px]"
                placeholder="Describe what you want to visualize. For example: 'Create a bar chart showing revenue by product category with a focus on seasonal trends.'"
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
                    <li>The specific chart type you want (bar, line, pie, scatter)</li>
                    <li>What data you want to see visualized</li>
                    <li>What relationships or patterns you're interested in</li>
                    <li>Any specific metrics to highlight</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-gray-500 text-sm mb-3">
                <strong>Output Structure:</strong> All visualizations will be generated with a consistent structure including:
              </p>
              <ul className="text-gray-600 text-sm list-disc pl-5">
                <li><strong>Title:</strong> Clear, descriptive title</li>
                <li><strong>Chart Type:</strong> The best chart type for your data (bar, line, pie, scatter)</li>
                <li><strong>Description:</strong> Brief explanation of what the visualization shows</li>
                <li><strong>Axes:</strong> What the x and y axes represent (for relevant chart types)</li>
                <li><strong>Key Insights:</strong> Important patterns or findings from the visualization</li>
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
                <>Generate Visualization</>
              )}
            </button>
          </div>
        )}
      </div>
      
      {/* Chart type selection - Improved UI */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Choose Visualization Type</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {CHART_TYPES.map((chart) => (
            <div
              key={chart.id}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedChartType === chart.id 
                  ? 'border-purple-500 bg-purple-50 shadow-md transform scale-105' 
                  : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-sm'
              }`}
              onClick={() => handleChartTypeSelect(chart.id)}
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-3 bg-gray-50 rounded-lg w-full p-2 flex items-center justify-center" style={{height: "90px"}}>
                  {chart.id === 'bar' && (
                    <div className="w-full h-full flex items-end justify-around px-2">
                      {[40, 65, 30, 80, 50].map((h, i) => (
                        <div key={i} className="bg-purple-600 w-3" style={{height: `${h}%`}}></div>
                      ))}
                    </div>
                  )}
                  {chart.id === 'line' && (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg viewBox="0 0 100 50" className="w-full h-full">
                        <path
                          d="M0,40 L20,35 L40,20 L60,30 L80,10 L100,25"
                          fill="none"
                          stroke="#6200EA"
                          strokeWidth="3"
                        />
                      </svg>
                    </div>
                  )}
                  {chart.id === 'pie' && (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-3/4 h-3/4">
                        <circle cx="50" cy="50" r="40" fill="#E0E0E0" />
                        <path
                          d="M50,50 L50,10 A40,40 0 0,1 83.6,38.5 z"
                          fill="#6200EA"
                        />
                        <path
                          d="M50,50 L83.6,38.5 A40,40 0 0,1 66.1,83.6 z"
                          fill="#B388FF"
                        />
                        <path
                          d="M50,50 L66.1,83.6 A40,40 0 0,1 16.4,61.5 z"
                          fill="#651FFF"
                        />
                      </svg>
                    </div>
                  )}
                  {chart.id === 'scatter' && (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-3/4 h-3/4">
                        {[
                          [20, 70, 5],
                          [30, 40, 4],
                          [45, 60, 6],
                          [55, 30, 3],
                          [70, 50, 7],
                          [80, 25, 4]
                        ].map(([cx, cy, r], i) => (
                          <circle key={i} cx={cx} cy={cy} r={r} fill="#6200EA" />
                        ))}
                      </svg>
                    </div>
                  )}
                </div>
                <h4 className="font-medium text-gray-800">{chart.name}</h4>
                <p className="text-xs text-gray-500 mt-1">{chart.description}</p>
                <div className="mt-2 w-full">
                  <ul className="text-xs text-gray-600 space-y-1">
                    {chart.bestFor.slice(0, 2).map((use, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-purple-500 mr-1">•</span>
                        <span>{use}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {selectedChartType && (
          <div className="bg-purple-50 p-4 rounded-lg mb-4 border border-purple-100">
            <h4 className="font-medium text-purple-800 mb-2">Selected: {CHART_TYPES.find(c => c.id === selectedChartType)?.name}</h4>
            <p className="text-sm text-purple-700 mb-2">
              Preview how your data will look with this chart type:
            </p>
            <div className="bg-white p-3 rounded-lg border border-purple-100" style={{height: "180px"}}>
              <ChartRenderer 
                type={selectedChartType} 
                height={160} 
                datasetType={state.datasetType} 
              />
            </div>
          </div>
        )}
        
        <div className="flex flex-wrap gap-4 mt-6">
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            onClick={generateViz}
            disabled={isGenerating || !selectedChartType}
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin inline-block mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clipRule="evenodd" />
                </svg>
                Create Chart with {selectedChartType ? CHART_TYPES.find(c => c.id === selectedChartType)?.name : 'Selected Type'}
              </>
            )}
          </button>
          
          <button
            className="px-4 py-2 border border-purple-300 text-purple-700 bg-white rounded-md hover:bg-purple-50 transition-colors flex items-center"
            onClick={() => {
              setSelectedChartType('');
              setCurrentViz(null);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Reset
          </button>
        </div>
      </div>
      
      {/* Custom chart form */}
      {selectedChartType === 'custom' && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Custom Visualization</h3>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Visualization Title
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Revenue by Product Category"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chart Type
              </label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={selectedChartType}
                onChange={(e) => setSelectedChartType(e.target.value)}
              >
                <option value="">Select chart type</option>
                {CHART_TYPES.map(chart => (
                  <option key={chart.id} value={chart.id}>{chart.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[80px]"
                placeholder="Briefly describe what this visualization shows"
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
              ></textarea>
            </div>
          </div>
          
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={addCustomVisualization}
            disabled={!customTitle || !customDescription || !selectedChartType}
          >
            Add Visualization
          </button>
        </div>
      )}
      
      {/* Current visualization preview - Improved UI */}
      {currentViz && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8 shadow-md">
          <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 10-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Generated Visualization
          </h3>
          
          <div className="mb-6">
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex justify-between mb-3">
                <h4 className="text-xl font-medium text-gray-800">{currentViz.title}</h4>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                  {CHART_TYPES.find(c => c.id === currentViz.type)?.name}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{currentViz.description}</p>
              
              <div className="h-80 mt-4 pb-4 border-b border-gray-200">
                <ChartRenderer type={currentViz.type} data={currentViz.data} datasetType={state.datasetType} />
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-800 mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                </svg>
                Key Insights
              </h4>
              <ul className="space-y-2">
                {currentViz.insights.map((insight, index) => (
                  <li key={index} className="flex items-start p-2 bg-white rounded-md">
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-purple-100 text-purple-800 rounded-full mr-2 text-xs font-medium">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              className="px-4 py-2 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700 transition-colors flex items-center"
              onClick={addVisualization}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              Add to My Visualizations
            </button>
            <button
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center"
              onClick={() => setCurrentViz(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Discard
            </button>
          </div>
        </div>
      )}
      
      {/* Saved visualizations - Enhanced UI */}
      {visualizations.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
            My Visualizations ({visualizations.length})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {visualizations.map((viz, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-gray-800 flex items-center">
                      {viz.title}
                      <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">
                        {CHART_TYPES.find(c => c.id === viz.type)?.name}
                      </span>
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">{viz.description}</p>
                  </div>
                  <div className="flex space-x-1">
                    <button 
                      className="p-1 text-gray-400 hover:text-purple-500 hover:bg-purple-50 rounded-full transition-colors"
                      onClick={() => {
                        // Set as current visualization for editing
                        setCurrentViz(viz);
                        removeVisualization(index);
                      }}
                      title="Edit visualization"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button
                      className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      onClick={() => removeVisualization(index)}
                      title="Remove visualization"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="h-48 my-3 border border-gray-100 rounded-lg overflow-hidden bg-gray-50">
                  <ChartRenderer type={viz.type} data={viz.data} height={190} datasetType={state.datasetType} />
                </div>
                
                {viz.insights.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <details className="text-sm">
                      <summary className="font-medium text-purple-800 cursor-pointer hover:text-purple-600">
                        Key Insights ({viz.insights.length})
                      </summary>
                      <ul className="mt-2 space-y-1 pl-2">
                        {viz.insights.map((insight, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-purple-500 mr-1">•</span>
                            <span className="text-gray-700 text-sm">{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Reordering instructions */}
          {visualizations.length > 1 && (
            <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800 flex items-start mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-medium">Tip: Organize your visualizations</p>
                <p>You can use the edit button to modify any visualization. Consider organizing your visualizations to tell a coherent data story.</p>
              </div>
            </div>
          )}
          
          {/* Clear all button */}
          {visualizations.length > 1 && (
            <div className="flex justify-end">
              <button
                className="text-sm text-red-600 hover:text-red-800 flex items-center"
                onClick={() => {
                  if (window.confirm('Are you sure you want to remove all visualizations?')) {
                    setVisualizations([]);
                  }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Clear All Visualizations
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Visualization Tips - Enhanced */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg mb-8 border border-purple-100">
        <h4 className="font-medium text-purple-800 mb-3 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
          </svg>
          Data Visualization Pro Tips
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <h5 className="font-medium text-gray-800 mb-1">Choosing the Right Chart</h5>
            <ul className="text-sm space-y-1">
              <li className="flex items-start">
                <span className="text-purple-500 mr-1">•</span>
                <span>Bar charts: Best for comparing values across categories</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-1">•</span>
                <span>Line charts: Perfect for showing trends over time</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-1">•</span>
                <span>Pie charts: Use for showing composition of a whole</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-1">•</span>
                <span>Scatter plots: Ideal for showing relationships between variables</span>
              </li>
            </ul>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <h5 className="font-medium text-gray-800 mb-1">Effective Visualization</h5>
            <ul className="text-sm space-y-1">
              <li className="flex items-start">
                <span className="text-purple-500 mr-1">•</span>
                <span>Use clear titles that explain what the visualization shows</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-1">•</span>
                <span>Label axes appropriately to prevent misinterpretation</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-1">•</span>
                <span>Use consistent colors to help viewers make comparisons</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-1">•</span>
                <span>Include insights that highlight the most important findings</span>
              </li>
            </ul>
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
          disabled={isGenerating || visualizations.length === 0}
        >
          Continue to Insights
        </button>
      </div>
    </div>
  );
};

export default DataVisualization; 