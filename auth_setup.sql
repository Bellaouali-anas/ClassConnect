-- Improved User Management Functions and Policies for Updated Schema

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

-- Drop the trigger first (it depends on handle_new_user function)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Now drop the functions
DROP FUNCTION IF EXISTS get_user_id();
DROP FUNCTION IF EXISTS get_user_type();
DROP FUNCTION IF EXISTS handle_new_user();

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

-- Enhanced trigger function for user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_type TEXT;
BEGIN
  -- Set default user type if not provided
  v_user_type := COALESCE(
    NEW.raw_user_meta_data->>'user_type', 
    'student'
  );

  -- Insert user record into public.users table
  INSERT INTO public.users (
    id,
    first_name,
    last_name,
    email,
    user_type,
    phone
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    NEW.email,
    v_user_type,
    CASE 
      WHEN NEW.phone IS NOT NULL THEN NEW.phone::bigint
      ELSE NULL
    END
  ) ON CONFLICT (id) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    email = EXCLUDED.email,
    user_type = EXCLUDED.user_type,
    phone = EXCLUDED.phone;
  
  -- Conditional teacher record creation
  IF v_user_type = 'teacher' THEN
    INSERT INTO public.teachers (
      user_id,
      experience_years,
      subjects
    ) VALUES (
      NEW.id,
      CASE 
        WHEN NEW.raw_user_meta_data->>'experience_years' IS NOT NULL 
        THEN (NEW.raw_user_meta_data->>'experience_years')::bigint
        ELSE NULL
      END,
      CASE 
        WHEN NEW.raw_user_meta_data->>'subjects' IS NOT NULL 
        THEN NEW.raw_user_meta_data->>'subjects'::jsonb
        ELSE NULL
      END
    ) ON CONFLICT (user_id) DO UPDATE SET
      experience_years = EXCLUDED.experience_years,
      subjects = EXCLUDED.subjects;
  END IF;
  
  RETURN NEW;
EXCEPTION 
  WHEN OTHERS THEN
    RAISE NOTICE 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Recreate the trigger with the new function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

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