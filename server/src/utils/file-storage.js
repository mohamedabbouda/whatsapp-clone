import { mkdirSync, renameSync } from "fs";
import { extname } from "path";
import { randomUUID } from "crypto";

export const moveUploadedFile = (file, targetDirectory) => {
  mkdirSync(targetDirectory, { recursive: true });

  const extension = extname(file.originalname || file.filename || "").toLowerCase();
  const fileName = `${Date.now()}-${randomUUID()}${extension}`;
  const finalPath = `${targetDirectory}/${fileName}`;

  renameSync(file.path, finalPath);

  return finalPath;
};
