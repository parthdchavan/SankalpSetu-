-- ==========================================
-- Sankalp Setu - Dummy Data
-- Run this in Supabase SQL Editor
-- ==========================================

-- Users (password for all: 123456)
INSERT INTO users (id, first_name, last_name, email, password_hash, phone, role, is_verified, is_active) VALUES
  ('aa000000-0000-0000-0000-000000000001', 'Rahul',   'Sharma',  'rahul.donor@gmail.com',     '$2b$10$iyt0Rx851wLKf.JC.OfRAuoey/1BKtOnTrpQYUL5qd7Z3FhjtN796', '9876543210', 'DONOR',     TRUE, TRUE),
  ('aa000000-0000-0000-0000-000000000002', 'Priya',   'Patel',   'priya.donor@gmail.com',     '$2b$10$iyt0Rx851wLKf.JC.OfRAuoey/1BKtOnTrpQYUL5qd7Z3FhjtN796', '9876543211', 'DONOR',     TRUE, TRUE),
  ('aa000000-0000-0000-0000-000000000003', 'Ankita',  'Verma',   'ankita.ngo@gmail.com',      '$2b$10$iyt0Rx851wLKf.JC.OfRAuoey/1BKtOnTrpQYUL5qd7Z3FhjtN796', '9876543212', 'NGO',       TRUE, TRUE),
  ('aa000000-0000-0000-0000-000000000004', 'Suresh',  'Kumar',   'suresh.ngo@gmail.com',      '$2b$10$iyt0Rx851wLKf.JC.OfRAuoey/1BKtOnTrpQYUL5qd7Z3FhjtN796', '9876543213', 'NGO',       TRUE, TRUE),
  ('aa000000-0000-0000-0000-000000000005', 'Vikram',  'Singh',   'vikram.volunteer@gmail.com','$2b$10$iyt0Rx851wLKf.JC.OfRAuoey/1BKtOnTrpQYUL5qd7Z3FhjtN796', '9876543214', 'VOLUNTEER', TRUE, TRUE),
  ('aa000000-0000-0000-0000-000000000006', 'Neha',    'Joshi',   'neha.volunteer@gmail.com',  '$2b$10$iyt0Rx851wLKf.JC.OfRAuoey/1BKtOnTrpQYUL5qd7Z3FhjtN796', '9876543215', 'VOLUNTEER', TRUE, TRUE),
  ('aa000000-0000-0000-0000-000000000007', 'Admin',   'User',    'admin@sankalpsetu.com',     '$2b$10$iyt0Rx851wLKf.JC.OfRAuoey/1BKtOnTrpQYUL5qd7Z3FhjtN796', '9876543216', 'ADMIN',     TRUE, TRUE);

-- Addresses
INSERT INTO addresses (id, address_line1, city, state, pincode, latitude, longitude) VALUES
  ('bb000000-0000-0000-0000-000000000001', '12 MG Road',       'Pune', 'Maharashtra', '411001', 18.5204, 73.8567),
  ('bb000000-0000-0000-0000-000000000002', '45 FC Road',       'Pune', 'Maharashtra', '411004', 18.5314, 73.8446),
  ('bb000000-0000-0000-0000-000000000003', '78 Baner Road',    'Pune', 'Maharashtra', '411045', 18.5590, 73.7868),
  ('bb000000-0000-0000-0000-000000000004', '23 Koregaon Park', 'Pune', 'Maharashtra', '411001', 18.5362, 73.8938),
  ('bb000000-0000-0000-0000-000000000005', '56 Shivaji Nagar', 'Pune', 'Maharashtra', '411005', 18.5308, 73.8474);

-- NGOs
INSERT INTO ngos (id, user_id, organization_name, registration_number, description, verification_status, address_id) VALUES
  ('cc000000-0000-0000-0000-000000000001', 'aa000000-0000-0000-0000-000000000003', 'Asha Foundation',     'NGO-MH-2021-001', 'Feeding the underprivileged in Pune since 2015.', 'APPROVED', 'bb000000-0000-0000-0000-000000000003'),
  ('cc000000-0000-0000-0000-000000000002', 'aa000000-0000-0000-0000-000000000004', 'Seva Samarpan Trust', 'NGO-MH-2019-042', 'Community kitchen serving 500+ meals daily.',    'APPROVED', 'bb000000-0000-0000-0000-000000000004');

-- Volunteers
INSERT INTO volunteers (id, user_id, vehicle_type, availability_status, total_deliveries) VALUES
  ('dd000000-0000-0000-0000-000000000001', 'aa000000-0000-0000-0000-000000000005', 'BIKE',  'AVAILABLE', 12),
  ('dd000000-0000-0000-0000-000000000002', 'aa000000-0000-0000-0000-000000000006', 'CYCLE', 'AVAILABLE',  5);

