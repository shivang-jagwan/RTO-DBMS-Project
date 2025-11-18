const express = require('express');
const router = express.Router();
const ApiService = require('../services/apiService');

// Initialize API service with dynamic base URL
const getApiBaseUrl = (req) => {
    if (process.env.NODE_ENV === 'production') {
        return `https://${req.get('host')}`;
    }
    return process.env.API_BASE_URL || 'http://localhost:8000';
};

// Dashboard home page
router.get('/', async (req, res) => {
    try {
        const apiService = new ApiService(getApiBaseUrl(req));
        
        // Fetch all dashboard data in parallel
        const [stats, hotspots, trends] = await Promise.all([
            apiService.getStatistics(),
            apiService.getHotspots(),
            apiService.getTrends('monthly')
        ]);

        res.render('dashboard', {
            title: 'Traffic Violation Dashboard',
            stats: stats,
            hotspots: hotspots.slice(0, 10), // Top 10 hotspots
            trends: trends,
            currentPage: 'dashboard',
            chartData: {
                violations: stats.top_violations || {},
                locations: stats.top_locations || {},
                hourly: stats.violations_by_hour || {},
                vehicles: stats.vehicle_types || {},
                trends: {
                    labels: trends.dates || trends.labels || [],
                    data: trends.counts
                }
            }
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.render('error', {
            title: 'Dashboard Error',
            message: 'Unable to load dashboard data',
            error: process.env.NODE_ENV === 'development' ? error : {},
            currentPage: 'dashboard'
        });
    }
});

// API endpoint for refreshing dashboard data (AJAX)
router.get('/data', async (req, res) => {
    try {
        const stats = await apiService.getStatistics();
        res.json(stats);
    } catch (error) {
        console.error('Dashboard data error:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
});

module.exports = router;
