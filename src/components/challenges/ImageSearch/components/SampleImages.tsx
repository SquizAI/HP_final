import React from 'react';

interface SampleImagesProps {
  onSelectImage: (imageUrl: string) => void;
}

const SampleImages: React.FC<SampleImagesProps> = ({ onSelectImage }) => {
  // Sample images with diverse categories for testing
  const sampleImages = [
    {
      url: 'https://images.unsplash.com/photo-1558599249-31ebf0656898',
      alt: 'Landmark: Eiffel Tower',
      category: 'Landmark'
    },
    {
      url: 'https://images.unsplash.com/photo-1610069302033-6fee1f5791e2',
      alt: 'Product: Sneakers',
      category: 'Product'
    },
    {
      url: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8',
      alt: 'Food: Pizza',
      category: 'Food'
    },
    {
      url: 'https://images.unsplash.com/photo-1574158622682-e40e69881006',
      alt: 'Animal: Tiger',
      category: 'Wildlife'
    },
    {
      url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38',
      alt: 'Food: Burger and fries',
      category: 'Food'
    },
    {
      url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
      alt: 'Technology: Computer components',
      category: 'Technology'
    },
    {
      url: 'https://images.unsplash.com/photo-1496449903084-c8e8a8672383',
      alt: 'Art: Museum painting',
      category: 'Art'
    },
    {
      url: 'https://images.unsplash.com/photo-1626624340240-aadc087dd7f1',
      alt: 'Plant: Rare flower',
      category: 'Nature'
    }
  ];
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {sampleImages.map((image, index) => (
        <div 
          key={index}
          className="relative group overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-200"
          onClick={() => onSelectImage(image.url)}
        >
          <img 
            src={`${image.url}?auto=format&fit=crop&w=300&h=200`}
            alt={image.alt}
            className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              // Fallback if image fails to load
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&w=300&h=200";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80" />
          <div className="absolute bottom-0 left-0 right-0 p-2">
            <span className="text-white text-sm font-medium block truncate">{image.alt}</span>
            <span className="text-gray-300 text-xs">{image.category}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SampleImages; 