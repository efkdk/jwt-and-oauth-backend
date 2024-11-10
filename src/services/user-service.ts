import User from "../models/user";
import bcrypt from "bcrypt";
import { createAndSaveTokens } from "../helpers/index";
import tokenService from "./token-service";

class UserService {
  async registration(username: string, email: string, password: string) {
    const candidate = await User.findOne({ username, email });
    if (candidate) {
      throw new Error(`User ${username} ${email} already exists!`);
    }
    const hashedPassword = await bcrypt.hash(password, 3);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const response = await createAndSaveTokens(
      user.username,
      user.email,
      user._id
    );
    return response;
  }

  async login(
    username: string | undefined,
    email: string | undefined,
    password: string
  ) {
    const candidate = username
      ? await User.findOne({ username })
      : await User.findOne({ email });

    if (!candidate) {
      throw new Error("User not found");
    }

    const isPasswordsEquals = await bcrypt.compare(
      password,
      candidate.password
    );
    if (!isPasswordsEquals) {
      throw new Error("Wrong password!");
    }
    const response = await createAndSaveTokens(
      candidate.username,
      candidate.email,
      candidate._id
    );
    return response;
  }

  async logout(refreshToken: string) {
    const token = await tokenService.findToken(refreshToken);
    if (!token) {
      throw new Error("User not found");
    }
    const response = await tokenService.removeToken(refreshToken);
    return response;
  }

  async refresh(refreshToken: string | undefined) {
    if (!refreshToken) {
      throw new Error("User is not authorized");
    }

    const userData = await tokenService.validateRefreshToken(refreshToken);
    const tokenFromDB = await tokenService.findToken(refreshToken);

    if (!userData || !tokenFromDB) {
      throw new Error("User is not authorized");
    }

    if (typeof userData === "object" && userData !== null) {
      const user = await User.findById(userData.id);
      const response = await createAndSaveTokens(
        user.username,
        user.email,
        user._id
      );
      return response;
    } else {
      throw new Error("Invalid user data");
    }
  }
}

const userService = new UserService();

export default userService;
