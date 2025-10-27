import { Router } from 'express';
import { generateStory, generateImage, generateCompleteDream } from '../../controllers/aiController';
import { authenticate } from '../../middleware/auth';

const router = Router();

/**
 * @route   POST /api/v1/ai/generate-story
 * @desc    Generate AI story from dream title and description
 * @access  Private
 */
router.post('/generate-story', authenticate, generateStory);

/**
 * @route   POST /api/v1/ai/generate-image
 * @desc    Generate AI image from dream description
 * @access  Private
 */
router.post('/generate-image', authenticate, generateImage);

/**
 * @route   POST /api/v1/ai/generate-complete
 * @desc    Generate complete dream with AI story and optional image
 * @access  Private
 */
router.post('/generate-complete', authenticate, generateCompleteDream);

export default router;