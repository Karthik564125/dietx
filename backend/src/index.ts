import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
// Process-level handlers to surface exit/rejection reasons while debugging
process.on('exit', (code) => {
  console.log('Process exiting with code:', code);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});
import authRoutes from './routes/authRoutes';
import paymentRoutes from './routes/paymentRoutes';
import debugRoutes from './routes/debugRoutes';
import { authMiddleware } from './middleware/authMiddleware';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Simple request logger for debugging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path} - headers:`, { authorization: req.headers.authorization });
  next();
});

// Routes
app.post('/api/test', (req, res) => res.json({ ok: true }));
console.log('authRoutes:', typeof authRoutes);
app.use('/api', authRoutes);
app.use('/api', paymentRoutes);
// Debug routes (no auth) — REMOVE in production
app.use('/api/debug', debugRoutes);

// Dump registered routes for debugging (safe guard)
setTimeout(() => {
  try {
    const router = (app as any)._router;
    if (!router || !router.stack) {
      console.log('Registered routes: unavailable (router not initialized yet)');
      return;
    }
    const routes: any[] = router.stack
      .filter((r: any) => r.route)
      .map((r: any) => ({ path: r.route.path, methods: r.route.methods }));
    console.log('Registered routes:', routes);
  } catch (e) {
    console.error('Could not list routes', e);
  }
}, 1000);


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