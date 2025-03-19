import React, { useState, useEffect, useRef } from 'react';
import { Search, Upload, Camera, RefreshCw, Info, Image as ImageIcon, Check, Sliders, AlertOctagon, Zap, Eye, Brain, Map, Video, X } from 'lucide-react';
import { useUserProgress, markChallengeAsCompleted } from '../../../utils/userDataManager';
import { getOpenAIHeaders, getOpenAIConfig } from '../../../services/apiConfig';
import * as tf from '@tensorflow/tfjs';
import * as cocossd from '@tensorflow-models/coco-ssd';
import axios from 'axios';
import ImageUploader from './components/ImageUploader';
import SampleImages from './components/SampleImages';
import DetectionSettings from './components/DetectionSettings';
import BusinessApplications from './components/BusinessApplications';
import ChallengeHeader from '../../shared/ChallengeHeader';
import Confetti from '../../shared/Confetti';

// Analysis Overlay Component
const AnalysisOverlay: React.FC<{ stage: string; message: string; isVisible: boolean }> = ({ 
  stage, 
  message, 
  isVisible 
}) => {
  const stages = [
    { id: 'preparing', icon: <Eye size={24} />, label: 'Preparing Image' },
    { id: 'detecting', icon: <Search size={24} />, label: 'Detecting Objects' },
    { id: 'processing', icon: <Brain size={24} />, label: 'Processing Details' },
    { id: 'finalizing', icon: <Zap size={24} />, label: 'Finalizing Results' },
  ];
  
  const currentStageIndex = stages.findIndex(s => s.id === stage);
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
        <div className="text-center mb-4">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <div className="animate-pulse text-indigo-600">
              {stages.find(s => s.id === stage)?.icon || <Search size={24} />}
            </div>
          </div>
          <h3 className="text-lg font-bold text-gray-800">AI Object Detection</h3>
          <p className="text-sm text-gray-600 mt-1">{message}</p>
        </div>
        
        <div className="mb-6">
          <ul className="relative">
            {stages.map((s, index) => {
              const isActive = index === currentStageIndex;
              const isCompleted = index < currentStageIndex;
              
              return (
                <li key={s.id} className={`flex items-start mb-3 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3
                    ${isActive ? 'bg-indigo-600 text-white' : isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {isCompleted ? <Check size={16} /> : (index + 1)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className={`mr-2 ${isActive ? 'text-indigo-600' : 'text-gray-700'}`}>
                        {s.icon}
                      </span>
                      <h4 className={`font-medium ${isActive ? 'text-indigo-700' : 'text-gray-800'}`}>{s.label}</h4>
                    </div>
                    {isActive && (
                      <div className="mt-1 pl-6">
                        <div className="h-1 bg-gray-200 rounded overflow-hidden">
                          <div className="h-1 bg-indigo-600 animate-progress"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        
        <div className="text-xs text-gray-500 italic text-center">
          Using advanced computer vision AI to analyze your image with precision...
        </div>
      </div>
    </div>
  );
};

// Add the new animation style to a new <style> tag right after the imports
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
  @keyframes progress {
    0% { width: 5%; }
    100% { width: 90%; }
  }
  
  .animate-progress {
    animation: progress 2.5s ease-in-out infinite;
  }
`;
document.head.appendChild(styleSheet);

// Enhanced detection object interface
interface EnhancedDetection extends cocossd.DetectedObject {
  category?: string;
  description?: string;
  attributes?: string[];
  relationships?: string[];
  significance?: string;
}

// OpenAI response interface
interface OpenAIAnalyzedObject {
  name: string;
  category: string;
  description: string;
  attributes?: string[];
  relationships?: string[];
  significance?: string;
}

interface OpenAIResponse {
  objects: OpenAIAnalyzedObject[];
  scene_description?: string;
  background_elements?: string[];
  overall_mood?: string;
}

const ObjectDetectionMain: React.FC = () => {
  // User progress tracking
  const [userProgress, setUserProgress] = useUserProgress();
  const [isCompleted, setIsCompleted] = useState<boolean>(
    userProgress.completedChallenges.includes('challenge-object-detection')
  );
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  
  // Detection state
  const [model, setModel] = useState<cocossd.ObjectDetection | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModelLoading, setIsModelLoading] = useState<boolean>(true);
  const [detections, setDetections] = useState<EnhancedDetection[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [businessUseCase, setBusinessUseCase] = useState<string>('');
  const [detectionCount, setDetectionCount] = useState<number>(0);
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(0.5);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  
  // Analysis overlay state
  const [analysisStage, setAnalysisStage] = useState<string>('preparing');
  const [analysisMessage, setAnalysisMessage] = useState<string>('Preparing image for analysis...');
  const [showAnalysisOverlay, setShowAnalysisOverlay] = useState<boolean>(false);
  
  // Webcam state
  const [useWebcam, setUseWebcam] = useState<boolean>(false);
  const [webcamActive, setWebcamActive] = useState<boolean>(false);
  const [webcamError, setWebcamError] = useState<string | null>(null);
  const [realTimeDetection, setRealTimeDetection] = useState<boolean>(false);
  
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const animationRef = useRef<number | null>(null);
  
  // Load COCO-SSD model on component mount
  useEffect(() => {
    async function loadModel() {
      try {
        // Ensure TensorFlow.js is initialized
        await tf.ready();
        
        // Load COCO-SSD model
        const loadedModel = await cocossd.load({
          base: 'mobilenet_v2'  // Faster but slightly less accurate than 'lite_mobilenet_v2'
        });
        
        setModel(loadedModel);
        setIsModelLoading(false);
      } catch (err) {
        console.error('Failed to load TensorFlow model:', err);
        setError('Failed to initialize object detection model. Please try refreshing the page.');
        setIsModelLoading(false);
      }
    }
    
    loadModel();
    
    // Check if challenge is already completed
    if (userProgress.completedChallenges.includes('challenge-object-detection')) {
      setIsCompleted(true);
    }
    
    // Cleanup function to handle component unmount
    return () => {
      // Stop any ongoing real-time detection
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      // Stop webcam if active
      stopWebcam();
    };
  }, [userProgress]);
  
  // Handle switching between webcam and image upload
  useEffect(() => {
    if (useWebcam) {
      // Clear any existing image
      clearImage();
      // Start webcam
      startWebcam();
    } else {
      // Stop webcam
      stopWebcam();
    }
  }, [useWebcam]);
  
  // Start webcam
  const startWebcam = async () => {
    setWebcamError(null);
    
    try {
      const constraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'environment'
        },
        audio: false
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setWebcamActive(true);
          
          // Set up canvas for drawing
          const canvas = canvasRef.current;
          if (canvas) {
            canvas.width = videoRef.current?.videoWidth || 640;
            canvas.height = videoRef.current?.videoHeight || 480;
          }
          
          // Start real-time detection
          if (realTimeDetection) {
            startRealTimeDetection();
          }
        };
      }
    } catch (err) {
      console.error('Error accessing webcam:', err);
      setWebcamError('Could not access webcam. Please check your camera permissions.');
      setUseWebcam(false);
    }
  };
  
  // Stop webcam
  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    setWebcamActive(false);
    
    // Stop real-time detection
    stopRealTimeDetection();
  };
  
  // Toggle real-time detection
  const toggleRealTimeDetection = () => {
    const newValue = !realTimeDetection;
    setRealTimeDetection(newValue);
    
    if (newValue && webcamActive) {
      startRealTimeDetection();
    } else {
      stopRealTimeDetection();
    }
  };
  
  // Start real-time detection
  const startRealTimeDetection = () => {
    if (!model || !webcamActive || !videoRef.current) {
      return;
    }
    
    // Clear any previous detection loop
    stopRealTimeDetection();
    
    // Start detection loop
    const detectFrame = async () => {
      if (videoRef.current && model && webcamActive) {
        try {
          // Run detection on the current video frame
          const predictions = await model.detect(videoRef.current);
          
          // Filter predictions based on confidence threshold
          const filteredPredictions = predictions.filter(
            pred => pred.score >= confidenceThreshold
          );
          
          // Update state with new detections
          const enhancedDetections: EnhancedDetection[] = filteredPredictions.map(pred => ({
            ...pred,
            category: getCategoryFromLabel(pred.class),
            description: `A ${pred.class} detected in real-time.`,
          }));
          
          setDetections(enhancedDetections);
          
          // Draw bounding boxes on canvas
          drawRealTimeDetections(enhancedDetections);
          
          // Continue the detection loop
          animationRef.current = requestAnimationFrame(detectFrame);
        } catch (err) {
          console.error('Error in real-time detection:', err);
          stopRealTimeDetection();
          setError('Error performing real-time detection. Please try again.');
        }
      }
    };
    
    // Start the detection loop
    detectFrame();
  };
  
  // Stop real-time detection
  const stopRealTimeDetection = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    // Clear canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };
  
  // Draw bounding boxes for real-time detection
  const drawRealTimeDetections = (detections: EnhancedDetection[]) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear previous drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw detections
    detections.forEach(detection => {
      const [x, y, width, height] = detection.bbox;
      
      // Choose color based on class or category
      let color;
      const category = detection.category?.toLowerCase() || detection.class.toLowerCase();
      
      if (category.includes('person') || category.includes('people')) 
        color = '#FF5733'; // Red-orange
      else if (category.includes('animal') || category.includes('dog') || category.includes('cat') || category.includes('bird'))
        color = '#33FF57'; // Green
      else if (category.includes('vehicle') || category.includes('car') || category.includes('truck') || category.includes('bus'))
        color = '#33A1FF'; // Blue
      else if (category.includes('food'))
        color = '#FFFF33'; // Yellow
      else 
        color = '#9933FF'; // Purple
      
      // Draw bounding box
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, width, height);
      
      // Draw background for text
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.7;
      ctx.fillRect(x, y - 30, width, 30);
      ctx.globalAlpha = 1.0;
      
      // Draw text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '16px Arial';
      ctx.fillText(
        `${detection.class} ${Math.round(detection.score * 100)}%`, 
        x + 5, 
        y - 10
      );
    });
  };
  
  // Capture still image from webcam
  const captureWebcamImage = async () => {
    if (!videoRef.current || !webcamActive) {
      setError('Webcam is not active. Please enable the webcam first.');
      return;
    }
    
    try {
      // Create a canvas to capture the current video frame
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Draw the current video frame on the canvas
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to blob
        canvas.toBlob((blob) => {
          if (blob) {
            // Create a File object from the blob
            const file = new File([blob], `webcam-capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
            
            // Update state with the captured image
            handleImageChange(file);
            
            // Switch to image mode
            setUseWebcam(false);
          }
        }, 'image/jpeg', 0.9);
      }
    } catch (err) {
      console.error('Error capturing webcam image:', err);
      setError('Failed to capture image from webcam. Please try again.');
    }
  };
  
  // Handle image change
  const handleImageChange = (file: File) => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setDetections([]);
    setError(null);
  };
  
  // Clear the current image
  const clearImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview(null);
    setDetections([]);
    setError(null);
    
    // Clear canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };
  
  // Handle sample image selection
  const handleSampleImageSelect = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], `sample-${Date.now()}.jpg`, { type: 'image/jpeg' });
      handleImageChange(file);
    } catch (err) {
      console.error('Error loading sample image:', err);
      setError('Failed to load sample image. Please try uploading your own image.');
    }
  };
  
  // Helper function to set stage with explanatory message
  const updateAnalysisStage = (stage: string, message: string) => {
    setAnalysisStage(stage);
    setAnalysisMessage(message);
  };
  
  // Update confidence threshold
  const handleConfidenceChange = (value: number) => {
    setConfidenceThreshold(value);
    // If we already have detections, re-filter them based on new threshold
    if (detections.length > 0) {
      drawDetections();
    }
  };
  
  // Helper function to determine category from object label
  const getCategoryFromLabel = (label: string): string => {
    const lowerLabel = label.toLowerCase();
    
    if (lowerLabel.includes('person') || lowerLabel === 'man' || lowerLabel === 'woman' || lowerLabel === 'child') 
      return 'Person';
    if (lowerLabel.includes('cat') || lowerLabel.includes('dog') || lowerLabel.includes('bird') || lowerLabel.includes('horse'))
      return 'Animal';
    if (lowerLabel.includes('car') || lowerLabel.includes('truck') || lowerLabel.includes('bus') || lowerLabel.includes('bicycle'))
      return 'Vehicle';
    if (lowerLabel.includes('chair') || lowerLabel.includes('table') || lowerLabel.includes('sofa') || lowerLabel.includes('bed'))
      return 'Furniture';
    if (lowerLabel.includes('tv') || lowerLabel.includes('laptop') || lowerLabel.includes('phone') || lowerLabel.includes('computer'))
      return 'Technology';
    if (lowerLabel.includes('apple') || lowerLabel.includes('banana') || lowerLabel.includes('pizza') || lowerLabel.includes('food'))
      return 'Food';
    
    return 'Object';
  };
  
  // Draw bounding boxes on canvas
  const drawDetections = () => {
    const image = imageRef.current;
    const canvas = canvasRef.current;
    
    if (!image || !canvas || detections.length === 0) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions to match image
    canvas.width = image.width;
    canvas.height = image.height;
    
    // Clear previous drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw image on canvas
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    
    // Draw bounding boxes for detections above threshold
    detections
      .filter(detection => detection.score >= confidenceThreshold)
      .forEach(detection => {
        const [x, y, width, height] = detection.bbox;
        
        // Choose color based on class or category
        let color;
        const category = detection.category?.toLowerCase() || detection.class.toLowerCase();
        
        if (category.includes('person') || category.includes('people')) 
          color = '#FF5733'; // Red-orange
        else if (category.includes('animal') || category.includes('dog') || category.includes('cat') || category.includes('bird'))
          color = '#33FF57'; // Green
        else if (category.includes('vehicle') || category.includes('car') || category.includes('truck') || category.includes('bus'))
          color = '#33A1FF'; // Blue
        else if (category.includes('food'))
          color = '#FFFF33'; // Yellow
        else 
          color = '#9933FF'; // Purple
        
        // Draw bounding box
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, width, height);
        
        // Draw background for text
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.7;
        ctx.fillRect(x, y - 30, width, 30);
        ctx.globalAlpha = 1.0;
        
        // Draw text
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '16px Arial';
        ctx.fillText(
          `${detection.class} ${Math.round(detection.score * 100)}%`, 
          x + 5, 
          y - 10
        );
      });
  };
  
  // Helper function to convert file to base64
  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };
  
  // Run object detection
  const detectObjects = async () => {
    if (!model) {
      setError('Object detection model is not loaded yet. Please wait or refresh the page.');
      return;
    }
    
    if (!imageRef.current || !imageFile) {
      setError('Please upload an image first.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setShowAnalysisOverlay(true);
    updateAnalysisStage('preparing', 'Preparing image for analysis...');
    
    try {
      // Convert the image to base64 for OpenAI API
      const base64Image = await toBase64(imageFile);
      
      // Step 1: Run initial TensorFlow detection
      updateAnalysisStage('detecting', 'Detecting objects with neural network...');
      
      const predictions = await model.detect(imageRef.current);
      
      // Sort predictions by confidence score (highest first)
      const sortedPredictions = [...predictions].sort((a, b) => b.score - a.score);
      
      // Convert TensorFlow predictions to enhanced format
      const enhancedDetections: EnhancedDetection[] = sortedPredictions.map(pred => ({
        ...pred,
        category: getCategoryFromLabel(pred.class),
        description: `A ${pred.class} detected in the image.`,
      }));
      
      // Set the detections immediately for quick feedback
      setDetections(enhancedDetections);
      
      // Draw bounding boxes right away
      setTimeout(() => {
        drawDetections();
      }, 100);
      
      // Step 2: Use OpenAI for enhanced descriptions
      if (enhancedDetections.length > 0) {
        try {
          updateAnalysisStage('processing', 'Enhancing detection with AI analysis...');
          
          const openaiResponse = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
              model: getOpenAIConfig().defaultModel || "gpt-4o",
              messages: [
                {
                  role: "system",
                  content: "You are an expert AI image analyst. Enhance the existing object detection with detailed descriptions and additional insights."
                },
                {
                  role: "user",
                  content: [
                    { 
                      type: "text", 
                      text: `Analyze this image and enhance these detected objects: ${JSON.stringify(enhancedDetections.map(d => d.class))}.
                      Return a JSON object with this structure: {\"objects\": [{\"name\": string, \"category\": string, \"description\": string, \"attributes\": [string], \"relationships\": [string], \"significance\": string}], \"scene_description\": string, \"background_elements\": [string], \"overall_mood\": string}` 
                    },
                    {
                      type: "image_url",
                      image_url: {
                        url: `data:${imageFile.type};base64,${base64Image.split(',')[1]}`
                      }
                    }
                  ]
                }
              ],
              response_format: { 
                type: "json_object" 
              },
              max_tokens: 800,
              temperature: 0.1
            },
            {
              headers: getOpenAIHeaders()
            }
          );
          
          updateAnalysisStage('finalizing', 'Finalizing detection results...');
          
          // Parse the structured JSON response
          const responseContent = openaiResponse.data.choices[0].message.content;
          let structuredResponse: OpenAIResponse;
          try {
            structuredResponse = JSON.parse(responseContent);
          } catch (parseError) {
            console.error("Error parsing OpenAI response:", parseError);
            throw new Error("Failed to parse OpenAI response");
          }
          
          // Enhance the existing detections with OpenAI details
          if (structuredResponse.objects && Array.isArray(structuredResponse.objects)) {
            const enhancedResults: EnhancedDetection[] = [];
            
            // First, add all OpenAI results and try to match with existing bounding boxes
            structuredResponse.objects.forEach((obj: OpenAIAnalyzedObject) => {
              // Try to find a matching TensorFlow detection
              const matchingTf = enhancedDetections.find(
                d => d.class.toLowerCase() === obj.name.toLowerCase() || 
                     d.class.toLowerCase().includes(obj.name.toLowerCase()) || 
                     obj.name.toLowerCase().includes(d.class.toLowerCase())
              );
              
              if (matchingTf) {
                // Enhance existing detection
                enhancedResults.push({
                  ...matchingTf,
                  category: obj.category,
                  description: obj.description,
                  attributes: obj.attributes || [],
                  relationships: obj.relationships || [],
                  significance: obj.significance
                });
              }
            });
            
            // Add any remaining TensorFlow detections not matched by OpenAI
            enhancedDetections.forEach(detection => {
              const alreadyIncluded = enhancedResults.some(
                r => r.class === detection.class && r.score === detection.score
              );
              
              if (!alreadyIncluded) {
                enhancedResults.push(detection);
              }
            });
            
            // Add scene description if available
            if (structuredResponse.scene_description) {
              enhancedResults.push({
                class: "Overall Scene",
                score: 0.99,
                bbox: [0, 0, 0, 0], // Empty bbox for scene
                category: "Scene Analysis",
                description: structuredResponse.scene_description,
                attributes: structuredResponse.background_elements,
                significance: "Overall scene context"
              });
            }
            
            // Update detections with enhanced results
            setDetections(enhancedResults);
          }
        } catch (openaiError) {
          console.error("OpenAI enhancement failed:", openaiError);
          // Continue with basic detections if OpenAI fails
        }
      }
      
      setDetectionCount(prev => prev + 1);
    } catch (err) {
      console.error('Error detecting objects:', err);
      setError('Failed to detect objects in the image. Please try a different image.');
    } finally {
      setIsLoading(false);
      setShowAnalysisOverlay(false);
    }
  };
  
  // Effect to redraw detections when confidence threshold changes
  useEffect(() => {
    if (detections.length > 0 && imageRef.current) {
      drawDetections();
    }
  }, [confidenceThreshold]);
  
  // Handle completing the challenge
  const handleCompleteChallenge = () => {
    if (!businessUseCase.trim()) {
      setError('Please describe a business use case for object detection before completing.');
      return;
    }
    
    if (detectionCount < 2) {
      setError('Please detect objects in at least 2 different images before completing.');
      return;
    }
    
    const wasCompleted = markChallengeAsCompleted('challenge-object-detection');
    
    if (wasCompleted) {
      setIsCompleted(true);
      setShowConfetti(true);
      
      // Hide confetti after 5 seconds
      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Show confetti animation when challenge is completed */}
      {showConfetti && <Confetti active={showConfetti} />}
      
      <ChallengeHeader
        title="Object Detection Challenge"
        icon={<Search className="h-6 w-6 text-green-600" />}
        challengeId="challenge-9" // Using the correct challenge ID from ChallengeHubNew
        isCompleted={isCompleted}
        setIsCompleted={setIsCompleted}
        showConfetti={showConfetti}
        setShowConfetti={setShowConfetti}
        onCompleteChallenge={handleCompleteChallenge}
        isHPChallenge={true}
      />
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex items-center mb-2">
            <Search size={36} className="mr-3" />
            <h1 className="text-3xl font-bold">AI Object Detection</h1>
          </div>
          <p className="text-lg opacity-90">
            Detect and locate multiple objects in images with bounding boxes and confidence scores
          </p>
        </div>
        
        <div className="p-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
              {error}
            </div>
          )}
          
          {/* Webcam Error Message */}
          {webcamError && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
              {webcamError}
            </div>
          )}
          
          {/* Model Loading State */}
          {isModelLoading && (
            <div className="bg-indigo-50 text-indigo-700 p-3 rounded-md mb-4 flex items-center">
              <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
              <span>Loading object detection model... This may take a moment.</span>
            </div>
          )}
          
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Object Detection Challenge</h2>
            <p className="text-gray-600 mb-6">
              Upload an image or use your webcam to detect and locate objects. The AI will identify objects like people, cars, animals, and more.
            </p>
            
            {/* Toggle between image upload and webcam */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <button
                  type="button"
                  onClick={() => setUseWebcam(false)}
                  className={`px-4 py-2 text-sm font-medium border rounded-l-lg ${
                    !useWebcam
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Upload className="h-4 w-4 inline mr-2" />
                  Upload Image
                </button>
                <button
                  type="button"
                  onClick={() => setUseWebcam(true)}
                  className={`px-4 py-2 text-sm font-medium border-t border-b border-r rounded-r-lg ${
                    useWebcam
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Camera className="h-4 w-4 inline mr-2" />
                  Use Webcam
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Image Upload / Webcam & Controls */}
              <div>
                {!useWebcam ? (
                  /* Image upload section */
                  <div className="border rounded-lg p-4 mb-4">
                    <ImageUploader 
                      onImageChange={handleImageChange}
                      imagePreview={imagePreview}
                      clearImage={clearImage}
                    />
                  </div>
                ) : (
                  /* Webcam section */
                  <div className="border rounded-lg p-4 mb-4">
                    <div className="relative">
                      <div className="rounded-lg overflow-hidden bg-gray-900 aspect-video flex justify-center items-center">
                        <video
                          ref={videoRef}
                          className="max-w-full max-h-[300px] object-contain"
                          playsInline
                          muted
                        />
                        <canvas
                          ref={canvasRef}
                          className="absolute top-0 left-0 w-full h-full"
                          style={{ objectFit: 'contain' }}
                        />
                        
                        {!webcamActive && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 text-white">
                            <div className="text-center">
                              <Camera className="h-12 w-12 mb-3 mx-auto" />
                              <p>Camera access required</p>
                              <button
                                onClick={startWebcam}
                                className="mt-3 px-4 py-2 bg-indigo-600 rounded-md text-sm font-medium"
                              >
                                Enable Camera
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {webcamActive && (
                        <div className="absolute top-2 right-2 flex space-x-2">
                          <button
                            className="p-1 rounded-full bg-red-500 text-white"
                            onClick={() => setUseWebcam(false)}
                            title="Close webcam"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {webcamActive && (
                      <div className="mt-4 flex justify-between">
                        <button
                          onClick={toggleRealTimeDetection}
                          className={`px-4 py-2 rounded-md text-white font-medium flex items-center ${
                            realTimeDetection ? 'bg-green-600' : 'bg-indigo-600'
                          }`}
                        >
                          <Video className="mr-2 h-4 w-4" />
                          {realTimeDetection ? 'Real-Time ON' : 'Start Real-Time Detection'}
                        </button>
                        
                        <button
                          onClick={captureWebcamImage}
                          className="px-4 py-2 rounded-md bg-gray-800 text-white font-medium flex items-center"
                        >
                          <Camera className="mr-2 h-4 w-4" />
                          Capture Image
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Detection button - only show for image upload mode */}
                {imagePreview && !useWebcam && (
                  <div className="flex justify-center mb-4">
                    <button
                      onClick={detectObjects}
                      disabled={isLoading || isModelLoading}
                      className={`px-6 py-3 rounded-md text-white font-medium flex items-center ${
                        isLoading || isModelLoading
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700'
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                          Detecting objects...
                        </>
                      ) : (
                        <>
                          <Search className="mr-2 h-5 w-5" />
                          Detect Objects
                        </>
                      )}
                    </button>
                  </div>
                )}
                
                {/* Settings panel */}
                <div>
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="w-full mb-4 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-md flex items-center justify-center font-medium text-sm"
                  >
                    <Sliders className="mr-2 h-4 w-4" />
                    {showSettings ? 'Hide Settings' : 'Show Detection Settings'}
                  </button>
                  
                  {showSettings && (
                    <DetectionSettings
                      confidenceThreshold={confidenceThreshold}
                      onConfidenceChange={handleConfidenceChange}
                    />
                  )}
                </div>
                
                {/* Sample Images - only show for image upload mode */}
                {!useWebcam && (
                  <div className="mt-6">
                    <h3 className="text-lg font-bold mb-3 text-gray-800">Sample Images</h3>
                    <p className="text-gray-600 mb-4">
                      Don't have an image? Try one of these examples with multiple objects:
                    </p>
                    <SampleImages onSelectImage={handleSampleImageSelect} />
                  </div>
                )}
              </div>
              
              {/* Right Column: Detection Results */}
              <div>
                {/* Image with detections - only show for image mode */}
                {imagePreview && !useWebcam && (
                  <div className="mb-4">
                    <div className="rounded-lg overflow-hidden bg-gray-100 flex justify-center items-center">
                      <div className="relative inline-block">
                        <img
                          ref={imageRef}
                          src={imagePreview}
                          alt="Uploaded image"
                          className="max-w-full max-h-[400px]"
                          style={{ display: 'block' }}
                        />
                        <canvas
                          ref={canvasRef}
                          className="absolute top-0 left-0 w-full h-full"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Detection results */}
                {detections.length > 0 && (
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-gray-800 flex items-center">
                        <Map className="mr-2 h-5 w-5 text-indigo-600" />
                        Detection Results
                      </h3>
                      <span className="text-sm bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                        {detections.filter(d => d.score >= confidenceThreshold).length} objects
                      </span>
                    </div>
                    
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                      {detections
                        .filter(detection => detection.score >= confidenceThreshold)
                        .map((detection, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-indigo-300 transition-colors"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center">
                                  <h4 className="font-medium text-gray-800">{detection.class}</h4>
                                  {detection.category && (
                                    <span className="ml-2 text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full">
                                      {detection.category}
                                    </span>
                                  )}
                                </div>
                                {detection.description && (
                                  <p className="text-sm text-gray-600 mt-1">
                                    {detection.description}
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-indigo-700">
                                  {Math.round(detection.score * 100)}%
                                </div>
                                <div className="text-xs text-gray-500">confidence</div>
                              </div>
                            </div>
                            
                            {/* Additional attributes if available */}
                            {detection.attributes && detection.attributes.length > 0 && (
                              <div className="mt-2 pt-2 border-t border-gray-200">
                                <div className="text-xs text-gray-500 mb-1">Attributes:</div>
                                <div className="flex flex-wrap gap-1">
                                  {detection.attributes.map((attr, idx) => (
                                    <span key={idx} className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                                      {attr}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                    
                    {/* Confidence threshold reminder */}
                    <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
                      <span>
                        Showing objects with confidence ≥ {Math.round(confidenceThreshold * 100)}%
                      </span>
                      <button
                        onClick={() => setShowSettings(true)}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        Adjust threshold
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Instructions for webcam mode if no detections yet */}
                {useWebcam && webcamActive && detections.length === 0 && !realTimeDetection && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-bold text-blue-800 mb-2 flex items-center">
                      <Info className="mr-2 h-5 w-5" />
                      Getting Started with Real-Time Detection
                    </h3>
                    <p className="text-blue-700 mb-3">
                      Click the "Start Real-Time Detection" button to begin detecting objects in your webcam feed.
                    </p>
                    <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                      <li>Make sure you have good lighting</li>
                      <li>Position objects clearly in the camera view</li>
                      <li>Try different angles if objects aren't detected</li>
                      <li>You can adjust detection sensitivity in Settings</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Business Applications */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-3 text-gray-800">Business Applications</h3>
            <p className="text-gray-600 mb-4">
              Object detection technology can transform various industries:
            </p>
            <BusinessApplications />
            
            {/* Business use case text area */}
            {detectionCount > 0 && (
              <div className="mt-6">
                <label 
                  htmlFor="business-use-case" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  How could your business use object detection? (required to complete)
                </label>
                <textarea
                  id="business-use-case"
                  value={businessUseCase}
                  onChange={(e) => setBusinessUseCase(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-3 h-24 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., We could use object detection to automate inventory tracking in our warehouse..."
                />
              </div>
            )}
          </div>
          
          {/* Complete challenge button */}
          {detectionCount > 0 && (
            <div className="flex justify-between">
              <button
                onClick={() => {
                  clearImage();
                  setDetections([]);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Try Another Image
              </button>
              
              <button
                onClick={handleCompleteChallenge}
                disabled={!businessUseCase.trim() || isCompleted || detectionCount < 2}
                className={`px-6 py-2 rounded-md text-white ${
                  !businessUseCase.trim() || isCompleted || detectionCount < 2
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isCompleted ? "Challenge Completed!" : "Complete Challenge"}
              </button>
            </div>
          )}
          
          {/* Tips & best practices */}
          <div className="mt-8 bg-blue-50 p-4 rounded-md">
            <div className="flex items-start">
              <Info className="text-blue-600 mr-2 mt-0.5 h-5 w-5" />
              <div>
                <h4 className="font-medium text-blue-800 mb-1">Tips for Better Detection</h4>
                <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                  <li>Use well-lit images with clear visibility of objects</li>
                  <li>Avoid excessive blur or motion artifacts</li>
                  <li>Make sure objects aren't too small in the frame</li>
                  <li>Adjust the confidence threshold to tune sensitivity</li>
                  <li>Try different angles if certain objects aren't detected</li>
                  <li>Real-time detection works best with good lighting and minimal motion</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Analysis Overlay */}
      <AnalysisOverlay 
        stage={analysisStage}
        message={analysisMessage}
        isVisible={showAnalysisOverlay}
      />
    </div>
  );
};

export default ObjectDetectionMain; 