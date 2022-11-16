import { Router } from "express";

import { Routes } from "@interfaces/routes.interface";
import validationMiddleware from "@middlewares/validation.middleware";
import CoursesController from "@/controllers/courses.controller";
import { isLoggedIn, isSpecificRole } from "@/middlewares/auth.middleware";
import { UserRole } from "@/utils/consts";
import { CreateCourseDto } from "@/dtos/courses.dto";

class CoursesRoutes implements Routes {
  public path = "/courses";
  public router = Router();
  public coursesController = new CoursesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, isLoggedIn, isSpecificRole(UserRole.SYSTEM_ADMINISTRATOR), this.coursesController.getAllCourses);
    this.router.post(
      `${this.path}/create`,
      isLoggedIn,
      isSpecificRole(UserRole.SYSTEM_ADMINISTRATOR),
      validationMiddleware(CreateCourseDto, "body"),
      this.coursesController.createCourse,
    );

    // this.router.get(`${this.path}/:id(\\d+)`, this.usersController.getUserById);
    // this.router.put(`${this.path}/:id(\\d+)`, validationMiddleware(CreateUserDto, "body", true), this.usersController.updateUser);
    // this.router.delete(`${this.path}/:id(\\d+)`, this.usersController.deleteUser);
  }
}

export default CoursesRoutes;
