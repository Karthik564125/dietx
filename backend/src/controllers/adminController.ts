import { Request, Response } from 'express';
import prisma from '../prismaClient';

export const getAdminData = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminEmail = (req as any).user.email;

    if (adminEmail !== 'nutriwithdietex@gmail.com') {
      res.status(403).json({ error: 'Unauthorized access' });
      return;
    }

    const users = await (prisma as any).user.findMany({
      where: {
        NOT: { email: 'nutriwithdietex@gmail.com' }
      },
      orderBy: { createdAt: 'desc' }
    });


    const purchases = await (prisma as any).nutritionPlanPurchase.findMany({
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
          totalRevenue: purchases.reduce((sum: number, p: any) => sum + p.amount, 0)
        }
      }
    });
  } catch (error) {
    console.error('Admin data fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
