import { HttpException } from "@/exceptions/HttpException";
import { prisma } from "@/utils/db";

class TeacherService {
  static instance: TeacherService;
  public static getInstance(): TeacherService {
    if (!TeacherService.instance) {
      TeacherService.instance = new TeacherService();
    }
    return TeacherService.instance;
  }

  private courses = prisma.courseGroup;
  private students = prisma.student;
  private teachers = prisma.teacher;
  private attendanceRecords = prisma.attendanceRecord;

  public async getAllTeachers() {
    const teachers = await this.teachers.findMany({
      include: {
        user: true,
      },
    });

    return teachers.map(teacher => {
      delete teacher.user.password;
      return teacher;
    });
  }

  public async getTeacherById(teacherId: string) {
    const teacher = await this.teachers.findUnique({ where: { id: teacherId } });

    return teacher;
  }

  public async getTeacherByUserId(userId: string) {
    const teacher = await this.teachers.findUnique({ where: { userId } });

    return teacher;
  }

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

  public async deleteTeacherById(teacherId: string) {
    const deletedTeacher = await this.teachers.delete({ where: { id: teacherId } });
    return deletedTeacher;
  }
}

export default TeacherService;
