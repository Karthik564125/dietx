const { PrismaClient } = require('./src/generated/prisma');

const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function run() {
  const email = 'nutriwithdietex@gmail.com';
  const password = 'dietx@123';
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: { password: hashedPassword },
      create: {
        name: 'Diet X Admin',
        email,
        password: hashedPassword,
        profileComplete: true
      },
    });
    console.log('Admin user created/updated successfully:', user.email);
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err);
    process.exit(1);
  }
}
run();
