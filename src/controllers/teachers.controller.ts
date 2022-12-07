import { AddAttendanceRecordDto, UpdateAttendanceRecordDto } from "@/dtos/courses.dto";
import { RequestWithSessionData } from "@/interfaces/auth.interface";
import TeachersService from "@/services/teachers.service";
import { CourseGroup } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

class TeachersController {
  private teachersSerivce = new TeachersService();

  public getCourses = async (req: RequestWithSessionData, res: Response, next: NextFunction) => {
    try {
      const allCourses: CourseGroup[] = await this.teachersSerivce.getCourses(req.session.user.id);

      res.status(200).json({ data: allCourses, message: "Successfully retrieved teacher's courses" });
    } catch (error) {
      next(error);
    }
  };

  public addAttendanceRecord = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: AddAttendanceRecordDto = req.body;
      const createdAttendanceRecords = await this.teachersSerivce.addAttendanceRecords(data);

      res.status(201).json({ data: createdAttendanceRecords, message: "Added records successfully!" });
    } catch (error) {
      next(error);
    }
  };

  public setAttendanceRecord = async (req: RequestWithSessionData, res: Response, next: NextFunction) => {
    try {
      const data: UpdateAttendanceRecordDto = req.body;
      const attendanceRecord = await this.teachersSerivce.setAttendanceRecord(data, req);

      res.status(201).json({ data: attendanceRecord, message: "Marked record as present successfully!" });
    } catch (error) {
      next(error);
    }
  };

  public getStudents = async (req: RequestWithSessionData, res: Response, next: NextFunction) => {
    try {
      const students = await this.teachersSerivce.getStudents(req.params.id, req.session.user.id);

      res.status(201).json({ data: students, message: "Students retrieved!" });
    } catch (error) {
      next(error);
    }
  };
}

export default TeachersController;
