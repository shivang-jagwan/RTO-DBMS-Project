// This file is no longer used for core functionality but is kept for reference or future testing needs.
import type { Vehicle, Violation, DashboardStats, ChartData } from './types';

export const MOCK_VEHICLES: Vehicle[] = [
  { id: '1', reg_no: 'MH12AB1234', owner_name: 'Arjun Sharma', model: 'Maruti Swift', color: 'Red', status: 'Active' },
  { id: '2', reg_no: 'DL8CAX5678', owner_name: 'Priya Patel', model: 'Hyundai Creta', color: 'White', status: 'Active' },
  { id: '3', reg_no: 'KA05MN9012', owner_name: 'Rohan Singh', model: 'Tata Nexon', color: 'Blue', status: 'Inactive' },
  { id: '4', reg_no: 'TN38BQ4567', owner_name: 'Sneha Reddy', model: 'Kia Seltos', color: 'Black', status: 'Active' },
  { id: '5', reg_no: 'UP32LK7890', owner_name: 'Vikram Gupta', model: 'Mahindra XUV700', color: 'Silver', status: 'Active' },
];

export const MOCK_VIOLATIONS: Violation[] = [
  { id: 'v1', vehicle_reg_no: 'MH12AB1234', driver_name: 'Arjun Sharma', violation_type: 'Speeding', fine: 1500, status: 'Unpaid', date: new Date().toISOString() },
  { id: 'v2', vehicle_reg_no: 'DL8CAX5678', driver_name: 'Priya Patel', violation_type: 'Jumping red light', fine: 1000, status: 'Paid', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'v3', vehicle_reg_no: 'KA05MN9012', driver_name: 'Rohan Singh', violation_type: 'No parking', fine: 500, status: 'Unpaid', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'v4', vehicle_reg_no: 'MH12AB1234', driver_name: 'Arjun Sharma', violation_type: 'Using mobile phone', fine: 2000, status: 'Paid', date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'v5', vehicle_reg_no: 'TN38BQ4567', driver_name: 'Sneha Reddy', violation_type: 'Speeding', fine: 1500, status: 'Unpaid', date: new Date().toISOString() },
];

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalVehicles: 1250,
  pendingChallans: 289,
  totalFineCollected: 542500,
  violationsToday: 15,
};

export const MOCK_CHART_DATA: ChartData = {
  paid: 450,
  unpaid: 289,
};

export const getMockVehicleViolations = (regNo: string): Violation[] => {
    return MOCK_VIOLATIONS.filter(v => v.vehicle_reg_no === regNo);
}
