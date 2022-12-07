import { Router } from "express";
import UsersController from "@controllers/users.controller";
import { CreateUserDto } from "@dtos/users.dto";
import { Routes } from "@interfaces/routes.interface";
import validationMiddleware from "@middlewares/validation.middleware";
import { isLoggedIn, isSpecificRole } from "@/middlewares/auth.middleware";
import { UserRole } from "@/utils/consts";

class UsersRoute implements Routes {
  public path = "/users";
  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, isLoggedIn, isSpecificRole(UserRole.SYSTEM_ADMINISTRATOR), this.usersController.getUsers);

    this.router.get(`${this.path}/:id`, isLoggedIn, isSpecificRole(UserRole.SYSTEM_ADMINISTRATOR), this.usersController.getUserById);
    this.router.put(
      `${this.path}/:id`,
      isLoggedIn,
      isSpecificRole(UserRole.SYSTEM_ADMINISTRATOR),
      validationMiddleware(CreateUserDto, "body", true),
      this.usersController.updateUser,
    );
    this.router.delete(`${this.path}/:id`, isLoggedIn, isSpecificRole(UserRole.SYSTEM_ADMINISTRATOR), this.usersController.deleteUser);
  }
}

export default UsersRoute;
