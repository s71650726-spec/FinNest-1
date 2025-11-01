import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api';

function Dashboard({ socket }) {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOverview() {
      setLoading(true);
      try {
        // Fetch overview data: transactions summary, AI insights, goals, gamification status
        const resTransactions = await axios.get(`${API_BASE_URL}/bank-sync/transactions?limit=5&page=1`);
        const resAI = await axios.get(`${API_BASE_URL}/ai/expense-forecast`);
        const resGoals = await axios.get(`${API_BASE_URL}/investments/goals`);
        const resGamification = await axios.get(`${API_BASE_URL}/gamification/status`);

        setOverview({
          recentTransactions: resTransactions.data.transactions,
          aiInsights: resAI.data,
          goals: resGoals.data,
          gamification: resGamification.data
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    }
    fetchOverview();

    if (socket) {
      socket.on('transactionUpdated', () => {
        fetchOverview();
      });
      socket.on('gamificationUpdated', () => {
        fetchOverview();
      });
      socket.on('goalUpdated', () => {
        fetchOverview();
      });
    }

    return () => {
      if (socket) {
        socket.off('transactionUpdated');
        socket.off('gamificationUpdated');
        socket.off('goalUpdated');
      }
    };
  }, [socket]);

  if (loading) {
    return <div className="text-center text-white text-xl">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect p-6 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-semibold mb-4">Recent Transactions</h2>
        {overview.recentTransactions.length === 0 ? (
          <p>No recent transactions found.</p>
        ) : (
          <ul className="space-y-2 max-h-48 overflow-y-auto">
            {overview.recentTransactions.map((txn) => (
              <li
                key={txn.id}
                className="flex justify-between bg-white bg-opacity-10 rounded p-2 hover:bg-opacity-20 cursor-pointer"
              >
                <div>
                  <p className="font-semibold">{txn.merchantName}</p>
                  <p className="text-sm text-gray-300">{txn.category || 'Uncategorized'}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{txn.amount}</p>
                  <p className="text-sm text-gray-300">{new Date(txn.transactionDate).toLocaleDateString()}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </motion.section>
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect p-6 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-semibold mb-4">AI Insights</h2>
        <p>Monthly Expense Forecast:</p>
        <ul className="list-disc ml-6 mb-4">
          {overview.aiInsights.monthlyExpenses.map((m) => (
            <li key={m.month}>
              {m.month}: ₹{m.amount}
            </li>
          ))}
        </ul>
        <p>Saving Suggestions:</p>
        <ul className="list-disc ml-6">
          {overview.aiInsights.suggestions?.map((s, idx) => (
            <li key={idx}>{s}</li>
          ))}
        </ul>
      </motion.section>
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect p-6 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-semibold mb-4">Investment Goals</h2>
        {overview.goals.length === 0 ? (
          <p>No goals created yet.</p>
        ) : (
          <ul className="space-y-4">
            {overview.goals.map((goal) => {
              const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
              return (
                <li key={goal.id} className="bg-white bg-opacity-10 rounded p-3">
                  <p className="font-semibold">{goal.title}</p>
                  <div className="w-full bg-gray-700 rounded-full h-4 mt-1">
                    <div
                      className="bg-primary h-4 rounded-full"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                      aria-label={`${progress.toFixed(1)}% progress`}
                    />
                  </div>
                  <p className="text-sm mt-1">
                    ₹{goal.currentAmount} / ₹{goal.targetAmount}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </motion.section>
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect p-6 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-semibold mb-4">Gamification Status</h2>
        <p>XP Points: {overview.gamification.xpPoints}</p>
        <p>Badges: {overview.gamification.badges.length > 0 ? overview.gamification.badges.join(', ') : 'None'}</p>
        <p>Current Streak: {overview.gamification.streakCount} days</p>
      </motion.section>
    </div>
  );
}

export default Dashboard;
