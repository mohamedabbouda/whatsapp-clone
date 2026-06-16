import getPrismaClient from "../../services/prisma.service.js";
import { transcribeAudioFile } from "../../services/transcription.service.js";
import { ApiError } from "../../utils/api-error.js";
import { moveUploadedFile } from "../../utils/file-storage.js";

const getOnlineUserSocket = (userId) => {
  return global.onlineUsers?.get(userId.toString());
};

export const getConversationMessages = async ({ from, to }) => {
  const prisma = getPrismaClient();

  const messages = await prisma.messages.findMany({
    where: {
      OR: [
        { senderId: from, recieverId: to },
        { senderId: to, recieverId: from },
      ],
    },
    orderBy: {
      id: "asc",
    },
  });

  const unreadMessageIds = messages
    .filter((message) => message.messageStatus !== "read" && message.senderId === to)
    .map((message) => message.id);

  if (unreadMessageIds.length) {
    await prisma.messages.updateMany({
      where: {
        id: {
          in: unreadMessageIds,
        },
      },
      data: {
        messageStatus: "read",
      },
    });
  }

  return messages.map((message) =>
    unreadMessageIds.includes(message.id)
      ? { ...message, messageStatus: "read" }
      : message
  );
};

export const createTextMessage = async ({ from, to, message }) => {
  const prisma = getPrismaClient();
  const receiverSocket = getOnlineUserSocket(to);

  return prisma.messages.create({
    data: {
      message,
      transcript: "",
      sender: {
        connect: {
          id: from,
        },
      },
      reciever: {
        connect: {
          id: to,
        },
      },
      messageStatus: receiverSocket ? "delivered" : "sent",
    },
    include: {
      sender: true,
      reciever: true,
    },
  });
};

export const getInitialContacts = async ({ userId }) => {
  const prisma = getPrismaClient();

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      sentMessages: {
        include: {
          reciever: true,
          sender: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      recievedMessages: {
        include: {
          reciever: true,
          sender: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const messages = [...user.sentMessages, ...user.recievedMessages].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  const users = new Map();
  const messageStatusChange = [];

  messages.forEach((msg) => {
    const isSender = msg.senderId === userId;
    const calculatedId = isSender ? msg.recieverId : msg.senderId;

    if (msg.messageStatus === "sent") {
      messageStatusChange.push(msg.id);
    }

    if (!users.get(calculatedId)) {
      const {
        id,
        type,
        message,
        transcript,
        messageStatus,
        createdAt,
        senderId,
        recieverId,
      } = msg;

      let contact = {
        messageId: id,
        type,
        message,
        transcript,
        messageStatus,
        createdAt,
        senderId,
        recieverId,
      };

      if (isSender) {
        contact = {
          ...contact,
          ...msg.reciever,
          totalUnreadMessages: 0,
        };
      } else {
        contact = {
          ...contact,
          ...msg.sender,
          totalUnreadMessages: messageStatus !== "read" ? 1 : 0,
        };
      }

      users.set(calculatedId, contact);
    } else if (msg.messageStatus !== "read" && !isSender) {
      const contact = users.get(calculatedId);
      users.set(calculatedId, {
        ...contact,
        totalUnreadMessages: contact.totalUnreadMessages + 1,
      });
    }
  });

  if (messageStatusChange.length) {
    await prisma.messages.updateMany({
      where: {
        id: {
          in: messageStatusChange,
        },
      },
      data: {
        messageStatus: "delivered",
      },
    });
  }

  return {
    users: Array.from(users.values()),
    onlineUsers: Array.from(global.onlineUsers?.keys() || []),
  };
};

export const createAudioMessage = async ({ file, from, to }) => {
  if (!file) {
    throw new ApiError(400, "Audio is required.");
  }

  const fileName = moveUploadedFile(file, "uploads/recordings");

  const prisma = getPrismaClient();
  const transcript = await transcribeAudioFile(fileName);

  return prisma.messages.create({
    data: {
      message: fileName,
      transcript,
      sender: {
        connect: {
          id: from,
        },
      },
      reciever: {
        connect: {
          id: to,
        },
      },
      type: "audio",
    },
  });
};

export const createImageMessage = async ({ file, from, to }) => {
  if (!file) {
    throw new ApiError(400, "Image is required.");
  }

  const fileName = moveUploadedFile(file, "uploads/images");

  const prisma = getPrismaClient();

  return prisma.messages.create({
    data: {
      message: fileName,
      transcript: "",
      sender: {
        connect: {
          id: from,
        },
      },
      reciever: {
        connect: {
          id: to,
        },
      },
      type: "image",
    },
  });
};

export const removeMessage = async ({ messageId, userId }) => {
  const prisma = getPrismaClient();

  const message = await prisma.messages.findUnique({
    where: {
      id: messageId,
    },
  });

  if (!message) {
    throw new ApiError(404, "Message not found.");
  }

  if (message.senderId !== userId && message.recieverId !== userId) {
    throw new ApiError(403, "You cannot delete this message.");
  }

  await prisma.messages.delete({
    where: {
      id: messageId,
    },
  });

  return messageId;
};

export const searchConversationMessages = async ({
  userId,
  contactId,
  query,
  type,
}) => {
  const prisma = getPrismaClient();

  const searchableTypeFilter =
    type === "text" || type === "audio"
      ? {
          type,
        }
      : {
          type: {
            in: ["text", "audio"],
          },
        };

  const searchableContentFilter =
    type === "text"
      ? {
          message: {
            contains: query,
            mode: "insensitive",
          },
        }
      : type === "audio"
      ? {
          transcript: {
            contains: query,
            mode: "insensitive",
          },
        }
      : {
          OR: [
            {
              AND: [
                {
                  type: "text",
                },
                {
                  message: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
              ],
            },
            {
              AND: [
                {
                  type: "audio",
                },
                {
                  transcript: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
              ],
            },
          ],
        };

  return prisma.messages.findMany({
    where: {
      AND: [
        {
          OR: [
            {
              senderId: userId,
              recieverId: contactId,
            },
            {
              senderId: contactId,
              recieverId: userId,
            },
          ],
        },
        searchableTypeFilter,
        searchableContentFilter,
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
