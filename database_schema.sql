-- Supabase Database Schema for ClassConnect
-- Generated based on actual database structure

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS public.Users (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  First_name text NOT NULL DEFAULT ''::text,
  Last_name text NOT NULL DEFAULT ''::text,
  Email text NOT NULL UNIQUE,
  Phone text,
  Age integer,
  Gender character varying,
  Address text,
  CIty text,
  Bio text,
  User_type text,
  CONSTRAINT Users_pkey PRIMARY KEY (id)
);

-- Teachers Table
CREATE TABLE IF NOT EXISTS public.Teachers (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  Experience_Years integer,
  Subjects ARRAY,
  Schools ARRAY,
  User_Id bigint,
  CONSTRAINT Teachers_pkey PRIMARY KEY (id),
  CONSTRAINT Teachers_User_Id_fkey FOREIGN KEY (User_Id) REFERENCES public.Users(id)
);

-- Classes Table
CREATE TABLE IF NOT EXISTS public.Classes (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  Class_Name text,
  Level character varying,
  Grade text,
  subject text,
  Description text,
  Classroom text,
  Hours real,
  Max_Students bigint,
  School text,
  Hourly_Payement text,
  Teacher_id bigint NOT NULL,
  CONSTRAINT Classes_pkey PRIMARY KEY (id),
  CONSTRAINT Classes_Teacher_id_fkey FOREIGN KEY (Teacher_id) REFERENCES public.Teachers(id)
);

-- Time Slots Table
CREATE TABLE IF NOT EXISTS public.time_slots (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  day_of_week text NOT NULL CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
  slot_index integer NOT NULL CHECK (slot_index >= 1 AND slot_index <= 10),
  start_time time NOT NULL,
  end_time time NOT NULL,
  CONSTRAINT time_slots_pkey PRIMARY KEY (id),
  CONSTRAINT time_slots_unique_day_slot UNIQUE (day_of_week, slot_index)
);

