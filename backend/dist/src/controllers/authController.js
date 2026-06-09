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
exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prismaClient_1 = __importDefault(require("../prismaClient"));
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, phone } = req.body;
        if (!email || !password || !name) {
            res.status(400).json({ error: 'Please provide all required fields' });
            return;
        }
        // Check if user exists
        const existingUser = yield prismaClient_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ error: 'User already exists' });
            return;
        }
        // Hash password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Save to db
        const newUser = yield prismaClient_1.default.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone: phone || null,
                gender: req.body.gender || null,
            },
        });
        res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: 'Please provide email and password' });
            return;
        }
        // Check user
        const user = yield prismaClient_1.default.user.findUnique({ where: { email } });
        if (!user) {
            res.status(400).json({ error: 'Invalid credentials' });
            return;
        }
        // Compare password
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ error: 'Invalid credentials' });
            return;
        }
        // Generate JWT (expires in 7d)
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
        // Check if user has a premium purchase (personal consultancy)
        const consultancyPurchase = yield prismaClient_1.default.nutritionPlanPurchase.findFirst({
            where: {
                userId: user.id,
                status: 'completed',
                OR: [
                    { amount: { in: [1499] } },
                    { planName: 'pcod_consultancy' }
                ]
            }
        });
        // Check if user has unlocked recipes
        const recipesPurchase = yield prismaClient_1.default.nutritionPlanPurchase.findFirst({
            where: {
                userId: user.id,
                status: 'completed',
                OR: [
                    { amount: { in: [99] } },
                    { planName: 'suggested_recipes' }
                ]
            }
        });
        // Check if user has unlocked PCOD consultancy specifically
        const pcodPurchase = yield prismaClient_1.default.nutritionPlanPurchase.findFirst({
            where: { userId: user.id, status: 'completed', planName: 'pcod_consultancy' }
        });
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                gender: user.gender,
                profileComplete: user.profileComplete,
                isPremium: !!consultancyPurchase,
                isRecipesUnlocked: !!recipesPurchase,
                isPcodUnlocked: !!pcodPurchase
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.loginUser = loginUser;
