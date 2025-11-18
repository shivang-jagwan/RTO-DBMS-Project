const express = require('express');
const router = express.Router();
const ApiService = require('../services/apiService');

// Initialize API service
const apiService = new ApiService('http://localhost:8000');

// Analytics overview page
router.get('/', async (req, res) => {
    try {
        // Fetch all analytics data in parallel
        const [hotspots, trends, repeatOffenders] = await Promise.all([
            apiService.getHotspots(),
            apiService.getTrends('monthly'),
            apiService.getRepeatOffenders()
        ]);

        res.render('analytics', {
            title: 'Analytics & Insights',
            hotspots: hotspots,
            trends: trends,
            repeatOffenders: repeatOffenders,
            currentPage: 'analytics'
        });
    } catch (error) {
        console.error('Analytics error:', error);
        res.render('error', {
            title: 'Analytics Error',
            message: 'Unable to load analytics data',
            error: process.env.NODE_ENV === 'development' ? error : {},
            currentPage: 'analytics'
        });
    }
});

// Hotspots page
router.get('/hotspots', async (req, res) => {
    try {
        const { eps = 0.1, min_samples = 5 } = req.query;
        const hotspots = await apiService.getHotspots(parseFloat(eps), parseInt(min_samples));

        res.render('hotspots', {
            title: 'Violation Hotspots',
            hotspots: hotspots,
            currentPage: 'analytics',
            params: { eps, min_samples }
        });
    } catch (error) {
        console.error('Hotspots error:', error);
        res.render('error', {
            title: 'Hotspots Error',
            message: 'Unable to load hotspots data',
            error: process.env.NODE_ENV === 'development' ? error : {},
            currentPage: 'analytics'
        });
    }
});

// Trends page
router.get('/trends', async (req, res) => {
    try {
        const { time_period = 'monthly' } = req.query;
        const trends = await apiService.getTrends(time_period);

        res.render('trends', {
            title: 'Violation Trends',
            trends: trends,
            currentPage: 'analytics',
            timePeriod: time_period
        });
    } catch (error) {
        console.error('Trends error:', error);
        res.render('error', {
            title: 'Trends Error',
            message: 'Unable to load trends data',
            error: process.env.NODE_ENV === 'development' ? error : {},
            currentPage: 'analytics'
        });
    }
});

// Repeat offenders page
router.get('/repeat-offenders', async (req, res) => {
    try {
        const { min_violations = 3 } = req.query;
        const repeatOffenders = await apiService.getRepeatOffenders(parseInt(min_violations));

        res.render('repeat-offenders', {
            title: 'Repeat Offenders',
            repeatOffenders: repeatOffenders,
            currentPage: 'analytics',
            minViolations: min_violations
        });
    } catch (error) {
        console.error('Repeat offenders error:', error);
        res.render('error', {
            title: 'Repeat Offenders Error',
            message: 'Unable to load repeat offenders data',
            error: process.env.NODE_ENV === 'development' ? error : {},
            currentPage: 'analytics'
        });
    }
});

module.exports = router;
