import { AddAttendanceRecordDto, AddStudentToCourseDto, CreateCourseDto, UpdateAttendanceRecordDto } from "@/dtos/courses.dto";
import { HttpException } from "@/exceptions/HttpException";
import { RequestWithSessionData } from "@/interfaces/auth.interface";
import { CourseGroup, PrismaClient } from "@prisma/client";
import { isEmpty } from "class-validator";

class CoursesService {
  prisma = new PrismaClient();
  courses = this.prisma.courseGroup;
  students = this.prisma.student;
  teachers = this.prisma.teacher;
  attendanceRecords = this.prisma.attendanceRecord;

  public async findAllCourses() {
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
    const studentInCourse = (await this.courses.findFirst({ where: { id: studentData.courseId } })).studentIds.find(
      id => id === studentData.studentId,
    );
    // Check if student is already added to course
    if (studentInCourse) {
      throw new HttpException(409, `The course ${studentData.courseId} already contains student ${studentData.studentId}`);
    }

    const updatedCourse = await this.courses.update({
      where: { id: studentData.courseId },
      data: { studentIds: { push: studentData.studentId } },
    });

    return updatedCourse;
  }

  public async removeStudent(studentData: AddStudentToCourseDto) {
    const studentInCourse = (await this.courses.findFirst({ where: { id: studentData.courseId } })).studentIds.find(
      id => id === studentData.studentId,
    );
    // Check if student is not in course
    if (!studentInCourse) {
      throw new HttpException(409, `The course does not contain the student`);
    }

    // Delete attendance records related to the course
    await this.attendanceRecords.deleteMany({
      where: {
        studentId: studentData.studentId,
        courseGroupId: studentData.courseId,
      },
    });

    const course = await this.courses.findFirst({
      where: { id: studentData.courseId },
    });

    const newStudentIds = course.studentIds.filter(id => id !== studentData.studentId);

    const updatedCourse = await this.courses.update({
      where: { id: studentData.courseId },
      data: { studentIds: { set: newStudentIds } },
    });

    return updatedCourse;
  }

  public async addAttendanceRecords(attendanceData: AddAttendanceRecordDto) {
    const course = await this.courses.findFirst({ where: { id: attendanceData.courseId } });
    const studentIds = course.studentIds;

    // Create attendance record for each student taking that course and mark as not present
    const createdAttendanceRecords = await this.attendanceRecords.createMany({
      data: studentIds.map(studentId => {
        return {
          courseGroupId: attendanceData.courseId,
          dateTime: new Date(attendanceData.dateTime),
          studentId,
          isPresent: false,
        };
      }),
    });
    return createdAttendanceRecords;
  }

  public async markAttendanceRecordPresent(attendanceData: UpdateAttendanceRecordDto, req: RequestWithSessionData) {
    const attendanceRecord = await this.attendanceRecords.findUnique({
      where: { id: attendanceData.attendanceRecordId },
    });

    const course = await this.courses.findUnique({
      where: { id: attendanceRecord.courseGroupId },
    });

    const teacherId = (await this.teachers.findFirst({ where: { userId: req.session.user.id } })).id;

    if (course.teacherId !== teacherId) {
      throw new HttpException(401, `You should be the course teacher to access!`);
    }

    const updatedAttendanceRecord = await this.attendanceRecords.update({
      where: { id: attendanceData.attendanceRecordId },
      data: { isPresent: true },
    });

    return updatedAttendanceRecord;
  }
}

export default CoursesService;
