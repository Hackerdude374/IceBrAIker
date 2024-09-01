import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getUserProfile } from '../services/api';
import { UserProfile } from '../types/user';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      if (user) {
        try {
          const profileData = await getUserProfile(user.id);
          setProfile(profileData);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    }
    fetchProfile();
  }, [user]);

  if (!user) {
    return <div className="container mx-auto px-4 py-8">Please log in to view your profile.</div>;
  }

  if (!profile) {
    return <div className="container mx-auto px-4 py-8">Loading profile...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Your Profile</h1>
      <div className="bg-white shadow-md rounded p-6">
        <h2 className="text-xl font-semibold mb-2">{user.name}</h2>
        <p className="text-gray-600 mb-4">{user.email}</p>
        <h3 className="text-lg font-semibold mb-2">Summary</h3>
        <p className="mb-4">{profile.summary}</p>
        <h3 className="text-lg font-semibold mb-2">Skills</h3>
        <ul className="list-disc list-inside mb-4">
          {profile.skills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
        <h3 className="text-lg font-semibold mb-2">Interests</h3>
        <ul className="list-disc list-inside">
          {profile.interests.map((interest, index) => (
            <li key={index}>{interest}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Profile;