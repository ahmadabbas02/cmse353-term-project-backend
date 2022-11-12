import { NextFunction, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { SECRET_KEY } from "@config";
import { HttpException } from "@exceptions/HttpException";
import { RequestWithSession } from "@interfaces/auth.interface";

const authMiddleware = async (req: RequestWithSession, res: Response, next: NextFunction) => {
  try {
    if (req.session.user) {
      const secretKey: string = SECRET_KEY;
      const userId = req.session.user.id;

      const users = new PrismaClient().user;
      const findUser = await users.findUnique({ where: { id: Number(userId) } });

      if (findUser) {
        req.session.user = findUser;
        next();
      } else {
        next(new HttpException(401, "Wrong authentication token"));
      }
    } else {
      next(new HttpException(404, "Authentication token missing"));
    }
  } catch (error) {
    next(new HttpException(401, "Wrong authentication token"));
  }
};

export default authMiddleware;
