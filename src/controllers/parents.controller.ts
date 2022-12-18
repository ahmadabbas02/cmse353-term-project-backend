import { ChildAttendanceDto } from "@/dtos/parents.dto";
import { HttpException } from "@/exceptions/HttpException";
import { RequestWithSessionData } from "@/interfaces/auth.interface";
import ParentsService from "@/services/parents.service";
import StudentsService from "@/services/students.service";
import { NextFunction, Response } from "express";

class ParentsController {
  private parentsService = new ParentsService();
  private studentService = new StudentsService();

  public getChildren = async (req: RequestWithSessionData, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parentId = (await this.parentsService.getParentFromUserId(req.session.user.id)).id;

      const childrenStudents = await this.parentsService.getChildren(parentId);

      res.status(200).json({ data: childrenStudents, message: "childrenStudents" });
    } catch (error) {
      next(error);
    }
  };

  public getChildCourses = async (req: RequestWithSessionData, res: Response, next: NextFunction): Promise<void> => {
    try {
      const studentId = req.params.id;

      const parentId = (await this.parentsService.getParentFromUserId(req.session.user.id)).id;

      const isChild = (await this.studentService.getStudentById(studentId)).parentId === parentId;
      if (!isChild) throw new HttpException(401, `You can't check the courses of anyone other than your children.`);

      const records = await this.parentsService.getChildCourses(studentId);

      res.status(200).json({ data: records, message: "childCourses" });
    } catch (error) {
      next(error);
    }
  };

  public getAttendanceDetails = async (req: RequestWithSessionData, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: ChildAttendanceDto = req.body;
      const records = await this.parentsService.getChildAttendanceRecord(data);

      res.status(200).json({ data: records, message: "childAttendanceDetails" });
    } catch (error) {
      next(error);
    }
  };
}

export default ParentsController;
