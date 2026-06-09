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
exports.deleteFoodLogEntry = exports.addFoodLogEntries = exports.getFoodLog = void 0;
const prismaClient_1 = __importDefault(require("../prismaClient"));
/** GET /api/food-log?date=YYYY-MM-DD  – fetch all entries for a user on a given date */
const getFoodLog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId;
        const date = req.query.date || new Date().toISOString().slice(0, 10);
        const entries = yield prismaClient_1.default.foodLog.findMany({
            where: { userId, date },
            orderBy: { createdAt: 'asc' },
        });
        res.json({ entries });
    }
    catch (error) {
        console.error('getFoodLog error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getFoodLog = getFoodLog;
/** POST /api/food-log  – add one or more entries for the authenticated user */
const addFoodLogEntries = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        console.log('addFoodLogEntries called by user:', userId);
        console.log('Payload:', JSON.stringify(req.body));
        const { entries } = req.body;
        if (!Array.isArray(entries) || entries.length === 0) {
            res.status(400).json({ error: 'entries must be a non-empty array' });
            return;
        }
        const created = yield prismaClient_1.default.foodLog.createMany({
            data: entries.map(e => ({
                userId,
                date: e.date,
                name: e.name,
                quantity: e.quantity,
                calories: e.calories,
                mealType: e.mealType,
                unit: e.unit,
                time: e.time,
            })),
        });
        // Return the newly inserted rows so the frontend can get their DB ids
        const date = entries[0].date;
        const allForDay = yield prismaClient_1.default.foodLog.findMany({
            where: { userId, date },
            orderBy: { createdAt: 'asc' },
        });
        res.status(201).json({ count: created.count, entries: allForDay });
    }
    catch (error) {
        console.error('addFoodLogEntries error:', error);
        if (error instanceof Error)
            console.error(error.stack);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.addFoodLogEntries = addFoodLogEntries;
/** DELETE /api/food-log/:id  – remove a single entry (must belong to authenticated user) */
const deleteFoodLogEntry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        const entry = yield prismaClient_1.default.foodLog.findUnique({ where: { id } });
        if (!entry) {
            res.status(404).json({ error: 'Entry not found' });
            return;
        }
        if (entry.userId !== userId) {
            res.status(403).json({ error: 'Not authorised to delete this entry' });
            return;
        }
        yield prismaClient_1.default.foodLog.delete({ where: { id } });
        res.json({ message: 'Entry deleted' });
    }
    catch (error) {
        console.error('deleteFoodLogEntry error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.deleteFoodLogEntry = deleteFoodLogEntry;
