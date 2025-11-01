import express from 'express';
import { UPIPayment } from '../models/UPIPayment.js';
import { initiateUPIPayment, getPaymentStatus, getRewards, processVoicePayment } from '../utils/paymentIntegration.js';

const router = express.Router();

// POST /api/upi/pay - initiate a UPI payment with QR code or VPA
router.post('/pay', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { amount, payeeVPA, paymentMethod } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
    if (!payeeVPA || typeof payeeVPA !== 'string') {
      return res.status(400).json({ error: 'payeeVPA is required' });
    }
    if (!paymentMethod || !['PhonePe', 'Paytm', 'GooglePay', 'BHIM_UPI'].includes(paymentMethod)) {
      return res.status(400).json({ error: 'Invalid or missing paymentMethod' });
    }

    const transactionId = `upi_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    // Call payment integration util to initiate payment
    const paymentResponse = await initiateUPIPayment({
      userId,
      amount,
      payeeVPA,
      paymentMethod,
      transactionId
    });

    // Save payment record
    await UPIPayment.create({
      userId,
      amount,
      payeeVPA,
      transactionId,
      status: paymentResponse.status,
      paymentMethod,
      timestamp: new Date()
    });

    res.json({
      message: 'Payment initiated',
      transactionId,
      paymentMethod,
      status: paymentResponse.status,
      qrCode: paymentResponse.qrCode || null
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/upi/payment-status/:id - get status of payment by transactionId
router.get('/payment-status/:id', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const transactionId = req.params.id;

    if (!transactionId) {
      return res.status(400).json({ error: 'Transaction ID is required' });
    }

    const payment = await UPIPayment.findOne({ where: { userId, transactionId } });
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Optionally refresh status from provider
    const updatedStatus = await getPaymentStatus(payment);

    if (updatedStatus && updatedStatus !== payment.status) {
      payment.status = updatedStatus;
      await payment.save();
    }

    res.json({
      transactionId: payment.transactionId,
      status: payment.status,
      amount: payment.amount,
      payeeVPA: payment.payeeVPA,
      paymentMethod: payment.paymentMethod,
      timestamp: payment.timestamp
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/upi/rewards - fetch current user's UPI payment rewards and cashbacks
router.get('/rewards', async (req, res, next) => {
  try {
    const userId = req.user.id;

    const rewards = await getRewards(userId);

    res.json({ rewards });
  } catch (err) {
    next(err);
  }
});

// POST /api/upi/voice-payment - process voice command payment
router.post('/voice-payment', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { voiceData } = req.body;

    if (!voiceData || typeof voiceData !== 'string') {
      return res.status(400).json({ error: 'voiceData is required' });
    }

    const paymentResult = await processVoicePayment(userId, voiceData);

    res.json(paymentResult);
  } catch (err) {
    next(err);
  }
});

export default router;
