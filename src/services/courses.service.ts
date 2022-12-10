import { isEmpty } from "class-validator";
import { CourseGroup } from "@prisma/client";

import { AddStudentToCourseDto, CreateCourseDto } from "@/dtos/courses.dto";
import { HttpException } from "@/exceptions/HttpException";
import { prisma } from "@/utils/db";

class CoursesService {
  private courses = prisma.courseGroup;
  private students = prisma.student;
  private teachers = prisma.teacher;
  private attendanceRecords = prisma.attendanceRecord;

  public async getAllCourses() {
    const courses = this.courses.findMany();

    return courses;
  }

  public async createCourse(courseData: CreateCourseDto) {
    if (isEmpty(courseData)) throw new HttpException(400, "courseData is empty");

    const { name, teacherId } = courseData;

    const findCourse: CourseGroup = await this.courses.findUnique({ where: { name: courseData.name } });
    if (findCourse) throw new HttpException(409, `This course ${courseData.name} already exists`);

    const createdCourse: Promise<CourseGroup> = this.courses.create({
      data: {
        name,
        teacherId,
      },
    });

    return createdCourse;
  }

  public async addStudent(studentData: AddStudentToCourseDto) {
    const studentsInCourse = await this.students.findMany({
      where: {
        courses: {
          some: {
            id: studentData.courseId,
          },
        },
      },
    });
    studentsInCourse.forEach(student => {
      delete student.fullName;
      delete student.userId;
      delete student.parentId;
    });
    console.log("🚀 ~ file: courses.service.ts ~ line 48 ~ CoursesService ~ addStudent ~ studentsInCourse", studentsInCourse);
    const isStudentInCourse = studentsInCourse.find(student => student.id == studentData.studentId);
    console.log("🚀 ~ file: courses.service.ts ~ line 50 ~ CoursesService ~ addStudent ~ isStudentInCourse", isStudentInCourse);

    // Check if student is already added to course
    if (isStudentInCourse) {
      throw new HttpException(409, `The course ${studentData.courseId} already contains student ${studentData.studentId}`);
    }

    const student = await this.students.findFirst({ where: { id: studentData.studentId } });
    delete student.userId;
    delete student.fullName;
    delete student.parentId;

    studentsInCourse.push(student);

    console.log("🚀 ~ file: courses.service.ts ~ line 60 ~ CoursesService ~ addStudent ~ studentsInCourse", studentsInCourse);

    const updatedCourse = await this.courses.update({
      where: { id: studentData.courseId },
      data: {
        students: {
          set: studentsInCourse,
        },
      },
    });

    return updatedCourse;
  }

  public async removeStudent(studentData: AddStudentToCourseDto) {
    const studentsInCourse = await this.students.findMany({
      where: {
        courses: {
          some: {
            id: studentData.courseId,
          },
        },
      },
    });
    studentsInCourse.forEach(student => {
      delete student.fullName;
      delete student.userId;
      delete student.parentId;
    });
    console.log("🚀 ~ file: courses.service.ts:99 ~ CoursesService ~ removeStudent ~ studentsInCourse", studentsInCourse);
    const isStudentInCourse = studentsInCourse.find(student => student.id == studentData.studentId);
    console.log("🚀 ~ file: courses.service.ts:101 ~ CoursesService ~ removeStudent ~ isStudentInCourse", isStudentInCourse);

    // Check if student is not in course
    if (!isStudentInCourse) {
      throw new HttpException(409, `The course does not contain the student`);
    }

    // Delete attendance records related to the course
    const deletedRecords = await this.attendanceRecords.deleteMany({
      where: {
        studentId: studentData.studentId,
        courseGroupId: studentData.courseId,
      },
    });
    console.log("🚀 ~ file: courses.service.ts:115 ~ CoursesService ~ removeStudent ~ deletedRecords", deletedRecords);

    const filteredStudents = studentsInCourse.filter(student => student.id !== studentData.studentId);
    console.log("🚀 ~ file: courses.service.ts ~ line 103 ~ CoursesService ~ removeStudent ~ filteredStudents", filteredStudents);

    const updatedCourse = await this.courses.update({
      where: { id: studentData.courseId },
      data: { students: { set: filteredStudents } },
    });

    return updatedCourse;
  }
}

export default CoursesService;
