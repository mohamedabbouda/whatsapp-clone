import { Router } from "express";

import {
  checkUser,
  generateToken,
  getAllUsers,
  onBoardUser,
  updateProfileImage,
  uploadProfileImage,
} from "./auth.controller.js";
import { uploadProfileImageFile } from "../../middlewares/upload.middleware.js";
import {
  authRateLimiter,
  uploadRateLimiter,
} from "../../middlewares/security.middleware.js";

const router = Router();

router.post("/check-user", authRateLimiter, checkUser);
router.post("/onBoardUser", authRateLimiter, onBoardUser);
router.post("/onboarduser", authRateLimiter, onBoardUser);

router.post(
  "/upload-profile-image",
  uploadRateLimiter,
  uploadProfileImageFile.single("image"),
  uploadProfileImage
);

router.patch("/update-profile-image/:userId", updateProfileImage);
router.get("/get-contacts", getAllUsers);
router.get("/generate-token/:userId", generateToken);

export default router;
