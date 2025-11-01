import React, { useState, useRef } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api';

function PaymentForm() {
  const [amount, setAmount] = useState('');
  const [payeeVPA, setPayeeVPA] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('PhonePe');
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(false);
  const voiceInputRef = useRef(null);

  const handlePay = async () => {
    setPaymentStatus(null);
    setQrCodeUrl(null);
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/upi/pay`, {
        amount: parseFloat(amount),
        payeeVPA,
        paymentMethod
      });
      if (response.data.qrCode) {
        setQrCodeUrl(response.data.qrCode);
      }
      setPaymentStatus(response.data.status);
      fetchRewards();
    } catch (error) {
      setPaymentStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  const fetchRewards = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/upi/rewards`);
      setRewards(res.data.rewards);
    } catch {
      setRewards([]);
    }
  };

  const handlePaymentStatusCheck = async (transactionId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/upi/payment-status/${transactionId}`);
      setPaymentStatus(res.data.status);
    } catch {
      setPaymentStatus('failed');
    }
  };

  const handleVoicePayment = async () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser.');
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      try {
        const response = await axios.post(`${API_BASE_URL}/upi/voice-payment`, {
          voiceData: transcript
        });
        setPaymentStatus(response.data.status);
        if (response.data.transactionId) {
          handlePaymentStatusCheck(response.data.transactionId);
        }
        fetchRewards();
      } catch {
        setPaymentStatus('failed');
      }
    };

    recognition.onerror = (event) => {
      alert('Speech recognition error: ' + event.error);
    };
  };

  return (
    <div className="max-w-md mx-auto glass-effect p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">UPI Payment</h2>
      <div className="mb-4">
        <label htmlFor="payeeVPA" className="block mb-1 font-medium">
          Payee VPA
        </label>
        <input
          id="payeeVPA"
          type="text"
          value={payeeVPA}
          onChange={(e) => setPayeeVPA(e.target.value.trim())}
          placeholder="example@upi"
          className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="amount" className="block mb-1 font-medium">
          Amount (₹)
        </label>
        <input
          id="amount"
          type="number"
          min="1"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="paymentMethod" className="block mb-1 font-medium">
          Payment Method
        </label>
        <select
          id="paymentMethod"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="PhonePe">PhonePe</option>
          <option value="Paytm">Paytm</option>
          <option value="GooglePay">Google Pay</option>
          <option value="BHIM_UPI">BHIM UPI</option>
        </select>
      </div>
      <button
        type="button"
        onClick={handlePay}
        disabled={loading}
        className="w-full bg-primary hover:bg-blue-700 text-white font-semibold py-2 rounded"
      >
        {loading ? 'Processing...' : 'Pay'}
      </button>
      <button
        type="button"
        onClick={handleVoicePayment}
        className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded"
      >
        Pay by Voice Command
      </button>
      {qrCodeUrl && (
        <div className="mt-6 text-center">
          <p className="mb-2 font-semibold">Scan QR Code to Pay</p>
          <img src={qrCodeUrl} alt="UPI Payment QR Code" className="mx-auto" />
        </div>
      )}
      {paymentStatus && (
        <p className="mt-4 font-semibold">
          Payment Status: <span>{paymentStatus.toUpperCase()}</span>
        </p>
      )}
      {rewards.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Rewards & Cashbacks</h3>
          <ul className="list-disc list-inside">
            {rewards.map((reward) => (
              <li key={reward.rewardId}>
                {reward.name} - {reward.description} (Valid till {reward.validTill})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default PaymentForm;
