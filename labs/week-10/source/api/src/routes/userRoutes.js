import { Router } from 'express';
import { findAllUsers } from '../services/requestService.js';
const router = Router();
router.get('/', (req, res) => res.json(findAllUsers().map(({ id, name, department }) => ({ id, name, department }))));
export default router;
