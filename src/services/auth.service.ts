import { PrismaClient, Teacher, User } from "@prisma/client";
import { CreateTeacherDto, LoginUserDto } from "@dtos/users.dto";
import { HttpException } from "@exceptions/HttpException";
import { isEmpty, encrypt, decrypt } from "@utils/util";
import { fieldEncryptionMiddleware } from "@mindgrep/prisma-deterministic-search-field-encryption";

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
  public teachers = this.prisma.teacher;

  public async signUpTeacher(teacherData: CreateTeacherDto): Promise<Teacher> {
    if (isEmpty(teacherData)) throw new HttpException(400, "userData is empty");

    const findUser: User = await this.users.findUnique({ where: { email: teacherData.email } });
    if (findUser) throw new HttpException(409, `This email ${teacherData.email} already exists`);

    const { email, password, fullName } = teacherData;

    const createdUserData: Promise<User> = this.users.create({
      data: {
        email,
        password,
        role: 3,
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
