import jwt from "jsonwebtoken";
import Token from "../models/token";
import type { IUser, IUserId } from "types/user";
import { isIUser } from "../helpers/index";

class TokenService {
  generateTokens(payload: IUser) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "30m",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "30d",
    });
    return { accessToken, refreshToken };
  }

  async saveToken(userId: IUserId, refreshToken: string) {
    const tokenData = await Token.findOne({ userId: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = await Token.create({ userId, refreshToken });
    return token;
  }

  async removeToken(refreshToken: string) {
    const response = await Token.deleteOne({ refreshToken });
    return response;
  }

  async validateAccessToken(accessToken: string) {
    try {
      const userData = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
      return isIUser(userData) ? userData : null;
    } catch (e) {
      console.log("Access token verification failed:", e);
      return null;
    }
  }

  async validateRefreshToken(refreshToken: string) {
    try {
      const userData = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      return isIUser(userData) ? userData : null;
    } catch (e) {
      console.log("Refresh token verification failed:", e);
      return null;
    }
  }

  async findToken(refreshToken: string) {
    const tokenData = await Token.findOne({ refreshToken });
    return tokenData;
  }
}

const tokenService = new TokenService();

export default tokenService;
