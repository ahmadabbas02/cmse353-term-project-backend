import { AddAttendanceRecordDto, UpdateAttendanceRecordDto } from "@/dtos/courses.dto";
import { HttpException } from "@/exceptions/HttpException";
import { RequestWithSessionData } from "@/interfaces/auth.interface";
import AttendanceService from "@/services/attendance.service";
import CourseService from "@/services/course.service";
import StudentService from "@/services/student.service";
import TeacherService from "@/services/teacher.service";
import { NextFunction, Response } from "express";

class TeacherController {
  private courseService = CourseService.getInstance();
  private teacherService = TeacherService.getInstance();
  private attendanceService = AttendanceService.getInstance();
  private studentService = StudentService.getInstance();

  public getCourses = async (req: RequestWithSessionData, res: Response, next: NextFunction) => {
    try {
      const userId = req.session.user.id;
      const teacher = await this.teacherService.getTeacherByUserId(userId);
      if (!teacher) throw new HttpException(403, `Failed to find teacher linked with user id: ${userId}`);

      const allCourses = await this.courseService.getTeacherCourses(teacher.id);

      res.status(200).json({ data: allCourses, message: "Successfully retrieved teacher's courses" });
    } catch (error) {
      next(error);
    }
  };

  public addAttendanceRecord = async (req: RequestWithSessionData, res: Response, next: NextFunction) => {
    try {
      const userId = req.session.user.id;
      const teacher = await this.teacherService.getTeacherByUserId(userId);
      if (!teacher) throw new HttpException(403, `Failed to find teacher linked with user id: ${userId}`);

      const data: AddAttendanceRecordDto = req.body;
      const createdAttendanceRecords = await this.attendanceService.addAttendanceRecords(data);

      res.status(201).json({ data: createdAttendanceRecords, message: "Added records successfully!" });
    } catch (error) {
      next(error);
    }
  };

  public setAttendanceRecord = async (req: RequestWithSessionData, res: Response, next: NextFunction) => {
    try {
      const userId = req.session.user.id;
      const teacher = await this.teacherService.getTeacherByUserId(userId);
      if (!teacher) throw new HttpException(403, `Failed to find teacher linked with user id: ${userId}`);

      const data: UpdateAttendanceRecordDto = req.body;
      const attendanceRecord = await this.attendanceService.setAttendanceRecord(data, teacher.id);

      res.status(202).json({ data: attendanceRecord, message: "Marked record as present successfully!" });
    } catch (error) {
      next(error);
    }
  };

  public getStudents = async (req: RequestWithSessionData, res: Response, next: NextFunction) => {
    try {
      const userId = req.session.user.id;
      const teacher = await this.teacherService.getTeacherByUserId(userId);
      if (!teacher) throw new HttpException(403, `Failed to find teacher linked with user id: ${userId}`);

      const students = await this.studentService.getStudentsInCourse(req.params.id);
      res.status(200).json({ data: students, message: "Students retrieved!" });
    } catch (error) {
      next(error);
    }
  };

  public getAttendanceRecords = async (req: RequestWithSessionData, res: Response, next: NextFunction) => {
    try {
      const userId = req.session.user.id;
      const teacher = await this.teacherService.getTeacherByUserId(userId);
      if (!teacher) throw new HttpException(403, `Failed to find teacher linked with user id: ${userId}`);

      const records = await this.attendanceService.getCourseAttendanceRecords(req.params.id, teacher.id);
      res.status(200).json({ data: records, message: "Attendance records retrieved!" });
    } catch (error) {
      next(error);
    }
  };
}

export default TeacherController;
