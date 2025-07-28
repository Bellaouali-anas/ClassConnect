import type { Express } from "express";
import { createServer, type Server } from "http";
import { supabaseStorage } from "./supabaseStorage";
import { seedDatabase } from "./seed-endpoint";
import { insertUserSchema, insertClassSchema, insertStudentSchema, insertGradeSchema, insertAttendanceSchema, insertAssignmentSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const user = await supabaseStorage.createUser(validatedData);
      res.json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create user" });
      }
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await supabaseStorage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  app.get("/api/users/username/:username", async (req, res) => {
    try {
      const user = await supabaseStorage.getUserByUsername(req.params.username);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  // Class routes
  app.get("/api/classes", async (req, res) => {
    try {
      const classes = await supabaseStorage.getAllClasses();
      res.json(classes);
    } catch (error) {
      res.status(500).json({ error: "Failed to get classes" });
    }
  });

  app.post("/api/classes", async (req, res) => {
    try {
      const validatedData = insertClassSchema.parse(req.body);
      const classData = await supabaseStorage.createClass(validatedData);
      res.json(classData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create class" });
      }
    }
  });

  app.get("/api/classes/:id", async (req, res) => {
    try {
      const classData = await supabaseStorage.getClass(req.params.id);
      if (!classData) {
        return res.status(404).json({ error: "Class not found" });
      }
      res.json(classData);
    } catch (error) {
      res.status(500).json({ error: "Failed to get class" });
    }
  });

  // Student routes
  app.get("/api/students", async (req, res) => {
    try {
      const students = await supabaseStorage.getAllStudents();
      res.json(students);
    } catch (error) {
      res.status(500).json({ error: "Failed to get students" });
    }
  });

  app.post("/api/students", async (req, res) => {
    try {
      const validatedData = insertStudentSchema.parse(req.body);
      const student = await supabaseStorage.createStudent(validatedData);
      res.json(student);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create student" });
      }
    }
  });

  app.get("/api/students/:id", async (req, res) => {
    try {
      const student = await supabaseStorage.getStudent(req.params.id);
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
      res.json(student);
    } catch (error) {
      res.status(500).json({ error: "Failed to get student" });
    }
  });

  app.get("/api/classes/:classId/students", async (req, res) => {
    try {
      const students = await supabaseStorage.getStudentsByClass(req.params.classId);
      res.json(students);
    } catch (error) {
      res.status(500).json({ error: "Failed to get students by class" });
    }
  });

  // Grade routes
  app.get("/api/grades", async (req, res) => {
    try {
      const grades = await supabaseStorage.getAllGrades();
      res.json(grades);
    } catch (error) {
      res.status(500).json({ error: "Failed to get grades" });
    }
  });

  app.post("/api/grades", async (req, res) => {
    try {
      const validatedData = insertGradeSchema.parse(req.body);
      const grade = await supabaseStorage.createGrade(validatedData);
      res.json(grade);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create grade" });
      }
    }
  });

  app.get("/api/students/:studentId/grades", async (req, res) => {
    try {
      const grades = await supabaseStorage.getGradesByStudent(req.params.studentId);
      res.json(grades);
    } catch (error) {
      res.status(500).json({ error: "Failed to get grades by student" });
    }
  });

  // Attendance routes
  app.get("/api/attendance", async (req, res) => {
    try {
      const attendance = await supabaseStorage.getAllAttendance();
      res.json(attendance);
    } catch (error) {
      res.status(500).json({ error: "Failed to get attendance" });
    }
  });

  app.post("/api/attendance", async (req, res) => {
    try {
      const validatedData = insertAttendanceSchema.parse(req.body);
      const attendance = await supabaseStorage.createAttendance(validatedData);
      res.json(attendance);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create attendance" });
      }
    }
  });

  app.get("/api/students/:studentId/attendance", async (req, res) => {
    try {
      const attendance = await supabaseStorage.getAttendanceByStudent(req.params.studentId);
      res.json(attendance);
    } catch (error) {
      res.status(500).json({ error: "Failed to get attendance by student" });
    }
  });

  app.get("/api/attendance/date/:date", async (req, res) => {
    try {
      const attendance = await supabaseStorage.getAttendanceByDate(req.params.date);
      res.json(attendance);
    } catch (error) {
      res.status(500).json({ error: "Failed to get attendance by date" });
    }
  });

  // Assignment routes
  app.get("/api/assignments", async (req, res) => {
    try {
      const assignments = await supabaseStorage.getAllAssignments();
      res.json(assignments);
    } catch (error) {
      res.status(500).json({ error: "Failed to get assignments" });
    }
  });

  app.post("/api/assignments", async (req, res) => {
    try {
      const validatedData = insertAssignmentSchema.parse(req.body);
      const assignment = await supabaseStorage.createAssignment(validatedData);
      res.json(assignment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create assignment" });
      }
    }
  });

  app.get("/api/assignments/:id", async (req, res) => {
    try {
      const assignment = await supabaseStorage.getAssignment(req.params.id);
      if (!assignment) {
        return res.status(404).json({ error: "Assignment not found" });
      }
      res.json(assignment);
    } catch (error) {
      res.status(500).json({ error: "Failed to get assignment" });
    }
  });

  // Database seeding endpoint
  app.post("/api/seed", async (req, res) => {
    try {
      const result = await seedDatabase();
      if (result.success) {
        res.json(result);
      } else {
        res.status(500).json({ error: result.error });
      }
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to seed database" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
