// Manages UPI payment API calls to PhonePe, Paytm, Google Pay, BHIM UPI with fallback mocks

import dotenv from 'dotenv';

dotenv.config();

const UPI_API_KEYS = (process.env.UPI_API_KEYS || '').split(',');

function getApiKeyForProvider(provider) {
  switch (provider) {
    case 'PhonePe':
      return UPI_API_KEYS[0] || '';
    case 'Paytm':
      return UPI_API_KEYS[1] || '';
    case 'GooglePay':
      return UPI_API_KEYS[2] || '';
    case 'BHIM_UPI':
      return UPI_API_KEYS[3] || '';
    default:
      return '';
  }
}

export async function initiateUPIPayment({ userId, amount, payeeVPA, paymentMethod, transactionId }) {
  // Mock payment initiation

  if (!paymentMethod) {
    return { status: 'failed', error: 'Payment method required' };
  }

  // Fallback mock response with QR code URL
  return {
    status: 'pending',
    qrCode: `https://api.qrserver.com/v1/create-qr-code/?data=upi://pay?pa=${encodeURIComponent(
      payeeVPA
    )}&am=${amount}&pn=Payee&tid=${transactionId}`
  };
}

export async function getPaymentStatus(paymentRecord) {
  // Mock status update

  // For demo, randomly return success or pending
  const statuses = ['pending', 'success', 'failed'];
  const randIndex = Math.floor(Math.random() * statuses.length);

  return statuses[randIndex];
}

export async function getRewards(userId) {
  // Mock rewards data
  return [
    {
      rewardId: 'reward1',
      name: 'Cashback Offer',
      description: '5% cashback on UPI payments above ₹500',
      validTill: '2024-12-31'
    }
  ];
}

export async function processVoicePayment(userId, voiceData) {
  // For demo, parse voiceData to extract payment info
  const transcription = voiceData.toLowerCase();

  const amountMatch = transcription.match(/(\d+(\.\d{1,2})?)/);
  const payeeMatch = transcription.match(/to ([a-z0-9.\-_]+@[a-z]+)/);

  if (!amountMatch || !payeeMatch) {
    return { status: 'failed', error: 'Could not parse payment details from voice data' };
  }

  const amount = parseFloat(amountMatch[1]);
  const payeeVPA = payeeMatch[1];
  const paymentMethod = 'PhonePe';

  const transactionId = `upi_voice_${Date.now()}_${userId}`;

  // Initiate payment via mock
  const paymentResponse = await initiateUPIPayment({
    userId,
    amount,
    payeeVPA,
    paymentMethod,
    transactionId
  });

  // Save payment record - omitted for demo

  return {
    transactionId,
    status: paymentResponse.status,
    message: paymentResponse.status === 'pending' ? 'Payment initiated via voice command' : 'Payment failed'
  };
}
