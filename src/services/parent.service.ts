import { HttpException } from "@/exceptions/HttpException";
import { prisma } from "@/utils/db";

class ParentService {
  static instance: ParentService;
  public static getInstance(): ParentService {
    if (!ParentService.instance) {
      ParentService.instance = new ParentService();
    }
    return ParentService.instance;
  }

  private parents = prisma.parent;

  public async getAllParents() {
    const parents = await this.parents.findMany({
      include: {
        children: true,
        user: true,
      },
    });

    return parents.map(parent => {
      delete parent.user.password;
      return parent;
    });
  }

  public async getParentFromUserId(userId: string) {
    const parent = await this.parents.findFirst({ where: { userId } });
    if (!parent) throw new HttpException(403, `Failed to find parent linked with user id: ${userId}`);

    return parent;
  }
}

export default ParentService;
