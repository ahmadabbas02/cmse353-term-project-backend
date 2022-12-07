import { RequestWithSessionData } from "@/interfaces/auth.interface";
import ChairService from "@/services/chair.service";
import { NextFunction, Response } from "express";

class ChairController {
  private chairService = new ChairService();

  public getDepartmentStudents = (req: RequestWithSessionData, res: Response, next: NextFunction) => {
    try {
      const students = this.chairService.getDepartmentStudents(req);

      res.status(200).json({ data: students, message: "departmentStudents" });
    } catch (error) {
      next(error);
    }
  };
}

export default ChairController;
