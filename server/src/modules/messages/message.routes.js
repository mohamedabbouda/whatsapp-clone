import { Router } from "express";

import {
  addAudioMessage,
  addImageMessage,
  addMessage,
  deleteMessage,
  getInitialContactsWithMessages,
  getMessages,
  searchMessages,
} from "./message.controller.js";
import {
  uploadAudioFile,
  uploadImageFile,
} from "../../middlewares/upload.middleware.js";
import { uploadRateLimiter } from "../../middlewares/security.middleware.js";

const router = Router();

router.post("/add-message", addMessage);
router.get("/search", searchMessages);
router.get("/get-messages/:from/:to", getMessages);
router.get("/get-initial-contacts/:from", getInitialContactsWithMessages);
router.delete("/delete-message/:messageId", deleteMessage);

router.post(
  "/add-audio-message",
  uploadRateLimiter,
  uploadAudioFile.single("audio"),
  addAudioMessage
);

router.post(
  "/add-image-message",
  uploadRateLimiter,
  uploadImageFile.single("image"),
  addImageMessage
);

export default router;
