import { prisma } from "@utils/db";

class ChairService {
  static instance: ChairService;
  public static getInstance(): ChairService {
    if (!ChairService.instance) {
      ChairService.instance = new ChairService();
    }
    return ChairService.instance;
  }

  private chairs = prisma.chair;

  public async getAllChairs() {
    const chairs = await this.chairs.findMany({
      include: { user: true },
    });

    return chairs.map(chair => {
      delete chair.user.password;
      return chair;
    });
  }

  public async getChairByUserId(userId: string) {
    const chair = await this.chairs.findFirst({ where: { userId } });

    return chair;
  }
}

export default ChairService;
