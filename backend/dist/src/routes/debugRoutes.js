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
const express_1 = require("express");
const prismaClient_1 = __importDefault(require("../prismaClient"));
const router = (0, express_1.Router)();
console.log('Debug routes loaded');
// GET /api/debug/insert-food?userId=XYZ
router.get('/insert-food', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.query.userId || 'debug-user-1';
        const today = new Date().toISOString().slice(0, 10);
        const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        const created = yield prismaClient_1.default.foodLog.create({
            data: {
                userId,
                date: today,
                name: 'Debug Inserted Food',
                quantity: 1,
                calories: 42,
                protein: 1,
                carbs: 8,
                fats: 0,
                mealType: 'Snacks',
                unit: 'serving',
                time: now,
            }
        });
        res.json({ ok: true, created });
    }
    catch (err) {
        console.error('debug insert-food error:', err);
        res.status(500).json({ error: 'failed', details: String(err) });
    }
}));
exports.default = router;
