import { HttpException } from "@/exceptions/HttpException";
import { RequestWithSessionData } from "@/interfaces/auth.interface";

class ChairService {
  private students = prisma.student;
  private chairs = prisma.chair;
  private attendanceRecords = prisma.attendanceRecord;

  public async getDepartmentStudents(req: RequestWithSessionData) {
    const chair = await this.chairs.findFirst({ where: { userId: req.session.user.id } });
    if (!chair) throw new HttpException(403, `Failed to find chair linked with user id: ${req.session.user.id}`);

    const students = await this.students.findMany({
      where: {
        department: chair.department,
      },
    });
    return students;
  }

  public async getStudentAttendanceRecord(userId: string, studentId: string) {
    const chair = await this.chairs.findFirst({ where: { userId } });
    if (!chair) throw new HttpException(403, `Failed to find chair linked with user id: ${userId}`);

    const records = await this.attendanceRecords.findMany({
      where: {
        student: {
          department: chair.department,
          id: studentId,
        },
      },
      orderBy: {
        dateTime: "desc",
      },
    });

    return records;
  }
}

export default ChairService;
