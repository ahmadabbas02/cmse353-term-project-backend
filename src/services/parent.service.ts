import { ChildAttendanceDto } from "@/dtos/parents.dto";
import { HttpException } from "@/exceptions/HttpException";

class ParentService {
  private students = prisma.student;
  private parents = prisma.parent;
  private attendanceRecords = prisma.attendanceRecord;
  private courses = prisma.courseGroup;

  public async getAllParents() {
    const parents = await this.parents.findMany({
      include: {
        children: true,
      },
    });

    return parents;
  }

  public async getParentFromUserId(userId: string) {
    const parent = await this.parents.findFirst({ where: { userId } });
    if (!parent) throw new HttpException(403, `Failed to find parent linked with user id: ${userId}`);

    return parent;
  }

  public async getChildren(parentId: string) {
    const students = await this.students.findMany({
      where: {
        parentId,
      },
    });
    return students;
  }

  public async getChildCourses(studentId: string) {
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

  public async getChildAttendanceRecord(data: ChildAttendanceDto) {
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
}

export default ParentService;
