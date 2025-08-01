-- Updated Database Schema for ClassConnect
-- This schema matches the auth_setup.sql and uses UUID primary keys

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
  user_id uuid DEFAULT auth.uid(),
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

-- Populate time_slots table with 70 fixed entries (10 per day, 7 days)
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