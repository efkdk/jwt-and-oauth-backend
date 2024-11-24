import User from "../models/user";
import bcrypt from "bcrypt";
import { createAndSaveTokens } from "../helpers/index";
import tokenService from "./token-service";
import mailService from "./mail-service";
import { IAuthResponse } from "types/user";

class UserService {
  async signup(
    username: string,
    email: string,
    password: string
  ): Promise<IAuthResponse> {
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
    const verificationCode = tokenService.generateVerificationToken(email);
    const verificationLink = `${process.env.API_URL}/api/verify/${verificationCode}`;

    try {
      mailService.sendActivationMail(email, verificationLink);
    } catch (e) {
      throw e;
    }

    const hashedPassword = await bcrypt.hash(password, 3);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationCode,
    });

    const response = await createAndSaveTokens(
      user.username,
      user.email,
      user._id,
      user.isVerified
    );
    return response;
  }

  async verify(verificationCode: string) {
    const user = await User.findOne({ verificationCode });
    if (!user) {
      throw new Error(`User not found`);
    }
    user.isVerified = true;
    user.verificationCode = undefined;
    const { _id, username, email } = await user.save();
    return { _id, username, email };
  }

  async login(login: string, password: string) {
    let candidate =
      (await User.findOne({ username: login })) ||
      (await User.findOne({ email: login }));

    if (!candidate) {
      throw new Error(`User ${login} not found`);
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
      candidate._id,
      candidate.isVerified
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

    const user = await User.findById(userData.id);
    const response = await createAndSaveTokens(
      user.username,
      user.email,
      user._id,
      user.isVerified
    );
    return response;
  }
}

const userService = new UserService();

export default userService;
