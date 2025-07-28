import { type User, type InsertUser, type Class, type InsertClass, type Student, type InsertStudent, type Grade, type InsertGrade, type AttendanceRecord, type InsertAttendance, type Assignment, type InsertAssignment } from "@shared/schema";
import { supabaseAdmin } from "../lib/supabase";

export interface ISupabaseStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<User>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;

  // Class operations
  getClass(id: string): Promise<Class | undefined>;
  getAllClasses(): Promise<Class[]>;
  createClass(classData: InsertClass): Promise<Class>;
  updateClass(id: string, classData: Partial<Class>): Promise<Class | undefined>;
  deleteClass(id: string): Promise<boolean>;

  // Student operations
  getStudent(id: string): Promise<Student | undefined>;
  getAllStudents(): Promise<Student[]>;
  getStudentsByClass(classId: string): Promise<Student[]>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudent(id: string, student: Partial<Student>): Promise<Student | undefined>;
  deleteStudent(id: string): Promise<boolean>;

  // Grade operations
  getGrade(id: string): Promise<Grade | undefined>;
  getGradesByStudent(studentId: string): Promise<Grade[]>;
  getAllGrades(): Promise<Grade[]>;
  createGrade(grade: InsertGrade): Promise<Grade>;
  updateGrade(id: string, grade: Partial<Grade>): Promise<Grade | undefined>;
  deleteGrade(id: string): Promise<boolean>;

  // Attendance operations
  getAttendance(id: string): Promise<AttendanceRecord | undefined>;
  getAttendanceByStudent(studentId: string): Promise<AttendanceRecord[]>;
  getAttendanceByDate(date: string): Promise<AttendanceRecord[]>;
  getAllAttendance(): Promise<AttendanceRecord[]>;
  createAttendance(attendance: InsertAttendance): Promise<AttendanceRecord>;
  updateAttendance(id: string, attendance: Partial<AttendanceRecord>): Promise<AttendanceRecord | undefined>;
  deleteAttendance(id: string): Promise<boolean>;

  // Assignment operations
  getAssignment(id: string): Promise<Assignment | undefined>;
  getAllAssignments(): Promise<Assignment[]>;
  createAssignment(assignment: InsertAssignment): Promise<Assignment>;
  updateAssignment(id: string, assignment: Partial<Assignment>): Promise<Assignment | undefined>;
  deleteAssignment(id: string): Promise<boolean>;
}

