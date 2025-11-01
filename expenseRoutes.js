import express from 'express';
import multer from 'multer';
import { ExpenseEntry } from '../models/ExpenseEntry.js';
import path from 'path';
import fs from 'fs';
import { processVoiceExpenseEntry } from '../utils/voiceProcessing.js';

const router = express.Router();

// Setup multer for photo uploads
const uploadDir = path.resolve('uploads/receipts');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `receipt_${uniqueSuffix}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
    if (!allowed.includes(path.extname(file.originalname).toLowerCase())) {
      return cb(new Error('Only image files are allowed (jpg, jpeg, png, webp)'));
    }
    cb(null, true);
  }
});

// POST /api/expenses/voice-entry - process voice input expense entry
router.post('/voice-entry', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { voiceData } = req.body;

    if (!voiceData || typeof voiceData !== 'string') {
      return res.status(400).json({ error: 'voiceData is required' });
    }

    const expenseEntry = await processVoiceExpenseEntry(userId, voiceData);

    res.status(201).json(expenseEntry);
  } catch (err) {
    next(err);
  }
});

// POST /api/expenses/photo-upload - upload photo of receipt
router.post('/photo-upload', upload.single('receiptPhoto'), async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!req.file) {
      return res.status(400).json({ error: 'Receipt photo file is required' });
    }

    // Save expense entry with photo URL
    const { amount, category, entryDate } = req.body;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }
    if (!category) {
      return res.status(400).json({ error: 'Category is required' });
    }
    if (!entryDate || isNaN(Date.parse(entryDate))) {
      return res.status(400).json({ error: 'Valid entryDate is required' });
    }

    const receiptPhotoURL = `${req.protocol}://${req.get('host')}/uploads/receipts/${req.file.filename}`;

    const expense = await ExpenseEntry.create({
      userId,
      amount,
      category,
      entryDate,
      source: 'photo',
      receiptPhotoURL
    });

    res.status(201).json(expense);
  } catch (err) {
    next(err);
  }
});

// POST /api/expenses/manual-entry - manual expense entry
router.post('/manual-entry', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { amount, category, entryDate } = req.body;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }
    if (!category) {
      return res.status(400).json({ error: 'Category is required' });
    }
    if (!entryDate || isNaN(Date.parse(entryDate))) {
      return res.status(400).json({ error: 'Valid entryDate is required' });
    }

    const expense = await ExpenseEntry.create({
      userId,
      amount,
      category,
      entryDate,
      source: 'manual',
      receiptPhotoURL: null
    });

    res.status(201).json(expense);
  } catch (err) {
    next(err);
  }
});

// GET /api/expenses/categories - list all expense categories
router.get('/categories', async (req, res) => {
  // Ideally, categories would be stored in DB or config, here is a fixed list
  const categories = [
    'Food & Dining',
    'Transportation',
    'Utilities',
    'Entertainment',
    'Healthcare',
    'Shopping',
    'Travel',
    'Education',
    'Personal Care',
    'Others'
  ];
  res.json({ categories });
});

export default router;
