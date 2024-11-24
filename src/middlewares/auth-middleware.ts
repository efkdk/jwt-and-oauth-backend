import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "types/user";
import tokenService from "../services/token-service";

export default async function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authorizationHeader = req.get("authorization");

    if (!authorizationHeader) {
      throw new Error("User is not authorized");
    }

    const accessToken = authorizationHeader.split(" ")[1];

    if (!accessToken) {
      throw new Error("User is not authorized");
    }

    const userData = await tokenService.validateAccessToken(accessToken);
    req.user = userData;

    next();
  } catch (e) {
    res.status(401).json(e.message);
  }
}
