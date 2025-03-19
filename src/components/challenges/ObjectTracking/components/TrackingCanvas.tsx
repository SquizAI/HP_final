import React, { useRef, useEffect, useState } from 'react';

interface TrackedObject {
  id: string;
  label: string;
  color: string;
  bbox: [number, number, number, number]; // [x, y, width, height]
  score: number;
  path: Array<[number, number]>; // Array of [x, y] center points
  lastSeen: number; // timestamp
}

interface TrackingCanvasProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  trackedObjects: TrackedObject[];
  trackingActive: boolean;
  showPaths?: boolean;
  showLabels?: boolean;
}

interface CanvasDimensions {
  width: number;
  height: number;
  scaleX: number;
  scaleY: number;
}

const TrackingCanvas: React.FC<TrackingCanvasProps> = ({
  videoRef,
  trackedObjects,
  trackingActive,
  showPaths = true,
  showLabels = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasDimensions, setCanvasDimensions] = useState<CanvasDimensions>({
    width: 0,
    height: 0,
    scaleX: 1,
    scaleY: 1
  });
  
  // Set up canvas and resize observer
  useEffect(() => {
    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;
    
    if (!videoElement || !canvasElement) return;
    
    // Function to update canvas dimensions
    const updateCanvasDimensions = () => {
      if (!videoElement || !canvasElement) return;
      
      // Get the actual displayed dimensions of the video
      const videoRect = videoElement.getBoundingClientRect();
      const containerWidth = videoRect.width;
      const containerHeight = videoRect.height;
      
      // Calculate scale factors (video content vs displayed size)
      const scaleX = containerWidth / videoElement.videoWidth || 1;
      const scaleY = containerHeight / videoElement.videoHeight || 1;
      
      // Set canvas dimensions to match the container
      canvasElement.width = containerWidth;
      canvasElement.height = containerHeight;
      
      setCanvasDimensions({
        width: containerWidth,
        height: containerHeight,
        scaleX,
        scaleY
      });
      
      // Redraw with new dimensions
      drawTrackedObjects();
    };
    
    // Initial setup
    updateCanvasDimensions();
    
    // Set up resize observer for the video element
    const resizeObserver = new ResizeObserver(updateCanvasDimensions);
    resizeObserver.observe(videoElement);
    
    // Listen for video metadata load event
    const handleVideoLoad = () => {
      updateCanvasDimensions();
    };
    
    videoElement.addEventListener('loadedmetadata', handleVideoLoad);
    videoElement.addEventListener('loadeddata', handleVideoLoad);
    
    // Clean up
    return () => {
      resizeObserver.disconnect();
      videoElement.removeEventListener('loadedmetadata', handleVideoLoad);
      videoElement.removeEventListener('loadeddata', handleVideoLoad);
    };
  }, [videoRef.current]);
  
  // Draw tracking information on canvas
  useEffect(() => {
    drawTrackedObjects();
  }, [trackedObjects, trackingActive, showPaths, showLabels, canvasDimensions]);
  
  // Function to draw tracked objects on canvas
  const drawTrackedObjects = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const video = videoRef.current;
    
    if (!ctx || !video || !trackingActive || !canvas) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // If no video is playing or no objects to track, return
    if (video.paused || video.ended || trackedObjects.length === 0) return;
    
    // Get the dimensions for proper scaling
    const { scaleX, scaleY } = canvasDimensions;
    
    // Get canvas size for drawing
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    // Draw each tracked object
    trackedObjects.forEach(obj => {
      const [x, y, width, height] = obj.bbox;
      
      // Scale the coordinates to match the canvas size
      const scaledX = x * scaleX;
      const scaledY = y * scaleY;
      const scaledWidth = width * scaleX;
      const scaledHeight = height * scaleY;
      
      // Draw edge detection effect (semi-transparent highlight)
      ctx.save();
      ctx.beginPath();
      ctx.rect(scaledX, scaledY, scaledWidth, scaledHeight);
      // Create a semi-transparent highlight
      ctx.fillStyle = `${obj.color}22`; // 22 is hex for ~13% opacity
      ctx.fill();
      
      // Draw edge detection glow
      ctx.shadowColor = obj.color;
      ctx.shadowBlur = 8;
      ctx.lineWidth = 1;
      ctx.strokeStyle = `${obj.color}88`; // 88 is hex for ~53% opacity
      ctx.stroke();
      ctx.restore();
      
      // Draw bounding box with dashed border for better visibility
      ctx.save();
      ctx.beginPath();
      ctx.setLineDash([5, 3]);
      ctx.lineWidth = 2;
      ctx.strokeStyle = obj.color;
      ctx.rect(scaledX, scaledY, scaledWidth, scaledHeight);
      ctx.stroke();
      ctx.restore();
      
      // Draw corner markers for better visibility
      const cornerSize = 6;
      ctx.strokeStyle = obj.color;
      ctx.lineWidth = 2;
      
      // Top-left
      ctx.beginPath();
      ctx.moveTo(scaledX, scaledY + cornerSize);
      ctx.lineTo(scaledX, scaledY);
      ctx.lineTo(scaledX + cornerSize, scaledY);
      ctx.stroke();
      
      // Top-right
      ctx.beginPath();
      ctx.moveTo(scaledX + scaledWidth - cornerSize, scaledY);
      ctx.lineTo(scaledX + scaledWidth, scaledY);
      ctx.lineTo(scaledX + scaledWidth, scaledY + cornerSize);
      ctx.stroke();
      
      // Bottom-right
      ctx.beginPath();
      ctx.moveTo(scaledX + scaledWidth, scaledY + scaledHeight - cornerSize);
      ctx.lineTo(scaledX + scaledWidth, scaledY + scaledHeight);
      ctx.lineTo(scaledX + scaledWidth - cornerSize, scaledY + scaledHeight);
      ctx.stroke();
      
      // Bottom-left
      ctx.beginPath();
      ctx.moveTo(scaledX + cornerSize, scaledY + scaledHeight);
      ctx.lineTo(scaledX, scaledY + scaledHeight);
      ctx.lineTo(scaledX, scaledY + scaledHeight - cornerSize);
      ctx.stroke();
      
      // Draw label with background and rounded corners
      if (showLabels) {
        const label = `${obj.label} (${Math.round(obj.score * 100)}%)`;
        const labelWidth = ctx.measureText(label).width + 10;
        const labelHeight = 20;
        const labelX = Math.min(scaledX, canvasWidth - labelWidth);
        const labelY = Math.max(scaledY - labelHeight - 5, 0);
        const cornerRadius = 4;
        
        // Label background with rounded corners
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(labelX + cornerRadius, labelY);
        ctx.lineTo(labelX + labelWidth - cornerRadius, labelY);
        ctx.arcTo(labelX + labelWidth, labelY, labelX + labelWidth, labelY + cornerRadius, cornerRadius);
        ctx.lineTo(labelX + labelWidth, labelY + labelHeight - cornerRadius);
        ctx.arcTo(labelX + labelWidth, labelY + labelHeight, labelX + labelWidth - cornerRadius, labelY + labelHeight, cornerRadius);
        ctx.lineTo(labelX + cornerRadius, labelY + labelHeight);
        ctx.arcTo(labelX, labelY + labelHeight, labelX, labelY + labelHeight - cornerRadius, cornerRadius);
        ctx.lineTo(labelX, labelY + cornerRadius);
        ctx.arcTo(labelX, labelY, labelX + cornerRadius, labelY, cornerRadius);
        ctx.fillStyle = obj.color;
        ctx.fill();
        ctx.restore();
        
        // Label text
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, labelX + 5, labelY + labelHeight / 2);
      }
      
      // Draw tracking path with curve and gradient for smoother visualization
      if (showPaths && obj.path.length > 1) {
        ctx.beginPath();
        
        // Start path
        const [startX, startY] = obj.path[0];
        ctx.moveTo(startX * scaleX, startY * scaleY);
        
        // Create gradient for path that fades out
        const gradient = ctx.createLinearGradient(
          obj.path[0][0] * scaleX, 
          obj.path[0][1] * scaleY,
          obj.path[obj.path.length - 1][0] * scaleX, 
          obj.path[obj.path.length - 1][1] * scaleY
        );
        gradient.addColorStop(0, obj.color + '33'); // Start with low opacity
        gradient.addColorStop(1, obj.color);        // End with full color
        
        // Draw curved path through all points
        for (let i = 1; i < obj.path.length; i++) {
          const [x1, y1] = obj.path[i - 1];
          const [x2, y2] = obj.path[i];
          
          // Simple curve - average of current and next point for control points
          const cpX = (x1 + x2) / 2;
          const cpY = (y1 + y2) / 2;
          
          // Use quadratic curve for smoother path
          if (i === 1) {
            ctx.lineTo(x1 * scaleX, y1 * scaleY);
          }
          ctx.quadraticCurveTo(
            cpX * scaleX, cpY * scaleY,
            x2 * scaleX, y2 * scaleY
          );
        }
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw path end point (current position)
        if (obj.path.length > 0) {
          const [latestX, latestY] = obj.path[obj.path.length - 1];
          ctx.beginPath();
          ctx.arc(latestX * scaleX, latestY * scaleY, 4, 0, Math.PI * 2);
          ctx.fillStyle = obj.color;
          ctx.fill();
        }
      }
    });
  };
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 10 }}
    />
  );
};

export default TrackingCanvas; 