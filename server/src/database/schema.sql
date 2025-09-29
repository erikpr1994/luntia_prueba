-- Create database schema for CSV data transformation

-- Volunteers table
CREATE TABLE IF NOT EXISTS volunteers (
    id VARCHAR(50) PRIMARY KEY,
    organization VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    join_date DATE NOT NULL,
    active BOOLEAN NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Members table
CREATE TABLE IF NOT EXISTS members (
    id VARCHAR(50) PRIMARY KEY,
    organization VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    join_date DATE NOT NULL,
    monthly_contribution DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shifts table
CREATE TABLE IF NOT EXISTS shifts (
    id VARCHAR(50) PRIMARY KEY,
    volunteer_id VARCHAR(50) NOT NULL,
    organization VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    activity VARCHAR(100) NOT NULL,
    hours DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (volunteer_id) REFERENCES volunteers(id)
);

-- Donations table
CREATE TABLE IF NOT EXISTS donations (
    id VARCHAR(50) PRIMARY KEY,
    organization VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    donor VARCHAR(200) NOT NULL,
    amount DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activities table
CREATE TABLE IF NOT EXISTS activities (
    id VARCHAR(50) PRIMARY KEY,
    organization VARCHAR(100) NOT NULL,
    name VARCHAR(200) NOT NULL,
    date DATE NOT NULL,
    participants INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_volunteers_organization ON volunteers(organization);
CREATE INDEX IF NOT EXISTS idx_members_organization ON members(organization);
CREATE INDEX IF NOT EXISTS idx_shifts_volunteer_id ON shifts(volunteer_id);
CREATE INDEX IF NOT EXISTS idx_shifts_organization ON shifts(organization);
CREATE INDEX IF NOT EXISTS idx_donations_organization ON donations(organization);
CREATE INDEX IF NOT EXISTS idx_activities_organization ON activities(organization);
