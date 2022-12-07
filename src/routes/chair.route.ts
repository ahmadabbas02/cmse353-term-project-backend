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
    this.router.get(`${this.path}/students`, isLoggedIn, isSpecificRole(UserRole.CHAIR), this.chairController.getDepartmentStudents);
  }
}
export default ChairRoutes;
