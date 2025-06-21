
-- First, let's add the dummy data in the correct order and reference actual IDs

-- Add more agents (these will get auto-assigned IDs)
INSERT INTO public.agents (name, email, phone, location, state, district, area, status, performance_score, total_collections, services_completed) VALUES
('Rajesh Kumar', 'rajesh@example.com', '+919876543210', 'Central Mumbai', 'Maharashtra', 'Mumbai', 'Bandra', 'active', 4.8, 25000.00, 45),
('Priya Sharma', 'priya@example.com', '+919876543211', 'South Delhi', 'Delhi', 'Delhi', 'Lajpat Nagar', 'active', 4.6, 22000.00, 38),
('Amit Patel', 'amit@example.com', '+919876543212', 'West Bangalore', 'Karnataka', 'Bangalore', 'Rajajinagar', 'active', 4.3, 18000.00, 32),
('Sunita Singh', 'sunita@example.com', '+919876543213', 'East Kolkata', 'West Bengal', 'Kolkata', 'Salt Lake', 'active', 4.5, 20000.00, 35),
('Ravi Gupta', 'ravi@example.com', '+919876543214', 'North Chennai', 'Tamil Nadu', 'Chennai', 'T Nagar', 'active', 4.2, 16000.00, 28),
('Meera Joshi', 'meera@example.com', '+919876543215', 'Central Pune', 'Maharashtra', 'Pune', 'Shivajinagar', 'active', 4.7, 24000.00, 42),
('Vikash Yadav', 'vikash@example.com', '+919876543216', 'West Ahmedabad', 'Gujarat', 'Ahmedabad', 'Navrangpura', 'active', 4.1, 15000.00, 25);

-- Add employees
INSERT INTO public.employees (employee_id, full_name, email, phone, department, position, salary, hire_date, status) VALUES
('EMP001', 'Arjun Malhotra', 'arjun.m@company.com', '+919876501001', 'Human Resources', 'HR Manager', 75000.00, '2023-01-15', 'active'),
('EMP002', 'Sneha Kapoor', 'sneha.k@company.com', '+919876501002', 'Finance', 'Finance Manager', 80000.00, '2023-02-20', 'active'),
('EMP003', 'Rohit Verma', 'rohit.v@company.com', '+919876501003', 'Operations', 'Operations Manager', 70000.00, '2023-03-10', 'active'),
('EMP004', 'Pooja Mishra', 'pooja.m@company.com', '+919876501004', 'IT', 'IT Manager', 85000.00, '2023-04-05', 'active'),
('EMP005', 'Kiran Jain', 'kiran.j@company.com', '+919876501005', 'Marketing', 'Marketing Executive', 45000.00, '2023-05-12', 'active'),
('EMP006', 'Deepak Singh', 'deepak.s@company.com', '+919876501006', 'Operations', 'Field Supervisor', 50000.00, '2023-06-18', 'active'),
('EMP007', 'Neha Gupta', 'neha.g@company.com', '+919876501007', 'Finance', 'Accountant', 40000.00, '2023-07-22', 'active'),
('EMP008', 'Manish Kumar', 'manish.k@company.com', '+919876501008', 'IT', 'System Administrator', 55000.00, '2023-08-15', 'active'),
('EMP009', 'Ritika Sharma', 'ritika.s@company.com', '+919876501009', 'Human Resources', 'HR Executive', 38000.00, '2023-09-10', 'active'),
('EMP010', 'Sanjay Patel', 'sanjay.p@company.com', '+919876501010', 'Operations', 'Training Coordinator', 42000.00, '2023-10-08', 'active');

