const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');

// Routes
const dashboardRoutes = require('./routes/dashboard');
const violationsRoutes = require('./routes/violations');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const PORT = process.env.PORT || 3000;

// Backend API base URL - Updated for Vercel deployment
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://your-app.vercel.app'
  : 'http://localhost:8000';

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? true : '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Make API base URL available to all routes
app.locals.apiBaseUrl = API_BASE_URL;

// Proxy API requests
app.use('/api', createProxyMiddleware({
    target: API_BASE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api': '', // remove /api prefix when forwarding
    },
}));

// Custom render function to use layout
app.use((req, res, next) => {
    const originalRender = res.render;
    res.render = function(view, options = {}, callback) {
        options.template = view;
        originalRender.call(this, 'layout', options, callback);
    };
    next();
});

// API Proxy routes to handle CORS
app.use('/api/payment', createProxyMiddleware({
    target: API_BASE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api/payment': '/api/payment'
    },
    onError: (err, req, res) => {
        console.error('Proxy Error:', err.message);
        res.status(500).json({
            error: 'Backend connection failed',
            message: 'Cannot connect to payment service'
        });
    },
    onProxyReq: (proxyReq, req, res) => {
        console.log(`🔄 Proxying ${req.method} ${req.path} to ${API_BASE_URL}${req.path}`);
    }
}));

// Routes
app.use('/', dashboardRoutes);
app.use('/violations', violationsRoutes);
app.use('/analytics', analyticsRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).render('404', {
        title: 'Page Not Found',
        message: 'The page you are looking for does not exist.',
        currentPage: ''
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', {
        title: 'Server Error',
        message: 'Something went wrong on our end.',
        error: process.env.NODE_ENV === 'development' ? err : {},
        currentPage: ''
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Frontend server running on http://localhost:${PORT}`);
    console.log(`Connecting to backend API at: ${API_BASE_URL}`);
});

module.exports = app;
