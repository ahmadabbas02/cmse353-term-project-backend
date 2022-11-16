import { CreateCourseDto } from "@/dtos/courses.dto";
import { HttpException } from "@/exceptions/HttpException";
import { CourseGroup, PrismaClient } from "@prisma/client";
import { isEmpty } from "class-validator";

class CoursesService {
  prisma = new PrismaClient();
  courses = this.prisma.courseGroup;

  public async findAllCourses(): Promise<CourseGroup[]> {
    const courses = this.courses.findMany();

    return courses;
  }

  public async createCourse(courseData: CreateCourseDto): Promise<CourseGroup> {
    if (isEmpty(courseData)) throw new HttpException(400, "courseData is empty");

    const { name, teacherId } = courseData;

    const findCourse: CourseGroup = await this.courses.findUnique({ where: { name: courseData.name } });
    if (findCourse) throw new HttpException(409, `This course ${courseData.name} already exists`);

    const createdCourse: Promise<CourseGroup> = this.courses.create({
      data: {
        name,
        teacherId,
      },
    });

    return createdCourse;
  }
}

export default CoursesService;
