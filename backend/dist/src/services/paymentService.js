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
exports.PaymentService = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
require("dotenv/config");
const razorpay = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});
class PaymentService {
    static createOrder(amount, receipt) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                amount: amount * 100, // Razorpay expects amount in paise
                currency: 'INR',
                receipt: receipt,
            };
            try {
                const order = yield razorpay.orders.create(options);
                return order;
            }
            catch (error) {
                console.error('Error creating Razorpay order:', error);
                throw error;
            }
        });
    }
    static verifySignature(orderId, paymentId, signature) {
        const text = `${orderId}|${paymentId}`;
        const generated_signature = crypto_1.default
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(text)
            .digest('hex');
        return generated_signature === signature;
    }
}
exports.PaymentService = PaymentService;
