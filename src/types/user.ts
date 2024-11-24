import type { Request } from "express";
import { Types } from "mongoose";

export type IUserId = Types.ObjectId;

export interface IUser {
  username: string;
  email: string;
  id: IUserId;
  isVerified: boolean;
}

export type IUserDto = Omit<IUser, "isVerified">;

export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}
