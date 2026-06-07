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
exports.updateBasicProfile = exports.updateDailyTracking = exports.getHealthProfile = exports.updateHealthProfile = void 0;
const prismaClient_1 = __importDefault(require("../prismaClient"));
function getBmiCategory(bmi) {
    if (bmi < 18.5)
        return 'Underweight';
    if (bmi < 25)
        return 'Normal';
    if (bmi < 30)
        return 'Overweight';
    return 'Obese';
}
function calculateIdealWeight(gender, heightCm) {
    if (!heightCm)
        return 0;
    const inchesOver60 = (heightCm / 2.54) - 60;
    if (gender === 'male') {
        return 50 + 2.3 * inchesOver60;
    }
    else {
        return 45.5 + 2.3 * inchesOver60;
    }
}
const updateHealthProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = req.user.userId;
        const { age, gender, heightUnit, weightUnit, activityLevel } = req.body;
        // Convert height to cm regardless of input unit
        let heightCm;
        if (heightUnit === 'ft_in') {
            const feet = parseFloat(req.body.feet || '0');
            const inches = parseFloat(req.body.inches || '0');
            heightCm = (feet * 12 + inches) * 2.54;
        }
        else {
            heightCm = parseFloat(req.body.height);
        }
        // Convert weight to kg regardless of input unit
        let weightKg;
        if (weightUnit === 'lbs') {
            weightKg = parseFloat(req.body.weight) * 0.453592;
        }
        else {
            weightKg = parseFloat(req.body.weight);
        }
        // Calculate BMI
        const heightM = heightCm / 100;
        const bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(1));
        // Harris-Benedict BMR equation
        let bmr;
        const ageNum = parseInt(age);
        if (gender === 'male') {
            bmr = 88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * ageNum);
        }
        else {
            bmr = 447.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * ageNum);
        }
        const activityFactors = {
            sedentary: 1.2,
            light: 1.3,
            moderate: 1.5,
            active: 1.7,
            veryActive: 1.9,
        };
        const dailyCalories = Math.round(bmr * ((_a = activityFactors[activityLevel]) !== null && _a !== void 0 ? _a : 1.2));
        const idealWeight = calculateIdealWeight(gender, heightCm);
        yield prismaClient_1.default.user.update({
            where: { id: userId },
            data: {
                age: ageNum,
                gender,
                height: heightCm,
                heightUnit,
                weight: weightKg,
                weightUnit,
                activityLevel,
                bmi,
                dailyCalories,
                profileComplete: true,
            },
        });
        res.json({
            message: 'Health profile updated successfully',
            bmi,
            dailyCalories,
            bmiCategory: getBmiCategory(bmi),
            idealWeight: parseFloat(idealWeight.toFixed(1))
        });
    }
    catch (error) {
        console.error('Health profile update error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.updateHealthProfile = updateHealthProfile;
const getHealthProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId;
        const user = yield prismaClient_1.default.user.findUnique({ where: { id: userId } });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        // Check if user has a premium purchase (personal consultancy)
        const consultancyPurchase = yield prismaClient_1.default.nutritionPlanPurchase.findFirst({
            where: { userId, status: 'completed', amount: { in: [299, 499, 1499] } }
        });
        // Check if user has unlocked recipes
        const recipesPurchase = yield prismaClient_1.default.nutritionPlanPurchase.findFirst({
            where: { userId, status: 'completed', amount: { in: [99, 299, 499, 1499] } }
        });
        res.json({
            profileComplete: user.profileComplete,
            userId: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            isPremium: !!consultancyPurchase,
            isRecipesUnlocked: !!recipesPurchase,
            health: {
                age: user.age,
                gender: user.gender,
                height: user.height,
                heightUnit: user.heightUnit,
                weight: user.weight,
                weightUnit: user.weightUnit,
                activityLevel: user.activityLevel,
                bmi: user.bmi,
                dailyCalories: user.dailyCalories,
                bmiCategory: user.bmi ? getBmiCategory(user.bmi) : null,
                idealWeight: user.height ? parseFloat(calculateIdealWeight(user.gender || 'female', user.height).toFixed(1)) : null,
                sleepHours: user.sleepHours,
                lastEntryDate: user.lastEntryDate,
            },
        });
    }
    catch (error) {
        console.error('Get health profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getHealthProfile = getHealthProfile;
const updateDailyTracking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId;
        const { sleepHours, date } = req.body;
        yield prismaClient_1.default.user.update({
            where: { id: userId },
            data: {
                sleepHours: parseFloat(sleepHours),
                lastEntryDate: date,
            },
        });
        res.json({ message: 'Tracking updated successfully' });
    }
    catch (error) {
        console.error('Update daily tracking error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.updateDailyTracking = updateDailyTracking;
const updateBasicProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId;
        const { name, email, phone } = req.body;
        yield prismaClient_1.default.user.update({
            where: { id: userId },
            data: { name, email, phone },
        });
        res.json({ message: 'Profile updated successfully' });
    }
    catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.updateBasicProfile = updateBasicProfile;
