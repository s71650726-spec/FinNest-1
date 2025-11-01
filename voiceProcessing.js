// Wraps speech-to-text API integration and handles audio alert triggers

import dotenv from 'dotenv';

dotenv.config();

// For demo, mock speech-to-text processing and expense extraction

export async function processVoiceExpenseEntry(userId, voiceData) {
  // voiceData is expected to be base64-encoded audio or a speech text string for demo

  // For demo, assume voiceData is text transcription already
  const transcription = voiceData.toLowerCase();

  // Simple extraction of amount and category from text
  const amountMatch = transcription.match(/(\d+(\.\d{1,2})?)/);
  const categoryMatch = transcription.match(/food|dining|transport|travel|entertainment|shopping|healthcare|utilities|education|personal care|others/);

  if (!amountMatch) {
    throw new Error('Could not extract amount from voice data');
  }

  const amount = parseFloat(amountMatch[1]);
  const category = categoryMatch ? categoryMatch[0] : 'Others';

  // Use current date for entryDate
  const entryDate = new Date().toISOString().slice(0, 10);

  // For demo, simulate saving to DB
  const expenseEntry = {
    id: `voice_${Date.now()}_${userId}`,
    userId,
    amount,
    category,
    entryDate,
    source: 'voice',
    receiptPhotoURL: null,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // In production, save to DB here and return saved entry

  return expenseEntry;
}
