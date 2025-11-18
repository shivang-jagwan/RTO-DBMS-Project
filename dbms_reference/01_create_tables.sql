-- Traffic Violations Database - Table Creation Script
-- Generated for DBMS Reference from Indian_Traffic_Violations.csv

-- ===========================================
-- TRAFFIC VIOLATIONS MANAGEMENT SYSTEM
-- ===========================================

-- Create database
CREATE DATABASE IF NOT EXISTS traffic_violations_db;
USE traffic_violations_db;

-- ===========================================
-- NORMALIZED TABLES (Better Design)
-- ===========================================

-- Locations table
CREATE TABLE locations (
    location_id INT AUTO_INCREMENT PRIMARY KEY,
    location_name VARCHAR(100) NOT NULL UNIQUE,
    state VARCHAR(50),
    INDEX idx_location_name (location_name)
);

-- Violation types table
CREATE TABLE violation_types (
    violation_type_id INT AUTO_INCREMENT PRIMARY KEY,
    violation_name VARCHAR(100) NOT NULL UNIQUE,
    base_fine_amount DECIMAL(10,2),
    penalty_points INT DEFAULT 0,
    INDEX idx_violation_name (violation_name)
);

-- Vehicle types table
CREATE TABLE vehicle_types (
    vehicle_type_id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_type_name VARCHAR(50) NOT NULL UNIQUE,
    INDEX idx_vehicle_type_name (vehicle_type_name)
);

-- Officers table
CREATE TABLE officers (
    officer_id VARCHAR(20) PRIMARY KEY,
    officer_name VARCHAR(100),
    issuing_agency VARCHAR(100),
    INDEX idx_agency (issuing_agency)
);

-- Issuing agencies table
CREATE TABLE issuing_agencies (
    agency_id INT AUTO_INCREMENT PRIMARY KEY,
    agency_name VARCHAR(100) NOT NULL UNIQUE,
    INDEX idx_agency_name (agency_name)
);

-- Weather conditions table
CREATE TABLE weather_conditions (
    weather_id INT AUTO_INCREMENT PRIMARY KEY,
    weather_type VARCHAR(50) NOT NULL UNIQUE,
    INDEX idx_weather_type (weather_type)
);

-- Road conditions table
CREATE TABLE road_conditions (
    road_condition_id INT AUTO_INCREMENT PRIMARY KEY,
    condition_type VARCHAR(50) NOT NULL UNIQUE,
    INDEX idx_condition_type (condition_type)
);

-- ===========================================
-- MAIN VIOLATIONS TABLE
-- ===========================================

CREATE TABLE violations (
    violation_id VARCHAR(20) PRIMARY KEY,
    violation_type_id INT,
    fine_amount DECIMAL(10,2) NOT NULL,
    location_id INT,
    violation_date DATE NOT NULL,
    violation_time TIME NOT NULL,
    vehicle_type_id INT,
    vehicle_color VARCHAR(20),
    vehicle_model_year INT,
    registration_state VARCHAR(50),
    driver_age INT,
    driver_gender ENUM('Male', 'Female', 'Other'),
    license_type VARCHAR(50),
    penalty_points INT DEFAULT 0,
    weather_condition_id INT,
    road_condition_id INT,
    officer_id VARCHAR(20),
    issuing_agency_id INT,
    license_validity ENUM('Valid', 'Expired', 'Suspended'),
    number_of_passengers INT,
    helmet_worn ENUM('Yes', 'No', 'N/A'),
    seatbelt_worn ENUM('Yes', 'No', 'N/A'),
    traffic_light_status ENUM('Red', 'Yellow', 'Green'),
    speed_limit INT,
    recorded_speed INT,
    alcohol_level DECIMAL(4,2),
    breathalyzer_result ENUM('Positive', 'Negative', 'Not Conducted'),
    towed ENUM('Yes', 'No'),
    fine_paid ENUM('Yes', 'No'),
    payment_method ENUM('Cash', 'Card', 'Online', 'Not Paid'),
    court_appearance_required ENUM('Yes', 'No'),
    previous_violations INT DEFAULT 0,
    comments TEXT,

    -- Foreign key constraints
    FOREIGN KEY (violation_type_id) REFERENCES violation_types(violation_type_id),
    FOREIGN KEY (location_id) REFERENCES locations(location_id),
    FOREIGN KEY (vehicle_type_id) REFERENCES vehicle_types(vehicle_type_id),
    FOREIGN KEY (weather_condition_id) REFERENCES weather_conditions(weather_id),
    FOREIGN KEY (road_condition_id) REFERENCES road_conditions(road_condition_id),
    FOREIGN KEY (issuing_agency_id) REFERENCES issuing_agencies(agency_id),

    -- Indexes for performance
    INDEX idx_date (violation_date),
    INDEX idx_location (location_id),
    INDEX idx_violation_type (violation_type_id),
    INDEX idx_officer (officer_id),
    INDEX idx_driver_age (driver_age),
    INDEX idx_fine_amount (fine_amount)
);

