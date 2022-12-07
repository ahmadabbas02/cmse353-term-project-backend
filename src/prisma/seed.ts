import { Prisma } from "@prisma/client";
import { courses, students, teachers, users } from "./dummyData";
import { prisma } from "../utils/db";

const load = async () => {
  try {
    await prisma.user.deleteMany();
    console.log("Deleted users successfully!");
    await prisma.student.deleteMany();
    console.log("Deleted students successfully!");
    await prisma.teacher.deleteMany();
    console.log("Deleted teachers successfully!");
    await prisma.courseGroup.deleteMany();
    console.log("Deleted course groups successfully!");

    await Promise.all(
      users.map(async user => {
        await prisma.user.create({ data: user });
      }),
    );
    console.log("Added users data.");

    await Promise.all(
      teachers.map(async teacher => {
        await prisma.teacher.create({ data: teacher });
      }),
    );
    console.log("Added teachers data.");

    await Promise.all(
      students.map(async student => {
        await prisma.student.create({ data: student });
      }),
    );
    console.log("Added students data.");

    await Promise.all(
      courses.map(async course => {
        await prisma.courseGroup.create({ data: course });
      }),
    );
    console.log("Added courses data.");
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

load();
