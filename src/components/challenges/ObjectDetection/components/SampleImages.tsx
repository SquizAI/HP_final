import React from 'react';

interface SampleImagesProps {
  onSelectImage: (imageUrl: string) => void;
}

const SampleImages: React.FC<SampleImagesProps> = ({ onSelectImage }) => {
  // Sample images focused on business and real estate with multiple objects
  const sampleImages = [
    {
      url: 'https://images.pexels.com/photos/6267/menu-restaurant-vintage-table.jpg',
      alt: 'Restaurant table with menu, plates and dining setup',
      description: 'Restaurant Interior'
    },
    {
      url: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
      alt: 'Modern corporate office with workstations and employees',
      description: 'Corporate Office'
    },
    {
      url: 'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg',
      alt: 'Meeting room with people and business equipment',
      description: 'Business Meeting'
    },
    {
      url: 'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg',
      alt: 'Modern living room with furniture and decor',
      description: 'Luxury Apartment'
    },
    {
      url: 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg',
      alt: 'Modern kitchen with appliances and cabinetry',
      description: 'High-End Kitchen'
    },
    {
      url: 'https://images.pexels.com/photos/260931/pexels-photo-260931.jpeg',
      alt: 'Conference room with table, chairs and presentation setup',
      description: 'Conference Room'
    }
  ];
  
  // Fallback images if primary ones fail to load
  const fallbackImages = [
    'https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg',
    'https://images.pexels.com/photos/1001965/pexels-photo-1001965.jpeg',
    'https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg'
  ];
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {sampleImages.map((image, index) => (
        <div 
          key={index}
          className="relative group overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-200"
          onClick={() => onSelectImage(image.url)}
        >
          <img 
            src={`${image.url}?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1`}
            alt={image.alt}
            className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              // Use specific fallback image or default to first one
              const fallbackIndex = index < fallbackImages.length ? index : 0;
              (e.target as HTMLImageElement).src = 
                `${fallbackImages[fallbackIndex]}?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80" />
          <div className="absolute bottom-0 left-0 right-0 p-2">
            <span className="text-white text-sm font-medium block truncate">{image.description}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SampleImages; 