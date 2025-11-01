import express from 'express';

const router = express.Router();

// For demo, all routes return 501 Not Implemented
// In production, implement family collaboration logic with invites, roles, shared bills, notifications

// POST /api/family/invite - invite family member
router.post('/invite', (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

// GET /api/family/members - list family members
router.get('/members', (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

// PUT /api/family/roles/:memberId - update role of family member
router.put('/roles/:memberId', (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

// GET /api/family/shared-bills - list shared bills
router.get('/shared-bills', (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

// POST /api/family/shared-bills - add shared bill
router.post('/shared-bills', (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

export default router;