-- Now add fee collections using only the first 3 agent IDs that we know exist (1, 2, 3)
-- and some additional ones referencing by name
INSERT INTO public.fee_collections (agent_id, service_id, citizen_name, citizen_phone, amount, commission_rate, commission_amount, collection_date, payment_method, status, receipt_number) VALUES
(1, (SELECT id FROM public.services WHERE service_code = 'AADHAAR_NEW' LIMIT 1), 'Ramesh Chandra', '+919876111001', 25.00, 5.00, 1.25, '2024-01-15', 'cash', 'paid', 'REC001'),
(2, (SELECT id FROM public.services WHERE service_code = 'PAN_NEW' LIMIT 1), 'Sita Devi', '+919876111002', 107.00, 8.00, 8.56, '2024-01-16', 'upi', 'paid', 'REC002'),
(3, (SELECT id FROM public.services WHERE service_code = 'PASSPORT_NEW' LIMIT 1), 'Mohan Lal', '+919876111003', 500.00, 10.00, 50.00, '2024-01-17', 'card', 'paid', 'REC003'),
((SELECT id FROM public.agents WHERE email = 'rajesh@example.com' LIMIT 1), (SELECT id FROM public.services WHERE service_code = 'DL_NEW' LIMIT 1), 'Geeta Sharma', '+919876111004', 200.00, 7.00, 14.00, '2024-01-18', 'cash', 'paid', 'REC004'),
((SELECT id FROM public.agents WHERE email = 'priya@example.com' LIMIT 1), (SELECT id FROM public.services WHERE service_code = 'VOTER_NEW' LIMIT 1), 'Raj Kumar', '+919876111005', 25.00, 5.00, 1.25, '2024-01-19', 'upi', 'paid', 'REC005'),
((SELECT id FROM public.agents WHERE email = 'amit@example.com' LIMIT 1), (SELECT id FROM public.services WHERE service_code = 'BIRTH_CERT' LIMIT 1), 'Anita Singh', '+919876111006', 50.00, 6.00, 3.00, '2024-01-20', 'cash', 'paid', 'REC006'),
((SELECT id FROM public.agents WHERE email = 'sunita@example.com' LIMIT 1), (SELECT id FROM public.services WHERE service_code = 'INCOME_CERT' LIMIT 1), 'Vijay Gupta', '+919876111007', 30.00, 5.00, 1.50, '2024-01-21', 'upi', 'paid', 'REC007'),
((SELECT id FROM public.agents WHERE email = 'ravi@example.com' LIMIT 1), (SELECT id FROM public.services WHERE service_code = 'AADHAAR_UPDATE' LIMIT 1), 'Meera Joshi', '+919876111008', 50.00, 6.00, 3.00, '2024-01-22', 'card', 'paid', 'REC008'),
((SELECT id FROM public.agents WHERE email = 'meera@example.com' LIMIT 1), (SELECT id FROM public.services WHERE service_code = 'PAN_NEW' LIMIT 1), 'Suresh Nair', '+919876111009', 107.00, 8.00, 8.56, '2024-01-23', 'cash', 'paid', 'REC009'),
((SELECT id FROM public.agents WHERE email = 'vikash@example.com' LIMIT 1), (SELECT id FROM public.services WHERE service_code = 'VOTER_NEW' LIMIT 1), 'Kavita Reddy', '+919876111010', 25.00, 5.00, 1.25, '2024-01-24', 'upi', 'paid', 'REC010');

-- Add financial transactions
INSERT INTO public.financial_transactions (transaction_type, amount, description, agent_id, employee_id, transaction_date, status) VALUES
('income', 25.00, 'Aadhaar service fee collection', 1, NULL, '2024-01-15', 'paid'),
('commission', 1.25, 'Commission for Aadhaar service', 1, NULL, '2024-01-15', 'pending'),
('income', 107.00, 'PAN card service fee', 2, NULL, '2024-01-16', 'paid'),
('commission', 8.56, 'Commission for PAN service', 2, NULL, '2024-01-16', 'pending'),
('expense', 5000.00, 'Office rent payment', NULL, (SELECT id FROM public.employees WHERE employee_id = 'EMP003' LIMIT 1), '2024-01-20', 'paid'),
('expense', 2500.00, 'Equipment purchase', NULL, (SELECT id FROM public.employees WHERE employee_id = 'EMP004' LIMIT 1), '2024-01-21', 'paid'),
('income', 500.00, 'Passport service fee', 3, NULL, '2024-01-17', 'paid'),
('commission', 50.00, 'Commission for passport service', 3, NULL, '2024-01-17', 'pending'),
('expense', 1200.00, 'Training materials', NULL, (SELECT id FROM public.employees WHERE employee_id = 'EMP010' LIMIT 1), '2024-01-25', 'pending'),
('reimbursement', 800.00, 'Travel expenses reimbursement', (SELECT id FROM public.agents WHERE email = 'rajesh@example.com' LIMIT 1), NULL, '2024-01-26', 'paid');

