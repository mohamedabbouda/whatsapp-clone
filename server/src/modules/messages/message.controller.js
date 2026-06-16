import { asyncHandler } from "../../utils/async-handler.js";
import { ApiError } from "../../utils/api-error.js";
import { parseUserId } from "../../utils/parse-user-id.js";
import {
  createAudioMessage,
  createImageMessage,
  createTextMessage,
  getConversationMessages,
  getInitialContacts,
  removeMessage,
  searchConversationMessages,
} from "./message.service.js";

export const getMessages = asyncHandler(async (req, res) => {
  const from = parseUserId(req.params.from);
  const to = parseUserId(req.params.to);

  if (!from || !to) {
    throw new ApiError(400, "Valid from and to user ids are required.");
  }

  const messages = await getConversationMessages({
    from,
    to,
  });

  return res.status(200).json({
    messages,
  });
});

export const addMessage = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const from = parseUserId(req.body.from);
  const to = parseUserId(req.body.to);

  if (!message || !from || !to) {
    throw new ApiError(400, "Valid from, to and message are required.");
  }

  const newMessage = await createTextMessage({
    from,
    to,
    message,
  });

  return res.status(201).send({
    message: newMessage,
  });
});

export const getInitialContactsWithMessages = asyncHandler(async (req, res) => {
  const userId = parseUserId(req.params.from);

  if (!userId) {
    throw new ApiError(400, "Valid user id is required.");
  }

  const data = await getInitialContacts({
    userId,
  });

  return res.status(200).json(data);
});

export const addAudioMessage = asyncHandler(async (req, res) => {
  const from = parseUserId(req.query.from);
  const to = parseUserId(req.query.to);

  if (!from || !to) {
    throw new ApiError(400, "Valid from and to user ids are required.");
  }

  const message = await createAudioMessage({
    file: req.file,
    from,
    to,
  });

  return res.status(201).json({
    message,
  });
});

export const addImageMessage = asyncHandler(async (req, res) => {
  const from = parseUserId(req.query.from);
  const to = parseUserId(req.query.to);

  if (!from || !to) {
    throw new ApiError(400, "Valid from and to user ids are required.");
  }

  const message = await createImageMessage({
    file: req.file,
    from,
    to,
  });

  return res.status(201).json({
    message,
  });
});

export const deleteMessage = asyncHandler(async (req, res) => {
  const messageId = Number.parseInt(req.params.messageId, 10);
  const userId = parseUserId(req.query.userId);

  if (!messageId || !userId) {
    throw new ApiError(400, "Valid messageId and userId are required.");
  }

  const deletedMessageId = await removeMessage({
    messageId,
    userId,
  });

  return res.status(200).json({
    messageId: deletedMessageId,
  });
});

export const searchMessages = asyncHandler(async (req, res) => {
  const userId = parseUserId(req.query.userId);
  const contactId = parseUserId(req.query.contactId);
  const query = req.query.query?.trim();
  const type = req.query.type || "all";

  if (!userId || !contactId || !query) {
    throw new ApiError(400, "userId, contactId and query are required.");
  }

  const messages = await searchConversationMessages({
    userId,
    contactId,
    query,
    type,
  });

  return res.status(200).json({
    messages,
  });
});
