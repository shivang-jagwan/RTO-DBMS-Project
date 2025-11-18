# Traffic Violations Database Design Document

## 📐 Entity-Relationship Diagram (Text Representation)

```
┌─────────────────┐       ┌─────────────────┐
│   locations     │       │ violation_types │
│ ──────────────  │       │ ──────────────  │
│ location_id (PK)│       │ violation_type_id(PK)
│ location_name   │       │ violation_name  │
│ state          │       │ base_fine_amount│
│                │       │ penalty_points  │
└─────────────────┘       └─────────────────┘
         │                       │
         │                       │
         │ 1..*                  │ 1..*
         │                       │
         ▼                       ▼
┌─────────────────────────────────────────────────┐
│                 violations                      │
│ ──────────────────────────────────────────────  │
│ violation_id (PK)                              │
│ violation_type_id (FK → violation_types)       │
│ fine_amount                                    │
│ location_id (FK → locations)                   │
│ violation_date                                 │
│ violation_time                                 │
│ vehicle_type_id (FK → vehicle_types)           │
│ vehicle_color                                  │
│ vehicle_model_year                             │
│ registration_state                             │
│ driver_age                                     │
│ driver_gender                                  │
│ license_type                                   │
│ penalty_points                                 │
│ weather_condition_id (FK → weather_conditions) │
│ road_condition_id (FK → road_conditions)       │
│ officer_id                                     │
│ issuing_agency_id (FK → issuing_agencies)      │
│ license_validity                               │
│ number_of_passengers                           │
│ helmet_worn                                    │
│ seatbelt_worn                                  │
│ traffic_light_status                           │
│ speed_limit                                    │
│ recorded_speed                                 │
│ alcohol_level                                  │
│ breathalyzer_result                            │
│ towed                                          │
│ fine_paid                                      │
│ payment_method                                 │
│ court_appearance_required                      │
│ previous_violations                            │
│ comments                                       │
└─────────────────────────────────────────────────┘
         │                       │
         │                       │
         ▼                       ▼
┌─────────────────┐       ┌─────────────────┐
│ vehicle_types   │       │ weather_conditions
│ ──────────────  │       │ ──────────────  │
│ vehicle_type_id │       │ weather_id (PK) │
│ vehicle_type_name│      │ weather_type    │
└─────────────────┘       └─────────────────┘

┌─────────────────┐       ┌─────────────────┐
│ road_conditions │       │ issuing_agencies│
│ ──────────────  │       │ ──────────────  │
│ road_condition_id│      │ agency_id (PK)  │
│ condition_type  │       │ agency_name     │
└─────────────────┘       └─────────────────┘

┌─────────────────┐
│     officers    │
│ ──────────────  │
│ officer_id (PK) │
│ officer_name    │
│ issuing_agency  │
└─────────────────┘

Aggregation Tables (for performance):

┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│  monthly_stats  │       │ location_stats  │       │violation_type_stats
│ ──────────────  │       │ ──────────────  │       │ ──────────────  │
│ stat_id (PK)    │       │ location_stat_id│       │ violation_stat_id
│ stat_year       │       │ location_id (FK)│       │ violation_type_id
│ stat_month      │       │ total_violations│       │ total_violations
│ total_violations│       │ total_fines     │       │ total_fines     │
│ total_fines     │       │ avg_fine        │       │ avg_fine        │
│ avg_fine        │       └─────────────────┘       └─────────────────┘
└─────────────────┘
```

## 🔗 Relationships

### One-to-Many Relationships
- **locations → violations**: One location can have many violations
- **violation_types → violations**: One violation type can apply to many violations
- **vehicle_types → violations**: One vehicle type can be involved in many violations
- **weather_conditions → violations**: One weather condition can affect many violations
- **road_conditions → violations**: One road condition can affect many violations
- **issuing_agencies → violations**: One agency can issue many violations

### One-to-One Relationships
- **violations → officers**: Each violation is issued by one officer (optional)

## 📊 Cardinality

| Relationship | Cardinality | Description |
|-------------|-------------|-------------|
| locations:violations | 1:N | One location, many violations |
| violation_types:violations | 1:N | One type, many violations |
| vehicle_types:violations | 1:N | One vehicle type, many violations |
| weather_conditions:violations | 1:N | One weather type, many violations |
| road_conditions:violations | 1:N | One road condition, many violations |
| issuing_agencies:violations | 1:N | One agency, many violations |
| officers:violations | 1:1 | One officer per violation |

## 🗝️ Primary Keys

### Simple Primary Keys
- `locations.location_id` (AUTO_INCREMENT)
- `violation_types.violation_type_id` (AUTO_INCREMENT)
- `vehicle_types.vehicle_type_id` (AUTO_INCREMENT)
- `weather_conditions.weather_id` (AUTO_INCREMENT)
- `road_conditions.road_condition_id` (AUTO_INCREMENT)
- `issuing_agencies.agency_id` (AUTO_INCREMENT)
- `officers.officer_id` (VARCHAR)
- `violations.violation_id` (VARCHAR)

### Composite Primary Keys
- `monthly_stats(stat_year, stat_month)`
- `location_stats(location_id)` (UNIQUE)
- `violation_type_stats(violation_type_id)` (UNIQUE)

## 🔑 Foreign Keys

| Table | Column | References | On Delete |
|-------|--------|------------|-----------|
| violations | violation_type_id | violation_types.violation_type_id | RESTRICT |
| violations | location_id | locations.location_id | RESTRICT |
| violations | vehicle_type_id | vehicle_types.vehicle_type_id | RESTRICT |
| violations | weather_condition_id | weather_conditions.weather_id | SET NULL |
| violations | road_condition_id | road_conditions.road_condition_id | SET NULL |
| violations | issuing_agency_id | issuing_agencies.agency_id | RESTRICT |
| location_stats | location_id | locations.location_id | CASCADE |
| violation_type_stats | violation_type_id | violation_types.violation_type_id | CASCADE |