-- Add reimbursements
INSERT INTO public.reimbursements (employee_id, agent_id, amount, category, description, expense_date, status) VALUES
((SELECT id FROM public.employees WHERE employee_id = 'EMP001' LIMIT 1), NULL, 1500.00, 'travel', 'Business trip to Mumbai for training', '2024-01-10', 'approved'),
(NULL, 1, 800.00, 'travel', 'Field visit expenses', '2024-01-12', 'pending'),
((SELECT id FROM public.employees WHERE employee_id = 'EMP002' LIMIT 1), NULL, 450.00, 'meals', 'Client meeting expenses', '2024-01-14', 'approved'),
(NULL, 2, 600.00, 'accommodation', 'Overnight stay for remote area coverage', '2024-01-15', 'pending'),
((SELECT id FROM public.employees WHERE employee_id = 'EMP003' LIMIT 1), NULL, 320.00, 'supplies', 'Office stationery purchase', '2024-01-16', 'approved'),
(NULL, 3, 750.00, 'travel', 'Transportation for citizen service', '2024-01-18', 'approved'),
((SELECT id FROM public.employees WHERE employee_id = 'EMP004' LIMIT 1), NULL, 280.00, 'other', 'Software license renewal', '2024-01-20', 'pending'),
(NULL, (SELECT id FROM public.agents WHERE email = 'rajesh@example.com' LIMIT 1), 520.00, 'meals', 'Field work meal expenses', '2024-01-22', 'approved'),
((SELECT id FROM public.employees WHERE employee_id = 'EMP005' LIMIT 1), NULL, 900.00, 'travel', 'Marketing campaign travel', '2024-01-24', 'pending'),
(NULL, (SELECT id FROM public.agents WHERE email = 'priya@example.com' LIMIT 1), 680.00, 'supplies', 'Form printing and materials', '2024-01-25', 'approved');

-- Add commission approvals
INSERT INTO public.commission_approvals (agent_id, period_start, period_end, total_collections, total_commission, bonus_amount, deduction_amount, final_amount, status) VALUES
(1, '2024-01-01', '2024-01-31', 2500.00, 125.00, 25.00, 0.00, 150.00, 'pending'),
(2, '2024-01-01', '2024-01-31', 2200.00, 176.00, 20.00, 0.00, 196.00, 'approved'),
(3, '2024-01-01', '2024-01-31', 1800.00, 180.00, 0.00, 10.00, 170.00, 'pending'),
((SELECT id FROM public.agents WHERE email = 'rajesh@example.com' LIMIT 1), '2024-01-01', '2024-01-31', 2000.00, 140.00, 15.00, 0.00, 155.00, 'approved'),
((SELECT id FROM public.agents WHERE email = 'priya@example.com' LIMIT 1), '2024-01-01', '2024-01-31', 1600.00, 80.00, 10.00, 5.00, 85.00, 'pending'),
((SELECT id FROM public.agents WHERE email = 'amit@example.com' LIMIT 1), '2024-01-01', '2024-01-31', 2400.00, 144.00, 30.00, 0.00, 174.00, 'approved'),
((SELECT id FROM public.agents WHERE email = 'sunita@example.com' LIMIT 1), '2024-01-01', '2024-01-31', 1500.00, 75.00, 0.00, 0.00, 75.00, 'pending'),
((SELECT id FROM public.agents WHERE email = 'ravi@example.com' LIMIT 1), '2024-01-01', '2024-01-31', 1900.00, 133.00, 20.00, 0.00, 153.00, 'approved'),
((SELECT id FROM public.agents WHERE email = 'meera@example.com' LIMIT 1), '2024-01-01', '2024-01-31', 2100.00, 147.00, 25.00, 0.00, 172.00, 'pending'),
((SELECT id FROM public.agents WHERE email = 'vikash@example.com' LIMIT 1), '2024-01-01', '2024-01-31', 1700.00, 85.00, 15.00, 0.00, 100.00, 'approved');

