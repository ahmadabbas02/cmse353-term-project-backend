import { Request } from "express";
import { User } from "@prisma/client";
import { Session } from "express-session";

export interface DataStoredInToken {
  id: number;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithSessionData extends Request {
  session: SessionInformation;
}

export interface SessionInformation extends Session {
  userId?: number;
}
