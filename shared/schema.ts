import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const classes = pgTable("classes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  studentCount: integer("student_count").notNull().default(0),
});

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

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertClassSchema = createInsertSchema(classes).omit({
  id: true,
});

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

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertClass = z.infer<typeof insertClassSchema>;
export type Class = typeof classes.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Student = typeof students.$inferSelect;
export type InsertGrade = z.infer<typeof insertGradeSchema>;
export type Grade = typeof grades.$inferSelect;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;
export type AttendanceRecord = typeof attendance.$inferSelect;
export type InsertAssignment = z.infer<typeof insertAssignmentSchema>;
export type Assignment = typeof assignments.$inferSelect;
