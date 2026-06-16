import multer from "multer";
import { mkdirSync } from "fs";
import { extname } from "path";
import { randomUUID } from "crypto";

import { ApiError } from "../utils/api-error.js";

const TEMP_UPLOAD_DIR = "uploads/temp";

const IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const AUDIO_MIME_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/webm",
  "audio/ogg",
  "audio/mp4",
  "audio/x-m4a",
];

const createUploadMiddleware = ({
  allowedMimeTypes,
  maxSizeBytes,
  errorMessage,
}) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      mkdirSync(TEMP_UPLOAD_DIR, { recursive: true });
      cb(null, TEMP_UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
      const extension = extname(file.originalname || "").toLowerCase();
      cb(null, `${Date.now()}-${randomUUID()}${extension}`);
    },
  });

  return multer({
    storage,
    limits: {
      fileSize: maxSizeBytes,
    },
    fileFilter: (req, file, cb) => {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new ApiError(400, errorMessage));
      }

      cb(null, true);
    },
  });
};

export const uploadImageFile = createUploadMiddleware({
  allowedMimeTypes: IMAGE_MIME_TYPES,
  maxSizeBytes: 5 * 1024 * 1024,
  errorMessage: "Only jpeg, png, webp and gif images are allowed.",
});

export const uploadProfileImageFile = createUploadMiddleware({
  allowedMimeTypes: IMAGE_MIME_TYPES,
  maxSizeBytes: 5 * 1024 * 1024,
  errorMessage: "Only jpeg, png, webp and gif profile images are allowed.",
});

export const uploadAudioFile = createUploadMiddleware({
  allowedMimeTypes: AUDIO_MIME_TYPES,
  maxSizeBytes: 20 * 1024 * 1024,
  errorMessage: "Only common audio files are allowed.",
});
