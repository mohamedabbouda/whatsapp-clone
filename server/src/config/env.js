import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 3005),
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  zegoAppId: process.env.ZEGO_APP_ID,
  zegoAppSecret: process.env.ZEGO_APP_SECRET,
  openaiApiKey: process.env.OPENAI_API_KEY,
  openaiTranscriptionModel:
    process.env.OPENAI_TRANSCRIPTION_MODEL || "gpt-4o-mini-transcribe",
};

export const isProduction = env.nodeEnv === "production";
