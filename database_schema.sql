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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.Users(Email);
CREATE INDEX IF NOT EXISTS idx_teachers_user_id ON public.Teachers(User_Id);
CREATE INDEX IF NOT EXISTS idx_classes_teacher_id ON public.Classes(Teacher_id);
CREATE INDEX IF NOT EXISTS idx_classes_subject ON public.Classes(subject);

-- Row Level Security (RLS) policies
ALTER TABLE public.Users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.Teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.Classes ENABLE ROW LEVEL SECURITY;

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