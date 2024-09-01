import React from 'react';
import Image from 'next/image';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">About IceBrAIker</h1>
      
      <div className="mb-8 text-center">
        <Image
          src="/images/icebreaker-logo.png"
          alt="IceBrAIker Logo"
          width={200}
          height={200}
          className="mx-auto rounded-full shadow-lg"
        />
      </div>

      <p className="mb-6 text-lg">
        IceBrAIker is an innovative tool that uses AI to analyze LinkedIn profiles and generate
        insightful ice breakers, making networking easier and more effective.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-blue-100 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p>
            To help professionals connect more meaningfully by providing personalized
            conversation starters based on a person's professional background and interests.
          </p>
        </div>
        <div className="bg-green-100 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <ol className="list-decimal list-inside">
            <li>Enter a person's name</li>
            <li>Our AI analyzes their LinkedIn profile</li>
            <li>Receive tailored ice breakers and insights</li>
            <li>Connect with confidence!</li>
          </ol>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Start Breaking the Ice Today!</h2>
        <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          Try IceBrAIker Now
        </button>
      </div>
    </div>
  );
};

export default About;