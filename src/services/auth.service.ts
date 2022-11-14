import { Parent, PrismaClient, Student, Teacher, User } from "@prisma/client";
import { CreateUserDto, LoginUserDto } from "@dtos/users.dto";
import { HttpException } from "@exceptions/HttpException";
import { isEmpty, encrypt, decrypt } from "@utils/util";
import { fieldEncryptionMiddleware } from "@mindgrep/prisma-deterministic-search-field-encryption";
import { UserRole } from "@/utils/consts";

class AuthService {
  prisma = new PrismaClient();

  constructor() {
    this.prisma.$use(
      fieldEncryptionMiddleware({
        encryptFn: (decrypted: string) => encrypt(decrypted),
        decryptFn: (encrypted: string) => decrypt(encrypted),
      }),
    );
  }

  public users = this.prisma.user;
  public students = this.prisma.student;
  public parents = this.prisma.parent;
  public teachers = this.prisma.teacher;

  public async registerStudent(studentData: CreateUserDto): Promise<Student> {
    if (isEmpty(studentData)) throw new HttpException(400, "studentData is empty");

    const findUser: User = await this.users.findUnique({ where: { email: studentData.email } });
    if (findUser) throw new HttpException(409, `This email ${studentData.email} already exists`);

    const { email, password, fullName } = studentData;

    const createdUserData: Promise<User> = this.users.create({
      data: {
        email,
        password,
        role: UserRole.STUDENT,
      },
    });

    const createdStudentData: Promise<Student> = this.students.create({
      data: {
        fullName: fullName,
        userId: (await createdUserData).id,
      },
    });

    return createdStudentData;
  }

  public async registerParent(parentData: CreateUserDto): Promise<Teacher> {
    if (isEmpty(parentData)) throw new HttpException(400, "parentData is empty");

    const findUser: User = await this.users.findUnique({ where: { email: parentData.email } });
    if (findUser) throw new HttpException(409, `This email ${parentData.email} already exists`);

    const { email, password, fullName } = parentData;

    const createdUserData: Promise<User> = this.users.create({
      data: {
        email,
        password,
        role: UserRole.PARENT,
      },
    });

    const createdParentData: Promise<Parent> = this.parents.create({
      data: {
        fullName: fullName,
        userId: (await createdUserData).id,
      },
    });

    return createdParentData;
  }

  public async registerTeacher(teacherData: CreateUserDto): Promise<Teacher> {
    if (isEmpty(teacherData)) throw new HttpException(400, "teacherData is empty");

    const findUser: User = await this.users.findUnique({ where: { email: teacherData.email } });
    if (findUser) throw new HttpException(409, `This email ${teacherData.email} already exists`);

    const { email, password, fullName } = teacherData;

    const createdUserData: Promise<User> = this.users.create({
      data: {
        email,
        password,
        role: UserRole.TEACHER,
      },
    });

    const createdTeacherData: Promise<Teacher> = this.teachers.create({
      data: {
        fullName: fullName,
        userId: (await createdUserData).id,
      },
    });

    return createdTeacherData;
  }

  public async registerChair(chairData: CreateUserDto): Promise<User> {
    if (isEmpty(chairData)) throw new HttpException(400, "chairData is empty");

    const findUser: User = await this.users.findUnique({ where: { email: chairData.email } });
    if (findUser) throw new HttpException(409, `This email ${chairData.email} already exists`);

    const { email, password } = chairData;

    const createdUserData: Promise<User> = this.users.create({
      data: {
        email,
        password,
        role: UserRole.CHAIR,
      },
    });

    return createdUserData;
  }

  public async registerAdministrator(administratorData: CreateUserDto): Promise<User> {
    if (isEmpty(administratorData)) throw new HttpException(400, "administratorData is empty");

    const findUser: User = await this.users.findUnique({ where: { email: administratorData.email } });
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

  public async login(loginData: LoginUserDto): Promise<{ findUser: User }> {
    if (isEmpty(loginData)) throw new HttpException(400, "loginData is empty");

    const findUser: User = await this.users.findUnique({ where: { email: loginData.email } });
    if (!findUser) throw new HttpException(409, `This email ${loginData.email} was not found`);

    const isPasswordMatching = loginData.password === findUser.password;
    if (!isPasswordMatching) throw new HttpException(409, "Password is not matching");

    return { findUser };
  }

  public async logout(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "userData is empty");

    const findUser: User = await this.users.findFirst({ where: { email: userData.email, password: userData.password } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }
}

export default AuthService;
