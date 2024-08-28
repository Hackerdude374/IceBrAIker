import React, { useState } from 'react';
import useIceBreakerData from '@/hooks/useIceBreakerData';
import Flashcard from '@/components/Flashcard';
import ProfileGrid from '@/components/ProfileGrid';

const sections = [
  { key: 'summary', title: 'Summary', gifUrl: '/gifs/summary.gif' },
  { key: 'facts', title: 'Interesting Facts', gifUrl: '/gifs/facts.gif' },
  { key: 'ice_breakers', title: 'Ice Breakers', gifUrl: '/gifs/ice_breakers.gif' },
  { key: 'topics', title: 'Topics of Interest', gifUrl: '/gifs/topics.gif' },
  { key: 'traits', title: 'Personality Traits', gifUrl: '/gifs/traits.gif' },
  { key: 'skills', title: 'Technical Skills', gifUrl: '/gifs/skills.webp' },
];

const Home: React.FC = () => {
  const [name, setName] = useState('');
  const { data, loading, error, fetchData } = useIceBreakerData();
  const [currentSection, setCurrentSection] = useState(0);
  const [showGrid, setShowGrid] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData(name);
    setCurrentSection(0);
    setShowGrid(false);
  };

  const handleFlashcardComplete = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      setShowGrid(true);
    }
  };

  const renderContent = (key: string) => {
    if (!data) return '';
    switch (key) {
      case 'summary':
        return data.summary_and_facts.summary;
      case 'facts':
        return data.summary_and_facts.facts;
      case 'ice_breakers':
        return data.ice_breakers.ice_breakers;
      case 'topics':
        return data.interests.topics_of_interest;
      case 'traits':
        return data.traits_and_skills.personality_traits;
      case 'skills':
        return data.traits_and_skills.technical_skills;
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">IceBrAIker 🧊</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md mb-8">
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

      {showGrid && data && <ProfileGrid data={data} />}

      {showGrid && (
        <button
          onClick={() => setShowGrid(false)}
          className="mt-8 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Show Flashcards
        </button>
      )}
    </div>
  );
};

export default Home;