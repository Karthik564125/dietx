"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const healthController_1 = require("../controllers/healthController");
const adminController_1 = require("../controllers/adminController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post('/users', authController_1.registerUser);
router.post('/login', authController_1.loginUser);
// Health & Tracking routes (protected)
router.post('/health-profile', authMiddleware_1.authMiddleware, healthController_1.updateHealthProfile);
router.get('/health-profile', authMiddleware_1.authMiddleware, healthController_1.getHealthProfile);
router.post('/daily-tracking', authMiddleware_1.authMiddleware, healthController_1.updateDailyTracking);
router.post('/update-profile', authMiddleware_1.authMiddleware, healthController_1.updateBasicProfile);
router.get('/admin/data', authMiddleware_1.authMiddleware, adminController_1.getAdminData);
exports.default = router;
