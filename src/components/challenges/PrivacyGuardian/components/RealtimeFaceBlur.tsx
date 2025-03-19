import React, { useRef, useState, useEffect } from 'react';

interface RealtimeFaceBlurProps {
  blurIntensity?: number;
  showBoundingBoxes?: boolean;
  onFacesDetected?: (count: number) => void;
}

interface DetectedRegion {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
}

const RealtimeFaceBlur: React.FC<RealtimeFaceBlurProps> = ({
  blurIntensity = 15,
  showBoundingBoxes = true,
  onFacesDetected
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previousFrameRef = useRef<ImageData | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>("Initializing camera...");
  const processingRef = useRef<boolean>(false);
  const [faceCount, setFaceCount] = useState<number>(0);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [debugInfo, setDebugInfo] = useState<string>("");
  const [detectedRegions, setDetectedRegions] = useState<DetectedRegion[]>([]);
  const regionsRef = useRef<DetectedRegion[]>([]);
  
  // Store the current value of blurIntensity and showBoundingBoxes in refs so they can be accessed in the render loop
  const blurIntensityRef = useRef<number>(blurIntensity);
  const showBoundingBoxesRef = useRef<boolean>(showBoundingBoxes);
  
  // Update refs when props change
  useEffect(() => {
    blurIntensityRef.current = blurIntensity;
    console.log("Blur intensity updated:", blurIntensity);
  }, [blurIntensity]);
  
  useEffect(() => {
    showBoundingBoxesRef.current = showBoundingBoxes;
    console.log("Show bounding boxes updated:", showBoundingBoxes);
  }, [showBoundingBoxes]);

  // Setup camera and processing
  useEffect(() => {
    const setupCamera = async () => {
      try {
        setLoadingMessage("Requesting camera access...");
        setLoadingProgress(20);
        
        await startCamera();
        
        setLoadingProgress(100);
        setIsInitialized(true);
        console.log("Camera ready for processing");
        
      } catch (err) {
        console.error("Camera initialization error:", err);
        setError(`Failed to initialize camera: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setDebugInfo(`Error details: ${JSON.stringify(err)}`);
      }
    };

    setupCamera();

    return () => {
      // Clean up video stream on unmount
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
      // Cancel processing loop
      processingRef.current = false;
    };
  }, []);

  // Start video processing when camera is ready
  useEffect(() => {
    if (isInitialized && videoRef.current && videoRef.current.readyState >= 2) {
      console.log("Starting video processing");
      processingRef.current = true;
      processFrame();
    }
  }, [isInitialized]);

  // Start camera
  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user"
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play().catch(err => {
              console.error("Error playing video:", err);
              setError("Could not play video stream. Please check permissions.");
            });
          }
        };
        setVideoStream(stream);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access your camera. Please check permissions.");
      setDebugInfo(`Camera error details: ${JSON.stringify(err)}`);
    }
  };

  // Handle video play event
  const handleVideoPlay = () => {
    console.log("Video is playing, starting processing");
    if (isInitialized && !processingRef.current) {
      processingRef.current = true;
      processFrame();
    }
  };

  // Process each video frame
  const processFrame = () => {
    if (!processingRef.current || !videoRef.current || !canvasRef.current) {
      return;
    }
    
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Ensure video is ready
      if (video.readyState < 2 || video.paused || video.ended) {
        console.log("Video not ready yet, retrying...");
        requestAnimationFrame(processFrame);
        return;
      }
      
      // Set canvas dimensions to match video
      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        console.log(`Canvas dimensions set to ${canvas.width}x${canvas.height}`);
      }
      
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        console.error("Could not get canvas context");
        requestAnimationFrame(processFrame);
        return;
      }
      
      // Draw the video frame to the canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Detect moving regions in the frame
      const currentRegions = detectMovingRegions(ctx, canvas.width, canvas.height);
      
      // Update detected regions with smoothing
      updateDetectedRegions(currentRegions);
      
      // Always apply pixelation to ALL detected regions - use current value from ref
      applyPrivacyFilters(ctx);
      
      // Draw bounding boxes if enabled - use current value from ref
      if (showBoundingBoxesRef.current) {
        drawBoundingBoxes(ctx);
      }
      
      // Continue the processing loop
      if (processingRef.current) {
        requestAnimationFrame(processFrame);
      }
      
    } catch (err) {
      console.error("Error in video processing:", err);
      // Continue the loop even if there's an error
      if (processingRef.current) {
        requestAnimationFrame(processFrame);
      }
    }
  };
  
  // Detect regions with significant movement
  const detectMovingRegions = (ctx: CanvasRenderingContext2D, width: number, height: number): DetectedRegion[] => {
    // Get current frame data
    const currentFrame = ctx.getImageData(0, 0, width, height);
    const regions: DetectedRegion[] = [];
    
    // If we don't have a previous frame, just store this one and return
    if (!previousFrameRef.current) {
      previousFrameRef.current = currentFrame;
      
      // If no regions yet, create an initial one in the center
      if (regionsRef.current.length === 0) {
        return [{
          x: width / 2 - width / 6,
          y: height / 2 - height / 5,
          width: width / 3,
          height: height * 0.4,
          confidence: 1.0
        }];
      }
      
      return regionsRef.current;
    }
    
    const prevData = previousFrameRef.current.data;
    const currData = currentFrame.data;
    
    // Create a motion map to identify areas with movement
    const blockSize = 16; // Smaller blocks for more precise detection
    const motionThreshold = 20; // Lower threshold to be more sensitive to movement
    const motionMap: { x: number, y: number, score: number }[] = [];
    
    // Check for motion in blocks
    for (let y = 0; y < height; y += blockSize) {
      for (let x = 0; x < width; x += blockSize) {
        let totalDiff = 0;
        let sampled = 0;
        
        // Sample points within this block
        for (let j = 0; j < blockSize; j += 2) { // More frequent sampling
          for (let i = 0; i < blockSize; i += 2) {
            if (x + i < width && y + j < height) {
              const idx = ((y + j) * width + (x + i)) * 4;
              
              // Calculate difference between frames
              const rDiff = Math.abs(prevData[idx] - currData[idx]);
              const gDiff = Math.abs(prevData[idx + 1] - currData[idx + 1]);
              const bDiff = Math.abs(prevData[idx + 2] - currData[idx + 2]);
              
              const pixelDiff = (rDiff + gDiff + bDiff) / 3;
              totalDiff += pixelDiff;
              sampled++;
            }
          }
        }
        
        // Calculate average difference for this block
        const avgDiff = sampled > 0 ? totalDiff / sampled : 0;
        
        // If significant motion detected, add to motion map
        if (avgDiff > motionThreshold) {
          motionMap.push({ x, y, score: avgDiff });
        }
      }
    }
    
    // If we have enough motion blocks, group them into regions
    if (motionMap.length > 3) { // Lower threshold for easier detection
      // Find largest motion cluster
      const cluster = findLargestCluster(motionMap, width, height);
      
      if (cluster && cluster.points.length > 2) { // Lower threshold
        // Calculate bounding box for the cluster
        let minX = width, minY = height, maxX = 0, maxY = 0;
        
        for (const point of cluster.points) {
          minX = Math.min(minX, point.x);
          minY = Math.min(minY, point.y);
          maxX = Math.max(maxX, point.x + blockSize);
          maxY = Math.max(maxY, point.y + blockSize);
        }
        
        // Add padding for better visual
        const padding = blockSize * 2;
        minX = Math.max(0, minX - padding);
        minY = Math.max(0, minY - padding);
        maxX = Math.min(width, maxX + padding);
        maxY = Math.min(height, maxY + padding);
        
        // Add as detected region
        regions.push({
          x: minX,
          y: minY,
          width: maxX - minX,
          height: maxY - minY,
          confidence: Math.min(1.0, cluster.points.length / 15) // Lower divisor for higher confidence
        });
      }
    }
    
    // If no motion detected but we have existing regions, use previous with some decay
    if (regions.length === 0 && regionsRef.current.length > 0) {
      // Add existing regions with slightly decreased confidence
      for (const region of regionsRef.current) {
        regions.push({
          ...region,
          confidence: Math.max(0.3, region.confidence * 0.95) // Slow decay of confidence
        });
      }
    }
    
    // Store current frame for next comparison
    previousFrameRef.current = currentFrame;
    
    // Return default region if nothing detected
    if (regions.length === 0) {
      regions.push({
        x: width / 2 - width / 6,
        y: height / 2 - height / 5,
        width: width / 3,
        height: height * 0.4,
        confidence: 0.8 // Higher default confidence
      });
    }
    
    return regions;
  };
  
  // Find the largest cluster of motion points
  const findLargestCluster = (points: { x: number, y: number, score: number }[], width: number, height: number) => {
    if (points.length === 0) return null;
    
    // Distance threshold for clustering
    const distThreshold = Math.min(width, height) / 5; // Slightly larger for better grouping
    
    // Simple clustering algorithm
    const clusters: { centroid: { x: number, y: number }, points: { x: number, y: number, score: number }[] }[] = [];
    
    // Assign each point to a cluster
    for (const point of points) {
      let assigned = false;
      
      // Check if point belongs to an existing cluster
      for (const cluster of clusters) {
        const dx = cluster.centroid.x - point.x;
        const dy = cluster.centroid.y - point.y;
        const distance = Math.sqrt(dx*dx + dy*dy);
        
        if (distance < distThreshold) {
          // Add to existing cluster
          cluster.points.push(point);
          
          // Update centroid
          const len = cluster.points.length;
          cluster.centroid.x = (cluster.centroid.x * (len - 1) + point.x) / len;
          cluster.centroid.y = (cluster.centroid.y * (len - 1) + point.y) / len;
          
          assigned = true;
          break;
        }
      }
      
      // If not assigned to any cluster, create a new one
      if (!assigned) {
        clusters.push({
          centroid: { x: point.x, y: point.y },
          points: [point]
        });
      }
    }
    
    // Find the largest cluster
    let largestCluster = null;
    let maxSize = 0;
    
    for (const cluster of clusters) {
      if (cluster.points.length > maxSize) {
        maxSize = cluster.points.length;
        largestCluster = cluster;
      }
    }
    
    return largestCluster;
  };
  
  // Update detected regions with smoothing
  const updateDetectedRegions = (newRegions: DetectedRegion[]) => {
    if (newRegions.length === 0) return;
    
    // If we have no existing regions, use the new ones
    if (regionsRef.current.length === 0) {
      regionsRef.current = newRegions;
      setDetectedRegions(newRegions);
      
      // Update face count
      const faceRegions = newRegions.filter(r => r.confidence > 0.4); // Lower threshold
      const newCount = faceRegions.length;
      if (newCount !== faceCount) {
        setFaceCount(newCount);
        if (onFacesDetected) {
          onFacesDetected(newCount);
        }
      }
      
      return;
    }
    
    // Apply smoothing between frames
    const smoothedRegions: DetectedRegion[] = [];
    const smoothingFactor = 0.25; // Smoother transitions
    
    for (const newRegion of newRegions) {
      // Find matching previous region (closest match)
      const prevRegion = findClosestRegion(newRegion, regionsRef.current);
      
      if (prevRegion) {
        // Apply smoothing
        smoothedRegions.push({
          x: prevRegion.x + (newRegion.x - prevRegion.x) * smoothingFactor,
          y: prevRegion.y + (newRegion.y - prevRegion.y) * smoothingFactor,
          width: prevRegion.width + (newRegion.width - prevRegion.width) * smoothingFactor,
          height: prevRegion.height + (newRegion.height - prevRegion.height) * smoothingFactor,
          confidence: prevRegion.confidence * 0.6 + newRegion.confidence * 0.4 // More weight on previous confidence
        });
      } else {
        // No previous match, use as is
        smoothedRegions.push(newRegion);
      }
    }
    
    // Update current regions
    regionsRef.current = smoothedRegions;
    setDetectedRegions(smoothedRegions);
    
    // Update face count
    const faceRegions = smoothedRegions.filter(r => r.confidence > 0.4); // Lower threshold
    const newCount = faceRegions.length;
    if (newCount !== faceCount) {
      setFaceCount(newCount);
      if (onFacesDetected) {
        onFacesDetected(newCount);
      }
    }
  };
  
  // Find closest matching region from previous frame
  const findClosestRegion = (region: DetectedRegion, regions: DetectedRegion[]) => {
    if (regions.length === 0) return null;
    
    let closestRegion = null;
    let minDistance = Number.MAX_VALUE;
    
    const regionCenterX = region.x + region.width / 2;
    const regionCenterY = region.y + region.height / 2;
    
    for (const r of regions) {
      const rCenterX = r.x + r.width / 2;
      const rCenterY = r.y + r.height / 2;
      
      const dx = regionCenterX - rCenterX;
      const dy = regionCenterY - rCenterY;
      const distance = Math.sqrt(dx*dx + dy*dy);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestRegion = r;
      }
    }
    
    // Only match if distance is reasonable - use wider threshold
    if (minDistance > Math.max(region.width, region.height) * 1.5) {
      return null;
    }
    
    return closestRegion;
  };
  
  // Apply privacy filters to all detected regions
  const applyPrivacyFilters = (ctx: CanvasRenderingContext2D) => {
    for (const region of regionsRef.current) {
      // Apply blur to ALL regions regardless of confidence - this fixes the inconsistency
      // Use the current blur intensity from the ref (updated via props)
      applyPixelation(
        ctx, 
        Math.round(region.x), 
        Math.round(region.y),
        Math.round(region.width),
        Math.round(region.height),
        blurIntensityRef.current
      );
    }
  };
  
  // Draw bounding boxes for detected regions
  const drawBoundingBoxes = (ctx: CanvasRenderingContext2D) => {
    for (const region of regionsRef.current) {
      // Adjust color based on confidence
      const alpha = Math.min(1.0, region.confidence + 0.3); // More visible at lower confidence
      ctx.strokeStyle = `rgba(0, 255, 0, ${alpha})`;
      ctx.lineWidth = 2;
      
      // Draw rectangle
      ctx.strokeRect(
        Math.round(region.x), 
        Math.round(region.y), 
        Math.round(region.width), 
        Math.round(region.height)
      );
      
      // Show confidence value
      ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`;
      ctx.font = '12px Arial';
      ctx.fillText(
        `Privacy: ${Math.round(region.confidence * 100)}%`, 
        Math.round(region.x + 5), 
        Math.round(region.y - 5)
      );
    }
  };
  
  // Apply pixelation effect to a region
  const applyPixelation = (
    ctx: CanvasRenderingContext2D, 
    x: number, 
    y: number, 
    width: number, 
    height: number,
    pixelSize: number
  ) => {
    try {
      // Skip if invalid dimensions
      if (width <= 0 || height <= 0 || x < 0 || y < 0) return;
      
      // Ensure coordinates are within canvas bounds
      const canvas = ctx.canvas;
      if (x >= canvas.width || y >= canvas.height) return;

      // Adjust dimensions to stay within canvas
      const adjustedWidth = Math.min(width, canvas.width - x);
      const adjustedHeight = Math.min(height, canvas.height - y);
      
      // Get the pixel data for the region
      const imageData = ctx.getImageData(x, y, adjustedWidth, adjustedHeight);
      const pixels = imageData.data;
      
      // Calculate the pixel block size based on blur intensity
      const blockSize = Math.max(3, Math.floor(pixelSize / 2));
      
      // Apply pixelation effect
      for (let blockY = 0; blockY < adjustedHeight; blockY += blockSize) {
        for (let blockX = 0; blockX < adjustedWidth; blockX += blockSize) {
          // Calculate the size of this block (handle edge cases)
          const blockW = Math.min(blockSize, adjustedWidth - blockX);
          const blockH = Math.min(blockSize, adjustedHeight - blockY);
          
          // Skip tiny blocks
          if (blockW <= 0 || blockH <= 0) continue;
          
          // Calculate average color in this block
          let r = 0, g = 0, b = 0, a = 0, count = 0;
          
          // Sample all pixels in this block
          for (let by = 0; by < blockH; by++) {
            for (let bx = 0; bx < blockW; bx++) {
              // Important: We need to use adjustedWidth, not width
              const i = ((blockY + by) * adjustedWidth + (blockX + bx)) * 4;
              if (i >= 0 && i < pixels.length - 3) {
                r += pixels[i];
                g += pixels[i + 1];
                b += pixels[i + 2];
                a += pixels[i + 3];
                count++;
              }
            }
          }
          
          // Avoid division by zero
          if (count === 0) continue;
          
          // Calculate average
          r = Math.floor(r / count);
          g = Math.floor(g / count);
          b = Math.floor(b / count);
          a = Math.floor(a / count);
          
          // Apply this color to all pixels in the block
          for (let by = 0; by < blockH; by++) {
            for (let bx = 0; bx < blockW; bx++) {
              // Important: We need to use adjustedWidth, not width
              const i = ((blockY + by) * adjustedWidth + (blockX + bx)) * 4;
              if (i >= 0 && i < pixels.length - 3) {
                pixels[i] = r;
                pixels[i + 1] = g;
                pixels[i + 2] = b;
                pixels[i + 3] = a;
              }
            }
          }
        }
      }
      
      // Put the modified pixels back
      ctx.putImageData(imageData, x, y);
      
    } catch (err) {
      console.error("Error applying pixelation:", err);
    }
  };

  // Reset the app and try again
  const handleReset = () => {
    // Stop the current detection loop
    processingRef.current = false;
    
    // Reset states
    setError(null);
    setDebugInfo("");
    setIsInitialized(false);
    setFaceCount(0);
    setLoadingProgress(0);
    setDetectedRegions([]);
    regionsRef.current = [];
    previousFrameRef.current = null;
    
    // Stop any existing video stream
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
    }
    
    // Restart camera
    startCamera().then(() => {
      setIsInitialized(true);
      processingRef.current = true;
      processFrame();
    }).catch(err => {
      setError(`Failed to restart camera: ${err instanceof Error ? err.message : 'Unknown error'}`);
    });
  };

  return (
    <div className="relative">
      {/* Loading overlay */}
      {!isInitialized && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white z-10 rounded-lg">
          <div className="text-lg font-medium mb-2">{loadingMessage}</div>
          <div className="w-64 h-3 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="absolute inset-0 bg-red-900 bg-opacity-80 flex items-center justify-center text-white z-10 rounded-lg p-4">
          <div className="text-center">
            <div className="text-xl font-bold mb-2">Error</div>
            <div>{error}</div>
            {debugInfo && <div className="mt-2 text-xs opacity-75">{debugInfo}</div>}
            <div className="mt-4 flex justify-center space-x-4">
              <button 
                onClick={handleReset} 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
              >
                Try Again
              </button>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Face count indicator */}
      <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-sm z-10 transition-colors duration-300 ${
        faceCount > 0 
          ? 'bg-emerald-500 text-white' 
          : 'bg-gray-600 bg-opacity-70 text-white'
      }`}>
        {faceCount > 0 
          ? `${faceCount} ${faceCount === 1 ? 'area' : 'areas'} protected` 
          : 'Awaiting movement'}
      </div>
      
      {/* Video element (hidden) */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover hidden"
        autoPlay
        playsInline
        muted
        onPlay={handleVideoPlay}
      />
      
      {/* Canvas for displaying processed video */}
      <canvas
        ref={canvasRef}
        className="rounded-lg shadow-lg w-full"
      />
      
      {/* Processing indicator */}
      <div className="absolute top-2 left-2 flex items-center bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-xs z-10">
        <div className={`w-2 h-2 rounded-full mr-2 ${processingRef.current ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
        Tracking {processingRef.current ? 'active' : 'inactive'}
      </div>
      
      {/* Settings indicator */}
      <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-xs z-10">
        Blur: {blurIntensityRef.current}px | Boxes: {showBoundingBoxesRef.current ? 'On' : 'Off'}
      </div>
      
      {/* Privacy notice */}
      <div className="absolute bottom-2 right-2 bg-blue-900 bg-opacity-80 text-white px-3 py-1 rounded-full text-xs z-10">
        Privacy protection active
      </div>
    </div>
  );
};

export default RealtimeFaceBlur; 