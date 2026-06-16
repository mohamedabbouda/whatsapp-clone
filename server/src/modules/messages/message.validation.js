import {
  composeValidators,
  optionalSearchType,
  requiredPositiveInteger,
  requiredString,
} from "../../utils/validators.js";

export const conversationParamsValidation = {
  params: composeValidators(
    requiredPositiveInteger("from"),
    requiredPositiveInteger("to")
  ),
};

export const initialContactsValidation = {
  params: composeValidators(requiredPositiveInteger("from")),
};

export const addMessageValidation = {
  body: composeValidators(
    requiredPositiveInteger("from"),
    requiredPositiveInteger("to"),
    requiredString("message")
  ),
};

export const uploadMessageValidation = {
  query: composeValidators(
    requiredPositiveInteger("from"),
    requiredPositiveInteger("to")
  ),
};

export const deleteMessageValidation = {
  params: composeValidators(requiredPositiveInteger("messageId")),
  query: composeValidators(requiredPositiveInteger("userId")),
};

export const searchMessagesValidation = {
  query: composeValidators(
    requiredPositiveInteger("userId"),
    requiredPositiveInteger("contactId"),
    requiredString("query"),
    optionalSearchType("type")
  ),
};
