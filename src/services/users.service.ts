import { PrismaClient, User } from "@prisma/client";
import { CreateUserDto } from "@dtos/users.dto";
import { HttpException } from "@exceptions/HttpException";
import { decrypt, encrypt, excludeFromUser, excludeFromUsers, isEmpty } from "@utils/util";
import { fieldEncryptionMiddleware } from "@mindgrep/prisma-deterministic-search-field-encryption";

class UserService {
  private prisma = new PrismaClient();

  public users = this.prisma.user;

  constructor() {
    this.prisma.$use(
      fieldEncryptionMiddleware({
        encryptFn: (decrypted: string) => encrypt(decrypted),
        decryptFn: (encrypted: string) => decrypt(encrypted),
      }),
    );
  }

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

  public async findUserById(userId: number): Promise<User> {
    if (isEmpty(userId)) throw new HttpException(400, "UserId is empty");

    const findUser: User = await this.users.findUnique({
      where: { id: userId },
    });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return excludeFromUser(findUser, "password");
  }

  public async updateUser(userId: number, userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "userData is empty");

    const findUser: User = await this.users.findUnique({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const updateUserData = await this.users.update({
      where: { id: userId },
      data: { ...userData },
    });
    return excludeFromUser(updateUserData, "password");
  }

  public async deleteUser(userId: number): Promise<User> {
    if (isEmpty(userId)) throw new HttpException(400, "User doesn't existId");

    const findUser: User = await this.users.findUnique({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const deleteUserData = await this.users.delete({ where: { id: userId } });
    return excludeFromUser(deleteUserData, "password");
  }
}

export default UserService;
