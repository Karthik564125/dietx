import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authController';
import { updateHealthProfile, getHealthProfile, updateDailyTracking, updateBasicProfile } from '../controllers/healthController';
import { getAdminData } from '../controllers/adminController';
import { authMiddleware } from '../middleware/authMiddleware';
import { getFoodLog, addFoodLogEntries, deleteFoodLogEntry } from '../controllers/foodLogController';


const router = Router();

router.post('/users', registerUser);
router.post('/login', loginUser);

// Health & Tracking routes (protected)
router.post('/health-profile', authMiddleware, updateHealthProfile);
router.get('/health-profile', authMiddleware, getHealthProfile);
router.post('/daily-tracking', authMiddleware, updateDailyTracking);
router.post('/update-profile', authMiddleware, updateBasicProfile);
router.get('/admin/data', authMiddleware, getAdminData);

// Food Log routes (protected)
router.get('/food-log', authMiddleware, getFoodLog);
router.post('/food-log', authMiddleware, addFoodLogEntries);
router.delete('/food-log/:id', authMiddleware, deleteFoodLogEntry);


export default router;
