import { PrismaClient } from "@prisma/client";

let prisma;

const getPrismaClient = () => {
  if (!prisma) {
    prisma = new PrismaClient();
  }

  return prisma;
};

export default getPrismaClient;
