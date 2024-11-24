import type { Request, Response } from "express";
import { AuthenticatedRequest } from "types/user";

class PrivateController {
  async getPrivateData(req: AuthenticatedRequest, res: Response) {
    try {
      if (req.user) {
        res
          .status(200)
          .json("You have successfully made an authenticated request!");
      } else {
        res.status(401).json("User is not authorized");
      }
    } catch (error) {
      res.status(400).json(error.message);
    }
  }
}

const privateController = new PrivateController();

export default privateController;
