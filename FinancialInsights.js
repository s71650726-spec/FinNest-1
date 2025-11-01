import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api';

function FinancialInsights() {
  const [expenseForecast, setExpenseForecast] = useState(null);
  const [savingSuggestions, setSavingSuggestions] = useState([]);
  const [overspendingWarnings, setOverspendingWarnings] = useState([]);
  const [personalGoals, setPersonalGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInsights() {
      setLoading(true);
      try {
        const [forecastRes, suggestionsRes, warningsRes, goalsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/ai/expense-forecast`),
          axios.get(`${API_BASE_URL}/ai/saving-suggestions`),
          axios.get(`${API_BASE_URL}/ai/overspending-warnings`),
          axios.get(`${API_BASE_URL}/ai/personal-goals`)
        ]);
        setExpenseForecast(forecastRes.data);
        setSavingSuggestions(suggestionsRes.data.suggestions);
        setOverspendingWarnings(warningsRes.data.warnings);
        setPersonalGoals(goalsRes.data.goals);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch AI insights', error);
      } finally {
        setLoading(false);
      }
    }
    fetchInsights();
  }, []);

  if (loading) {
    return <div className="text-center text-white text-xl">Loading financial insights...</div>;
  }

  return (
    <motion.div className="max-w-5xl mx-auto space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <section className="glass-effect rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Expense Forecast</h2>
        <ul className="list-disc list-inside">
          {expenseForecast?.monthlyExpenses.map(({ month, amount }) => (
            <li key={month}>
              {month}: ₹{amount}
            </li>
          ))}
        </ul>
      </section>
      <section className="glass-effect rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Saving Suggestions</h2>
        <ul className="list-disc list-inside">
          {savingSuggestions.map((suggestion, idx) => (
            <li key={idx}>{suggestion}</li>
          ))}
        </ul>
      </section>
      <section className="glass-effect rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Overspending Warnings</h2>
        {overspendingWarnings.length === 0 ? (
          <p>No overspending warnings at this time.</p>
        ) : (
          <ul className="list-disc list-inside">
            {overspendingWarnings.map(({ category, lastMonthSpend, avgSpend, warning }) => (
              <li key={category}>
                {warning} (Category: {category}, Last Month: ₹{lastMonthSpend}, Average: ₹{avgSpend})
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="glass-effect rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Personal Goals Insights</h2>
        {personalGoals.length === 0 ? (
          <p>No personal goals found.</p>
        ) : (
          <ul className="list-disc list-inside">
            {personalGoals.map(({ goalId, title, progressPercent, recommendation }) => (
              <li key={goalId}>
                <strong>{title}</strong>: {progressPercent}% complete. Recommendation: {recommendation}
              </li>
            ))}
          </ul>
        )}
      </section>
    </motion.div>
  );
}

export default FinancialInsights;
