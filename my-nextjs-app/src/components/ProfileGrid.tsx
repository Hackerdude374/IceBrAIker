import React from 'react';
import { IceBreakerData } from '../types/iceBreaker';

interface ProfileGridProps {
  data: IceBreakerData;
}

const ProfileGrid: React.FC<ProfileGridProps> = ({ data }) => {
  const sections = [
    { key: 'summary', title: 'Summary', content: data.summary_and_facts.summary, gifUrl: '/gifs/summary.gif' },
    { key: 'facts', title: 'Interesting Facts', content: data.summary_and_facts.facts, gifUrl: '/gifs/facts.gif' },
    { key: 'ice_breakers', title: 'Ice Breakers', content: data.ice_breakers.ice_breakers, gifUrl: '/gifs/ice_breakers.gif' },
    { key: 'topics', title: 'Topics of Interest', content: data.interests.topics_of_interest, gifUrl: '/gifs/topics.gif' },
    { key: 'traits', title: 'Personality Traits', content: data.traits_and_skills.personality_traits, gifUrl: '/gifs/traits.gif' },
    { key: 'skills', title: 'Technical Skills', content: data.traits_and_skills.technical_skills, gifUrl: '/gifs/skills.webp' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
      {sections.map((section) => (
        <div key={section.key} className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
          <div className="max-h-48 overflow-y-auto mb-4">
            {Array.isArray(section.content) ? (
              <ul className="list-disc list-inside">
                {section.content.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>{section.content}</p>
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
  );
};

export default ProfileGrid;