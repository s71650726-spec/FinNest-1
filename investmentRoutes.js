import express from 'express';
import { Goal } from '../models/Goal.js';

const router = express.Router();

// POST /api/investments/goals - create a new investment goal
router.post('/goals', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { title, description, targetAmount, deadline, familyShared } = req.body;

    if (!title || !targetAmount || isNaN(targetAmount)) {
      return res.status(400).json({ error: 'Title and valid targetAmount are required' });
    }

    const goal = await Goal.create({
      userId,
      title,
      description: description || '',
      targetAmount,
      deadline: deadline || null,
      familyShared: familyShared === true,
      currentAmount: 0,
      aiRecommendedPlan: null
    });

    res.status(201).json(goal);
  } catch (err) {
    next(err);
  }
});

// GET /api/investments/goals - get all goals of user
router.get('/goals', async (req, res, next) => {
  try {
    const userId = req.user.id;

    const goals = await Goal.findAll({ where: { userId } });

    res.json(goals);
  } catch (err) {
    next(err);
  }
});

// PUT /api/investments/goals/:id - update a goal
router.put('/goals/:id', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const goalId = req.params.id;
    const { title, description, targetAmount, deadline, familyShared } = req.body;

    const goal = await Goal.findOne({ where: { id: goalId, userId } });
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    if (title !== undefined) goal.title = title;
    if (description !== undefined) goal.description = description;
    if (targetAmount !== undefined) {
      if (isNaN(targetAmount)) {
        return res.status(400).json({ error: 'Invalid targetAmount' });
      }
      goal.targetAmount = targetAmount;
    }
    if (deadline !== undefined) goal.deadline = deadline;
    if (familyShared !== undefined) goal.familyShared = familyShared;

    await goal.save();

    res.json(goal);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/investments/goals/:id - delete a goal
router.delete('/goals/:id', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const goalId = req.params.id;

    const goal = await Goal.findOne({ where: { id: goalId, userId } });
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    await goal.destroy();

    res.json({ message: 'Goal deleted' });
  } catch (err) {
    next(err);
  }
});

// GET /api/investments/real-time-visualization/:goalId - WebSocket endpoint is handled separately

export default router;
