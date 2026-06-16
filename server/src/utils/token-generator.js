import crypto from "crypto";

const IV_LENGTH = 16;

const makeRandomIv = () => crypto.randomBytes(IV_LENGTH);

const getAlgorithm = (keyBase64) => {
  const key = Buffer.from(keyBase64);

  switch (key.length) {
    case 16:
      return "aes-128-cbc";
    case 24:
      return "aes-192-cbc";
    case 32:
      return "aes-256-cbc";
    default:
      throw new Error("Invalid key length");
  }
};

const aesEncrypt = (plainText, key) => {
  const iv = makeRandomIv();
  const cipher = crypto.createCipheriv(getAlgorithm(key), key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plainText, "utf8"),
    cipher.final(),
  ]);

  return Buffer.concat([iv, encrypted]).toString("base64");
};

export const generateToken04 = (
  appId,
  userId,
  secret,
  effectiveTimeInSeconds,
  payload
) => {
  const createTime = Math.floor(Date.now() / 1000);
  const tokenInfo = {
    app_id: appId,
    user_id: userId,
    nonce: Math.floor(Math.random() * 2147483647),
    ctime: createTime,
    expire: createTime + effectiveTimeInSeconds,
    payload,
  };

  const plaintText = JSON.stringify(tokenInfo);
  const encrypted = aesEncrypt(plaintText, secret);

  return `04${Buffer.from(encrypted).toString("base64")}`;
};
