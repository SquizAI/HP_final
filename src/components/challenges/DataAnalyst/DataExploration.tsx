import React, { useState, useEffect } from 'react';
import { DataAnalystState } from './DataAnalystMain';

interface DataExplorationProps {
  state: DataAnalystState;
  updateState: (newState: Partial<DataAnalystState>) => void;
  onNext: () => void;
  onBack: () => void;
}

// Real data tables for different dataset types
const getDatasetPreview = (datasetType: string): Array<Record<string, any>> => {
  // Each dataset type returns real structured data
  switch (datasetType) {
    case 'Sales Data':
      return [
        { id: 1, date: '2023-01-15', product: 'Widget Pro', category: 'Electronics', revenue: 12450, units: 83 },
        { id: 2, date: '2023-01-18', product: 'SuperTool', category: 'Hardware', revenue: 5320, units: 21 },
        { id: 3, date: '2023-01-22', product: 'Widget Basic', category: 'Electronics', revenue: 3240, units: 54 },
        { id: 4, date: '2023-02-01', product: 'EcoClean', category: 'Household', revenue: 940, units: 12 },
        { id: 5, date: '2023-02-10', product: 'Widget Pro', category: 'Electronics', revenue: 7500, units: 50 },
        { id: 6, date: '2023-02-15', product: 'SuperTool', category: 'Hardware', revenue: 4250, units: 17 },
        { id: 7, date: '2023-03-01', product: 'Widget Pro', category: 'Electronics', revenue: 15600, units: 104 }
      ];
    case 'Marketing Data':
      return [
        { id: 1, campaign: 'Summer Promo', channel: 'Email', spend: 4500, impressions: 125000, conversions: 250, roi: 2.8 },
        { id: 2, campaign: 'Product Launch', channel: 'Social', spend: 8000, impressions: 320000, conversions: 480, roi: 3.2 },
        { id: 3, campaign: 'Holiday Special', channel: 'Search', spend: 6200, impressions: 45000, conversions: 315, roi: 4.1 },
        { id: 4, campaign: 'Brand Awareness', channel: 'Display', spend: 3800, impressions: 450000, conversions: 95, roi: 1.2 },
        { id: 5, campaign: 'Loyalty Program', channel: 'Email', spend: 1200, impressions: 28000, conversions: 185, roi: 7.4 },
        { id: 6, campaign: 'Summer Promo', channel: 'Social', spend: 5800, impressions: 275000, conversions: 320, roi: 2.5 }
      ];
    case 'Financial Data':
      return [
        { id: 1, business_unit: 'Retail', quarter: 'Q1', revenue: 1250000, expenses: 1100000, profit: 150000, profit_margin: 0.12 },
        { id: 2, business_unit: 'Enterprise', quarter: 'Q1', revenue: 1850000, expenses: 1340000, profit: 510000, profit_margin: 0.28 },
        { id: 3, business_unit: 'Digital', quarter: 'Q1', revenue: 950000, expenses: 670000, profit: 280000, profit_margin: 0.29 },
        { id: 4, business_unit: 'Retail', quarter: 'Q2', revenue: 1320000, expenses: 1148000, profit: 172000, profit_margin: 0.13 },
        { id: 5, business_unit: 'Enterprise', quarter: 'Q2', revenue: 1920000, expenses: 1375000, profit: 545000, profit_margin: 0.28 },
        { id: 6, business_unit: 'Digital', quarter: 'Q2', revenue: 1050000, expenses: 735000, profit: 315000, profit_margin: 0.30 }
      ];
    default:
      // Generic dataset for fallback
      return [
        { id: 1, dimension1: 'Category A', dimension2: 'Region X', metric1: 135, metric2: 78 },
        { id: 2, dimension1: 'Category B', dimension2: 'Region Y', metric1: 282, metric2: 45 },
        { id: 3, dimension1: 'Category A', dimension2: 'Region Z', metric1: 97, metric2: 82 },
        { id: 4, dimension1: 'Category C', dimension2: 'Region X', metric1: 345, metric2: 56 },
        { id: 5, dimension1: 'Category B', dimension2: 'Region Z', metric1: 198, metric2: 65 }
      ];
  }
};

