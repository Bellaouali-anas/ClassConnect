-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create classes table
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  student_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
  class_name TEXT NOT NULL,
  gender TEXT NOT NULL,
  attendance_rate INTEGER NOT NULL DEFAULT 0,
  average_grade TEXT NOT NULL DEFAULT 'N/A',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create grades table
CREATE TABLE IF NOT EXISTS grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE SET NULL,
  student_name TEXT NOT NULL,
  grade_type TEXT NOT NULL,
  subject TEXT NOT NULL,
  score INTEGER NOT NULL,
  date TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE SET NULL,
  student_name TEXT NOT NULL,
  date TEXT NOT NULL,
  present BOOLEAN NOT NULL DEFAULT false,
  absent BOOLEAN NOT NULL DEFAULT false,
  late BOOLEAN NOT NULL DEFAULT false,
  excused BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assignments table
CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  due_date TEXT NOT NULL,
  classes TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_students_class_id ON students(class_id);
CREATE INDEX IF NOT EXISTS idx_students_name ON students(name);
CREATE INDEX IF NOT EXISTS idx_grades_student_id ON grades(student_id);
CREATE INDEX IF NOT EXISTS idx_grades_date ON grades(date);
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_assignments_due_date ON assignments(due_date);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public access (you can modify these based on your auth requirements)
CREATE POLICY "Allow public read access" ON users FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON classes FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON students FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON grades FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON attendance FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON assignments FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert access" ON classes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert access" ON students FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert access" ON grades FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert access" ON attendance FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert access" ON assignments FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access" ON users FOR UPDATE USING (true);
CREATE POLICY "Allow public update access" ON classes FOR UPDATE USING (true);
CREATE POLICY "Allow public update access" ON students FOR UPDATE USING (true);
CREATE POLICY "Allow public update access" ON grades FOR UPDATE USING (true);
CREATE POLICY "Allow public update access" ON attendance FOR UPDATE USING (true);
CREATE POLICY "Allow public update access" ON assignments FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access" ON users FOR DELETE USING (true);
CREATE POLICY "Allow public delete access" ON classes FOR DELETE USING (true);
CREATE POLICY "Allow public delete access" ON students FOR DELETE USING (true);
CREATE POLICY "Allow public delete access" ON grades FOR DELETE USING (true);
CREATE POLICY "Allow public delete access" ON attendance FOR DELETE USING (true);
CREATE POLICY "Allow public delete access" ON assignments FOR DELETE USING (true); 