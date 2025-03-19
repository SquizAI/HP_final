import React, { useState, useEffect, useRef } from 'react';
import { Camera, User, Shield, CheckCircle, XCircle, RefreshCw, Info, Lock } from 'lucide-react';
import ChallengeHeader from '../../shared/ChallengeHeader';
import { useChallengeStatus } from '../../../utils/userDataManager';
import Confetti from '../../shared/Confetti';

// Sample images for demo
// In a real application, these would be stored in an assets folder
const SAMPLE_FACES = {
  // Sample positive matches (same person, different images)
  positiveMatches: [
    {
      id: 'pos1',
      name: 'Alex Johnson',
      image1: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&h=250&fit=crop',
      image2: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=250&h=250&fit=crop',
      similarity: 0.89,
      isMatch: true
    },
    {
      id: 'pos2',
      name: 'Emma Wilson',
      image1: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&h=250&fit=crop',
      image2: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&h=250&fit=crop',
      similarity: 0.92,
      isMatch: true
    }
  ],
  // Sample negative matches (different people)
  negativeMatches: [
    {
      id: 'neg1',
      name1: 'Michael Chen',
      name2: 'David Kim',
      image1: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&h=250&fit=crop',
      image2: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&h=250&fit=crop',
      similarity: 0.42,
      isMatch: false
    },
    {
      id: 'neg2',
      name1: 'Sophia Patel',
      name2: 'Olivia Rodriguez',
      image1: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=250&h=250&fit=crop',
      image2: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=250&h=250&fit=crop',
      similarity: 0.37,
      isMatch: false
    }
  ]
};

// Sample authorized people for access control demonstration
// Converting to simpler format compatible with our new structure
const SAMPLE_AUTHORIZED_PEOPLE = [
  {
    name: "Dr. Ernesto Lee",
    image: "/ErnestoLee.jpeg",
    authorized: true,
    description: "Security Administrator"
  },
  {
    name: "Sarah Johnson",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=250&h=250&fit=crop",
    authorized: true,
    description: "IT Manager"
  },
  {
    name: "Unknown Visitor",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&h=250&fit=crop",
    authorized: false,
    description: "Not authorized for access"
  }
];

// Privacy concerns and considerations
const PRIVACY_CONCERNS = [
  {
    title: "Data Storage",
    content: "Facial data should be stored securely with encryption. Consider whether to store actual images or just mathematical representations (face embeddings)."
  },
  {
    title: "Informed Consent",
    content: "Always obtain explicit consent before collecting and processing biometric data. Users should understand what data is collected and how it will be used."
  },
  {
    title: "Right to be Forgotten",
    content: "Implement systems that allow users to delete their facial data permanently and verify the deletion has occurred."
  },
  {
    title: "Transparency",
    content: "Clearly communicate when facial recognition is in use, for example with visible signage in physical locations or clear notifications in apps."
  },
  {
    title: "Potential for Bias",
    content: "Facial recognition systems can have varying accuracy rates across different demographics. Regular testing for fairness and bias is essential."
  },
  {
    title: "Security Measures",
    content: "Implement strong security measures to prevent unauthorized access to facial recognition databases."
  }
];

// Type for facial recognition explainer sections
interface ExplainerSection {
  title: string;
  content: string;
  icon?: React.ReactNode;
}

// Explainer content about facial recognition technology
const FACIAL_RECOGNITION_EXPLAINER: ExplainerSection[] = [
  {
    title: "What is Facial Recognition?",
    content: "Facial recognition is a biometric technology that identifies or verifies a person's identity using their facial features. It maps facial features from a photograph or video, creating a digital signature that can be compared to a database of known faces.",
    icon: <User />
  },
  {
    title: "How Does It Work?",
    content: "Modern facial recognition uses deep learning algorithms to analyze facial features like the distance between eyes, nose width, jawline, and many other data points to create a unique 'faceprint' - similar to a fingerprint but for your face.",
    icon: <Info />
  },
  {
    title: "Applications",
    content: "Facial recognition is used in security systems, phone unlocking, payment verification, law enforcement, attendance tracking, personalized marketing, and accessibility tools for people with disabilities.",
    icon: <Lock />
  },
  {
    title: "Privacy & Ethics",
    content: "While convenient, facial recognition raises privacy concerns. Best practices include explicit consent, transparency about data usage, strong security measures, and giving users control over their biometric data.",
    icon: <Shield />
  }
];

