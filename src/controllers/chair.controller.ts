import { HttpException } from "@/exceptions/HttpException";
import { RequestWithSessionData } from "@/interfaces/auth.interface";
import AttendanceService from "@/services/attendance.service";
import ChairService from "@/services/chair.service";
import StudentService from "@/services/student.service";
import { NextFunction, Response } from "express";

class ChairController {
  private chairService = new ChairService();
  private studentService = new StudentService();
  private attendanceService = new AttendanceService();

  public getDepartmentStudents = async (req: RequestWithSessionData, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.session.user.id;
      const chair = await this.chairService.getChairByUserId(userId);
      if (!chair) throw new HttpException(403, `Failed to find chair linked with user id: ${req.session.user.id}`);

      const students = await this.studentService.getAllDepartmentStudents(chair.department);
      res.status(200).json({ data: students, message: "departmentStudents" });
    } catch (error) {
      next(error);
    }
  };

  public getStudentAttendanceRecords = async (req: RequestWithSessionData, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.session.user.id;
      const studentId = req.params.id;

      const chair = await this.chairService.getChairByUserId(userId);
      if (!chair) throw new HttpException(403, `Failed to find chair linked with user id: ${req.session.user.id}`);

      const records = await this.attendanceService.getStudentAttendanceRecords(studentId, chair.department);
      res.status(200).json({ data: records, message: "attendanceRecords" });
    } catch (error) {
      next(error);
    }
  };
}

export default ChairController;
