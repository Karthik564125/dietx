"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_1 = require("../controllers/paymentController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post('/payment/create-order', authMiddleware_1.authMiddleware, paymentController_1.createOrder);
router.post('/payment/verify', authMiddleware_1.authMiddleware, paymentController_1.verifyPayment);
exports.default = router;
