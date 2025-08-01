-- Simplified Migration Script for UUID Schema
-- This script sets up authentication functions and policies for the existing UUID schema

-- Step 1: Drop existing objects safely
-- Drop all policies that depend on the functions
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

-- Drop the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the functions
DROP FUNCTION IF EXISTS get_user_id() CASCADE;
DROP FUNCTION IF EXISTS get_user_type() CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

-- Step 2: Create the enhanced functions
-- Enhanced User ID Retrieval Function
CREATE OR REPLACE FUNCTION get_user_id()
RETURNS UUID
LANGUAGE SQL
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT COALESCE(
    (auth.jwt() ->> 'sub')::UUID, 
    '00000000-0000-0000-0000-000000000000'::UUID
  );
$$;

-- Robust User Type Retrieval Function
CREATE OR REPLACE FUNCTION get_user_type()
RETURNS TEXT
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_type TEXT;
BEGIN
  SELECT user_type INTO v_user_type 
  FROM public.users 
  WHERE id = get_user_id();
  
  RETURN COALESCE(v_user_type, 'unknown');
END;
$$;

-- Advanced User Creation Trigger Function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_type TEXT;
  v_subjects JSONB;
BEGIN
  -- Validate required metadata with more robust checks
  IF NEW.raw_user_meta_data IS NULL THEN
    RAISE EXCEPTION 'User metadata is required during registration';
  END IF;

  -- Sanitize and validate user type
  v_user_type := LOWER(
    COALESCE(
      NULLIF(TRIM(NEW.raw_user_meta_data->>'user_type'), ''), 
      'student'
    )
  );

  -- Validate user type
  IF v_user_type NOT IN ('student', 'teacher', 'admin') THEN
    v_user_type := 'student';
  END IF;

  -- Sanitize name inputs
  NEW.raw_user_meta_data := jsonb_set(
    NEW.raw_user_meta_data, 
    '{first_name}', 
    to_jsonb(COALESCE(
      NULLIF(TRIM(NEW.raw_user_meta_data->>'first_name'), ''), 
      'User'
    ))
  );

  NEW.raw_user_meta_data := jsonb_set(
    NEW.raw_user_meta_data, 
    '{last_name}', 
    to_jsonb(COALESCE(
      NULLIF(TRIM(NEW.raw_user_meta_data->>'last_name'), ''), 
      ''
    ))
  );

  -- Validate and clean phone number (basic format)
  IF NEW.phone IS NOT NULL AND 
     NEW.phone !~ '^(\+\d{1,3}[- ]?)?\d{10}$' THEN
    NEW.phone := NULL;
  END IF;

  -- Insert user record with enhanced validation
  INSERT INTO public.users (
    id,
    first_name,
    last_name,
    email,
    user_type,
    phone,
    bio
  ) VALUES (
    NEW.id::UUID,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.email,
    v_user_type,
    CASE 
      WHEN NEW.phone ~ '^\d+$' THEN (NEW.phone)::bigint
      ELSE NULL
    END,
    COALESCE(
      NULLIF(TRIM(NEW.raw_user_meta_data->>'bio'), ''), 
      NULL
    )
  ) ON CONFLICT (id) DO UPDATE 
  SET 
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    user_type = EXCLUDED.user_type,
    phone = COALESCE(EXCLUDED.phone, users.phone);

  -- Conditional teacher record creation with more robust parsing
  IF v_user_type = 'teacher' THEN
    -- Parse subjects as JSONB
    v_subjects := CASE 
      WHEN NEW.raw_user_meta_data->>'subjects' IS NOT NULL THEN
        to_jsonb(
          ARRAY(
            SELECT TRIM(subject) 
            FROM unnest(
              string_to_array(
                COALESCE(
                  NULLIF(TRIM(NEW.raw_user_meta_data->>'subjects'), ''), 
                  ''
                ), 
                ','
              )
            ) AS subject
            WHERE subject IS NOT NULL AND subject != ''
          )
        )
      ELSE '[]'::jsonb
    END;

    INSERT INTO public.teachers (
      user_id,
      experience_years,
      subjects
    ) VALUES (
      NEW.id::UUID,
      COALESCE(
        (NEW.raw_user_meta_data->>'experience_years')::bigint, 
        0
      ),
      v_subjects
    ) ON CONFLICT (user_id) DO UPDATE 
    SET 
      experience_years = EXCLUDED.experience_years,
      subjects = EXCLUDED.subjects;
  END IF;
  
  RETURN NEW;
EXCEPTION 
  WHEN OTHERS THEN
    -- Log error but don't block user creation
    RAISE LOG 'Error in handle_new_user for user %: %', NEW.email, SQLERRM;
    RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Step 3: Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_slots ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS Policies
-- Users Table
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (id = get_user_id());

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE 
  USING (id = get_user_id())
  WITH CHECK (
    id = get_user_id() AND 
    (
      first_name IS NOT DISTINCT FROM first_name OR 
      last_name IS NOT DISTINCT FROM last_name OR 
      phone IS NOT DISTINCT FROM phone OR 
      bio IS NOT DISTINCT FROM bio
    )
  );

-- Teachers Table
CREATE POLICY "Teachers can view own record" ON public.teachers
  FOR SELECT USING (user_id = get_user_id());

CREATE POLICY "Teachers can update own record" ON public.teachers
  FOR UPDATE 
  USING (user_id = get_user_id() AND get_user_type() = 'teacher')
  WITH CHECK (
    user_id = get_user_id() AND 
    get_user_type() = 'teacher'
  );

-- Classes table policies
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
CREATE POLICY "Users can view own schedules" ON public.schedules
  FOR SELECT USING (user_id = get_user_id());

CREATE POLICY "Users can create own schedules" ON public.schedules
  FOR INSERT WITH CHECK (user_id = get_user_id());

CREATE POLICY "Users can update own schedules" ON public.schedules
  FOR UPDATE USING (user_id = get_user_id());

CREATE POLICY "Users can delete own schedules" ON public.schedules
  FOR DELETE USING (user_id = get_user_id());

-- Time_slots table policies (public read access)
CREATE POLICY "Anyone can view time slots" ON public.time_slots
  FOR SELECT USING (true);

-- Step 5: Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, UPDATE ON public.users TO authenticated;
GRANT SELECT, UPDATE ON public.teachers TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.classes TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.schedules TO authenticated;
GRANT SELECT ON public.time_slots TO authenticated;

-- Step 6: Create performance indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_teachers_user_id ON public.teachers(user_id);
CREATE INDEX IF NOT EXISTS idx_schedules_user_id ON public.schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_classes_teacher_id ON public.classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON public.users(user_type);

-- Migration complete!
SELECT 'UUID Authentication setup completed successfully!' as status; 