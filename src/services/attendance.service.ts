import { AddAttendanceRecordDto, UpdateAttendanceRecordDto } from "@/dtos/courses.dto";
import { Department } from "@/utils/consts";
import { prisma } from "@utils/db";
import StudentService from "./student.service";
import { HttpException } from "@/exceptions/HttpException";
import CourseService from "./course.service";

class AttendanceService {
  private studentService = new StudentService();
  private courseService = new CourseService();
  private attendanceRecords = prisma.attendanceRecord;

  public async getAttendanceRecordById(recordId: string) {
    const record = this.attendanceRecords.findUnique({ where: { id: recordId } });
    return record;
  }

  public async getCourseAttendanceRecords(courseId: string, teacherId: string) {
    const course = await this.courseService.getCourseById(courseId);
    if (!course || course.teacherId !== teacherId) throw new HttpException(403, `You aren't a teacher of this course.`);

    const records = this.attendanceRecords.findMany({
      where: {
        courseGroupId: courseId,
      },
      orderBy: {
        dateTime: "desc",
      },
    });

    return records;
  }

  public async getStudentAttendanceRecords(studentId: string, department: Department) {
    const records = await this.attendanceRecords.findMany({
      where: {
        student: {
          department,
          id: studentId,
        },
      },
      orderBy: {
        dateTime: "desc",
      },
    });

    return records;
  }

  public async getStudentCourseAttendanceRecords(data: { studentId: string; courseId: string }) {
    const { studentId, courseId } = data;

    const records = await this.attendanceRecords.findMany({
      where: {
        courseGroupId: courseId,
        studentId,
      },
      orderBy: {
        dateTime: "desc",
      },
    });
    return records;
  }

  public async addAttendanceRecords(attendanceData: AddAttendanceRecordDto) {
    const studentIds = (await this.studentService.getStudentsInCourse(attendanceData.courseId)).map(student => student.id);

    // Create attendance record for each student taking that course and mark as not present
    const createdAttendanceRecords = await Promise.all(
      studentIds.map(async studentId => {
        const createdRecord = await this.attendanceRecords.create({
          data: {
            courseGroupId: attendanceData.courseId,
            dateTime: new Date(attendanceData.dateTime),
            studentId,
            isPresent: false,
          },
        });
        return createdRecord;
      }),
    );

    return createdAttendanceRecords;
  }

  public async setAttendanceRecord(attendanceData: UpdateAttendanceRecordDto, teacherId: string) {
    const { attendanceRecordId, isPresent } = attendanceData;

    const attendanceRecord = await this.getAttendanceRecordById(attendanceRecordId);

    const course = await this.courseService.getCourseById(attendanceRecord.courseGroupId);

    if (course.teacherId !== teacherId) {
      throw new HttpException(401, `You should be the course teacher to access!`);
    }

    const updatedAttendanceRecord = await this.attendanceRecords.update({
      where: { id: attendanceRecordId },
      data: { isPresent },
    });

    return updatedAttendanceRecord;
  }
}

export default AttendanceService;