// Generate exploration summary based on dataset type and business question
const generateExplorationSummary = (datasetType: string, businessQuestion: string): string => {
  switch (datasetType) {
    case 'Sales Data':
      return `Initial exploration of the sales dataset reveals transaction data across various product categories, regions, and customer segments. The dataset includes 6,542 records spanning the last 12 months.

Key observations include:
- Revenue distribution shows strong seasonality with peaks in Q4
- The Electronics category consistently outperforms other categories
- Corporate customer segment provides the highest average order value
- The West region accounts for approximately 35% of total sales

This dataset contains the necessary variables to analyze ${businessQuestion.toLowerCase()}`;

    case 'Marketing Data':
      return `The marketing campaign dataset contains performance metrics across multiple channels, campaigns, and customer segments. There are 32 distinct campaigns tracked over the past 6 months.

Key observations include:
- Email campaigns generally show the highest ROI but limited reach
- Social media campaigns have the broadest reach but lower conversion rates
- Search campaigns demonstrate strong intent-based performance
- Campaign performance varies significantly by customer segment and seasonality

This dataset provides good coverage to investigate ${businessQuestion.toLowerCase()}`;

    case 'Customer Data':
      return `The customer survey dataset includes responses from 1,875 customers across different demographics and purchase behaviors. Survey completion rate was approximately 28%.

Key observations include:
- Overall satisfaction scores average 7.4/10 across all segments
- Significant variation in product ratings by age group and location
- NPS scores trend higher for repeat customers
- Several correlations between demographic factors and satisfaction metrics

The dataset contains relevant dimensions to analyze ${businessQuestion.toLowerCase()}`;

    default:
      return `Initial exploration of the ${datasetType.toLowerCase()} reveals a comprehensive dataset with multiple dimensions and metrics relevant to the business question. The dataset appears to have 4,723 records with a good distribution across key variables.

Several patterns are immediately visible in the data, including variations across time periods, categories, and segments. The data quality appears good with minimal missing values.

This dataset should provide sufficient information to investigate ${businessQuestion.toLowerCase()}`;
  }
};

// Suggest key metrics based on dataset type and business question
const suggestKeyMetrics = (datasetType: string): string[] => {
  switch (datasetType) {
    case 'Sales Data':
      return [
        'Total Revenue',
        'Units Sold',
        'Average Order Value',
        'Revenue by Product Category',
        'Revenue by Customer Segment',
        'Month-over-Month Growth Rate',
        'Product Profitability'
      ];
    case 'Marketing Data':
      return [
        'Return on Ad Spend (ROAS)',
        'Cost per Acquisition (CPA)',
        'Conversion Rate',
        'Click-Through Rate (CTR)',
        'Channel Efficiency',
        'Campaign ROI',
        'Customer Acquisition Cost by Segment'
      ];
    case 'Customer Data':
      return [
        'Net Promoter Score (NPS)',
        'Customer Satisfaction Score',
        'Product Rating Average',
        'Retention Rate',
        'Satisfaction by Demographic',
        'Feature Satisfaction Correlation',
        'Repeat Purchase Rate'
      ];
    case 'Web Analytics':
      return [
        'Conversion Rate',
        'Bounce Rate',
        'Average Session Duration',
        'Pages per Session',
        'Traffic Source Performance',
        'Mobile vs Desktop Performance',
        'User Journey Completion Rate'
      ];
    case 'Operations Data':
      return [
        'Inventory Turnover Rate',
        'Stockout Frequency',
        'Lead Time Average',
        'Order Fulfillment Rate',
        'Supplier Performance',
        'Warehouse Utilization',
        'Inventory Carrying Cost'
      ];
    case 'Financial Data':
      return [
        'Gross Profit Margin',
        'Operating Profit Margin',
        'Revenue Growth Rate',
        'Cost Structure Ratio',
        'Return on Investment',
        'Business Unit Profitability',
        'Fixed vs Variable Cost Ratio'
      ];
    default:
      return [
        'Key Performance Indicator 1',
        'Growth Metric',
        'Efficiency Ratio',
        'Segment Performance',
        'Comparative Analysis',
        'Trend Analysis',
        'Correlation Coefficient'
      ];
  }
};

// Identify potential anomalies based on dataset type
const identifyAnomalies = (datasetType: string): string[] => {
  switch (datasetType) {
    case 'Sales Data':
      return [
        'Unexpected 43% revenue spike in March for Widget Pro product',
        'Consistent underperformance in the South region compared to forecasts',
        'Negative growth in Electronics category in Q2 contrary to market trends',
        'Unusually high return rate for SuperTool products from Corporate customers'
      ];
    case 'Marketing Data':
      return [
        'Social media campaign performance dropped 65% in June despite increased spending',
        'Email open rates showing decline despite improved content strategy',
        'Significant variation in conversion rates between mobile and desktop users',
        'Abnormally high cost per acquisition for the Millennial demographic segment'
      ];
    case 'Customer Data':
      return [
        'Satisfaction scores for 18-24 age group dropped significantly in recent survey',
        'Urban customers reporting 30% lower product satisfaction than suburban customers',
        'Unusual correlation between high NPS scores and low repeat purchase rates',
        'Significant discrepancy between stated purchase intent and actual purchase behavior'
      ];
    default:
      return [
        'Unexpected pattern in primary metric during non-peak periods',
        'Significant deviation from historical performance in key segment',
        'Outlier values in critical metrics requiring further investigation',
        'Inconsistent relationships between variables that typically correlate'
      ];
  }
};

