import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import { authMiddleware } from './middleware/authMiddleware';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Routes
app.post('/api/test', (req, res) => res.json({ ok: true }));
console.log('authRoutes:', typeof authRoutes);
app.use('/api', authRoutes);

// Protected Sample Route
app.get('/api/profile', authMiddleware, (req: Request, res: Response) => {
  // `user` is attached by the authMiddleware
  res.json({ message: 'Welcome to your profile', user: (req as any).user });
});

// Basic Error Handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// Refreshing TS Cache