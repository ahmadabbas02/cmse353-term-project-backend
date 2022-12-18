import { AddAttendanceRecordDto, UpdateAttendanceRecordDto } from "@/dtos/courses.dto";
import { HttpException } from "@/exceptions/HttpException";
import { RequestWithSessionData } from "@/interfaces/auth.interface";
import { prisma } from "@/utils/db";

class TeachersService {
  private courses = prisma.courseGroup;
  private students = prisma.student;
  private teachers = prisma.teacher;
  private attendanceRecords = prisma.attendanceRecord;

  public async getCourses(userId: string) {
    const courses = await this.courses.findMany({
      where: {
        teacher: {
          userId,
        },
      },
    });

    return courses;
  }

  public async addAttendanceRecords(attendanceData: AddAttendanceRecordDto) {
    const studentIds = (
      await this.students.findMany({
        where: {
          courses: {
            every: {
              id: attendanceData.courseId,
            },
          },
        },
      })
    ).map(student => student.id);

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

  public async setAttendanceRecord(attendanceData: UpdateAttendanceRecordDto, req: RequestWithSessionData) {
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
      data: { isPresent: attendanceData.isPresent },
    });

    return updatedAttendanceRecord;
  }

  public async getStudents(courseId: string, userId: string) {
    const course = await this.courses.findFirst({ where: { id: courseId, teacher: { userId } } });
    if (!course) throw new HttpException(403, `You aren't a teacher of this course.`);
    const students = await this.students.findMany({
      where: {
        courses: {
          some: {
            id: courseId,
          },
        },
      },
    });
    return students;
  }

  public async getAttendanceRecords(courseId: string, userId: string) {
    const course = await this.courses.findFirst({ where: { id: courseId, teacher: { userId } } });
    if (!course) throw new HttpException(403, `You aren't a teacher of this course.`);

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
}

export default TeachersService;
