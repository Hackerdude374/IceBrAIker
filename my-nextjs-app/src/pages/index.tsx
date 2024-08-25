import React, { useState, useEffect } from 'react';
import { getIceBreakerData } from '../services/api';

const sections = [
  { key: 'summary', title: 'Summary', gifUrl: '/gifs/summary.gif' },
  { key: 'facts', title: 'Interesting Facts', gifUrl: '/gifs/facts.gif' },
  { key: 'ice_breakers', title: 'Ice Breakers', gifUrl: '/gifs/ice_breakers.gif' },
  { key: 'topics', title: 'Topics of Interest', gifUrl: '/gifs/topics.gif' },
  { key: 'traits', title: 'Personality Traits', gifUrl: '/gifs/traits.gif' },
  { key: 'skills', title: 'Technical Skills', gifUrl: '/gifs/skills.webp' },
];
  // @ts-ignore
const Flashcard = ({ title, content, isVisible, onComplete, gifUrl }) => {
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
        className="w-full h-40 object-contain rounded-lg mb-4" // or use object-scale-down
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

const Home = () => {
  const [name, setName] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [showGrid, setShowGrid] = useState(false);
  // @ts-ignore
  const handleSubmit = async (e) => {
      // @ts-ignore
    e.preventDefault();
    setLoading(true);
    setData(null);
    setError(null);
    setCurrentSection(0);
    setShowGrid(false);
  // @ts-ignore
    try {
      const result = await getIceBreakerData(name);
      setData(result);
        // @ts-ignore
    } catch (error) {
      console.error('Error fetching data:', error);
        // @ts-ignore
      setError('An error occurred while fetching data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFlashcardComplete = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      setShowGrid(true);
    }
  };
    // @ts-ignore

  const renderContent = (key) => {
      // @ts-ignore
    switch (key) {
      case 'summary':
          // @ts-ignore
        return data?.summary_and_facts?.summary;
      case 'facts':
          // @ts-ignore
        return data?.summary_and_facts?.facts;
      case 'ice_breakers':
          // @ts-ignore
        return data?.ice_breakers?.ice_breakers;
      case 'topics':
          // @ts-ignore
        return data?.interests?.topics_of_interest;
      case 'traits':
          // @ts-ignore
        return data?.traits_and_skills?.personality_traits;
      case 'skills':
          // @ts-ignore
        return data?.traits_and_skills?.technical_skills;
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8">IceBrAIker 🧊</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md mb-8"
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
          className="border border-gray-300 p-2 w-full rounded mb-4"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-600"
        >
          Do Your Magic
        </button>
      </form>

      {loading && (
        <div className="mt-8 flex justify-center items-center">
          <div className="spinner"></div>
        </div>
      )}

      {error && (
        <div className="mt-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

{data && (
  <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
    {/* @ts-ignore */}
    <img src={data.picture_url} alt="Profile" className="w-full h-full object-cover" />
  </div>
)}


      {data && !showGrid && (
        <div className="w-full max-w-2xl h-96">
          {sections.map((section, index) => (
            <Flashcard
              key={section.key}
              title={section.title}
              content={renderContent(section.key)}
              isVisible={currentSection === index}
              onComplete={handleFlashcardComplete}
              gifUrl={section.gifUrl}
            />
          ))}
        </div>
      )}

      {showGrid && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {sections.map((section) => (
            <div key={section.key} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
              <div className="max-h-48 overflow-y-auto mb-4">
                {Array.isArray(renderContent(section.key)) ? (
                  <ul className="list-disc list-inside">
                    {renderContent(section.key).map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{renderContent(section.key)}</p>
                )}
              </div>
              <img
                src={section.gifUrl}
                alt={section.title}
                className="w-full h-40 object-contain rounded-lg"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
