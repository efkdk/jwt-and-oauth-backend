import type { Request, Response } from "express";
import authService from "../services/auth-service";
import { validationResult } from "express-validator";
import { getGoogleOauthToken, getGoogleUser } from "../services/google-service";
import { createAndSaveTokens, createUser, sendCookies } from "../helpers";
import User from "../models/user";

class AuthController {
  async signup(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }
      const { username, email, password } = req.body;
      const userData = await authService.signup(username, email, password);
      sendCookies(res, "refreshToken", userData.refreshToken);
      res.status(201).json(userData);
    } catch (e) {
      res.status(400).json(e.message);
    }
  }

  async verify(req: Request, res: Response) {
    try {
      const { verificationCode } = req.params;
      await authService.verify(verificationCode);
      res.redirect(process.env.CLIENT_URL);
    } catch (e) {
      res.status(400).json(e.message);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { login, password }: { login: string; password: string } = req.body;
      const userData = await authService.login(login, password);
      sendCookies(res, "refreshToken", userData.refreshToken);
      res.status(200).json(userData);
    } catch (e) {
      res.status(400).json(e.message);
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const { refreshToken } = req.cookies;
      const response = await authService.logout(refreshToken);
      res.clearCookie("refreshToken");
      res.status(200).json(response); // make no response to client
    } catch (e) {
      res.status(400).json(e.message);
    }
  }

  async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await authService.refresh(refreshToken);
      sendCookies(res, "refreshToken", userData.refreshToken);
      res.status(200).json(userData);
    } catch (e) {
      res.status(400).json(e.message);
    }
  }

  async googleOAuthHandler(req: Request, res: Response) {
    try {
      // Get the code from the query
      const code = req.query.code as string;
      const pathUrl = (req.query.state as string) || "/";

      if (!code) {
        res
          .status(401)
          .json({ message: "Authorization code was not provided" });
        return;
      }

      // Use the code to get access token (also can get id token)
      const { access_token } = await getGoogleOauthToken({ code });

      // Use the token to get the User
      const { sub, name, email_verified, email } = await getGoogleUser(
        access_token
      );

      if (!email_verified) {
        res.status(403).json({ message: "Google account not verified!" });
        return;
      }

      // Update user if user already exist or create new user
      let user = await User.findOneAndUpdate(
        { email },
        {
          googleId: sub,
          username: name,
          email,
          provider: "google",
          isVerified: email_verified,
          verificationCode: null,
        }
      );

      if (!user) {
        user = await createUser({
          username: name,
          email,
          googleId: sub,
          provider: "google",
          isVerified: email_verified,
        });
      }

      // Create access and refresh token
      const userData = await createAndSaveTokens(
        user.username,
        user.email,
        user._id,
        user.isVerified
      );

      sendCookies(res, "refreshToken", userData.refreshToken);
      res.redirect(`${process.env.CLIENT_URL}${pathUrl}`);
    } catch (error) {
      console.log("Failed to authorize Google User", error);
      res.redirect(`${process.env.CLIENT_URL}/oauth/error`);
    }
  }
}

const authController = new AuthController();

export default authController;
