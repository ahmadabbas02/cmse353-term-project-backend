import { AttendanceRecord } from "@prisma/client";
import { NextFunction, Response } from "express";

import { RequestWithSessionData } from "@/interfaces/auth.interface";
import StudentService from "@/services/student.service";

class StudentsController {
  private studentsService = new StudentService();

  public getCourses = async (req: RequestWithSessionData, res: Response, next: NextFunction) => {
    try {
      const data = await this.studentsService.getCourses(req);

      res.status(200).json({ data, message: "Successfully retrieved all courses" });
    } catch (error) {
      next(error);
    }
  };

  public getAttendanceRecords = async (req: RequestWithSessionData, res: Response, next: NextFunction) => {
    try {
      const records: AttendanceRecord[] = await this.studentsService.getAttendanceRecords(req, req.params.id);

      res.status(200).json({ data: records, message: "Successfully retrieved attendance records." });
    } catch (error) {
      next(error);
    }
  };
}

export default StudentsController;
