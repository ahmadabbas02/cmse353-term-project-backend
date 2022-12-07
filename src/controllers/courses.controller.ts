import { AddAttendanceRecordDto, AddStudentToCourseDto, CreateCourseDto, UpdateAttendanceRecordDto } from "@/dtos/courses.dto";
import { RequestWithSessionData } from "@/interfaces/auth.interface";
import CoursesService from "@/services/courses.service";
import { CourseGroup } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

class CoursesController {
  private coursesService = new CoursesService();

  public getAllCourses = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const allCourses: CourseGroup[] = await this.coursesService.getAllCourses();

      res.status(200).json({ data: allCourses, message: "Successfully retrieved all courses" });
    } catch (error) {
      next(error);
    }
  };

  public createCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseData: CreateCourseDto = req.body;
      const createdCourse: CourseGroup = await this.coursesService.createCourse(courseData);

      res.status(201).json({ data: createdCourse, message: "Created course successfully!" });
    } catch (error) {
      next(error);
    }
  };

  public addStudentToCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: AddStudentToCourseDto = req.body;
      const createdCourse: CourseGroup = await this.coursesService.addStudent(data);

      res.status(201).json({ data: createdCourse, message: "Added student successfully!" });
    } catch (error) {
      next(error);
    }
  };

  public removeStudentFromCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: AddStudentToCourseDto = req.body;
      const createdCourse: CourseGroup = await this.coursesService.removeStudent(data);

      res.status(201).json({ data: createdCourse, message: "Removed student successfully!" });
    } catch (error) {
      next(error);
    }
  };

  public addAttendanceRecord = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: AddAttendanceRecordDto = req.body;
      const createdAttendanceRecords = await this.coursesService.addAttendanceRecords(data);

      res.status(201).json({ data: createdAttendanceRecords, message: "Added records successfully!" });
    } catch (error) {
      next(error);
    }
  };

  public markAttendanceRecordPresent = async (req: RequestWithSessionData, res: Response, next: NextFunction) => {
    try {
      const data: UpdateAttendanceRecordDto = req.body;
      const attendanceRecord = await this.coursesService.markAttendanceRecordPresent(data, req);

      res.status(201).json({ data: attendanceRecord, message: "Marked record as present successfully!" });
    } catch (error) {
      next(error);
    }
  };
}

export default CoursesController;
