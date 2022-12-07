import { HttpException } from "@/exceptions/HttpException";
import { RequestWithSessionData } from "@/interfaces/auth.interface";

class ChairService {
  private students = prisma.student;
  private chairs = prisma.chair;

  public async getDepartmentStudents(req: RequestWithSessionData) {
    const chair = await this.chairs.findFirst({ where: { userId: req.session.user.id } });
    if (!chair) throw new HttpException(403, `Failed to find chair linked with user id: ${req.session.user.id}`);

    const students = await this.students.findMany({
      where: {
        department: chair.department,
      },
    });
    return students;
  }
}

export default ChairService;