-- Add service pricing
INSERT INTO public.service_pricing (service_id, location_type, location_value, price, commission_rate, effective_date) VALUES
((SELECT id FROM public.services WHERE service_code = 'AADHAAR_NEW' LIMIT 1), 'state', 'Maharashtra', 25.00, 5.00, '2024-01-01'),
((SELECT id FROM public.services WHERE service_code = 'AADHAAR_NEW' LIMIT 1), 'state', 'Delhi', 30.00, 6.00, '2024-01-01'),
((SELECT id FROM public.services WHERE service_code = 'PAN_NEW' LIMIT 1), 'state', 'Karnataka', 107.00, 8.00, '2024-01-01'),
((SELECT id FROM public.services WHERE service_code = 'PAN_NEW' LIMIT 1), 'state', 'Tamil Nadu', 110.00, 8.50, '2024-01-01'),
((SELECT id FROM public.services WHERE service_code = 'PASSPORT_NEW' LIMIT 1), 'state', 'Maharashtra', 500.00, 10.00, '2024-01-01'),
((SELECT id FROM public.services WHERE service_code = 'PASSPORT_NEW' LIMIT 1), 'state', 'Gujarat', 520.00, 10.50, '2024-01-01'),
((SELECT id FROM public.services WHERE service_code = 'DL_NEW' LIMIT 1), 'state', 'West Bengal', 200.00, 7.00, '2024-01-01'),
((SELECT id FROM public.services WHERE service_code = 'DL_NEW' LIMIT 1), 'state', 'Rajasthan', 210.00, 7.50, '2024-01-01'),
((SELECT id FROM public.services WHERE service_code = 'VOTER_NEW' LIMIT 1), 'district', 'Mumbai', 25.00, 5.00, '2024-01-01'),
((SELECT id FROM public.services WHERE service_code = 'BIRTH_CERT' LIMIT 1), 'district', 'Bangalore', 50.00, 6.00, '2024-01-01');

-- Add bank details
INSERT INTO public.bank_details (entity_type, entity_id, account_holder_name, bank_name, account_number, ifsc_code, branch_name, account_type, is_primary) VALUES
('agent', '1', 'John Doe', 'State Bank of India', '1234567890123456', 'SBIN0001234', 'Mumbai Central', 'savings', true),
('agent', '2', 'Jane Smith', 'HDFC Bank', '9876543210987654', 'HDFC0002345', 'Delhi Connaught Place', 'current', true),
('agent', '3', 'Mike Johnson', 'ICICI Bank', '1111222233334444', 'ICIC0003456', 'Bangalore Koramangala', 'savings', true),
('employee', (SELECT id::text FROM public.employees WHERE employee_id = 'EMP001' LIMIT 1), 'Arjun Malhotra', 'Axis Bank', '5555666677778888', 'UTIB0004567', 'Mumbai Bandra', 'salary', true),
('employee', (SELECT id::text FROM public.employees WHERE employee_id = 'EMP002' LIMIT 1), 'Sneha Kapoor', 'Punjab National Bank', '9999000011112222', 'PUNB0005678', 'Delhi Lajpat Nagar', 'salary', true),
('agent', (SELECT id::text FROM public.agents WHERE email = 'rajesh@example.com' LIMIT 1), 'Rajesh Kumar', 'Bank of Baroda', '3333444455556666', 'BARB0006789', 'Mumbai Andheri', 'savings', true),
('agent', (SELECT id::text FROM public.agents WHERE email = 'priya@example.com' LIMIT 1), 'Priya Sharma', 'Canara Bank', '7777888899990000', 'CNRB0007890', 'Delhi Dwarka', 'savings', true),
('employee', (SELECT id::text FROM public.employees WHERE employee_id = 'EMP003' LIMIT 1), 'Rohit Verma', 'Union Bank', '1234509876543210', 'UBIN0008901', 'Pune Shivajinagar', 'salary', true),
('agent', (SELECT id::text FROM public.agents WHERE email = 'amit@example.com' LIMIT 1), 'Amit Patel', 'Indian Bank', '5678901234567890', 'IDIB0009012', 'Bangalore Whitefield', 'savings', true),
('employee', (SELECT id::text FROM public.employees WHERE employee_id = 'EMP004' LIMIT 1), 'Pooja Mishra', 'Central Bank', '9012345678901234', 'CBIN0010123', 'Hyderabad Gachibowli', 'salary', true);

-- Add more projects
INSERT INTO public.projects (name, description, location, state, agent_count, route_count, status) VALUES
('Kerala Digital Services', 'Digital government services in Kerala', 'Kochi', 'Kerala', 8, 4, 'active'),
('Gujarat Service Hub', 'Comprehensive service delivery in Gujarat', 'Ahmedabad', 'Gujarat', 12, 6, 'active'),
('Punjab Rural Connect', 'Rural area service connectivity', 'Ludhiana', 'Punjab', 6, 8, 'active'),
('Odisha Coastal Services', 'Coastal region service delivery', 'Bhubaneswar', 'Odisha', 9, 5, 'active'),
('Assam Border Services', 'Border area service management', 'Guwahati', 'Assam', 7, 3, 'active'),
('Uttar Pradesh Metro', 'Metro cities service network', 'Lucknow', 'Uttar Pradesh', 20, 12, 'active'),
('Madhya Pradesh Central', 'Central India service hub', 'Bhopal', 'Madhya Pradesh', 11, 7, 'active');

