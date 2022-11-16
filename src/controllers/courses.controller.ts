import { CreateCourseDto } from "@/dtos/courses.dto";
import CoursesService from "@/services/courses.service";
import { CourseGroup } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

class CoursesController {
  private coursesService = new CoursesService();

  public getAllCourses = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const allCourses: CourseGroup[] = await this.coursesService.findAllCourses();

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
}

export default CoursesController;
