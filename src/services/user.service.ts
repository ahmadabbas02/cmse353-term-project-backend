import { User } from "@prisma/client";
import { CreateUserDto } from "@dtos/users.dto";
import { HttpException } from "@exceptions/HttpException";
import { excludeFromUser, excludeFromUsers, isEmpty } from "@utils/util";
import { prisma } from "@/utils/db";

class UserService {
  static instance: UserService;
  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  private users = prisma.user;

  public async findAllUser(): Promise<User[]> {
    const allUser = await this.users.findMany({
      include: {
        student: true,
        parent: true,
        teacher: true,
        chair: true,
      },
    });

    return excludeFromUsers(allUser, "password");
  }

  public async findUserById(userId: string): Promise<User> {
    if (isEmpty(userId)) throw new HttpException(400, "UserId is empty");

    const findUser: User = await this.users.findUnique({
      where: { id: userId },
      include: {
        student: true,
        parent: true,
        teacher: true,
        chair: true,
      },
    });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return excludeFromUser(findUser, "password");
  }

  public async findUserByEmail(email: string): Promise<User> {
    if (isEmpty(email)) throw new HttpException(400, "email is empty");

    const findUser: User = await this.users.findUnique({
      where: { email },
      include: {
        student: true,
        parent: true,
        teacher: true,
        chair: true,
      },
    });

    return excludeFromUser(findUser, "password");
  }

  public async updateUser(userId: string, userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "userData is empty");

    const findUser: User = await this.users.findUnique({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const updateUserData = await this.users.update({
      where: { id: userId },
      data: { ...userData },
    });
    return excludeFromUser(updateUserData, "password");
  }

  public async deleteUser(userId: string): Promise<User> {
    if (isEmpty(userId)) throw new HttpException(400, "User doesn't existId");

    const findUser: User = await this.users.findUnique({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const deleteUserData = await this.users.delete({ where: { id: userId } });
    return excludeFromUser(deleteUserData, "password");
  }
}

export default UserService;
