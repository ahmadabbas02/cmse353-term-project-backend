import { User } from "@prisma/client";
import { CreateUserDto } from "@dtos/users.dto";
import { HttpException } from "@exceptions/HttpException";
import { excludeFromUser, excludeFromUsers, isEmpty } from "@utils/util";
import { prisma } from "@/utils/db";

class UserService {
  private users = prisma.user;

  public async findAllUser(): Promise<User[]> {
    const allUser: User[] = await this.users.findMany({
      include: {
        student: true,
        parent: true,
        teacher: true,
      },
    });

    return excludeFromUsers(allUser, "password");
  }

  public async findUserById(userId: string): Promise<User> {
    if (isEmpty(userId)) throw new HttpException(400, "UserId is empty");

    const findUser: User = await this.users.findUnique({
      where: { id: userId },
    });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

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
