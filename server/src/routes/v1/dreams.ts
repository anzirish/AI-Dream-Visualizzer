import { Router } from 'express';
import {
  createDream,
  getMyDreams,
  getPublicDreams,
  getDreamById,
  updateDream,
  deleteDream,
} from '../../controllers/dreamController';
import { authenticate, optionalAuth } from '../../middleware/auth';

const router = Router();

router.post('/', authenticate, createDream);
router.get('/my', authenticate, getMyDreams);
router.get('/public', optionalAuth, getPublicDreams);
router.get('/:id', optionalAuth, getDreamById);
router.put('/:id', authenticate, updateDream);
router.delete('/:id', authenticate, deleteDream);

export default router;