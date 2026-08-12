import jwt from "jsonwebtoken";
import config from "../config";

export type Role = "ADMIN" | "USER";

export interface TokenPayload {
  id: string;
  email: string;
  role: Role;
}

export const createToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn as jwt.SignOptions["expiresIn"],
  });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, config.jwtSecret) as TokenPayload;
};
