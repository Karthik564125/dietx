import { Router, Request, Response } from 'express';
import prisma from '../prismaClient';

const router = Router();
console.log('Debug routes loaded');

// GET /api/debug/insert-food?userId=XYZ
router.get('/insert-food', async (req: Request, res: Response) => {
  try {
    const userId = (req.query.userId as string) || 'debug-user-1';
    const today = new Date().toISOString().slice(0,10);
    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    const created = await (prisma as any).foodLog.create({
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
  } catch (err) {
    console.error('debug insert-food error:', err);
    res.status(500).json({ error: 'failed', details: String(err) });
  }
});

export default router;
