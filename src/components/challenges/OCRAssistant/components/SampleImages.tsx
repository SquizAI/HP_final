import React from 'react';
import { FileText, Edit3, Receipt, ClipboardCheck } from 'lucide-react';

interface SampleImagesProps {
  onSelectImage: (imageUrl: string, isHandwriting: boolean) => void;
}

const SampleImages: React.FC<SampleImagesProps> = ({ onSelectImage }) => {
  // Local sample images with both printed and handwritten text
  const sampleImages = [
    {
      url: '/images/construction-contract-agreement-sample.png',
      alt: 'Construction Contract',
      description: 'Construction Contract',
      isHandwriting: false,
      icon: <FileText className="h-5 w-5 text-blue-500" />,
      sampleText: `CONSTRUCTION CONTRACT AGREEMENT

THIS AGREEMENT made as of [date], by and between:

[CONTRACTOR NAME]
Address: [Contractor Address]
License: [License Number]

AND

[OWNER NAME]
Address: [Owner Address]

For the following PROJECT:
[Project Description and Location]

The Owner and Contractor agree as follows:
1. The Work shall commence on [date] and be substantially completed by [date].
2. Contract Sum: $[amount] subject to additions and deductions per the Contract Documents.`
    },
    {
      url: '/images/invoice-template-us-band-blue-750px.png',
      alt: 'Invoice Template',
      description: 'Invoice Template',
      isHandwriting: false,
      icon: <Receipt className="h-5 w-5 text-green-500" />,
      sampleText: `INVOICE

From:
Your Business Name
123 Your Street
Your City, ST 12345

To:
Client Name
456 Client Street
Client City, ST 67890

INVOICE #: 12345
DATE: March 18, 2025
DUE DATE: April 18, 2025

Description | Quantity | Rate | Amount
----------------------------------------
Web Design | 1 | $1,500.00 | $1,500.00
Hosting (Annual) | 1 | $200.00 | $200.00

Subtotal: $1,700.00
Tax (7%): $119.00
Total: $1,819.00`
    },
    {
      url: '/images/Lower_El_-_Narrative_-_Gr_201830.jpg',
      alt: 'Handwritten Narrative',
      description: 'Handwritten Narrative',
      isHandwriting: true,
      icon: <Edit3 className="h-5 w-5 text-purple-500" />,
      sampleText: `The Magical Adventure

Once upon a time, there was a little girl named Lily. She loved to explore the woods behind her house. One day, she found a hidden path she had never seen before.

As she followed the path, she discovered a small door in the trunk of an old oak tree. The door was just big enough for her to crawl through. Inside, she found a tiny world filled with magical creatures.

There were fairies with glowing wings, talking animals, and trees that could walk. Lily made friends with a small fox who showed her around this magical world.

When it was time to go home, the fox gave her a special stone that would help her find her way back whenever she wanted to visit again.`
    },
    {
      url: '/images/Hedgehog-motivation-jpg.jpg',
      alt: 'Hedgehog Motivation',
      description: 'Motivational Quote',
      isHandwriting: true,
      icon: <ClipboardCheck className="h-5 w-5 text-red-500" />,
      sampleText: `Don't wait for
opportunity.
Create it.

Like if you
agree!

#motivation #success #entrepreneurship`
    }
  ];
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {sampleImages.map((image, index) => (
        <div 
          key={index}
          className="relative group overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-200"
          onClick={() => onSelectImage(image.url, image.isHandwriting)}
        >
          <img 
            src={image.url}
            alt={image.alt}
            className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              // Fallback if image fails to load - use a specific fallback for printed vs handwritten
              (e.target as HTMLImageElement).src = image.isHandwriting 
                ? "/images/placeholder-handwritten.jpg" // Handwritten fallback
                : "/images/placeholder-printed.jpg"; // Printed fallback
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80" />
          <div className="absolute bottom-0 left-0 right-0 p-2">
            <span className="text-white text-sm font-medium block truncate">{image.description}</span>
            <div className="flex items-center mt-1">
              {image.isHandwriting ? (
                <span className="flex items-center text-xs text-amber-300">
                  <Edit3 size={10} className="mr-1" />
                  Handwritten
                </span>
              ) : (
                <span className="flex items-center text-xs text-blue-300">
                  <FileText size={10} className="mr-1" />
                  Printed
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SampleImages; 