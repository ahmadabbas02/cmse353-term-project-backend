import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { SECRET_KEY } from "@config";
import { HttpException } from "@exceptions/HttpException";
import { RequestWithSessionData } from "@/interfaces/auth.interface";
// import { RequestWithSession } from "@interfaces/auth.interface";

const authMiddleware = async (req: RequestWithSessionData, res: Response, next: NextFunction) => {
  try {
    if (req.sessionID) {
      const prisma = new PrismaClient();
      const sessions = prisma.session;

      const sessionId = req.sessionID;
      const findSession = await sessions.findUnique({ where: { id: sessionId } });

      if (findSession) {
        const { userId } = JSON.parse(findSession.data);
        if (req.session.userId === userId) {
          next();
        } else {
          next(new HttpException(401, "Session has been tampered with!"));
        }
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
