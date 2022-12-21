import { Chair, Student, Teacher, User } from "@prisma/client";
import { ChairUserDto, CreateUserDto, LoginUserDto, ParentUserDto } from "@dtos/users.dto";
import { HttpException } from "@exceptions/HttpException";
import { isEmpty } from "@utils/util";
import { UserRole } from "@utils/consts";
import { prisma } from "@utils/db";
import UserService from "./user.service";

class AuthService {
  private users = prisma.user;
  private students = prisma.student;
  private parents = prisma.parent;
  private teachers = prisma.teacher;
  private chairs = prisma.chair;
  private userService = new UserService();

  public async registerStudent(studentData: CreateUserDto): Promise<Student> {
    if (isEmpty(studentData)) throw new HttpException(400, "studentData is empty");

    const findUser: User = await this.userService.findUserByEmail(studentData.email);
    if (findUser) throw new HttpException(409, `This email ${studentData.email} already exists`);

    const { email, password, fullName } = studentData;

    const createdStudentData: Promise<Student> = this.students.create({
      data: {
        fullName: fullName,
        user: {
          create: { email, password, role: UserRole.STUDENT },
        },
      },
    });

    return createdStudentData;
  }

  public async registerParent(parentData: ParentUserDto) {
    if (isEmpty(parentData)) throw new HttpException(400, "parentData is empty");

    const findUser: User = await this.userService.findUserByEmail(parentData.email);
    if (findUser) throw new HttpException(409, `This email ${parentData.email} already exists`);

    const { email, password, fullName, studentIds } = parentData;

    const createdParentData = await this.parents.create({
      data: {
        fullName: fullName,
        user: {
          create: { email, password, role: UserRole.PARENT },
        },
      },
    });

    const children = await this.students.updateMany({
      where: {
        id: {
          in: studentIds,
        },
      },
      data: {
        parentId: createdParentData.id,
      },
    });

    return { parent: createdParentData, children };
  }

  public async registerTeacher(teacherData: CreateUserDto): Promise<Teacher> {
    if (isEmpty(teacherData)) throw new HttpException(400, "teacherData is empty");

    const findUser: User = await this.userService.findUserByEmail(teacherData.email);
    if (findUser) throw new HttpException(409, `This email ${teacherData.email} already exists`);

    const { email, password, fullName } = teacherData;

    const createdTeacherData: Promise<Teacher> = this.teachers.create({
      data: {
        fullName: fullName,
        user: {
          create: { email, password, role: UserRole.TEACHER },
        },
      },
    });

    return createdTeacherData;
  }

  public async registerChair(chairData: ChairUserDto): Promise<Chair> {
    if (isEmpty(chairData)) throw new HttpException(400, "chairData is empty");

    const findUser: User = await this.userService.findUserByEmail(chairData.email);
    if (findUser) throw new HttpException(409, `This email ${chairData.email} already exists`);

    const { fullName, email, password, department } = chairData;

    const createdChairData: Promise<Chair> = this.chairs.create({
      data: {
        fullName,
        department,
        user: {
          create: {
            email,
            password,
            role: UserRole.CHAIR,
          },
        },
      },
    });

    return createdChairData;
  }

  public async registerAdministrator(administratorData: CreateUserDto): Promise<User> {
    if (isEmpty(administratorData)) throw new HttpException(400, "administratorData is empty");

    const findUser: User = await this.userService.findUserByEmail(administratorData.email);
    if (findUser) throw new HttpException(409, `This email ${administratorData.email} already exists`);

    const { email, password } = administratorData;

    const createdUserData: Promise<User> = this.users.create({
      data: {
        email,
        password,
        role: UserRole.SYSTEM_ADMINISTRATOR,
      },
    });

    return createdUserData;
  }

  public async login(loginData: LoginUserDto): Promise<User> {
    if (isEmpty(loginData)) throw new HttpException(400, "loginData is empty");

    const findUser: User = await this.users.findUnique({ where: { email: loginData.email } });
    if (!findUser) throw new HttpException(409, `This email ${loginData.email} was not found`);

    const isPasswordMatching = loginData.password === findUser.password;
    if (!isPasswordMatching) throw new HttpException(409, "Password is not matching");

    return findUser;
  }

  public async logout(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "userData is empty");

    const findUser: User = await this.users.findFirst({ where: { email: userData.email, password: userData.password } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }
}

export default AuthService;
