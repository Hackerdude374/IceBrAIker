import React, { useState, useEffect } from 'react';

interface FlashcardProps {
  title: string;
  content: string | string[];
  isVisible: boolean;
  onComplete: () => void;
  gifUrl: string;
}

const Flashcard: React.FC<FlashcardProps> = ({ title, content, isVisible, onComplete, gifUrl }) => {
  const [progress, setProgress] = useState(90);

  useEffect(() => {
    if (isVisible) {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev <= 0) {
            clearInterval(timer);
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 90);
      return () => clearInterval(timer);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="flex-grow overflow-auto mb-4">
        {Array.isArray(content) ? (
          <ul className="list-disc list-inside">
            {content.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <p>{content}</p>
        )}
      </div>
      <img
        src={gifUrl}
        alt={title}
        className="w-full h-40 object-contain rounded-lg mb-4"
      />
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Flashcard;