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
exports.getAdminData = void 0;
const prismaClient_1 = __importDefault(require("../prismaClient"));
const getAdminData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminEmail = req.user.email;
        if (adminEmail !== 'nutriwithdietex@gmail.com') {
            res.status(403).json({ error: 'Unauthorized access' });
            return;
        }
        const users = yield prismaClient_1.default.user.findMany({
            where: {
                NOT: { email: 'nutriwithdietex@gmail.com' }
            },
            orderBy: { createdAt: 'desc' }
        });
        const purchases = yield prismaClient_1.default.nutritionPlanPurchase.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json({
            success: true,
            data: {
                users,
                purchases,
                stats: {
                    totalUsers: users.length,
                    totalPurchases: purchases.length,
                    totalRevenue: purchases.reduce((sum, p) => sum + p.amount, 0)
                }
            }
        });
    }
    catch (error) {
        console.error('Admin data fetch error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getAdminData = getAdminData;
