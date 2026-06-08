-- ==========================================
-- Sankalp Setu - Full Schema
-- Run this in Supabase SQL Editor
-- ==========================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL CHECK (role IN ('DONOR','NGO','VOLUNTEER','ADMIN')),
    profile_image_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(20),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ngos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id),
    organization_name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(100),
    description TEXT,
    verification_status VARCHAR(20) CHECK (verification_status IN ('PENDING','APPROVED','REJECTED')) DEFAULT 'PENDING',
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMP,
    address_id UUID REFERENCES addresses(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE volunteers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id),
    vehicle_type VARCHAR(50),
    availability_status VARCHAR(20) CHECK (availability_status IN ('AVAILABLE','BUSY','OFFLINE')) DEFAULT 'AVAILABLE',
    total_deliveries INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE food_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

INSERT INTO food_categories (name) VALUES
    ('Cooked Food'),
    ('Packaged Food'),
    ('Fruits'),
    ('Vegetables'),
    ('Bakery'),
    ('Beverages');

CREATE TABLE donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donor_id UUID NOT NULL REFERENCES users(id),
    food_category_id INTEGER REFERENCES food_categories(id),
    food_name VARCHAR(255) NOT NULL,
    description TEXT,
    quantity INTEGER NOT NULL,
    quantity_unit VARCHAR(50),
    serves_people INTEGER,
    expiry_time TIMESTAMP NOT NULL,
    pickup_address_id UUID REFERENCES addresses(id),
    status VARCHAR(30) CHECK (status IN ('PENDING','ACCEPTED','VOLUNTEER_ASSIGNED','PICKED_UP','DELIVERED','EXPIRED','CANCELLED')) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE donation_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donation_id UUID NOT NULL REFERENCES donations(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE donation_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donation_id UUID NOT NULL REFERENCES donations(id),
    ngo_id UUID NOT NULL REFERENCES ngos(id),
    request_status VARCHAR(20) CHECK (request_status IN ('PENDING','ACCEPTED','REJECTED')) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pickup_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donation_id UUID UNIQUE NOT NULL REFERENCES donations(id),
    ngo_id UUID NOT NULL REFERENCES ngos(id),
    volunteer_id UUID REFERENCES volunteers(id),
    assigned_at TIMESTAMP,
    pickup_time TIMESTAMP,
    delivered_time TIMESTAMP,
    status VARCHAR(30) CHECK (status IN ('ASSIGNED','PICKED_UP','DELIVERED')) DEFAULT 'ASSIGNED'
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donation_id UUID UNIQUE REFERENCES donations(id),
    donor_rating INTEGER CHECK (donor_rating BETWEEN 1 AND 5),
    ngo_rating INTEGER CHECK (ngo_rating BETWEEN 1 AND 5),
    volunteer_rating INTEGER CHECK (volunteer_rating BETWEEN 1 AND 5),
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE donation_receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donation_id UUID UNIQUE REFERENCES donations(id),
    receipt_number VARCHAR(100) UNIQUE,
    pdf_url TEXT,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(255),
    entity_type VARCHAR(100),
    entity_id UUID,
    old_data JSONB,
    new_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ngo_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ngo_id UUID NOT NULL REFERENCES ngos(id),
    document_type VARCHAR(100),
    file_url TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id),
    email_enabled BOOLEAN DEFAULT TRUE,
    sms_enabled BOOLEAN DEFAULT FALSE,
    whatsapp_enabled BOOLEAN DEFAULT FALSE,
    push_enabled BOOLEAN DEFAULT TRUE
);

CREATE TABLE analytics_daily (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE UNIQUE,
    total_donations INTEGER,
    total_meals_saved INTEGER,
    total_deliveries INTEGER,
    total_active_ngos INTEGER
);
