"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
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
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
// Load debug routes conditionally — some deploys may omit debugRoutes file
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
let debugRoutes = null;
try {
    const possibleTs = path_1.default.join(__dirname, 'routes', 'debugRoutes.ts');
    const possibleJs = path_1.default.join(__dirname, 'routes', 'debugRoutes.js');
    if (fs_1.default.existsSync(possibleJs) || fs_1.default.existsSync(possibleTs)) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        debugRoutes = require('./routes/debugRoutes').default;
    }
    else {
        console.log('debugRoutes file not present in build — skipping debug routes');
    }
}
catch (e) {
    console.warn('Could not load debugRoutes:', e);
}
const authMiddleware_1 = require("./middleware/authMiddleware");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Simple request logger for debugging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - headers:`, { authorization: req.headers.authorization });
    next();
});
// Routes
app.post('/api/test', (req, res) => res.json({ ok: true }));
console.log('authRoutes:', typeof authRoutes_1.default);
app.use('/api', authRoutes_1.default);
app.use('/api', paymentRoutes_1.default);
// Debug routes (no auth) — REMOVE in production
app.use('/api/debug', debugRoutes);
// Dump registered routes for debugging (safe guard)
setTimeout(() => {
    try {
        const router = app._router;
        if (!router || !router.stack) {
            console.log('Registered routes: unavailable (router not initialized yet)');
            return;
        }
        const routes = router.stack
            .filter((r) => r.route)
            .map((r) => ({ path: r.route.path, methods: r.route.methods }));
        console.log('Registered routes:', routes);
    }
    catch (e) {
        console.error('Could not list routes', e);
    }
}, 1000);
// Protected Sample Route
app.get('/api/profile', authMiddleware_1.authMiddleware, (req, res) => {
    // `user` is attached by the authMiddleware
    res.json({ message: 'Welcome to your profile', user: req.user });
});
// Basic Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
// Refreshing TS Cache
