import { Request, Response } from 'express';
import prisma from '../prismaClient';

function getBmiCategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
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

    // Mifflin-St Jeor BMR equation
    let bmr: number;
    const ageNum = parseInt(age);
    if (gender === 'male') {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageNum + 5;
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageNum - 161;
    }

    const activityFactors: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };

    const dailyCalories = Math.round(bmr * (activityFactors[activityLevel] ?? 1.2));

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
    });
  } catch (error) {
    console.error('Health profile update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getHealthProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      profileComplete: user.profileComplete,
      name: user.name,
      email: user.email,
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
    const { name, email } = req.body;

    await prisma.user.update({
      where: { id: userId },
      data: { name, email },
    });

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
