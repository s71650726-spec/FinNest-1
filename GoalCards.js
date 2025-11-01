import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api';

function GoalCards({ socket }) {
  const [goals, setGoals] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/investments/goals`);
      setGoals(res.data);
      setCurrentIndex(0);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch goals', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();

    if (socket) {
      socket.on('goalUpdated', fetchGoals);
    }
    return () => {
      if (socket) {
        socket.off('goalUpdated', fetchGoals);
      }
    };
  }, [socket]);

  const swipeLeft = () => {
    setCurrentIndex((idx) => (idx + 1) % goals.length);
  };

  const swipeRight = () => {
    setCurrentIndex((idx) => (idx - 1 + goals.length) % goals.length);
  };

  if (loading) {
    return <div className="text-white text-center">Loading goals...</div>;
  }

  if (goals.length === 0) {
    return <div className="text-white text-center">No investment goals found.</div>;
  }

  const currentGoal = goals[currentIndex];
  const progressPercent = currentGoal.targetAmount > 0 ? (currentGoal.currentAmount / currentGoal.targetAmount) * 100 : 0;

  return (
    <div className="max-w-md mx-auto glass-effect p-6 rounded-lg shadow-lg relative">
      <AnimatePresence>
        <motion.div
          key={currentGoal.id}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-semibold">{currentGoal.title}</h2>
          <p>{currentGoal.description || 'No description provided.'}</p>
          <div className="w-full bg-gray-700 rounded-full h-6">
            <motion.div
              className="bg-primary h-6 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progressPercent, 100)}%` }}
              aria-label={`${progressPercent.toFixed(1)}% progress`}
            />
          </div>
          <p>
            ₹{currentGoal.currentAmount} / ₹{currentGoal.targetAmount} (Deadline: {currentGoal.deadline || 'N/A'})
          </p>
          {currentGoal.aiRecommendedPlan && (
            <div className="bg-white bg-opacity-10 rounded p-3">
              <h3 className="font-semibold mb-2">AI Recommended Plan</h3>
              <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(currentGoal.aiRecommendedPlan, null, 2)}</pre>
            </div>
          )}
          {currentGoal.familyShared && <p className="italic text-sm">This goal is shared with your family.</p>}
        </motion.div>
      </AnimatePresence>
      <button
        type="button"
        onClick={swipeLeft}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-primary rounded-full p-2 text-white hover:bg-blue-700"
        aria-label="Previous Goal"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={swipeRight}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary rounded-full p-2 text-white hover:bg-blue-700"
        aria-label="Next Goal"
      >
        ›
      </button>
    </div>
  );
}

export default GoalCards;
