import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient';

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ error: 'Please provide all required fields' });
      return;
    }

    // Check if user exists
    const existingUser = await (prisma as any).user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save to db
    const newUser = await (prisma as any).user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        gender: req.body.gender || null,
      },
    });


    res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Please provide email and password' });
      return;
    }

    // Check user
    const user = await (prisma as any).user.findUnique({ where: { email } });

    if (!user) {
      res.status(400).json({ error: 'Invalid credentials' });
      return;
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ error: 'Invalid credentials' });
      return;
    }

    // Generate JWT (expires in 7d)
    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Check if user has a premium purchase (personal consultancy)
    const consultancyPurchase = await (prisma as any).nutritionPlanPurchase.findFirst({
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
    const recipesPurchase = await (prisma as any).nutritionPlanPurchase.findFirst({
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
    const pcodPurchase = await (prisma as any).nutritionPlanPurchase.findFirst({
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

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
