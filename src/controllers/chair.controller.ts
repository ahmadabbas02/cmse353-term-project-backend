import { RequestWithSessionData } from "@/interfaces/auth.interface";
import ChairService from "@/services/chair.service";
import { NextFunction, Response } from "express";

class ChairController {
  private chairService = new ChairService();

  public getDepartmentStudents = async (req: RequestWithSessionData, res: Response, next: NextFunction): Promise<void> => {
    try {
      const students = await this.chairService.getDepartmentStudents(req);

      res.status(200).json({ data: students, message: "departmentStudents" });
    } catch (error) {
      next(error);
    }
  };

  public getStudentAttendanceRecords = async (req: RequestWithSessionData, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.session.user.id;
      const studentId = req.params.id;
      const records = await this.chairService.getStudentAttendanceRecord(userId, studentId);

      res.status(200).json({ data: records, message: "attendanceRecords" });
    } catch (error) {
      next(error);
    }
  };
}

export default ChairController;
