-- Add FAQ column to product_disclosure_statements table
ALTER TABLE product_disclosure_statements
ADD COLUMN faq JSONB DEFAULT '{"questions": []}'::jsonb;