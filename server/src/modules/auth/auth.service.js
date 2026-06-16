import getPrismaClient from "../../services/prisma.service.js";
import { generateToken04 } from "../../utils/token-generator.js";
import { env } from "../../config/env.js";
import { ApiError } from "../../utils/api-error.js";

export const findUserByEmail = async (email) => {
  const prisma = getPrismaClient();

  return prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const createUserProfile = async ({ email, name, about, profilePicture }) => {
  const prisma = getPrismaClient();

  return prisma.user.create({
    data: {
      email,
      name,
      about,
      profilePicture,
    },
  });
};

export const getUsersGroupedByInitial = async () => {
  const prisma = getPrismaClient();

  const users = await prisma.user.findMany({
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      email: true,
      name: true,
      profilePicture: true,
      about: true,
    },
  });

  return users.reduce((groupedUsers, user) => {
    const initialLetter = user.name.charAt(0).toUpperCase();

    if (!groupedUsers[initialLetter]) {
      groupedUsers[initialLetter] = [];
    }

    groupedUsers[initialLetter].push(user);

    return groupedUsers;
  }, {});
};

export const updateUserProfileImage = async ({ userId, image }) => {
  const prisma = getPrismaClient();

  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      profilePicture: image,
    },
  });
};

export const generateCallToken = ({ userId }) => {
  const appId = Number(env.zegoAppId);
  const serverSecret = env.zegoAppSecret;
  const effectiveTimeInSeconds = 3600;
  const payload = "";

  if (!appId || !serverSecret || !userId) {
    throw new ApiError(400, "User id, app id and server secret are required.");
  }

  return generateToken04(
    appId,
    userId,
    serverSecret,
    effectiveTimeInSeconds,
    payload
  );
};
