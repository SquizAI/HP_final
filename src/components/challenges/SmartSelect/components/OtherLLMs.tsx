import React from 'react';

interface LLMData {
  name: string;
  provider: string;
  description: string;
  releaseDate: string;
  contextWindow: number;
  pricing?: string;
  apiAvailable: boolean;
  openSource: boolean;
  strengths: string[];
  website: string;
}

export const OtherLLMs: React.FC = () => {
  const otherLLMs: LLMData[] = [
    {
      name: 'Claude 3.7 Sonnet',
      provider: 'Anthropic',
      description: 'Advanced model with strong reasoning capabilities and excellent human-like text generation with a large context window.',
      releaseDate: 'October 2024',
      contextWindow: 200000,
      pricing: '$3 per 1M input tokens, $15 per 1M output tokens',
      apiAvailable: true,
      openSource: false,
      strengths: [
        'Nuanced reasoning and detailed explanations',
        'High accuracy with long contexts',
        'Strong ethics and safety focus',
        'Multimodal capabilities (images)'
      ],
      website: 'https://www.anthropic.com/claude'
    },
    {
      name: 'Llama 3.1',
      provider: 'Meta',
      description: 'Open-source model designed for both researchers and commercial applications with competitive performance.',
      releaseDate: 'July 2024',
      contextWindow: 128000,
      pricing: 'Free (self-hosted) or via API providers',
      apiAvailable: true,
      openSource: true,
      strengths: [
        'Strong open-source performance',
        'Multiple model sizes (8B, 70B, 405B)',
        'Commercially permissive license',
        'Balanced capabilities across tasks'
      ],
      website: 'https://ai.meta.com/llama/'
    },
    {
      name: 'Mistral Large 2',
      provider: 'Mistral AI',
      description: 'Powerful model with a focus on reasoning, multilingual capabilities, and coding.',
      releaseDate: 'July 2024',
      contextWindow: 32768,
      pricing: '$5 per 1M input tokens, $15 per 1M output tokens',
      apiAvailable: true,
      openSource: false,
      strengths: [
        'Strong reasoning capabilities',
        'Excellent code generation',
        'Multilingual support',
        'Function calling support'
      ],
      website: 'https://mistral.ai/'
    },
    {
      name: 'DeepSeek-V2',
      provider: 'DeepSeek',
      description: 'High-performance LLM with strong capabilities in knowledge, reasoning, and coding.',
      releaseDate: 'June 2024',
      contextWindow: 32768,
      pricing: 'Varies by provider',
      apiAvailable: true,
      openSource: true,
      strengths: [
        'Programming excellence',
        'Mathematical reasoning',
        'Scientific knowledge',
        'Efficient inference'
      ],
      website: 'https://github.com/deepseek-ai/DeepSeek-V2'
    },
    {
      name: 'Grok-2',
      provider: 'xAI',
      description: 'Real-time web-connected AI model with a conversational, sometimes playful style.',
      releaseDate: 'July 2024',
      contextWindow: 128000,
      pricing: 'Premium subscription service',
      apiAvailable: false,
      openSource: false,
      strengths: [
        'Real-time web access',
        'Humor and personality',
        'Broad knowledge',
        'Image understanding'
      ],
      website: 'https://www.x.ai/'
    },
    {
      name: 'Claude Opus',
      provider: 'Anthropic',
      description: 'Anthropic\'s most capable model with advanced reasoning and improved accuracy.',
      releaseDate: 'March 2024',
      contextWindow: 200000,
      pricing: '$15 per 1M input tokens, $75 per 1M output tokens',
      apiAvailable: true,
      openSource: false,
      strengths: [
        'Nuanced reasoning',
        'Complex instruction following',
        'Long document analysis',
        'Reduced hallucinations'
      ],
      website: 'https://www.anthropic.com/claude'
    },
    {
      name: 'Phi-3',
      provider: 'Microsoft',
      description: 'Compact yet powerful model optimized for efficiency and reasoning tasks.',
      releaseDate: 'April 2024',
      contextWindow: 128000,
      pricing: 'Varies by provider',
      apiAvailable: true,
      openSource: true,
      strengths: [
        'Exceptional performance for size',
        'Strong reasoning capabilities',
        'Efficient on consumer hardware',
        'Domain-specific versions available'
      ],
      website: 'https://huggingface.co/microsoft/phi-3'
    },
    {
      name: 'Command R+',
      provider: 'Cohere',
      description: 'Enterprise-focused model optimized for RAG applications and complex business use cases.',
      releaseDate: 'April 2024',
      contextWindow: 128000,
      pricing: 'Custom enterprise pricing',
      apiAvailable: true,
      openSource: false,
      strengths: [
        'Optimized for enterprise retrieval',
        'Multilingual capabilities',
        'Domain-specific knowledge',
        'Security and compliance focus'
      ],
      website: 'https://cohere.com/'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="prose prose-lg max-w-none">
        <h2>Other Available Large Language Models</h2>
        <p>
          Beyond GPT-4o and Gemini 2.0 Flash, there are many other powerful LLMs available for various applications.
          This overview highlights some of the most notable models from other providers, each with unique 
          strengths and capabilities.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {otherLLMs.map((llm) => (
          <div key={llm.name} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="px-6 py-4 border-b border-gray-200 bg-purple-50">
              <h3 className="text-lg font-medium text-gray-900">{llm.name}</h3>
              <div className="flex justify-between items-center mt-1">
                <p className="text-sm text-gray-500">by {llm.provider}</p>
                <div className="flex space-x-2">
                  {llm.apiAvailable && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      API Available
                    </span>
                  )}
                  {llm.openSource && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Open Source
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="px-6 py-4">
              <p className="text-sm text-gray-600 mb-4">{llm.description}</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-sm">
                  <p className="text-gray-500 font-medium">Release Date</p>
                  <p className="text-gray-900">{llm.releaseDate}</p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-500 font-medium">Context Window</p>
                  <p className="text-gray-900">{llm.contextWindow.toLocaleString()} tokens</p>
                </div>
                {llm.pricing && (
                  <div className="text-sm col-span-2">
                    <p className="text-gray-500 font-medium">Pricing</p>
                    <p className="text-gray-900">{llm.pricing}</p>
                  </div>
                )}
              </div>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Key Strengths</h4>
                <ul className="space-y-1">
                  {llm.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-4 w-4 text-purple-500 mt-0.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-600">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-auto">
                <a 
                  href={llm.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-800"
                >
                  Learn more
                  <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
        <h3 className="text-lg font-medium text-purple-800 mb-4">Understanding the LLM Landscape</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-base font-medium text-purple-700 mb-2">Open Source vs. Proprietary</h4>
            <p className="text-purple-700 text-sm">
              Open source models like Llama and Mistral offer flexibility for self-hosting and fine-tuning,
              while proprietary models from OpenAI, Anthropic, and Google often provide superior performance
              and are accessible through well-maintained APIs with robust support.
            </p>
          </div>
          <div>
            <h4 className="text-base font-medium text-purple-700 mb-2">Specialized vs. General Purpose</h4>
            <p className="text-purple-700 text-sm">
              Some models are optimized for specific tasks like coding (DeepSeek, Phind), enterprise RAG (Command R),
              or reasoning (Claude). Consider your specific use case when selecting a model rather than
              only choosing based on general benchmarks.
            </p>
          </div>
          <div>
            <h4 className="text-base font-medium text-purple-700 mb-2">Cost Considerations</h4>
            <p className="text-purple-700 text-sm">
              Pricing varies dramatically between models. For high-volume applications, consider
              more efficient models like Gemini Flash or self-hosted open source alternatives.
              Premium models like Claude Opus and GPT-4o may be worth the cost for complex reasoning tasks.
            </p>
          </div>
          <div>
            <h4 className="text-base font-medium text-purple-700 mb-2">Multimodal Capabilities</h4>
            <p className="text-purple-700 text-sm">
              The latest generation of models increasingly supports multimodal inputs and outputs.
              Consider not just text capabilities but also how well models handle images, audio,
              and potentially video for your specific applications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 