-- ===========================================
-- AGGREGATION TABLES (For Analytics)
-- ===========================================

-- Monthly statistics table
CREATE TABLE monthly_stats (
    stat_id INT AUTO_INCREMENT PRIMARY KEY,
    stat_year INT NOT NULL,
    stat_month INT NOT NULL,
    total_violations INT DEFAULT 0,
    total_fines DECIMAL(15,2) DEFAULT 0,
    avg_fine DECIMAL(10,2) DEFAULT 0,
    UNIQUE KEY unique_month_year (stat_year, stat_month),
    INDEX idx_year_month (stat_year, stat_month)
);

-- Location statistics table
CREATE TABLE location_stats (
    location_stat_id INT AUTO_INCREMENT PRIMARY KEY,
    location_id INT,
    total_violations INT DEFAULT 0,
    total_fines DECIMAL(15,2) DEFAULT 0,
    avg_fine DECIMAL(10,2) DEFAULT 0,
    FOREIGN KEY (location_id) REFERENCES locations(location_id),
    UNIQUE KEY unique_location (location_id),
    INDEX idx_location_violations (location_id, total_violations)
);

-- Violation type statistics table
CREATE TABLE violation_type_stats (
    violation_stat_id INT AUTO_INCREMENT PRIMARY KEY,
    violation_type_id INT,
    total_violations INT DEFAULT 0,
    total_fines DECIMAL(15,2) DEFAULT 0,
    avg_fine DECIMAL(10,2) DEFAULT 0,
    FOREIGN KEY (violation_type_id) REFERENCES violation_types(violation_type_id),
    UNIQUE KEY unique_violation_type (violation_type_id),
    INDEX idx_violation_type_count (violation_type_id, total_violations)
);

-- ===========================================
-- VIEWS (For Easy Querying)
-- ===========================================

-- Complete violation details view
CREATE VIEW violation_details AS
SELECT
    v.violation_id,
    vt.violation_name,
    v.fine_amount,
    l.location_name,
    l.state,
    v.violation_date,
    v.violation_time,
    veh.vehicle_type_name,
    v.vehicle_color,
    v.vehicle_model_year,
    v.registration_state,
    v.driver_age,
    v.driver_gender,
    v.license_type,
    v.penalty_points,
    wc.weather_type,
    rc.condition_type,
    v.officer_id,
    ia.agency_name,
    v.license_validity,
    v.number_of_passengers,
    v.helmet_worn,
    v.seatbelt_worn,
    v.traffic_light_status,
    v.speed_limit,
    v.recorded_speed,
    v.alcohol_level,
    v.breathalyzer_result,
    v.towed,
    v.fine_paid,
    v.payment_method,
    v.court_appearance_required,
    v.previous_violations,
    v.comments
FROM violations v
LEFT JOIN violation_types vt ON v.violation_type_id = vt.violation_type_id
LEFT JOIN locations l ON v.location_id = l.location_id
LEFT JOIN vehicle_types veh ON v.vehicle_type_id = veh.vehicle_type_id
LEFT JOIN weather_conditions wc ON v.weather_condition_id = wc.weather_id
LEFT JOIN road_conditions rc ON v.road_condition_id = rc.road_condition_id
LEFT JOIN issuing_agencies ia ON v.issuing_agency_id = ia.agency_id;

-- High-risk locations view
CREATE VIEW high_risk_locations AS
SELECT
    l.location_name,
    l.state,
    COUNT(*) as total_violations,
    SUM(v.fine_amount) as total_fines,
    AVG(v.fine_amount) as avg_fine,
    COUNT(CASE WHEN v.previous_violations > 0 THEN 1 END) as repeat_offenders
FROM violations v
JOIN locations l ON v.location_id = l.location_id
GROUP BY l.location_id, l.location_name, l.state
HAVING total_violations > 10
ORDER BY total_violations DESC;

-- Repeat offenders view
CREATE VIEW repeat_offenders AS
SELECT
    CONCAT('Driver_', ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC)) as driver_id,
    v.registration_state,
    COUNT(*) as violation_count,
    SUM(v.fine_amount) as total_fines,
    AVG(v.fine_amount) as avg_fine,
    MAX(v.violation_date) as last_violation,
    GROUP_CONCAT(DISTINCT vt.violation_name SEPARATOR ', ') as violation_types
FROM violations v
JOIN violation_types vt ON v.violation_type_id = vt.violation_type_id
GROUP BY v.registration_state
HAVING violation_count >= 3
ORDER BY violation_count DESC, total_fines DESC;
