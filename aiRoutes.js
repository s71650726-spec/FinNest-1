import express from 'express';

const router = express.Router();

// For demo, these handlers return mocked data
// In production, integrate AI services or custom models

// GET /api/ai/expense-forecast
router.get('/expense-forecast', async (req, res, next) => {
  try {
    // TODO: implement real AI forecast based on user's transactions
    const forecast = {
      monthlyExpenses: [
        { month: '2024-07', amount: 15000 },
        { month: '2024-08', amount: 14500 },
        { month: '2024-09', amount: 16000 }
      ],
      confidence: 0.85
    };
    res.json(forecast);
  } catch (err) {
    next(err);
  }
});

// GET /api/ai/saving-suggestions
router.get('/saving-suggestions', async (req, res, next) => {
  try {
    // Mocked suggestions
    const suggestions = [
      'Reduce dining out expenses by 10%',
      'Set weekly grocery budget to ₹3000',
      'Use cashback offers on utility bills'
    ];
    res.json({ suggestions });
  } catch (err) {
    next(err);
  }
});

// GET /api/ai/overspending-warnings
router.get('/overspending-warnings', async (req, res, next) => {
  try {
    // Mocked warnings
    const warnings = [
      {
        category: 'Entertainment',
        lastMonthSpend: 8000,
        avgSpend: 4000,
        warning: 'You spent twice your average on Entertainment last month.'
      }
    ];
    res.json({ warnings });
  } catch (err) {
    next(err);
  }
});

// GET /api/ai/personal-goals
router.get('/personal-goals', async (req, res, next) => {
  try {
    // Mocked personal goals insights
    const goals = [
      {
        goalId: '123',
        title: 'Emergency Fund',
        progressPercent: 65,
        recommendation: 'Increase monthly savings by ₹2000 to reach target in 6 months.'
      }
    ];
    res.json({ goals });
  } catch (err) {
    next(err);
  }
});

export default router;
