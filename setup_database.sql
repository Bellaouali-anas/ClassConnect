-- Complete Database Setup for ClassConnect
-- Run this script in your Supabase SQL editor to set up the entire database

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (be careful with this in production!)
DROP TABLE IF EXISTS public.schedules CASCADE;
DROP TABLE IF EXISTS public.classes CASCADE;
DROP TABLE IF EXISTS public.teachers CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.time_slots CASCADE;

-- Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  first_name text,
  last_name text,
  email text NOT NULL UNIQUE,
  phone bigint,
  age bigint,
  gender text,
  address text,
  city text,
  bio text,
  user_type text,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);

-- Teachers Table
CREATE TABLE IF NOT EXISTS public.teachers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  experience_years bigint,
  subjects jsonb,
  schools jsonb,
  user_id uuid DEFAULT auth.uid() UNIQUE,
  CONSTRAINT teachers_pkey PRIMARY KEY (id),
  CONSTRAINT teachers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

-- Classes Table
CREATE TABLE IF NOT EXISTS public.classes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  class_name text,
  level text,
  grade text,
  subject text,
  description text,
  classroom text,
  hours double precision,
  max_students bigint,
  school text,
  hourly_payement bigint,
  teacher_id uuid,
  CONSTRAINT classes_pkey PRIMARY KEY (id),
  CONSTRAINT classes_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id)
);

-- Time Slots Table
CREATE TABLE IF NOT EXISTS public.time_slots (
  id bigint NOT NULL,
  day_of_week text,
  slot_index bigint,
  start_time text,
  end_time text,
  CONSTRAINT time_slots_pkey PRIMARY KEY (id)
);

