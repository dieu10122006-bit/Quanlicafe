import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import http from 'http';
import { Server } from 'socket.io';

// Load environment variables
dotenv.config();

// Constants for paths
const __dirname = path.resolve();

const app = express();
app.set('trust proxy', 1);
const PORT = 3000;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

app.set('io', io);

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Import routes
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import paymentRoutes from './routes/payments.js';
import reportRoutes from './routes/reports.js';
import employeeRoutes from './routes/employees.js';
import productController from './controllers/productController.js';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Server logging
import morgan from 'morgan';
app.use(morgan('dev'));

// Rate limiting
import rateLimit from 'express-rate-limit';
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: { success: false, message: 'Too many requests, please try again later.' }
});

// Apply the rate limiting middleware to API calls only
app.use('/api/', apiLimiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', productController.getAllCategories);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/employees', employeeRoutes);

// Static files
app.use(express.static(path.join(__dirname, 'frontend_src')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend_src', 'pages', 'login.html'));
});

app.get('/pages/:page', (req, res) => {
    const page = req.params.page;
    if (page.endsWith('.html')) {
        res.sendFile(path.join(__dirname, 'frontend_src', 'pages', page));
    } else {
        res.sendFile(path.join(__dirname, 'frontend_src', 'pages', `${page}.html`));
    }
});

app.get('*', (req, res) => {
    // Only redirect to login for non-api and non-asset requests
    const isAsset = /\.(js|css|png|jpg|jpeg|gif|svg|ico|json|woff|woff2|ttf|otf)$/.test(req.path);
    
    if (!req.path.startsWith('/api') && !isAsset) {
        res.sendFile(path.join(__dirname, 'frontend_src', 'pages', 'login.html'));
    } else if (isAsset) {
        res.status(404).send('Asset not found');
    }
});

// Global error handler
import { Request, Response, NextFunction } from 'express';
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`✓ Server running at http://0.0.0.0:${PORT}`);
});
