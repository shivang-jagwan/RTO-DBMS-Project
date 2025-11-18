-- Traffic Violations Database - Stored Procedures
-- Database procedures for common operations

USE traffic_violations_db;

DELIMITER //

-- ===========================================
-- STORED PROCEDURES
-- ===========================================

-- Procedure to add a new violation
CREATE PROCEDURE add_violation(
    IN p_violation_id VARCHAR(20),
    IN p_violation_type VARCHAR(100),
    IN p_fine_amount DECIMAL(10,2),
    IN p_location VARCHAR(100),
    IN p_violation_date DATE,
    IN p_violation_time TIME,
    IN p_vehicle_type VARCHAR(50),
    IN p_vehicle_color VARCHAR(20),
    IN p_vehicle_model_year INT,
    IN p_registration_state VARCHAR(50),
    IN p_driver_age INT,
    IN p_driver_gender ENUM('Male', 'Female', 'Other'),
    IN p_license_type VARCHAR(50),
    IN p_penalty_points INT,
    IN p_weather_condition VARCHAR(50),
    IN p_road_condition VARCHAR(50),
    IN p_officer_id VARCHAR(20),
    IN p_issuing_agency VARCHAR(100),
    IN p_license_validity ENUM('Valid', 'Expired', 'Suspended'),
    IN p_other_details JSON
)
BEGIN
    DECLARE v_violation_type_id INT;
    DECLARE v_location_id INT;
    DECLARE v_vehicle_type_id INT;
    DECLARE v_weather_id INT;
    DECLARE v_road_condition_id INT;
    DECLARE v_agency_id INT;

    -- Get or create violation type
    SELECT violation_type_id INTO v_violation_type_id
    FROM violation_types
    WHERE violation_name = p_violation_type;

    IF v_violation_type_id IS NULL THEN
        INSERT INTO violation_types (violation_name) VALUES (p_violation_type);
        SET v_violation_type_id = LAST_INSERT_ID();
    END IF;

    -- Get or create location
    SELECT location_id INTO v_location_id
    FROM locations
    WHERE location_name = p_location;

    IF v_location_id IS NULL THEN
        INSERT INTO locations (location_name) VALUES (p_location);
        SET v_location_id = LAST_INSERT_ID();
    END IF;

    -- Get or create vehicle type
    SELECT vehicle_type_id INTO v_vehicle_type_id
    FROM vehicle_types
    WHERE vehicle_type_name = p_vehicle_type;

    IF v_vehicle_type_id IS NULL THEN
        INSERT INTO vehicle_types (vehicle_type_name) VALUES (p_vehicle_type);
        SET v_vehicle_type_id = LAST_INSERT_ID();
    END IF;

    -- Get weather condition
    SELECT weather_id INTO v_weather_id
    FROM weather_conditions
    WHERE weather_type = p_weather_condition;

    -- Get road condition
    SELECT road_condition_id INTO v_road_condition_id
    FROM road_conditions
    WHERE condition_type = p_road_condition;

    -- Get agency
    SELECT agency_id INTO v_agency_id
    FROM issuing_agencies
    WHERE agency_name = p_issuing_agency;

    IF v_agency_id IS NULL THEN
        INSERT INTO issuing_agencies (agency_name) VALUES (p_issuing_agency);
        SET v_agency_id = LAST_INSERT_ID();
    END IF;

    -- Insert the violation
    INSERT INTO violations (
        violation_id, violation_type_id, fine_amount, location_id,
        violation_date, violation_time, vehicle_type_id, vehicle_color,
        vehicle_model_year, registration_state, driver_age, driver_gender,
        license_type, penalty_points, weather_condition_id, road_condition_id,
        officer_id, issuing_agency_id, license_validity
    ) VALUES (
        p_violation_id, v_violation_type_id, p_fine_amount, v_location_id,
        p_violation_date, p_violation_time, v_vehicle_type_id, p_vehicle_color,
        p_vehicle_model_year, p_registration_state, p_driver_age, p_driver_gender,
        p_license_type, p_penalty_points, v_weather_id, v_road_condition_id,
        p_officer_id, v_agency_id, p_license_validity
    );

    -- Update statistics
    CALL update_monthly_stats(p_violation_date);
    CALL update_location_stats(v_location_id);
    CALL update_violation_type_stats(v_violation_type_id);

