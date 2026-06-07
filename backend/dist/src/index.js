"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const authMiddleware_1 = require("./middleware/authMiddleware");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.post('/api/test', (req, res) => res.json({ ok: true }));
console.log('authRoutes:', typeof authRoutes_1.default);
app.use('/api', authRoutes_1.default);
app.use('/api', paymentRoutes_1.default);
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
