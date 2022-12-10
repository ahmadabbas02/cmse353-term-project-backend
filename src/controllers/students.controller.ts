import { AttendanceRecord, CourseGroup } from "@prisma/client";
import { NextFunction, Response } from "express";

import { RequestWithSessionData } from "@/interfaces/auth.interface";
import StudentsService from "@/services/students.service";

class StudentsController {
  private studentsService = new StudentsService();

  public getCourses = async (req: RequestWithSessionData, res: Response, next: NextFunction) => {
    try {
      const courses: CourseGroup[] = await this.studentsService.getCourses(req);

      res.status(200).json({ data: courses, message: "Successfully retrieved all courses" });
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