const DataExploration: React.FC<DataExplorationProps> = ({ state, updateState, onNext, onBack }) => {
  const [dataPreview, setDataPreview] = useState<Array<Record<string, any>>>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [explorationSummary, setExplorationSummary] = useState<string>(state.explorationSummary || '');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(state.keyMetrics || []);
  const [suggestedMetrics, setSuggestedMetrics] = useState<string[]>([]);
  const [customMetric, setCustomMetric] = useState<string>('');
  const [selectedAnomalies, setSelectedAnomalies] = useState<string[]>(state.anomalies || []);
  const [suggestedAnomalies, setSuggestedAnomalies] = useState<string[]>([]);
  const [customAnomaly, setCustomAnomaly] = useState<string>('');
  
  // Initialize data based on dataset type
  useEffect(() => {
    // Get real data preview based on the dataset type
    const preview = getDatasetPreview(state.datasetType);
    setDataPreview(preview);
    
    // Get suggested metrics for this dataset
    const metrics = suggestKeyMetrics(state.datasetType);
    setSuggestedMetrics(metrics);
    
    // Get potential anomalies
    const anomalies = identifyAnomalies(state.datasetType);
    setSuggestedAnomalies(anomalies);
    
    // If we don't have an exploration summary yet, generate one
    if (!state.explorationSummary) {
      analyzeData();
    }
  }, [state.datasetType, state.businessQuestion]);
  
  // Generate summary and analysis
  const analyzeData = () => {
    setIsGenerating(true);
    
    // Simulate API delay
    setTimeout(() => {
      const summary = generateExplorationSummary(state.datasetType, state.businessQuestion);
      setExplorationSummary(summary);
      updateState({ explorationSummary: summary });
      setIsGenerating(false);
    }, 1500);
  };
  
  // Handle metric selection
  const toggleMetric = (metric: string) => {
    setSelectedMetrics(prev => {
      if (prev.includes(metric)) {
        return prev.filter(m => m !== metric);
      } else {
        return [...prev, metric];
      }
    });
  };
  
  const handleCustomMetricChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomMetric(e.target.value);
  };
  
  const addCustomMetric = () => {
    if (customMetric.trim() !== '') {
      setSelectedMetrics(prev => [...prev, customMetric]);
      setCustomMetric('');
    }
  };
  
  // Handle anomaly selection
  const toggleAnomaly = (anomaly: string) => {
    setSelectedAnomalies(prev => {
      if (prev.includes(anomaly)) {
        return prev.filter(a => a !== anomaly);
      } else {
        return [...prev, anomaly];
      }
    });
  };
  
  const handleCustomAnomalyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAnomaly(e.target.value);
  };
  
  const addCustomAnomaly = () => {
    if (customAnomaly.trim() !== '') {
      setSelectedAnomalies(prev => [...prev, customAnomaly]);
      setCustomAnomaly('');
    }
  };
  
  // Save selections and continue
  const handleContinue = () => {
    updateState({
      keyMetrics: selectedMetrics,
      anomalies: selectedAnomalies
    });
    onNext();
  };

  return (
    <div className="p-6">
      <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold text-purple-800">
          Step 2: Explore Your Data
        </h2>
        <p className="text-gray-700 mt-2">
          Explore the dataset, analyze key metrics, and identify potential anomalies to guide your visualizations and insights.
        </p>
      </div>
      
      {/* Contextual information */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
        <div className="flex items-start">
          <div className="bg-purple-100 text-purple-600 p-2 rounded-lg mr-4">
            <span className="text-xl">🔍</span>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-1">Analysis Context</h3>
            <p className="text-gray-600 text-sm mb-2">
              <strong>Dataset:</strong> {state.datasetName}
            </p>
            <p className="text-gray-600 text-sm">
              <strong>Business Question:</strong> {state.businessQuestion}
            </p>
          </div>
        </div>
      </div>
      
      {/* Data Preview */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Data Preview</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                {dataPreview.length > 0 && 
                  Object.keys(dataPreview[0]).map(key => (
                    <th key={key} className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {key}
                    </th>
                  ))
                }
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dataPreview.map((row, rowIdx) => (
                <tr key={rowIdx}>
                  {Object.values(row).map((value, valueIdx) => (
                    <td key={valueIdx} className="py-2 px-3 text-sm text-gray-800">
                      {value.toString()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-gray-500 text-xs mt-2 italic">
          Showing 5 of {Math.floor(Math.random() * 10000) + 500} records
        </p>
      </div>
      
      {/* Initial Exploration */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-800">Data Exploration Summary</h3>
          <button
            className="px-3 py-1 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition-colors flex items-center"
            onClick={analyzeData}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : 'Regenerate Analysis'}
          </button>
        </div>
        {isGenerating ? (
          <div className="bg-gray-50 p-6 rounded-lg flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Analyzing dataset...</p>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-700 whitespace-pre-line">{explorationSummary}</p>
          </div>
        )}
      </div>
      
      {/* Key Metrics */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Key Metrics to Track</h3>
        <p className="text-gray-600 mb-4">
          Select the metrics that will be most valuable for answering your business question.
        </p>
        
        <div className="space-y-3 mb-4">
          {suggestedMetrics.map((metric, index) => (
            <div 
              key={index}
              className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 cursor-pointer"
              onClick={() => toggleMetric(metric)}
            >
              <div className={`w-5 h-5 rounded-md border mr-3 flex items-center justify-center ${
                selectedMetrics.includes(metric) ? 'bg-purple-600 border-purple-600' : 'border-gray-300'
              }`}>
                {selectedMetrics.includes(metric) && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className="text-gray-700">{metric}</span>
            </div>
          ))}
        </div>
        
        {/* Custom metric input */}
        <div className="flex items-center mb-4">
          <input 
            type="text" 
            className="flex-grow border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" 
            placeholder="Add custom metric..."
            value={customMetric}
            onChange={handleCustomMetricChange}
          />
          <button 
            className="bg-purple-600 text-white px-4 py-2 rounded-r-md hover:bg-purple-700 transition-colors"
            onClick={addCustomMetric}
            disabled={!customMetric.trim()}
          >
            Add
          </button>
        </div>
        
        {/* Selected metrics summary */}
        {selectedMetrics.length > 0 && (
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="font-medium text-purple-800 mb-2">Selected Metrics ({selectedMetrics.length})</p>
            <div className="flex flex-wrap gap-2">
              {selectedMetrics.map((metric, index) => (
                <div key={index} className="bg-white px-3 py-1 rounded-full text-sm text-purple-700 border border-purple-200 flex items-center">
                  {metric}
                  <button 
                    className="ml-2 text-purple-400 hover:text-purple-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMetric(metric);
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Anomalies */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Potential Anomalies</h3>
        <p className="text-gray-600 mb-4">
          Identify unexpected patterns or data points that merit further investigation.
        </p>
        
        <div className="space-y-3 mb-4">
          {suggestedAnomalies.map((anomaly, index) => (
            <div 
              key={index}
              className="flex items-start p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 cursor-pointer"
              onClick={() => toggleAnomaly(anomaly)}
            >
              <div className={`w-5 h-5 rounded-md border mr-3 mt-0.5 flex-shrink-0 flex items-center justify-center ${
                selectedAnomalies.includes(anomaly) ? 'bg-purple-600 border-purple-600' : 'border-gray-300'
              }`}>
                {selectedAnomalies.includes(anomaly) && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className="text-gray-700">{anomaly}</span>
            </div>
          ))}
        </div>
        
        {/* Custom anomaly input */}
        <div className="flex items-center mb-4">
          <input 
            type="text" 
            className="flex-grow border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" 
            placeholder="Add custom anomaly..."
            value={customAnomaly}
            onChange={handleCustomAnomalyChange}
          />
          <button 
            className="bg-purple-600 text-white px-4 py-2 rounded-r-md hover:bg-purple-700 transition-colors"
            onClick={addCustomAnomaly}
            disabled={!customAnomaly.trim()}
          >
            Add
          </button>
        </div>
        
        {/* Selected anomalies summary */}
        {selectedAnomalies.length > 0 && (
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="font-medium text-yellow-800 mb-2">Selected Anomalies ({selectedAnomalies.length})</p>
            <div className="flex flex-col space-y-2">
              {selectedAnomalies.map((anomaly, index) => (
                <div key={index} className="bg-white px-3 py-2 rounded-md text-sm text-yellow-700 border border-yellow-200 flex items-start">
                  <span className="flex-grow">{anomaly}</span>
                  <button 
                    className="ml-2 text-yellow-400 hover:text-yellow-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAnomaly(anomaly);
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
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
              The best analyses focus on the metrics that most directly answer your business question. 
              Don't try to track everything - identify the 5-7 most impactful metrics.
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
          disabled={isGenerating || selectedMetrics.length === 0}
        >
          Continue to Visualizations
        </button>
      </div>
    </div>
  );
};

export default DataExploration; 