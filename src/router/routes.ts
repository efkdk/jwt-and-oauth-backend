import { Router } from "express";
import { body } from "express-validator";
import privateController from "../controllers/private-controller";
import authController from "../controllers/auth-controller";
import authMiddleware from "../middlewares/auth-middleware";

const router = Router();

router.post(
  "/signup",
  body("email").isEmail(),
  body("password").isLength({ min: 4, max: 32 }),
  authController.signup
);

router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/verify/:verificationCode", authController.verify);
router.get("/refresh", authController.refresh);

router.get("/sessions/oauth/google", authController.googleOAuthHandler);

router.get("/privateData", authMiddleware, privateController.getPrivateData);

export default router;
