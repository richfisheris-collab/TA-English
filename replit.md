# Teacher's Assignment Manager (TeachAssist)

## Overview
A web application for teachers to manage English assignments, grade student work, track progress, and generate performance reports.

## Recent Changes
- 2026-02-07: Initial project setup with full-stack architecture

## Project Architecture

### Tech Stack
- **Frontend**: React 19 + Vite + React Router
- **Backend**: Express 5 (TypeScript, via tsx)
- **Database**: PostgreSQL (Replit built-in) with Drizzle ORM
- **File Uploads**: Multer

### Project Structure
```
├── client/              # React frontend
│   ├── index.html
│   └── src/
│       ├── App.tsx      # Main app with routing & layout
│       ├── main.tsx     # Entry point
│       ├── index.css    # Global styles
│       ├── lib/api.ts   # API client
│       └── pages/       # Page components
│           ├── Dashboard.tsx
│           ├── Classes.tsx
│           ├── Students.tsx
│           ├── Assignments.tsx
│           ├── AssignmentDetail.tsx
│           ├── GradeSubmission.tsx
│           └── Reports.tsx
├── server/
│   ├── index.ts         # Express server + Vite middleware
│   ├── routes.ts        # API routes
│   └── db.ts            # Database connection
├── shared/
│   └── schema.ts        # Drizzle ORM schema
├── vite.config.ts
├── drizzle.config.ts
└── tsconfig.json
```

### Database Schema
- **classes**: id, name, subject, createdAt
- **students**: id, name, email, classId, createdAt
- **assignments**: id, title, description, classId, dueDate, createdAt
- **submissions**: id, assignmentId, studentId, fileName, fileContent, grade, feedback, annotations, status, submittedAt, gradedAt

### Key Commands
- `npm run dev` - Start development server (port 5000)
- `npm run db:push` - Push schema changes to database

### Notes
- Express 5 uses `/{*splat}` instead of `*` for catch-all routes
- Vite runs in middleware mode within Express
- Frontend binds to 0.0.0.0:5000, `allowedHosts: true` configured in vite.config.ts
