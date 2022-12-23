import { HttpException } from "@/exceptions/HttpException";
import { RequestWithSessionData } from "@/interfaces/auth.interface";
import AttendanceService from "@/services/attendance.service";
import ChairService from "@/services/chair.service";
import CourseService from "@/services/course.service";
import StudentService from "@/services/student.service";
import { NextFunction, Response } from "express";

class ChairController {
  private chairService = new ChairService();
  private courseService = new CourseService();
  private studentService = new StudentService();
  private attendanceService = new AttendanceService();

  public getDepartmentStudents = async (req: RequestWithSessionData, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.session.user.id;
      const chair = await this.chairService.getChairByUserId(userId);
      if (!chair) throw new HttpException(403, `Failed to find chair linked with user id: ${userId}`);

      const students = await this.studentService.getAllDepartmentStudents(chair.department);
      res.status(200).json({ data: students, message: "departmentStudents" });
    } catch (error) {
      next(error);
    }
  };

  public getStudentCourses = async (req: RequestWithSessionData, res: Response, next: NextFunction): Promise<void> => {
    try {
      const studentId = req.params.id;

      const userId = req.session.user.id;
      const chair = await this.chairService.getChairByUserId(userId);
      if (!chair) throw new HttpException(403, `Failed to find chair linked with user id: ${userId}`);

      const students = await this.studentService.getAllDepartmentStudents(chair.department);

      const student = students.filter(student => student.department === chair.department && student.id === studentId);
      if (student.length === 0) throw new HttpException(403, `You are not authorized to view other department student courses.`);

      const courses = await this.courseService.getStudentCourses(student[0].id);
      res.status(200).json({ data: courses, message: "studentCourses" });
    } catch (error) {
      next(error);
    }
  };

  public getStudentAttendanceRecords = async (req: RequestWithSessionData, res: Response, next: NextFunction): Promise<void> => {
    try {
      const studentId = req.query.studentId as string;
      const courseId = req.query.courseId as string;

      if (!studentId) throw new HttpException(400, `Missing query 'studentId'`);
      if (!courseId) throw new HttpException(400, `Missing query 'courseId'`);

      const userId = req.session.user.id;

      const chair = await this.chairService.getChairByUserId(userId);
      if (!chair) throw new HttpException(403, `Failed to find chair linked with user id: ${req.session.user.id}`);

      const records = await this.attendanceService.getStudentCourseAttendanceRecords({
        courseId,
        studentId,
      });
      res.status(200).json({ data: records, message: "attendanceRecords" });
    } catch (error) {
      next(error);
    }
  };
}

export default ChairController;
