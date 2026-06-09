const axios = require('axios');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';
const API = 'http://localhost:5001/api/food-log';

(async () => {
  try {
    const token = jwt.sign({ userId: 'test-user-1', email: 'test@example.com' }, JWT_SECRET);
    const entries = [
      {
        name: 'Test Sandwich',
        quantity: 1,
        calories: 123,
        protein: 5,
        carbs: 20,
        fats: 3,
        mealType: 'Breakfast',
        unit: 'serving',
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toISOString().slice(0,10),
      }
    ];

    const res = await axios.post(API, { entries }, { headers: { Authorization: `Bearer ${token}` } });
    console.log('Status:', res.status);
    console.log('Data:', res.data);
  } catch (err) {
    if (err.response) {
      console.error('Response error:', err.response.status, err.response.data);
    } else {
      console.error('Error:', err.message);
    }
  }
})();
