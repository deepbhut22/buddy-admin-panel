// services/dashboardService.js
import axios from 'axios';

const API_URL = '/api/dashboard';

// Get dashboard data
export const getDashboardData = async (period = 'month') => {
    try {
        const response = await axios.get(`${API_URL}?period=${period}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        throw error;
    }
};

// Get redemption analytics
export const getRedemptionAnalytics = async (filters = {}) => {
    try {
        const { startDate, endDate, category, company, type } = filters as { startDate: string, endDate: string, category: string, company: string, type: string };
        let queryString = '';

        if (startDate) queryString += `startDate=${startDate}&`;
        if (endDate) queryString += `endDate=${endDate}&`;
        if (category) queryString += `category=${category}&`;
        if (company) queryString += `company=${company}&`;
        if (type) queryString += `type=${type}&`;

        const response = await axios.get(`${API_URL}/redemption-analytics?${queryString}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching redemption analytics:', error);
        throw error;
    }
};

// Get user analytics
export const getUserAnalytics = async () => {
    try {
        const response = await axios.get(`${API_URL}/user-analytics`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user analytics:', error);
        throw error;
    }
};

// Get summary reports
export const getSummaryReports = async () => {
    try {
        const response = await axios.get(`${API_URL}/summary`);
        return response.data;
    } catch (error) {
        console.error('Error fetching summary reports:', error);
        throw error;
    }
};

export default {
    getDashboardData,
    getRedemptionAnalytics,
    getUserAnalytics,
    getSummaryReports
};