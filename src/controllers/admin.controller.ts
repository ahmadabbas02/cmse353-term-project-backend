import { changeSecretKey } from "@/config";
import { AddStudentToCourseDto, CreateCourseDto } from "@/dtos/courses.dto";
import { ChangeRoleDto, CreateUserDto } from "@/dtos/users.dto";
import AuthService from "@/services/auth.service";
import ChairService from "@/services/chair.service";
import CourseService from "@/services/course.service";
import ParentService from "@/services/parent.service";
import StudentService from "@/services/student.service";
import TeacherService from "@/services/teacher.service";
import UserService from "@/services/user.service";
import { CourseGroup, User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

class AdminController {
  private coursesService = CourseService.getInstance();
  private userService = UserService.getInstance();
  private studentService = StudentService.getInstance();
  private teacherService = TeacherService.getInstance();
  private parentService = ParentService.getInstance();
  private chairService = ChairService.getInstance();
  private authService = AuthService.getInstance();

  public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllUsersData: User[] = await this.userService.findAllUser();

      res.status(200).json({ data: findAllUsersData, message: "findAll" });
    } catch (error) {
      next(error);
    }
  };

  public getStudents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const students = await this.studentService.getAllStudents();

      res.status(200).json({ data: students, message: "students" });
    } catch (error) {
      next(error);
    }
  };

  public getTeachers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const teachers = await this.teacherService.getAllTeachers();

      res.status(200).json({ data: teachers, message: "teachers" });
    } catch (error) {
      next(error);
    }
  };

  public getParents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parents = await this.parentService.getAllParents();

      res.status(200).json({ data: parents, message: "parents" });
    } catch (error) {
      next(error);
    }
  };

  public getChairs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const chairs = await this.chairService.getAllChairs();

      res.status(200).json({ data: chairs, message: "chairs" });
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
      const createdCourse: CourseGroup = await this.coursesService.addStudentToCourse(data);

      res.status(201).json({ data: createdCourse, message: "Added student successfully!" });
    } catch (error) {
      next(error);
    }
  };

  public removeStudentFromCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: AddStudentToCourseDto = req.body;
      const createdCourse: CourseGroup = await this.coursesService.removeStudentFromCourse(data);

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

  public updateRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: ChangeRoleDto = req.body;

      const users = await this.authService.updateRole(body);

      res.status(201).json({ data: users, message: "Updated role successfully!" });
    } catch (error) {
      next(error);
    }
  };
}

export default AdminController;
