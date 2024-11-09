import jwt from "jsonwebtoken";
import Token from "../models/token";
import type { IUser, IUserId } from "types/user";

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
    await Token.deleteOne({ refreshToken });
  }

  async validateAccessToken(accessToken: string) {
    try {
      const userData = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
      return userData;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async validateRefreshToken(refreshToken: string) {
    try {
      const userData = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      return userData;
    } catch (e) {
      console.log(e);
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
