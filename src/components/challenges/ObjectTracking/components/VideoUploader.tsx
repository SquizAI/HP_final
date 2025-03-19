import React, { useRef, useState } from 'react';
import { Upload, Trash2, Video } from 'lucide-react';

interface VideoUploaderProps {
  onVideoChange: (file: File) => void;
  videoPreview: string | null;
  clearVideo: () => void;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ onVideoChange, videoPreview, clearVideo }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  
  // Handle file upload via input 
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (files && files.length > 0) {
      const file = files[0];
      if (isValidVideoFile(file)) {
        onVideoChange(file);
      } else {
        alert('Please upload a valid video file (MP4, WebM, etc.)');
      }
    }
  };
  
  // Validate the file is a video
  const isValidVideoFile = (file: File): boolean => {
    return file.type.startsWith('video/');
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
      if (isValidVideoFile(file)) {
        onVideoChange(file);
      } else {
        alert('Please upload a valid video file (MP4, WebM, etc.)');
      }
    }
  };
  
  // Open file dialog when clicking the upload area
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="w-full">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileInput}
        className="hidden"
      />
      
      {/* Video preview (when a video is selected) */}
      {videoPreview && (
        <div className="mb-4 relative">
          <video 
            src={videoPreview} 
            controls
            className="w-full max-h-96 object-contain rounded-lg border border-gray-200"
          />
          <button
            onClick={clearVideo}
            className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white shadow-md"
            title="Remove video"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )}
      
      {/* Upload area (when no video is selected) */}
      {!videoPreview && (
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
            <Video size={40} className="mx-auto text-gray-400 mb-2" />
            <p className="text-gray-600 mb-1">Drag & drop a video file here, or click to select</p>
            <p className="text-gray-400 text-sm">Supported formats: MP4, WebM, MOV (max 30 seconds)</p>
          </div>
        </div>
      )}
      
      {/* Upload button (when no video) */}
      {!videoPreview && (
        <div className="flex justify-center">
          <button
            onClick={openFileDialog}
            className="px-4 py-2 border border-gray-300 rounded-md flex items-center text-gray-700 hover:bg-gray-50"
          >
            <Upload size={18} className="mr-2 text-indigo-600" />
            Upload Video
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoUploader; 