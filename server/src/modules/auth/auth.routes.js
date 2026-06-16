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
import { validateRequest } from "../../middlewares/validate-request.js";
import {
  checkUserValidation,
  onboardUserValidation,
  updateProfileImageValidation,
} from "./auth.validation.js";

const router = Router();

router.post(
  "/check-user",
  authRateLimiter,
  validateRequest(checkUserValidation),
  checkUser
);

router.post(
  "/onBoardUser",
  authRateLimiter,
  validateRequest(onboardUserValidation),
  onBoardUser
);

router.post(
  "/onboarduser",
  authRateLimiter,
  validateRequest(onboardUserValidation),
  onBoardUser
);

router.post(
  "/upload-profile-image",
  uploadRateLimiter,
  uploadProfileImageFile.single("image"),
  uploadProfileImage
);

router.patch(
  "/update-profile-image/:userId",
  validateRequest(updateProfileImageValidation),
  updateProfileImage
);

router.get("/get-contacts", getAllUsers);
router.get("/generate-token/:userId", generateToken);

export default router;
