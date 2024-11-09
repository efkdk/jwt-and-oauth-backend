import User from "../models/user";
import bcrypt from "bcrypt";
import { createAndSaveTokens } from "../helpers/index";

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
    email: string | undefined,
    username: string | undefined,
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
    return;
  }
}

const userService = new UserService();

export default userService;