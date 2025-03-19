import React, { useState } from 'react';
import { Scan, Image, AlertCircle, Upload, Trash2, FileText, Info, RefreshCw } from 'lucide-react';

// Sample images for OCR testing
const SAMPLE_IMAGES = [
  {
    id: 'receipt',
    url: 'https://images.unsplash.com/photo-1572357280636-d7249243cec6?auto=format&fit=crop&q=80',
    title: 'Receipt',
    type: 'printed'
  },
  {
    id: 'document',
    url: 'https://images.unsplash.com/photo-1618044733300-9472054094ee?auto=format&fit=crop&q=80',
    title: 'Document',
    type: 'printed'
  },
  {
    id: 'menu',
    url: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&q=80',
    title: 'Menu',
    type: 'printed'
  },
  {
    id: 'handwritten-note',
    url: 'https://images.unsplash.com/photo-1598866594230-a7c12756260c?auto=format&fit=crop&q=80',
    title: 'Handwritten Note',
    type: 'handwritten'
  },
  {
    id: 'handwritten-text',
    url: 'https://images.unsplash.com/photo-1611215871890-1e2d943bf1d3?auto=format&fit=crop&q=80',
    title: 'Handwritten Text',
    type: 'handwritten'
  },
  {
    id: 'business-card',
    url: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&q=80',
    title: 'Business Card',
    type: 'printed'
  }
];

interface OCRProcessingProps {
  onProcessImage?: (imageUrl: string, isHandwriting: boolean) => void;
  isProcessing?: boolean;
  onSampleImageSelect?: (imageUrl: string, isHandwriting: boolean) => void;
  progress?: number;
  isHandwriting?: boolean;
}

const OCRProcessing: React.FC<OCRProcessingProps> = ({ 
  onProcessImage, 
  isProcessing = false,
  onSampleImageSelect,
  progress = 0,
  isHandwriting = false
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [localIsHandwriting, setLocalIsHandwriting] = useState<boolean>(isHandwriting);
  const [showSampleImages, setShowSampleImages] = useState<boolean>(true);

  // If we're passed in isProcessing and progress props, we're in the simplified mode
  const isSimplifiedMode = isProcessing && typeof progress === 'number';

  // If in simplified mode, just show the processing indicator
  if (isSimplifiedMode) {
    return (
      <div className="w-full">
        <div className="bg-indigo-50 p-8 rounded-lg flex flex-col items-center justify-center">
          <div className="mb-6 relative">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
              <RefreshCw size={32} className="text-indigo-600 animate-spin" />
            </div>
            {isHandwriting && (
              <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
                Handwritten
              </div>
            )}
          </div>
          
          <h3 className="text-lg font-bold text-indigo-800 mb-2">
            {isHandwriting ? 'Processing Handwritten Text' : 'Extracting Text'}
          </h3>
          
          <p className="text-sm text-indigo-600 mb-6 text-center max-w-md">
            {isHandwriting 
              ? 'Analyzing handwriting patterns and extracting text...' 
              : 'Identifying characters and extracting text from your image...'}
          </p>
          
          <div className="w-full max-w-md bg-indigo-200 rounded-full h-2.5">
            <div 
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-indigo-600 font-medium">
            {progress}% complete
          </div>
        </div>
      </div>
    );
  }

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    setError(null);
    const file = files[0];
    
    // Check if file is HEIC/HEIF format by extension since MIME type might not be recognized
    const isHeicFile = file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif');
    
    // Validate file type (include HEIC files)
    if (!file.type.match('image.*') && !isHeicFile) {
      setError('Please upload an image file (JPEG, PNG, HEIC, etc.)');
      return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }
    
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
    setShowSampleImages(false);
  };

  const clearImage = () => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
    }
    setSelectedImage(null);
    setError(null);
    setShowSampleImages(true);
  };

  const processImage = () => {
    if (selectedImage && onProcessImage) {
      onProcessImage(selectedImage, localIsHandwriting);
    }
  };

  const handleSampleImageSelect = (imageUrl: string, isHandwritten: boolean) => {
    setSelectedImage(imageUrl);
    setLocalIsHandwriting(isHandwritten);
    setShowSampleImages(false);
    
    if (onSampleImageSelect) {
      onSampleImageSelect(imageUrl, isHandwritten);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col items-center space-y-2">
        <div className="flex items-center gap-2">
          <div className="form-control">
            <label className="cursor-pointer label gap-2">
              <span className="label-text">Printed Text</span>
              <input 
                type="radio" 
                name="text-type" 
                className="radio radio-primary radio-sm" 
                checked={!localIsHandwriting}
                onChange={() => setLocalIsHandwriting(false)}
              />
            </label>
          </div>
          <div className="form-control">
            <label className="cursor-pointer label gap-2">
              <span className="label-text">Handwritten</span>
              <input 
                type="radio" 
                name="text-type" 
                className="radio radio-warning radio-sm" 
                checked={localIsHandwriting}
                onChange={() => setLocalIsHandwriting(true)}
              />
            </label>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="alert alert-error flex items-center gap-2 py-2">
          <AlertCircle size={16} />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {!selectedImage ? (
        <>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center ${
              dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
            }`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <Image className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4 flex flex-col items-center text-sm">
              <p className="text-gray-600">
                Drag and drop your image here, or
              </p>
              <label className="mt-2 cursor-pointer text-primary hover:text-primary-focus">
                <span>Browse files</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
              <p className="mt-2 text-xs text-gray-500">
                Support for JPEG, PNG, HEIC, etc. Max size 5MB.
              </p>
            </div>
          </div>
          
          {showSampleImages && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-md font-medium text-gray-700 flex items-center">
                  <FileText size={16} className="text-primary mr-2" />
                  Sample Images
                </h3>
                <div className="flex items-center text-gray-500 text-xs">
                  <Info size={12} className="mr-1" />
                  Click an image to process it
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {SAMPLE_IMAGES.map((image) => (
                  <div 
                    key={image.id}
                    className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow" 
                    onClick={() => handleSampleImageSelect(image.url, image.type === 'handwritten')}
                  >
                    <div className="aspect-w-16 aspect-h-9 bg-gray-100 relative" style={{ height: '120px', overflow: 'hidden' }}>
                      <img 
                        src={image.url} 
                        alt={image.title}
                        className="object-cover w-full h-full"
                        loading="lazy"
                        onError={(e) => {
                          // Fallback if image fails to load
                          (e.target as HTMLImageElement).src = image.type === 'handwritten'
                            ? "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=300&h=200"
                            : "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=300&h=200";
                        }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                        <span className="text-white text-xs font-medium">{image.title}</span>
                        <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                          image.type === 'handwritten' ? 'bg-amber-500' : 'bg-indigo-500'
                        } text-white`}>
                          {image.type}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-lg overflow-hidden border border-gray-200">
            <img
              src={selectedImage}
              alt="Uploaded"
              className="w-full object-contain max-h-[300px]"
            />
            <button
              className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white"
              onClick={clearImage}
            >
              <Trash2 size={16} />
            </button>
          </div>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={clearImage}
              className="px-3 py-1.5 border border-gray-300 rounded text-gray-600 text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={processImage}
              className="px-3 py-1.5 bg-primary text-white rounded text-sm hover:bg-primary-focus"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center">
                  <RefreshCw size={16} className="animate-spin mr-2" />
                  Processing...
                </div>
              ) : (
                <div className="flex items-center">
                  <Scan size={16} className="mr-2" />
                  Extract Text
                </div>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OCRProcessing; 