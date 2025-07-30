-- Check existing tables in the database
-- Run this first to see what tables exist

-- List all tables in the public schema
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check if there are any user-related tables
SELECT 
    table_name,
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name ILIKE '%user%'
ORDER BY table_name, ordinal_position;

-- Check if there are any tables with 'id' columns that might be user tables
SELECT 
    t.table_name,
    c.column_name,
    c.data_type
FROM information_schema.tables t
JOIN information_schema.columns c ON t.table_name = c.table_name
WHERE t.table_schema = 'public' 
AND c.table_schema = 'public'
AND c.column_name = 'id'
AND t.table_type = 'BASE TABLE'
ORDER BY t.table_name; 