import userController from "../controllers/user-controller";
import { Router } from "express";
import { body } from "express-validator";

const router = Router();

router.post(
  "/signup",
  body("email").isEmail(),
  body("password").isLength({ min: 4, max: 32 }),
  userController.signup
);

router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/verify/:verificationCode", userController.verify);
router.get("/refresh", userController.refresh);

export default router;
