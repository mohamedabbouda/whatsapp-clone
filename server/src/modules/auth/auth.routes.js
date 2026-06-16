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

const router = Router();

router.post("/check-user", checkUser);
router.post("/onBoardUser", onBoardUser);
router.post("/onboarduser", onBoardUser);

router.post(
  "/upload-profile-image",
  uploadProfileImageFile.single("image"),
  uploadProfileImage
);

router.patch("/update-profile-image/:userId", updateProfileImage);
router.get("/get-contacts", getAllUsers);
router.get("/generate-token/:userId", generateToken);

export default router;
