import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api';

function StatusPanel({ socket }) {
  const [gamification, setGamification] = useState(null);

  const fetchStatus = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/gamification/status`);
      setGamification(res.data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch gamification status', error);
    }
  };

  useEffect(() => {
    fetchStatus();

    if (socket) {
      socket.on('gamificationUpdated', fetchStatus);
    }
    return () => {
      if (socket) {
        socket.off('gamificationUpdated', fetchStatus);
      }
    };
  }, [socket]);

  if (!gamification) {
    return <div className="text-white text-center">Loading gamification status...</div>;
  }

  return (
    <motion.div
      className="glass-effect max-w-md mx-auto p-6 rounded-lg shadow-lg space-y-4"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <h2 className="text-2xl font-semibold">Gamification Status</h2>
      <p>
        <strong>XP Points:</strong> {gamification.xpPoints}
      </p>
      <p>
        <strong>Badges:</strong>{' '}
        {gamification.badges.length > 0 ? gamification.badges.join(', ') : 'No badges earned yet.'}
      </p>
      <p>
        <strong>Current Streak:</strong> {gamification.streakCount} days
      </p>
      <p>
        <strong>Family Leaderboard Rank:</strong>{' '}
        {gamification.familyLeaderboardRank ?? 'Not ranked yet'}
      </p>
    </motion.div>
  );
}

export default StatusPanel;
