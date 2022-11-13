import { NextFunction, Request, Response } from "express";
import { Teacher } from "@prisma/client";
import { CreateTeacherDto, LoginUserDto } from "@dtos/users.dto";
import AuthService from "@services/auth.service";
import { RequestWithSessionData } from "@/interfaces/auth.interface";
import { excludeFromUser } from "@/utils/util";

class AuthController {
  public authService = new AuthService();

  public registerTeacher = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateTeacherDto = req.body;
      const signUpUserData: Teacher = await this.authService.signUpTeacher(userData);

      res.status(201).json({ data: signUpUserData, message: "teacherSignup" });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: RequestWithSessionData, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: LoginUserDto = req.body;
      const { findUser } = await this.authService.login(userData);
      req.session.userId = findUser.id;
      res.status(200).json({ data: excludeFromUser(findUser, "password"), message: "login" });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithSessionData, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.session.destroy(error => {
        if (error) {
          next(error);
        } else {
          res.status(200).json({ message: "Logout successful" });
        }
      });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
