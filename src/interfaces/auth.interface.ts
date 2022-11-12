import { Request } from "express";
import { User } from "@prisma/client";

export interface DataStoredInToken {
  id: number;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithSession extends Request {
  session: SessionData;
}

interface SessionData {
  user: User;
}