## 📋 Data Types and Constraints

### Text Fields
- `VARCHAR(20)`: violation_id, officer_id
- `VARCHAR(50)`: location_name, violation_name, vehicle_type_name, etc.
- `VARCHAR(100)`: agency_name, officer_name
- `TEXT`: comments

### Numeric Fields
- `INT`: IDs, counts, ages, speeds
- `DECIMAL(10,2)`: fine_amount, alcohol_level
- `DECIMAL(15,2)`: total sums

### Date/Time Fields
- `DATE`: violation_date
- `TIME`: violation_time

### Enumerated Fields
- `ENUM('Male', 'Female', 'Other')`: driver_gender
- `ENUM('Valid', 'Expired', 'Suspended')`: license_validity
- `ENUM('Yes', 'No', 'N/A')`: helmet_worn, seatbelt_worn, towed, fine_paid
- `ENUM('Red', 'Yellow', 'Green')`: traffic_light_status
- `ENUM('Positive', 'Negative', 'Not Conducted')`: breathalyzer_result
- `ENUM('Cash', 'Card', 'Online', 'Not Paid')`: payment_method

### Constraints
- `NOT NULL`: Most fields except optional ones
- `UNIQUE`: Natural keys where applicable
- `CHECK`: Range constraints on numeric fields
- `DEFAULT`: Penalty points default to 0

## 📈 Indexes

### Primary Indexes (Automatic)
- All primary keys are automatically indexed

### Foreign Key Indexes (Automatic)
- Foreign key columns are automatically indexed

### Additional Performance Indexes
```sql
-- Date-based queries
CREATE INDEX idx_violation_date ON violations(violation_date);
CREATE INDEX idx_monthly_stats ON monthly_stats(stat_year, stat_month);

-- Location-based queries
CREATE INDEX idx_location_name ON locations(location_name);
CREATE INDEX idx_location_stats ON location_stats(location_id, total_violations);

-- Violation analysis
CREATE INDEX idx_violation_type_stats ON violation_type_stats(violation_type_id, total_violations);

-- Driver analysis
CREATE INDEX idx_driver_age ON violations(driver_age);
CREATE INDEX idx_registration_state ON violations(registration_state);

-- Officer analysis
CREATE INDEX idx_officer ON violations(officer_id);
CREATE INDEX idx_agency ON issuing_agencies(agency_name);
```

## 🔍 Views

### violation_details
Joins all related tables to provide complete violation information for reporting.

### high_risk_locations
Aggregates violations by location to identify hotspots.

### repeat_offenders
Identifies drivers with multiple violations.

## ⚡ Stored Procedures and Functions

### Stored Procedures
- `add_violation()`: Insert new violation with automatic reference data creation
- `get_violation_stats()`: Calculate statistics for date ranges
- `get_hotspots()`: Find locations with high violation counts
- `get_repeat_offenders()`: Identify frequent violators
- `update_*_stats()`: Maintain pre-computed statistics

### Functions
- `calculate_location_risk()`: Compute risk score for locations
- `get_violation_severity()`: Classify violation severity levels

## 🔄 Triggers

### after_violation_insert
Automatically updates statistics tables when new violations are added.

## 📊 Normalization Level

### First Normal Form (1NF)
- All attributes are atomic
- No repeating groups
- Primary key identified

### Second Normal Form (2NF)
- In 1NF
- No partial dependencies
- All non-key attributes depend on the whole primary key

### Third Normal Form (3NF)
- In 2NF
- No transitive dependencies
- Reference data separated into lookup tables

## 🚀 Scalability Considerations

### Partitioning Strategy
```sql
-- Partition violations table by year
PARTITION BY RANGE (YEAR(violation_date)) (
    PARTITION p2023 VALUES LESS THAN (2024),
    PARTITION p2024 VALUES LESS THAN (2025),
    PARTITION p_future VALUES LESS THAN MAXVALUE
);
```

### Archiving Strategy
- Move old records (>2 years) to archive tables
- Compress archived data
- Maintain separate indexes for active vs archived data

### Replication
- Master-slave replication for read-heavy workloads
- Separate reporting database for analytics queries

## 🔒 Security Design

### Row-Level Security
```sql
-- Officers can only see violations they issued
CREATE POLICY officer_policy ON violations
FOR ALL USING (officer_id = current_user_officer_id());
```

### Data Encryption
- Encrypt sensitive fields (alcohol_level, personal info)
- Use application-level encryption for compliance

### Audit Logging
- Log all data access and modifications
- Track user actions for compliance

## 📋 Data Integrity Rules

### Business Rules
1. Fine amount must be positive
2. Violation date cannot be in the future
3. Driver age must be between 16 and 100
4. Recorded speed cannot exceed 300 km/h
5. Alcohol level must be between 0.00 and 1.00
6. Previous violations count cannot be negative

### Referential Integrity
- All foreign keys must reference existing records
- Cascade deletes only for statistics tables
- Restrict deletes for master data

### Domain Constraints
- Enums restrict values to valid options
- Check constraints enforce business rules
- Triggers validate complex relationships

---

**Design Principles Followed**:
- ✅ Normalization for data integrity
- ✅ Performance optimization with indexes
- ✅ Scalability with partitioning strategy
- ✅ Security with proper access controls
- ✅ Maintainability with stored procedures and views
