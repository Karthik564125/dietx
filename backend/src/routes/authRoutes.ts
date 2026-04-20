import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authController';
import { updateHealthProfile, getHealthProfile, updateDailyTracking, updateBasicProfile } from '../controllers/healthController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/users', registerUser);
router.post('/login', loginUser);

// Health & Tracking routes (protected)
router.post('/health-profile', authMiddleware, updateHealthProfile);
router.get('/health-profile', authMiddleware, getHealthProfile);
router.post('/daily-tracking', authMiddleware, updateDailyTracking);
router.post('/update-profile', authMiddleware, updateBasicProfile);

export default router;
