-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Student" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "department" TEXT NOT NULL DEFAULT 'Software Engineering',
    "userId" TEXT NOT NULL,
    "parentId" TEXT,
    CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Student_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Student" ("department", "fullName", "id", "parentId", "userId") SELECT "department", "fullName", "id", "parentId", "userId" FROM "Student";
DROP TABLE "Student";
ALTER TABLE "new_Student" RENAME TO "Student";
CREATE UNIQUE INDEX "Student_userId_key" ON "Student"("userId");
CREATE TABLE "new_Chair" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Chair_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Chair" ("department", "fullName", "id", "userId") SELECT "department", "fullName", "id", "userId" FROM "Chair";
DROP TABLE "Chair";
ALTER TABLE "new_Chair" RENAME TO "Chair";
CREATE UNIQUE INDEX "Chair_userId_key" ON "Chair"("userId");
CREATE TABLE "new_CourseGroup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    CONSTRAINT "CourseGroup_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CourseGroup" ("id", "name", "teacherId") SELECT "id", "name", "teacherId" FROM "CourseGroup";
DROP TABLE "CourseGroup";
ALTER TABLE "new_CourseGroup" RENAME TO "CourseGroup";
CREATE UNIQUE INDEX "CourseGroup_name_key" ON "CourseGroup"("name");
CREATE TABLE "new_AttendanceRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "courseGroupId" TEXT NOT NULL,
    "dateTime" DATETIME NOT NULL,
    "isPresent" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "AttendanceRecord_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AttendanceRecord_courseGroupId_fkey" FOREIGN KEY ("courseGroupId") REFERENCES "CourseGroup" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_AttendanceRecord" ("courseGroupId", "dateTime", "id", "isPresent", "studentId") SELECT "courseGroupId", "dateTime", "id", "isPresent", "studentId" FROM "AttendanceRecord";
DROP TABLE "AttendanceRecord";
ALTER TABLE "new_AttendanceRecord" RENAME TO "AttendanceRecord";
CREATE TABLE "new_Parent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Parent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Parent" ("fullName", "id", "userId") SELECT "fullName", "id", "userId" FROM "Parent";
DROP TABLE "Parent";
ALTER TABLE "new_Parent" RENAME TO "Parent";
CREATE UNIQUE INDEX "Parent_userId_key" ON "Parent"("userId");
CREATE TABLE "new_Teacher" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Teacher_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Teacher" ("fullName", "id", "userId") SELECT "fullName", "id", "userId" FROM "Teacher";
DROP TABLE "Teacher";
ALTER TABLE "new_Teacher" RENAME TO "Teacher";
CREATE UNIQUE INDEX "Teacher_userId_key" ON "Teacher"("userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
