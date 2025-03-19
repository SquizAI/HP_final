import React from 'react';
import { ModelInfo } from '../AIModelComparison';

interface ModelCapabilitiesProps {
  gptrModel: ModelInfo;
  geminiModel: ModelInfo;
}

export const ModelCapabilities: React.FC<ModelCapabilitiesProps> = ({ gptrModel, geminiModel }) => {
  return (
    <div className="space-y-8">
      <div className="prose prose-lg max-w-none">
        <h2>Model Capabilities Comparison</h2>
        <p>
          Modern large language models like GPT-4o and Gemini 2.0 Flash offer a wide range of capabilities for processing various types of inputs
          and generating useful outputs. This comparison highlights the key features of each model to help you understand when to use each one.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* GPT-4o Card */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="bg-green-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="rounded-full bg-green-100 p-2 flex-shrink-0">
                <svg className="h-6 w-6 text-green-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">{gptrModel.name}</h3>
                <p className="text-gray-500">by {gptrModel.provider}</p>
              </div>
            </div>
          </div>
          
          <div className="px-6 py-5">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Multimodal Capabilities</h4>
            <div className="space-y-5">
              <div>
                <h5 className="text-base font-medium text-gray-900 mb-2">Input Formats</h5>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg className="mt-0.5 h-5 w-5 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div className="ml-2">
                      <span className="text-gray-900 font-medium">Text:</span>
                      <span className="text-gray-700 ml-1">Full natural language understanding with 128K context window</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="mt-0.5 h-5 w-5 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div className="ml-2">
                      <span className="text-gray-900 font-medium">Images:</span>
                      <span className="text-gray-700 ml-1">Advanced visual understanding and interpretation</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="mt-0.5 h-5 w-5 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div className="ml-2">
                      <span className="text-gray-900 font-medium">Audio:</span>
                      <span className="text-gray-700 ml-1">Voice input with transcription capabilities (via API)</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="mt-0.5 h-5 w-5 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div className="ml-2">
                      <span className="text-gray-900 font-medium">Video:</span>
                      <span className="text-gray-700 ml-1">Understanding video content by processing frames (experimental)</span>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div>
                <h5 className="text-base font-medium text-gray-900 mb-2">Output Formats</h5>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg className="mt-0.5 h-5 w-5 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div className="ml-2">
                      <span className="text-gray-900 font-medium">Text:</span>
                      <span className="text-gray-700 ml-1">High-quality text generation with reasoning</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="mt-0.5 h-5 w-5 text-amber-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div className="ml-2">
                      <span className="text-gray-900 font-medium">Images:</span>
                      <span className="text-gray-700 ml-1">Available via DALL-E 3 integration, not natively in API</span>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div>
                <h5 className="text-base font-medium text-gray-900 mb-2">API Features</h5>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg className="mt-0.5 h-5 w-5 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div className="ml-2">
                      <span className="text-gray-900 font-medium">Function Calling:</span>
                      <span className="text-gray-700 ml-1">Structured function calling with multiple functions</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="mt-0.5 h-5 w-5 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div className="ml-2">
                      <span className="text-gray-900 font-medium">JSON Mode:</span>
                      <span className="text-gray-700 ml-1">Strict JSON output formatting</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="mt-0.5 h-5 w-5 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div className="ml-2">
                      <span className="text-gray-900 font-medium">System Instructions:</span>
                      <span className="text-gray-700 ml-1">Fine-grained control over model behavior</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="mt-0.5 h-5 w-5 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div className="ml-2">
                      <span className="text-gray-900 font-medium">Streaming:</span>
                      <span className="text-gray-700 ml-1">Token-by-token streaming for responsive UIs</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="text-sm">
              <h4 className="text-gray-500 font-medium uppercase tracking-wider mb-2">Pricing</h4>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div className="mb-2 sm:mb-0">
                  <span className="text-gray-700 font-medium">Input tokens:</span>
                  <span className="text-gray-900 ml-1">${gptrModel.inputPrice.toFixed(2)}/1M tokens</span>
                </div>
                <div>
                  <span className="text-gray-700 font-medium">Output tokens:</span>
                  <span className="text-gray-900 ml-1">${gptrModel.outputPrice.toFixed(2)}/1M tokens</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Gemini Card */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="bg-blue-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="rounded-full bg-blue-100 p-2 flex-shrink-0">
                <svg className="h-6 w-6 text-blue-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 8C15 10.2091 13.2091 12 11 12C8.79086 12 7 10.2091 7 8C7 5.79086 8.79086 4 11 4C13.2091 4 15 5.79086 15 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M11 20C7.13401 20 4 16.866 4 13H18C18 16.866 14.866 20 11 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">{geminiModel.name}</h3>
                <p className="text-gray-500">by {geminiModel.provider}</p>
              </div>
            </div>
          </div>
          
          <div className="px-6 py-5">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Multimodal Capabilities</h4>
            <div className="space-y-5">
              <div>
                <h5 className="text-base font-medium text-gray-900 mb-2">Input Formats</h5>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg className="mt-0.5 h-5 w-5 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div className="ml-2">
                      <span className="text-gray-900 font-medium">Text:</span>
                      <span className="text-gray-700 ml-1">Full natural language processing with 1M context window</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="mt-0.5 h-5 w-5 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div className="ml-2">
                      <span className="text-gray-900 font-medium">Images:</span>
                      <span className="text-gray-700 ml-1">Visual understanding with multiple images per prompt (up to 3,600)</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="mt-0.5 h-5 w-5 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div className="ml-2">
                      <span className="text-gray-900 font-medium">Audio:</span>
                      <span className="text-gray-700 ml-1">Audio processing up to 9.5 hours</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="mt-0.5 h-5 w-5 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div className="ml-2">
                      <span className="text-gray-900 font-medium">Video:</span>
                      <span className="text-gray-700 ml-1">Video processing up to 1 hour</span>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div>
                <h5 className="text-base font-medium text-gray-900 mb-2">Output Formats</h5>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg className="mt-0.5 h-5 w-5 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div className="ml-2">
                      <span className="text-gray-900 font-medium">Text:</span>
                      <span className="text-gray-700 ml-1">Efficient text generation optimized for speed</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="mt-0.5 h-5 w-5 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div className="ml-2">
                      <span className="text-gray-900 font-medium">Images:</span>
                      <span className="text-gray-700 ml-1">Image generation in preview/early-access stage</span>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div>
                <h5 className="text-base font-medium text-gray-900 mb-2">API Features</h5>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg className="mt-0.5 h-5 w-5 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div className="ml-2">
                      <span className="text-gray-900 font-medium">Function Calling:</span>
                      <span className="text-gray-700 ml-1">Native function calling support</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="mt-0.5 h-5 w-5 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div className="ml-2">
                      <span className="text-gray-900 font-medium">JSON Mode:</span>
                      <span className="text-gray-700 ml-1">JSON output with schema validation</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="mt-0.5 h-5 w-5 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div className="ml-2">
                      <span className="text-gray-900 font-medium">System Instructions:</span>
                      <span className="text-gray-700 ml-1">Configurable system prompts</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="mt-0.5 h-5 w-5 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div className="ml-2">
                      <span className="text-gray-900 font-medium">Code Execution:</span>
                      <span className="text-gray-700 ml-1">Native code execution support</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="text-sm">
              <h4 className="text-gray-500 font-medium uppercase tracking-wider mb-2">Pricing</h4>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div className="mb-2 sm:mb-0">
                  <span className="text-gray-700 font-medium">Input tokens:</span>
                  <span className="text-gray-900 ml-1">${geminiModel.inputPrice.toFixed(2)}/1M tokens</span>
                </div>
                <div>
                  <span className="text-gray-700 font-medium">Output tokens:</span>
                  <span className="text-gray-900 ml-1">${geminiModel.outputPrice.toFixed(2)}/1M tokens</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-medium text-blue-800 mb-4">Key Differences</h3>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium">1</div>
            <div className="ml-3">
              <h4 className="text-base font-medium text-blue-800">Context Window</h4>
              <p className="text-blue-700 mt-1">Gemini 2.0 Flash offers an impressive 1 million token context window compared to GPT-4o's 128K tokens, allowing it to process approximately 8x more information in a single prompt.</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium">2</div>
            <div className="ml-3">
              <h4 className="text-base font-medium text-blue-800">Cost Efficiency</h4>
              <p className="text-blue-700 mt-1">Gemini 2.0 Flash is significantly more cost-effective at approximately 1/10th the cost of GPT-4o for both input and output tokens, making it more suitable for high-volume applications.</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium">3</div>
            <div className="ml-3">
              <h4 className="text-base font-medium text-blue-800">Output Generation</h4>
              <p className="text-blue-700 mt-1">GPT-4o typically produces more detailed, nuanced responses with stronger reasoning capabilities, while Gemini 2.0 Flash excels at quick, efficient responses that are more direct and concise.</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium">4</div>
            <div className="ml-3">
              <h4 className="text-base font-medium text-blue-800">Multimodal Processing</h4>
              <p className="text-blue-700 mt-1">Both models support image, audio, and video inputs, but Gemini 2.0 Flash offers more explicit specifications about the volume of multimodal content it can process (3,600 images, 9.5 hours of audio, 1 hour of video).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 