END //

-- Procedure to get violation statistics
CREATE PROCEDURE get_violation_stats(
    IN p_start_date DATE,
    IN p_end_date DATE,
    OUT p_total_violations INT,
    OUT p_total_fines DECIMAL(15,2),
    OUT p_avg_fine DECIMAL(10,2)
)
BEGIN
    SELECT
        COUNT(*),
        SUM(fine_amount),
        AVG(fine_amount)
    INTO p_total_violations, p_total_fines, p_avg_fine
    FROM violations
    WHERE violation_date BETWEEN p_start_date AND p_end_date;
END //

-- Procedure to update monthly statistics
CREATE PROCEDURE update_monthly_stats(IN p_violation_date DATE)
BEGIN
    DECLARE v_year INT;
    DECLARE v_month INT;

    SET v_year = YEAR(p_violation_date);
    SET v_month = MONTH(p_violation_date);

    INSERT INTO monthly_stats (stat_year, stat_month, total_violations, total_fines, avg_fine)
    SELECT
        v_year,
        v_month,
        COUNT(*),
        SUM(fine_amount),
        AVG(fine_amount)
    FROM violations
    WHERE YEAR(violation_date) = v_year AND MONTH(violation_date) = v_month
    ON DUPLICATE KEY UPDATE
        total_violations = VALUES(total_violations),
        total_fines = VALUES(total_fines),
        avg_fine = VALUES(avg_fine);
END //

-- Procedure to update location statistics
CREATE PROCEDURE update_location_stats(IN p_location_id INT)
BEGIN
    INSERT INTO location_stats (location_id, total_violations, total_fines, avg_fine)
    SELECT
        p_location_id,
        COUNT(*),
        SUM(fine_amount),
        AVG(fine_amount)
    FROM violations
    WHERE location_id = p_location_id
    ON DUPLICATE KEY UPDATE
        total_violations = VALUES(total_violations),
        total_fines = VALUES(total_fines),
        avg_fine = VALUES(avg_fine);
END //

-- Procedure to update violation type statistics
CREATE PROCEDURE update_violation_type_stats(IN p_violation_type_id INT)
BEGIN
    INSERT INTO violation_type_stats (violation_type_id, total_violations, total_fines, avg_fine)
    SELECT
        p_violation_type_id,
        COUNT(*),
        SUM(fine_amount),
        AVG(fine_amount)
    FROM violations
    WHERE violation_type_id = p_violation_type_id
    ON DUPLICATE KEY UPDATE
        total_violations = VALUES(total_violations),
        total_fines = VALUES(total_fines),
        avg_fine = VALUES(avg_fine);
END //

-- Procedure to get hotspots
CREATE PROCEDURE get_hotspots(
    IN p_min_violations INT,
    IN p_start_date DATE,
    IN p_end_date DATE
)
BEGIN
    SELECT
        l.location_name,
        l.state,
        COUNT(*) as total_violations,
        SUM(v.fine_amount) as total_fines,
        AVG(v.fine_amount) as avg_fine,
        COUNT(CASE WHEN v.previous_violations > 0 THEN 1 END) as repeat_offenders
    FROM violations v
    JOIN locations l ON v.location_id = l.location_id
    WHERE v.violation_date BETWEEN p_start_date AND p_end_date
    GROUP BY l.location_id, l.location_name, l.state
    HAVING total_violations >= p_min_violations
    ORDER BY total_violations DESC;
END //

