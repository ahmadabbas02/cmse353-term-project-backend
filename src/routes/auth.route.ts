import { Router } from "express";
import AuthController from "@controllers/auth.controller";
import { CreateTeacherDto, CreateUserDto } from "@dtos/users.dto";
import { Routes } from "@interfaces/routes.interface";
import authMiddleware from "@middlewares/auth.middleware";
import validationMiddleware from "@middlewares/validation.middleware";

class AuthRoute implements Routes {
  public path = "/";
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // this.router.post(`${this.path}signup`, validationMiddleware(CreateUserDto, "body"), this.authController.registerUser);
    this.router.post(`${this.path}teacherSignup`, validationMiddleware(CreateTeacherDto, "body"), this.authController.registerTeacher);
    this.router.post(`${this.path}login`, validationMiddleware(CreateUserDto, "body"), this.authController.logIn);
    this.router.post(`${this.path}logout`, authMiddleware, this.authController.logOut);
  }
}

export default AuthRoute;
