import 'dotenv/config';
import prisma from './src/prismaClient';

async function run() {
  try {
    const testUser = 'debug-user-1';
    const today = new Date().toISOString().slice(0,10);
    const nowTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    const entry = {
      userId: testUser,
      date: today,
      name: 'Direct Prisma Insert Test',
      quantity: 1,
      calories: 77,
      protein: 2,
      carbs: 10,
      fats: 1,
      mealType: 'Lunch',
      unit: 'serving',
      time: nowTime,
    };

    const created = await (prisma as any).foodLog.create({ data: entry });
    console.log('Inserted row id:', created.id);

    const recent = await (prisma as any).foodLog.findMany({ where: { userId: testUser, date: today }, orderBy: { createdAt: 'desc' } });
    console.log('Recent entries for', testUser, recent);
  } catch (err) {
    console.error('prisma error:', err);
    if (err instanceof Error) console.error(err.stack);
  } finally {
    await prisma.$disconnect();
  }
}

run();
