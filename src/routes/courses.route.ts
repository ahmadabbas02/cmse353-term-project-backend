import { Router } from "express";

import { Routes } from "@interfaces/routes.interface";
import validationMiddleware from "@middlewares/validation.middleware";
import CoursesController from "@/controllers/courses.controller";
import { isLoggedIn, isSpecificRole } from "@/middlewares/auth.middleware";
import { UserRole } from "@/utils/consts";
import { AddStudentToCourseDto, CreateCourseDto } from "@/dtos/courses.dto";

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

    this.router.post(
      `${this.path}/addStudentToCourse`,
      isLoggedIn,
      isSpecificRole(UserRole.SYSTEM_ADMINISTRATOR),
      validationMiddleware(AddStudentToCourseDto, "body"),
      this.coursesController.addStudentToCourse,
    );

    this.router.post(
      `${this.path}/removeStudentFromCourse`,
      isLoggedIn,
      isSpecificRole(UserRole.SYSTEM_ADMINISTRATOR),
      validationMiddleware(AddStudentToCourseDto, "body"),
      this.coursesController.removeStudentFromCourse,
    );
  }
}

export default CoursesRoutes;