-- Procedure to get repeat offenders
CREATE PROCEDURE get_repeat_offenders(IN p_min_violations INT)
BEGIN
    SELECT
        CONCAT('Driver_', ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC)) as driver_id,
        registration_state,
        COUNT(*) as violation_count,
        SUM(fine_amount) as total_fines,
        AVG(fine_amount) as avg_fine,
        MAX(violation_date) as last_violation,
        GROUP_CONCAT(DISTINCT vt.violation_name ORDER BY vt.violation_name SEPARATOR ', ') as violation_types
    FROM violations v
    JOIN violation_types vt ON v.violation_type_id = vt.violation_type_id
    GROUP BY registration_state
    HAVING violation_count >= p_min_violations
    ORDER BY violation_count DESC, total_fines DESC;
END //

-- ===========================================
-- FUNCTIONS
-- ===========================================

-- Function to calculate risk score for a location
CREATE FUNCTION calculate_location_risk(p_location_id INT) RETURNS DECIMAL(5,2)
DETERMINISTIC
BEGIN
    DECLARE v_violation_count INT;
    DECLARE v_avg_fines DECIMAL(10,2);
    DECLARE v_repeat_offender_ratio DECIMAL(5,2);

    SELECT
        COUNT(*),
        AVG(fine_amount),
        COUNT(CASE WHEN previous_violations > 0 THEN 1 END) / COUNT(*) * 100
    INTO v_violation_count, v_avg_fines, v_repeat_offender_ratio
    FROM violations
    WHERE location_id = p_location_id;

    -- Risk score calculation (simple weighted formula)
    RETURN (v_violation_count * 0.4) + (v_avg_fines / 100 * 0.3) + (v_repeat_offender_ratio * 0.3);
END //

-- Function to get violation severity level
CREATE FUNCTION get_violation_severity(
    p_fine_amount DECIMAL(10,2),
    p_penalty_points INT,
    p_alcohol_level DECIMAL(4,2)
) RETURNS VARCHAR(20)
DETERMINISTIC
BEGIN
    IF p_alcohol_level > 0.15 OR p_penalty_points >= 6 THEN
        RETURN 'Critical';
    ELSEIF p_fine_amount > 2000 OR p_penalty_points >= 4 THEN
        RETURN 'High';
    ELSEIF p_fine_amount > 1000 OR p_penalty_points >= 2 THEN
        RETURN 'Medium';
    ELSE
        RETURN 'Low';
    END IF;
END //

DELIMITER ;

-- ===========================================
-- TRIGGERS
-- ===========================================

-- Trigger to automatically update statistics after violation insert
DELIMITER //

CREATE TRIGGER after_violation_insert
AFTER INSERT ON violations
FOR EACH ROW
BEGIN
    CALL update_monthly_stats(NEW.violation_date);
    CALL update_location_stats(NEW.location_id);
    CALL update_violation_type_stats(NEW.violation_type_id);
END //

DELIMITER ;

-- ===========================================
-- USAGE EXAMPLES
-- ===========================================

/*
-- Example: Add a new violation
CALL add_violation(
    'VLT999999', 'Over-speeding', 1500.00, 'Mumbai', '2023-12-01', '14:30:00',
    'Car', 'Blue', 2020, 'Maharashtra', 28, 'Male', 'Four-Wheeler', 3,
    'Clear', 'Dry', 'OFF9999', 'Traffic Police', 'Valid',
    '{"helmet_worn": "N/A", "seatbelt_worn": "Yes"}'
);

-- Example: Get violation statistics
CALL get_violation_stats('2023-01-01', '2023-12-31', @total, @fines, @avg);
SELECT @total, @fines, @avg;

-- Example: Get hotspots
CALL get_hotspots(5, '2023-01-01', '2023-12-31');

-- Example: Get repeat offenders
CALL get_repeat_offenders(3);

-- Example: Calculate location risk
SELECT location_name, calculate_location_risk(location_id) as risk_score
FROM locations
ORDER BY risk_score DESC;
*/