-- Add more training camps
INSERT INTO public.training_camps (agent_id, agent_name, trainer_name, camp_name, location, state, district, taluk, village, start_date, end_date, target_citizens, registered_citizens, completed_citizens, training_type, status) VALUES
((SELECT id FROM public.agents WHERE email = 'rajesh@example.com' LIMIT 1), 'Rajesh Kumar', 'Dr. Patel', 'Financial Literacy Camp', 'Community Hall', 'Maharashtra', 'Mumbai', 'Andheri', 'Andheri East', '2024-02-01', '2024-02-05', 60, 58, 55, 'awareness', 'completed'),
((SELECT id FROM public.agents WHERE email = 'priya@example.com' LIMIT 1), 'Priya Sharma', 'Prof. Agarwal', 'Skill Development Workshop', 'Training Center', 'Delhi', 'Delhi', 'South Delhi', 'Lajpat Nagar', '2024-02-10', '2024-02-15', 40, 42, 40, 'skill_development', 'completed'),
((SELECT id FROM public.agents WHERE email = 'amit@example.com' LIMIT 1), 'Amit Patel', 'Dr. Reddy', 'Healthcare Awareness', 'School Ground', 'Karnataka', 'Bangalore', 'Bangalore Urban', 'Whitefield', '2024-02-20', '2024-02-25', 70, 65, 62, 'awareness', 'completed'),
((SELECT id FROM public.agents WHERE email = 'sunita@example.com' LIMIT 1), 'Sunita Singh', 'Prof. Ghosh', 'Women Empowerment', 'Women Center', 'West Bengal', 'Kolkata', 'Kolkata', 'Salt Lake', '2024-03-01', '2024-03-08', 50, 48, 45, 'capacity_building', 'completed'),
((SELECT id FROM public.agents WHERE email = 'ravi@example.com' LIMIT 1), 'Ravi Gupta', 'Dr. Iyer', 'Digital Banking Training', 'Bank Premises', 'Tamil Nadu', 'Chennai', 'Chennai', 'T Nagar', '2024-03-10', '2024-03-15', 35, 35, 33, 'skill_development', 'completed'),
((SELECT id FROM public.agents WHERE email = 'meera@example.com' LIMIT 1), 'Meera Joshi', 'Prof. Kulkarni', 'Agriculture Training', 'Farm House', 'Maharashtra', 'Pune', 'Pune', 'Shivajinagar', '2024-03-20', '2024-03-30', 80, 75, 70, 'livelihood', 'completed'),
((SELECT id FROM public.agents WHERE email = 'vikash@example.com' LIMIT 1), 'Vikash Yadav', 'Dr. Shah', 'Handicraft Workshop', 'Craft Center', 'Gujarat', 'Ahmedabad', 'Ahmedabad', 'Navrangpura', '2024-04-01', '2024-04-10', 25, 25, 23, 'livelihood', 'ongoing');

-- Add more training targets
INSERT INTO public.training_targets (agent_id, agent_name, target_camps, target_citizens, actual_camps, actual_citizens, period) VALUES
((SELECT id FROM public.agents WHERE email = 'rajesh@example.com' LIMIT 1), 'Rajesh Kumar', 15, 750, 10, 520, 'Q1-2024'),
((SELECT id FROM public.agents WHERE email = 'priya@example.com' LIMIT 1), 'Priya Sharma', 12, 600, 8, 400, 'Q1-2024'),
((SELECT id FROM public.agents WHERE email = 'amit@example.com' LIMIT 1), 'Amit Patel', 14, 700, 9, 450, 'Q1-2024'),
((SELECT id FROM public.agents WHERE email = 'sunita@example.com' LIMIT 1), 'Sunita Singh', 11, 550, 7, 350, 'Q1-2024'),
((SELECT id FROM public.agents WHERE email = 'ravi@example.com' LIMIT 1), 'Ravi Gupta', 9, 450, 6, 300, 'Q1-2024'),
((SELECT id FROM public.agents WHERE email = 'meera@example.com' LIMIT 1), 'Meera Joshi', 13, 650, 8, 420, 'Q1-2024'),
((SELECT id FROM public.agents WHERE email = 'vikash@example.com' LIMIT 1), 'Vikash Yadav', 10, 500, 6, 280, 'Q1-2024');

-- Fix the trigger function to auto-approve users for testing
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, approved)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'viewer'),
    true  -- Auto-approve for testing
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update existing profiles to be approved
UPDATE public.profiles SET approved = true WHERE approved = false;
