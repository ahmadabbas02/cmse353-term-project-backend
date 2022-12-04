import { Request } from "express";
import { Session } from "express-session";
import { User } from "@prisma/client";

export interface RequestWithSessionData extends Request {
  session: SessionInformation;
}

export interface SessionInformation extends Session {
  user?: User;
}
