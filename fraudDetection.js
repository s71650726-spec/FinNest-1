// Implements anomaly detection logic using transaction patterns and thresholds

import _ from 'lodash';

// For demo, simple heuristic: flag transactions > 3 standard deviations from mean amount

export async function detectFraudAnomalies(transactions, userId) {
  if (!transactions || transactions.length === 0) return [];

  // Extract amounts
  const amounts = transactions.map((t) => parseFloat(t.amount));
  const mean = _.mean(amounts);
  const stdDev = Math.sqrt(_.mean(amounts.map((v) => (v - mean) ** 2)));

  return transactions.map((txn) => {
    const amt = parseFloat(txn.amount);
    const anomalyScore = stdDev === 0 ? 0 : Math.abs(amt - mean) / stdDev;

    // Flag as fraud if anomalyScore > 3 and amount > 10000 INR (example threshold)
    const isFraud = anomalyScore > 3 && amt > 10000;

    return {
      ...txn,
      anomalyScore: parseFloat(anomalyScore.toFixed(3)),
      isFraud
    };
  });
}
