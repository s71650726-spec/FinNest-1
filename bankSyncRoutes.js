import express from 'express';
import { Transaction } from '../models/Transaction.js';
import { BankSync } from '../models/BankSync.js';
import { recognizeMerchantName } from '../utils/merchantRecognition.js';
import { detectFraudAnomalies } from '../utils/fraudDetection.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// GET /api/bank-sync/transactions
// Query params: page, limit, category, merchantName, dateFrom, dateTo, sortBy, sortOrder
router.get('/transactions', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      page = 1,
      limit = 20,
      category,
      merchantName,
      dateFrom,
      dateTo,
      sortBy = 'transactionDate',
      sortOrder = 'DESC'
    } = req.query;

    const where = { userId };

    if (category) where.category = category;
    if (merchantName) where.merchantName = merchantName;
    if (dateFrom || dateTo) where.transactionDate = {};
    if (dateFrom) where.transactionDate.$gte = new Date(dateFrom);
    if (dateTo) where.transactionDate.$lte = new Date(dateTo);

    // Sequelize v6 uses Op for operators
    const { Op } = await import('sequelize');

    if (dateFrom || dateTo) {
      where.transactionDate = {};
      if (dateFrom) where.transactionDate[Op.gte] = new Date(dateFrom);
      if (dateTo) where.transactionDate[Op.lte] = new Date(dateTo);
    }

    // Fetch paginated transactions
    const offset = (page - 1) * limit;
    const transactions = await Transaction.findAndCountAll({
      where,
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: Number(limit),
      offset: Number(offset)
    });

    // Recognize and normalize merchant names
    const normalizedTransactions = transactions.rows.map((txn) => {
      const normalizedName = recognizeMerchantName(txn.merchantName);
      return {
        ...txn.toJSON(),
        merchantName: normalizedName
      };
    });

    // Detect fraud and anomalies
    const transactionsWithFlags = await detectFraudAnomalies(normalizedTransactions, userId);

    res.json({
      total: transactions.count,
      page: Number(page),
      limit: Number(limit),
      transactions: transactionsWithFlags
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/bank-sync/sync - trigger bank sync via Plaid or TrueLayer
router.post('/sync', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { provider, bankSyncId } = req.body;

    if (!provider || !['plaid', 'truelayer'].includes(provider)) {
      return res.status(400).json({ error: 'Invalid or missing provider' });
    }

    let bankSyncRecord;

    if (bankSyncId) {
      bankSyncRecord = await BankSync.findOne({ where: { id: bankSyncId, userId } });
      if (!bankSyncRecord) {
        return res.status(404).json({ error: 'Bank sync record not found' });
      }
    } else {
      bankSyncRecord = await BankSync.findOne({ where: { userId, bankName: provider } });
      if (!bankSyncRecord) {
        return res.status(404).json({ error: 'No bank sync record found for this provider' });
      }
    }

    // For demo, mock sync process
    // In production, integrate with Plaid or TrueLayer API using stored access tokens

    // Simulated sync delay
    setTimeout(async () => {
      bankSyncRecord.syncStatus = 'success';
      bankSyncRecord.lastSyncDate = new Date();
      await bankSyncRecord.save();
    }, 2000);

    res.json({ message: 'Bank sync started', bankSyncId: bankSyncRecord.id });
  } catch (err) {
    next(err);
  }
});

// GET /api/bank-sync/fraud-alerts - get user's fraud alerts
router.get('/fraud-alerts', async (req, res, next) => {
  try {
    const userId = req.user.id;

    const fraudTransactions = await Transaction.findAll({
      where: { userId, isFraud: true },
      order: [['transactionDate', 'DESC']],
      limit: 50
    });

    res.json({ fraudAlerts: fraudTransactions });
  } catch (err) {
    next(err);
  }
});

// GET /api/bank-sync/anomalies - get user's anomaly alerts
router.get('/anomalies', async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Anomaly score threshold can be configurable; example threshold 0.7
    const anomalyTransactions = await Transaction.findAll({
      where: { userId, anomalyScore: { $gte: 0.7 } },
      order: [['transactionDate', 'DESC']],
      limit: 50
    });

    res.json({ anomalies: anomalyTransactions });
  } catch (err) {
    next(err);
  }
});

export default router;
