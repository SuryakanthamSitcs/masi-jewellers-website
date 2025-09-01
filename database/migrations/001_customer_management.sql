-- Customer Management System Schema
-- Phase 1 Implementation

-- Enhanced customers table with additional fields
ALTER TABLE customers ADD COLUMN IF NOT EXISTS customer_type VARCHAR(20) DEFAULT 'regular';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS gender VARCHAR(10);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS occupation VARCHAR(100);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS annual_income DECIMAL(12,2);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS kyc_verified BOOLEAN DEFAULT false;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS kyc_document_path VARCHAR(500);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS last_visit DATE;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS total_purchases DECIMAL(12,2) DEFAULT 0.00;

-- Customer purchases tracking
CREATE TABLE IF NOT EXISTS customer_purchases (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    metal_rate_at_purchase DECIMAL(10,2),
    making_charges DECIMAL(10,2),
    gst_amount DECIMAL(10,2),
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    payment_method VARCHAR(20) DEFAULT 'cash',
    payment_status VARCHAR(20) DEFAULT 'paid',
    invoice_number VARCHAR(50) UNIQUE,
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- Customer documents management
CREATE TABLE IF NOT EXISTS customer_documents (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    document_type VARCHAR(50) NOT NULL,
    document_number VARCHAR(100) NOT NULL,
    document_path VARCHAR(500),
    uploaded_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_date TIMESTAMP,
    verified_by VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending'
);

-- Customer contact methods
CREATE TABLE IF NOT EXISTS customer_contacts (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    contact_type VARCHAR(20) NOT NULL,
    contact_value VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_name ON customers(name);
CREATE INDEX IF NOT EXISTS idx_purchases_customer ON customer_purchases(customer_id);
CREATE INDEX IF NOT EXISTS idx_purchases_date ON customer_purchases(purchase_date);
CREATE INDEX IF NOT EXISTS idx_documents_customer ON customer_documents(customer_id);

-- Insert sample customer data
INSERT INTO customers (name, phone, email, address, kyc_document_type, kyc_document_number, customer_type, kyc_verified) VALUES
('Rajesh Kumar', '+91-9876543210', 'rajesh.kumar@email.com', '123 MG Road, Chennai', 'Aadhar', '1234-5678-9012', 'premium', true),
('Priya Sharma', '+91-9876543211', 'priya.sharma@email.com', '456 Anna Nagar, Chennai', 'PAN', 'ABCDE1234F', 'regular', true),
('Suresh Reddy', '+91-9876543212', 'suresh.reddy@email.com', '789 T Nagar, Chennai', 'Aadhar', '2345-6789-0123', 'regular', false)
ON CONFLICT (phone) DO NOTHING;
