-- Traffic Violations Database - Main Data Insertion
-- Insert violation records from CSV data

USE traffic_violations_db;

-- ===========================================
-- INSERT VIOLATION RECORDS
-- ===========================================
-- Note: This is a sample of the actual data insertion.
-- In practice, you would use a data import tool or script to bulk insert all records.

INSERT INTO violations (
    violation_id, violation_type_id, fine_amount, location_id,
    violation_date, violation_time, vehicle_type_id, vehicle_color,
    vehicle_model_year, registration_state, driver_age, driver_gender,
    license_type, penalty_points, weather_condition_id, road_condition_id,
    officer_id, issuing_agency_id, license_validity, number_of_passengers,
    helmet_worn, seatbelt_worn, traffic_light_status, speed_limit,
    recorded_speed, alcohol_level, breathalyzer_result, towed,
    fine_paid, payment_method, court_appearance_required,
    previous_violations, comments
) VALUES
-- Sample records (first few from CSV)
('VLT100000', 1, 4544.00, 1, '2023-01-01', '23:02:00', 1, 'Red', 2012, 'West Bengal', 25, 'Male', 'Commercial', 5, 2, 3, 'OFF9971', 1, 'Valid', 4, 'N/A', 'Yes', 'Green', 100, 95, 0.03, 'Negative', 'Yes', 'No', 'Online', 'Yes', 3, 'Repeat Offender'),
('VLT100001', 2, 2776.00, 2, '2023-01-02', '00:42:00', 2, 'Silver', 2010, 'Tamil Nadu', 32, 'Female', 'Commercial', 4, 3, 1, 'OFF6000', 2, 'Valid', 4, 'N/A', 'No', 'Green', 40, 48, 0.45, 'Negative', 'Yes', 'Yes', 'Online', 'No', 2, 'Repeat Offender'),
('VLT100002', 3, 4785.00, 3, '2023-01-03', '04:32:00', 2, 'Grey', 2006, 'Tamil Nadu', 67, 'Female', 'Two-Wheeler', 8, 1, 4, 'OFF5706', 1, 'Valid', 5, 'Yes', 'Yes', 'Yellow', 80, 26, 0.31, 'Not Conducted', 'No', 'No', 'Not Paid', 'Yes', 4, ''),
('VLT100003', 4, 1138.00, 4, '2023-01-04', '15:06:00', 1, 'Green', 1996, 'Uttar Pradesh', 46, 'Male', 'Learner', 3, 3, 2, 'OFF5575', 2, 'Valid', 2, 'No', 'No', 'Green', 100, 115, 0.09, 'Not Conducted', 'No', 'Yes', 'Online', 'No', 5, 'Repeat Offender'),
('VLT100004', 5, 1610.00, 1, '2023-01-05', '06:57:00', 3, 'Yellow', 2016, 'Delhi', 63, 'Female', 'Four-Wheeler', 4, 4, 4, 'OFF7147', 3, 'Valid', 4, 'N/A', 'No', 'Red', 30, 115, 0.28, 'Positive', 'No', 'Yes', 'Cash', 'Yes', 0, ''),
('VLT100005', 5, 4636.00, 3, '2023-01-06', '16:36:00', 4, 'White', 2013, 'Gujarat', 33, 'Male', 'Commercial', 2, 3, 1, 'OFF2122', 4, 'Valid', 5, 'Yes', 'N/A', 'Green', 100, 87, 0.17, 'Negative', 'Yes', 'No', 'Card', 'No', 3, 'Fine Paid On Spot'),
('VLT100006', 6, 2793.00, 6, '2023-01-07', '02:03:00', 2, 'Silver', 2018, 'Delhi', 42, 'Other', 'Learner', 0, 5, 1, 'OFF6500', 1, 'Valid', 2, 'N/A', 'N/A', 'Green', 30, 24, 0.50, 'Not Conducted', 'Yes', 'Yes', 'Cash', 'Yes', 1, ''),
('VLT100007', 5, 3965.00, 5, '2023-01-08', '16:23:00', 3, 'Yellow', 2009, 'Punjab', 28, 'Male', 'Four-Wheeler', 2, 1, 5, 'OFF1220', 1, 'Valid', 2, 'N/A', 'No', 'Green', 60, 119, 0.19, 'Positive', 'No', 'No', 'Not Paid', 'No', 2, 'Fine Paid On Spot'),
('VLT100008', 4, 4497.00, 4, '2023-01-09', '18:09:00', 4, 'Green', 2021, 'Maharashtra', 34, 'Female', 'Heavy Vehicle', 9, 4, 2, 'OFF8579', 4, 'Expired', 3, 'Yes', 'N/A', 'Green', 80, 36, 0.28, 'Negative', 'No', 'No', 'Cash', 'No', 4, 'First Violation'),
('VLT100009', 3, 374.00, 6, '2023-01-10', '17:01:00', 1, 'Red', 1997, 'Uttar Pradesh', 75, 'Other', 'Commercial', 0, 1, 1, 'OFF7351', 1, 'Expired', 5, 'No', 'Yes', 'Red', 30, 114, 0.48, 'Not Conducted', 'Yes', 'Yes', 'Not Paid', 'No', 2, 'Repeat Offender');

-- ===========================================
-- BULK INSERT METHOD (Alternative)
-- ===========================================
-- For large datasets, use MySQL LOAD DATA INFILE or similar bulk import methods
--
-- Example bulk import command:
-- LOAD DATA INFILE '/path/to/Indian_Traffic_Violations.csv'
-- INTO TABLE violations
-- FIELDS TERMINATED BY ','
-- LINES TERMINATED BY '\n'
-- IGNORE 1 LINES
-- (violation_id, @violation_type, fine_amount, @location, violation_date, violation_time,
--  @vehicle_type, vehicle_color, vehicle_model_year, registration_state, driver_age,
--  driver_gender, license_type, penalty_points, @weather, @road, officer_id, @agency,
--  license_validity, number_of_passengers, helmet_worn, seatbelt_worn, traffic_light_status,
--  speed_limit, recorded_speed, alcohol_level, breathalyzer_result, towed, fine_paid,
--  payment_method, court_appearance_required, previous_violations, comments)
-- SET
--   violation_type_id = (SELECT violation_type_id FROM violation_types WHERE violation_name = @violation_type),
--   location_id = (SELECT location_id FROM locations WHERE location_name = @location),
--   vehicle_type_id = (SELECT vehicle_type_id FROM vehicle_types WHERE vehicle_type_name = @vehicle_type),
--   weather_condition_id = (SELECT weather_id FROM weather_conditions WHERE weather_type = @weather),
--   road_condition_id = (SELECT road_condition_id FROM road_conditions WHERE condition_type = @road),
--   issuing_agency_id = (SELECT agency_id FROM issuing_agencies WHERE agency_name = @agency);
