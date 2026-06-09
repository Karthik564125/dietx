import { Request, Response } from 'express';
import prisma from '../prismaClient';

/** GET /api/food-log?date=YYYY-MM-DD  – fetch all entries for a user on a given date */
export const getFoodLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const date = (req.query.date as string) || new Date().toISOString().slice(0, 10);

    const entries = await (prisma as any).foodLog.findMany({
      where: { userId, date },
      orderBy: { createdAt: 'asc' },
    });

    res.json({ entries });
  } catch (error) {
    console.error('getFoodLog error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/** POST /api/food-log  – add one or more entries for the authenticated user */
export const addFoodLogEntries = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    console.log('addFoodLogEntries called by user:', userId);
    console.log('Payload:', JSON.stringify(req.body));
    const { entries } = req.body as {
      entries: Array<{
        name: string;
        quantity: number;
        calories: number;
        mealType: string;
        unit: string;
        time: string;
        date: string; // YYYY-MM-DD
      }>;
    };

    if (!Array.isArray(entries) || entries.length === 0) {
      res.status(400).json({ error: 'entries must be a non-empty array' });
      return;
    }

    const created = await (prisma as any).foodLog.createMany({
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
    const allForDay = await (prisma as any).foodLog.findMany({
      where: { userId, date },
      orderBy: { createdAt: 'asc' },
    });

    res.status(201).json({ count: created.count, entries: allForDay });
  } catch (error) {
    console.error('addFoodLogEntries error:', error);
    if (error instanceof Error) console.error(error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/** DELETE /api/food-log/:id  – remove a single entry (must belong to authenticated user) */
export const deleteFoodLogEntry = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;

    const entry = await (prisma as any).foodLog.findUnique({ where: { id } });

    if (!entry) {
      res.status(404).json({ error: 'Entry not found' });
      return;
    }

    if (entry.userId !== userId) {
      res.status(403).json({ error: 'Not authorised to delete this entry' });
      return;
    }

    await (prisma as any).foodLog.delete({ where: { id } });

    res.json({ message: 'Entry deleted' });
  } catch (error) {
    console.error('deleteFoodLogEntry error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
