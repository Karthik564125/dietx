"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPayment = exports.createOrder = void 0;
const paymentService_1 = require("../services/paymentService");
const mailService_1 = require("../services/mailService");
const prismaClient_1 = __importDefault(require("../prismaClient"));
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount } = req.body; // In a real app, you'd validate this or use a fixed amount
        const receipt = `receipt_${Date.now()}`;
        const order = yield paymentService_1.PaymentService.createOrder(amount || 499, receipt);
        res.status(200).json({
            success: true,
            order,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Order creation failed' });
    }
});
exports.createOrder = createOrder;
const verifyPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, email, phone, amount, planName } = req.body;
        const isValid = paymentService_1.PaymentService.verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
        if (!isValid) {
            return res.status(400).json({ success: false, message: 'Invalid signature' });
        }
        // Save to database
        const purchase = yield prismaClient_1.default.nutritionPlanPurchase.create({
            data: {
                userId,
                email,
                phone,
                razorpayOrderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id,
                amount: Number(amount),
                status: 'completed',
                planName: planName || null,
            },
        });
        // Also update user's phone if it was provided
        if (phone && userId) {
            yield prismaClient_1.default.user.update({
                where: { id: userId },
                data: { phone },
            });
        }
        // Trigger Email Notification (Non-blocking or handled) - Only for Personal Consultancy (amount >= 299 or PCOD consultancy)
        try {
            const fullUser = yield prismaClient_1.default.user.findUnique({ where: { id: userId } });
            if ((Number(amount) >= 299 || planName === 'pcod_consultancy') && fullUser) {
                yield mailService_1.MailService.sendConsultationMail({
                    user: {
                        id: fullUser.id,
                        name: fullUser.name,
                        email: fullUser.email,
                        phone: fullUser.phone || phone || 'N/A',
                        age: fullUser.age || 0,
                        gender: fullUser.gender || 'N/A',
                        height: fullUser.height || 0,
                        weight: fullUser.weight || 0,
                        activityLevel: fullUser.activityLevel || 'N/A',
                        bmi: fullUser.bmi || 0,
                        dailyCalories: fullUser.dailyCalories || 0
                    },
                    payment: {
                        orderId: razorpay_order_id,
                        paymentId: razorpay_payment_id,
                        amount: Number(amount),
                        date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
                    }
                });
            }
        }
        catch (mailError) {
            console.error('Failed to send consultation email:', mailError);
        }
        res.status(200).json({
            success: true,
            message: 'Payment verified and saved',
            purchase,
        });
    }
    catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({ success: false, error: 'Verification failed' });
    }
});
exports.verifyPayment = verifyPayment;
