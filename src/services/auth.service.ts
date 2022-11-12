import { PrismaClient, Teacher, User } from "@prisma/client";
import { CreateTeacherDto, CreateUserDto } from "@dtos/users.dto";
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

  public async signup(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "userData is empty");

    const findUser: User = await this.users.findUnique({ where: { email: userData.email } });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const createdUserData: Promise<User> = this.users.create({
      data: {
        ...userData,
      },
    });

    return createdUserData;
  }

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

  public async login(userData: CreateUserDto): Promise<{ findUser: User }> {
    if (isEmpty(userData)) throw new HttpException(400, "userData is empty");

    const findUser: User = await this.users.findUnique({ where: { email: userData.email } });
    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

    const isPasswordMatching = userData.password === findUser.password;
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
