import bcrypt from "bcrypt";
import status from "http-status";
import config from "../../config";
import AppError from "../../errors/AppError";
import prisma from "../../lib/prisma";
import { createToken } from "../../utils/jwt";
import { LoginInput, RegisterInput } from "./auth.validation";

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
};

export const register = async (input: RegisterInput) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      email: input.email.toLowerCase().trim(),
      isDeleted: false,
    },
  });

  if (existingUser) {
    throw new AppError("User already exists", status.CONFLICT);
  }

  const hashedPassword = await bcrypt.hash(
    input.password,
    config.bcryptSaltRounds
  );

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email.toLowerCase().trim(),
      password: hashedPassword,
    },
    select: userSelect,
  });

  return user;
};

export const login = async (input: LoginInput) => {
  console.log("[login] attempt:", input.email);

  const user = await prisma.user.findFirst({
    where: {
      email: input.email.toLowerCase().trim(),
      isDeleted: false,
    },
  });

  if (!user) {
    console.log("[login] user not found:", input.email);
    throw new AppError("Invalid email or password", status.UNAUTHORIZED);
  }

  console.log("[login] user found:", user.email, "role:", user.role);

  const isPasswordValid = await bcrypt.compare(input.password, user.password);
  console.log("[login] password valid:", isPasswordValid);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", status.UNAUTHORIZED);
  }

  const accessToken = createToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  console.log("[login] token issued for:", user.email, "role:", user.role);

  return {
    token: accessToken,
    accessToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};
