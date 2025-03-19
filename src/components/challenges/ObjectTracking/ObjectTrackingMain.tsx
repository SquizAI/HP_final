import React, { useState, useRef, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocossd from '@tensorflow-models/coco-ssd';
import { useUserProgress, markChallengeAsCompleted } from '../../../utils/userDataManager';
import { Target, Camera, RefreshCw, AlertTriangle, Video, X } from 'lucide-react';
import Confetti from '../../shared/Confetti';
import ChallengeHeader from '../../shared/ChallengeHeader';

// HD video path
const HD_VIDEO_PATH = "/samples/13283447_3840_2160_30fps.mp4";
// Direct fallback URL if needed
const FALLBACK_VIDEO_URL = "https://storage.googleapis.com/tfjs-models/assets/coco-ssd/road.mp4";

// Simple interface for tracked objects
interface TrackedObject {
  id: string;
  label: string;
  color: string;
  bbox: [number, number, number, number]; // [x, y, width, height]
  score: number;
}

const ObjectTrackingMain: React.FC = () => {
  // Basic state
  const [videoMode, setVideoMode] = useState<'none' | 'sample' | 'webcam'>('none');
  const [model, setModel] = useState<cocossd.ObjectDetection | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingMessage, setLoadingMessage] = useState<string>('Loading TensorFlow...');
  const [error, setError] = useState<string | null>(null);
  const [trackedObjects, setTrackedObjects] = useState<TrackedObject[]>([]);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(0.5);
  const [objectCount, setObjectCount] = useState<number>(0);
  
  // User progress tracking
  const [userProgress, setUserProgress] = useUserProgress();
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  // Load the TensorFlow.js model
  useEffect(() => {
    const loadModel = async () => {
      setIsLoading(true);
      setLoadingMessage('Initializing TensorFlow.js...');
      
      try {
        // Initialize TensorFlow
        await tf.ready();
        setLoadingMessage('Loading object detection model...');
        
        // Load the model
        const loadedModel = await cocossd.load({
          base: 'lite_mobilenet_v2' as cocossd.ObjectDetectionBaseModel
        });
        
        setModel(loadedModel);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading model:', err);
        setError('Failed to load the object detection model. Please refresh the page.');
        setIsLoading(false);
      }
    };
    
    loadModel();
    
    // Cleanup on unmount
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      try {
        // Only dispose variables, don't call endScope
        tf.engine().disposeVariables();
      } catch (err) {
        console.warn('TensorFlow cleanup error:', err);
      }
    };
  }, []);
  
  // Check if challenge is already completed
  useEffect(() => {
    if (userProgress.completedChallenges.includes('challenge-object-tracking')) {
      setIsCompleted(true);
    }
  }, [userProgress]);
  
  // Function to get a random color
  const getRandomColor = (): string => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  
  // Start webcam
  const startWebcam = async () => {
    try {
      setError(null);
      setIsLoading(true);
      setLoadingMessage('Accessing webcam...');
      
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      // Set the stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setIsLoading(false);
          setVideoMode('webcam');
          
          // Auto-start tracking
          startTracking();
        };
      }
    } catch (err) {
      console.error('Error accessing webcam:', err);
      setError('Failed to access webcam. Please check your camera permissions.');
      setIsLoading(false);
    }
  };
  
  // Load sample video
  const loadSampleVideo = () => {
    setError(null);
    setIsLoading(true);
    setLoadingMessage('Loading HD video...');
    
    // Stop webcam if active
    if (videoMode === 'webcam' && videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    // Set video source
    if (videoRef.current) {
      // Add event listeners before setting src
      const handleError = () => {
        console.error('Error loading HD video, attempting fallback');
        // Try fallback URL if main one fails
        videoRef.current!.src = FALLBACK_VIDEO_URL;
        setError('Using fallback video source. Original video could not be loaded.');
      };
      
      videoRef.current.onerror = handleError;
      videoRef.current.onloadeddata = () => {
        console.log('Video loaded successfully');
        setIsLoading(false);
        setVideoMode('sample');
        
        // Auto-start tracking
        startTracking();
      };
      
      // Load the HD video
      console.log('Loading video from:', HD_VIDEO_PATH);
      videoRef.current.src = HD_VIDEO_PATH;
    }
  };
  
  // Reset function
  const reset = () => {
    // Stop tracking
    stopTracking();
    
    // Stop webcam if active
    if (videoMode === 'webcam' && videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    // Reset video
    if (videoRef.current) {
      videoRef.current.src = '';
    }
    
    // Reset state
    setVideoMode('none');
    setTrackedObjects([]);
    setObjectCount(0);
    setError(null);
  };
  
  // Start tracking
  const startTracking = () => {
    if (!model || !videoRef.current || !canvasRef.current) return;
    
    // Make sure video is playing
    if (videoRef.current.paused && videoMode === 'sample') {
      videoRef.current.play().catch(err => {
        console.warn('Could not play video:', err);
      });
    }
    
    // Reset tracking data
    setTrackedObjects([]);
    setObjectCount(0);
    setIsTracking(true);
    
    // Start detection
    detectFrame();
  };
  
  // Stop tracking
  const stopTracking = () => {
    setIsTracking(false);
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };
  
  // Process video frames
  const detectFrame = async () => {
    if (!model || !videoRef.current || !canvasRef.current || !isTracking) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Only run if video is ready
    if (video.readyState >= 2 && !video.paused && !video.ended) {
      try {
        // Detect objects
        const predictions = await model.detect(video);
        
        // Filter by confidence threshold
        const validPredictions = predictions.filter(pred => pred.score >= confidenceThreshold);
        
        // Convert to tracked objects
        const detected: TrackedObject[] = validPredictions.map(pred => ({
          id: `${pred.class}-${Math.random().toString(36).substring(2, 9)}`,
          label: pred.class,
          color: getRandomColor(),
          bbox: pred.bbox as [number, number, number, number],
          score: pred.score
        }));
        
        // Update state
        setTrackedObjects(detected);
        
        // Update object count
        if (detected.length > 0) {
          setObjectCount(count => count + detected.length);
        }
        
        // Draw on canvas
        drawDetections(detected, canvas, video);
      } catch (err) {
        console.error('Error in detection:', err);
      }
    }
    
    // Continue detection loop
    animationRef.current = requestAnimationFrame(detectFrame);
  };
  
  // Draw detections on canvas
  const drawDetections = (
    objects: TrackedObject[],
    canvas: HTMLCanvasElement,
    video: HTMLVideoElement
  ) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Match canvas to video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw each object
    objects.forEach(obj => {
      const [x, y, width, height] = obj.bbox;
      
      // Draw bounding box with better visibility
      ctx.lineWidth = 6;
      
      // First draw outer stroke in black for contrast
      ctx.strokeStyle = '#000000';
      ctx.strokeRect(x, y, width, height);
      
      // Then draw inner stroke in color
      ctx.lineWidth = 3;
      ctx.strokeStyle = obj.color;
      ctx.strokeRect(x, y, width, height);
      
      // Draw corners for better visibility
      const cornerLength = Math.min(width, height) * 0.15;
      ctx.lineWidth = 4;
      
      // Top-left corner
      ctx.beginPath();
      ctx.moveTo(x, y + cornerLength);
      ctx.lineTo(x, y);
      ctx.lineTo(x + cornerLength, y);
      ctx.stroke();
      
      // Top-right corner
      ctx.beginPath();
      ctx.moveTo(x + width - cornerLength, y);
      ctx.lineTo(x + width, y);
      ctx.lineTo(x + width, y + cornerLength);
      ctx.stroke();
      
      // Bottom-left corner
      ctx.beginPath();
      ctx.moveTo(x, y + height - cornerLength);
      ctx.lineTo(x, y + height);
      ctx.lineTo(x + cornerLength, y + height);
      ctx.stroke();
      
      // Bottom-right corner
      ctx.beginPath();
      ctx.moveTo(x + width - cornerLength, y + height);
      ctx.lineTo(x + width, y + height);
      ctx.lineTo(x + width, y + height - cornerLength);
      ctx.stroke();
      
      // Draw label with better background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      const label = `${obj.label} ${Math.round(obj.score * 100)}%`;
      ctx.font = 'bold 18px Arial';
      const textMetrics = ctx.measureText(label);
      const textWidth = textMetrics.width;
      const textHeight = 24;
      
      // Draw rounded rectangle for label background
      const padding = 6;
      const radius = 6;
      roundRect(
        ctx, 
        x - 2, 
        y - textHeight - padding * 2, 
        textWidth + padding * 2, 
        textHeight + padding * 2, 
        radius, 
        obj.color
      );
      
      // Draw label text
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(label, x + padding - 2, y - padding);
    });
  };
  
  // Helper function to draw rounded rectangles
  const roundRect = (
    ctx: CanvasRenderingContext2D, 
    x: number, 
    y: number, 
    width: number, 
    height: number, 
    radius: number,
    fillColor: string
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
  };
  
  // Handle confidence threshold change
  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfidenceThreshold(parseFloat(e.target.value));
  };
  
  // Handle challenge completion
  const handleCompleteChallenge = () => {
    markChallengeAsCompleted('challenge-object-tracking');
    setIsCompleted(true);
    
    // Trigger confetti effect
    setShowConfetti(true);
    
    // Reset confetti after it's done
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
  };
  
  return (
    <div className="flex flex-col space-y-6">
      {/* Replace the back button with our new header component */}
      <ChallengeHeader
        title="AI Object Tracking"
        icon={<Target className="h-6 w-6 text-indigo-600" />}
        challengeId="challenge-object-tracking"
        isCompleted={isCompleted}
        setIsCompleted={setIsCompleted}
        showConfetti={showConfetti}
        setShowConfetti={setShowConfetti}
      />
      
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold flex items-center">
          <Target className="h-6 w-6 mr-2 text-indigo-600" />
          AI Object Tracking
        </h2>
        <p className="text-gray-600">
          Track objects in real-time using either a sample video or your webcam.
        </p>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 text-red-700 rounded">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
            <p>{error}</p>
          </div>
        </div>
      )}
      
      {/* Loading state */}
      {isLoading && (
        <div className="bg-indigo-50 p-6 rounded-lg flex flex-col items-center justify-center">
          <div className="rounded-full bg-indigo-100 p-3 mb-4">
            <RefreshCw className="h-6 w-6 text-indigo-600 animate-spin" />
          </div>
          <h3 className="text-lg font-medium text-indigo-800 mb-2">
            {loadingMessage}
          </h3>
          <p className="text-sm text-indigo-600 text-center">
            Please wait a moment...
          </p>
        </div>
      )}
      
      {/* Main content */}
      {!isLoading && (
        <div className="w-full">
          {/* Action buttons */}
          <div className="flex space-x-4 mb-6">
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
              onClick={loadSampleVideo}
              disabled={videoMode === 'sample'}
            >
              <Video className="h-5 w-5 mr-2" />
              Use Sample HD Video
            </button>
            
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
              onClick={startWebcam}
              disabled={videoMode === 'webcam'}
            >
              <Camera className="h-5 w-5 mr-2" />
              Use Webcam
            </button>
            
            {videoMode !== 'none' && (
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                onClick={reset}
              >
                <X className="h-5 w-5 mr-2" />
                Reset
              </button>
            )}
          </div>
          
          {/* Video display */}
          <div className="mb-6">
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full"
                muted
                playsInline
                controls={videoMode === 'sample'}
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
              />
              
              {videoMode === 'none' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Video className="h-16 w-16 text-gray-500 mb-4" />
                  <p className="text-gray-400">
                    Select a video source to begin
                  </p>
                </div>
              )}
              
              {isTracking && (
                <div className="absolute top-3 left-3 bg-black/60 text-white px-3 py-1 rounded text-sm">
                  Objects detected: {trackedObjects.length}
                </div>
              )}
            </div>
          </div>
          
          {/* Controls */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Detection Settings</h3>
            
            <div className="flex flex-col space-y-2">
              <label className="text-sm text-gray-600">
                Confidence Threshold: {(confidenceThreshold * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.1"
                value={confidenceThreshold}
                onChange={handleThresholdChange}
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Increase to reduce false positives, decrease to detect more objects
              </p>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="font-medium mb-2">Stats</h4>
              <p className="text-sm">Total objects tracked: {objectCount}</p>
              
              {/* Challenge completion section */}
              {!isCompleted && objectCount > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleCompleteChallenge}
                    className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors flex items-center justify-center"
                  >
                    <span className="mr-2">Mark Challenge as Complete</span>
                    ✓
                  </button>
                </div>
              )}
              
              {isCompleted && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="bg-green-50 text-green-700 p-3 rounded-md flex items-center">
                    <span className="mr-2">✓</span>
                    Challenge completed!
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ObjectTrackingMain; 