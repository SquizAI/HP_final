// src/services/openai.ts
import { staticTrendData } from '../data/staticTrendData'

// This function gets the API key from environment variables for security
export const getApiKey = (): string => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    console.error('OpenAI API key not found. Please set VITE_OPENAI_API_KEY in your environment variables.');
    return '';
  }
  return apiKey;
};

export interface ApiResponse {
  data: string[];
  source: 'static' | 'api';
  references?: string[];
  companyExamples?: string[];
}

// Trend response schema for structured output
interface TrendResponseSchema {
  trends: {
    description: string;
    references: string[];
  }[];
}

// Business opportunity response schema for structured output
interface OpportunityResponseSchema {
  opportunities: {
    description: string;
    references: string[];
    companyExamples: string[];
  }[];
}

// Get trends for a specific industry
export const getTrendsForIndustry = async (industry: string): Promise<ApiResponse> => {
  // First check if we have static data for this industry
  if (staticTrendData.trends[industry]) {
    return {
      data: staticTrendData.trends[industry],
      source: 'static',
      references: staticTrendData.references[industry],
      companyExamples: staticTrendData.companyExamples[industry]
    };
  }
  
  // If not, use the API with structured output
  const apiKey = getApiKey();
  if (!apiKey) return { data: [], source: 'static' };

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are an expert in business trends and market analysis. Provide concise, specific and forward-looking emerging trends. Each trend should include references to credible sources or publications where similar trends have been discussed.'
          },
          {
            role: 'user',
            content: `What are three emerging trends in ${industry}? For each trend, include 2-3 references to publications, research papers, or credible sources that discuss this trend. Return your response in a structured JSON format.`
          }
        ],
        temperature: 0.7,
        max_tokens: 800,
        response_format: { type: "json_object" },
        functions: [
          {
            name: "get_trends",
            description: "Get emerging trends with references for a specific industry",
            parameters: {
              type: "object",
              properties: {
                trends: {
                  type: "array",
                  description: "List of trends with references",
                  items: {
                    type: "object",
                    properties: {
                      description: {
                        type: "string",
                        description: "Detailed description of the trend"
                      },
                      references: {
                        type: "array",
                        description: "Academic or industry references for this trend",
                        items: {
                          type: "string"
                        }
                      }
                    },
                    required: ["description", "references"]
                  }
                }
              },
              required: ["trends"]
            }
          }
        ],
        function_call: { name: "get_trends" }
      })
    });

    const data = await response.json();
    
    if (data.error) {
      console.error('OpenAI API error:', data.error);
      return { data: getMockTrends(industry), source: 'static' };
    }
    
    // Extract the structured data from the function call
    const functionCall = data.choices[0].message.function_call;
    if (functionCall && functionCall.name === "get_trends") {
      try {
        const parsedArgs = JSON.parse(functionCall.arguments) as TrendResponseSchema;
        const trends = parsedArgs.trends.map(t => t.description);
        const references = parsedArgs.trends.map(t => t.references.join(', '));
        
        return {
          data: trends,
          source: 'api',
          references
        };
      } catch (e) {
        console.error('Error parsing function response:', e);
      }
    }
    
    // Fallback to the old way if function calling didn't work
    const content = data.choices[0].message.content;
    try {
      const jsonContent = JSON.parse(content) as TrendResponseSchema;
      const trends = jsonContent.trends.map(t => t.description);
      const references = jsonContent.trends.map(t => t.references.join(', '));
      
      return {
        data: trends,
        source: 'api',
        references
      };
    } catch (e) {
      console.error('Error parsing JSON response:', e);
      // Last resort fallback
      return { data: getMockTrends(industry), source: 'static' };
    }
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return { data: getMockTrends(industry), source: 'static' };
  }
};

// Get business opportunities for a specific industry
export const getBusinessOpportunities = async (industry: string): Promise<ApiResponse> => {
  // First check if we have static data for this industry
  if (staticTrendData.opportunities[industry]) {
    return {
      data: staticTrendData.opportunities[industry],
      source: 'static',
      references: staticTrendData.references[industry],
      companyExamples: staticTrendData.companyExamples[industry]
    };
  }
  
  // If not, use the API with structured output
  const apiKey = getApiKey();
  if (!apiKey) return { data: [], source: 'static' };

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are an expert in business strategy and innovation. Provide specific, actionable business opportunities. Each opportunity should include references to real companies or market reports that support this approach.'
          },
          {
            role: 'user',
            content: `How might businesses capitalize on emerging trends in ${industry}? Provide three specific business opportunities. For each opportunity, include references to real companies implementing similar strategies and market reports. Return your response in a structured JSON format.`
          }
        ],
        temperature: 0.7,
        max_tokens: 800,
        response_format: { type: "json_object" },
        functions: [
          {
            name: "get_opportunities",
            description: "Get business opportunities with references and examples for a specific industry",
            parameters: {
              type: "object",
              properties: {
                opportunities: {
                  type: "array",
                  description: "List of business opportunities with references and company examples",
                  items: {
                    type: "object",
                    properties: {
                      description: {
                        type: "string",
                        description: "Detailed description of the business opportunity"
                      },
                      references: {
                        type: "array",
                        description: "Market reports or academic references supporting this opportunity",
                        items: {
                          type: "string"
                        }
                      },
                      companyExamples: {
                        type: "array",
                        description: "Examples of companies implementing similar strategies",
                        items: {
                          type: "string"
                        }
                      }
                    },
                    required: ["description", "references", "companyExamples"]
                  }
                }
              },
              required: ["opportunities"]
            }
          }
        ],
        function_call: { name: "get_opportunities" }
      })
    });

    const data = await response.json();
    
    if (data.error) {
      console.error('OpenAI API error:', data.error);
      return { data: getMockOpportunities(industry), source: 'static' };
    }
    
    // Extract the structured data from the function call
    const functionCall = data.choices[0].message.function_call;
    if (functionCall && functionCall.name === "get_opportunities") {
      try {
        const parsedArgs = JSON.parse(functionCall.arguments) as OpportunityResponseSchema;
        const opportunities = parsedArgs.opportunities.map(o => o.description);
        const references = parsedArgs.opportunities.map(o => o.references.join(', '));
        const companyExamples = parsedArgs.opportunities.map(o => o.companyExamples.join(', '));
        
        return {
          data: opportunities,
          source: 'api',
          references,
          companyExamples
        };
      } catch (e) {
        console.error('Error parsing function response:', e);
      }
    }
    
    // Fallback to the old way if function calling didn't work
    const content = data.choices[0].message.content;
    try {
      const jsonContent = JSON.parse(content) as OpportunityResponseSchema;
      const opportunities = jsonContent.opportunities.map(o => o.description);
      const references = jsonContent.opportunities.map(o => o.references.join(', '));
      const companyExamples = jsonContent.opportunities.map(o => o.companyExamples.join(', '));
      
      return {
        data: opportunities,
        source: 'api',
        references,
        companyExamples
      };
    } catch (e) {
      console.error('Error parsing JSON response:', e);
      // Last resort fallback
      return { data: getMockOpportunities(industry), source: 'static' };
    }
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return { data: getMockOpportunities(industry), source: 'static' };
  }
};

