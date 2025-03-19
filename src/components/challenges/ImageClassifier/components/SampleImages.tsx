import React from 'react';

interface SampleImagesProps {
  onSelectImage: (imageUrl: string) => void;
}

const SAMPLE_IMAGES = [
  {
    url: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
    label: 'Modern Office',
    category: 'Business'
  },
  {
    url: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
    label: 'Luxury Home',
    category: 'Real Estate'
  },
  {
    url: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg',
    label: 'Business Meeting',
    category: 'Corporate'
  },
  {
    url: 'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg',
    label: 'Modern Kitchen',
    category: 'Real Estate'
  },
  {
    url: 'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg',
    label: 'Housing Complex',
    category: 'Real Estate'
  },
  {
    url: 'https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg',
    label: 'Business Workshop',
    category: 'Corporate'
  }
];

// Fallback images in case the primary ones fail to load
const FALLBACK_IMAGES = [
  'https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg', // Office building
  'https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg', // House exterior
  'https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg'  // Business team
];

const SampleImages: React.FC<SampleImagesProps> = ({ onSelectImage }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
      {SAMPLE_IMAGES.map((image, index) => (
        <div 
          key={index} 
          className="group relative cursor-pointer rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
          onClick={() => onSelectImage(image.url)}
        >
          <img 
            src={`${image.url}?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1`} 
            alt={image.label} 
            className="w-full h-24 object-cover group-hover:brightness-90 transition-all"
            loading="lazy"
            onError={(e) => {
              // Use a specific fallback from our array or default to the first one
              const fallbackIndex = index < FALLBACK_IMAGES.length ? index : 0;
              (e.target as HTMLImageElement).src = 
                `${FALLBACK_IMAGES[fallbackIndex]}?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1`;
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-1 text-xs">
            <div className="text-center font-medium">{image.label}</div>
            <div className="text-center text-xs opacity-80">{image.category}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SampleImages;