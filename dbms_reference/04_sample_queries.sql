-- Traffic Violations Database - Sample Queries and Analytics
-- Useful SQL queries for data analysis and reporting

USE traffic_violations_db;

-- ===========================================
-- BASIC ANALYTICS QUERIES
-- ===========================================

-- 1. Total violations and statistics
SELECT
    COUNT(*) as total_violations,
    SUM(fine_amount) as total_fines,
    AVG(fine_amount) as avg_fine,
    MIN(violation_date) as earliest_violation,
    MAX(violation_date) as latest_violation
FROM violations;

-- 2. Violations by type
SELECT
    vt.violation_name,
    COUNT(*) as count,
    SUM(v.fine_amount) as total_fines,
    AVG(v.fine_amount) as avg_fine
FROM violations v
JOIN violation_types vt ON v.violation_type_id = vt.violation_type_id
GROUP BY vt.violation_type_id, vt.violation_name
ORDER BY count DESC;

-- 3. Violations by location
SELECT
    l.location_name,
    l.state,
    COUNT(*) as count,
    SUM(v.fine_amount) as total_fines,
    AVG(v.fine_amount) as avg_fine
FROM violations v
JOIN locations l ON v.location_id = l.location_id
GROUP BY l.location_id, l.location_name, l.state
ORDER BY count DESC;

-- 4. Monthly trend analysis
SELECT
    YEAR(violation_date) as year,
    MONTH(violation_date) as month,
    COUNT(*) as violations_count,
    SUM(fine_amount) as total_fines
FROM violations
GROUP BY YEAR(violation_date), MONTH(violation_date)
ORDER BY year DESC, month DESC;

-- 5. Violations by vehicle type
SELECT
    vt.vehicle_type_name,
    COUNT(*) as count,
    SUM(v.fine_amount) as total_fines,
    AVG(v.fine_amount) as avg_fine
FROM violations v
JOIN vehicle_types vt ON v.vehicle_type_id = vt.vehicle_type_id
GROUP BY vt.vehicle_type_id, vt.vehicle_type_name
ORDER BY count DESC;

-- ===========================================
-- ADVANCED ANALYTICS QUERIES
-- ===========================================

-- 6. Repeat offenders analysis
SELECT
    registration_state as driver_identifier,
    COUNT(*) as violation_count,
    SUM(fine_amount) as total_fines,
    AVG(fine_amount) as avg_fine,
    MIN(violation_date) as first_violation,
    MAX(violation_date) as last_violation,
    GROUP_CONCAT(DISTINCT vt.violation_name ORDER BY vt.violation_name) as violation_types
FROM violations v
JOIN violation_types vt ON v.violation_type_id = vt.violation_type_id
GROUP BY registration_state
HAVING violation_count >= 3
ORDER BY violation_count DESC, total_fines DESC;

-- 7. Time-based analysis (hourly patterns)
SELECT
    HOUR(violation_time) as hour_of_day,
    COUNT(*) as violations_count,
    SUM(fine_amount) as total_fines
FROM violations
GROUP BY HOUR(violation_time)
ORDER BY hour_of_day;

-- 8. Weather and road condition impact
SELECT
    wc.weather_type,
    rc.condition_type,
    COUNT(*) as violations_count,
    SUM(v.fine_amount) as total_fines,
    AVG(v.fine_amount) as avg_fine
FROM violations v
JOIN weather_conditions wc ON v.weather_condition_id = wc.weather_id
JOIN road_conditions rc ON v.road_condition_id = rc.road_condition_id
GROUP BY wc.weather_id, wc.weather_type, rc.road_condition_id, rc.condition_type
ORDER BY violations_count DESC;

-- 9. Officer performance analysis
SELECT
    o.officer_id,
    o.officer_name,
    ia.agency_name,
    COUNT(*) as violations_issued,
    SUM(v.fine_amount) as total_fines_collected,
    AVG(v.fine_amount) as avg_fine_per_violation
FROM violations v
JOIN officers o ON v.officer_id = o.officer_id
JOIN issuing_agencies ia ON v.issuing_agency_id = ia.agency_id
GROUP BY o.officer_id, o.officer_name, ia.agency_name
ORDER BY violations_issued DESC;

