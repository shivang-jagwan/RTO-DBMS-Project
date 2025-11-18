-- Traffic Violations Database - Reference Data Insertion
-- Insert data into normalized reference tables first

USE traffic_violations_db;

-- ===========================================
-- INSERT REFERENCE DATA
-- ===========================================

-- Insert locations
INSERT INTO locations (location_name, state) VALUES
('Karnataka', 'Karnataka'),
('Punjab', 'Punjab'),
('Maharashtra', 'Maharashtra'),
('Uttar Pradesh', 'Uttar Pradesh'),
('Delhi', 'Delhi'),
('West Bengal', 'West Bengal'),
('Tamil Nadu', 'Tamil Nadu'),
('Gujarat', 'Gujarat');

-- Insert violation types
INSERT INTO violation_types (violation_name, base_fine_amount, penalty_points) VALUES
('Overloading', 2000.00, 5),
('Driving Without License', 1500.00, 4),
('Using Mobile Phone', 1000.00, 2),
('No Seatbelt', 500.00, 1),
('Over-speeding', 1000.00, 3),
('Wrong Parking', 500.00, 1),
('No Helmet', 500.00, 1),
('Signal Jumping', 1000.00, 3),
('Drunk Driving', 2000.00, 6);

-- Insert vehicle types
INSERT INTO vehicle_types (vehicle_type_name) VALUES
('Car'),
('Scooter'),
('Truck'),
('Bus'),
('Bike'),
('Auto Rickshaw');

-- Insert issuing agencies
INSERT INTO issuing_agencies (agency_name) VALUES
('Local Police'),
('Highway Patrol'),
('Traffic Police'),
('RTO');

-- Insert weather conditions
INSERT INTO weather_conditions (weather_type) VALUES
('Clear'),
('Cloudy'),
('Rainy'),
('Foggy'),
('Dust Storm');

-- Insert road conditions
INSERT INTO road_conditions (condition_type) VALUES
('Dry'),
('Wet'),
('Slippery'),
('Potholes'),
('Under Construction');

-- Insert officers (sample data)
INSERT INTO officers (officer_id, officer_name, issuing_agency) VALUES
('OFF9971', 'Officer Kumar', 'Local Police'),
('OFF6000', 'Officer Sharma', 'Highway Patrol'),
('OFF5706', 'Officer Patel', 'Local Police'),
('OFF5575', 'Officer Singh', 'Highway Patrol'),
('OFF7147', 'Officer Gupta', 'Traffic Police'),
('OFF2122', 'Officer Reddy', 'RTO');
