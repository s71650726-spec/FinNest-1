import React, { useState, useRef } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api';

function ManualEntryForm() {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [entryDate, setEntryDate] = useState(new Date().toISOString().slice(0, 10));
  const [receiptPhoto, setReceiptPhoto] = useState(null);
  const [voiceInput, setVoiceInput] = useState('');
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  React.useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await axios.get(`${API_BASE_URL}/expenses/categories`);
        setCategories(res.data.categories);
      } catch (err) {
        setCategories([]);
      }
    }
    fetchCategories();
  }, []);

  const handlePhotoChange = (e) => {
    if (e.target.files.length > 0) {
      setReceiptPhoto(e.target.files[0]);
    }
  };

  const handlePhotoUpload = async () => {
    if (!receiptPhoto) {
      setMessage('Please select a photo first.');
      return;
    }
    const formData = new FormData();
    formData.append('receiptPhoto', receiptPhoto);
    formData.append('amount', amount);
    formData.append('category', category);
    formData.append('entryDate', entryDate);

    setUploading(true);
    setMessage('');
    try {
      const res = await axios.post(`${API_BASE_URL}/expenses/photo-upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage('Expense saved successfully with photo.');
      setAmount('');
      setCategory('');
      setEntryDate(new Date().toISOString().slice(0, 10));
      setReceiptPhoto(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to upload photo expense entry.');
    } finally {
      setUploading(false);
    }
  };

  const handleManualEntry = async () => {
    if (!amount || isNaN(amount) || !category || !entryDate) {
      setMessage('Please fill all fields correctly.');
      return;
    }
    setUploading(true);
    setMessage('');
    try {
      await axios.post(`${API_BASE_URL}/expenses/manual-entry`, { amount, category, entryDate });
      setMessage('Manual expense entry saved.');
      setAmount('');
      setCategory('');
      setEntryDate(new Date().toISOString().slice(0, 10));
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to save manual entry.');
    } finally {
      setUploading(false);
    }
  };

  const handleVoiceInput = () => {
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

    recognition.onresult = (event) => {
      setVoiceInput(event.results[0][0].transcript);
    };

    recognition.onerror = (event) => {
      alert('Speech recognition error: ' + event.error);
    };
  };

  const handleVoiceEntrySubmit = async () => {
    if (!voiceInput) {
      setMessage('Please provide voice input first.');
      return;
    }
    setUploading(true);
    setMessage('');
    try {
      await axios.post(`${API_BASE_URL}/expenses/voice-entry`, { voiceData: voiceInput });
      setMessage('Voice expense entry saved.');
      setVoiceInput('');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to save voice entry.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto glass-effect p-6 rounded-lg shadow-lg space-y-6">
      <h2 className="text-2xl font-semibold text-white">Manual Expense Entry</h2>
      <div>
        <label htmlFor="amount" className="block mb-1 font-medium text-white">
          Amount (₹)
        </label>
        <input
          id="amount"
          type="number"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div>
        <label htmlFor="category" className="block mb-1 font-medium text-white">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="entryDate" className="block mb-1 font-medium text-white">
          Date
        </label>
        <input
          id="entryDate"
          type="date"
          value={entryDate}
          onChange={(e) => setEntryDate(e.target.value)}
          className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div>
        <button
          type="button"
          onClick={handleManualEntry}
          disabled={uploading}
          className="w-full bg-primary hover:bg-blue-700 text-white font-semibold py-2 rounded"
        >
          {uploading ? 'Saving...' : 'Save Manual Entry'}
        </button>
      </div>
      <hr className="border-gray-400" />
      <div>
        <label htmlFor="receiptPhoto" className="block mb-1 font-medium text-white">
          Upload Receipt Photo
        </label>
        <input
          id="receiptPhoto"
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          ref={fileInputRef}
          className="w-full text-white"
        />
        <button
          type="button"
          onClick={handlePhotoUpload}
          disabled={uploading || !receiptPhoto}
          className="mt-2 w-full bg-primary hover:bg-blue-700 text-white font-semibold py-2 rounded"
        >
          {uploading ? 'Uploading...' : 'Upload Receipt and Save'}
        </button>
      </div>
      <hr className="border-gray-400" />
      <div>
        <label htmlFor="voiceInput" className="block mb-1 font-medium text-white">
          Voice Input
        </label>
        <textarea
          id="voiceInput"
          value={voiceInput}
          readOnly
          rows={3}
          className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="button"
          onClick={handleVoiceInput}
          className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded"
        >
          Record Voice Input
        </button>
        <button
          type="button"
          onClick={handleVoiceEntrySubmit}
          disabled={uploading || !voiceInput}
          className="mt-2 w-full bg-primary hover:bg-blue-700 text-white font-semibold py-2 rounded"
        >
          {uploading ? 'Saving...' : 'Save Voice Entry'}
        </button>
      </div>
      {message && <p className="mt-4 text-center text-yellow-400">{message}</p>}
    </div>
  );
}

export default ManualEntryForm;
