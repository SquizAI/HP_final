import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Camera, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { getOpenAIHeaders, getGeminiHeaders, getOpenAIConfig } from '../../../../services/apiConfig';

interface VideoRecognitionProps {
  onResultsUpdate: (results: any[] | null) => void;
  isActive: boolean;
}

const VideoRecognition: React.FC<VideoRecognitionProps> = ({ onResultsUpdate, isActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [fps, setFps] = useState<number>(1); // Frames per second for analysis
  const [deviceList, setDeviceList] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const streamRef = useRef<MediaStream | null>(null);
  const captureIntervalRef = useRef<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize camera when component becomes active
  useEffect(() => {
    if (isActive && !isStreaming) {
      getDeviceList();
    }
    
    return () => {
      stopStream();
    };
  }, [isActive]);
  
  // Get available video input devices
  const getDeviceList = async () => {
    try {
      // Check for camera permission first
      try {
        // Request camera access with basic constraints first
        const tempStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        
        // Stop the temporary stream immediately
        tempStream.getTracks().forEach(track => track.stop());
        
        console.log('Camera access granted, getting device list');
      } catch (permissionError) {
        console.error('Permission error during initial camera check:', permissionError);
        setError('Camera access was denied. Please allow camera access to use this feature.');
        return;
      }
      
      // Now enumerate devices since we have permission
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      console.log('Available video devices:', videoDevices);
      
      setDeviceList(videoDevices);
      
      if (videoDevices.length > 0) {
        // Prefer the environment facing camera if available
        const backCamera = videoDevices.find(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('environment')
        );
        
        if (backCamera) {
          console.log('Selected back camera:', backCamera.label);
          setSelectedDeviceId(backCamera.deviceId);
        } else {
          console.log('No back camera found, using first available camera');
          setSelectedDeviceId(videoDevices[0].deviceId);
        }
      } else {
        console.warn('No video devices found!');
        setError('No camera devices were detected on your device. Please check your camera settings.');
      }
    } catch (err) {
      console.error('Error getting device list:', err);
      setError('Failed to access camera devices. Please ensure your browser has permission to use the camera.');
    }
  };
  
  // Start video stream with enhanced error handling and feedback
  const startStream = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Your browser does not support camera access. Please try a different browser like Chrome or Firefox.');
      return;
    }
    
    if (!selectedDeviceId && deviceList.length === 0) {
      // Try to get devices again if none were found initially
      await getDeviceList();
      
      // If still no devices, try a generic approach
      if (deviceList.length === 0) {
        console.log('No devices found, trying generic camera access');
        try {
          const genericStream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: 'environment',
              width: { ideal: 640 },
              height: { ideal: 480 }
            }
          });
          
          streamRef.current = genericStream;
          if (videoRef.current) {
            videoRef.current.srcObject = genericStream;
            videoRef.current.onloadedmetadata = () => {
              setIsStreaming(true);
              startCapturing();
            };
            return;
          }
        } catch (genericError) {
          console.error('Generic camera access failed:', genericError);
          setError('No camera device selected. Please ensure your device has cameras available and you allow access to them.');
          return;
        }
      }
    }
    
    try {
      console.log('Attempting to access camera...');
      setError(null);
      
      // First try with exact device ID
      const constraints = {
        video: selectedDeviceId 
          ? { deviceId: { exact: selectedDeviceId } }
          : { facingMode: 'environment' },
        width: { ideal: 640 },
        height: { ideal: 480 }
      };
      
      console.log('Requesting camera with constraints:', JSON.stringify(constraints));
      
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: constraints });
      } catch (deviceError) {
        console.warn('Failed to access specific camera, trying generic access:', deviceError);
        
        // If specific device fails, try a more general approach
        try {
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
          });
          console.log('Successfully accessed camera with fallback constraints');
        } catch (fallbackError) {
          throw new Error('Camera access denied or not available. Please check your browser permissions and ensure your camera is working properly.');
        }
      }
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        console.log('Setting video source...');
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded');
          setIsStreaming(true);
          
          // Auto-start capturing after a short delay
          setTimeout(() => {
            if (!isCapturing && isActive) {
              startCapturing();
            }
          }, 500);
        };
      } else {
        console.error('Video element reference not available');
      }
    } catch (err: any) {
      console.error('Error starting video stream:', err);
      
      // Provide more helpful error messages based on the error
      let errorMessage = 'Failed to access camera';
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage = 'Camera access was denied. Please allow camera access and try again.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMessage = 'No camera device was found on your device.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMessage = 'Camera is already in use by another application.';
      } else if (err.name === 'OverconstrainedError') {
        errorMessage = 'Could not access any available camera. Your camera may be in use by another application.';
      }
      
      setError(errorMessage);
    }
  };
  
  // Stop video stream
  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (captureIntervalRef.current) {
      window.clearInterval(captureIntervalRef.current);
      captureIntervalRef.current = null;
    }
    
    setIsStreaming(false);
    setIsCapturing(false);
  };
  
  // Switch camera
  const switchCamera = async () => {
    stopStream();
    
    // Find next camera in the list
    if (deviceList.length > 1) {
      const currentIndex = deviceList.findIndex(device => device.deviceId === selectedDeviceId);
      const nextIndex = (currentIndex + 1) % deviceList.length;
      setSelectedDeviceId(deviceList[nextIndex].deviceId);
    }
  };
  
  // Start capturing frames for analysis
  const startCapturing = () => {
    if (!isStreaming) return;
    
    setIsCapturing(true);
    
    // Set up interval to capture and analyze frames
    const intervalMs = 1000 / fps; // Convert fps to milliseconds
    captureIntervalRef.current = window.setInterval(() => {
      captureFrame();
    }, intervalMs);
  };
  
  // Stop capturing frames
  const stopCapturing = () => {
    if (captureIntervalRef.current) {
      window.clearInterval(captureIntervalRef.current);
      captureIntervalRef.current = null;
    }
    setIsCapturing(false);
  };
  
  // Capture a single frame and analyze it
  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current || isAnalyzing) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to blob and analyze
    analyzeFrame(canvas);
  };
  
  // Analyze the captured frame using OpenAI GPT-4o for better reliability
  const analyzeFrame = async (canvas: HTMLCanvasElement) => {
    setIsAnalyzing(true);
    
    try {
      // Convert canvas to a blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, 'image/jpeg', 0.6); // Even lower quality for better performance
      });
      
      if (!blob) throw new Error('Failed to create blob from canvas');
      
      // Create a file from the blob
      const file = new File([blob], `frame-${Date.now()}.jpg`, { type: 'image/jpeg' });
      
      // Convert file to base64
      const base64Image = await toBase64(file);
      
      try {
        // Try OpenAI for more reliable analysis
        const openaiResponse = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: getOpenAIConfig().defaultModel || "gpt-4o",
            messages: [
              {
                role: "system",
                content: "You are an expert AI image analyzer for a real-time video feed. Provide quick, detailed, meaningful analysis of video frames in JSON format. Focus on precise object identification with informative descriptions."
              },
              {
                role: "user",
                content: [
                  { 
                    type: "text", 
                    text: "Identify the main objects in this video frame. Return a JSON object with this structure: {\"objects\": [{\"label\": string, \"category\": string, \"confidence\": number, \"description\": string, \"attributes\": [string]}], \"scene_type\": string}. Be precise but provide meaningful descriptions. This is for real-time analysis." 
                  },
                  {
                    type: "image_url",
                    image_url: {
                      url: `data:image/jpeg;base64,${base64Image.split(',')[1]}`
                    }
                  }
                ]
              }
            ],
            response_format: { type: "json_object" },
            max_tokens: 650, // Increased slightly for better descriptions
            temperature: 0.1 // Lower to be more deterministic
          },
          {
            headers: getOpenAIHeaders()
          }
        );
        
        // Get the analysis results
        const responseContent = openaiResponse.data.choices[0].message.content;
        let analysis;
        try {
          analysis = JSON.parse(responseContent);
        } catch (parseError) {
          console.error('Failed to parse OpenAI response:', parseError);
          throw new Error('Invalid response format');
        }
        
        // Validate response structure
        if (!analysis || !analysis.objects || !Array.isArray(analysis.objects)) {
          console.error('Invalid response structure:', analysis);
          throw new Error('Invalid response structure');
        }
        
        // Process the results and update state
        const results = analysis.objects.map((obj: any) => ({
          ...obj,
          // Use provided description if available, otherwise generate a simple one
          description: obj.description || `A ${obj.category}`,
          // Add empty arrays for properties that might be missing but expected by ClassificationResults
          attributes: obj.attributes || [],
          relationships: obj.relationships || [],
          significance: obj.significance || "Detected in live video"
        }));
        
        // Add scene type as an additional classification if provided
        if (analysis.scene_type && analysis.scene_type.trim() !== '') {
          results.push({
            label: "Scene Context",
            category: "Scene Type",
            confidence: 90,
            description: `This appears to be ${analysis.scene_type.toLowerCase()}.`,
            attributes: [],
            relationships: [],
            significance: "Overall scene context"
          });
        }
        
        onResultsUpdate(results);
        setIsAnalyzing(false);
        return;
      } catch (openaiError) {
        console.error('OpenAI analysis failed:', openaiError);
        // Will fall back to alternate methods
      }
      
      // We'll keep the Gemini API as a fallback to the fallback
      try {
        // Fallback to Gemini API if OpenAI fails
        const geminiResponse = await axios.post(
          'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro-vision:generateContent',
          {
            contents: [
              {
                parts: [
                  { text: "Quickly identify the main objects in this image, provide the output as JSON with structure: [{\"label\": \"object name\", \"category\": \"category\", \"confidence\": confidence_score}]. Include only 3-5 main objects. Be concise." },
                  {
                    inline_data: {
                      mime_type: 'image/jpeg',
                      data: base64Image.split(',')[1]
                    }
                  }
                ]
              }
            ],
            generation_config: {
              temperature: 0.1,
              max_output_tokens: 256,
            }
          },
          {
            headers: getGeminiHeaders()
          }
        );
        
        // Extract the JSON from the response
        const textResponse = geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const jsonMatch = textResponse.match(/\[[\s\S]*\]/);
        
        if (jsonMatch) {
          try {
            const jsonStr = jsonMatch[0];
            const parsedResults = JSON.parse(jsonStr);
            
            // Basic validation of results
            const validResults = parsedResults.filter((item: any) => 
              item && typeof item.label === 'string' && 
              typeof item.category === 'string'
            );
            
            if (validResults.length > 0) {
              onResultsUpdate(validResults);
            } else {
              throw new Error('No valid results found');
            }
          } catch (parseError) {
            console.error('Failed to parse Gemini response:', parseError);
            throw new Error('Failed to parse analysis results');
          }
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (error) {
        console.error('All frame analysis methods failed:', error);
        // Only reset results after several consecutive failures
        // This prevents flickering during temporary failures
        onResultsUpdate([{
          label: "Analysis unavailable",
          category: "Error",
          confidence: 0,
          description: "Please try again or check your connection"
        }]);
      } finally {
        setIsAnalyzing(false);
      }
    } catch (error) {
      console.error('Frame analysis failed:', error);
      setIsAnalyzing(false);
    }
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
  
  // Handle device selection change
  const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const deviceId = e.target.value;
    setSelectedDeviceId(deviceId);
    
    // Restart stream with new device
    stopStream();
    setTimeout(() => {
      startStream();
    }, 100);
  };
  
  // Handle FPS change
  const handleFpsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFps = parseInt(e.target.value);
    setFps(newFps);
    
    // Restart capturing with new FPS
    if (isCapturing) {
      stopCapturing();
      setTimeout(() => {
        startCapturing();
      }, 100);
    }
  };
  
  // Effect to start/stop stream when selectedDeviceId changes
  useEffect(() => {
    if (isActive && selectedDeviceId) {
      startStream();
    }
    
    return () => {
      if (streamRef.current) {
        stopStream();
      }
    };
  }, [selectedDeviceId, isActive]);
  
  return (
    <div className="relative border border-gray-200 rounded-lg overflow-hidden p-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium">Real-time Video Recognition</h3>
        <div className="flex space-x-2">
          {/* Camera selection */}
          {deviceList.length > 1 && (
            <select
              value={selectedDeviceId}
              onChange={handleDeviceChange}
              className="text-sm border border-gray-300 rounded px-2 py-1"
              disabled={!isActive}
            >
              {deviceList.map(device => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Camera ${deviceList.indexOf(device) + 1}`}
                </option>
              ))}
            </select>
          )}
          
          {/* FPS selection */}
          <select
            value={fps}
            onChange={handleFpsChange}
            className="text-sm border border-gray-300 rounded px-2 py-1"
            disabled={!isActive || !isStreaming}
          >
            <option value="0.5">0.5 FPS (Low CPU)</option>
            <option value="1">1 FPS</option>
            <option value="2">2 FPS</option>
            <option value="4">4 FPS (High CPU)</option>
          </select>
          
          {/* Switch camera button */}
          {deviceList.length > 1 && (
            <button
              onClick={switchCamera}
              disabled={!isActive || !isStreaming}
              className="p-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
              title="Switch Camera"
            >
              <Camera size={18} />
            </button>
          )}
        </div>
      </div>
      
      {/* Display error message if present */}
      {error && (
        <div className="mb-3 p-2 bg-red-50 text-red-700 rounded text-sm border border-red-200">
          <p className="flex items-center">
            <span className="mr-2">⚠️</span>
            {error}
          </p>
          <button 
            onClick={() => setError(null)} 
            className="mt-1 text-xs text-red-700 underline"
          >
            Dismiss
          </button>
        </div>
      )}
      
      <div className="relative bg-black rounded-lg overflow-hidden">
        {/* Video element */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full max-h-96 object-contain mx-auto"
          onLoadedMetadata={() => {
            console.log('Video element metadata loaded');
            // Once video is loaded, we can start capturing
            if (isActive && !isCapturing && isStreaming) {
              startCapturing();
            }
          }}
        />
        
        {/* Invisible canvas for frame capturing */}
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Overlay for status and controls */}
        <div className="absolute bottom-2 right-2 flex space-x-2">
          {isStreaming && (
            <button
              onClick={isCapturing ? stopCapturing : startCapturing}
              className={`p-2 rounded-full ${
                isCapturing ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
              } text-white`}
              title={isCapturing ? 'Pause Analysis' : 'Start Analysis'}
            >
              {isCapturing ? <Pause size={18} /> : <Play size={18} />}
            </button>
          )}
        </div>
        
        {/* Status indicator */}
        {isAnalyzing && (
          <div className="absolute top-2 right-2">
            <RefreshCw size={20} className="animate-spin text-white" />
          </div>
        )}
        
        {/* Camera permission status */}
        {isActive && !isStreaming && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 text-white p-4 text-center">
            <div>
              <Camera size={48} className="mx-auto mb-2" />
              <p className="mb-2">Camera access is required</p>
              {error ? (
                <div className="text-center mb-3">
                  <p className="text-red-300 text-sm mb-2">{error}</p>
                  <p className="text-xs opacity-80 mb-2">
                    Make sure your browser has camera permissions and no other app is using your camera.
                  </p>
                </div>
              ) : null}
              <button
                onClick={startStream}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white"
              >
                Enable Camera
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-2 text-sm text-gray-600">
        <p>Point your camera at objects to identify them in real-time.</p>
        <p className="text-xs mt-1">
          <strong>Note:</strong> Lower FPS uses less processing power but provides slower updates.
        </p>
        {!isStreaming && (
          <p className="text-xs mt-1 text-blue-600">
            <strong>Tip:</strong> If the camera doesn't activate, try clicking the "Enable Camera" button again or refreshing the page.
          </p>
        )}
      </div>
    </div>
  );
};

export default VideoRecognition; 