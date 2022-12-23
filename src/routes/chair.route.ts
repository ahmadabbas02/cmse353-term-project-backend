import ChairController from "@/controllers/chair.controller";
import { Routes } from "@/interfaces/routes.interface";
import { isLoggedIn, isSpecificRole } from "@/middlewares/auth.middleware";
import { UserRole } from "@/utils/consts";
import { Router } from "express";

class ChairRoutes implements Routes {
  public path = "/chair";
  public router = Router();
  private chairController = new ChairController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Get all students in the department
    this.router.get(`${this.path}/students`, isLoggedIn, isSpecificRole(UserRole.CHAIR), this.chairController.getDepartmentStudents);

    // Get the course attendance record of student
    this.router.get(`${this.path}/students/records`, isLoggedIn, isSpecificRole(UserRole.CHAIR), this.chairController.getStudentAttendanceRecords);

    // Get the courses of student with id
    this.router.get(`${this.path}/students/:id`, isLoggedIn, isSpecificRole(UserRole.CHAIR), this.chairController.getStudentCourses);
  }
}
export default ChairRoutes;
