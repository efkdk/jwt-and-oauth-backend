import userController from "../controllers/user-controller";
import { Router } from "express";
import { body } from "express-validator";

const router = Router();

router.post(
  "/registration",
  body("email").isEmail(),
  body("password").isLength({ min: 4, max: 32 }),
  userController.registration
);

export default router;
