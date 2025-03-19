const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

// Create directory if it doesn't exist
const privacyDir = path.join(__dirname, '../public/images/privacy');
if (!fs.existsSync(privacyDir)) {
  fs.mkdirSync(privacyDir, { recursive: true });
  console.log('Created directory:', privacyDir);
}

// Sample images - using free stock photos with permissive licenses
const images = [
  {
    url: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg',
    filename: 'group-meeting.jpg',
    description: 'Group of people in a meeting (from Pexels)'
  },
  {
    url: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
    filename: 'portrait.jpg',
    description: 'Portrait of a man (from Pexels)'
  },
  {
    url: 'https://images.pexels.com/photos/1267697/pexels-photo-1267697.jpeg',
    filename: 'friends.jpg',
    description: 'Group of friends taking selfie (from Pexels)'
  },
  {
    url: 'https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg',
    filename: 'meeting.jpg',
    description: 'Business meeting with people (from Pexels)'
  }
];

// Download function
const downloadImage = (url, filename) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(path.join(privacyDir, filename));
    
    https.get(url, (response) => {
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${filename}`);
        resolve();
      });
      
      file.on('error', (err) => {
        fs.unlink(path.join(privacyDir, filename), () => {});
        reject(err);
      });
    }).on('error', (err) => {
      fs.unlink(path.join(privacyDir, filename), () => {});
      reject(err);
    });
  });
};

// Download all images
const downloadAll = async () => {
  console.log('Starting download of sample images...');
  
  for (const image of images) {
    try {
      await downloadImage(image.url, image.filename);
    } catch (error) {
      console.error(`Error downloading ${image.filename}:`, error.message);
    }
  }
  
  console.log('Finished downloading sample images.');
};

downloadAll(); 