-- Schedules Table
CREATE TABLE IF NOT EXISTS public.schedules (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at text,
  user_id uuid DEFAULT auth.uid(),
  class_room text,
  notes text,
  class_id uuid,
  slot_id bigint,
  CONSTRAINT schedules_pkey PRIMARY KEY (id),
  CONSTRAINT schedules_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id),
  CONSTRAINT schedules_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT schedules_slot_id_fkey FOREIGN KEY (slot_id) REFERENCES public.time_slots(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_teachers_user_id ON public.teachers(user_id);
CREATE INDEX IF NOT EXISTS idx_classes_teacher_id ON public.classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_classes_subject ON public.classes(subject);
CREATE INDEX IF NOT EXISTS idx_time_slots_day ON public.time_slots(day_of_week);
CREATE INDEX IF NOT EXISTS idx_time_slots_slot_index ON public.time_slots(slot_index);
CREATE INDEX IF NOT EXISTS idx_schedules_class_id ON public.schedules(class_id);
CREATE INDEX IF NOT EXISTS idx_schedules_slot_id ON public.schedules(slot_id);
CREATE INDEX IF NOT EXISTS idx_schedules_user_id ON public.schedules(user_id);

-- Populate time_slots table with 63 fixed entries (9 per day, 7 days)
INSERT INTO public.time_slots (id, day_of_week, slot_index, start_time, end_time) VALUES
-- Monday
(1, 'Monday', 1, '08:30', '09:30'),
(2, 'Monday', 2, '09:30', '10:30'),
(3, 'Monday', 3, '10:30', '11:30'),
(4, 'Monday', 4, '11:30', '12:30'),
(5, 'Monday', 5, '14:30', '15:30'),
(6, 'Monday', 6, '15:30', '16:30'),
(7, 'Monday', 7, '16:30', '17:30'),
(8, 'Monday', 8, '17:30', '18:30'),                                 
(9, 'Monday', 9, '19:00', '21:00'),

-- Tuesday
(10, 'Tuesday', 1, '08:30', '09:30'),
(11, 'Tuesday', 2, '09:30', '10:30'),
(12, 'Tuesday', 3, '10:30', '11:30'),
(13, 'Tuesday', 4, '11:30', '12:30'),
(14, 'Tuesday', 5, '14:30', '15:30'),
(15, 'Tuesday', 6, '15:30', '16:30'),
(16, 'Tuesday', 7, '16:30', '17:30'),
(17, 'Tuesday', 8, '17:30', '18:30'),
(18, 'Tuesday', 9, '19:00', '21:00'),

-- Wednesday
(19, 'Wednesday', 1, '08:30', '09:30'),
(20, 'Wednesday', 2, '09:30', '10:30'),
(21, 'Wednesday', 3, '10:30', '11:30'),
(22, 'Wednesday', 4, '11:30', '12:30'),
(23, 'Wednesday', 5, '14:30', '15:30'),
(24, 'Wednesday', 6, '15:30', '16:30'),
(25, 'Wednesday', 7, '16:30', '17:30'),
(26, 'Wednesday', 8, '17:30', '18:30'),
(27, 'Wednesday', 9, '19:00', '21:00'),

-- Thursday
(28, 'Thursday', 1, '08:30', '09:30'),
(29, 'Thursday', 2, '09:30', '10:30'),
(30, 'Thursday', 3, '10:30', '11:30'),
(31, 'Thursday', 4, '11:30', '12:30'),
(32, 'Thursday', 5, '14:30', '15:30'),
(33, 'Thursday', 6, '15:30', '16:30'),
(34, 'Thursday', 7, '16:30', '17:30'),
(35, 'Thursday', 8, '17:30', '18:30'),
(36, 'Thursday', 9, '19:00', '21:00'),

-- Friday
(37, 'Friday', 1, '08:30', '09:30'),
(38, 'Friday', 2, '09:30', '10:30'),
(39, 'Friday', 3, '10:30', '11:30'),
(40, 'Friday', 4, '11:30', '12:30'),
(41, 'Friday', 5, '14:30', '15:30'),
(42, 'Friday', 6, '15:30', '16:30'),
(43, 'Friday', 7, '16:30', '17:30'),
(44, 'Friday', 8, '17:30', '18:30'),
(45, 'Friday', 9, '19:00', '21:00'),

-- Saturday
(46, 'Saturday', 1, '08:30', '09:30'),
(47, 'Saturday', 2, '09:30', '10:30'),
(48, 'Saturday', 3, '10:30', '11:30'),
(49, 'Saturday', 4, '11:30', '12:30'),
(50, 'Saturday', 5, '14:30', '15:30'),
(51, 'Saturday', 6, '15:30', '16:30'),
(52, 'Saturday', 7, '16:30', '17:30'),
(53, 'Saturday', 8, '17:30', '18:30'),
(54, 'Saturday', 9, '19:00', '21:00'),

-- Sunday
(55, 'Sunday', 1, '08:30', '09:30'),
(56, 'Sunday', 2, '09:30', '10:30'),
(57, 'Sunday', 3, '10:30', '11:30'),
(58, 'Sunday', 4, '11:30', '12:30'),
(59, 'Sunday', 5, '14:30', '15:30'),
(60, 'Sunday', 6, '15:30', '16:30'),
(61, 'Sunday', 7, '16:30', '17:30'),
(62, 'Sunday', 8, '17:30', '18:30'),
(63, 'Sunday', 9, '19:00', '21:00')

ON CONFLICT (id) DO NOTHING;

-- Now run the auth setup functions and policies
-- Drop all existing policies first (they depend on the functions)
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Teachers can view own record" ON public.teachers;
DROP POLICY IF EXISTS "Teachers can update own record" ON public.teachers;
DROP POLICY IF EXISTS "Teachers can view own classes" ON public.classes;
DROP POLICY IF EXISTS "Teachers can create own classes" ON public.classes;
DROP POLICY IF EXISTS "Teachers can update own classes" ON public.classes;
DROP POLICY IF EXISTS "Teachers can delete own classes" ON public.classes;
DROP POLICY IF EXISTS "Users can view own schedules" ON public.schedules;
DROP POLICY IF EXISTS "Users can create own schedules" ON public.schedules;
DROP POLICY IF EXISTS "Users can update own schedules" ON public.schedules;
DROP POLICY IF EXISTS "Users can delete own schedules" ON public.schedules;
DROP POLICY IF EXISTS "Anyone can view time slots" ON public.time_slots;

-- Drop the triggers first (they depend on the functions)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_new_teacher ON public.users;

-- Now drop the functions
DROP FUNCTION IF EXISTS get_user_id();
DROP FUNCTION IF EXISTS get_user_type();
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS auto_create_teacher();

-- Function to get the current user's ID with enhanced security
CREATE OR REPLACE FUNCTION get_user_id()
RETURNS UUID
LANGUAGE SQL
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT (auth.jwt() ->> 'sub')::UUID;
$$;

-- Function to get the current user's type
CREATE OR REPLACE FUNCTION get_user_type()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT user_type FROM public.users 
  WHERE id = (SELECT (auth.jwt() ->> 'sub')::UUID);
$$;

-- Updated trigger function for user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_metadata JSONB;
BEGIN
  -- Parse raw_user_meta_data
  v_metadata := COALESCE(NEW.raw_user_meta_data, '{}'::JSONB);
  
  -- Insert user record into public.users table
  INSERT INTO public.users (
    id,
    email,
    first_name,
    last_name,
    user_type
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(v_metadata->>'first_name', ''),
    COALESCE(v_metadata->>'last_name', ''),
    COALESCE(v_metadata->>'user_type', 'student')
  ) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    user_type = EXCLUDED.user_type;
  
  RETURN NEW;
EXCEPTION 
  WHEN OTHERS THEN
    RAISE NOTICE 'Error in handle_new_user: % - %', SQLERRM, SQLSTATE;
    RETURN NEW;
END;
$$;

-- Function to auto-create teacher record
CREATE OR REPLACE FUNCTION public.auto_create_teacher()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    -- If the new user is a teacher, automatically insert into teachers table
    IF NEW.user_type = 'teacher' THEN
        INSERT INTO public.teachers (
            user_id
        ) VALUES (
            NEW.id
        ) ON CONFLICT (user_id) DO NOTHING;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create the triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_new_teacher
AFTER INSERT ON public.users
FOR EACH ROW
WHEN (NEW.user_type = 'teacher')
EXECUTE FUNCTION public.auto_create_teacher();

-- Improved RLS Policies for Users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (id = get_user_id());

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (id = get_user_id())
  WITH CHECK (
    id = get_user_id() AND 
    (
      first_name IS NOT NULL OR 
      last_name IS NOT NULL OR 
      phone IS NOT NULL OR 
      bio IS NOT NULL OR
      age IS NOT NULL OR
      gender IS NOT NULL OR
      address IS NOT NULL OR
      city IS NOT NULL
    )
  );

-- Improved Teachers RLS Policies
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers can view own record" ON public.teachers
  FOR SELECT USING (user_id = get_user_id());

CREATE POLICY "Teachers can update own record" ON public.teachers
  FOR UPDATE USING (user_id = get_user_id())
  WITH CHECK (
    user_id = get_user_id() AND 
    get_user_type() = 'teacher'
  );

-- Classes table policies
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers can view own classes" ON public.classes
  FOR SELECT USING (teacher_id IN (
    SELECT id FROM public.teachers WHERE user_id = get_user_id()
  ));

CREATE POLICY "Teachers can create own classes" ON public.classes
  FOR INSERT WITH CHECK (teacher_id IN (
    SELECT id FROM public.teachers WHERE user_id = get_user_id()
  ));

CREATE POLICY "Teachers can update own classes" ON public.classes
  FOR UPDATE USING (teacher_id IN (
    SELECT id FROM public.teachers WHERE user_id = get_user_id()
  ));

CREATE POLICY "Teachers can delete own classes" ON public.classes
  FOR DELETE USING (teacher_id IN (
    SELECT id FROM public.teachers WHERE user_id = get_user_id()
  ));

-- Schedules table policies
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own schedules" ON public.schedules
  FOR SELECT USING (user_id = get_user_id());

CREATE POLICY "Users can create own schedules" ON public.schedules
  FOR INSERT WITH CHECK (user_id = get_user_id());

CREATE POLICY "Users can update own schedules" ON public.schedules
  FOR UPDATE USING (user_id = get_user_id());

CREATE POLICY "Users can delete own schedules" ON public.schedules
  FOR DELETE USING (user_id = get_user_id());

-- Time_slots table policies (public read access)
ALTER TABLE public.time_slots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view time slots" ON public.time_slots
  FOR SELECT USING (true);

-- Permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, UPDATE ON public.users TO authenticated;
GRANT SELECT, UPDATE ON public.teachers TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.classes TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.schedules TO authenticated;
GRANT SELECT ON public.time_slots TO authenticated;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_teachers_user_id ON public.teachers(user_id);
CREATE INDEX IF NOT EXISTS idx_schedules_user_id ON public.schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_classes_teacher_id ON public.classes(teacher_id);

-- Success message
SELECT 'Database setup completed successfully! Users will now be automatically added to the public.users table when they register.' as status; 