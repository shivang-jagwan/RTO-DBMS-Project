const express = require('express');
const router = express.Router();
const ApiService = require('../services/apiService');

// Initialize API service
const apiService = new ApiService('http://localhost:8000');

// Violations list page
router.get('/', async (req, res) => {
    try {
        const {
            page = 1,
            limit = 50,
            violation_type,
            vehicle_type,
            location,
            start_date,
            end_date,
            search
        } = req.query;

        const offset = (page - 1) * limit;

        // Fetch violations with filters
        const violations = await apiService.getViolations({
            skip: offset,
            limit: parseInt(limit),
            violation_type,
            vehicle_type,
            location,
            start_date,
            end_date
        });

        // Get statistics for filters
        const stats = await apiService.getStatistics();

        res.render('violations', {
            title: 'Traffic Violations',
            violations: violations,
            stats: stats,
            currentPage: 'violations',
            filters: {
                violation_type,
                vehicle_type,
                location,
                start_date,
                end_date,
                search
            },
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                hasNext: violations.length === parseInt(limit),
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.error('Violations error:', error);
        res.render('error', {
            title: 'Violations Error',
            message: 'Unable to load violations data',
            error: process.env.NODE_ENV === 'development' ? error : {},
            currentPage: 'violations'
        });
    }
});

// Individual violation details
router.get('/:id', async (req, res) => {
    try {
        const violationId = req.params.id;
        const violation = await apiService.getViolationById(violationId);

        if (!violation) {
            return res.render('404', {
                title: 'Violation Not Found',
                message: 'The requested violation could not be found.'
            });
        }

        res.render('violation-detail', {
            title: `Violation ${violationId}`,
            violation: violation,
            currentPage: 'violations'
        });
    } catch (error) {
        console.error('Violation detail error:', error);
        res.render('error', {
            title: 'Error',
            message: 'Unable to load violation details',
            error: process.env.NODE_ENV === 'development' ? error : {},
            currentPage: 'violations'
        });
    }
});

// API endpoint for violations data (AJAX)
router.get('/api/data', async (req, res) => {
    try {
        const violations = await apiService.getViolations(req.query);
        res.json(violations);
    } catch (error) {
        console.error('Violations API error:', error);
        res.status(500).json({ error: 'Failed to fetch violations data' });
    }
});

module.exports = router;
