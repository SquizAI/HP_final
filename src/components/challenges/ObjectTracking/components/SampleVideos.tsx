import React, { useState } from 'react';
import { AlertCircle, Video } from 'lucide-react';

interface SampleVideoProps {
  onSelectVideo: (url: string) => void;
}

// Ultra-reliable tiny sample video as base64
const tinyVideoBase64 = "data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAAu1tZGF0AAACrQYF//+13EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE2NCByMzA5NSBiYWFlMjQzIC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAyMiAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTMgZGVibG9jaz0xOjA6MCBhbmFseXNlPTB4MzoweDExMyBtZT1oZXggc3VibWU9NyBwc3k9MSBwc3lfcmQ9MS4wMDowLjAwIG1peGVkX3JlZj0xIG1lX3JhbmdlPTE2IGNocm9tYV9tZT0xIHRyZWxsaXM9MSA4eDhkY3Q9MSBjcW09MCBkZWFkem9uZT0yMSwxMSBmYXN0X3Bza2lwPTEgY2hyb21hX3FwX29mZnNldD0tMiB0aHJlYWRzPTMgbG9va2FoZWFkX3RocmVhZHM9MSBzbGljZWRfdGhyZWFkcz0wIG5yPTAgZGVjaW1hdGU9MSBpbnRlcmxhY2VkPTAgYmx1cmF5X2NvbXBhdD0wIGNvbnN0cmFpbmVkX2ludHJhPTAgYmZyYW1lcz0zIGJfcHlyYW1pZD0yIGJfYWRhcHQ9MSBiX2JpYXM9MCBkaXJlY3Q9MSB3ZWlnaHRiPTEgb3Blbl9nb3A9MCB3ZWlnaHRwPTIga2V5aW50PTI1MCBrZXlpbnRfbWluPTEgc2NlbmVjdXQ9NDAgaW50cmFfcmVmcmVzaD0wIHJjX2xvb2thaGVhZD00MCByYz1jcmYgbWJ0cmVlPTEgY3JmPTI4LjAgcWNvbXA9MC42MCBxcG1pbj0wIHFwbWF4PTY5IHFwc3RlcD00IGlwX3JhdGlvPTEuNDAgYXE9MToxLjAwAIAAAAAwZYiEAD//8m+P5OXfBeLGOfKN4ASxi/BUIBH1DNgxjVJZ6J5qeg6SgAAAwAADJHRnJ+hAA/0qMPB5Y5OfI1TgAR8WUAQ8v5HQS6LxQw1CpWxsAHy/RGIf9fP7u5dAAE9cOF3fYiLx1S+RAAAM2Vz3IZVzZvs1KAAAAAZBmiRYQn/98QABWYmR5YlKLYx6Hx1UAAAADABhPRUSHQAADmyGaJFhCf/3xAAFZi5nmqWZxqaXZ9FPUgAAAAwCHI7RCgAAA7JBmiRYQn/98QABWYqUgmdzvcZnyhiAAAAMAkS3hgQAAARqQZokWEJ//fEAAVmLpKcDfTY5Z4cqAAAADAPVlNTkAAAEoEAQZokWEJ//fEAAVmQF+nYMcf9EwLJqjW0mCBKQXSAZhBRfgL+uAAAADAKgC3YgAAAAEAGG9FRIdAAAObYZokWEJ//fEAAVmLmiQnjFwbRYqAAAAMAACcvQBgAAAARoQZokWEJ//fEAAVmQLUi1jGvNQsUMAAAAMAACcvQBgAAAARABhvRUSHQAAA5thmiRYQn/98QABWYuaJCa+9V9WXHBgAAAAwAAJy9AGAAAABGhBmiRYQn/98QABWZAvSLWMa81CxQwAAAAMAABGXoAwAAAAEQAYb0VEh0AAAObYZokWEJ//fEAAVmKpLOodF18tDIAAAAMAACcvQBgAAAARoQZokWEJ//fEAAVmQLUi1jGvNQsUMAAAAMAACcvQBgAAAARABhvRUSHQAAA5thmiRYQn/98QABWYqks6h0XXy0MgAAAAwAAJy9AGAAAABGhBmiRYQn/98QABWZAvSLWMa81CxQwAAAAMAABGXoAwAAAAEQAYb0VEh0AAAObYZokWEJ//fEAAVmKpLOodF18tDIAAAAMAACMvQBgAAAARoQZokWEJ//fEAAVmQLUi1jGvNQsUMAAAAMAACcvQBgAAAARABhvRUSHQAAA5thmiRYQn/98QABWYqks6h0XXy0MgAAAAwAAEZegDAAAAASg==";

// Add our sample video file path
const sampleHDVideo = "/samples/13283447_3840_2160_30fps.mp4";

// Reliable sample video URLs that can be loaded directly from public domains
const sampleVideoCategories = [
  {
    id: "webcam",
    title: "Live Webcam Tracking",
    description: "Use your webcam for real-time object tracking",
    icon: "camera"
  },
  {
    id: "hd-video",
    title: "HD Urban Scene",
    description: "Track vehicles and pedestrians in a high-definition urban scene",
    icon: "video"
  },
  {
    id: "demo-video",
    title: "Simple Demo Video",
    description: "Use a lightweight demo video for testing",
    icon: "video"
  }
];

const SampleVideos: React.FC<SampleVideoProps> = ({ onSelectVideo }) => {
  const handleSelectCategory = (id: string) => {
    if (id === "webcam") {
      // Signal to use webcam instead - this will be handled in the parent component
      onSelectVideo("WEBCAM");
    } else if (id === "hd-video") {
      // Use the HD sample video
      onSelectVideo(sampleHDVideo);
    } else {
      // Use our ultra-reliable base64 video
      onSelectVideo(tinyVideoBase64);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="bg-yellow-50 p-3 rounded-md">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
          <p className="text-sm text-yellow-700">
            <strong>Note:</strong> For the most reliable tracking experience, we recommend using either the HD Urban Scene 
            video or your webcam for real-time tracking.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {sampleVideoCategories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
            onClick={() => handleSelectCategory(category.id)}
          >
            <div className="p-4 flex items-center">
              <div className="bg-indigo-100 rounded-full p-3 mr-3">
                {category.icon === "camera" ? (
                  <Video className="h-6 w-6 text-indigo-600" />
                ) : (
                  <Video className="h-6 w-6 text-indigo-600" />
                )}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{category.title}</h3>
                <p className="text-sm text-gray-500">{category.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-2 bg-blue-50 p-3 rounded-md">
        <p className="text-sm text-blue-700">
          <strong>Tip:</strong> For best tracking results, ensure the objects you want to track are clearly visible
          and moving at a moderate speed. The system can track people, vehicles, and other common objects.
        </p>
      </div>
    </div>
  );
};

export default SampleVideos; 