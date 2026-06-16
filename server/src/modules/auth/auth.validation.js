import {
  composeValidators,
  requiredPositiveInteger,
  requiredString,
} from "../../utils/validators.js";

export const checkUserValidation = {
  body: composeValidators(requiredString("email")),
};

export const onboardUserValidation = {
  body: composeValidators(
    requiredString("email"),
    requiredString("name"),
    requiredString("image")
  ),
};

export const updateProfileImageValidation = {
  params: composeValidators(requiredPositiveInteger("userId")),
  body: composeValidators(requiredString("image")),
};
