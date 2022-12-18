import { Router } from "express";

import { Routes } from "@interfaces/routes.interface";
import validationMiddleware from "@middlewares/validation.middleware";
import AdminController from "@/controllers/admin.controller";
import { isLoggedIn, isSpecificRole } from "@/middlewares/auth.middleware";
import { UserRole } from "@/utils/consts";
import { AddStudentToCourseDto, CreateCourseDto } from "@/dtos/courses.dto";
import { CreateUserDto } from "@/dtos/users.dto";

class AdminRoutes implements Routes {
  public path = "/admin";
  public router = Router();
  private adminController = new AdminController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Routes related to user
    // Get all users
    this.router.get(`${this.path}/users`, isLoggedIn, isSpecificRole(UserRole.SYSTEM_ADMINISTRATOR), this.adminController.getUsers);

    // Get user by id
    this.router.get(`${this.path}/users/:id`, isLoggedIn, isSpecificRole(UserRole.SYSTEM_ADMINISTRATOR), this.adminController.getUserById);

    // Update user by id
    this.router.put(
      `${this.path}/users/:id`,
      isLoggedIn,
      isSpecificRole(UserRole.SYSTEM_ADMINISTRATOR),
      validationMiddleware(CreateUserDto, "body", true),
      this.adminController.updateUser,
    );

    // Delete user
    this.router.delete(`${this.path}/users/:id`, isLoggedIn, isSpecificRole(UserRole.SYSTEM_ADMINISTRATOR), this.adminController.deleteUser);

    // Routes related to course
    // Get all courses
    this.router.get(`${this.path}/courses`, isLoggedIn, isSpecificRole(UserRole.SYSTEM_ADMINISTRATOR), this.adminController.getAllCourses);

    // Add new course
    this.router.post(
      `${this.path}/courses/create`,
      isLoggedIn,
      isSpecificRole(UserRole.SYSTEM_ADMINISTRATOR),
      validationMiddleware(CreateCourseDto, "body"),
      this.adminController.createCourse,
    );

    // Add student to course
    this.router.post(
      `${this.path}/courses/addStudentToCourse`,
      isLoggedIn,
      isSpecificRole(UserRole.SYSTEM_ADMINISTRATOR),
      validationMiddleware(AddStudentToCourseDto, "body"),
      this.adminController.addStudentToCourse,
    );

    // Remove student from course
    this.router.post(
      `${this.path}/courses/removeStudentFromCourse`,
      isLoggedIn,
      isSpecificRole(UserRole.SYSTEM_ADMINISTRATOR),
      validationMiddleware(AddStudentToCourseDto, "body"),
      this.adminController.removeStudentFromCourse,
    );
  }
}

export default AdminRoutes;
