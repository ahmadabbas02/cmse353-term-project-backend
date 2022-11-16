import { Router } from "express";
import UsersController from "@controllers/users.controller";
import { CreateUserDto } from "@dtos/users.dto";
import { Routes } from "@interfaces/routes.interface";
import validationMiddleware from "@middlewares/validation.middleware";

class UsersRoute implements Routes {
  public path = "/users";
  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * @openapi
     * /users:
     *  get:
     *    tags:
     *      - users
     *    summary: Find All Users
     *    responses:
     *      200:
     *        description: OK
     *      500:
     *        description: Server Error
     */
    this.router.get(`${this.path}`, this.usersController.getUsers);

    this.router.get(`${this.path}/:id(\\d+)`, this.usersController.getUserById);
    this.router.put(`${this.path}/:id(\\d+)`, validationMiddleware(CreateUserDto, "body", true), this.usersController.updateUser);
    this.router.delete(`${this.path}/:id(\\d+)`, this.usersController.deleteUser);
  }
}

export default UsersRoute;
