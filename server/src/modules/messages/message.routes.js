import { Router } from "express";
import multer from "multer";

import {
  addAudioMessage,
  addImageMessage,
  addMessage,
  deleteMessage,
  getInitialContactsWithMessages,
  getMessages,
  searchMessages,
} from "./message.controller.js";

const uploadAudio = multer({
  dest: "uploads/recordings/",
});

const uploadImage = multer({
  dest: "uploads/images/",
});

const router = Router();

router.post("/add-message", addMessage);
router.get("/search", searchMessages);
router.get("/get-messages/:from/:to", getMessages);
router.get("/get-initial-contacts/:from", getInitialContactsWithMessages);
router.delete("/delete-message/:messageId", deleteMessage);

router.post("/add-audio-message", uploadAudio.single("audio"), addAudioMessage);
router.post("/add-image-message", uploadImage.single("image"), addImageMessage);

export default router;
