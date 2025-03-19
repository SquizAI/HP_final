// Emotion types and constants

// Map of emotions to emojis
export const EMOTION_EMOJIS: Record<string, { emoji: string, color: string, description: string }> = {
  'neutral': { 
    emoji: '😐', 
    color: '#A0AEC0',
    description: 'No strong emotion detected'
  },
  'happy': { 
    emoji: '😄', 
    color: '#48BB78',
    description: 'Joy and happiness detected'
  },
  'sad': { 
    emoji: '😢', 
    color: '#4299E1',
    description: 'Sadness detected'
  },
  'angry': { 
    emoji: '😡', 
    color: '#F56565',
    description: 'Anger detected'
  },
  'fearful': { 
    emoji: '😨', 
    color: '#ED8936',
    description: 'Fear detected'
  },
  'disgusted': { 
    emoji: '🤢', 
    color: '#9AE6B4',
    description: 'Disgust detected'
  },
  'surprised': { 
    emoji: '😲', 
    color: '#9F7AEA',
    description: 'Surprise detected'
  }
};

// Educational content about facial emotion recognition
export const EDUCATIONAL_CONTENT = {
  intro: {
    title: "How AI Recognizes Emotions",
    description: "AI uses computer vision techniques to identify facial expressions and associate them with emotions."
  },
  steps: [
    {
      title: "1. Face Detection",
      description: "First, the AI detects faces in the image by identifying patterns of light and dark that make up facial features.",
      icon: "🔍"
    },
    {
      title: "2. Facial Landmarks",
      description: "Next, it identifies 68 key points on the face (landmarks) such as eyes, eyebrows, nose, mouth, and jaw outline.",
      icon: "📍"
    },
    {
      title: "3. Expression Analysis",
      description: "The AI analyzes the relative positions of these landmarks to identify expressions like smiles, frowns, or raised eyebrows.",
      icon: "🧠"
    },
    {
      title: "4. Emotion Classification",
      description: "Finally, these expressions are classified into emotions based on patterns learned from thousands of labeled examples.",
      icon: "🏷️"
    }
  ],
  facialFeatures: [
    {
      feature: "Eyes",
      description: "Wide eyes often indicate surprise, narrowed eyes may suggest anger or suspicion.",
      icon: "👁️"
    },
    {
      feature: "Eyebrows",
      description: "Raised eyebrows can indicate surprise, while furrowed brows often show concentration or anger.",
      icon: "🤨"
    },
    {
      feature: "Mouth",
      description: "Upturned corners indicate happiness, downturned suggest sadness or disappointment.",
      icon: "👄"
    },
    {
      feature: "Overall Tension",
      description: "Muscle tension in the face can indicate stress, fear, or anger.",
      icon: "😬"
    }
  ]
};

// Declare global interface for face-api
declare global {
  interface Window {
    faceapi: any;
  }
} 