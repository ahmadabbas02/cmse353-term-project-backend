import { User } from "@prisma/client";
import { Request } from "express";
import { Session } from "express-session";

export interface RequestWithSessionData extends Request {
  session: SessionInformation;
}

export interface SessionInformation extends Session {
  user?: User;
}
