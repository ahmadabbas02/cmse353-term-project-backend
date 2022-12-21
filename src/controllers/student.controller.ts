import { NextFunction, Response } from "express";

import { RequestWithSessionData } from "@/interfaces/auth.interface";
import { HttpException } from "@/exceptions/HttpException";
import StudentService from "@/services/student.service";
import CourseService from "@/services/course.service";
import AttendanceService from "@/services/attendance.service";

class StudentController {
  private studentService = new StudentService();
  private courseService = new CourseService();
  private attendanceService = new AttendanceService();

  public getCourses = async (req: RequestWithSessionData, res: Response, next: NextFunction) => {
    try {
      const userId = req.session.user.id;
      const student = await this.studentService.getStudentByUserId(userId);
      if (!student) throw new HttpException(403, `Failed to find student linked with user id: ${userId}`);

      const data = await this.courseService.getStudentCourses(student.id);
      res.status(200).json({ data, message: "Successfully retrieved all courses" });
    } catch (error) {
      next(error);
    }
  };

  public getAttendanceRecords = async (req: RequestWithSessionData, res: Response, next: NextFunction) => {
    try {
      const userId = req.session.user.id;
      const student = await this.studentService.getStudentByUserId(userId);
      if (!student) throw new HttpException(403, `Failed to find student linked with user id: ${userId}`);

      const records = await this.attendanceService.getStudentCourseAttendanceRecords({
        studentId: student.id,
        courseId: req.params.id,
      });
      res.status(200).json({ data: records, message: "Successfully retrieved attendance records." });
    } catch (error) {
      next(error);
    }
  };
}

export default StudentController;
