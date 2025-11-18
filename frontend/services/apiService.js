const axios = require('axios');

class ApiService {
    constructor(baseURL) {
        this.client = axios.create({
            baseURL: baseURL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Add response interceptor for error handling
        this.client.interceptors.response.use(
            response => response,
            error => {
                console.error('API Error:', error.message);
                return Promise.reject(error);
            }
        );
    }

    // Dashboard statistics
    async getStatistics() {
        try {
            const response = await this.client.get('/api/violations/stats');
            return response.data;
        } catch (error) {
            console.error('Error fetching statistics:', error);
            return {
                total_violations: 0,
                total_fines: 0,
                avg_fine_amount: 0,
                top_violations: {},
                top_locations: {},
                vehicle_types: {},
                violations_by_hour: {},
                violations_by_day: {},
                violations_by_month: {}
            };
        }
    }

    // Get violations with filtering and pagination
    async getViolations(params = {}) {
        try {
            const response = await this.client.get('/api/violations/', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching violations:', error);
            return [];
        }
    }

    // Get violation by ID
    async getViolationById(violationId) {
        try {
            const response = await this.client.get(`/api/violations/${violationId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching violation:', error);
            return null;
        }
    }

    // Get hotspots
    async getHotspots(eps = 0.1, minSamples = 5) {
        try {
            const response = await this.client.get('/api/violations/hotspots', {
                params: { eps, min_samples: minSamples }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching hotspots:', error);
            return [];
        }
    }

    // Get repeat offenders
    async getRepeatOffenders(minViolations = 3) {
        try {
            const response = await this.client.get('/api/violations/repeat-offenders', {
                params: { min_violations: minViolations }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching repeat offenders:', error);
            return [];
        }
    }

    // Get violation trends
    async getTrends(timePeriod = 'monthly') {
        try {
            const response = await this.client.get('/api/violations/trends', {
                params: { time_period: timePeriod }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching trends:', error);
            return { dates: [], counts: [] };
        }
    }

    // Get dashboard data
    async getDashboardData() {
        try {
            const response = await this.client.get('/api/dashboard');
            return response.data;
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            return {};
        }
    }
}

module.exports = ApiService;
