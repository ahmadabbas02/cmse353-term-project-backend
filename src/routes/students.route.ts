import StudentsController from "@/controllers/students.controller";
import { Routes } from "@/interfaces/routes.interface";
import { isLoggedIn, isSpecificRole } from "@/middlewares/auth.middleware";
import { UserRole } from "@/utils/consts";
import { Router } from "express";

class StudentsRoute implements Routes {
  public path = "/students";
  public router = Router();
  private studentController = new StudentsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/courses`, isLoggedIn, isSpecificRole(UserRole.STUDENT), this.studentController.getCourses);

    // Return attendance records for the specific course
    this.router.get(`${this.path}/course/:id`, isLoggedIn, isSpecificRole(UserRole.STUDENT), this.studentController.getAttendanceRecords);
  }
}

export default StudentsRoute;
