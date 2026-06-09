const { MailService } = require('./dist/src/services/mailService');

const sample = {
  user: {
    id: 'test-user-1',
    name: 'Test User',
    email: 'testuser@example.com',
    phone: '9999999999',
    age: 30,
    gender: 'female',
    height: 165,
    weight: 65,
    activityLevel: 'moderate',
    bmi: 23.9,
    dailyCalories: 2000
  },
  payment: {
    orderId: 'order_test_123',
    paymentId: 'pay_test_456',
    amount: 1499,
    date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
  }
};

MailService.sendConsultationMail(sample)
  .then(info => {
    console.log('Mail send result:', info && info.messageId ? info.messageId : info);
    process.exit(0);
  })
  .catch(err => {
    console.error('Mail send failed:', err);
    process.exit(1);
  });
