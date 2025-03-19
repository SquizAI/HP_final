import React, { useState } from 'react';
import { Tag, ChevronDown, ChevronUp, Info, List, Link2, Layers, X, MessageSquare, HelpCircle, Star, Percent, Activity, Map } from 'lucide-react';

interface Classification {
  label: string;
  category: string;
  description?: string;
  attributes?: string[];
  relationships?: string[];
  significance?: string;
  detailed_analysis?: string;
  overall_mood?: string;
  confidence: number;
  bbox?: number[];
}

interface ClassificationResultsProps {
  results: Classification[];
}

const ClassificationResults: React.FC<ClassificationResultsProps> = ({ results }) => {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [showInfoPopup, setShowInfoPopup] = useState<boolean>(false);
  
  // Toggle expanded state of an item
  const toggleExpand = (index: number) => {
    if (expandedItems.includes(index)) {
      setExpandedItems(expandedItems.filter(i => i !== index));
    } else {
      setExpandedItems([...expandedItems, index]);
    }
  };
  
  // Check if item has additional details worth expanding
  const hasDetails = (item: Classification): boolean => {
    return !!(
      (item.description && item.description.length > 0) ||
      (item.attributes && item.attributes.length > 0) ||
      (item.relationships && item.relationships.length > 0) ||
      (item.significance && item.significance.length > 0) ||
      (item.detailed_analysis && item.detailed_analysis.length > 0) ||
      (item.bbox)
    );
  };
  
  // Get badge color based on category
  const getCategoryColor = (category: string): string => {
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('person') || categoryLower.includes('people')) return 'bg-blue-100 text-blue-800';
    if (categoryLower.includes('animal')) return 'bg-green-100 text-green-800';
    if (categoryLower.includes('food')) return 'bg-yellow-100 text-yellow-800';
    if (categoryLower.includes('vehicle')) return 'bg-red-100 text-red-800';
    if (categoryLower.includes('scene') || categoryLower.includes('analysis')) return 'bg-purple-100 text-purple-800';
    if (categoryLower.includes('furniture')) return 'bg-orange-100 text-orange-800';
    if (categoryLower.includes('tech')) return 'bg-indigo-100 text-indigo-800';
    if (categoryLower.includes('object')) return 'bg-gray-100 text-gray-800';
    return 'bg-indigo-100 text-indigo-800';
  };
  
  // Format description for display
  const formatDescription = (description: string | undefined): string => {
    if (!description) return 'No description available';
    
    // Capitalize first letter if needed
    let formattedDesc = description;
    if (formattedDesc.length > 0 && formattedDesc[0].match(/[a-z]/)) {
      formattedDesc = formattedDesc.charAt(0).toUpperCase() + formattedDesc.slice(1);
    }
    
    // Add period if missing
    if (!formattedDesc.endsWith('.') && !formattedDesc.endsWith('!') && !formattedDesc.endsWith('?')) {
      formattedDesc += '.';
    }
    
    return formattedDesc;
  };
  
  // Get overall scene analysis if available
  const getSceneAnalysis = (): Classification | undefined => {
    return results.find(item => 
      item.category === 'Scene Analysis' || 
      item.label === 'Overall Scene'
    );
  };
  
  // Get regular object results (not scene analysis)
  const getObjectResults = (): Classification[] => {
    return results.filter(item => 
      item.category !== 'Scene Analysis' && 
      item.label !== 'Overall Scene'
    );
  };
  
  // Get confidence level visualization
  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 0.9) return 'bg-green-500';
    if (confidence >= 0.7) return 'bg-blue-500';
    if (confidence >= 0.5) return 'bg-yellow-500';
    return 'bg-orange-500';
  };
  
  // Get confidence class text
  const getConfidenceText = (confidence: number): string => {
    if (confidence >= 0.9) return 'Very High';
    if (confidence >= 0.7) return 'High';
    if (confidence >= 0.5) return 'Medium';
    return 'Low';
  };
  
  // Count objects with bounding boxes
  const countObjectsWithBoundingBoxes = (): number => {
    return results.filter(item => item.bbox).length;
  };
  
  // Info popup content - explanations of AI vision analysis
  const InfoPopup: React.FC = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-lg w-full">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <HelpCircle size={20} className="text-purple-600 mr-2" />
            How AI Analyzes Images
          </h3>
          <button 
            onClick={() => setShowInfoPopup(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-4 text-gray-700">
          <p>
            The AI uses advanced computer vision techniques to analyze your image through several stages:
          </p>
          
          <div className="bg-purple-50 p-3 rounded-lg">
            <h4 className="font-medium text-purple-800 mb-1">Object Detection</h4>
            <p className="text-sm">AI identifies distinct objects in the image by recognizing shapes, colors, and patterns, placing bounding boxes around each detected object.</p>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-1">Classification</h4>
            <p className="text-sm">Each detected object is classified into a category (e.g., food, animal, person) based on visual features learned from millions of training examples.</p>
          </div>
          
          <div className="bg-green-50 p-3 rounded-lg">
            <h4 className="font-medium text-green-800 mb-1">Confidence Scoring</h4>
            <p className="text-sm">The AI assigns confidence scores to each detection, indicating how certain it is about the object's identity and classification.</p>
          </div>
          
          <div className="bg-yellow-50 p-3 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-1">Attribute Analysis</h4>
            <p className="text-sm">The AI identifies specific attributes of each object such as color, size, material, condition, and other defining characteristics.</p>
          </div>
          
          <div className="bg-indigo-50 p-3 rounded-lg">
            <h4 className="font-medium text-indigo-800 mb-1">Relationship Mapping</h4>
            <p className="text-sm">The AI analyzes spatial relationships between objects to understand how they interact with each other in the scene.</p>
          </div>
          
          <div className="bg-orange-50 p-3 rounded-lg">
            <h4 className="font-medium text-orange-800 mb-1">Scene Context</h4>
            <p className="text-sm">Beyond individual objects, the AI interprets the overall scene to provide context about what's happening in the image.</p>
          </div>
          
          <p className="text-sm italic">
            The AI combines TensorFlow object detection (for bounding boxes) with large vision models (for semantic understanding) to provide these detailed insights.
          </p>
        </div>
        
        <button
          onClick={() => setShowInfoPopup(false)}
          className="mt-4 w-full py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
  
  const sceneAnalysis = getSceneAnalysis();
  const objectResults = getObjectResults();
  const objectsWithBoxes = countObjectsWithBoundingBoxes();
  
  return (
    <div className="mt-6 bg-gray-50 rounded-lg p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Map size={18} className="mr-2 text-purple-600" />
          Object Detection Results
        </h3>
        
        <button 
          onClick={() => setShowInfoPopup(true)}
          className="flex items-center text-sm text-purple-600 hover:text-purple-800 bg-purple-50 px-2 py-1 rounded-md"
        >
          <HelpCircle size={14} className="mr-1" />
          How does this work?
        </button>
      </div>
      
      {/* Show info popup when active */}
      {showInfoPopup && <InfoPopup />}
      
      {/* Results Summary */}
      <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center mb-2">
          <Star size={16} className="text-purple-600 mr-2" />
          <h4 className="font-medium text-gray-800">Detection Summary</h4>
        </div>
        <p className="text-sm text-gray-600">
          AI detected <span className="font-medium">{objectResults.length} object{objectResults.length !== 1 ? 's' : ''}</span> in the image
          {objectsWithBoxes > 0 && <span>, including <span className="font-medium">{objectsWithBoxes}</span> with precise bounding boxes</span>}
          {sceneAnalysis ? ' and analyzed the overall scene context' : ''}.
          {objectResults.length > 0 && (
            <span> Main objects: {objectResults.slice(0, 3).map(obj => obj.label).join(', ')}</span>
          )}
          {sceneAnalysis?.overall_mood && (
            <span> Overall mood: {sceneAnalysis.overall_mood}</span>
          )}
        </p>
      </div>
      
      {/* Scene Analysis Section (if available) */}
      {sceneAnalysis && (
        <div className="mb-6 border border-purple-200 rounded-md p-4 bg-purple-50 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <Layers size={18} className="text-purple-700 mr-2" />
              <h4 className="font-semibold text-purple-900">
                {sceneAnalysis.label}
              </h4>
            </div>
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-200 text-purple-800">
              Complete Analysis
            </div>
          </div>
          
          <div className="mt-3 text-sm text-gray-700">
            {formatDescription(sceneAnalysis.description)}
          </div>
          
          {sceneAnalysis.overall_mood && (
            <div className="mt-3 flex items-start">
              <span className="text-xs font-medium text-gray-600 mr-2 mt-0.5">Mood:</span>
              <span className="text-sm text-gray-700">{sceneAnalysis.overall_mood}</span>
            </div>
          )}
          
          {sceneAnalysis.attributes && sceneAnalysis.attributes.length > 0 && (
            <div className="mt-3">
              <div className="text-xs font-medium text-gray-600 mb-1">Background Elements:</div>
              <div className="flex flex-wrap gap-1">
                {sceneAnalysis.attributes.map((attr, idx) => (
                  <span key={idx} className="px-2 py-1 rounded-md text-xs bg-white border border-purple-200 text-purple-800">
                    {attr}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {sceneAnalysis.detailed_analysis && (
            <div className="mt-3 pt-3 border-t border-purple-200">
              <details className="text-sm">
                <summary className="cursor-pointer font-medium text-purple-700 flex items-center">
                  <Info size={14} className="mr-1" />
                  Detailed Analysis
                </summary>
                <div className="mt-2 pl-2 text-gray-700 border-l-2 border-purple-200">
                  {sceneAnalysis.detailed_analysis}
                </div>
              </details>
            </div>
          )}
        </div>
      )}
      
      {/* Objects Section */}
      <div className="space-y-4">
        {objectResults.map((item, index) => {
          const isExpanded = expandedItems.includes(index);
          const shouldAllowExpand = hasDetails(item);
          
          return (
            <div key={index} className="border border-gray-200 rounded-md bg-white overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className={`p-3 ${shouldAllowExpand ? 'cursor-pointer' : ''}`} onClick={() => shouldAllowExpand && toggleExpand(index)}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-semibold text-gray-800">
                        {item.label}
                        {item.bbox && (
                          <span className="ml-2 px-1.5 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded">
                            Bounded
                          </span>
                        )}
                      </h4>
                      {shouldAllowExpand && (
                        <button className="ml-2 text-gray-400 hover:text-gray-600">
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Tag size={14} className="mr-1" />
                      <span className={`px-1.5 py-0.5 rounded ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>
                    </div>
                  </div>
                  
                  {/* Display confidence level visually */}
                  <div className="flex flex-col items-end">
                    <div className="text-xs text-gray-500 mb-1 flex items-center">
                      <Percent size={12} className="mr-1" />
                      Confidence
                    </div>
                    <div className="flex items-center">
                      <div className="w-16 h-2 bg-gray-200 rounded-full mr-2">
                        <div 
                          className={`h-full rounded-full ${getConfidenceColor(item.confidence)}`}
                          style={{ width: `${Math.round(item.confidence * 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-700 font-medium">
                        {Math.round(item.confidence * 100)}%
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {getConfidenceText(item.confidence)}
                    </div>
                  </div>
                </div>
                
                {/* Short description preview */}
                {item.description && !isExpanded && (
                  <div className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {formatDescription(item.description)}
                  </div>
                )}
              </div>
              
              {/* Expanded details */}
              {isExpanded && shouldAllowExpand && (
                <div className="px-3 pb-3 pt-1 bg-gray-50 border-t border-gray-200">
                  {item.description && (
                    <div className="mb-3">
                      <h5 className="text-xs font-medium text-gray-500 mb-1 flex items-center">
                        <Info size={12} className="mr-1" />
                        DESCRIPTION
                      </h5>
                      <p className="text-sm text-gray-700">
                        {formatDescription(item.description)}
                      </p>
                    </div>
                  )}
                  
                  {/* Confidence details */}
                  <div className="mb-3">
                    <h5 className="text-xs font-medium text-gray-500 mb-1 flex items-center">
                      <Activity size={12} className="mr-1" />
                      CONFIDENCE DETAILS
                    </h5>
                    <div className="flex items-center bg-white p-2 rounded border border-gray-200">
                      <div className="flex-1">
                        <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getConfidenceColor(item.confidence)}`}
                            style={{ width: `${Math.round(item.confidence * 100)}%` }}
                          >
                          </div>
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-gray-500">
                          <span>0%</span>
                          <span>50%</span>
                          <span>100%</span>
                        </div>
                      </div>
                      <div className="ml-4 text-center">
                        <div className="text-xl font-bold text-gray-800">{Math.round(item.confidence * 100)}%</div>
                        <div className="text-xs text-gray-500">{getConfidenceText(item.confidence)}</div>
                      </div>
                    </div>
                  </div>
                  
                  {item.significance && (
                    <div className="mb-3">
                      <h5 className="text-xs font-medium text-gray-500 mb-1">SIGNIFICANCE</h5>
                      <p className="text-sm text-gray-700">
                        {formatDescription(item.significance)}
                      </p>
                    </div>
                  )}
                  
                  {/* Bounding box information if available */}
                  {item.bbox && (
                    <div className="mb-3">
                      <h5 className="text-xs font-medium text-gray-500 mb-1 flex items-center">
                        <Map size={12} className="mr-1" />
                        BOUNDING BOX
                      </h5>
                      <div className="bg-indigo-50 rounded p-2 text-xs text-indigo-700 font-mono">
                        x: {Math.round(item.bbox[0])}, y: {Math.round(item.bbox[1])}, 
                        width: {Math.round(item.bbox[2])}, height: {Math.round(item.bbox[3])}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-4">
                    {item.attributes && item.attributes.length > 0 && (
                      <div className="mb-3 flex-1 min-w-[40%]">
                        <h5 className="text-xs font-medium text-gray-500 mb-1 flex items-center">
                          <List size={12} className="mr-1" />
                          ATTRIBUTES
                        </h5>
                        <div className="flex flex-wrap gap-1">
                          {item.attributes.map((attr, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-md text-xs bg-gray-100 text-gray-700">
                              {attr}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {item.relationships && item.relationships.length > 0 && (
                      <div className="mb-3 flex-1 min-w-[40%]">
                        <h5 className="text-xs font-medium text-gray-500 mb-1 flex items-center">
                          <Link2 size={12} className="mr-1" />
                          RELATIONSHIPS
                        </h5>
                        <ul className="text-xs text-gray-700 list-disc pl-4">
                          {item.relationships.map((rel, idx) => (
                            <li key={idx}>{rel}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex items-start text-sm text-gray-500">
          <Info size={16} className="text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
          <p>
            AI object detection analysis has identified and located objects in the image. Objects with bounding boxes are displayed in the image above. Confidence scores indicate how certain the AI is about each detection. Factors like lighting, angle, and image quality affect detection accuracy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClassificationResults; 