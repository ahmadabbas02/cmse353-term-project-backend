import { HttpException } from "@/exceptions/HttpException";
import { RequestWithSessionData } from "@/interfaces/auth.interface";
import AttendanceService from "@/services/attendance.service";
import CourseService from "@/services/course.service";
import ParentService from "@/services/parent.service";
import StudentService from "@/services/student.service";
import { NextFunction, Response } from "express";

class ParentController {
  private parentsService = new ParentService();
  private studentService = new StudentService();
  private courseService = new CourseService();
  private attendanceService = new AttendanceService();

  public getChildren = async (req: RequestWithSessionData, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.session.user.id;

      const parent = await this.parentsService.getParentFromUserId(userId);
      if (!parent) throw new HttpException(403, `Failed to find parent linked with user id: ${req.session.user.id}`);

      const childrenStudents = await this.studentService.getChildrenStudents(parent.id);
      res.status(200).json({ data: childrenStudents, message: "childrenStudents" });
    } catch (error) {
      next(error);
    }
  };

  public getChildCourses = async (req: RequestWithSessionData, res: Response, next: NextFunction): Promise<void> => {
    try {
      const studentId = req.params.id;

      const userId = req.session.user.id;
      const parent = await this.parentsService.getParentFromUserId(userId);
      if (!parent) throw new HttpException(403, `Failed to find parent linked with user id: ${req.session.user.id}`);

      const isChild = (await this.studentService.getStudentById(studentId)).parentId === parent.id;
      if (!isChild) throw new HttpException(401, `You can't check the courses of anyone other than your children.`);

      const records = await this.courseService.getStudentCourses(studentId);

      res.status(200).json({ data: records, message: "childCourses" });
    } catch (error) {
      next(error);
    }
  };

  public getAttendanceDetails = async (req: RequestWithSessionData, res: Response, next: NextFunction): Promise<void> => {
    try {
      const studentId = req.query.studentId as string;
      const courseId = req.query.courseId as string;
      if (!studentId) throw new HttpException(400, `Missing query 'studentId'`);
      if (!courseId) throw new HttpException(400, `Missing query 'courseId'`);

      const userId = req.session.user.id;

      const parent = await this.parentsService.getParentFromUserId(userId);
      if (!parent) throw new HttpException(403, `Failed to find parent linked with user id: ${req.session.user.id}`);

      const records = await this.attendanceService.getStudentCourseAttendanceRecords({
        courseId,
        studentId,
      });

      res.status(200).json({ data: records, message: "childAttendanceDetails" });
    } catch (error) {
      next(error);
    }
  };
}

export default ParentController;
