import { Router, Request, Response } from "express";
import multer from "multer";
import { db } from "./db";
import { classes, students, assignments, submissions } from "../shared/schema";
import { eq, desc, count, avg, sql } from "drizzle-orm";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.get("/api/classes", async (_req: Request, res: Response) => {
  const result = await db.select().from(classes).orderBy(desc(classes.createdAt));
  res.json(result);
});

router.post("/api/classes", async (req: Request, res: Response) => {
  const { name, subject } = req.body;
  const result = await db.insert(classes).values({ name, subject }).returning();
  res.json(result[0]);
});

router.get("/api/students", async (req: Request, res: Response) => {
  const classId = req.query.classId ? Number(req.query.classId) : undefined;
  if (classId) {
    const result = await db.select().from(students).where(eq(students.classId, classId));
    res.json(result);
  } else {
    const result = await db.select().from(students);
    res.json(result);
  }
});

router.post("/api/students", async (req: Request, res: Response) => {
  const { name, email, classId } = req.body;
  const result = await db.insert(students).values({ name, email, classId }).returning();
  res.json(result[0]);
});

router.get("/api/assignments", async (req: Request, res: Response) => {
  const classId = req.query.classId ? Number(req.query.classId) : undefined;
  if (classId) {
    const result = await db.select().from(assignments).where(eq(assignments.classId, classId)).orderBy(desc(assignments.createdAt));
    res.json(result);
  } else {
    const result = await db.select().from(assignments).orderBy(desc(assignments.createdAt));
    res.json(result);
  }
});

router.post("/api/assignments", async (req: Request, res: Response) => {
  const { title, description, classId, dueDate } = req.body;
  const result = await db.insert(assignments).values({
    title,
    description,
    classId,
    dueDate: dueDate ? new Date(dueDate) : undefined,
  }).returning();
  res.json(result[0]);
});

router.get("/api/assignments/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = await db.select().from(assignments).where(eq(assignments.id, id));
  if (result.length === 0) {
    res.status(404).json({ error: "Assignment not found" });
    return;
  }
  res.json(result[0]);
});

router.get("/api/submissions", async (req: Request, res: Response) => {
  const assignmentId = req.query.assignmentId ? Number(req.query.assignmentId) : undefined;
  const studentId = req.query.studentId ? Number(req.query.studentId) : undefined;

  let query = db.select().from(submissions);
  if (assignmentId) {
    const result = await db.select().from(submissions).where(eq(submissions.assignmentId, assignmentId));
    res.json(result);
    return;
  }
  if (studentId) {
    const result = await db.select().from(submissions).where(eq(submissions.studentId, studentId));
    res.json(result);
    return;
  }
  const result = await query;
  res.json(result);
});

router.post("/api/submissions", upload.single("file"), async (req: Request, res: Response) => {
  const { assignmentId, studentId, fileContent } = req.body;
  const fileName = req.file?.originalname || req.body.fileName || "untitled";

  const result = await db.insert(submissions).values({
    assignmentId: Number(assignmentId),
    studentId: Number(studentId),
    fileName,
    fileContent: fileContent || "",
    status: "submitted",
  }).returning();
  res.json(result[0]);
});

router.patch("/api/submissions/:id/grade", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { grade, feedback, annotations } = req.body;

  const result = await db.update(submissions)
    .set({
      grade,
      feedback,
      annotations,
      status: "graded",
      gradedAt: new Date(),
    })
    .where(eq(submissions.id, id))
    .returning();

  if (result.length === 0) {
    res.status(404).json({ error: "Submission not found" });
    return;
  }
  res.json(result[0]);
});

router.get("/api/submissions/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = await db.select().from(submissions).where(eq(submissions.id, id));
  if (result.length === 0) {
    res.status(404).json({ error: "Submission not found" });
    return;
  }
  res.json(result[0]);
});

router.get("/api/dashboard/stats", async (_req: Request, res: Response) => {
  const [classCount] = await db.select({ count: count() }).from(classes);
  const [studentCount] = await db.select({ count: count() }).from(students);
  const [assignmentCount] = await db.select({ count: count() }).from(assignments);
  const [submissionCount] = await db.select({ count: count() }).from(submissions);
  const [gradedCount] = await db.select({ count: count() }).from(submissions).where(eq(submissions.status, "graded"));
  const [avgGrade] = await db.select({ avg: avg(submissions.grade) }).from(submissions).where(eq(submissions.status, "graded"));

  res.json({
    classes: classCount.count,
    students: studentCount.count,
    assignments: assignmentCount.count,
    submissions: submissionCount.count,
    graded: gradedCount.count,
    averageGrade: avgGrade.avg ? Number(avgGrade.avg).toFixed(1) : null,
  });
});

router.get("/api/reports/class/:classId", async (req: Request, res: Response) => {
  const classId = Number(req.params.classId);

  const classStudents = await db.select().from(students).where(eq(students.classId, classId));

  const studentReports = await Promise.all(
    classStudents.map(async (student) => {
      const studentSubmissions = await db.select().from(submissions).where(eq(submissions.studentId, student.id));
      const gradedSubs = studentSubmissions.filter(s => s.status === "graded" && s.grade !== null);
      const avgGrade = gradedSubs.length > 0
        ? gradedSubs.reduce((sum, s) => sum + (s.grade || 0), 0) / gradedSubs.length
        : null;

      return {
        student,
        totalSubmissions: studentSubmissions.length,
        gradedSubmissions: gradedSubs.length,
        averageGrade: avgGrade ? Number(avgGrade.toFixed(1)) : null,
        submissions: studentSubmissions,
      };
    })
  );

  res.json(studentReports);
});

export default router;
