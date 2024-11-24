import type { Request, Response } from "express";
import userService from "../services/user-service";
import { validationResult } from "express-validator";
import { AuthenticatedRequest } from "types/user";

class UserController {
  async signup(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }
      const { username, email, password } = req.body;
      const userData = await userService.signup(username, email, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.status(201).json(userData);
    } catch (e) {
      res.status(400).json(e.message);
    }
  }

  async verify(req: Request, res: Response) {
    try {
      const { verificationCode } = req.params;
      await userService.verify(verificationCode);
      res.redirect(process.env.CLIENT_URL);
    } catch (e) {
      res.status(400).json(e.message);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { login, password }: { login: string; password: string } = req.body;
      const userData = await userService.login(login, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.status(200).json(userData);
    } catch (e) {
      res.status(400).json(e.message);
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const { refreshToken } = req.cookies;
      const response = await userService.logout(refreshToken);
      res.clearCookie("refreshToken");
      res.status(200).json(response); // make no response to client
    } catch (e) {
      res.status(400).json(e.message);
    }
  }

  async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);
      res.cookie("refreshToken", userData.refreshToken as string, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.status(200).json(userData);
    } catch (e) {
      res.status(400).json(e.message);
    }
  }
}

const userController = new UserController();

export default userController;
