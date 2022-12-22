import ParentController from "@/controllers/parent.controller";
import { AttendanceDto } from "@/dtos/parents.dto";
import { Routes } from "@/interfaces/routes.interface";
import { isLoggedIn, isSpecificRole } from "@/middlewares/auth.middleware";
import validationMiddleware from "@/middlewares/validation.middleware";
import { UserRole } from "@/utils/consts";
import { Router } from "express";

class ParentsRoutes implements Routes {
  public path = "/parents";
  public router = Router();
  private parentController = new ParentController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Get all children
    this.router.get(`${this.path}/children`, isLoggedIn, isSpecificRole(UserRole.PARENT), this.parentController.getChildren);

    // Get the child courses
    this.router.get(`${this.path}/child/:id`, isLoggedIn, isSpecificRole(UserRole.PARENT), this.parentController.getChildCourses);

    // Get the child's course attendance
    this.router.get(
      `${this.path}/attendance`,
      isLoggedIn,
      isSpecificRole(UserRole.PARENT),
      validationMiddleware(AttendanceDto, "body"),
      this.parentController.getAttendanceDetails,
    );
  }
}
export default ParentsRoutes;
