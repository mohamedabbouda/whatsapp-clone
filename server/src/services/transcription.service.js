import fs from "fs";
import OpenAI from "openai";

import { env, isProduction } from "../config/env.js";

const openai = env.openaiApiKey
  ? new OpenAI({
      apiKey: env.openaiApiKey,
    })
  : null;

const DEMO_TRANSCRIPT =
  "hotel booking test voice note demo transcript for searchable audio messages";

export const transcribeAudioFile = async (filePath) => {
  if (!openai) {
    return isProduction ? "" : DEMO_TRANSCRIPT;
  }

  try {
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: env.openaiTranscriptionModel,
      response_format: "text",
    });

    if (typeof transcription === "string") {
      return transcription.trim();
    }

    return transcription?.text?.trim() || "";
  } catch (error) {
    return isProduction ? "" : DEMO_TRANSCRIPT;
  }
};