-- Schedules Table
CREATE TABLE IF NOT EXISTS public.schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  class_id bigint NOT NULL,
  slot_id bigint NOT NULL,
  classroom text,
  notes text,
  CONSTRAINT schedules_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.Classes(id) ON DELETE CASCADE,
  CONSTRAINT schedules_slot_id_fkey FOREIGN KEY (slot_id) REFERENCES public.time_slots(id) ON DELETE CASCADE,
  CONSTRAINT schedules_unique_class_slot UNIQUE (class_id, slot_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.Users(Email);
CREATE INDEX IF NOT EXISTS idx_teachers_user_id ON public.Teachers(User_Id);
CREATE INDEX IF NOT EXISTS idx_classes_teacher_id ON public.Classes(Teacher_id);
CREATE INDEX IF NOT EXISTS idx_classes_subject ON public.Classes(subject);
CREATE INDEX IF NOT EXISTS idx_time_slots_day ON public.time_slots(day_of_week);
CREATE INDEX IF NOT EXISTS idx_time_slots_slot_index ON public.time_slots(slot_index);
CREATE INDEX IF NOT EXISTS idx_schedules_class_id ON public.schedules(class_id);
CREATE INDEX IF NOT EXISTS idx_schedules_slot_id ON public.schedules(slot_id);

-- Row Level Security (RLS) policies
ALTER TABLE public.Users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.Teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.Classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own data" ON public.Users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update own data" ON public.Users FOR UPDATE USING (auth.uid()::text = id::text);
CREATE POLICY "Users can insert own data" ON public.Users FOR INSERT WITH CHECK (auth.uid()::text = id::text);

-- Teachers policies
CREATE POLICY "Teachers can view own data" ON public.Teachers FOR SELECT USING (User_Id = auth.uid()::bigint);
CREATE POLICY "Teachers can update own data" ON public.Teachers FOR UPDATE USING (User_Id = auth.uid()::bigint);
CREATE POLICY "Teachers can insert own data" ON public.Teachers FOR INSERT WITH CHECK (User_Id = auth.uid()::bigint);

-- Classes policies
CREATE POLICY "Teachers can view own classes" ON public.Classes FOR SELECT USING (
  Teacher_id IN (SELECT id FROM public.Teachers WHERE User_Id = auth.uid()::bigint)
);
CREATE POLICY "Teachers can update own classes" ON public.Classes FOR UPDATE USING (
  Teacher_id IN (SELECT id FROM public.Teachers WHERE User_Id = auth.uid()::bigint)
);
CREATE POLICY "Teachers can insert own classes" ON public.Classes FOR INSERT WITH CHECK (
  Teacher_id IN (SELECT id FROM public.Teachers WHERE User_Id = auth.uid()::bigint)
);
CREATE POLICY "Teachers can delete own classes" ON public.Classes FOR DELETE USING (
  Teacher_id IN (SELECT id FROM public.Teachers WHERE User_Id = auth.uid()::bigint)
);

-- Time slots policies (read-only for all authenticated users)
CREATE POLICY "Anyone can view time slots" ON public.time_slots FOR SELECT USING (auth.role() = 'authenticated');

-- Schedules policies
CREATE POLICY "Teachers can view own schedules" ON public.schedules FOR SELECT USING (
  class_id IN (
    SELECT c.id FROM public.Classes c 
    JOIN public.Teachers t ON c.Teacher_id = t.id 
    WHERE t.User_Id = auth.uid()::bigint
  )
);
CREATE POLICY "Teachers can update own schedules" ON public.schedules FOR UPDATE USING (
  class_id IN (
    SELECT c.id FROM public.Classes c 
    JOIN public.Teachers t ON c.Teacher_id = t.id 
    WHERE t.User_Id = auth.uid()::bigint
  )
);
CREATE POLICY "Teachers can insert own schedules" ON public.schedules FOR INSERT WITH CHECK (
  class_id IN (
    SELECT c.id FROM public.Classes c 
    JOIN public.Teachers t ON c.Teacher_id = t.id 
    WHERE t.User_Id = auth.uid()::bigint
  )
);
CREATE POLICY "Teachers can delete own schedules" ON public.schedules FOR DELETE USING (
  class_id IN (
    SELECT c.id FROM public.Classes c 
    JOIN public.Teachers t ON c.Teacher_id = t.id 
    WHERE t.User_Id = auth.uid()::bigint
  )
);

-- Populate time_slots table with 70 fixed entries (10 per day, 7 days)
INSERT INTO public.time_slots (day_of_week, slot_index, start_time, end_time) VALUES
-- Monday
('Monday', 1, '08:30:00', '09:30:00'),
('Monday', 2, '09:30:00', '10:30:00'),
('Monday', 3, '10:30:00', '11:30:00'),
('Monday', 4, '11:30:00', '12:30:00'),
('Monday', 5, '14:30:00', '15:30:00'),
('Monday', 6, '15:30:00', '16:30:00'),
('Monday', 7, '16:30:00', '17:30:00'),
('Monday', 8, '17:30:00', '18:30:00'),
('Monday', 9, '19:00:00', '20:00:00'),
('Monday', 10, '20:00:00', '21:00:00'),

-- Tuesday
('Tuesday', 1, '08:30:00', '09:30:00'),
('Tuesday', 2, '09:30:00', '10:30:00'),
('Tuesday', 3, '10:30:00', '11:30:00'),
('Tuesday', 4, '11:30:00', '12:30:00'),
('Tuesday', 5, '14:30:00', '15:30:00'),
('Tuesday', 6, '15:30:00', '16:30:00'),
('Tuesday', 7, '16:30:00', '17:30:00'),
('Tuesday', 8, '17:30:00', '18:30:00'),
('Tuesday', 9, '19:00:00', '20:00:00'),
('Tuesday', 10, '20:00:00', '21:00:00'),

-- Wednesday
('Wednesday', 1, '08:30:00', '09:30:00'),
('Wednesday', 2, '09:30:00', '10:30:00'),
('Wednesday', 3, '10:30:00', '11:30:00'),
('Wednesday', 4, '11:30:00', '12:30:00'),
('Wednesday', 5, '14:30:00', '15:30:00'),
('Wednesday', 6, '15:30:00', '16:30:00'),
('Wednesday', 7, '16:30:00', '17:30:00'),
('Wednesday', 8, '17:30:00', '18:30:00'),
('Wednesday', 9, '19:00:00', '20:00:00'),
('Wednesday', 10, '20:00:00', '21:00:00'),

-- Thursday
('Thursday', 1, '08:30:00', '09:30:00'),
('Thursday', 2, '09:30:00', '10:30:00'),
('Thursday', 3, '10:30:00', '11:30:00'),
('Thursday', 4, '11:30:00', '12:30:00'),
('Thursday', 5, '14:30:00', '15:30:00'),
('Thursday', 6, '15:30:00', '16:30:00'),
('Thursday', 7, '16:30:00', '17:30:00'),
('Thursday', 8, '17:30:00', '18:30:00'),
('Thursday', 9, '19:00:00', '20:00:00'),
('Thursday', 10, '20:00:00', '21:00:00'),

-- Friday
('Friday', 1, '08:30:00', '09:30:00'),
('Friday', 2, '09:30:00', '10:30:00'),
('Friday', 3, '10:30:00', '11:30:00'),
('Friday', 4, '11:30:00', '12:30:00'),
('Friday', 5, '14:30:00', '15:30:00'),
('Friday', 6, '15:30:00', '16:30:00'),
('Friday', 7, '16:30:00', '17:30:00'),
('Friday', 8, '17:30:00', '18:30:00'),
('Friday', 9, '19:00:00', '20:00:00'),
('Friday', 10, '20:00:00', '21:00:00'),

-- Saturday
('Saturday', 1, '08:30:00', '09:30:00'),
('Saturday', 2, '09:30:00', '10:30:00'),
('Saturday', 3, '10:30:00', '11:30:00'),
('Saturday', 4, '11:30:00', '12:30:00'),
('Saturday', 5, '14:30:00', '15:30:00'),
('Saturday', 6, '15:30:00', '16:30:00'),
('Saturday', 7, '16:30:00', '17:30:00'),
('Saturday', 8, '17:30:00', '18:30:00'),
('Saturday', 9, '19:00:00', '20:00:00'),
('Saturday', 10, '20:00:00', '21:00:00'),

-- Sunday
('Sunday', 1, '08:30:00', '09:30:00'),
('Sunday', 2, '09:30:00', '10:30:00'),
('Sunday', 3, '10:30:00', '11:30:00'),
('Sunday', 4, '11:30:00', '12:30:00'),
('Sunday', 5, '14:30:00', '15:30:00'),
('Sunday', 6, '15:30:00', '16:30:00'),
('Sunday', 7, '16:30:00', '17:30:00'),
('Sunday', 8, '17:30:00', '18:30:00'),
('Sunday', 9, '19:00:00', '20:00:00'),
('Sunday', 10, '20:00:00', '21:00:00')
ON CONFLICT (day_of_week, slot_index) DO NOTHING;

-- Sample data insertion (optional)
-- Uncomment the following lines to insert sample data

/*
-- Insert sample user
INSERT INTO public.Users (First_name, Last_name, Email, Phone, Age, Gender, Address, CIty, Bio, User_type) 
VALUES ('John', 'Doe', 'john.doe@example.com', '+1234567890', 30, 'Male', '123 Main St', 'New York', 'Experienced teacher', 'teacher');

-- Insert sample teacher
INSERT INTO public.Teachers (Experience_Years, Subjects, Schools, User_Id) 
VALUES (5, ARRAY['Mathematics', 'Physics'], ARRAY['High School A', 'University B'], 1);

-- Insert sample class
INSERT INTO public.Classes (Class_Name, Level, Grade, subject, Description, Classroom, Hours, Max_Students, School, Hourly_Payement, Teacher_id) 
VALUES ('Advanced Algebra', 'High School', '11th Grade', 'Mathematics', 'Advanced algebra course for high school students', 'Room 101', 2.5, 25, 'High School A', '50', 1);
*/ 