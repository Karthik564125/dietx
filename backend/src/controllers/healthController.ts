import { Request, Response } from 'express';
import prisma from '../prismaClient';

function getBmiCategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

function calculateIdealWeight(gender: string, heightCm: number): number {
  if (!heightCm) return 0;
  const inchesOver60 = (heightCm / 2.54) - 60;
  if (gender === 'male') {
    return 50 + 2.3 * inchesOver60;
  } else {
    return 45.5 + 2.3 * inchesOver60;
  }
}

export const updateHealthProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const { age, gender, heightUnit, weightUnit, activityLevel } = req.body;

    // Convert height to cm regardless of input unit
    let heightCm: number;
    if (heightUnit === 'ft_in') {
      const feet = parseFloat(req.body.feet || '0');
      const inches = parseFloat(req.body.inches || '0');
      heightCm = (feet * 12 + inches) * 2.54;
    } else {
      heightCm = parseFloat(req.body.height);
    }

    // Convert weight to kg regardless of input unit
    let weightKg: number;
    if (weightUnit === 'lbs') {
      weightKg = parseFloat(req.body.weight) * 0.453592;
    } else {
      weightKg = parseFloat(req.body.weight);
    }

    // Calculate BMI
    const heightM = heightCm / 100;
    const bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(1));

    // Harris-Benedict BMR equation
    let bmr: number;
    const ageNum = parseInt(age);
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * ageNum);
    } else {
      bmr = 447.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * ageNum);
    }

    const activityFactors: Record<string, number> = {
      sedentary: 1.2,
      light: 1.3,
      moderate: 1.5,
      active: 1.7,
      veryActive: 1.9,
    };

    const dailyCalories = Math.round(bmr * (activityFactors[activityLevel] ?? 1.2));
    const idealWeight = calculateIdealWeight(gender, heightCm);

    await prisma.user.update({
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
  } catch (error) {
    console.error('Health profile update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getHealthProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } }) as any;

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Check if user has a premium purchase (personal consultancy)
    const consultancyPurchase = await (prisma as any).nutritionPlanPurchase.findFirst({
      where: { userId, status: 'completed', amount: { in: [299, 499] } }
    });

    // Check if user has unlocked recipes
    const recipesPurchase = await (prisma as any).nutritionPlanPurchase.findFirst({
      where: { userId, status: 'completed', amount: { in: [99, 299, 499] } }
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
        waterIntake: user.waterIntake,
        sleepHours: user.sleepHours,
        lastEntryDate: user.lastEntryDate,
      },
    });
  } catch (error) {
    console.error('Get health profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateDailyTracking = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const { waterIntake, sleepHours, date } = req.body;

    await prisma.user.update({
      where: { id: userId },
      data: {
        waterIntake: parseInt(waterIntake),
        sleepHours: parseFloat(sleepHours),
        lastEntryDate: date,
      },
    });

    res.json({ message: 'Tracking updated successfully' });
  } catch (error) {
    console.error('Update daily tracking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateBasicProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const { name, email, phone } = req.body;

    await (prisma as any).user.update({
      where: { id: userId },
      data: { name, email, phone },
    });

    res.json({ message: 'Profile updated successfully' });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};