// Real-world applications of facial recognition
const REAL_WORLD_APPLICATIONS = [
  {
    title: "Smartphone Authentication",
    description: "Apple's Face ID and Android's face unlock use advanced 3D facial mapping to securely authenticate users, replacing traditional passwords."
  },
  {
    title: "Airport Security",
    description: "Facial recognition systems at airports match travelers to their passport photos, speeding up immigration processes while enhancing security."
  },
  {
    title: "Banking & Finance",
    description: "Many banks now allow customers to authenticate payments or access accounts using facial verification, adding an extra layer of security."
  },
  {
    title: "Retail & Customer Experience",
    description: "Retailers use facial recognition to identify regular customers, personalize service, and analyze shopper demographics and behavior."
  },
  {
    title: "Healthcare",
    description: "Medical applications include patient identification, monitoring patient expressions for pain assessment, and helping diagnose certain genetic conditions."
  }
];

// Accuracy and performance metrics
const ACCURACY_METRICS = {
  title: "Understanding Facial Recognition Accuracy",
  metrics: [
    {
      name: "False Accept Rate (FAR)",
      description: "The probability that the system incorrectly identifies a person or accepts an impostor as a match. Lower is better."
    },
    {
      name: "False Reject Rate (FRR)",
      description: "The probability that the system incorrectly rejects a valid user. Lower is better."
    },
    {
      name: "Equal Error Rate (EER)",
      description: "The point where FAR equals FRR, giving a single metric to compare systems. Lower is better."
    },
    {
      name: "Accuracy",
      description: "The overall percentage of correct identifications (both positive and negative). Higher is better."
    }
  ],
  note: "Modern facial recognition systems achieve accuracy rates above 99% under good conditions, though performance varies with lighting, angles, and image quality."
};

// Technology advancement timeline
const TECHNOLOGY_TIMELINE = [
  { year: "1960s", development: "First semi-automated facial recognition systems required manually identifying features like eyes and ears on photographs" },
  { year: "1990s", development: "Development of Eigenfaces technique, one of the first automated facial recognition approaches" },
  { year: "2000s", development: "Introduction of 3D facial recognition to improve accuracy despite lighting and viewing angle variations" },
  { year: "2010s", development: "Deep learning and convolutional neural networks revolutionize the field, dramatically improving accuracy" },
  { year: "Present", development: "Advanced systems handle masks, aging, different expressions, and can work with lower quality images" },
  { year: "Future", development: "Research focuses on reducing bias, improving privacy, and combining with other biometrics for enhanced security" }
];

// Sample CSS styles for minimal face scanning animation
const styles = `
  .face-scan-circle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 270px;
    height: 270px;
    border-radius: 100%;
    border: 3px dashed #3b82f6;
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
    50% { transform: translate(-50%, -50%) scale(1.05); opacity: 1; }
    100% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
  }
  
  .scan-line {
    height: 4px;
    background: linear-gradient(to right, rgba(59, 130, 246, 0), rgba(59, 130, 246, 0.8), rgba(59, 130, 246, 0));
    width: 100%;
    position: absolute;
    animation: scanAnimation 3s infinite;
  }
  
  @keyframes scanAnimation {
    0% { top: 20%; opacity: 0.8; }
    50% { top: 80%; opacity: 0.9; }
    100% { top: 20%; opacity: 0.8; }
  }
  
  .face-card {
    transition: all 0.2s ease-in-out;
    cursor: pointer;
  }
  
  .face-card:active {
    transform: scale(0.98);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
  }
  
  .selected-face {
    box-shadow: 0 0 0 2px #3b82f6, 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  
  .face-card-indicator {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    color: #3b82f6;
    font-size: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .comparison-container {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .comparison-match {
    background-color: rgba(209, 250, 229, 0.8);
    border: 1px solid #10b981;
  }
  
  .comparison-no-match {
    background-color: rgba(254, 226, 226, 0.8);
    border: 1px solid #ef4444;
  }
  
  .comparison-image {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 4px;
  }
  
  .comparison-details {
    flex: 1;
    padding: 12px;
  }
  
  .comparison-result {
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 9999px;
    font-size: 0.75rem;
    display: inline-block;
    margin-bottom: 8px;
  }
  
  .match-badge {
    background-color: #d1fae5;
    color: #047857;
  }
  
  .no-match-badge {
    background-color: #fee2e2;
    color: #b91c1c;
  }
`;

/**
 * Simple Face ID Component
 * A clean implementation of face ID with registration and verification flows
 * Uses a simplified approach without complex face recognition libraries
 */
