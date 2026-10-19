import { Router } from 'express';
import { findAllUsers, findRequestsByUser } from '../services/requestService.js';
const router = Router();
router.get('/', (req, res) => res.json(findAllUsers().map(({ id, name, department }) => ({ id, name, department }))));
router.get('/:id/requests', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) return res.status(400).json({ message: 'Invalid user id' });
  res.json(findRequestsByUser(id));
});
export default router;