// Mock data for fallback when API is unavailable
const mockTrends: Record<string, string[]> = {
  'AI in Education': [
    'Personalized learning paths driven by AI that adapt to individual student needs and learning styles',
    'Immersive learning experiences using VR/AR technologies to enhance engagement and retention',
    'AI teaching assistants and tutors that provide 24/7 support to students across subjects'
  ],
  'Remote Work Technology': [
    'Virtual collaboration platforms with AI-enhanced team dynamics and workflow optimization',
    'Asynchronous communication tools designed to improve work-life balance across time zones',
    'Home office technology ecosystems that replicate professional workplace environments'
  ],
  'Future of Retail': [
    'Hyper-personalized shopping experiences driven by predictive AI and behavioral analytics',
    'Seamless integration between digital and physical retail spaces (phygital retail)',
    'Autonomous mobile retail solutions that bring products directly to consumers'
  ],
  'Healthcare Innovation': [
    'AI-powered predictive diagnostics that identify potential health issues before symptoms appear',
    'Decentralized healthcare delivery through remote monitoring and telehealth',
    'Personalized medicine using genomic data and AI to tailor treatments to individual patients'
  ],
  'Financial Technology': [
    'Embedded finance integrating financial services into non-financial applications and platforms',
    'Decentralized finance (DeFi) solutions that bypass traditional banking infrastructure',
    'AI-driven financial advisors providing personalized wealth management strategies'
  ],
  'Sustainable Business': [
    'Circular economy business models that eliminate waste and maximize resource utilization',
    'Carbon-neutral supply chains using blockchain for transparent environmental impact tracking',
    'Climate tech innovations enabling businesses to adapt to and mitigate climate change'
  ]
};

const mockOpportunities: Record<string, string[]> = {
  'AI in Education': [
    'Educational institutions can partner with AI developers to create customized learning platforms tailored to their curriculum and student needs',
    'Companies can develop subscription models for AI tutoring services that supplement traditional education',
    'Educational content creators can develop adaptive learning materials that integrate with AI platforms'
  ],
  'Remote Work Technology': [
    'Companies can offer remote work consulting services to help businesses optimize their virtual work environments',
    'Developers can create integrated software solutions that combine project management, communication, and performance tracking',
    'Hardware manufacturers can develop specialized home office equipment designed specifically for remote professionals'
  ],
  'Future of Retail': [
    'Retailers can implement predictive inventory systems that optimize stock levels based on AI forecasting',
    'Businesses can develop hybrid shopping experiences that merge online convenience with in-store personalization',
    'Brands can create subscription services driven by AI that anticipate customer needs before they arise'
  ],
  'Healthcare Innovation': [
    'Healthcare providers can implement early-detection systems using AI to improve preventative care',
    'Companies can develop remote monitoring platforms for chronic condition management',
    'Health insurers can offer personalized wellness programs based on individual health data and AI recommendations'
  ],
  'Financial Technology': [
    'Banks can develop API-driven services that integrate with non-financial platforms',
    'Financial institutions can create hybrid models incorporating traditional and decentralized finance options',
    'Companies can offer AI financial planning tools as employee benefits to improve financial wellness'
  ],
  'Sustainable Business': [
    'Manufacturers can redesign products for circular lifecycles to reduce waste and create new revenue streams',
    'Companies can develop sustainability analytics platforms that help businesses track and improve their environmental impact',
    'Service providers can offer carbon offset subscription services integrated with business operations'
  ]
};

// Helper functions to get mock data when needed
const getMockTrends = (industry: string): string[] => {
  return mockTrends[industry] || mockTrends['AI in Education'];
};

const getMockOpportunities = (industry: string): string[] => {
  return mockOpportunities[industry] || mockOpportunities['AI in Education'];
}; 