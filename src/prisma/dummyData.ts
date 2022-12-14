import { CourseGroup, Student, Teacher, User } from "@prisma/client";

export const users: User[] = [
  {
    id: "admin",
    email: "admin@email.com",
    password: "admin",
    role: "System Administrator",
  },
  {
    id: "user-1",
    email: "teacher1@email.com",
    password: "teacher",
    role: "Teacher",
  },
  {
    id: "user-2",
    email: "teacher2@email.com",
    password: "teacher",
    role: "Teacher",
  },
  {
    id: "user-3",
    email: "teacher3@email.com",
    password: "teacher",
    role: "Teacher",
  },
  {
    id: "user-4",
    email: "student1@email.com",
    password: "student",
    role: "Student",
  },
  {
    id: "user-5",
    email: "student2@email.com",
    password: "student",
    role: "Student",
  },
  {
    id: "user-6",
    email: "student3@email.com",
    password: "student",
    role: "Student",
  },
];

export const teachers: Teacher[] = [
  {
    id: "teacher-1",
    fullName: "Teacher1",
    userId: "user-1",
  },
  {
    id: "teacher-2",
    fullName: "Teacher2",
    userId: "user-2",
  },
  {
    id: "teacher-3",
    fullName: "Teacher3",
    userId: "user-3",
  },
];

export const students: Student[] = [
  {
    id: "student-1",
    fullName: "Student1",
    userId: "user-4",
    department: "Software Engineering",
    parentId: null,
  },
  {
    id: "student-2",
    fullName: "Student2",
    userId: "user-5",
    department: "Software Engineering",
    parentId: null,
  },
  {
    id: "student-3",
    fullName: "Student3",
    userId: "user-6",
    department: "Software Engineering",
    parentId: null,
  },
];

export const courses: CourseGroup[] = [
  {
    id: "course-1",
    name: "CoureGroup 1",
    teacherId: "teacher-1",
  },
  {
    id: "course-2",
    name: "CoureGroup 2",
    teacherId: "teacher-2",
  },
  {
    id: "course-3",
    name: "CoureGroup 3",
    teacherId: "teacher-1",
  },
];
