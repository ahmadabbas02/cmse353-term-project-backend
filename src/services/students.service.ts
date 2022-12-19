import { HttpException } from "@/exceptions/HttpException";
import { RequestWithSessionData } from "@/interfaces/auth.interface";
import { prisma } from "@/utils/db";

class StudentsService {
  private courses = prisma.courseGroup;
  private students = prisma.student;
  private attendanceRecords = prisma.attendanceRecord;

  public async getStudentById(studentId: string) {
    const student = await this.students.findFirst({
      where: {
        id: studentId,
      },
    });

    return student;
  }

  public async getCourses(req: RequestWithSessionData) {
    const studentId = (await this.students.findFirst({ where: { userId: req.session.user.id } })).id;
    if (!studentId) throw new HttpException(403, `Failed to find student linked with user id: ${req.session.user.id}`);

    const courses = await this.courses.findMany({
      where: {
        students: {
          some: {
            id: studentId,
          },
        },
      },
      include: {
        attendanceRecords: { where: { studentId } },
        teacher: true,
      },
    });

    const attendanceStatus: {
      courseId: string;
      presentDays: number;
      totalDays: number;
    }[] = [];
    courses.map(course => {
      attendanceStatus.push({
        courseId: course.id,
        presentDays: course.attendanceRecords.filter(record => record.isPresent).length,
        totalDays: course.attendanceRecords.length,
      });
    });

    return { courses, attendanceStatus };
  }

  public async getAttendanceRecords(req: RequestWithSessionData, courseId: string) {
    const studentId = (await this.students.findFirst({ where: { userId: req.session.user.id } })).id;
    if (!studentId) throw new HttpException(403, `Failed to find student linked with user id: ${req.session.user.id}`);

    const records = this.attendanceRecords.findMany({
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
}

export default StudentsService;
