import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, uuid, bigint, jsonb, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  first_name: text("first_name"),
  last_name: text("last_name"),
  email: text("email").notNull().unique(),
  phone: bigint("phone", { mode: "number" }),
  age: bigint("age", { mode: "number" }),
  gender: text("gender"),
  address: text("address"),
  city: text("city"),
  bio: text("bio"),
  user_type: text("user_type"),
});

export const teachers = pgTable("teachers", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  experience_years: bigint("experience_years", { mode: "number" }),
  subjects: jsonb("subjects"),
  schools: jsonb("schools"),
  user_id: uuid("user_id").default(sql`auth.uid()`).unique().references(() => users.id),
});

export const classes = pgTable("classes", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  class_name: text("class_name"),
  level: text("level"),
  grade: text("grade"),
  subject: text("subject"),
  description: text("description"),
  classroom: text("classroom"),
  hours: doublePrecision("hours"),
  max_students: bigint("max_students", { mode: "number" }),
  school: text("school"),
  hourly_payement: bigint("hourly_payement", { mode: "number" }),
  teacher_id: uuid("teacher_id").references(() => teachers.id),
});

export const time_slots = pgTable("time_slots", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  day_of_week: text("day_of_week"),
  slot_index: bigint("slot_index", { mode: "number" }),
  start_time: text("start_time"),
  end_time: text("end_time"),
});

export const schedules = pgTable("schedules", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  created_at: text("created_at"),
  user_id: uuid("user_id").default(sql`auth.uid()`).references(() => users.id),
  class_room: text("class_room"),
  notes: text("notes"),
  class_id: uuid("class_id").references(() => classes.id),
  slot_id: bigint("slot_id", { mode: "number" }).references(() => time_slots.id),
});

// Legacy tables for backward compatibility (if needed)
export const students = pgTable("students", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  classId: varchar("class_id").references(() => classes.id),
  className: text("class_name").notNull(),
  gender: text("gender").notNull(),
  attendanceRate: integer("attendance_rate").notNull().default(0),
  averageGrade: text("average_grade").notNull().default("N/A"),
});

export const grades = pgTable("grades", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => students.id),
  studentName: text("student_name").notNull(),
  gradeType: text("grade_type").notNull(),
  subject: text("subject").notNull(),
  score: integer("score").notNull(),
  date: text("date").notNull(),
});

export const attendance = pgTable("attendance", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => students.id),
  studentName: text("student_name").notNull(),
  date: text("date").notNull(),
  present: boolean("present").notNull().default(false),
  absent: boolean("absent").notNull().default(false),
  late: boolean("late").notNull().default(false),
  excused: boolean("excused").notNull().default(false),
});

export const assignments = pgTable("assignments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  dueDate: text("due_date").notNull(),
  classes: text("classes").array().notNull(),
});

// Insert schemas for new tables
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  created_at: true,
});

export const insertTeacherSchema = createInsertSchema(teachers).omit({
  id: true,
  created_at: true,
});

export const insertClassSchema = createInsertSchema(classes).omit({
  id: true,
  created_at: true,
});

export const insertScheduleSchema = createInsertSchema(schedules).omit({
  id: true,
});

// Legacy insert schemas
export const insertStudentSchema = createInsertSchema(students).omit({
  id: true,
});

export const insertGradeSchema = createInsertSchema(grades).omit({
  id: true,
});

export const insertAttendanceSchema = createInsertSchema(attendance).omit({
  id: true,
});

export const insertAssignmentSchema = createInsertSchema(assignments).omit({
  id: true,
});

// Type exports for new tables
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertTeacher = z.infer<typeof insertTeacherSchema>;
export type Teacher = typeof teachers.$inferSelect;
export type InsertClass = z.infer<typeof insertClassSchema>;
export type Class = typeof classes.$inferSelect;
export type InsertSchedule = z.infer<typeof insertScheduleSchema>;
export type Schedule = typeof schedules.$inferSelect;
export type TimeSlot = typeof time_slots.$inferSelect;

// Legacy type exports
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Student = typeof students.$inferSelect;
export type InsertGrade = z.infer<typeof insertGradeSchema>;
export type Grade = typeof grades.$inferSelect;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;
export type AttendanceRecord = typeof attendance.$inferSelect;
export type InsertAssignment = z.infer<typeof insertAssignmentSchema>;
export type Assignment = typeof assignments.$inferSelect;
