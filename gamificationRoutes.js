import express from 'express';
import { Gamification } from '../models/Gamification.js';

const router = express.Router();

// GET /api/gamification/status - get user's gamification status
router.get('/status', async (req, res, next) => {
  try {
    const userId = req.user.id;

    let gamification = await Gamification.findOne({ where: { userId } });
    if (!gamification) {
      gamification = await Gamification.create({ userId });
    }

    res.json(gamification);
  } catch (err) {
    next(err);
  }
});

// POST /api/gamification/challenge/complete - mark challenge as completed and update XP
router.post('/challenge/complete', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { challengeId, xpEarned, badge } = req.body;

    if (!challengeId || typeof xpEarned !== 'number') {
      return res.status(400).json({ error: 'challengeId and numeric xpEarned are required' });
    }

    let gamification = await Gamification.findOne({ where: { userId } });
    if (!gamification) {
      gamification = await Gamification.create({ userId });
    }

    gamification.xpPoints += xpEarned;

    if (badge && typeof badge === 'string' && !gamification.badges.includes(badge)) {
      gamification.badges.push(badge);
    }

    // Update streakCount and lastActiveDate
    const today = new Date().toISOString().slice(0, 10);
    if (gamification.lastActiveDate) {
      const lastDate = gamification.lastActiveDate.toISOString().slice(0, 10);
      const lastDateObj = new Date(lastDate);
      const todayObj = new Date(today);
      const diffDays = Math.floor((todayObj - lastDateObj) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        gamification.streakCount += 1;
      } else if (diffDays > 1) {
        gamification.streakCount = 1;
      }
    } else {
      gamification.streakCount = 1;
    }
    gamification.lastActiveDate = new Date();

    await gamification.save();

    res.json({ message: 'Challenge completed', xpPoints: gamification.xpPoints, badges: gamification.badges, streakCount: gamification.streakCount });
  } catch (err) {
    next(err);
  }
});

// GET /api/gamification/family-leaderboard - get leaderboard ranks among family members
router.get('/family-leaderboard', async (req, res, next) => {
  try {
    // For demo, return top 10 users by XP
    const leaderboard = await Gamification.findAll({
      order: [['xpPoints', 'DESC']],
      limit: 10,
      attributes: ['userId', 'xpPoints', 'badges', 'streakCount']
    });

    res.json({ leaderboard });
  } catch (err) {
    next(err);
  }
});

export default router;
