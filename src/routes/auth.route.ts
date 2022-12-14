import { Router } from "express";
import AuthController from "@controllers/auth.controller";
import { ChairUserDto, CreateUserDto, LoginUserDto, ParentUserDto } from "@dtos/users.dto";
import { Routes } from "@interfaces/routes.interface";
import validationMiddleware from "@middlewares/validation.middleware";
import { isLoggedIn, isSpecificRole } from "@/middlewares/auth.middleware";
import { UserRole } from "@/utils/consts";

class AuthRoute implements Routes {
  public path = "/auth";
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/studentSignup`,
      isLoggedIn,
      isSpecificRole(UserRole.SYSTEM_ADMINISTRATOR),
      validationMiddleware(CreateUserDto, "body"),
      this.authController.registerStudent,
    );
    this.router.post(
      `${this.path}/parentSignup`,
      isLoggedIn,
      isSpecificRole(UserRole.SYSTEM_ADMINISTRATOR),
      validationMiddleware(ParentUserDto, "body"),
      this.authController.registerParent,
    );
    this.router.post(
      `${this.path}/teacherSignup`,
      isLoggedIn,
      isSpecificRole(UserRole.SYSTEM_ADMINISTRATOR),
      validationMiddleware(CreateUserDto, "body"),
      this.authController.registerTeacher,
    );
    this.router.post(
      `${this.path}/chairSignup`,
      isLoggedIn,
      isSpecificRole(UserRole.SYSTEM_ADMINISTRATOR),
      validationMiddleware(ChairUserDto, "body"),
      this.authController.registerChair,
    );
    this.router.post(
      `${this.path}/adminSignup`,
      isLoggedIn,
      isSpecificRole(UserRole.SYSTEM_ADMINISTRATOR),
      validationMiddleware(CreateUserDto, "body"),
      this.authController.registerAdministrator,
    );

    this.router.post(`${this.path}/login`, validationMiddleware(LoginUserDto, "body"), this.authController.logIn);
    this.router.post(`${this.path}/logout`, isLoggedIn, this.authController.logOut);
  }
}

export default AuthRoute;
