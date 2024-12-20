import type { IAuthResponse, IUser, IUserId } from "types/user";
import type { CookieOptions, Response } from "express";
import { Types } from "mongoose";
import bcrypt from "bcrypt";
import tokenService from "../services/token-service";
import User from "../models/user";

async function createAndSaveTokens(
  username: string,
  email: string,
  id: IUserId,
  isVerified: boolean
): Promise<IAuthResponse> {
  const userDto = {
    username,
    email,
    id,
  };

  const tokens = tokenService.generateTokens(userDto);
  const authResponse = { isVerified, ...userDto };
  await tokenService.saveToken(userDto.id, tokens.refreshToken);
  return { ...tokens, user: authResponse };
}

function isIUser(data: any): data is IUser {
  return (
    data &&
    typeof data.username === "string" &&
    typeof data.email === "string" &&
    Types.ObjectId.isValid(data.id)
  );
}

async function createUser({
  username,
  email,
  password,
  googleId,
  provider,
  verificationCode,
  isVerified = false,
}: {
  username: string;
  email: string;
  password?: string; // password not required with google oauth
  googleId?: string;
  provider: "jwt" | "google";
  verificationCode?: string;
  isVerified?: boolean;
}) {
  try {
    const candidateByUsername = await User.findOne({ username });
    const candidateByEmail = await User.findOne({ email });
    if (candidateByEmail || candidateByUsername) {
      throw new Error(
        `User ${
          candidateByUsername && candidateByEmail
            ? `${username} ${email}`
            : candidateByUsername
            ? username
            : email
        } already exists!`
      );
    }

    let hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      googleId: googleId || null,
      isVerified,
      provider,
      verificationCode: provider === "google" ? null : verificationCode,
    });

    return user;
  } catch (error) {
    throw new Error(`Failed to create new user: ${error.message}`);
  }
}

function sendCookies(
  res: Response,
  cookieName: string,
  cookieValue: unknown,
  cookieOptions?: CookieOptions
) {
  const defaultCookieOptions = {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    httpOnly: true,
  };
  cookieOptions = cookieOptions
    ? cookieOptions
    : (defaultCookieOptions as CookieOptions);
  res.cookie(cookieName, cookieValue, cookieOptions);
}

export { createAndSaveTokens, isIUser, createUser, sendCookies };
