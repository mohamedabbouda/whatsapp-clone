export const isPositiveInteger = (value) => {
  const parsed = Number.parseInt(value, 10);

  return Number.isInteger(parsed) && parsed > 0;
};

export const isNonEmptyString = (value) => {
  return typeof value === "string" && value.trim().length > 0;
};

export const isValidSearchType = (value) => {
  return !value || ["all", "text", "audio"].includes(value);
};

export const requiredPositiveInteger = (fieldName) => (data) => {
  if (!isPositiveInteger(data[fieldName])) {
    return [`${fieldName} must be a positive integer.`];
  }

  return [];
};

export const requiredString = (fieldName) => (data) => {
  if (!isNonEmptyString(data[fieldName])) {
    return [`${fieldName} is required.`];
  }

  return [];
};

export const optionalSearchType = (fieldName) => (data) => {
  if (!isValidSearchType(data[fieldName])) {
    return [`${fieldName} must be one of: all, text, audio.`];
  }

  return [];
};

export const composeValidators = (...validators) => (data) => {
  return validators.flatMap((validator) => validator(data));
};
