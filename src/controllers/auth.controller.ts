import { NextFunction, Request, Response } from "express";
import { Chair, Parent, Student, Teacher, User } from "@prisma/client";
import { ChairUserDto, CreateUserDto, LoginUserDto } from "@dtos/users.dto";
import AuthService from "@services/auth.service";
import { RequestWithSessionData } from "@/interfaces/auth.interface";
import { excludeFromUser } from "@/utils/util";

class AuthController {
  public authService = new AuthService();

  public registerStudent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;
      const signUpUserData: Student = await this.authService.registerStudent(userData);

      res.status(201).json({ data: signUpUserData, message: "studentSignup" });
    } catch (error) {
      next(error);
    }
  };

  public registerParent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;
      const signUpUserData: Parent = await this.authService.registerParent(userData);

      res.status(201).json({ data: signUpUserData, message: "parentSignup" });
    } catch (error) {
      next(error);
    }
  };

  public registerTeacher = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;
      const signUpUserData: Teacher = await this.authService.registerTeacher(userData);

      res.status(201).json({ data: signUpUserData, message: "teacherSignup" });
    } catch (error) {
      next(error);
    }
  };

  public registerChair = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: ChairUserDto = req.body;
      const signUpChairData: Chair = await this.authService.registerChair(userData);

      res.status(201).json({ data: signUpChairData, message: "chairSignup" });
    } catch (error) {
      next(error);
    }
  };

  public registerAdministrator = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;
      const signUpUserData: User = await this.authService.registerAdministrator(userData);

      res.status(201).json({ data: excludeFromUser(signUpUserData, "password"), message: "adminSignup" });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: RequestWithSessionData, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: LoginUserDto = req.body;
      const { findUser } = await this.authService.login(userData);
      req.session.user = findUser;
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
