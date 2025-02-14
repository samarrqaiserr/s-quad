import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ContestantDashboard = () => {
  const [competitions, setCompetitions] = useState([]);
  const [profile, setProfile] = useState({});
  const [newProfile, setNewProfile] = useState({
    songPreferences: '',
    performanceDetails: '',
  });

  useEffect(() => {
    // Fetch available competitions
    axios.get('/api/competitions').then((response) => {
      setCompetitions(response.data);
    });

    // Fetch contestant profile
    axios.get('/api/profile').then((response) => {
      setProfile(response.data);
    });
  }, []);

  const handleApply = (competitionNumber) => {
    axios
      .post('/api/apply', {
        competitionNumber,
        userId: profile._id,
      })
      .then((response) => {
        alert('Applied successfully!');
      })
      .catch((error) => {
        alert('Error applying');
      });
  };

  const handleProfileUpdate = () => {
    axios
      .put('/api/profile', newProfile)
      .then((response) => {
        setProfile(response.data);
        alert('Profile updated successfully!');
      })
      .catch((error) => {
        alert('Error updating profile');
      });
  };

  return (
    <div>
      <h1>Contestant Dashboard</h1>
      
      <div>
        <h2>Your Profile</h2>
        <p>Song Preferences: {profile.songPreferences}</p>
        <p>Performance Details: {profile.performanceDetails}</p>
        
        <input
          type="text"
          value={newProfile.songPreferences}
          onChange={(e) => setNewProfile({ ...newProfile, songPreferences: e.target.value })}
          placeholder="Update song preferences"
        />
        <input
          type="text"
          value={newProfile.performanceDetails}
          onChange={(e) => setNewProfile({ ...newProfile, performanceDetails: e.target.value })}
          placeholder="Update performance details"
        />
        <button onClick={handleProfileUpdate}>Update Profile</button>
      </div>

      <div>
        <h2>Available Competitions</h2>
        {competitions.map((competition) => (
          <div key={competition._id}>
            <p>{competition.details}</p>
            <p>Deadline: {new Date(competition.deadline).toLocaleDateString()}</p>
            <button onClick={() => handleApply(competition.competitionNumber)}>Apply</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContestantDashboard;