-- Donations
INSERT INTO donations (id, donor_id, food_category_id, food_name, description, quantity, quantity_unit, serves_people, expiry_time, pickup_address_id, status) VALUES
  ('ee000000-0000-0000-0000-000000000001', 'aa000000-0000-0000-0000-000000000001', 1, 'Dal Rice',        'Freshly cooked dal and rice',   10, 'kg',      50, NOW() + INTERVAL '6 hours', 'bb000000-0000-0000-0000-000000000001', 'PENDING'),
  ('ee000000-0000-0000-0000-000000000002', 'aa000000-0000-0000-0000-000000000001', 2, 'Biscuit Packets', 'Assorted biscuit packets',      30, 'packets', 30, NOW() + INTERVAL '7 days',  'bb000000-0000-0000-0000-000000000001', 'ACCEPTED'),
  ('ee000000-0000-0000-0000-000000000003', 'aa000000-0000-0000-0000-000000000002', 3, 'Mixed Fruits',    'Apples, bananas and oranges',   15, 'kg',      20, NOW() + INTERVAL '2 days',  'bb000000-0000-0000-0000-000000000002', 'VOLUNTEER_ASSIGNED'),
  ('ee000000-0000-0000-0000-000000000004', 'aa000000-0000-0000-0000-000000000002', 1, 'Biryani',         'Event leftover biryani',         8, 'kg',      40, NOW() + INTERVAL '4 hours', 'bb000000-0000-0000-0000-000000000002', 'DELIVERED'),
  ('ee000000-0000-0000-0000-000000000005', 'aa000000-0000-0000-0000-000000000001', 5, 'Bread Loaves',    'Fresh bread from local bakery', 20, 'pieces',  20, NOW() + INTERVAL '1 day',   'bb000000-0000-0000-0000-000000000001', 'PENDING');

-- Donation Requests
INSERT INTO donation_requests (id, donation_id, ngo_id, request_status) VALUES
  ('ff000000-0000-0000-0000-000000000001', 'ee000000-0000-0000-0000-000000000002', 'cc000000-0000-0000-0000-000000000001', 'ACCEPTED'),
  ('ff000000-0000-0000-0000-000000000002', 'ee000000-0000-0000-0000-000000000003', 'cc000000-0000-0000-0000-000000000002', 'ACCEPTED'),
  ('ff000000-0000-0000-0000-000000000003', 'ee000000-0000-0000-0000-000000000005', 'cc000000-0000-0000-0000-000000000001', 'PENDING');

-- Pickup Assignments
INSERT INTO pickup_assignments (id, donation_id, ngo_id, volunteer_id, assigned_at, pickup_time, delivered_time, status) VALUES
  ('ab000000-0000-0000-0000-000000000001', 'ee000000-0000-0000-0000-000000000003', 'cc000000-0000-0000-0000-000000000002', 'dd000000-0000-0000-0000-000000000001', NOW() - INTERVAL '2 hours', NULL,                       NULL,                       'ASSIGNED'),
  ('ab000000-0000-0000-0000-000000000002', 'ee000000-0000-0000-0000-000000000004', 'cc000000-0000-0000-0000-000000000001', 'dd000000-0000-0000-0000-000000000002', NOW() - INTERVAL '5 hours', NOW() - INTERVAL '4 hours', NOW() - INTERVAL '3 hours', 'DELIVERED');

-- Reviews
INSERT INTO reviews (id, donation_id, donor_rating, ngo_rating, volunteer_rating, comments) VALUES
  ('ac000000-0000-0000-0000-000000000001', 'ee000000-0000-0000-0000-000000000004', 5, 5, 4, 'Great experience! Food was picked up on time and delivered well.');

-- Notifications
INSERT INTO notifications (id, user_id, title, message, is_read) VALUES
  ('ad000000-0000-0000-0000-000000000001', 'aa000000-0000-0000-0000-000000000001', 'Donation Accepted',  'Your donation "Biscuit Packets" has been accepted by Asha Foundation.',   TRUE),
  ('ad000000-0000-0000-0000-000000000002', 'aa000000-0000-0000-0000-000000000002', 'Donation Delivered', 'Your donation "Biryani" has been successfully delivered.',                TRUE),
  ('ad000000-0000-0000-0000-000000000003', 'aa000000-0000-0000-0000-000000000005', 'New Pickup Task',    'You have been assigned a new pickup for Mixed Fruits in Koregaon Park.', FALSE);

-- Analytics
INSERT INTO analytics_daily (id, date, total_donations, total_meals_saved, total_deliveries, total_active_ngos) VALUES
  ('ae000000-0000-0000-0000-000000000001', CURRENT_DATE - 6, 3,  90, 2, 2),
  ('ae000000-0000-0000-0000-000000000002', CURRENT_DATE - 5, 5, 150, 4, 2),
  ('ae000000-0000-0000-0000-000000000003', CURRENT_DATE - 4, 4, 120, 3, 2),
  ('ae000000-0000-0000-0000-000000000004', CURRENT_DATE - 3, 6, 200, 5, 2),
  ('ae000000-0000-0000-0000-000000000005', CURRENT_DATE - 2, 4, 130, 3, 2),
  ('ae000000-0000-0000-0000-000000000006', CURRENT_DATE - 1, 7, 220, 6, 2),
  ('ae000000-0000-0000-0000-000000000007', CURRENT_DATE,     5, 160, 4, 2);
