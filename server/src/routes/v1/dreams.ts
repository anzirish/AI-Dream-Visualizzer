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

/**
 * @route   POST /api/v1/dreams
 * @desc    Create a new dream
 * @access  Private
 */
router.post('/', authenticate, createDream);

/**
 * @route   GET /api/v1/dreams/my
 * @desc    Get current user's dreams
 * @access  Private
 */
router.get('/my', authenticate, getMyDreams);

/**
 * @route   GET /api/v1/dreams/public
 * @desc    Get public dreams feed with pagination
 * @access  Public (optional auth for user context)
 */
router.get('/public', optionalAuth, getPublicDreams);

/**
 * @route   GET /api/v1/dreams/:id
 * @desc    Get single dream by ID
 * @access  Public for public dreams, Private for user's own dreams
 */
router.get('/:id', optionalAuth, getDreamById);

/**
 * @route   PUT /api/v1/dreams/:id
 * @desc    Update dream (title, description, privacy)
 * @access  Private (owner only)
 */
router.put('/:id', authenticate, updateDream);

/**
 * @route   DELETE /api/v1/dreams/:id
 * @desc    Delete dream
 * @access  Private (owner only)
 */
router.delete('/:id', authenticate, deleteDream);

export default router;