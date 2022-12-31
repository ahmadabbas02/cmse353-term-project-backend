import { Chair, Parent, Prisma, Student, Teacher, User } from "@prisma/client";
import { ChairUserDto, ChangeRoleDto, CreateUserDto, LoginUserDto, ParentUserDto } from "@dtos/users.dto";
import { HttpException } from "@exceptions/HttpException";
import { isEmpty } from "@utils/util";
import { UserRole } from "@utils/consts";
import { prisma } from "@utils/db";
import UserService from "./user.service";

class AuthService {
  static instance: AuthService;
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private users = prisma.user;
  private students = prisma.student;
  private parents = prisma.parent;
  private teachers = prisma.teacher;
  private chairs = prisma.chair;
  private userService = UserService.getInstance();

  public async registerStudent(studentData: CreateUserDto, id?: string): Promise<Student> {
    if (isEmpty(studentData)) throw new HttpException(400, "studentData is empty");

    const findUser: User = await this.userService.findUserByEmail(studentData.email);
    if (findUser) throw new HttpException(409, `This email ${studentData.email} already exists`);

    const { email, password, fullName } = studentData;

    const createdStudentData: Promise<Student> = this.students.create({
      data: {
        fullName: fullName,
        user: {
          create: { id, email, password, role: UserRole.STUDENT },
        },
      },
    });

    return createdStudentData;
  }

  public async registerParent(parentData: ParentUserDto, id?: string) {
    if (isEmpty(parentData)) throw new HttpException(400, "parentData is empty");

    const findUser: User = await this.userService.findUserByEmail(parentData.email);
    if (findUser) throw new HttpException(409, `This email ${parentData.email} already exists`);

    const { email, password, fullName, studentIds } = parentData;

    const createdParentData = await this.parents.create({
      data: {
        fullName: fullName,
        user: {
          create: { id, email, password, role: UserRole.PARENT },
        },
      },
    });

    let children: Prisma.BatchPayload;
    if (studentIds) {
      children = await this.students.updateMany({
        where: {
          id: {
            in: studentIds,
          },
        },
        data: {
          parentId: createdParentData.id,
        },
      });
    }

    return { parent: createdParentData, children };
  }

  public async registerTeacher(teacherData: CreateUserDto, id?: string): Promise<Teacher> {
    if (isEmpty(teacherData)) throw new HttpException(400, "teacherData is empty");

    const findUser: User = await this.userService.findUserByEmail(teacherData.email);
    if (findUser) throw new HttpException(409, `This email ${teacherData.email} already exists`);

    const { email, password, fullName } = teacherData;

    const createdTeacherData: Promise<Teacher> = this.teachers.create({
      data: {
        fullName: fullName,
        user: {
          create: { id, email, password, role: UserRole.TEACHER },
        },
      },
    });

    return createdTeacherData;
  }

  public async registerChair(chairData: ChairUserDto, id?: string): Promise<Chair> {
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
            id,
            email,
            password,
            role: UserRole.CHAIR,
          },
        },
      },
    });

    return createdChairData;
  }

  public async registerAdministrator(administratorData: CreateUserDto, id?: string): Promise<User> {
    if (isEmpty(administratorData)) throw new HttpException(400, "administratorData is empty");

    const findUser: User = await this.userService.findUserByEmail(administratorData.email);
    if (findUser) throw new HttpException(409, `This email ${administratorData.email} already exists`);

    const { email, password } = administratorData;

    const createdUserData: Promise<User> = this.users.create({
      data: {
        id,
        email,
        password,
        role: UserRole.SYSTEM_ADMINISTRATOR,
      },
    });

    return createdUserData;
  }

  public async login(loginData: LoginUserDto): Promise<User> {
    if (isEmpty(loginData)) throw new HttpException(400, "loginData is empty");

    const findUser = await this.users.findUnique({
      where: { email: loginData.email },
      include: {
        chair: true,
        parent: true,
        student: true,
        teacher: true,
      },
    });
    if (!findUser) throw new HttpException(409, `This email ${loginData.email} was not found`);

    const isPasswordMatching = loginData.password === findUser.password;
    if (!isPasswordMatching) throw new HttpException(409, "Password is not matching");

    if (findUser.chair === null) delete findUser.chair;
    if (findUser.teacher === null) delete findUser.teacher;
    if (findUser.parent === null) delete findUser.parent;
    if (findUser.student === null) delete findUser.student;

    return findUser;
  }

  public async logout(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "userData is empty");

    const findUser: User = await this.users.findFirst({ where: { email: userData.email, password: userData.password } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async updateRole(data: ChangeRoleDto, loggedInUserId: string) {
    const { userId, userRole, studentIds, department } = data;

    const findUser = await this.users.findUnique({
      where: { id: userId },
      include: { teacher: true, chair: true, parent: true, student: true },
    });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    if (findUser.role === userRole) throw new HttpException(409, `User is already having the ${findUser.role} role`);

    if (loggedInUserId === findUser.id) throw new HttpException(409, `You can't change your own role.`);

    await this.users.delete({
      where: { id: findUser.id },
    });

    const fullName = findUser.student?.fullName || findUser.chair?.fullName || findUser.teacher?.fullName || findUser.parent?.fullName;

    let registeredUser: {
      id?: string;
      fullName?: string;
      userId?: string;
      parent?: Parent;
      children?: Prisma.BatchPayload;
      department?: string;
      parentId?: string;
      email?: string;
      password?: string;
      role?: string;
    };

    switch (userRole) {
      case UserRole.TEACHER:
        registeredUser = await this.registerTeacher(
          {
            email: findUser.email,
            password: findUser.password,
            fullName,
          },
          userId,
        );
        break;
      case UserRole.PARENT:
        registeredUser = await this.registerParent(
          {
            email: findUser.email,
            password: findUser.password,
            fullName,
            studentIds,
          },
          userId,
        );
        break;
      case UserRole.STUDENT:
        registeredUser = await this.registerStudent(
          {
            email: findUser.email,
            password: findUser.password,
            fullName,
          },
          userId,
        );
        break;
      case UserRole.CHAIR:
        registeredUser = await this.registerChair(
          {
            email: findUser.email,
            password: findUser.password,
            fullName,
            department,
          },
          userId,
        );
        break;
      case UserRole.SYSTEM_ADMINISTRATOR:
        registeredUser = await this.registerAdministrator(
          {
            email: findUser.email,
            password: findUser.password,
            fullName,
          },
          userId,
        );
        break;
    }

    delete registeredUser.password;

    return registeredUser;
  }
}

export default AuthService;