-- 10. Age group analysis
SELECT
    CASE
        WHEN driver_age < 25 THEN 'Under 25'
        WHEN driver_age BETWEEN 25 AND 35 THEN '25-35'
        WHEN driver_age BETWEEN 36 AND 50 THEN '36-50'
        WHEN driver_age BETWEEN 51 AND 65 THEN '51-65'
        ELSE 'Over 65'
    END as age_group,
    COUNT(*) as violations_count,
    SUM(fine_amount) as total_fines,
    AVG(fine_amount) as avg_fine
FROM violations
GROUP BY
    CASE
        WHEN driver_age < 25 THEN 'Under 25'
        WHEN driver_age BETWEEN 25 AND 35 THEN '25-35'
        WHEN driver_age BETWEEN 36 AND 50 THEN '36-50'
        WHEN driver_age BETWEEN 51 AND 65 THEN '51-65'
        ELSE 'Over 65'
    END
ORDER BY violations_count DESC;

-- ===========================================
-- HOTSPOT DETECTION QUERIES
-- ===========================================

-- 11. Location hotspots (using simple clustering)
SELECT
    l.location_name,
    l.state,
    COUNT(*) as violation_count,
    ROUND(COUNT(*) / (SELECT COUNT(*) FROM violations) * 100, 2) as percentage_of_total,
    SUM(fine_amount) as total_fines,
    AVG(fine_amount) as avg_fine
FROM violations v
JOIN locations l ON v.location_id = l.location_id
GROUP BY l.location_id, l.location_name, l.state
HAVING violation_count > 5
ORDER BY violation_count DESC
LIMIT 10;

-- 12. Violation type hotspots by location
SELECT
    l.location_name,
    vt.violation_name,
    COUNT(*) as count,
    SUM(v.fine_amount) as total_fines
FROM violations v
JOIN locations l ON v.location_id = l.location_id
JOIN violation_types vt ON v.violation_type_id = vt.violation_type_id
GROUP BY l.location_id, l.location_name, vt.violation_type_id, vt.violation_name
ORDER BY count DESC
LIMIT 20;

-- ===========================================
-- PAYMENT AND LEGAL ANALYSIS
-- ===========================================

-- 13. Payment method analysis
SELECT
    payment_method,
    COUNT(*) as transactions_count,
    SUM(fine_amount) as total_amount,
    ROUND(AVG(fine_amount), 2) as avg_amount,
    COUNT(CASE WHEN court_appearance_required = 'Yes' THEN 1 END) as court_cases
FROM violations
WHERE fine_paid = 'Yes'
GROUP BY payment_method
ORDER BY transactions_count DESC;

-- 14. Court appearance analysis
SELECT
    court_appearance_required,
    COUNT(*) as violations_count,
    SUM(fine_amount) as total_fines,
    AVG(fine_amount) as avg_fine,
    COUNT(CASE WHEN previous_violations > 0 THEN 1 END) as repeat_offenders
FROM violations
GROUP BY court_appearance_required;

-- ===========================================
-- PREDICTIVE ANALYTICS QUERIES
-- ===========================================

-- 15. Risk factors correlation
SELECT
    CASE WHEN alcohol_level > 0.05 THEN 'High Alcohol' ELSE 'Low/No Alcohol' END as alcohol_risk,
    CASE WHEN recorded_speed > speed_limit THEN 'Speeding' ELSE 'Normal Speed' END as speed_risk,
    CASE WHEN previous_violations > 0 THEN 'Repeat Offender' ELSE 'First Time' END as repeat_risk,
    COUNT(*) as violations_count,
    AVG(fine_amount) as avg_fine,
    AVG(penalty_points) as avg_points
FROM violations
GROUP BY
    CASE WHEN alcohol_level > 0.05 THEN 'High Alcohol' ELSE 'Low/No Alcohol' END,
    CASE WHEN recorded_speed > speed_limit THEN 'Speeding' ELSE 'Normal Speed' END,
    CASE WHEN previous_violations > 0 THEN 'Repeat Offender' ELSE 'First Time' END
ORDER BY violations_count DESC;
