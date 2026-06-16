import { renameSync } from "fs";

import {
  createUserProfile,
  findUserByEmail,
  generateCallToken,
  getUsersGroupedByInitial,
  updateUserProfileImage,
} from "./auth.service.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { ApiError } from "../../utils/api-error.js";

export const checkUser = asyncHandler(async (request, response) => {
  const { email } = request.body;

  if (!email) {
    return response.json({
      msg: "Email is required",
      status: false,
    });
  }

  const user = await findUserByEmail(email);

  if (!user) {
    return response.json({
      msg: "User not found",
      status: false,
    });
  }

  return response.json({
    msg: "User Found",
    status: true,
    data: user,
  });
});

export const onBoardUser = asyncHandler(async (request, response) => {
  const {
    email,
    name,
    about = "Available",
    image: profilePicture,
  } = request.body;

  if (!email || !name || !profilePicture) {
    return response.json({
      msg: "Email, Name and Image are required",
      status: false,
    });
  }

  const user = await createUserProfile({
    email,
    name,
    about,
    profilePicture,
  });

  return response.json({
    msg: "Success",
    status: true,
    data: user,
  });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await getUsersGroupedByInitial();

  return res.status(200).send({
    users,
  });
});

export const uploadProfileImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Profile image is required.");
  }

  const date = Date.now();
  const fileName = `uploads/profile-pictures/${date}${req.file.originalname}`;

  renameSync(req.file.path, fileName);

  return res.status(201).json({
    image: fileName,
  });
});

export const updateProfileImage = asyncHandler(async (req, res) => {
  const userId = Number.parseInt(req.params.userId, 10);
  const { image } = req.body;

  if (!userId || !image) {
    throw new ApiError(400, "Valid userId and image are required.");
  }

  const user = await updateUserProfileImage({
    userId,
    image,
  });

  return res.status(200).json({
    status: true,
    user,
  });
});

export const generateToken = asyncHandler(async (req, res) => {
  const token = generateCallToken({
    userId: req.params.userId,
  });

  return res.status(200).json({
    token,
  });
});