const SimpleFaceId: React.FC = () => {
  // Use the standardized hook for challenge status management
  const { 
    isCompleted, 
    setIsCompleted, 
    showConfetti, 
    setShowConfetti,
    handleCompleteChallenge,
    challengeId 
  } = useChallengeStatus('challenge-3'); // Use standard ID from ChallengeHubNew.tsx
  
  // ---------- STATE ----------
  // Core state
  const [mode, setMode] = useState<'idle' | 'register' | 'verify'>('idle');
  const [step, setStep] = useState<'intro' | 'camera' | 'processing' | 'result'>('intro');
  
  // User information
  const [userName, setUserName] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [registeredUser, setRegisteredUser] = useState('');
  
  // Camera & processing
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  
  // UI state
  const [showExplainer, setShowExplainer] = useState(true);
  const [selectedSampleFace, setSelectedSampleFace] = useState<{
    name: string;
    image: string;
    authorized: boolean;
    description: string;
  } | null>(null);
  
  // Verification results
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    message: string;
    similarity?: number;
  } | null>(null);
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Face API models and state
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("");

  // Sample faces for testing
  /*const sampleFaces = [
    {
      name: "Dr. Lee",
      image: "/images/drlee.jpg",
      authorized: true,
      description: "Authorized personnel with full access"
    },
    {
      name: "Anonymous Visitor",
      image: "/images/visitor.jpg",
      authorized: false,
      description: "Unauthorized visitor with no access"
    },
    {
      name: "Security Staff",
      image: "/images/security.jpg",
      authorized: true,
      description: "Security staff with limited access"
    }
  ];*/

  // ---------- LIFECYCLE HOOKS ----------
  useEffect(() => {
    checkExistingRegistration();
    
    // Add CSS styles to document
    const styleEl = document.createElement('style');
    styleEl.innerHTML = styles;
    document.head.appendChild(styleEl);
    
    // If user has registered before, don't show explainer by default
    // This assumes they've already seen the educational content
    if (localStorage.getItem('simpleFaceId_userName')) {
      setShowExplainer(false);
    }
    
    // Check if the challenge has been completed before
    // Use the correct challenge ID (challenge-3) to check completion status
    const isAlreadyCompleted = localStorage.getItem('userProgress');
    if (isAlreadyCompleted) {
      const userProgress = JSON.parse(isAlreadyCompleted);
      setIsCompleted(userProgress.completedChallenges.includes('challenge-3'));
    }
    
    // For demo purposes, we'll assume models are loaded
    // This enables the sample face testing functionality
    setModelsLoaded(true);
    
    // Cleanup on unmount
    return () => {
      stopCamera();
      styleEl.remove();
    };
  }, []);

  // Check for existing registration
  const checkExistingRegistration = () => {
    try {
      const savedFace = localStorage.getItem('simpleFaceId_faceData');
      const savedName = localStorage.getItem('simpleFaceId_userName');
      
      if (savedFace && savedName) {
        setIsRegistered(true);
        setRegisteredUser(savedName);
      }
    } catch (error) {
      console.error('Error checking registration:', error);
    }
  };

  // ---------- SAMPLE FACE TESTING ----------
  // This function is no longer used since we now use testWithSampleFace
  // Keeping it commented for reference
  /*
  const handleSampleFaceSelect = (face: typeof SAMPLE_AUTHORIZED_PEOPLE[0]) => {
    setSelectedSampleFace(face);
    setShowVerifyAnimation(true);
    
    // Simulate verification process
    setTimeout(() => {
      setShowVerifyAnimation(false);
      // For demo purposes, show success or failure based on the face's authorized status
      setVerificationResult({
        success: face.authorized,
        message: face.authorized 
          ? `Authentication successful for ${face.name}!` 
          : `Authentication failed: ${face.name} is not authorized.`,
        similarity: face.similarity
      });
    }, 3000);
  };
  */
  
  // Render sample face testing section
  const renderSampleFaceTest = () => (
    <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 mx-auto">
      <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Test with Sample Faces</h3>
      <p className="mb-3 sm:mb-4 text-gray-700 text-sm sm:text-base">
        Click on any of these faces to see how facial recognition would determine access rights.
        This demonstrates how the system distinguishes between authorized and unauthorized individuals.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {SAMPLE_AUTHORIZED_PEOPLE.map((face, index) => (
          <div 
            key={index}
            className={`face-card border rounded-lg p-3 sm:p-4 relative ${
              selectedSampleFace?.name === face.name ? 'selected-face' : ''
            }`}
            onClick={() => testWithSampleFace(face)}
          >
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-200 mb-2 sm:mb-3 relative">
              <img 
                src={face.image} 
                alt={face.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://via.placeholder.com/150?text=Face+Image";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-70"></div>
            </div>
            <div className="face-card-indicator">
              <span>👆</span>
            </div>
            <h4 className="font-medium text-sm sm:text-base">{face.name}</h4>
            <p className="text-xs sm:text-sm text-gray-600">{face.description}</p>
            <div className="mt-2 text-xs text-blue-600 flex items-center">
              <span>Click to test</span>
              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        ))}
      </div>
      
      {selectedSampleFace && (
        <div className={`p-3 sm:p-4 rounded-lg ${
          isProcessing ? 'bg-blue-50' : 
          verificationResult?.success ? 'bg-green-50' : 
          verificationResult !== null ? 'bg-red-50' : 'bg-gray-50'
        }`}>
          <div className="flex items-center mb-2">
            <div className={`w-3 h-3 rounded-full mr-2 ${
              isProcessing ? 'bg-blue-500' : 
              verificationResult?.success ? 'bg-green-500' : 
              verificationResult !== null ? 'bg-red-500' : 'bg-gray-500'
            }`}></div>
            <span className="font-medium text-sm sm:text-base">
              {isProcessing ? 'Processing...' : 
               verificationResult?.success ? 'Access Granted' : 
               verificationResult !== null ? 'Access Denied' : 'Select a face'}
            </span>
          </div>
          {statusMessage && <p className="text-xs sm:text-sm">{statusMessage}</p>}
          {verificationResult?.similarity !== undefined && (
            <p className="text-xs text-gray-600 mt-1">
              Match confidence: {(verificationResult.similarity * 100).toFixed(1)}%
            </p>
          )}
        </div>
      )}
    </div>
  );
  
  // Render privacy concerns section
  const renderPrivacyConcerns = () => (
    <div className="bg-blue-50 rounded-lg p-4 sm:p-6 mx-auto">
      <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Privacy & Ethical Considerations</h3>
      
      <div className="space-y-3 sm:space-y-4">
        <div>
          <h4 className="font-medium text-blue-800 text-sm sm:text-base">Data Storage</h4>
          <p className="text-gray-700 text-xs sm:text-sm">
            In this demo, all facial data is stored locally in your browser and is never transmitted to external servers.
            In real-world applications, facial data should be encrypted and stored securely.
          </p>
        </div>
        
        <div>
          <h4 className="font-medium text-blue-800 text-sm sm:text-base">Consent & Transparency</h4>
          <p className="text-gray-700 text-xs sm:text-sm">
            Ethical facial recognition systems should always require explicit user consent before collecting facial data
            and provide clear information about how the data will be used, stored, and potentially shared.
          </p>
        </div>
        
        <div>
          <h4 className="font-medium text-blue-800 text-sm sm:text-base">Potential Biases</h4>
          <p className="text-gray-700 text-xs sm:text-sm">
            Facial recognition technologies may exhibit biases based on factors like skin tone, gender, and age. 
            Responsible development requires diverse training data and regular auditing for fairness.
          </p>
        </div>
        
        <div>
          <h4 className="font-medium text-blue-800 text-sm sm:text-base">Limited Application</h4>
          <p className="text-gray-700 text-xs sm:text-sm">
            This technology should be applied judiciously, with consideration for both security needs and privacy rights.
            Not all scenarios warrant the use of biometric identification.
          </p>
        </div>
      </div>
    </div>
  );

  // ---------- EDUCATIONAL COMPONENTS ----------
  // Render facial recognition explainer
  const renderExplainer = () => (
    <div className="mb-8 border-b pb-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Understanding Facial Recognition</h2>
        <p className="text-gray-600">
          Learn how facial recognition works and its applications in modern technology.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {FACIAL_RECOGNITION_EXPLAINER.map((section, index) => (
          <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                {section.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{section.title}</h3>
            </div>
            <p className="text-gray-600 text-sm">{section.content}</p>
          </div>
        ))}
      </div>
      
      {/* Real-world applications section */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Real-World Applications</h3>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {REAL_WORLD_APPLICATIONS.map((app, index) => (
              <div key={index} className="bg-white rounded p-3 shadow-sm">
                <h4 className="font-medium text-blue-700 mb-1">{app.title}</h4>
                <p className="text-sm text-gray-600">{app.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Technology timeline section */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Evolution of Facial Recognition</h3>
        <div className="relative border-l-2 border-blue-400 pl-4 ml-4">
          {TECHNOLOGY_TIMELINE.map((item, index) => (
            <div key={index} className="mb-6 relative">
              <div className="absolute -left-6 top-0 w-4 h-4 rounded-full bg-blue-500"></div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <h4 className="text-blue-700 font-bold">{item.year}</h4>
                <p className="text-sm text-gray-700">{item.development}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Accuracy metrics section */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">{ACCURACY_METRICS.title}</h3>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ACCURACY_METRICS.metrics.map((metric, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-700">{metric.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{metric.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="bg-blue-50 p-3 text-sm text-blue-800">
            <p><strong>Note:</strong> {ACCURACY_METRICS.note}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Sample Face Comparisons</h3>
        
        <div className="mb-4">
          <h4 className="text-lg font-medium text-gray-700 mb-2">Positive Matches (Same Person)</h4>
          {SAMPLE_FACES.positiveMatches.map(face => (
            <div key={face.id} className="comparison-container comparison-match mb-3 flex">
              <div className="p-3 flex gap-2">
                <img src={face.image1} alt={face.name} className="comparison-image" />
                <img src={face.image2} alt={face.name} className="comparison-image" />
              </div>
              <div className="comparison-details">
                <span className="comparison-result match-badge">Match: {(face.similarity * 100).toFixed(0)}%</span>
                <h5 className="font-medium text-gray-800">{face.name}</h5>
                <p className="text-sm text-gray-600">
                  These images show the same person in different conditions, and the algorithm correctly identifies them as the same individual.
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div>
          <h4 className="text-lg font-medium text-gray-700 mb-2">Negative Matches (Different People)</h4>
          {SAMPLE_FACES.negativeMatches.map(face => (
            <div key={face.id} className="comparison-container comparison-no-match mb-3 flex">
              <div className="p-3 flex gap-2">
                <img src={face.image1} alt={face.name1} className="comparison-image" />
                <img src={face.image2} alt={face.name2} className="comparison-image" />
              </div>
              <div className="comparison-details">
                <span className="comparison-result no-match-badge">No Match: {(face.similarity * 100).toFixed(0)}%</span>
                <h5 className="font-medium text-gray-800">{face.name1} vs {face.name2}</h5>
                <p className="text-sm text-gray-600">
                  These images show different people, and the algorithm correctly determines they are not the same person.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <button 
        onClick={() => setShowExplainer(false)}
        className="mt-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
      >
        Hide Explainer
      </button>
    </div>
  );

  // ---------- CAMERA MANAGEMENT ----------
  // Start camera
  const startCamera = async () => {
    try {
      // Clean up first
      stopCamera();
      
      setIsCameraActive(true);
      setProcessingMessage('Accessing camera...');
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });
      
      // Store stream reference for cleanup
      streamRef.current = stream;
      
      // Connect to video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(e => {
          console.error('Error playing video:', e);
          // For browsers that require user interaction
          setProcessingMessage('Click "Play" to start camera');
        });
      }
      
      setProcessingMessage('');
    } catch (error) {
      console.error('Error starting camera:', error);
      setProcessingMessage(`Camera error: ${error instanceof Error ? error.message : 'Could not access camera'}`);
      setIsCameraActive(false);
    }
  };
  
  // Stop camera
  const stopCamera = () => {
    // Stop tracks from stream reference
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    // Also check video element
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    setIsCameraActive(false);
  };
  
  // Capture photo from camera
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) {
      setProcessingMessage('Camera not ready');
      return null;
    }
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) {
      setProcessingMessage('Could not get canvas context');
      return null;
    }
    
    // Set canvas dimensions to match video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get data URL
    const dataUrl = canvas.toDataURL('image/jpeg');
    setCapturedImage(dataUrl);
    
    return dataUrl;
  };

  // ---------- IMAGE PROCESSING ----------
  // Simplified image comparison
  // Instead of extracting face descriptors with neural networks,
  // we use a basic approach that always succeeds for demo purposes
  const compareImages = async (image1: string, image2: string): Promise<number> => {
    return new Promise((resolve) => {
      // Simulate a processing delay for better UX
      setTimeout(() => {
        // For demo purposes, always return a high similarity score 
        // between 0.85 and 0.98 to simulate a successful match
        const randomSimilarity = 0.85 + Math.random() * 0.13;
        resolve(randomSimilarity);
      }, 2000); // 2 second delay for processing simulation
    });
  };

  // ---------- USER ACTIONS ----------
  // Register face
  const handleRegisterFace = async () => {
    try {
      setStep('processing');
      setProcessingMessage('Processing face...');
      setIsProcessing(true);
      
      // Ensure we have captured an image and username
      if (!capturedImage) {
        throw new Error('No face image captured');
      }
      
      if (!userName.trim()) {
        throw new Error('Please enter your name');
      }
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save face data to localStorage
      const faceData = {
        imageUrl: capturedImage,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('simpleFaceId_faceData', JSON.stringify(faceData));
      localStorage.setItem('simpleFaceId_userName', userName);
      
      // Update state
      setIsRegistered(true);
      setRegisteredUser(userName);
      
      // Show success
      setVerificationResult({
        success: true,
        message: 'Face registered successfully!'
      });
      
      setStep('result');
    } catch (error) {
      console.error('Registration error:', error);
      setVerificationResult({
        success: false,
        message: `Registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
      setStep('result');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Verify face
  const handleVerifyFace = async () => {
    try {
      setStep('processing');
      setProcessingMessage('Verifying identity...');
      setIsProcessing(true);
      
      if (!capturedImage) {
        throw new Error('No face image captured');
      }
      
      if (!isRegistered) {
        throw new Error('No registered face found. Please register first.');
      }
      
      // Get stored face data
      const storedFaceDataString = localStorage.getItem('simpleFaceId_faceData');
      const storedName = localStorage.getItem('simpleFaceId_userName');
      
      if (!storedFaceDataString || !storedName) {
        throw new Error('Saved face data is corrupted. Please register again.');
      }
      
      // Parse stored data
      const storedFaceData = JSON.parse(storedFaceDataString);
      
      // Compare the current image with the registered one
      const similarity = await compareImages(capturedImage, storedFaceData.imageUrl);
      
      // Threshold for match
      const threshold = 0.7;
      
      if (similarity >= threshold) {
        // Success - mark challenge as completed
        setIsCompleted(true);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        
        setVerificationResult({
          success: true,
          message: 'Authentication successful!',
          similarity: similarity
        });
      } else {
        setVerificationResult({
          success: false,
          message: `Authentication failed: Face does not match (${(similarity * 100).toFixed(1)}% similarity)`,
          similarity: similarity
        });
      }
      
      setStep('result');
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationResult({
        success: false,
        message: `Verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
      setStep('result');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Clear registration
  const handleClearRegistration = () => {
    localStorage.removeItem('simpleFaceId_faceData');
    localStorage.removeItem('simpleFaceId_userName');
    setIsRegistered(false);
    setRegisteredUser('');
    setVerificationResult(null);
    setMode('idle');
    setStep('intro');
  };
  
  // Handle mode selection
  const handleModeSelect = (selectedMode: 'register' | 'verify') => {
    setMode(selectedMode);
    setStep('intro');
    setVerificationResult(null);
    setCapturedImage(null);
    setSelectedSampleFace(null);
  };
  
  // Start over
  const handleStartOver = () => {
    stopCamera();
    setCapturedImage(null);
    setVerificationResult(null);
    setStep('intro');
  };

  // Function to test with a sample face
  const testWithSampleFace = async (face: {name: string, image: string, authorized: boolean, description: string}) => {
    // We don't need to check for models being loaded in this demo
    // since we're just simulating the detection
    
    setSelectedSampleFace(face);
    setIsProcessing(true);
    setStatusMessage("Processing sample face...");
    
    try {
      // Simulate a delay to show processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Set result based on the authorized property
      setVerificationResult({
        success: face.authorized,
        message: face.authorized 
          ? `${face.name} has been verified and granted access.`
          : `${face.name} is not authorized for access.`,
        similarity: face.authorized ? 0.85 : 0.32  // Simulate similarity score
      });
      
      setStatusMessage(face.authorized 
        ? `${face.name} has been verified and granted access.`
        : `${face.name} is not authorized for access.`);
      
      // Mark challenge as completed using the standardized handler
      // This ensures it's properly reflected in the Challenge Hub
      handleCompleteChallenge();
      
    } catch (error) {
      console.error("Error testing sample face:", error);
      setErrorMessage("Failed to process sample face. Please try again.");
      setVerificationResult(null);
    } finally {
      setIsProcessing(false);
    }
  };

  // ---------- RENDER FUNCTIONS ----------
  // Render welcome screen
  const renderWelcome = () => (
    <div>
      <div className="text-center mx-auto mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Face ID Challenge</h2>
        
        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
          
          <button
            onClick={() => setShowExplainer(true)}
            className="w-full py-3 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 rounded-lg font-medium transition-colors flex items-center justify-center text-sm sm:text-base"
          >
            <Info className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            Learn About Facial Recognition
          </button>
        </div>
        
        {isRegistered && (
          <button
            onClick={handleClearRegistration}
            className="text-red-600 hover:text-red-700 text-xs sm:text-sm underline py-2"
          >
            Clear Registration
          </button>
        )}
      </div>
      
      {/* Sample Face Testing Section */}
      {renderSampleFaceTest()}
      
      {/* Privacy Concerns Section */}
      {renderPrivacyConcerns()}
    </div>
  );
  
  // Render registration intro
  const renderRegisterIntro = () => (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Register Your Face</h2>
      
      <div className="mb-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <User className="h-12 w-12 text-blue-500 mx-auto mb-4" />
        
        <div className="mb-4">
          <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
            Your Name
          </label>
          <input
            type="text"
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter your name"
          />
        </div>
        
        <button
          onClick={() => {
            setStep('camera');
            startCamera();
          }}
          disabled={!userName.trim()}
          className={`w-full py-2 ${
            userName.trim()
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          } text-white rounded-md transition-colors`}
        >
          Continue to Camera
        </button>
        
        <div className="mt-4 text-xs text-gray-600 flex items-center justify-center">
          <Shield className="h-3 w-3 mr-1 text-blue-600" />
          Your face data stays on your device
        </div>
      </div>
      
      <button
        onClick={() => setMode('idle')}
        className="text-blue-600 hover:text-blue-800"
      >
        ← Back
      </button>
    </div>
  );
  
  // Render verification intro
  const renderVerifyIntro = () => (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Verify Your Identity</h2>
      
      <div className="mb-6 p-6 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
            <User className="h-6 w-6 text-green-600" />
          </div>
          <div className="text-left">
            <p className="font-medium">{registeredUser}</p>
            <p className="text-sm text-gray-600">Registered User</p>
          </div>
        </div>
        
        <p className="mb-4 text-gray-700">
          We'll compare your face with the registered face to verify your identity.
        </p>
        
        <button
          onClick={() => {
            setStep('camera');
            startCamera();
          }}
          className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
        >
          Continue to Camera
        </button>
      </div>
      
      <button
        onClick={() => setMode('idle')}
        className="text-blue-600 hover:text-blue-800"
      >
        ← Back
      </button>
    </div>
  );
  
  // Render camera
  const renderCamera = () => (
    <div className="max-w-md mx-auto">
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
        {mode === 'register' ? 'Register Your Face' : 'Verify Your Identity'}
      </h2>
      
      <div className="mb-3 sm:mb-4">
        <p className="text-sm sm:text-base text-gray-600">
          {capturedImage
            ? 'Confirm your photo is clear and shows your face'
            : 'Position your face in the frame and take a photo'}
        </p>
      </div>
      
      {processingMessage && (
        <div className="mb-3 sm:mb-4 bg-blue-50 p-2 rounded-md text-blue-700 text-xs sm:text-sm text-center">
          {processingMessage}
        </div>
      )}
      
      {capturedImage ? (
        // Show captured image
        <div className="relative border rounded-lg overflow-hidden bg-black mb-3 sm:mb-4">
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full"
          />
        </div>
      ) : (
        // Show camera
        <div className="relative border rounded-lg overflow-hidden bg-black mb-3 sm:mb-4">
          <video
            ref={videoRef}
            className="w-full"
            autoPlay
            playsInline
            muted
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Face position guide */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="face-scan-circle"></div>
            <div className="scan-line"></div>
          </div>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
        {capturedImage ? (
          // Photo review buttons
          <>
            <button
              onClick={() => {
                mode === 'register' ? handleRegisterFace() : handleVerifyFace();
              }}
              className={`px-4 py-3 sm:py-2 ${
                mode === 'register' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
              } text-white rounded-md flex items-center justify-center text-sm sm:text-base w-full sm:w-auto`}
            >
              <CheckCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              {mode === 'register' ? 'Register Face' : 'Verify Identity'}
            </button>
            
            <button
              onClick={() => {
                setCapturedImage(null);
                startCamera(); // Restart camera
              }}
              className="px-4 py-3 sm:py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md flex items-center justify-center text-sm sm:text-base w-full sm:w-auto"
            >
              <RefreshCw className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Retake Photo
            </button>
          </>
        ) : (
          // Camera buttons
          <>
            <button
              onClick={capturePhoto}
              className="px-4 py-3 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center justify-center text-sm sm:text-base w-full sm:w-auto"
              disabled={!isCameraActive}
            >
              <Camera className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Take Photo
            </button>
            
            <button
              onClick={() => {
                stopCamera();
                setStep('intro');
              }}
              className="px-4 py-3 sm:py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md flex items-center justify-center text-sm sm:text-base w-full sm:w-auto"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
  
  // Render processing
  const renderProcessing = () => (
    <div className="max-w-md mx-auto text-center">
      <div className="py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-lg">{processingMessage || 'Processing...'}</p>
      </div>
    </div>
  );
  
  // Render results
  const renderResult = () => {
    if (!verificationResult) return null;
    
    return (
      <div className="max-w-md mx-auto">
        <div className={`p-4 sm:p-6 border rounded-lg ${
          verificationResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-start">
            <div className={`rounded-full p-2 mr-3 sm:mr-4 ${
              verificationResult.success ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}>
              {verificationResult.success ? <CheckCircle size={20} /> : <XCircle size={20} />}
            </div>
            
            <div>
              <h3 className={`text-base sm:text-lg font-medium ${
                verificationResult.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {verificationResult.success ? 'Success!' : 'Failed'}
              </h3>
              
              <p className="text-sm sm:text-base text-gray-700 mt-1">
                {verificationResult.message}
              </p>
              
              {verificationResult.similarity !== undefined && (
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Match confidence: {(verificationResult.similarity * 100).toFixed(1)}%
                </p>
              )}
              
              <div className="mt-3 sm:mt-4 space-y-2">
                <button
                  onClick={() => {
                    if (mode === 'register' && verificationResult.success) {
                      setMode('verify'); // Switch to verify mode after successful registration
                      setStep('intro');
                    } else {
                      handleStartOver();
                    }
                  }}
                  className="w-full sm:w-auto px-4 py-3 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm sm:text-base"
                >
                  {mode === 'register' && verificationResult.success 
                    ? 'Continue to Verification' 
                    : 'Try Again'}
                </button>
                
                {verificationResult.success && mode === 'verify' && (
                  <div className="mt-3 p-3 bg-indigo-50 border border-indigo-100 rounded-md">
                    <p className="text-xs sm:text-sm text-indigo-800 mb-2">
                      <strong>Congratulations!</strong> You've completed the Face ID Challenge.
                    </p>
                    <button
                      onClick={() => {
                        setMode('idle');
                        setStep('intro');
                        setShowExplainer(true);
                      }}
                      className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-800 underline flex items-center"
                    >
                      <Info className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      Learn more about how facial recognition works
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <button
            onClick={() => setMode('idle')}
            className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm py-2"
          >
            ← Back to Main Menu
          </button>
        </div>
      </div>
    );
  };
  
  // ---------- MAIN RENDER ----------
  return (
    <div className="max-w-3xl mx-auto p-2 sm:p-4">
      {/* Show confetti animation when challenge is completed */}
      {showConfetti && <Confetti active={showConfetti} />}
      
      <ChallengeHeader
        title="Face ID Challenge"
        icon={<User className="h-6 w-6 text-blue-600" />}
        challengeId={challengeId}
        isCompleted={isCompleted}
        setIsCompleted={setIsCompleted}
        showConfetti={showConfetti}
        setShowConfetti={setShowConfetti}
        onCompleteChallenge={handleCompleteChallenge}
      />
      
      <div className="bg-blue-50 border-l-4 border-blue-500 p-3 sm:p-4 mb-3 sm:mb-4 rounded-r-md">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-blue-800 mb-1">About This Challenge</h2>
            <p className="text-sm sm:text-base text-blue-700">
              Experience how facial recognition works by registering your face and then verifying your identity. 
              This challenge demonstrates the principles behind facial authentication systems used in modern 
              smartphones and security applications.
            </p>
          </div>
          <button 
            onClick={() => setShowExplainer(!showExplainer)}
            className="mt-2 sm:mt-0 sm:ml-4 px-3 py-2 flex items-center justify-center text-sm font-medium rounded-md bg-white border border-blue-300 text-blue-600 hover:bg-blue-50"
          >
            <Info className="h-4 w-4 mr-1" />
            {showExplainer ? 'Hide Educational Content' : 'Show Educational Content'}
          </button>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-3 sm:p-6">
        {/* Show educational explainer if enabled */}
        {showExplainer && renderExplainer()}
        
        {/* Main content based on current state */}
        {!showExplainer && (
          <>
            {mode === 'idle' && renderWelcome()}
            
            {mode === 'register' && (
              <>
                {step === 'intro' && renderRegisterIntro()}
                {step === 'camera' && renderCamera()}
                {step === 'processing' && renderProcessing()}
                {step === 'result' && renderResult()}
              </>
            )}
            
            {mode === 'verify' && (
              <>
                {step === 'intro' && renderVerifyIntro()}
                {step === 'camera' && renderCamera()}
                {step === 'processing' && renderProcessing()}
                {step === 'result' && renderResult()}
              </>
            )}
          </>
        )}
        
        {/* Loading overlay */}
        {isProcessing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg text-center max-w-xs sm:max-w-sm mx-4">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-blue-600 mx-auto mb-3 sm:mb-4"></div>
              <p className="text-base sm:text-lg font-medium">{processingMessage || 'Processing...'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleFaceId; 