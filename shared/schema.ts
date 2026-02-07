import { pgTable, serial, text, integer, timestamp, varchar, boolean } from "drizzle-orm/pg-core";

export const classes = pgTable("classes", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }).default("English"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  classId: integer("class_id").references(() => classes.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const assignments = pgTable("assignments", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  classId: integer("class_id").references(() => classes.id),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  assignmentId: integer("assignment_id").references(() => assignments.id).notNull(),
  studentId: integer("student_id").references(() => students.id).notNull(),
  fileName: varchar("file_name", { length: 255 }),
  fileContent: text("file_content"),
  grade: integer("grade"),
  feedback: text("feedback"),
  annotations: text("annotations"),
  status: varchar("status", { length: 50 }).default("submitted").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  gradedAt: timestamp("graded_at"),
});
