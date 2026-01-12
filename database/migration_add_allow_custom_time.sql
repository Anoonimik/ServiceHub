-- Migration: Add allow_custom_time column to services table
-- This migration adds the allow_custom_time column to existing services table
-- Run this if you have an existing database without this column

-- Add column if it doesn't exist (MySQL 8.0+)
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS allow_custom_time BOOLEAN DEFAULT TRUE 
COMMENT 'Allow clients to enter custom time instead of selecting from time slots';

-- Update existing services to have allow_custom_time = TRUE by default
UPDATE services 
SET allow_custom_time = TRUE 
WHERE allow_custom_time IS NULL;

