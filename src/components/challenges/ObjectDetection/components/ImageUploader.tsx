import React, { useRef, useState } from 'react';
import { Upload, Image, Trash2 } from 'lucide-react';

interface ImageUploaderProps {
  onImageChange: (file: File) => void;
  imagePreview: string | null;
  clearImage: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange, imagePreview, clearImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  
  // Handle file upload via input 
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (files && files.length > 0) {
      const file = files[0];
      if (isValidImageFile(file)) {
        onImageChange(file);
      } else {
        alert('Please upload a valid image file (JPEG, PNG, etc.)');
      }
    }
  };
  
  // Validate the file is an image
  const isValidImageFile = (file: File): boolean => {
    return file.type.startsWith('image/');
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
        alert('Please upload a valid image file (JPEG, PNG, etc.)');
      }
    }
  };
  
  // Open file dialog when clicking the upload area
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="w-full space-y-4">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />
      
      {/* Image preview */}
      {imagePreview && (
        <div className="relative rounded-lg overflow-hidden border border-gray-200">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full object-contain max-h-[300px]"
          />
          <button
            className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white"
            onClick={clearImage}
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
      
      {/* Upload area (visible when no image is selected) */}
      {!imagePreview && (
        <div 
          className={`border-2 border-dashed rounded-lg p-6 text-center ${
            dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <Image className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4 flex flex-col items-center text-sm">
            <p className="text-gray-600">
              Drag and drop your image here, or
            </p>
            <button
              type="button"
              className="mt-2 font-medium text-indigo-600 hover:text-indigo-500"
            >
              browse files
            </button>
            <p className="mt-2 text-xs text-gray-500">
              Images with multiple objects work best. Maximum size 5MB.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader; 