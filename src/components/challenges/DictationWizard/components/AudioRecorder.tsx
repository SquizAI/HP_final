import React, { useState, useRef, useEffect } from 'react';
import { Mic, StopCircle, Upload, Trash2 } from 'lucide-react';

interface AudioRecorderProps {
  onAudioReady: (blob: Blob) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onAudioReady }) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);
  
  // Format recording time
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        setAudioBlob(audioBlob);
        setAudioUrl(audioUrl);
        setIsRecording(false);
        
        // Stop all tracks from the stream
        stream.getTracks().forEach(track => track.stop());
        
        if (timerRef.current) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setError(null);
      
      // Start timer
      setRecordingTime(0);
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError("Could not access your microphone. Please ensure you've granted permission.");
    }
  };
  
  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };
  
  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      if (!file.type.startsWith('audio/')) {
        setError("Please upload an audio file (WAV, MP3, etc.)");
        return;
      }
      
      const reader = new FileReader();
      
      reader.onload = () => {
        const blob = new Blob([reader.result as ArrayBuffer], { type: file.type });
        const url = URL.createObjectURL(blob);
        
        setAudioBlob(blob);
        setAudioUrl(url);
        setError(null);
      };
      
      reader.onerror = () => {
        setError("Error reading the uploaded file");
      };
      
      reader.readAsArrayBuffer(file);
    }
  };
  
  // Clear the current audio
  const clearAudio = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    
    setAudioBlob(null);
    setAudioUrl(null);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Proceed with the selected/recorded audio
  const handleProceed = () => {
    if (audioBlob) {
      onAudioReady(audioBlob);
    } else {
      setError("Please record or upload audio first");
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Step 1: Record or Upload Audio</h2>
      
      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          Record a short audio clip (30 seconds to 1 minute) or upload an existing audio file to get started.
        </p>
        
        {/* Recording controls */}
        {!audioBlob && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`px-6 py-3 rounded-md font-medium flex items-center justify-center ${
                isRecording
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isRecording ? (
                <>
                  <StopCircle size={20} className="mr-2" />
                  Stop Recording ({formatTime(recordingTime)})
                </>
              ) : (
                <>
                  <Mic size={20} className="mr-2" />
                  Start Recording
                </>
              )}
            </button>
            
            <div className="relative">
              <input
                type="file"
                accept="audio/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 flex items-center justify-center"
              >
                <Upload size={20} className="mr-2" />
                Upload Audio
              </button>
            </div>
          </div>
        )}
        
        {/* Audio preview */}
        {audioBlob && audioUrl && (
          <div className="mb-6">
            <div className="bg-gray-100 p-4 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-800">Audio Preview</h3>
                <button
                  onClick={clearAudio}
                  className="p-1 text-gray-600 hover:text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <audio controls className="w-full">
                <source src={audioUrl} type="audio/webm" />
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        {/* Proceed button */}
        {audioBlob && (
          <div className="flex justify-center">
            <button
              onClick={handleProceed}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
            >
              Continue to Transcription
            </button>
          </div>
        )}
      </div>
      
      <div className="bg-blue-50 p-4 rounded-md">
        <h3 className="font-medium text-blue-800 mb-2">Tips for Good Audio</h3>
        <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
          <li>Speak clearly and at a normal pace</li>
          <li>Find a quiet environment to minimize background noise</li>
          <li>Keep the microphone at a consistent distance</li>
          <li>For best results, keep your audio under 1 minute</li>
        </ul>
      </div>
    </div>
  );
};

export default AudioRecorder; 