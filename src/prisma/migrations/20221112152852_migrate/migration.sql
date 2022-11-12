/*
  Warnings:

  - Added the required column `fullName` to the `Teacher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courseGroupId` to the `AttendanceRecord` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Teacher" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullName" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Teacher_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Teacher" ("id", "userId") SELECT "id", "userId" FROM "Teacher";
DROP TABLE "Teacher";
ALTER TABLE "new_Teacher" RENAME TO "Teacher";
CREATE UNIQUE INDEX "Teacher_userId_key" ON "Teacher"("userId");
CREATE TABLE "new_AttendanceRecord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "studentId" INTEGER NOT NULL,
    "courseGroupId" INTEGER NOT NULL,
    "dateTime" DATETIME NOT NULL,
    "isPresent" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "AttendanceRecord_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AttendanceRecord_courseGroupId_fkey" FOREIGN KEY ("courseGroupId") REFERENCES "CourseGroup" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AttendanceRecord" ("dateTime", "id", "isPresent", "studentId") SELECT "dateTime", "id", "isPresent", "studentId" FROM "AttendanceRecord";
DROP TABLE "AttendanceRecord";
ALTER TABLE "new_AttendanceRecord" RENAME TO "AttendanceRecord";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
