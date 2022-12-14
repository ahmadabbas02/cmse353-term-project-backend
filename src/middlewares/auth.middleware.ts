import { NextFunction, Response } from "express";
import { HttpException } from "@exceptions/HttpException";
import { RequestWithSessionData } from "@/interfaces/auth.interface";
import { excludeFromUser } from "@/utils/util";
import { prisma } from "@/utils/db";

export const isLoggedIn = async (req: RequestWithSessionData, res: Response, next: NextFunction) => {
  try {
    if (!req.session) {
      next(new HttpException(404, "Failed to find session in request"));
      return;
    }

    const sessions = prisma.session;
    const users = prisma.user;

    const sessionId = req.sessionID;
    const findSession = await sessions.findUnique({ where: { id: sessionId } });

    if (!findSession) {
      next(new HttpException(401, "Failed to find session"));
      return;
    }

    const { user } = JSON.parse(findSession.data);
    if (req.session.user.id === user.id) {
      const findUser = await users.findUnique({ where: { id: req.session.user.id } });

      if (!findUser) {
        next(new HttpException(401, "User has been tampered!"));
        return;
      }

      req.session.user = excludeFromUser(findUser, "password");
      next();
    } else {
      next(new HttpException(401, "Session has been tampered!"));
    }
  } catch (error) {
    console.log(error);
    next(new HttpException(401, error));
  }
};

export const isSpecificRole = (role: String) => {
  return async (req: RequestWithSessionData, res: Response, next: NextFunction) => {
    try {
      const sessionRole = req.session.user.role;
      if (sessionRole) {
        if (sessionRole === role) {
          next();
        } else {
          next(new HttpException(401, `Only ${role} can access this!`));
        }
      } else {
        next(new HttpException(404, "Failed to load role!"));
      }
    } catch (error) {
      next(new HttpException(401, "Wrong authentication token"));
    }
  };
};
