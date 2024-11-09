import type { Request, Response, NextFunction } from "express";
import userService from "../services/user-service";
import { validationResult } from "express-validator";

class UserController {
  async registration(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }
      const { username, email, password } = req.body;
      const userData = await userService.registration(
        username,
        email,
        password
      );
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.status(201).json(userData);
    } catch (e) {
      res.status(400).json(e.message);
    }
  }
}

const userController = new UserController();

export default userController;
