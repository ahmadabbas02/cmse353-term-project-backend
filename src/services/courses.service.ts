import { prisma } from "@/utils/db";
import { isEmpty } from "@/utils/util";
import TeacherService from "./teacher.service";
import { AddStudentToCourseDto, CreateCourseDto } from "@/dtos/courses.dto";
import { HttpException } from "@/exceptions/HttpException";
import { CourseGroup } from "@prisma/client";
import StudentService from "./student.service";

class CourseService {
  private courses = prisma.courseGroup;
  private teacherService = new TeacherService();
  private studentService = new StudentService();

  public async getAllCourses(includeTeacherDetails = true) {
    const courses = this.courses.findMany({
      include: {
        teacher: includeTeacherDetails,
      },
    });

    return courses;
  }

  public async createCourse(courseData: CreateCourseDto): Promise<CourseGroup> {
    if (isEmpty(courseData)) throw new HttpException(400, "courseData is empty");

    const { name, teacherId } = courseData;

    const teacher = await this.teacherService.getTeacherById(teacherId);

    if (!teacher) throw new HttpException(409, `The teacher with ${teacherId} id does not exist.`);

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

  public async addStudentToCourse(studentData: AddStudentToCourseDto): Promise<CourseGroup> {
    const studentsInCourse = await this.studentService.getStudentsInCourse(studentData.courseId);
    studentsInCourse.forEach(student => {
      delete student.fullName;
      delete student.userId;
      delete student.parentId;
      delete student.department;
    });
    const isStudentInCourse = studentsInCourse.find(student => student.id == studentData.studentId);

    // Check if student is already added to course
    if (isStudentInCourse) {
      throw new HttpException(409, `The course ${studentData.courseId} already contains student ${studentData.studentId}`);
    }

    const student = await this.studentService.getStudentById(studentData.studentId);
    delete student.userId;
    delete student.fullName;
    delete student.parentId;
    delete student.department;

    studentsInCourse.push(student);

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

  public async removeStudentFromCourse(studentData: AddStudentToCourseDto) {
    const studentsInCourse = await this.studentService.getStudentsInCourse(studentData.courseId);
    studentsInCourse.forEach(student => {
      delete student.fullName;
      delete student.userId;
      delete student.parentId;
      delete student.department;
    });
    const isStudentInCourse = studentsInCourse.find(student => student.id == studentData.studentId);

    // Check if student is not in course
    if (!isStudentInCourse) {
      throw new HttpException(409, `The course does not contain the student`);
    }

    // TODO: Check if we actually need this
    // Delete attendance records related to the course
    // const deletedRecords = await this.attendanceRecords.deleteMany({
    //   where: {
    //     studentId: studentData.studentId,
    //     courseGroupId: studentData.courseId,
    //   },
    // });

    const filteredStudents = studentsInCourse.filter(student => student.id !== studentData.studentId);

    const updatedCourse = await this.courses.update({
      where: { id: studentData.courseId },
      data: { students: { set: filteredStudents } },
    });

    return updatedCourse;
  }
}

export default CourseService;
