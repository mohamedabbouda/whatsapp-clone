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
import { validateRequest } from "../../middlewares/validate-request.js";
import {
  addMessageValidation,
  conversationParamsValidation,
  deleteMessageValidation,
  initialContactsValidation,
  searchMessagesValidation,
  uploadMessageValidation,
} from "./message.validation.js";

const router = Router();

router.post("/add-message", validateRequest(addMessageValidation), addMessage);
router.get("/search", validateRequest(searchMessagesValidation), searchMessages);
router.get(
  "/get-messages/:from/:to",
  validateRequest(conversationParamsValidation),
  getMessages
);
router.get(
  "/get-initial-contacts/:from",
  validateRequest(initialContactsValidation),
  getInitialContactsWithMessages
);
router.delete(
  "/delete-message/:messageId",
  validateRequest(deleteMessageValidation),
  deleteMessage
);

router.post(
  "/add-audio-message",
  uploadRateLimiter,
  validateRequest(uploadMessageValidation),
  uploadAudioFile.single("audio"),
  addAudioMessage
);

router.post(
  "/add-image-message",
  uploadRateLimiter,
  validateRequest(uploadMessageValidation),
  uploadImageFile.single("image"),
  addImageMessage
);

export default router;