export class SupabaseStorage implements ISupabaseStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return undefined;
    return data as User;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !data) return undefined;
    return data as User;
  }

  async createUser(user: InsertUser): Promise<User> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert(user)
      .select()
      .single();

    if (error) throw new Error(`Failed to create user: ${error.message}`);
    return data as User;
  }

  async updateUser(id: string, user: Partial<User>): Promise<User | undefined> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .update(user)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return undefined;
    return data as User;
  }

  async deleteUser(id: string): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', id);

    return !error;
  }

  // Class operations
  async getClass(id: string): Promise<Class | undefined> {
    const { data, error } = await supabaseAdmin
      .from('classes')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return undefined;
    return data as Class;
  }

  async getAllClasses(): Promise<Class[]> {
    const { data, error } = await supabaseAdmin
      .from('classes')
      .select('*')
      .order('name');

    if (error) throw new Error(`Failed to fetch classes: ${error.message}`);
    return data as Class[];
  }

  async createClass(classData: InsertClass): Promise<Class> {
    const { data, error } = await supabaseAdmin
      .from('classes')
      .insert(classData)
      .select()
      .single();

    if (error) throw new Error(`Failed to create class: ${error.message}`);
    return data as Class;
  }

  async updateClass(id: string, classData: Partial<Class>): Promise<Class | undefined> {
    const { data, error } = await supabaseAdmin
      .from('classes')
      .update(classData)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return undefined;
    return data as Class;
  }

  async deleteClass(id: string): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from('classes')
      .delete()
      .eq('id', id);

    return !error;
  }

  // Student operations
  async getStudent(id: string): Promise<Student | undefined> {
    const { data, error } = await supabaseAdmin
      .from('students')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return undefined;
    return data as Student;
  }

  async getAllStudents(): Promise<Student[]> {
    const { data, error } = await supabaseAdmin
      .from('students')
      .select('*')
      .order('name');

    if (error) throw new Error(`Failed to fetch students: ${error.message}`);
    return data as Student[];
  }

  async getStudentsByClass(classId: string): Promise<Student[]> {
    const { data, error } = await supabaseAdmin
      .from('students')
      .select('*')
      .eq('class_id', classId)
      .order('name');

    if (error) throw new Error(`Failed to fetch students by class: ${error.message}`);
    return data as Student[];
  }

  async createStudent(student: InsertStudent): Promise<Student> {
    const { data, error } = await supabaseAdmin
      .from('students')
      .insert(student)
      .select()
      .single();

    if (error) throw new Error(`Failed to create student: ${error.message}`);
    return data as Student;
  }

  async updateStudent(id: string, student: Partial<Student>): Promise<Student | undefined> {
    const { data, error } = await supabaseAdmin
      .from('students')
      .update(student)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return undefined;
    return data as Student;
  }

  async deleteStudent(id: string): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from('students')
      .delete()
      .eq('id', id);

    return !error;
  }

  // Grade operations
  async getGrade(id: string): Promise<Grade | undefined> {
    const { data, error } = await supabaseAdmin
      .from('grades')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return undefined;
    return data as Grade;
  }

  async getGradesByStudent(studentId: string): Promise<Grade[]> {
    const { data, error } = await supabaseAdmin
      .from('grades')
      .select('*')
      .eq('student_id', studentId)
      .order('date', { ascending: false });

    if (error) throw new Error(`Failed to fetch grades by student: ${error.message}`);
    return data as Grade[];
  }

  async getAllGrades(): Promise<Grade[]> {
    const { data, error } = await supabaseAdmin
      .from('grades')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw new Error(`Failed to fetch grades: ${error.message}`);
    return data as Grade[];
  }

  async createGrade(grade: InsertGrade): Promise<Grade> {
    const { data, error } = await supabaseAdmin
      .from('grades')
      .insert(grade)
      .select()
      .single();

    if (error) throw new Error(`Failed to create grade: ${error.message}`);
    return data as Grade;
  }

  async updateGrade(id: string, grade: Partial<Grade>): Promise<Grade | undefined> {
    const { data, error } = await supabaseAdmin
      .from('grades')
      .update(grade)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return undefined;
    return data as Grade;
  }

  async deleteGrade(id: string): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from('grades')
      .delete()
      .eq('id', id);

    return !error;
  }

  // Attendance operations
  async getAttendance(id: string): Promise<AttendanceRecord | undefined> {
    const { data, error } = await supabaseAdmin
      .from('attendance')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return undefined;
    return data as AttendanceRecord;
  }

  async getAttendanceByStudent(studentId: string): Promise<AttendanceRecord[]> {
    const { data, error } = await supabaseAdmin
      .from('attendance')
      .select('*')
      .eq('student_id', studentId)
      .order('date', { ascending: false });

    if (error) throw new Error(`Failed to fetch attendance by student: ${error.message}`);
    return data as AttendanceRecord[];
  }

  async getAttendanceByDate(date: string): Promise<AttendanceRecord[]> {
    const { data, error } = await supabaseAdmin
      .from('attendance')
      .select('*')
      .eq('date', date)
      .order('student_name');

    if (error) throw new Error(`Failed to fetch attendance by date: ${error.message}`);
    return data as AttendanceRecord[];
  }

  async getAllAttendance(): Promise<AttendanceRecord[]> {
    const { data, error } = await supabaseAdmin
      .from('attendance')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw new Error(`Failed to fetch attendance: ${error.message}`);
    return data as AttendanceRecord[];
  }

  async createAttendance(attendance: InsertAttendance): Promise<AttendanceRecord> {
    const { data, error } = await supabaseAdmin
      .from('attendance')
      .insert(attendance)
      .select()
      .single();

    if (error) throw new Error(`Failed to create attendance: ${error.message}`);
    return data as AttendanceRecord;
  }

  async updateAttendance(id: string, attendance: Partial<AttendanceRecord>): Promise<AttendanceRecord | undefined> {
    const { data, error } = await supabaseAdmin
      .from('attendance')
      .update(attendance)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return undefined;
    return data as AttendanceRecord;
  }

  async deleteAttendance(id: string): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from('attendance')
      .delete()
      .eq('id', id);

    return !error;
  }

  // Assignment operations
  async getAssignment(id: string): Promise<Assignment | undefined> {
    const { data, error } = await supabaseAdmin
      .from('assignments')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return undefined;
    return data as Assignment;
  }

  async getAllAssignments(): Promise<Assignment[]> {
    const { data, error } = await supabaseAdmin
      .from('assignments')
      .select('*')
      .order('due_date');

    if (error) throw new Error(`Failed to fetch assignments: ${error.message}`);
    return data as Assignment[];
  }

  async createAssignment(assignment: InsertAssignment): Promise<Assignment> {
    const { data, error } = await supabaseAdmin
      .from('assignments')
      .insert(assignment)
      .select()
      .single();

    if (error) throw new Error(`Failed to create assignment: ${error.message}`);
    return data as Assignment;
  }

  async updateAssignment(id: string, assignment: Partial<Assignment>): Promise<Assignment | undefined> {
    const { data, error } = await supabaseAdmin
      .from('assignments')
      .update(assignment)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return undefined;
    return data as Assignment;
  }

  async deleteAssignment(id: string): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from('assignments')
      .delete()
      .eq('id', id);

    return !error;
  }
}

export const supabaseStorage = new SupabaseStorage(); 