import React, { useRef, useState } from 'react';
import { Upload, Camera, Trash2 } from 'lucide-react';

interface ImageUploaderProps {
  onImageChange: (file: File) => void;
  imagePreview: string | null;
  clearImage: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange, imagePreview, clearImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Handle file upload via input 
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (files && files.length > 0) {
      const file = files[0];
      if (isValidImageFile(file)) {
        onImageChange(file);
      } else {
        alert('Please upload a valid image file (JPEG, PNG, HEIC, etc.)');
      }
    }
  };
  
  // Validate the file is an image
  const isValidImageFile = (file: File): boolean => {
    // Check for HEIC/HEIF files by extension since MIME type might not be recognized
    const isHeicFile = file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif');
    return file.type.startsWith('image/') || isHeicFile;
  };
  
  // Handle drag events
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  // Handle drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (isValidImageFile(file)) {
        onImageChange(file);
      } else {
        alert('Please upload a valid image file (JPEG, PNG, HEIC, etc.)');
      }
    }
  };
  
  // Open file dialog when clicking the upload area
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };
  
  // Start camera capture
  const startCamera = async () => {
    try {
      setCameraActive(true);
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setCameraActive(false);
      alert('Unable to access the camera. Please check your permissions and try again.');
    }
  };
  
  // Stop camera capture
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    setCameraActive(false);
  };
  
  // Take photo from camera
  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw current video frame to canvas
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to blob
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
            onImageChange(file);
            stopCamera();
          }
        }, 'image/jpeg', 0.95);
      }
    }
  };
  
  return (
    <div className="w-full">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />
      
      {/* Camera view (when active) */}
      {cameraActive && (
        <div className="mb-4 relative bg-black rounded-lg overflow-hidden">
          <video 
            ref={videoRef} 
            className="w-full h-64 object-cover"
            autoPlay 
            playsInline
            muted
          />
          <canvas ref={canvasRef} className="hidden" />
          
          <div className="absolute bottom-4 inset-x-0 flex justify-center space-x-4">
            <button
              onClick={takePhoto}
              className="p-3 rounded-full bg-white shadow-md"
            >
              <Camera size={24} className="text-indigo-600" />
            </button>
            <button
              onClick={stopCamera}
              className="p-3 rounded-full bg-red-500 shadow-md"
            >
              <Trash2 size={24} className="text-white" />
            </button>
          </div>
        </div>
      )}
      
      {/* Image preview (when an image is selected) */}
      {!cameraActive && imagePreview && (
        <div className="mb-4 relative">
          <img 
            src={imagePreview} 
            alt="Document Preview" 
            className="w-full max-h-96 object-contain rounded-lg border border-gray-200"
          />
          <button
            onClick={clearImage}
            className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white shadow-md"
            title="Remove image"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )}
      
      {/* Upload area (when no image is selected and camera is not active) */}
      {!cameraActive && !imagePreview && (
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center mb-4 transition-colors
            ${dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <div className="cursor-pointer">
            <Upload size={40} className="mx-auto text-gray-400 mb-2" />
            <p className="text-gray-600 mb-1">Drag & drop a document or image here, or click to select</p>
            <p className="text-gray-400 text-sm">Supported formats: JPG, PNG, HEIC, PDF, etc.</p>
          </div>
        </div>
      )}
      
      {/* Camera and upload buttons (when no image and no camera) */}
      {!cameraActive && !imagePreview && (
        <div className="flex justify-center space-x-4">
          <button
            onClick={startCamera}
            className="px-4 py-2 border border-gray-300 rounded-md flex items-center text-gray-700 hover:bg-gray-50"
          >
            <Camera size={18} className="mr-2 text-indigo-600" />
            Take Photo
          </button>
          <button
            onClick={openFileDialog}
            className="px-4 py-2 border border-gray-300 rounded-md flex items-center text-gray-700 hover:bg-gray-50"
          >
            <Upload size={18} className="mr-2 text-indigo-600" />
            Upload Document
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader; 