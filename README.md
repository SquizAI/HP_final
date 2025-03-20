# HP AI Challenge

A Duolingo-style learning platform for AI workplace skills, featuring interactive challenges that teach practical AI applications.

## Features

- Interactive AI challenges with step-by-step guidance
- Real-time AI responses using OpenAI's GPT-4o model
- Focused interface without user profiles or progress tracking
- Mobile-responsive design

## Challenges

### ServicePro Challenge

The ServicePro challenge focuses on optimizing IT service management using AI. Users learn to:

- Prioritize IT service tickets based on impact, urgency, and affected users
- Apply AI tools to optimize resolution time and accuracy
- Analyze performance metrics to improve service delivery

### Trend Spotter Challenge

The Trend Spotter challenge teaches users to identify emerging trends and business opportunities using AI. Users learn to:

- Choose a business topic and discover emerging trends using GPT-4o
- Analyze how businesses can capitalize on these trends
- Evaluate which trend could have the most significant impact
- Provide strategic justification for their selection

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- OpenAI API key (for the Trend Spotter challenge)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/hp-ai-challenge.git
cd hp-ai-challenge
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
   - Copy the `.env.example` file to `.env`
   - Add your OpenAI API key to the `.env` file
```bash
cp .env.example .env
# Edit the .env file to add your API key:
# VITE_OPENAI_API_KEY=your_openai_api_key_here
```

4. Start the development server
```bash
npm run dev
```

5. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

## API Configuration

This application uses several AI services that require API keys. Here's how to obtain them:

### OpenAI API Key
The Trend Spotter challenge uses OpenAI's GPT-4o model to provide real-time trend analysis.
Get your key at: https://platform.openai.com/api-keys

### ElevenLabs API Key
Used for voice generation capabilities.
Get your key at: https://elevenlabs.io/app/api-key

### Fal.ai API Key
Used for image generation features.
Get your key at: https://www.fal.ai/dashboard/keys

### Deepgram API Key
Used for speech recognition capabilities.
Get your key at: https://console.deepgram.com/signup

### Gemini API Key
Used for accessing Google's Gemini AI model.
Get your key at: https://aistudio.google.com/app/apikey

After obtaining your keys, add them to the `.env` file as shown in the `.env.example` file.

**Note:** If you don't provide an API key for a particular service, the related challenges will fall back to using pre-defined sample responses when possible.

## Tech Stack

- React 18 with TypeScript
- Tailwind CSS for styling
- React Router v6 for navigation
- Vite for fast development and optimized builds
- OpenAI API for AI capabilities

## Project Structure

```
src/
├── components/           # UI components
│   ├── challenges/       # Challenge components
│   ├── layout/           # Layout components
│   └── hub/              # Challenge hub components
├── services/             # API services
├── types/                # TypeScript interfaces
├── styles/               # Global styling
└── App.tsx               # Main application component
```

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
