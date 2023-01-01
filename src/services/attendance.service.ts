import { AddAttendanceRecordDto, UpdateAttendanceRecordDto } from "@/dtos/courses.dto";
import { prisma } from "@utils/db";
import StudentService from "./student.service";
import { HttpException } from "@/exceptions/HttpException";
import CourseService from "./course.service";
import { AttendanceRecord, Student } from "@prisma/client";

class AttendanceService {
  static instance: AttendanceService;
  public static getInstance(): AttendanceService {
    if (!AttendanceService.instance) {
      AttendanceService.instance = new AttendanceService();
    }
    return AttendanceService.instance;
  }

  private studentService = StudentService.getInstance();
  private courseService = CourseService.getInstance();
  private attendanceRecords = prisma.attendanceRecord;

  private groupAttendanceRecords(
    records: (AttendanceRecord & {
      student: Student;
    })[],
  ) {
    const groupedRecords: {
      dateTime: Date;
      attendanceData: {
        student: Student;
        studentId: string;
        courseGroupId: string;
        id: string;
        isPresent: boolean;
      }[];
    }[] = [];
    records.forEach(record => {
      let foundDateTime = false;
      const { courseGroupId, dateTime, id, isPresent, student, studentId } = record;

      if (groupedRecords.length === 0) {
        groupedRecords.push({
          dateTime,
          attendanceData: [{ courseGroupId, id, isPresent, student, studentId }],
        });
      } else {
        for (let index = 0; index < groupedRecords.length; index++) {
          const element = groupedRecords[index];
          if (element.dateTime.toString() === dateTime.toString()) {
            element.attendanceData.push({ courseGroupId, id, isPresent, student, studentId });
            foundDateTime = true;
            break;
          }
        }
        if (!foundDateTime) {
          groupedRecords.push({
            dateTime,
            attendanceData: [{ courseGroupId, id, isPresent, student, studentId }],
          });
          foundDateTime = true;
        }
      }
    });

    return groupedRecords;
  }

  public async getAttendanceRecordById(recordId: string) {
    const record = this.attendanceRecords.findUnique({ where: { id: recordId } });
    return record;
  }

  public async getCourseAttendanceRecords(courseId: string, teacherId: string) {
    const course = await this.courseService.getCourseById(courseId);
    if (!course || course.teacherId !== teacherId) throw new HttpException(403, `You aren't a teacher of this course.`);

    const records = await this.attendanceRecords.findMany({
      where: {
        courseGroupId: courseId,
      },
      include: {
        student: true,
      },
      orderBy: {
        dateTime: "desc",
      },
    });

    return this.groupAttendanceRecords(records);
  }

  public async getStudentCourseAttendanceRecords(data: { studentId: string; courseId: string }) {
    const { studentId, courseId } = data;

    const records = await this.attendanceRecords.findMany({
      where: {
        courseGroupId: courseId,
        studentId,
      },
      include: {
        student: true,
      },
      orderBy: {
        dateTime: "desc",
      },
    });

    return this.groupAttendanceRecords(records);
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
