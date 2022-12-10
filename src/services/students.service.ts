import { HttpException } from "@/exceptions/HttpException";
import { RequestWithSessionData } from "@/interfaces/auth.interface";
import { prisma } from "@/utils/db";

class StudentsService {
  private courses = prisma.courseGroup;
  private students = prisma.student;
  private attendanceRecords = prisma.attendanceRecord;

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
    });

    return courses;
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
