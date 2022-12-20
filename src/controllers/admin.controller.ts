import { changeSecretKey } from "@/config";
import { AddStudentToCourseDto, CreateCourseDto } from "@/dtos/courses.dto";
import { CreateUserDto } from "@/dtos/users.dto";
import AdminService from "@/services/admin.service";
import UserService from "@/services/users.service";
import { CourseGroup, User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

class AdminController {
  private coursesService = new AdminService();
  public userService = new UserService();

  public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllUsersData: User[] = await this.userService.findAllUser();

      res.status(200).json({ data: findAllUsersData, message: "findAll" });
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.id;
      const findOneUserData: User = await this.userService.findUserById(userId);

      res.status(200).json({ data: findOneUserData, message: "findOne" });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.id;
      const userData: CreateUserDto = req.body;
      const updateUserData: User = await this.userService.updateUser(userId, userData);

      res.status(200).json({ data: updateUserData, message: "updated" });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.id;
      const deleteUserData: User = await this.userService.deleteUser(userId);

      res.status(200).json({ data: deleteUserData, message: "deleted" });
    } catch (error) {
      next(error);
    }
  };

  public getAllCourses = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const allCourses: CourseGroup[] = await this.coursesService.getAllCourses();

      res.status(200).json({ data: allCourses, message: "Successfully retrieved all courses" });
    } catch (error) {
      next(error);
    }
  };

  public createCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseData: CreateCourseDto = req.body;
      const createdCourse: CourseGroup = await this.coursesService.createCourse(courseData);

      res.status(201).json({ data: createdCourse, message: "Created course successfully!" });
    } catch (error) {
      next(error);
    }
  };

  public addStudentToCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: AddStudentToCourseDto = req.body;
      const createdCourse: CourseGroup = await this.coursesService.addStudent(data);

      res.status(201).json({ data: createdCourse, message: "Added student successfully!" });
    } catch (error) {
      next(error);
    }
  };

  public removeStudentFromCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: AddStudentToCourseDto = req.body;
      const createdCourse: CourseGroup = await this.coursesService.removeStudent(data);

      res.status(201).json({ data: createdCourse, message: "Removed student successfully!" });
    } catch (error) {
      next(error);
    }
  };

  public resetKeys = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users: User[] = await changeSecretKey();

      res.status(201).json({ data: users, message: "Reset keys successfully!" });
    } catch (error) {
      next(error);
    }
  };
}

export default AdminController;
