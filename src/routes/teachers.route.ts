import { Router } from "express";

import { Routes } from "@interfaces/routes.interface";
import validationMiddleware from "@middlewares/validation.middleware";
import { isLoggedIn, isSpecificRole } from "@/middlewares/auth.middleware";
import { UserRole } from "@/utils/consts";
import { AddAttendanceRecordDto, UpdateAttendanceRecordDto } from "@/dtos/courses.dto";
import TeacherController from "@/controllers/teacher.controller";

class TeachersRoutes implements Routes {
  public path = "/teachers";
  public router = Router();
  public teachersController = new TeacherController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Get courses that is related to the logged in teacher
    this.router.get(`${this.path}/courses`, isLoggedIn, isSpecificRole(UserRole.TEACHER), this.teachersController.getCourses);

    // Get students of the course with specified id
    this.router.get(`${this.path}/courses/:id`, isLoggedIn, isSpecificRole(UserRole.TEACHER), this.teachersController.getStudents);

    // Get attendance records the course with specified id
    this.router.get(`${this.path}/courses/records/:id`, isLoggedIn, isSpecificRole(UserRole.TEACHER), this.teachersController.getAttendanceRecords);

    // Generate attendance record for the specified course id and date time passed through the body
    this.router.post(
      `${this.path}/courses/createAttendanceRecords`,
      isLoggedIn,
      isSpecificRole(UserRole.TEACHER),
      validationMiddleware(AddAttendanceRecordDto, "body"),
      this.teachersController.addAttendanceRecord,
    );

    // Mark student's attendance record(by id) as the boolean 'isPresent' passed in body
    this.router.post(
      `${this.path}/courses/markAttendanceRecord`,
      isLoggedIn,
      isSpecificRole(UserRole.TEACHER),
      validationMiddleware(UpdateAttendanceRecordDto, "body"),
      this.teachersController.setAttendanceRecord,
    );
  }
}

export default TeachersRoutes;
